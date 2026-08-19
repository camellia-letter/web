# Admin Approval 시스템 구현 계획

## 📋 목적

소규모 운영 환경에서 무분별한 회원가입을 방지하고, 관리자 승인 후에만 서비스를 사용할 수 있도록 하는 시스템 구축

---

## 🎯 요구사항

### 기능 요구사항
- [ ] 회원가입은 자유롭게 가능하되, 승인 대기 상태로 생성
- [ ] 승인 대기 중인 사용자는 로그인은 되지만 기능 사용 불가
- [ ] 관리자가 사용자를 승인/거부할 수 있는 UI 제공
- [ ] 승인된 사용자만 청첩장 생성 및 관리 가능

### 비기능 요구사항
- [ ] 기존 코드 구조 최소 변경 (WORK_RULES.md 준수)
- [ ] 화살표 함수 사용
- [ ] 타입 안정성 보장
- [ ] 에러 핸들링 철저

---

## 🏗️ 시스템 아키텍처

### 1. 데이터베이스 변경

#### User 테이블 수정 (API 서버)
```typescript
// packages/shared-types/src/user.types.ts
export enum UserStatus {
  PENDING = 'pending',     // 승인 대기
  ACTIVE = 'active',       // 승인됨
  REJECTED = 'rejected',   // 거부됨
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: string;
  providerAccountId: string;
  status: UserStatus;           // 추가
  approvedBy?: string;          // 승인한 관리자 ID
  approvedAt?: Date;            // 승인 시각
  rejectedBy?: string;          // 거부한 관리자 ID
  rejectedAt?: Date;            // 거부 시각
  rejectionReason?: string;     // 거부 사유
  createdAt: Date;
  updatedAt: Date;
}
```

#### 마이그레이션
```sql
-- API 서버 DB 마이그레이션
ALTER TABLE users
ADD COLUMN status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN approved_by VARCHAR(36),
ADD COLUMN approved_at TIMESTAMP,
ADD COLUMN rejected_by VARCHAR(36),
ADD COLUMN rejected_at TIMESTAMP,
ADD COLUMN rejection_reason TEXT;

-- 기존 사용자는 모두 active로 설정
UPDATE users SET status = 'active' WHERE status = 'pending';
```

### 2. API 엔드포인트 추가 (API 서버)

```typescript
// API 서버에 추가할 엔드포인트

// 1. 사용자 상태 확인
GET /api/auth/status
→ { userId, status: 'pending' | 'active' | 'rejected' }

// 2. 승인 대기 사용자 목록 (관리자용)
GET /api/admin/users/pending
→ { users: User[] }

// 3. 사용자 승인 (관리자용)
POST /api/admin/users/:userId/approve
→ { success: true, user: User }

// 4. 사용자 거부 (관리자용)
POST /api/admin/users/:userId/reject
Body: { reason: string }
→ { success: true, user: User }

// 5. 전체 사용자 목록 (관리자용, 페이징)
GET /api/admin/users?status=pending&page=1&limit=20
→ { users: User[], total: number, page: number }
```

### 3. 인증 미들웨어 수정 (API 서버)

```typescript
// API 서버의 인증 미들웨어 수정

// 기존: JWT 토큰 검증만
// 변경: JWT 검증 + 사용자 상태 확인

export const requireActiveUser = async (req, res, next) => {
  // 1. JWT 검증
  const userId = verifyJWT(req.headers.authorization);

  // 2. 사용자 상태 확인
  const user = await getUserById(userId);

  if (user.status !== 'active') {
    return res.status(403).json({
      code: 'USER_NOT_ACTIVE',
      message: '계정 승인이 필요합니다',
      status: user.status
    });
  }

  req.user = user;
  next();
};
```

### 4. Web 앱 변경사항

#### 4-1. 사용자 상태 타입 추가
```typescript
// web/src/types/auth.types.ts (새로 생성)
export type UserStatus = 'pending' | 'active' | 'rejected';

export interface UserStatusInfo {
  userId: string;
  status: UserStatus;
  rejectionReason?: string;
}
```

