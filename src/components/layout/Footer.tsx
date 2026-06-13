import { Box, Container, Text } from "@mantine/core";

export const Footer = () => {
  return (
    <Box
      component="footer"
      py={48}
      px="md"
      style={{
        backgroundColor: '#111827',
        width: '100%',
      }}
    >
      <Container size="xl">
        <Text size="sm" ta="center" c="gray.4">
          &copy; 2026 CamelliaLetter. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};
