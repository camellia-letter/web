import { Anchor, AppShell, AppShellHeader, Avatar, Button, Flex, Group, Text } from '@mantine/core';
import Link from 'next/link';
import { signOut } from '@/auth';
import type { Session } from 'next-auth';

interface HeaderProps {
  variant: 'landing' | 'dashboard';
  session: Session | null;
}

export const Header = ({ variant, session }: HeaderProps) => {
  const isLanding = variant === 'landing';
  const user = session?.user;

  return (
    <AppShell mode="static">
      <AppShellHeader w="100%" h="4rem" px="md" withBorder={!isLanding}>
        <Flex w="100%" h="100%" align="center" justify="space-between">
          <Anchor component={Link} href={isLanding ? '/' : '/dashboard'} underline="never">
            <Text
              fw={800}
              size="xl"
              variant="gradient"
              gradient={{ from: 'pink', to: 'grape', deg: 135 }}
            >
              CamelliaLetter
            </Text>
          </Anchor>
          {isLanding ? (
            <Flex gap="sm">
              {session ? (
                <Button component={Link} href="/dashboard" variant="subtle" color="gray">
                  대시보드
                </Button>
              ) : (
                <Button component={Link} href="/auth/signin" variant="subtle" color="gray">
                  로그인
                </Button>
              )}
            </Flex>
          ) : user ? (
            <Group gap="md">
              <Group gap="sm">
                {user.image && <Avatar src={user.image} alt={user.name || ''} />}
                <Text size="sm">{user.name}</Text>
              </Group>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <Button type="submit" variant="subtle" color="gray">
                  로그아웃
                </Button>
              </form>
            </Group>
          ) : null}
        </Flex>
      </AppShellHeader>
    </AppShell>
  );
};
