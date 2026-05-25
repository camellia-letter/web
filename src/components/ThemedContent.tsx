'use client';

import { useEffect } from 'react';
import { Anchor, Button, Container, Flex, Paper, Stack, Text, Title } from '@mantine/core';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { BlockRenderer } from '@/components/BlockRenderer';
import { AnimatedBlock } from '@/components/AnimatedBlock';
import { ShareButtons } from '@/components/ShareButtons';
import { CalendarButtons } from '@/components/CalendarButtons';
import { trackView } from '@/lib/api';
import { safeParseDate, formatDateKR, formatTimeKR } from '@/lib/dateUtils';
import type { Invitation } from '@camellia-letter/shared-types';
import { withAlpha } from '@/lib/themeUtils';

interface ThemedContentProps {
  invitation: Invitation;
  invitationUrl: string;
}

export const ThemedContent = ({ invitation, invitationUrl }: ThemedContentProps) => {
  useEffect(() => {
    const key = `viewed_${invitation.id}`;
    if (!sessionStorage.getItem(key)) {
      trackView(invitation.id);
      sessionStorage.setItem(key, '1');
    }
  }, [invitation.id]);

  return (
    <ThemeProvider theme={invitation.theme}>
      <ThemedContentInner invitation={invitation} invitationUrl={invitationUrl} />
    </ThemeProvider>
  );
};

const ThemedContentInner = ({ invitation, invitationUrl }: ThemedContentProps) => {
  const { colors, fontFamily, gradientCSS } = useTheme();
  const blocks = invitation.blocks || [];

  // HERO 블록의 첫 번째 이미지를 메인 이미지로 사용
  const heroBlock = blocks.find((block) => block.type === 'HERO');
  const mainImageUrl =
    invitation.mainImageUrl || (heroBlock?.type === 'HERO' ? heroBlock.data.imageUrl : undefined);

  const backgroundStyle = gradientCSS
    ? gradientCSS
    : `linear-gradient(to bottom, ${withAlpha(colors.secondary, 0.5)}, ${colors.background}, ${withAlpha(colors.secondary, 0.5)})`;

  return (
    <div style={{ background: backgroundStyle, minHeight: '100vh' }}>
      <Flex
        component="main"
        direction="column"
        style={{
          maxWidth: '425px',
          margin: '0 auto',
          width: '100%',
          fontFamily,
          backgroundColor: colors.background,
        }}
      >
        {blocks.length > 0 ? (
          <BlockRenderer blocks={blocks} invitation={invitation} />
        ) : (
          <FallbackContent invitation={invitation} />
        )}

        <AnimatedBlock animation="fade-up">
          <Container size="sm" py={48} className="no-print">
            <Stack gap="lg" align="center">
              <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
                캘린더에 일정 추가
              </Title>
              <CalendarButtons
                groomName={invitation.groomName}
                brideName={invitation.brideName}
                weddingDate={invitation.weddingDate}
                venue={invitation.venue}
                venueAddress={invitation.venueAddress}
              />
            </Stack>
          </Container>
        </AnimatedBlock>

        <AnimatedBlock animation="fade-up">
          <Paper
            radius={0}
            py={48}
            className="no-print"
            style={{ backgroundColor: withAlpha(colors.background, 0.5) }}
          >
            <Container size="sm">
              <Stack gap="lg" align="center">
                <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
                  공유하기
                </Title>
                <ShareButtons
                  invitationId={invitation.id}
                  groomName={invitation.groomName}
                  brideName={invitation.brideName}
                  weddingDate={invitation.weddingDate}
                  venue={invitation.venue}
                  invitationUrl={invitationUrl}
                  mainImageUrl={mainImageUrl}
                />
              </Stack>
            </Container>
          </Paper>
        </AnimatedBlock>

        {/* <Flex justify="center" py="xl" className="no-print">
          <Button
            variant="light"
            radius="md"
            onClick={() => window.print()}
            leftSection={<IconPrinter size={16} stroke={1.8} />}
            style={{
              backgroundColor: withAlpha(colors.secondary, 0.2),
              color: colors.text,
            }}
          >
            청첩장 인쇄하기
          </Button>
        </Flex> */}

        <Flex component="footer" justify="center" py={32}>
          <Text size="sm" ta="center" style={{ color: colors.text, opacity: 0.5 }}>
            {invitation.groomName} ♥ {invitation.brideName}
          </Text>
        </Flex>
      </Flex>
    </div>
  );
};

const FallbackContent = ({ invitation }: { invitation: Invitation }) => {
  const { colors, borderRadius } = useTheme();

  return (
    <>
      {invitation.message && (
        <Container size="sm" py={48}>
          <Stack gap="lg" align="center">
            <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
              초대합니다
            </Title>
            <Text ta="center" style={{ color: colors.text, opacity: 0.8, whiteSpace: 'pre-line' }}>
              {invitation.message}
            </Text>
          </Stack>
        </Container>
      )}

      <Paper py={48} radius={0} style={{ backgroundColor: withAlpha(colors.background, 0.5) }}>
        <Container size="sm">
          <Stack gap="lg" align="center">
            <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
              예식 일시
            </Title>
            <Stack gap={4} align="center">
              <Text size="xl" ta="center" style={{ color: colors.text }}>
                {formatDateKR(invitation.weddingDate, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </Text>
              <Text size="lg" ta="center" style={{ color: colors.primary }}>
                {formatTimeKR(invitation.weddingDate, {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </Stack>
            <FallbackDdayCounter weddingDate={invitation.weddingDate} />
          </Stack>
        </Container>
      </Paper>

      <Container size="sm" py={48}>
        <Stack gap="lg" align="center">
          <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
            오시는 길
          </Title>
          <Paper w="100%" p="xl" shadow="sm" style={{ borderRadius: `calc(${borderRadius} * 2)` }}>
            <Stack gap="md" align="center">
              <Stack gap={4} align="center">
                <Text size="xl" ta="center" style={{ color: colors.text }}>
                  {invitation.venue}
                </Text>
                <Text ta="center" style={{ color: colors.text, opacity: 0.6 }}>
                  {invitation.venueAddress}
                </Text>
              </Stack>

              {invitation.venueLat && invitation.venueLng && (
                <Button
                  component="a"
                  href={`https://map.kakao.com/link/map/${invitation.venue},${invitation.venueLat},${invitation.venueLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  radius="md"
                  style={{ backgroundColor: colors.primary }}
                >
                  카카오맵에서 보기
                </Button>
              )}

              <Flex gap="sm" justify="center" wrap="wrap">
                <Anchor
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(invitation.venueAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: colors.text, opacity: 0.6 }}
                >
                  네이버지도
                </Anchor>
                <Text style={{ color: colors.secondary }}>|</Text>
                <Anchor
                  href={`https://map.kakao.com/?q=${encodeURIComponent(invitation.venueAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: colors.text, opacity: 0.6 }}
                >
                  카카오맵
                </Anchor>
              </Flex>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
};

const FallbackDdayCounter = ({ weddingDate }: { weddingDate: string }) => {
  const { colors, borderRadius } = useTheme();

  const wedding = safeParseDate(weddingDate);
  if (!wedding) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  wedding.setHours(0, 0, 0, 0);

  const diffTime = wedding.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let text = '';
  if (diffDays > 0) {
    text = `D-${diffDays}`;
  } else if (diffDays === 0) {
    text = 'D-Day';
  } else {
    text = `D+${Math.abs(diffDays)}`;
  }

  return (
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
        {text}
      </Text>
    </Paper>
  );
};
