# Web 스냅 업로드 기능 구현 계획

[이 계획서는 작업 진행 상황을 추적하기 위해 작성되었습니다]

## 구현 진행 상황

- [x] Phase 1: 상수 및 타입 정의
- [x] Phase 2: API 함수 구현
- [x] Phase 3: 업로드 훅 구현
- [x] Phase 4-1: SnapImagePreview 컴포넌트
- [x] Phase 4-2: SnapUploadProgress 컴포넌트
- [x] Phase 4-3: SnapUploadModal 컴포넌트
- [x] Phase 4-4: SnapUploadBlock 컴포넌트
- [x] Phase 5: BlockRenderer 통합
- [x] Phase 6: TypeScript 검증
- [x] Phase 7: 타입 오류 수정

## 작업 완료 내역

### 1. 구현된 파일 목록

#### 신규 생성 파일 (7개)
- `src/constants/snap.constants.ts` - 상수 및 타입 정의
- `src/lib/snap.api.ts` - API 함수 (getSnapCount, uploadSnaps)
- `src/hooks/useSnapUpload.ts` - 업로드 훅 (검증, 상태관리, 자동재시도)
- `src/components/snap/SnapImagePreview.tsx` - 이미지 미리보기 그리드
- `src/components/snap/SnapUploadProgress.tsx` - 업로드 진행률 표시
- `src/components/snap/SnapUploadModal.tsx` - 업로드 모달
- `src/components/blocks/SnapUploadBlock.tsx` - 청첩장 블록 컴포넌트

#### 수정된 파일 (3개)
- `src/components/BlockRenderer.tsx` - SnapUploadBlock 통합
- `/types/src/invitation.ts` - SNAP_UPLOAD 타입 추가
- 각 컴포넌트 - TypeScript 타입 오류 수정

### 2. 커밋 내역

1. `docs: Add snap upload implementation plan` - 구현 계획 추가
2. `Feature(snap): 스냅 업로드 상수 및 타입 추가` - 상수 정의
3. `Feature(snap): 스냅 업로드 API 함수 추가` - API 함수
4. `Feature(snap): 스냅 업로드 커스텀 훅 추가` - useSnapUpload
5. `Feature(snap): 이미지 미리보기 및 진행률 컴포넌트 추가`
6. `Feature(snap): 업로드 모달 컴포넌트 추가`
7. `Feature(snap): 청첩장 스냅 업로드 블록 추가`
8. `Feature(snap): BlockRenderer에 스냅 업로드 블록 통합`

### 3. 검증 완료

- [x] TypeScript 컴파일 오류 없음
- [x] types 패키지 빌드 성공
- [x] 모든 타입 정의 완료

### 4. 패키지 버전 관리

**types 패키지 (shared-types):**
- 버전: 1.0.4 → 1.1.0
- 저장소: https://github.com/camellia-letter/shared-types.git
- 커밋:
  - `Feature(types): SNAP_UPLOAD 블록 타입 추가`
  - `Chore(release): 버전 1.1.0으로 업데이트`
- 푸시 완료 ✓

**web 패키지:**
- shared-types 의존성: ^1.0.4 → ^1.1.0
- 커밋: `Chore(deps): shared-types 버전 1.1.0으로 업데이트`

---

## 1. 개요

하객이 모바일 청첩장에서 직접 사진을 촬영하거나 앨범에서 선택하여 업로드할 수 있는 스냅 업로드 기능을 구현합니다.

**핵심 요구사항:**
- 청첩장 내 섹션에서 팝업 형태로 업로드
- 이미지 미리보기 (그리드, 썸네일, 삭제 버튼)
- 1장당 최대 5MB, 한 번에 최대 10장
- 전체 1,000장 soft limit (999장에서 10장 업로드 가능 → 1,009장까지)
- 디바이스당 최대 20장 제한 (Rate limiting)
- 업로드 진행률 표시 (7/10 업로드 중)
- 일부 실패 시 자동 재시도
- 업로드 완료 후 팝업 자동 닫힘 + 토스트 표시

## 2. 구현 파일 목록

### 신규 생성 파일
- `src/constants/snap.constants.ts` - 상수 정의
- `src/lib/snap.api.ts` - API 함수
- `src/hooks/useSnapUpload.ts` - 업로드 훅
- `src/components/snap/SnapImagePreview.tsx` - 미리보기 그리드
- `src/components/snap/SnapUploadProgress.tsx` - 진행률 표시
- `src/components/snap/SnapUploadModal.tsx` - 업로드 모달
- `src/components/blocks/SnapUploadBlock.tsx` - 청첩장 섹션

### 수정할 파일
- `src/components/BlockRenderer.tsx` - SnapUploadBlock 추가

## 3. 상세 구현 계획

상세 내용은 `/Users/eonjeongcha/.claude/plans/synchronous-waddling-tarjan.md` 참고
