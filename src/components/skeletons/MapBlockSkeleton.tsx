import { Paper, Skeleton, Stack, Text } from '@mantine/core';

/**
 * MapBlockSkeleton - Loading skeleton for MapBlock
 *
 * Matches the actual MapBlock height (200px) to prevent Cumulative Layout Shift (CLS)
 */
export const MapBlockSkeleton = () => {
  return (
    <Stack gap="lg" py={48} px="md" maw={480} mx="auto" align="center">
      <Skeleton height={24} width={96} radius="xl" />
      <Paper
        radius="lg"
        shadow="sm"
        style={{
          height: '200px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
        }}
      >
        <Text c="dimmed" size="sm">
          지도 로딩 중...
        </Text>
      </Paper>
      <Stack gap="sm" w="100%" align="center">
        <Skeleton height={24} width={192} radius="xl" />
        <Skeleton height={16} width={256} radius="xl" />
      </Stack>
    </Stack>
  );
};
