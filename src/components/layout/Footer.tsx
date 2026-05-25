import { AppShell, AppShellFooter, Container, Text } from '@mantine/core';

const footerStyle = {
  position: 'static',
  backgroundColor: '#111827',
} as const;

export const Footer = () => {
  return (
    <AppShell mode="static">
      <AppShellFooter py={48} px="md" withBorder={false} style={footerStyle}>
        <Container size="xl">
          <Text size="sm" ta="center" c="gray.4">
            &copy; 2026 CamelliaLetter. All rights reserved.
          </Text>
        </Container>
      </AppShellFooter>
    </AppShell>
  );
};
