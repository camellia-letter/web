'use client';

import { Container, Paper, Stack, Text, Title, Flex } from '@mantine/core';
import type { TransportBlockData, TransportType } from '@camellia/shared-types';
import { useTheme } from '@/contexts/ThemeContext';
import { withAlpha } from '@/lib/themeUtils';

interface TransportBlockProps {
  data: TransportBlockData;
}

const transportIcons: Record<TransportType, string> = {
  subway: '🚇',
  bus: '🚌',
  car: '🚗',
  shuttle: '🚐',
  other: '📍',
};

export const TransportBlock = ({ data }: TransportBlockProps) => {
  const { colors, fontFamily, borderRadius } = useTheme();
  const { title = '오시는 길 안내', items = [], parkingInfo = '' } = data;

  const hasItems = items.length > 0;
  const hasParkingInfo = parkingInfo && parkingInfo.trim() !== '';

  if (!hasItems && !hasParkingInfo) {
    return null;
  }

  const getTransportColor = (type: TransportType) => {
    switch (type) {
      case 'subway':
        return { bg: withAlpha(colors.primary, 0.08), border: withAlpha(colors.primary, 0.2) };
      case 'bus':
        return { bg: withAlpha(colors.accent, 0.08), border: withAlpha(colors.accent, 0.2) };
      case 'car':
        return { bg: withAlpha(colors.secondary, 0.15), border: withAlpha(colors.secondary, 0.3) };
      case 'shuttle':
        return { bg: withAlpha(colors.primary, 0.05), border: withAlpha(colors.primary, 0.15) };
      default:
        return { bg: withAlpha(colors.text, 0.05), border: withAlpha(colors.text, 0.1) };
    }
  };

  return (
    <Container size="sm" py={48} style={{ backgroundColor: colors.background, fontFamily }}>
      <Stack gap="xl">
        <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
          {title}
        </Title>

        {hasItems && (
          <Stack gap="md">
            {items.map((item, index) => {
              const icon = transportIcons[item.type] || transportIcons.other;
              const itemColors = getTransportColor(item.type);

              return (
                <Paper
                  key={index}
                  p="md"
                  style={{
                    backgroundColor: itemColors.bg,
                    border: `1px solid ${itemColors.border}`,
                    borderRadius,
                  }}
                >
                  <Flex gap="md" align="flex-start">
                    <Text size="xl">{icon}</Text>
                    <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                      <Text fw={600} style={{ color: colors.text }}>
                        {item.title}
                      </Text>
                      {item.description && (
                        <Text
                          size="sm"
                          style={{ color: colors.text, opacity: 0.75, whiteSpace: 'pre-line' }}
                        >
                          {item.description}
                        </Text>
                      )}
                    </Stack>
                  </Flex>
                </Paper>
              );
            })}
          </Stack>
        )}

        {hasParkingInfo && (
          <Paper
            p="md"
            style={{
              backgroundColor: withAlpha(colors.secondary, 0.1),
              border: `1px solid ${withAlpha(colors.secondary, 0.25)}`,
              borderRadius,
            }}
          >
            <Flex gap="md" align="flex-start">
              <Text size="xl">🅿️</Text>
              <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                <Text fw={600} style={{ color: colors.text }}>
                  주차 안내
                </Text>
                <Text
                  size="sm"
                  style={{ color: colors.text, opacity: 0.75, whiteSpace: 'pre-line' }}
                >
                  {parkingInfo}
                </Text>
              </Stack>
            </Flex>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};
