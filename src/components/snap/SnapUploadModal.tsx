'use client';

import { useRef } from 'react';
import { Modal, Stack, Button, Text } from '@mantine/core';
import { useTheme } from '@/contexts/ThemeContext';
import { useSnapUpload } from '@/hooks/useSnapUpload';
import { SnapImagePreview } from './SnapImagePreview';
import { SnapUploadProgress } from './SnapUploadProgress';

interface SnapUploadModalProps {
  opened: boolean;
  onClose: () => void;
  invitationId: string;
}

export const SnapUploadModal = ({
  opened,
  onClose,
  invitationId,
}: SnapUploadModalProps) => {
  const { colors, fontFamily } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isUploading,
    uploadProgress,
    selectedFiles,
    handleFileSelect,
    removeFile,
    upload,
  } = useSnapUpload(invitationId);

  const handleUploadClick = async () => {
    await upload();
    // 성공 시 모달 자동 닫힘
    if (!isUploading && selectedFiles.length === 0) {
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={isUploading ? undefined : onClose} // 업로드 중 닫기 방지
      title="사진 올리기"
      centered
      size="lg"
      closeOnClickOutside={!isUploading} // 업로드 중 외부 클릭 방지
      withCloseButton={!isUploading}
      styles={{
        content: { backgroundColor: colors.background },
        header: { backgroundColor: colors.background },
        title: { color: colors.text, fontFamily, fontWeight: 600 },
        close: { color: colors.text },
      }}
    >
      <Stack gap="md">
        {/* 파일 선택 input (숨김) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={isUploading}
        />

        {/* 미리보기 */}
        {selectedFiles.length > 0 && (
          <SnapImagePreview
            files={selectedFiles}
            onRemove={removeFile}
            disabled={isUploading}
          />
        )}

        {/* 업로드 중 메시지 */}
        {isUploading && (
          <Text size="sm" ta="center" style={{ color: colors.text, fontFamily }}>
            사진을 업로드하고 있어요.
            <br />
            잠시만 기다려 주세요.
          </Text>
        )}

        {/* 진행률 */}
        {isUploading && (
          <SnapUploadProgress
            current={uploadProgress.current}
            total={uploadProgress.total}
          />
        )}

        {/* 버튼 영역 */}
        <Stack gap="sm">
          {selectedFiles.length === 0 ? (
            <Button
              size="lg"
              fullWidth
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              style={{ backgroundColor: colors.primary }}
            >
              사진 선택
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                fullWidth
                onClick={handleUploadClick}
                disabled={isUploading}
                style={{ backgroundColor: colors.primary }}
              >
                {selectedFiles.length}장 업로드
              </Button>
              <Button
                size="md"
                fullWidth
                variant="subtle"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                사진 더 추가
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};