#### 4-2. 상태 확인 API 추가
```typescript
// web/src/lib/auth.api.ts (새로 생성)
import type { UserStatusInfo } from '@/types/auth.types';

export const getUserStatus = async (
  userId: string
): Promise<UserStatusInfo | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/status`,
      {
        headers: {
          'Authorization': `Bearer ${getJWT()}`,
        },
      }
    );

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    logError('Failed to fetch user status', error);
    return null;
  }
};
```

#### 4-3. Dashboard 페이지 수정
```typescript
// web/src/app/dashboard/page.tsx

const DashboardPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // 사용자 상태 확인 (새로 추가)
  const userStatus = await getUserStatus(session.user.id);

  if (userStatus?.status === 'pending') {
    return <PendingApprovalScreen />;
  }

  if (userStatus?.status === 'rejected') {
    return <RejectedScreen reason={userStatus.rejectionReason} />;
  }

  // 기존 Dashboard 로직
  // ...
};
```

#### 4-4. 승인 대기 화면 컴포넌트
```typescript
// web/src/components/auth/PendingApprovalScreen.tsx (새로 생성)
import { Container, Paper, Stack, Title, Text, ThemeIcon } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";

export const PendingApprovalScreen = () => {
  return (
    <Container size="sm" py={80}>
      <Paper withBorder radius="xl" p="xl" shadow="md">
        <Stack gap="lg" align="center">
          <ThemeIcon size={80} radius="xl" variant="light" color="orange">
            <IconClock size={40} />
          </ThemeIcon>

          <Stack gap="xs" align="center">
            <Title order={2} ta="center">
              계정 승인 대기 중
            </Title>
            <Text c="dimmed" ta="center" size="sm">
              관리자의 승인을 기다리고 있습니다
            </Text>
          </Stack>

          <Stack gap="xs" align="center">
            <Text size="sm" c="dimmed">
              • 보통 1-2일 정도 소요됩니다
            </Text>
            <Text size="sm" c="dimmed">
              • 승인되면 이메일로 알려드립니다
            </Text>
            <Text size="sm" c="dimmed">
              • 문의사항이 있으시면 contact@example.com으로 연락 주세요
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};
```

#### 4-5. 거부 화면 컴포넌트
```typescript
// web/src/components/auth/RejectedScreen.tsx (새로 생성)
import { Container, Paper, Stack, Title, Text, ThemeIcon, Anchor } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

export const RejectedScreen = ({ reason }: { reason?: string }) => {
  return (
    <Container size="sm" py={80}>
      <Paper withBorder radius="xl" p="xl" shadow="md">
        <Stack gap="lg" align="center">
          <ThemeIcon size={80} radius="xl" variant="light" color="red">
            <IconX size={40} />
          </ThemeIcon>

          <Stack gap="xs" align="center">
            <Title order={2} ta="center">
              계정 승인이 거부되었습니다
            </Title>
            {reason && (
              <Text c="dimmed" ta="center">
                사유: {reason}
              </Text>
            )}
          </Stack>

          <Text size="sm" c="dimmed" ta="center">
            문의사항이 있으시면{' '}
            <Anchor href="mailto:contact@example.com">
              contact@example.com
            </Anchor>
            으로 연락 주세요
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
};
```

#### 4-6. OAuth 회원가입 시 status 추가
```typescript
// web/src/auth.ts

// signIn callback 수정
async signIn({ user, account }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/oauth-signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: account?.provider,
        providerAccountId: account?.providerAccountId,
        email: user.email,
        name: user.name,
        image: user.image,
        status: 'pending',  // 추가: 기본값 pending
      }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    user.id = data.userId;
    user.sessionToken = data.sessionToken;
    user.status = data.status;  // 추가

    return true;
  } catch (error) {
    logError('OAuth sign-in error', error);
    return false;
  }
}
```

### 5. Admin 앱 추가 (관리자 UI)

#### 5-1. 사용자 관리 페이지
```typescript
// admin/src/app/users/page.tsx (새로 생성)

