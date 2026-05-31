'use client';

import { Container, Stack, Text } from "@mantine/core";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDateKR, safeParseDate } from "@/lib/dateUtils";

interface WeddingSummaryBlockProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  venue: string;
}

export const WeddingSummaryBlock = ({
  groomName,
  brideName,
  weddingDate,
  venue
}: WeddingSummaryBlockProps) => {
  const { colors, fontFamily } = useTheme();

  // Format date: "2025년 8월 30일 (토)"
  const formattedDate = formatDateKR(weddingDate, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  // Format time: "오후 1시 10분"
  const date = safeParseDate(weddingDate);
  let formattedTime = '';
  if (date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? '오전' : '오후';
    const displayHour = hours % 12 || 12;
    formattedTime = `${period} ${displayHour}시${minutes > 0 ? ` ${minutes}분` : ''}`;
  }

  return (
    <Container size="sm" py={32}>
      <Stack gap="xs" align="center" style={{ fontFamily }}>
        <Text
          size="lg"
          fw={500}
          ta="center"
          style={{ color: colors.text }}
        >
          {groomName} · {brideName}
        </Text>
        <Text
          size="md"
          ta="center"
          style={{ color: colors.text, opacity: 0.8 }}
        >
          {formattedDate} {formattedTime}
        </Text>
        <Text
          size="md"
          ta="center"
          style={{ color: colors.text, opacity: 0.8 }}
        >
          {venue}
        </Text>
      </Stack>
    </Container>
  );
};
