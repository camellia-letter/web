'use client';

import { useState } from "react";
import { Container, Stack, Title, TextInput, Button, Card, Text, Grid, Table } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import type { Invitation } from "@camellia-letter/shared-types";
import { formatDateKR } from "@/lib/dateUtils";

interface RsvpListContentProps {
  invitation: Invitation;
}

interface RsvpItem {
  id: string;
  name: string;
  phone?: string;
  attendance: 'attending' | 'not_attending' | 'undecided';
  side?: 'groom' | 'bride';
  guestCount?: number;
  meal?: 'standard' | 'vegetarian' | 'none';
  message?: string;
  createdAt: Date;
}

interface RsvpStats {
  total: number;
  attending: number;
  notAttending: number;
  undecided: number;
  totalGuests: number;
  groomSide: number;
  brideSide: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';

export const RsvpListContent = ({ invitation }: RsvpListContentProps) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rsvps, setRsvps] = useState<RsvpItem[]>([]);
  const [stats, setStats] = useState<RsvpStats | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Fetch both RSVP list and stats
      const [rsvpResponse, statsResponse] = await Promise.all([
        fetch(`${API_URL}/api/rsvps/verify-and-fetch/${invitation.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: password || undefined }),
        }),
        fetch(`${API_URL}/api/rsvps/verify-and-fetch/${invitation.id}/stats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: password || undefined }),
        }),
      ]);

      if (!rsvpResponse.ok || !statsResponse.ok) {
        if (rsvpResponse.status === 401 || statsResponse.status === 401) {
          setError('비밀번호가 올바르지 않습니다.');
        } else {
          setError('조회 중 오류가 발생했습니다.');
        }
        return;
      }

      const rsvpData = await rsvpResponse.json();
      const statsData = await statsResponse.json();

      setRsvps(rsvpData.items || []);
      setStats(statsData);
      setIsAuthenticated(true);
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAttendanceText = (attendance: string) => {
    switch (attendance) {
      case 'attending':
        return '참석';
      case 'not_attending':
        return '불참';
      case 'undecided':
        return '미정';
      default:
        return '-';
    }
  };

  const getSideText = (side?: string) => {
    switch (side) {
      case 'groom':
        return '신랑측';
      case 'bride':
        return '신부측';
      default:
        return '-';
    }
  };

  if (!isAuthenticated) {
    return (
      <Container size="sm" py={64}>
        <Stack gap="xl" align="center">
          <Stack gap="xs" align="center">
            <IconLock size={48} stroke={1.5} color="#868e96" />
            <Title order={1} size="h2" ta="center">
              {invitation.groomName} ♥ {invitation.brideName}
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              {formatDateKR(invitation.weddingDate, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </Stack>

          <Card w="100%" shadow="sm" padding="xl" radius="md" withBorder>
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <Title order={2} size="h3" ta="center">
                  RSVP 목록 조회
                </Title>
                <Text size="sm" c="dimmed" ta="center">
                  비밀번호가 설정되어 있다면 입력해주세요.
                </Text>
                <TextInput
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="md"
                  disabled={isLoading}
                />
                {error && (
                  <Text size="sm" c="red" ta="center">
                    {error}
                  </Text>
                )}
                <Button type="submit" size="md" fullWidth loading={isLoading}>
                  조회하기
                </Button>
              </Stack>
            </form>
          </Card>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py={64}>
      <Stack gap="xl">
        <Stack gap="xs" align="center">
          <Title order={1} size="h2" ta="center">
            {invitation.groomName} ♥ {invitation.brideName}
          </Title>
          <Text size="lg" c="dimmed" ta="center">
            RSVP 목록
          </Text>
        </Stack>

        {/* Statistics */}
        {stats && (
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="xs" align="center">
                  <Text size="sm" c="dimmed">
                    총 응답
                  </Text>
                  <Text size="xl" fw={700}>
                    {stats.total}명
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="xs" align="center">
                  <Text size="sm" c="dimmed">
                    참석
                  </Text>
                  <Text size="xl" fw={700} c="green">
                    {stats.attending}명
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="xs" align="center">
                  <Text size="sm" c="dimmed">
                    불참
                  </Text>
                  <Text size="xl" fw={700} c="red">
                    {stats.notAttending}명
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="xs" align="center">
                  <Text size="sm" c="dimmed">
                    총 인원
                  </Text>
                  <Text size="xl" fw={700}>
                    {stats.totalGuests}명
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        )}

        {/* RSVP List */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={2} size="h3">
              응답 목록
            </Title>
            {rsvps.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                아직 응답이 없습니다.
              </Text>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>이름</Table.Th>
                    <Table.Th>연락처</Table.Th>
                    <Table.Th>참석여부</Table.Th>
                    <Table.Th>구분</Table.Th>
                    <Table.Th>인원</Table.Th>
                    <Table.Th>메시지</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rsvps.map((rsvp) => (
                    <Table.Tr key={rsvp.id}>
                      <Table.Td>{rsvp.name}</Table.Td>
                      <Table.Td>{rsvp.phone || '-'}</Table.Td>
                      <Table.Td>{getAttendanceText(rsvp.attendance)}</Table.Td>
                      <Table.Td>{getSideText(rsvp.side)}</Table.Td>
                      <Table.Td>{rsvp.guestCount || 1}</Table.Td>
                      <Table.Td
                        style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {rsvp.message || '-'}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};
