'use client';

import { Button, Stack } from "@mantine/core";
import { IconBrandApple, IconBrandGoogle, IconMessageCircle } from "@tabler/icons-react";
import { safeParseDate } from "@/lib/dateUtils";

interface CalendarButtonsProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  venue: string;
  venueAddress: string;
}

export const CalendarButtons = ({
  groomName,
  brideName,
  weddingDate,
  venue,
  venueAddress,
}: CalendarButtonsProps) => {
  const title = `${groomName} ♥ ${brideName} 결혼식`;
  const location = `${venue}, ${venueAddress}`;
  const description = `${groomName}님과 ${brideName}님의 결혼식에 초대합니다.`;

  const startDate = safeParseDate(weddingDate);
  if (!startDate) return null;
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2시간 후

  const formatDateForGoogle = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '');
  };

  const formatDateForICS = (date: Date) => {
    return date
      .toISOString()
      .replace(/-|:|\.\d{3}/g, '')
      .slice(0, -1);
  };

  const handleGoogleCalendar = () => {
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', title);
    url.searchParams.set(
      'dates',
      `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`,
    );
    url.searchParams.set('details', description);
    url.searchParams.set('location', location);

    window.open(url.toString(), '_blank');
  };

  const handleNaverCalendar = () => {
    const formatForNaver = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}${month}${day}T${hours}${minutes}00`;
    };

    const url = new URL('https://calendar.naver.com/calendar/pop/schedule');
    url.searchParams.set('title', title);
    url.searchParams.set('st', formatForNaver(startDate));
    url.searchParams.set('et', formatForNaver(endDate));
    url.searchParams.set('content', description);
    url.searchParams.set('location', location);

    window.open(url.toString(), '_blank');
  };

  const handleDownloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${formatDateForICS(startDate)}Z`,
      `DTEND:${formatDateForICS(endDate)}Z`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${groomName}_${brideName}_결혼식.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Stack gap="sm">
      <Button
        onClick={handleGoogleCalendar}
        variant="default"
        radius="xl"
        size="md"
        fullWidth
        leftSection={<IconBrandGoogle size={20} stroke={1.8} />}
      >
        Google 캘린더에 추가
      </Button>

      <Button
        onClick={handleNaverCalendar}
        radius="xl"
        size="md"
        fullWidth
        leftSection={<IconMessageCircle size={20} stroke={1.8} />}
        styles={{
          root: {
            backgroundColor: '#03C75A',
            color: '#ffffff',
          },
        }}
      >
        네이버 캘린더에 추가
      </Button>

      <Button
        onClick={handleDownloadICS}
        radius="xl"
        size="md"
        fullWidth
        color="dark"
        leftSection={<IconBrandApple size={20} stroke={1.8} />}
      >
        Apple 캘린더에 추가 (.ics)
      </Button>
    </Stack>
  );
};
