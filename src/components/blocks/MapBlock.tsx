'use client';

import { Button, Container, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import { useTheme } from "@/contexts/ThemeContext";
import { withAlpha } from "@/lib/themeUtils";
import { NaverMap } from "@/components/NaverMap";

interface MapBlockProps {
  venue: string;
  venueAddress: string;
  venueLat?: number | null;
  venueLng?: number | null;
  destinationName?: string;
}

export const MapBlock = ({ venue, venueAddress, venueLat, venueLng, destinationName }: MapBlockProps) => {
  const { colors, fontFamily, borderRadius } = useTheme();
  const destinationForMap = destinationName || venue;

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
                  href={`https://map.kakao.com/link/to/${destinationForMap},${venueLat},${venueLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  radius="md"
                  style={{ backgroundColor: colors.primary }}
                >
                  카카오 길찾기
                </Button>
                <Button
                  component="a"
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(destinationForMap)}?c=${venueLng},${venueLat},15,0,0,0,dh`}
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
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};
