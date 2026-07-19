import { Container, Paper, Stack, Title, Text, ThemeIcon } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";

export const PendingApprovalScreen = () => {
  return (
    <Container size="sm" py={80}>
      <Paper withBorder radius="xl" p="xl" shadow="md">
        <Stack gap="lg" align="center">
          <ThemeIcon size={80} radius="xl" variant="light" color="orange">
            <IconClock size={40} />
          </ThemeIcon>

          <Stack gap="xs" align="center">
            <Title order={2} ta="center">
              계정 승인 대기 중
            </Title>
            <Text c="dimmed" ta="center" size="sm">
              관리자의 승인을 기다리고 있습니다
            </Text>
          </Stack>

          <Stack gap="xs" align="center">
            <Text size="sm" c="dimmed">
              • 보통 1-2일 정도 소요됩니다
            </Text>
            <Text size="sm" c="dimmed">
              • 승인되면 이메일로 알려드립니다
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};
