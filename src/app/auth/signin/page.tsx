import { signIn } from '@/auth';
import { SignInHelpDialog } from '@/components/SignInHelpDialog';
import { Anchor, Button, Divider, Flex, Paper, Stack, Text, Title } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';
import KaKaoLogin from '@/assets/kakao_login.png';
import NaverLogin from '@/assets/naver_login.png';

const SignInPage = () => {
  const isNaverEnabled = Boolean(process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET);

  return (
    <Flex
      px="md"
      py={48}
      mih="100vh"
      justify="center"
      align="center"
      style={{
        background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 55%, #f5f5f4 100%)',
      }}
    >
      <Paper
        withBorder
        radius="xl"
        shadow="xl"
        p="xl"
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(255,255,255,0.7)',
        }}
      >
        <Stack gap="lg" align="stretch">
          <Stack gap="sm" align="center">
            <Title order={1} ta="center">
              로그인
            </Title>
            <Text c="dimmed" size="md" ta="center">
              소셜 계정으로 간편하게 시작하세요
            </Text>
          </Stack>

          <Stack gap="sm">
            <form
              action={async () => {
                'use server';
                await signIn('google', { redirectTo: '/dashboard' });
              }}
            >
              <Button
                type="submit"
                variant="default"
                size="md"
                fullWidth
                leftSection={<IconBrandGoogle size={20} stroke={1.8} />}
                styles={{
                  root: {
                    height: 48,
                    borderColor: '#e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                  },
                }}
              >
                Google로 계속하기
              </Button>
            </form>

            <form
              action={async () => {
                'use server';
                await signIn('kakao', { redirectTo: '/dashboard' });
              }}
            >
              <button
                type="submit"
                aria-label="카카오로 로그인"
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: 320,
                  margin: '0 auto',
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <Image
                  src={KaKaoLogin}
                  alt="카카오 로그인"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </button>
            </form>

            {isNaverEnabled ? (
              <form
                action={async () => {
                  'use server';
                  await signIn('naver', { redirectTo: '/dashboard' });
                }}
              >
                <button
                  type="submit"
                  aria-label="네이버로 로그인"
                  style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: 320,
                    margin: '0 auto',
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <Image
                    src={NaverLogin}
                    alt="네이버 로그인"
                    style={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </button>
              </form>
            ) : (
              <button
                type="button"
                aria-label="네이버 로그인 준비 중"
                disabled
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: 320,
                  margin: '0 auto',
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'not-allowed',
                  opacity: 0.7,
                }}
              >
                <Image
                  src={NaverLogin}
                  alt="네이버 로그인"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </button>
            )}
          </Stack>

          <Divider />

          <Stack gap="sm" align="center">
            <SignInHelpDialog />
            <Anchor component={Link} href="/" c="dimmed" size="sm">
              홈으로 돌아가기
            </Anchor>
          </Stack>
        </Stack>
      </Paper>
    </Flex>
  );
};

export default SignInPage;
