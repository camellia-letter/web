# 스냅 업로드 기능 - 잔여 작업사항

## 📋 현재 완료 상태

### ✅ 완료된 작업

#### 1. Web (Frontend) - 100% 완료
- [x] 상수 및 타입 정의
- [x] API 함수 구현 (getSnapCount, uploadSnaps)
- [x] useSnapUpload 커스텀 훅
- [x] UI 컴포넌트 (SnapImagePreview, SnapUploadProgress, SnapUploadModal, SnapUploadBlock)
- [x] BlockRenderer 통합
- [x] TypeScript 타입 검증
- [x] GitHub 푸시 완료

#### 2. Types Package - 100% 완료
- [x] SNAP_UPLOAD BlockType 추가
- [x] SnapUploadBlockData 인터페이스 정의
- [x] 버전 업데이트 (1.0.4 → 1.1.0)
- [x] GitHub 푸시 완료
- [x] NPM 패키지 배포 가능 상태

---

## 🚧 남은 작업

### 1. API 서버 작업 (필수) - 0% 완료

#### Phase 1: 데이터베이스 스키마

**파일 경로:** `/api/prisma/schema.prisma`

```prisma
model Snap {
  id           String   @id @default(cuid())
  invitationId String
  invitation   Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)

  imageUrl     String
  uploadedBy   String?  // 디바이스 식별자 (IP 또는 fingerprint)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([invitationId])
  @@index([uploadedBy])
  @@map("snaps")
}

// Invitation 모델에 추가
model Invitation {
  // ... 기존 필드들
  snaps        Snap[]
}
```

**마이그레이션:**
```bash
cd /api
npx prisma migrate dev --name add_snap_model
```

#### Phase 2: API 엔드포인트 구현

**파일 1:** `/api/src/snaps/snaps.module.ts` (신규)
```typescript
import { Module } from '@nestjs/common';
import { SnapsController } from './snaps.controller';
import { SnapsService } from './snaps.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [SnapsController],
  providers: [SnapsService],
})
export class SnapsModule {}
```

**파일 2:** `/api/src/snaps/snaps.controller.ts` (신규)
```typescript
import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SnapsService } from './snaps.service';
import { Request } from 'express';

@Controller('snaps')
export class SnapsController {
  constructor(private readonly snapsService: SnapsService) {}

  @Get('count')
  async getCount(
    @Query('invitationId') invitationId: string,
    @Req() req: Request,
  ) {
    const deviceId = this.getDeviceId(req);
    return this.snapsService.getCount(invitationId, deviceId);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10)) // 최대 10개
  async upload(
    @Query('invitationId') invitationId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const deviceId = this.getDeviceId(req);
    return this.snapsService.upload(invitationId, files, deviceId);
  }

  private getDeviceId(req: Request): string {
    // IP 주소 기반 디바이스 식별
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
}
```

