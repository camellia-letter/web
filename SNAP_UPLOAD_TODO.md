# 스냅 업로드 기능 - 현황

## ✅ 구현 완료

### Web (`web`)

- 상수 및 타입 정의 (`src/constants/snap.constants.ts`)
- API 함수 (`getSnapCount`, `uploadSnaps` — `src/lib/snap.api.ts`)
- `useSnapUpload` 커스텀 훅 (에러 코드별 메시지 처리 포함)
- UI 컴포넌트 (`SnapImagePreview`, `SnapUploadProgress`, `SnapUploadModal`)
- `BlockRenderer` 통합

### Types (`types`)

- `SNAP_UPLOAD` BlockType 및 `SnapUploadBlockData` 인터페이스

### API (`api`)

- `SnapImage` 모델 (`prisma/schema.prisma`)
- `SnapsModule` / `SnapsController` / `SnapsService` (`src/snaps/`)
  - `GET /api/snaps/count?invitationId=`
  - `POST /api/snaps/upload?invitationId=`
- 청첩장 `blocks`에 `SNAP_UPLOAD`가 있을 때만 동작 (기능 활성화 판정)
- 전체 1,000장 soft limit
- 디바이스(IP)당 20장 제한 — `SnapImage.uploadedBy`
- 파일 검증: 5MB / 10장 / MIME 타입 화이트리스트 (multer `limits`에서 1차 차단)
- 업로더 이름: 50자 제한, 스토리지 경로용으로 정규화 (경로 주입 방지)
- R2 업로드 + DB 메타데이터 저장
- 단위 테스트 (`src/snaps/__tests__/snaps.service.spec.ts`)

### Admin (`admin`)

- `SNAP_UPLOAD` 블록 타입 (`BlockSelector`, `AddBlockMenu`)
- `SnapUploadBlockEditor` (`src/components/BlockEditor/editors/`)
- `BlockEditPanel` 연동

---

## 🚧 남은 작업

### 배포 전 필수

- [ ] **`TRUST_PROXY` 환경변수 설정** — 리버스 프록시 뒤에 배포하는 경우 필수.
      설정하지 않으면 모든 하객이 프록시 IP를 공유해 스냅 업로드가 20장에서 전부 막힌다.
      (`api/.env.example`의 Trust Proxy 항목 참고)
- [ ] `uploadedBy` 컬럼 마이그레이션 적용
      (`api/prisma/migrations/20260817000000_add_uploaded_by_to_snap_image/`)

### 미구현 (선택)

- [ ] Admin 스냅 갤러리 뷰어 — 업로드된 스냅을 관리자가 조회하는 페이지
- [ ] 업로드 부분 실패 시 롤백 — 현재는 중간에 실패하면 이미 올라간 파일이
      R2와 DB에 남은 채 `SNAP_UPLOAD_FAILED`를 반환한다
- [ ] 비ASCII 파일명 대응 — S3 metadata 헤더는 ASCII만 허용하므로
      한글 파일명 업로드 시 실패할 수 있다 (`storage.service.ts`의 `metadata.originalName`)

### 테스트

- [ ] 모바일 실기기 테스트
  - [ ] iOS Safari — 카메라 촬영 / 앨범 선택 / HEIC 업로드
  - [ ] Android Chrome — 카메라 촬영 / 앨범 선택
- [ ] 통합 시나리오
  - [ ] 20장 초과 시 디바이스 제한 메시지 노출
  - [ ] 1,000장 도달 시 마감 처리
  - [ ] 5MB 초과 / 미지원 형식 업로드 시 메시지

---

## 📝 참고 문서

- Web 구현 계획: `web/web_snap_upload_implementation_plan.md`
- API 구현 계획: `api/api_snap_upload_plan.md`

---

**마지막 업데이트:** 2026-08-17
