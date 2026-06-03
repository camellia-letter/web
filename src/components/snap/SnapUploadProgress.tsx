'use client';

import { Stack, Text, Progress } from '@mantine/core';
import { useTheme } from '@/contexts/ThemeContext';

interface SnapUploadProgressProps {
  current: number;
  total: number;
}

export const SnapUploadProgress = ({
  current,
  total,
}: SnapUploadProgressProps) => {
  const { colors, fontFamily } = useTheme();
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <Stack gap="xs">
      <Text
        size="sm"
        ta="center"
        style={{ color: colors.text, fontFamily }}
      >
        {current} / {total} 업로드 중
      </Text>
      <Progress
        value={percentage}
        color={colors.primary}
        size="md"
        radius="xl"
        animated
      />
    </Stack>
  );
};
