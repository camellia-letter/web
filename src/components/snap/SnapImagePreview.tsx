'use client';

import { useMemo, useEffect } from 'react';
import { SimpleGrid, Box, CloseButton, Image } from '@mantine/core';
import { useTheme } from '@/contexts/ThemeContext';

interface SnapImagePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export const SnapImagePreview = ({
  files,
  onRemove,
  disabled = false,
}: SnapImagePreviewProps) => {
  const { borderRadius } = useTheme();

  // 파일을 미리보기 URL로 변환
  const previewUrls = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file));
  }, [files]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <SimpleGrid cols={3} spacing="sm">
      {previewUrls.map((url, index) => (
        <Box key={index} pos="relative">
          <Image
            src={url}
            alt={`Preview ${index + 1}`}
            radius={borderRadius}
            style={{
              width: '100%',
              aspectRatio: '1',
              objectFit: 'cover',
            }}
          />
          {!disabled && (
            <CloseButton
              size="sm"
              pos="absolute"
              top={4}
              right={4}
              onClick={() => onRemove(index)}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
              }}
            />
          )}
        </Box>
      ))}
    </SimpleGrid>
  );
};
