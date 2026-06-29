import { useState, useCallback } from 'react';
import { uploadSnaps, getSnapCount } from '@/lib/snap.api';
import { SNAP_CONSTANTS, SNAP_MESSAGES } from '@/constants/snap.constants';
import { useToast } from '@/components/ui/Toast';

export const useSnapUpload = (invitationId: string) => {
  const { addToast } = useToast();
  const [count, setCount] = useState(0);
  const [isClosed, setIsClosed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploaderName, setUploaderName] = useState('');

  // 카운트 조회
  const fetchCount = useCallback(async () => {
    const result = await getSnapCount(invitationId);
    if (result) {
      setCount(result.count);
      setIsClosed(result.isClosed);
    }
  }, [invitationId]);

  // 파일 검증
  const validateFiles = useCallback(
    (files: File[]): boolean => {
      // 1. 장 수 제한
      if (files.length > SNAP_CONSTANTS.MAX_UPLOAD_FILES) {
        addToast('warning', SNAP_MESSAGES.ERROR_FILE_COUNT);
        return false;
      }

      // 2. 마감 상태
      if (count >= SNAP_CONSTANTS.SNAP_SOFT_LIMIT) {
        addToast('warning', SNAP_MESSAGES.ERROR_UPLOAD_CLOSED);
        return false;
      }

      // 3. 파일 크기 및 타입
      for (const file of files) {
        if (file.size > SNAP_CONSTANTS.MAX_FILE_SIZE) {
          addToast('warning', SNAP_MESSAGES.ERROR_FILE_SIZE);
          return false;
        }

        if (
          !SNAP_CONSTANTS.ALLOWED_MIME_TYPES.includes(
            file.type as (typeof SNAP_CONSTANTS.ALLOWED_MIME_TYPES)[number],
          )
        ) {
          addToast('warning', '지원하지 않는 파일 형식이에요.');
          return false;
        }
      }

      return true;
    },
    [count, addToast],
  );

  // 파일 선택
  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      if (validateFiles(fileArray)) {
        setSelectedFiles(fileArray);
      }
    },
    [validateFiles],
  );

  // 파일 삭제 (미리보기에서)
  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // 업로드 실행
  const upload = useCallback(
    async (filesToUpload?: File[]) => {
      const files = filesToUpload || selectedFiles;
      if (files.length === 0) return;

      // 업로더 이름 검증
      if (!uploaderName.trim()) {
        addToast('warning', SNAP_MESSAGES.ERROR_UPLOADER_NAME);
        return;
      }

      if (!validateFiles(files)) return;

      setIsUploading(true);
      setUploadProgress({ current: 0, total: files.length });

      try {
        const result = await uploadSnaps(invitationId, files, uploaderName);

        if (!result) {
          addToast('error', SNAP_MESSAGES.ERROR_NETWORK);
          return;
        }

        // 마감 케이스
        if (result.isClosed) {
          setIsClosed(true);
          addToast('info', result.message || SNAP_MESSAGES.CLOSED);
          await fetchCount();
          return;
        }

        // 일부 실패 케이스
        if (result.failedCount && result.failedCount > 0) {
          addToast('warning', result.message || SNAP_MESSAGES.ERROR_PARTIAL);

          // 실패한 파일만 재시도
          if (result.failedFiles && result.failedFiles.length > 0) {
            const failedFileObjects = files.filter((file) =>
              result.failedFiles!.includes(file.name),
            );
            // 자동 재시도 로직 (1회)
            setTimeout(() => {
              upload(failedFileObjects);
            }, 2000);
          }
        } else {
          // 전체 성공
          addToast('success', SNAP_MESSAGES.COMPLETE);
        }

        // 카운트 갱신
        await fetchCount();
        setSelectedFiles([]);
      } catch (error) {
        addToast('error', SNAP_MESSAGES.ERROR_NETWORK);
      } finally {
        setIsUploading(false);
        setUploadProgress({ current: 0, total: 0 });
      }
    },
    [
      invitationId,
      selectedFiles,
      uploaderName,
      validateFiles,
      addToast,
      fetchCount,
    ],
  );

  return {
    count,
    isClosed,
    isUploading,
    uploadProgress,
    selectedFiles,
    uploaderName,
    setUploaderName,
    fetchCount,
    handleFileSelect,
    removeFile,
    upload,
  };
};
