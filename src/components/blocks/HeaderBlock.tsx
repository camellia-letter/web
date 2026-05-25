import { Container, Stack, Text, Title, Divider } from '@mantine/core';
import { useTheme } from '@/contexts/ThemeContext';
import type { HeaderBlockData } from '@camellia/shared-types';

interface HeaderBlockProps {
  data: HeaderBlockData;
  groomName: string;
  brideName: string;
}

export const HeaderBlock = ({ data, groomName, brideName }: HeaderBlockProps) => {
  const { colors } = useTheme();
  const { showTitle = true } = data;

  return (
    <Container size="sm" py={64}>
      <Stack gap="md" align="center">
        {showTitle && (
          <Text
            size="sm"
            ta="center"
            style={{ color: colors.primary, opacity: 0.8, letterSpacing: '0.35em' }}
          >
            WEDDING INVITATION
          </Text>
        )}
        <Title
          order={1}
          ta="center"
          style={{ color: colors.text, fontFamily: 'var(--font-noto-serif), serif' }}
        >
          {groomName} & {brideName}
        </Title>
        <Divider w={64} color={colors.secondary} />
      </Stack>
    </Container>
  );
};
