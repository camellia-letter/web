'use client';

import { Anchor, Button, Container, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import { useTheme } from "@/contexts/ThemeContext";
import { withAlpha } from "@/lib/themeUtils";
import { NaverMap } from "@/components/NaverMap";

interface MapBlockProps {
  venue: string;
  venueAddress: string;
  venueLat?: number | null;
  venueLng?: number | null;
}

export const MapBlock = ({ venue, venueAddress, venueLat, venueLng }: MapBlockProps) => {
  const { colors, fontFamily, borderRadius } = useTheme();

  return (
    <Container size="sm" py={48}>
      <Stack gap="lg" align="center" style={{ fontFamily }}>
        <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
          오시는 길
        </Title>
        <Paper
          shadow="sm"
          w="100%"
          style={{ overflow: 'hidden', borderRadius: `calc(${borderRadius} * 2)` }}
        >
          {venueLat && venueLng && (
            <NaverMap lat={venueLat} lng={venueLng} venue={venue} style={{ height: '200px' }} />
          )}

          <Stack gap="md" p="xl" align="center">
            <Stack gap={4} align="center">
              <Text size="xl" ta="center" style={{ color: colors.text }}>
                {venue}
              </Text>
              <Text ta="center" style={{ color: colors.text, opacity: 0.6 }}>
                {venueAddress}
              </Text>
            </Stack>

            {venueLat && venueLng && (
              <Flex
                gap="sm"
                justify="center"
                wrap="wrap"
                pt="md"
                style={{
                  borderTop: `1px solid ${withAlpha(colors.secondary, 0.3)}`,
                  width: '100%',
                }}
              >
                <Button
                  component="a"
                  href={`https://map.kakao.com/link/to/${venue},${venueLat},${venueLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  radius="md"
                  style={{ backgroundColor: colors.primary }}
                >
                  카카오 길찾기
                </Button>
                <Button
                  component="a"
                  href={`https://map.naver.com/v5/directions/-/${encodeURIComponent(venue)},${venueLng},${venueLat},-/transit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  radius="md"
                  variant="outline"
                  style={{ borderColor: colors.primary, color: colors.primary }}
                >
                  네이버 길찾기
                </Button>
              </Flex>
            )}

            <Flex gap="sm" justify="center" wrap="wrap">
              <Anchor
                href={`https://map.naver.com/v5/search/${encodeURIComponent(venueAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.text, opacity: 0.6 }}
              >
                네이버지도
              </Anchor>
              <Text style={{ color: colors.secondary }}>|</Text>
              <Anchor
                href={`https://map.kakao.com/?q=${encodeURIComponent(venueAddress)}`}
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
  );
};
