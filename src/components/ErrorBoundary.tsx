'use client';

import { Component, ReactNode } from "react";
import { Button, Container, Flex, Paper, Stack, Text, Title } from "@mantine/core";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (typeof window !== 'undefined' && 'reportError' in window) {
      window.reportError(error);
    }

    void errorInfo;
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Flex
          px="md"
          style={{
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
          }}
        >
          <Container size="xs" w="100%">
            <Paper radius="xl" p="xl" shadow="sm" withBorder>
              <Stack gap="md" align="center">
                <Text fz={56}>😢</Text>
                <Title order={2} ta="center">
                  문제가 발생했습니다
                </Title>
                <Text c="dimmed" ta="center">
                  페이지를 불러오는 중 오류가 발생했습니다.
                </Text>
                <Button color="pink" radius="md" onClick={() => window.location.reload()}>
                  새로고침
                </Button>
              </Stack>
            </Paper>
          </Container>
        </Flex>
      );
    }

    return this.props.children;
  }
}

export const ErrorFallback = ({ message }: { message?: string }) => {
  return (
    <Flex
      px="md"
      style={{
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #fff1f2 0%, #ffffff 55%, #fff1f2 100%)',
      }}
    >
      <Container size="xs" w="100%">
        <Paper radius="xl" p="xl" shadow="sm" withBorder>
          <Stack gap="md" align="center">
            <Text fz={56}>💌</Text>
            <Title order={2} ta="center">
              {message || '청첩장을 불러올 수 없습니다'}
            </Title>
            <Text c="dimmed" ta="center">
              잠시 후 다시 시도해주세요.
            </Text>
            <Button color="pink" radius="md" onClick={() => window.location.reload()}>
              새로고침
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Flex>
  );
};