**파일 3:** `/api/src/snaps/snaps.service.ts` (신규)
```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

const SNAP_SOFT_LIMIT = 1000;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_UPLOADS_PER_DEVICE = 20;
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

@Injectable()
export class SnapsService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async getCount(invitationId: string, deviceId: string) {
    const totalCount = await this.prisma.snap.count({
      where: { invitationId },
    });

    const deviceUploadCount = await this.prisma.snap.count({
      where: { invitationId, uploadedBy: deviceId },
    });

    return {
      count: totalCount,
      isClosed: totalCount >= SNAP_SOFT_LIMIT,
      deviceUploadCount,
    };
  }

  async upload(
    invitationId: string,
    files: Express.Multer.File[],
    deviceId: string,
  ) {
    // 1. 초대장 존재 확인
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
    });
    if (!invitation) {
      throw new BadRequestException('존재하지 않는 초대장입니다.');
    }

    // 2. 전체 업로드 수 확인
    const currentCount = await this.prisma.snap.count({
      where: { invitationId },
    });
    if (currentCount >= SNAP_SOFT_LIMIT) {
      return {
        success: false,
        isClosed: true,
        totalCount: currentCount,
        message: '정말 많은 순간들이 모였어요 ✨ 스냅 업로드가 마감되었어요.',
      };
    }

    // 3. 디바이스별 업로드 수 확인
    const deviceUploadCount = await this.prisma.snap.count({
      where: { invitationId, uploadedBy: deviceId },
    });
    if (deviceUploadCount >= MAX_UPLOADS_PER_DEVICE) {
      throw new BadRequestException(
        `디바이스당 최대 ${MAX_UPLOADS_PER_DEVICE}장까지 업로드할 수 있습니다.`,
      );
    }

    // 4. 파일 검증 및 업로드
    const uploadResults = [];
    const failedFiles = [];

    for (const file of files) {
      try {
        // 파일 크기 검증
        if (file.size > MAX_FILE_SIZE) {
          failedFiles.push(file.originalname);
          continue;
        }

        // MIME 타입 검증
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          failedFiles.push(file.originalname);
          continue;
        }

        // 디바이스 제한 확인 (실시간)
        const currentDeviceCount = await this.prisma.snap.count({
          where: { invitationId, uploadedBy: deviceId },
        });
        if (currentDeviceCount >= MAX_UPLOADS_PER_DEVICE) {
          break; // 더 이상 업로드 불가
        }

        // 스토리지 업로드
        const result = await this.storage.uploadImage(
          file.buffer,
          'snaps',
          file.originalname,
        );

        // DB 저장
        await this.prisma.snap.create({
          data: {
            invitationId,
            imageUrl: result.url,
            uploadedBy: deviceId,
          },
        });

        uploadResults.push(result);
      } catch (error) {
        failedFiles.push(file.originalname);
      }
    }

    // 5. 최종 카운트 조회
    const finalCount = await this.prisma.snap.count({
      where: { invitationId },
    });

    return {
      success: true,
      uploadedCount: uploadResults.length,
      failedCount: failedFiles.length,
      failedFiles: failedFiles.length > 0 ? failedFiles : undefined,
      totalCount: finalCount,
      isClosed: finalCount >= SNAP_SOFT_LIMIT,
      message:
        failedFiles.length > 0
          ? '일부 사진을 업로드하지 못했어요.'
          : undefined,
    };
  }
}
```

**파일 4:** `/api/src/app.module.ts` (수정)
```typescript
// imports에 추가
import { SnapsModule } from './snaps/snaps.module';

@Module({
  imports: [
    // ... 기존 imports
    SnapsModule, // 추가
  ],
})
```

#### Phase 3: 테스트
- [ ] `GET /api/snaps/count` 엔드포인트 테스트
- [ ] `POST /api/snaps/upload` 엔드포인트 테스트
- [ ] Rate limiting 동작 확인 (디바이스당 20장)
- [ ] 1,000장 soft limit 동작 확인
- [ ] 파일 크기 제한 테스트 (5MB)
- [ ] MIME 타입 검증 테스트

---

### 2. Admin 작업 (필수) - 0% 완료

#### Phase 1: 블록 타입 추가

**파일 1:** `/admin/src/components/BlockEditor/BlockEditorModal.tsx` (수정)
```typescript
// BLOCK_TYPE_OPTIONS에 추가
{
  value: 'SNAP_UPLOAD',
  label: '스냅 업로드',
  description: '하객들이 사진을 업로드할 수 있습니다',
}
```

#### Phase 2: 스냅 업로드 블록 에디터

**파일 2:** `/admin/src/components/BlockEditor/editors/SnapUploadBlockEditor.tsx` (신규)
```typescript
import { Stack, TextInput, Textarea } from '@mantine/core';
import type { SnapUploadBlockData } from '@camellia-letter/shared-types';

interface SnapUploadBlockEditorProps {
  data: SnapUploadBlockData;
  onChange: (data: SnapUploadBlockData) => void;
}

export const SnapUploadBlockEditor = ({
  data,
  onChange,
}: SnapUploadBlockEditorProps) => {
  return (
    <Stack gap="md">
      <TextInput
        label="섹션 타이틀"
        placeholder="스냅 업로드"
        value={data.title || ''}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
      />
      <Textarea
        label="안내 문구"
        placeholder="소중한 순간을 공유해 주세요"
        value={data.description || ''}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
        rows={3}
      />
    </Stack>
  );
};
```

