'use client';

import { Container, Stack, Text, Title } from "@mantine/core";
import { useTheme } from "@/contexts/ThemeContext";

interface MessageBlockProps {
  data: {
    title?: string;
    content?: string;
  };
}

export const MessageBlock = ({ data }: MessageBlockProps) => {
  const { colors, fontFamily } = useTheme();

  if (!data.title && !data.content) return null;

  return (
    <Container size="sm" py={48}>
      <Stack gap="lg" align="center" style={{ fontFamily }}>
        {data.title && (
          <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
            {data.title}
          </Title>
        )}
        {data.content && (
          <Text
            ta="center"
            style={{ color: colors.text, opacity: 0.8, whiteSpace: 'pre-line', lineHeight: 1.8 }}
          >
            {data.content}
          </Text>
        )}
      </Stack>
    </Container>
  );
};
