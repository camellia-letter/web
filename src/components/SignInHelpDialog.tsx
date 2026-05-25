'use client';

import { Button, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export const SignInHelpDialog = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button variant="subtle" color="gray" onClick={open}>
        로그인 안내
      </Button>
      <Modal opened={opened} onClose={close} title="소셜 로그인 안내" centered>
        <Stack gap="sm">
          <Text c="dimmed" size="sm">
            별도 회원가입 없이 Google, 카카오, 네이버 계정으로 바로 시작할 수 있습니다.
          </Text>
          <Text size="sm">로그인 후에는 내 청첩장 목록과 관리자 에디터로 바로 이동합니다.</Text>
          <Text size="sm">프로필 정보는 로그인 상태 유지와 기본 사용자 식별에만 사용됩니다.</Text>
          <Text size="sm">
            원하는 계정을 선택해도 이후 청첩장 편집 기능은 동일하게 사용할 수 있습니다.
          </Text>
          <Button onClick={close}>확인</Button>
        </Stack>
      </Modal>
    </>
  );
};
