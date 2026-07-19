import { Container, Paper, Stack, Title, Text, ThemeIcon, Anchor } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

interface RejectedScreenProps {
  reason?: string;
}

export const RejectedScreen = ({ reason }: RejectedScreenProps) => {
  return (
    <Container size="sm" py={80}>
      <Paper withBorder radius="xl" p="xl" shadow="md">
        <Stack gap="lg" align="center">
          <ThemeIcon size={80} radius="xl" variant="light" color="red">
            <IconX size={40} />
          </ThemeIcon>

          <Stack gap="xs" align="center">
            <Title order={2} ta="center">
              계정 승인이 거부되었습니다
            </Title>
            {reason && (
              <Text c="dimmed" ta="center">
                사유: {reason}
              </Text>
            )}
          </Stack>

          <Text size="sm" c="dimmed" ta="center">
            문의사항이 있으시면{' '}
            <Anchor href="mailto:contact@example.com">
              contact@example.com
            </Anchor>
            으로 연락 주세요
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
};