**파일 3:** `/admin/src/components/BlockEditor/BlockEditor.tsx` (수정)
```typescript
// imports에 추가
import { SnapUploadBlockEditor } from './editors/SnapUploadBlockEditor';

// renderEditor 함수에 케이스 추가
case 'SNAP_UPLOAD':
  return (
    <SnapUploadBlockEditor
      data={block.data}
      onChange={(data) => handleBlockUpdate(block.id, data)}
    />
  );
```

#### Phase 3: 스냅 갤러리 뷰어 (선택)

Admin에서 업로드된 스냅들을 볼 수 있는 뷰어 페이지 (선택 사항)

**파일:** `/admin/src/pages/SnapGalleryPage.tsx` (신규)

---

### 3. 테스트 및 검증 (필수) - 0% 완료

#### 통합 테스트 시나리오

1. **정상 업로드 플로우**
   - [ ] Admin에서 SNAP_UPLOAD 블록 추가
   - [ ] Web에서 청첩장 확인 (스냅 블록 표시)
   - [ ] 사진 선택 후 업로드
   - [ ] 카운트 증가 확인
   - [ ] 토스트 메시지 표시 확인

2. **파일 검증**
   - [ ] 5MB 초과 파일 업로드 → 실패 메시지
   - [ ] 11장 선택 → 경고 메시지
   - [ ] 지원하지 않는 파일 형식 → 실패 메시지

3. **Rate Limiting**
   - [ ] 20장 업로드 후 추가 업로드 시도 → 차단
   - [ ] 다른 디바이스에서 업로드 → 정상 동작

4. **Soft Limit**
   - [ ] 999장 상태에서 10장 업로드 → 1,009장까지 허용
   - [ ] 1,000장 이상 상태에서 업로드 시도 → 마감 메시지

5. **에러 처리**
   - [ ] 네트워크 오류 시 에러 메시지
   - [ ] 일부 파일 실패 시 자동 재시도
   - [ ] 서버 오류 시 적절한 메시지

#### 모바일 테스트

- [ ] iOS Safari - 카메라 촬영
- [ ] iOS Safari - 앨범 선택
- [ ] iOS Safari - HEIC 파일 업로드
- [ ] Android Chrome - 카메라 촬영
- [ ] Android Chrome - 앨범 선택

---

## 📅 작업 순서 권장

1. **API 서버 작업** (우선순위: 높음)
   - Phase 1: 데이터베이스 스키마 추가
   - Phase 2: API 엔드포인트 구현
   - Phase 3: 로컬 테스트

2. **Admin 작업** (우선순위: 중간)
   - Phase 1: 블록 타입 추가
   - Phase 2: 블록 에디터 구현
   - Phase 3: 스냅 갤러리 뷰어 (선택)

3. **통합 테스트** (우선순위: 높음)
   - 전체 플로우 테스트
   - 모바일 환경 테스트
   - 에지 케이스 검증

4. **배포**
   - API 서버 배포
   - Admin 배포
   - Web 배포 (이미 완료)
   - 프로덕션 테스트

---

## 📝 참고 문서

- Web 구현 계획: `/web/web_snap_upload_implementation_plan.md`
- API 구현 계획: `/api/api_snap_upload_plan.md` (기존)
- Web 기획서: `/web/web_snap_upload_plan.md`
- 질의응답: `/web/web_snap_upload_qa.md`, `/web/web_snap_upload_qa2.md`

---

## 🔍 체크리스트

### API 서버
- [ ] Prisma 스키마 추가
- [ ] 마이그레이션 실행
- [ ] SnapsModule 생성
- [ ] SnapsController 구현
- [ ] SnapsService 구현
- [ ] AppModule에 등록
- [ ] 엔드포인트 테스트

### Admin
- [ ] BlockEditor에 SNAP_UPLOAD 타입 추가
- [ ] SnapUploadBlockEditor 컴포넌트 구현
- [ ] BlockEditor에 에디터 연동
- [ ] 블록 추가/수정 테스트

### 통합 테스트
- [ ] 정상 업로드 플로우
- [ ] 파일 검증
- [ ] Rate limiting
- [ ] Soft limit
- [ ] 에러 처리
- [ ] 모바일 환경 테스트

### 배포
- [ ] API 서버 배포
- [ ] Admin 배포
- [ ] 프로덕션 테스트
- [ ] 모니터링 설정

---

**마지막 업데이트:** 2026-06-03
**작성자:** Claude Sonnet 4.5