import { getUsersPaginated } from '@/lib/admin.api';
import { UsersTable } from '@/components/admin/UsersTable';

const UsersPage = async ({ searchParams }) => {
  const status = searchParams.status || 'pending';
  const page = parseInt(searchParams.page || '1');

  const { users, total } = await getUsersPaginated({ status, page, limit: 20 });

  return (
    <Container>
      <Stack gap="lg">
        <Title>사용자 관리</Title>

        <Tabs defaultValue="pending">
          <Tabs.List>
            <Tabs.Tab value="pending">대기 중</Tabs.Tab>
            <Tabs.Tab value="active">승인됨</Tabs.Tab>
            <Tabs.Tab value="rejected">거부됨</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={status}>
            <UsersTable users={users} total={total} page={page} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};
```

#### 5-2. 사용자 테이블 컴포넌트
```typescript
// admin/src/components/admin/UsersTable.tsx (새로 생성)

'use client';

import { useState } from 'react';
import { Table, Button, Modal, Textarea, Group } from '@mantine/core';
import { approveUser, rejectUser } from '@/lib/admin.api';

export const UsersTable = ({ users, total, page }) => {
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const handleApprove = async (userId: string) => {
    const result = await approveUser(userId);
    if (result.success) {
      window.location.reload();
    }
  };

  const handleReject = async (userId: string) => {
    const result = await rejectUser(userId, reason);
    if (result.success) {
      setRejecting(null);
      setReason('');
      window.location.reload();
    }
  };

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>이름</Table.Th>
            <Table.Th>이메일</Table.Th>
            <Table.Th>가입일</Table.Th>
            <Table.Th>작업</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>{user.name}</Table.Td>
              <Table.Td>{user.email}</Table.Td>
              <Table.Td>{new Date(user.createdAt).toLocaleDateString()}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button
                    size="xs"
                    color="green"
                    onClick={() => handleApprove(user.id)}
                  >
                    승인
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    variant="outline"
                    onClick={() => setRejecting(user.id)}
                  >
                    거부
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={rejecting !== null}
        onClose={() => setRejecting(null)}
        title="사용자 거부"
      >
        <Stack gap="md">
          <Textarea
            label="거부 사유"
            placeholder="거부 사유를 입력하세요"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setRejecting(null)}>
              취소
            </Button>
            <Button
              color="red"
              onClick={() => rejecting && handleReject(rejecting)}
            >
              거부
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
```

#### 5-3. Admin API 함수
```typescript
// admin/src/lib/admin.api.ts (새로 생성)

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUsersPaginated = async ({
  status,
  page,
  limit,
}: {
  status: string;
  page: number;
  limit: number;
}) => {
  const res = await fetch(
    `${API_URL}/api/admin/users?status=${status}&page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${getAdminJWT()}`,
      },
    }
  );

  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const approveUser = async (userId: string) => {
  const res = await fetch(
    `${API_URL}/api/admin/users/${userId}/approve`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAdminJWT()}`,
      },
    }
  );

  if (!res.ok) throw new Error('Failed to approve user');
  return res.json();
};

export const rejectUser = async (userId: string, reason: string) => {
  const res = await fetch(
    `${API_URL}/api/admin/users/${userId}/reject`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAdminJWT()}`,
      },
      body: JSON.stringify({ reason }),
    }
  );

  if (!res.ok) throw new Error('Failed to reject user');
  return res.json();
};
```

---

## 📝 구현 순서

### Phase 1: API 서버 (우선)
1. [ ] shared-types에 UserStatus 타입 추가
2. [ ] DB 마이그레이션 실행
3. [ ] API 엔드포인트 구현
   - [ ] GET /api/auth/status
   - [ ] GET /api/admin/users/pending
   - [ ] POST /api/admin/users/:id/approve
   - [ ] POST /api/admin/users/:id/reject
   - [ ] GET /api/admin/users (페이징)
4. [ ] 인증 미들웨어 수정 (requireActiveUser)
5. [ ] OAuth 회원가입 로직 수정 (status: 'pending' 기본값)
6. [ ] 테스트

### Phase 2: Web 앱
1. [ ] 타입 정의 추가 (auth.types.ts)
2. [ ] API 함수 추가 (auth.api.ts)
3. [ ] 승인 대기 화면 컴포넌트 (PendingApprovalScreen)
4. [ ] 거부 화면 컴포넌트 (RejectedScreen)
5. [ ] Dashboard 페이지 수정 (상태 체크 로직)
6. [ ] auth.ts 수정 (status 저장)
7. [ ] 테스트

### Phase 3: Admin 앱
1. [ ] 사용자 관리 페이지 (users/page.tsx)
2. [ ] UsersTable 컴포넌트
3. [ ] Admin API 함수 (admin.api.ts)
4. [ ] 네비게이션에 "사용자 관리" 메뉴 추가
5. [ ] 테스트

### Phase 4: 테스트 & 배포
1. [ ] E2E 테스트 시나리오
   - [ ] 회원가입 → pending 상태 확인
   - [ ] pending 사용자 로그인 → 대기 화면 표시
   - [ ] 관리자 승인 → active 전환
   - [ ] active 사용자 → 정상 사용
2. [ ] 프로덕션 배포
3. [ ] 기존 사용자 마이그레이션 (모두 active로 설정)

---

## ⚠️ 주의사항

### 1. 기존 사용자 처리
```sql
-- 배포 전 기존 사용자는 모두 active로 설정
UPDATE users SET status = 'active' WHERE status IS NULL OR status = 'pending';
```

### 2. 관리자 권한
- Admin 앱의 `/users` 페이지는 관리자만 접근 가능해야 함
- JWT에 role 필드 추가 검토 필요

### 3. 에러 처리
- API 서버 다운 시: 기본적으로 로그인 허용 (안전 장치)
- 타임아웃 처리: 5초 이내 응답 없으면 에러

### 4. WORK_RULES.md 준수
- [ ] 모든 함수는 화살표 함수
- [ ] const 사용 (재할당 시에만 let)
- [ ] export const 사용 (라우팅 페이지 제외)
- [ ] any 사용 금지
- [ ] console.log 금지 (logError 사용)

---

## 📊 예상 소요 시간

| Phase | 예상 시간 |
|-------|----------|
| Phase 1 (API) | 2시간 |
| Phase 2 (Web) | 1시간 |
| Phase 3 (Admin) | 1시간 |
| Phase 4 (테스트) | 30분 |
| **총계** | **4.5시간** |

---

## 🔄 향후 개선사항 (Optional)

1. **이메일 알림**
   - 승인/거부 시 사용자에게 이메일 발송
   - 새 가입 시 관리자에게 이메일 알림

2. **슬랙/디스코드 웹훅**
   - 새 가입 시 알림
   - 승인/거부 로그

3. **승인 요청 메모**
   - 사용자가 가입 시 "사용 목적" 입력
   - 관리자가 참고

4. **자동 승인 규칙**
   - 특정 이메일 도메인 자동 승인
   - 예: @company.com → 자동 active

5. **통계 대시보드**
   - 일별 가입 추이
   - 승인율 통계

---

## ✅ 완료 체크리스트

구현 완료 시 아래 항목을 체크하세요:

- [ ] API 엔드포인트 모두 구현 및 테스트 완료
- [ ] Web 앱 화면 모두 구현 및 확인 완료
- [ ] Admin 앱 사용자 관리 UI 작동 확인
- [ ] 기존 사용자 마이그레이션 완료
- [ ] E2E 테스트 통과
- [ ] WORK_RULES.md 준수 확인
- [ ] typecheck, lint, test 모두 통과
- [ ] 프로덕션 배포 완료

---

## 📞 문의

구현 중 질문사항이나 변경사항이 있으면 언제든 말씀해주세요.
