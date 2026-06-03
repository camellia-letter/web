'use client';

import { useEffect } from 'react';
import { Stack, Text, Button, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTheme } from '@/contexts/ThemeContext';
import { useSnapUpload } from '@/hooks/useSnapUpload';
import { SnapUploadModal } from '../snap/SnapUploadModal';

interface SnapUploadBlockProps {
  data: {
    invitationId: string;
  };
}

export const SnapUploadBlock = ({ data }: SnapUploadBlockProps) => {
  const { colors, fontFamily } = useTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const { count, isClosed, fetchCount } = useSnapUpload(data.invitationId);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return (
    <Paper p="xl" style={{ backgroundColor: colors.background }}>
      <Stack gap="md" align="center">
        {isClosed ? (
          <>
            <Text
              size="lg"
              ta="center"
              style={{ color: colors.text, fontFamily }}
            >
              정말 많은 순간들이 모였어요 ✨
            </Text>
            <Text
              size="md"
              ta="center"
              style={{ color: colors.text, fontFamily }}
            >
              스냅 업로드가 마감되었어요.
              <br />
              함께해주셔서 감사합니다.
            </Text>
            <Text size="sm" c="dimmed" style={{ fontFamily }}>
              현재 {count}장의 사진이 도착했어요.
            </Text>
          </>
        ) : (
          <>
            <Text
              size="lg"
              ta="center"
              style={{ color: colors.text, fontFamily }}
            >
              소중한 순간들이 하나씩 모이고 있어요.
            </Text>
            <Text size="sm" c="dimmed" style={{ fontFamily }}>
              현재 {count}장의 사진이 도착했어요.
            </Text>
            <Button
              size="lg"
              onClick={open}
              style={{
                backgroundColor: colors.primary,
                color: '#fff',
              }}
            >
              사진 올리기
            </Button>
          </>
        )}
      </Stack>

      <SnapUploadModal
        opened={opened}
        onClose={close}
        invitationId={data.invitationId}
      />
    </Paper>
  );
};
