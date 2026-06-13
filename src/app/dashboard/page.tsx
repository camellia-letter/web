import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Alert,
  Button,
  Card,
  Container,
  Flex,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { getInvitations, exchangeSessionForJwt } from "@/lib/api";
import type { Invitation } from "@camellia-letter/shared-types";
import { Header } from "@/components/layout/Header";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getDday = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weddingDate = new Date(dateString);
  weddingDate.setHours(0, 0, 0, 0);
  const diff = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'D-Day';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
};

interface InvitationCardProps {
  invitation: Invitation;
  adminUrl: string;
  baseUrl: string;
  adminJwt?: string | null;
}

const InvitationCard = ({ invitation, adminUrl, baseUrl, adminJwt }: InvitationCardProps) => {
  const editorUrl = adminJwt
    ? `${adminUrl}/editor/${invitation.id}?jwt=${adminJwt}`
    : `${adminUrl}/editor/${invitation.id}`;
  const invitationUrl = invitation.slug
    ? `${baseUrl}/invitation/${invitation.slug}`
    : `${baseUrl}/invitation/${invitation.id}`;

  return (
    <Card withBorder radius="xl" shadow="sm" padding={0} style={{ overflow: 'hidden' }}>
      <Stack gap={0}>
        <Paper
          radius={0}
          px="xl"
          py="lg"
          style={{ background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)' }}
        >
          <Stack gap={4}>
            <Title order={3} c="white" size="h4">
              {invitation.groomName} & {invitation.brideName}
            </Title>
            <Text c="rgba(255,255,255,0.8)" size="sm">
              {formatDate(invitation.weddingDate)} · {getDday(invitation.weddingDate)}
            </Text>
          </Stack>
        </Paper>

        <Stack gap="lg" p="xl">
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              예식장
            </Text>
            <Text fw={600}>{invitation.venue}</Text>
          </Stack>

          <SimpleGrid cols={2} spacing="md">
            <Paper radius="lg" p="md" bg="gray.0">
              <Stack gap={2} align="center">
                <Text fw={700} size="xl">
                  {invitation.viewCount || 0}
                </Text>
                <Text size="xs" c="dimmed">
                  조회수
                </Text>
              </Stack>
            </Paper>
            <Paper radius="lg" p="md" bg="gray.0">
              <Stack gap={2} align="center">
                <Text fw={700} size="xl">
                  {invitation.shareCount || 0}
                </Text>
                <Text size="xs" c="dimmed">
                  공유수
                </Text>
              </Stack>
            </Paper>
          </SimpleGrid>

          {invitation.slug && (
            <Paper radius="lg" p="md" bg="gray.0">
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  청첩장 URL
                </Text>
                <Text ff="monospace" size="sm" lineClamp={1}>
                  /invitation/{invitation.slug}
                </Text>
              </Stack>
            </Paper>
          )}

          <Flex gap="sm">
            <Button
              component={Link}
              href={invitationUrl}
              target="_blank"
              variant="default"
              radius="md"
              style={{ flex: 1 }}
            >
              미리보기
            </Button>
            <Button
              component={Link}
              href={editorUrl}
              target="_blank"
              radius="md"
              variant="gradient"
              gradient={{ from: 'pink', to: 'grape', deg: 135 }}
              style={{ flex: 1 }}
            >
              편집하기
            </Button>
          </Flex>
        </Stack>
      </Stack>
    </Card>
  );
};

const EmptyState = ({ adminUrl, adminJwt }: { adminUrl: string; adminJwt?: string | null }) => {
  const createUrl = adminJwt ? `${adminUrl}?jwt=${adminJwt}` : adminUrl;

  return (
    <Paper withBorder radius="xl" p="xl">
      <Stack gap="md" align="center" maw={420} mx="auto">
        <ThemeIcon
          size={64}
          radius="xl"
          variant="gradient"
          gradient={{ from: 'pink', to: 'grape', deg: 135 }}
        >
          <IconPlus size={32} stroke={1.8} />
        </ThemeIcon>
        <Stack gap={6} align="center">
          <Title order={2} ta="center">
            첫 청첩장을 만들어보세요
          </Title>
          <Text c="dimmed" ta="center">
            드래그 앤 드롭으로 쉽게 만들고, 테마로 꾸미고, 링크로 공유하세요
          </Text>
        </Stack>
        <Button
          component={Link}
          href={createUrl}
          target="_blank"
          radius="md"
          variant="gradient"
          gradient={{ from: 'pink', to: 'grape', deg: 135 }}
        >
          청첩장 만들기
        </Button>
      </Stack>
    </Paper>
  );
};

const DashboardPage = async () => {
  const session = await auth();

  // 임시로 로그인 리다이렉트 비활성화
  /*
  if (!session?.user) {
    redirect('/auth/signin');
  }
  */

  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:4001';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';

  const sessionToken = session?.sessionToken ?? null;

  const adminJwt = sessionToken && session?.user?.id
    ? await exchangeSessionForJwt(session.user.id, sessionToken)
    : null;

  const invitations = await getInvitations(adminJwt);

  return (
    <Flex direction="column" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header variant="dashboard" session={session} />

      <Container size="xl" py={48} style={{ flex: 1, width: '100%' }}>
        <Stack gap="xl">
          <Flex
            justify="space-between"
            align={{ base: 'flex-start', sm: 'center' }}
            gap="md"
            wrap="wrap"
          >
            <Stack gap={6}>
              <Title order={1}>내 청첩장</Title>
              <Text c="dimmed">
                {invitations.length > 0
                  ? `총 ${invitations.length}개의 청첩장`
                  : '청첩장을 만들고 관리하세요'}
              </Text>
            </Stack>
            {invitations.length > 0 && (
              <Button
                component={Link}
                href={adminJwt ? `${adminUrl}?jwt=${adminJwt}` : adminUrl}
                target="_blank"
                radius="md"
                variant="gradient"
                gradient={{ from: 'pink', to: 'grape', deg: 135 }}
                leftSection={<IconPlus size={18} stroke={1.8} />}
              >
                새 청첩장
              </Button>
            )}
          </Flex>

          {invitations.length > 0 ? (
            <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
              {invitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  adminUrl={adminUrl}
                  baseUrl={baseUrl}
                  adminJwt={adminJwt}
                />
              ))}
            </SimpleGrid>
          ) : (
            <EmptyState adminUrl={adminUrl} adminJwt={adminJwt} />
          )}

          <Alert color="blue" radius="lg" variant="light" title="청첩장 관리 팁">
            에디터에서 블록을 추가하고, 테마를 변경하고, 방명록과 RSVP를 관리할 수 있습니다. 청첩장
            링크를 복사해서 카카오톡이나 문자로 공유해보세요.
          </Alert>
        </Stack>
      </Container>
    </Flex>
  );
};

export default DashboardPage;
