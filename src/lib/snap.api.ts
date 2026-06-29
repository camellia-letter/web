import type {
  SnapCountResponse,
  SnapUploadResponse,
} from '@/constants/snap.constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';

/**
 * 스냅 업로드 수 조회
 */
export const getSnapCount = async (
  invitationId: string,
): Promise<SnapCountResponse | null> => {
  try {
    const res = await fetch(
      `${API_URL}/api/snaps/count?invitationId=${invitationId}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch snap count:', error);
    return null;
  }
};

/**
 * 스냅 이미지 업로드
 */
export const uploadSnaps = async (
  invitationId: string,
  files: File[],
  uploaderName: string,
): Promise<SnapUploadResponse | null> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('uploaderName', uploaderName);

    const res = await fetch(
      `${API_URL}/api/snaps/upload?invitationId=${invitationId}`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return errorData || { success: false, message: 'Upload failed' };
    }

    return res.json();
  } catch (error) {
    console.error('Failed to upload snaps:', error);
    return { success: false, message: 'Network error' };
  }
};
