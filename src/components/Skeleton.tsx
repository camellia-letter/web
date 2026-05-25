import {
  Card,
  Container,
  Flex,
  Paper,
  SimpleGrid,
  Skeleton as MantineSkeleton,
  Stack,
} from '@mantine/core';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return <MantineSkeleton className={className} radius="md" />;
};

export const InvitationSkeleton = () => {
  return (
    <Flex
      direction="column"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fff1f2 0%, #ffffff 55%, #fff1f2 100%)',
      }}
    >
      <Container size="sm" py={64}>
        <Stack gap={48}>
          <Stack gap="sm" align="center">
            <MantineSkeleton height={16} width={128} radius="xl" />
            <MantineSkeleton height={36} width={192} radius="xl" />
            <MantineSkeleton height={2} width={64} radius="xl" mt="md" />
          </Stack>

          <Stack gap="md" maw={480} mx="auto" w="100%">
            <MantineSkeleton height={24} width={96} radius="xl" mx="auto" />
            <Stack gap="xs">
              <MantineSkeleton height={16} radius="xl" />
              <MantineSkeleton height={16} width="85%" radius="xl" mx="auto" />
              <MantineSkeleton height={16} width="80%" radius="xl" mx="auto" />
            </Stack>
          </Stack>

          <Paper p="xl" radius="xl" bg="rgba(255,255,255,0.7)">
            <Stack gap="sm" align="center">
              <MantineSkeleton height={24} width={96} radius="xl" />
              <MantineSkeleton height={36} width={260} radius="xl" />
              <MantineSkeleton height={28} width={140} radius="xl" />
            </Stack>
          </Paper>

          <Stack gap="md" maw={480} mx="auto" w="100%">
            <MantineSkeleton height={24} width={96} radius="xl" mx="auto" />
            <MantineSkeleton height={192} radius="xl" />
          </Stack>

          <Stack gap="md" maw={480} mx="auto" w="100%">
            <MantineSkeleton height={24} width={96} radius="xl" mx="auto" />
            <SimpleGrid cols={2} spacing="sm">
              <MantineSkeleton height={160} radius="xl" />
              <MantineSkeleton height={160} radius="xl" />
              <MantineSkeleton height={160} radius="xl" />
              <MantineSkeleton height={160} radius="xl" />
            </SimpleGrid>
          </Stack>
        </Stack>
      </Container>
    </Flex>
  );
};

export const CardSkeleton = () => {
  return (
    <Card withBorder radius="lg" shadow="sm" padding="lg">
      <Stack gap="md">
        <Flex align="center" gap="sm">
          <MantineSkeleton circle height={24} width={24} />
          <MantineSkeleton height={24} width={160} radius="xl" />
        </Flex>
        <Stack gap="xs">
          <MantineSkeleton height={16} width={128} radius="xl" />
          <MantineSkeleton height={16} width={96} radius="xl" />
        </Stack>
        <Flex gap="sm" pt="md" style={{ borderTop: '1px solid #f1f5f9' }}>
          <MantineSkeleton height={40} radius="md" style={{ flex: 1 }} />
          <MantineSkeleton height={40} radius="md" style={{ flex: 1 }} />
        </Flex>
      </Stack>
    </Card>
  );
};
