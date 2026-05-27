'use client';

import { Container, Paper, Stack, Text, Title } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import "dayjs/locale/ko";
import { useTheme } from "@/contexts/ThemeContext";
import { withAlpha } from "@/lib/themeUtils";
import { safeParseDate, formatDateKR, formatTimeKR } from "@/lib/dateUtils";

interface InfoBlockProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
}

export const InfoBlock = ({ weddingDate }: InfoBlockProps) => {
  const { colors, fontFamily, borderRadius } = useTheme();

  const date = safeParseDate(weddingDate);

  const formattedDate = formatDateKR(weddingDate, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const formattedTime = formatTimeKR(weddingDate, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  let ddayText = '';
  if (date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const wedding = new Date(date);
    wedding.setHours(0, 0, 0, 0);
    const diffTime = wedding.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      ddayText = `D-${diffDays}`;
    } else if (diffDays === 0) {
      ddayText = 'D-Day';
    } else {
      ddayText = `D+${Math.abs(diffDays)}`;
    }
  }

  return (
    <Paper py={48} radius={0} style={{ backgroundColor: withAlpha(colors.background, 0.5) }}>
      <Container size="sm">
        <Stack gap="lg" align="center" style={{ fontFamily }}>
          <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
            예식 일시
          </Title>
          <Stack gap={4} align="center">
            <Text size="xl" ta="center" style={{ color: colors.text }}>
              {formattedDate}
            </Text>
            {formattedTime && (
              <Text size="lg" ta="center" style={{ color: colors.primary }}>
                {formattedTime}
              </Text>
            )}
          </Stack>
          {ddayText && (
            <Paper
              px="md"
              py="xs"
              style={{
                backgroundColor: withAlpha(colors.primary, 0.1),
                color: colors.primary,
                borderRadius: borderRadius === '0' ? '9999px' : `calc(${borderRadius} * 4)`,
              }}
            >
              <Text size="sm" fw={600}>
                {ddayText}
              </Text>
            </Paper>
          )}

          {date && (
            <Paper
              p="md"
              shadow="sm"
              style={{
                borderRadius: `calc(${borderRadius} * 2)`,
                backgroundColor: 'white',
              }}
            >
              <Calendar
                date={date}
                static
                locale="ko"
                firstDayOfWeek={0}
                getDayProps={(dateString: string) => {
                  const calendarDate = new Date(dateString);
                  const isWeddingDay =
                    calendarDate.getDate() === date.getDate() &&
                    calendarDate.getMonth() === date.getMonth() &&
                    calendarDate.getFullYear() === date.getFullYear();

                  const dayOfWeek = calendarDate.getDay();
                  const isSunday = dayOfWeek === 0;
                  const isSaturday = dayOfWeek === 6;

                  let dayColor = colors.text;
                  if (isSunday) dayColor = '#DC2626'; // 빨간색
                  if (isSaturday) dayColor = '#2563EB'; // 파란색

                  return {
                    style: isWeddingDay
                      ? {
                          backgroundColor: withAlpha(colors.accent, 0.15),
                          color: dayColor,
                          borderRadius: '50%',
                          fontWeight: 'bold',
                          border: `2px solid ${colors.accent}`,
                        }
                      : {
                          color: dayColor,
                        },
                  };
                }}
                styles={{
                  calendarHeader: {
                    display: 'none',
                  },
                  weekday: {
                    color: colors.text,
                  },
                }}
                renderDay={(dateString: string) => {
                  const calendarDate = new Date(dateString);
                  const dayOfWeek = calendarDate.getDay();

                  let color = colors.text;
                  if (dayOfWeek === 0) color = '#DC2626'; // 일요일 빨간색
                  if (dayOfWeek === 6) color = '#2563EB'; // 토요일 파란색

                  return <span style={{ color }}>{calendarDate.getDate()}</span>;
                }}
              />
            </Paper>
          )}
        </Stack>
      </Container>
    </Paper>
  );
};
