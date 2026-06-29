export const SNAP_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_UPLOAD_FILES: 10, // 한 번에 10장
  SNAP_SOFT_LIMIT: 1000, // 전체 1000장
  MAX_UPLOADS_PER_DEVICE: 20, // 디바이스당 20장
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ],
} as const;

export const SNAP_MESSAGES = {
  UPLOADING: '사진을 업로드하고 있어요.\n잠시만 기다려 주세요.',
  COMPLETE: '소중한 순간을 보내주셔서 감사합니다.',
  CLOSED:
    '정말 많은 순간들이 모였어요 ✨\n스냅 업로드가 마감되었어요.\n함께해주셔서 감사합니다.',
  ERROR_FILE_SIZE: '5MB 이하의 이미지만 업로드할 수 있어요.',
  ERROR_FILE_COUNT: '한 번에 최대 10장까지 업로드할 수 있어요.',
  ERROR_UPLOAD_CLOSED:
    '스냅 업로드가 마감되었어요.\n함께해주셔서 감사합니다.',
  ERROR_NETWORK: '사진 업로드에 실패했어요.\n잠시 후 다시 시도해 주세요.',
  ERROR_PARTIAL: '일부 사진을 업로드하지 못했어요.',
  ERROR_UPLOADER_NAME: '이름을 입력해 주세요.',
} as const;

export interface SnapUploadResponse {
  success: boolean;
  uploadedCount?: number;
  failedCount?: number;
  failedFiles?: string[];
  totalCount?: number;
  isClosed?: boolean;
  message?: string;
  uploaderName?: string;
}

export interface SnapCountResponse {
  count: number;
  isClosed: boolean;
  deviceUploadCount?: number; // 이 디바이스가 올린 수
}
