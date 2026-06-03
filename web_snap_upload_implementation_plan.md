# Web 스냅 업로드 기능 구현 계획

[이 계획서는 작업 진행 상황을 추적하기 위해 작성되었습니다]

## 구현 진행 상황

- [ ] Phase 1: 상수 및 타입 정의
- [ ] Phase 2: API 함수 구현
- [ ] Phase 3: 업로드 훅 구현
- [ ] Phase 4-1: SnapImagePreview 컴포넌트
- [ ] Phase 4-2: SnapUploadProgress 컴포넌트
- [ ] Phase 4-3: SnapUploadModal 컴포넌트
- [ ] Phase 4-4: SnapUploadBlock 컴포넌트
- [ ] Phase 5: BlockRenderer 통합
- [ ] Phase 6: TypeScript 검증
- [ ] Phase 7: ESLint 검증

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
