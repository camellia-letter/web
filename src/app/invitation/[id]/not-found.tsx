import { Button, Container, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

const NotFound = () => {
  return (
    <Flex
      component="main"
      px="md"
      style={{
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #fff1f2 0%, #ffffff 100%)',
      }}
    >
      <Container size="xs" w="100%">
        <Paper radius="xl" p="xl" shadow="sm" withBorder>
          <Stack gap="md" align="center">
            <Text fz={56}>💌</Text>
            <Title order={1} ta="center">
              청첩장을 찾을 수 없습니다
            </Title>
            <Text c="dimmed" ta="center">
              요청하신 청첩장이 존재하지 않거나 삭제되었습니다.
            </Text>
            <Button component={Link} href="/" color="pink" radius="md">
              홈으로 돌아가기
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Flex>
  );
};

export default NotFound;
