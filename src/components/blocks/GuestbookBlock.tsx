'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Button,
  Container,
  Flex,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { getGuestbooks, createGuestbook, deleteGuestbook } from '@/lib/api';
import type { GuestBook } from '@camellia-letter/shared-types';
import { CreateGuestBookDtoSchema } from '@camellia-letter/shared-types';
import { useTheme } from '@/contexts/ThemeContext';
import { withAlpha } from '@/lib/themeUtils';
import { useToast } from '@/components/ui/Toast';

interface GuestbookBlockProps {
  invitationId: string;
}

export const GuestbookBlock = ({ invitationId }: GuestbookBlockProps) => {
  const { colors, fontFamily, borderRadius } = useTheme();
  const { addToast } = useToast();

  const [guestbooks, setGuestbooks] = useState<GuestBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const loadGuestbooks = useCallback(async () => {
    setIsLoading(true);
    const data = await getGuestbooks(invitationId);
    setGuestbooks(data);
    setIsLoading(false);
  }, [invitationId]);

  useEffect(() => {
    loadGuestbooks();
  }, [loadGuestbooks]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const guestbookData = {
        invitationId,
        name: name.trim(),
        message: message.trim(),
        password: password.trim() || undefined,
      };

      const validation = CreateGuestBookDtoSchema.safeParse(guestbookData);
      if (!validation.success) {
        const firstError = validation.error.issues[0];
        addToast('warning', firstError.message);
        return;
      }

      setIsSubmitting(true);

      const result = await createGuestbook(guestbookData);

      setIsSubmitting(false);

      if (result) {
        addToast('success', '방명록이 작성되었습니다');
        setName('');
        setMessage('');
        setPassword('');
        loadGuestbooks();
      } else {
        addToast('error', '방명록 작성에 실패했습니다');
      }
    },
    [invitationId, name, message, password, addToast, loadGuestbooks],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteId || isDeleting) return;

    setIsDeleting(true);
    const success = await deleteGuestbook(deleteId, deletePassword.trim() || undefined);

    if (success) {
      addToast('success', '방명록이 삭제되었습니다');
      setDeleteId(null);
      setDeletePassword('');
      loadGuestbooks();
    } else {
      addToast('error', '삭제에 실패했습니다. 비밀번호를 확인해주세요');
    }
    setIsDeleting(false);
  }, [deleteId, deletePassword, isDeleting, addToast, loadGuestbooks]);

  const inputStyles = useMemo(
    () => ({
      input: {
        borderColor: colors.secondary,
        borderRadius,
      },
    }),
    [colors.secondary, borderRadius],
  );

  return (
    <Container size="md" py={48} style={{ fontFamily }}>
      <Stack gap="xl">
        <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
          방명록
        </Title>

        <Paper shadow="sm" p="xl" style={{ borderRadius: `calc(${borderRadius} * 2)` }}>
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  placeholder="이름"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  required
                  styles={inputStyles}
                />
                <TextInput
                  type="password"
                  placeholder="비밀번호 (선택)"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  styles={inputStyles}
                />
              </SimpleGrid>
              <Textarea
                placeholder="축하 메시지를 남겨주세요"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
                required
                styles={inputStyles}
              />
              <Button
                type="submit"
                fullWidth
                radius="md"
                loading={isSubmitting}
                style={{ backgroundColor: colors.primary }}
              >
                {isSubmitting ? '작성 중...' : '방명록 작성'}
              </Button>
            </Stack>
          </form>
        </Paper>

        <Stack gap="md">
          {isLoading ? (
            <Text ta="center" py="xl" style={{ color: colors.text, opacity: 0.6 }}>
              로딩 중...
            </Text>
          ) : guestbooks.length === 0 ? (
            <Text ta="center" py="xl" style={{ color: colors.text, opacity: 0.6 }}>
              첫 번째 방명록을 남겨주세요
            </Text>
          ) : (
            guestbooks.map((entry) => (
              <Paper
                key={entry.id}
                shadow="sm"
                p="lg"
                style={{
                  border: `1px solid ${withAlpha(colors.secondary, 0.3)}`,
                  borderRadius,
                }}
              >
                <Stack gap="sm">
                  <Flex justify="space-between" align="flex-start" gap="md">
                    <Stack gap={2}>
                      <Text fw={600} style={{ color: colors.text }}>
                        {entry.name}
                      </Text>
                      <Text size="xs" style={{ color: colors.text, opacity: 0.5 }}>
                        {new Date(entry.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </Stack>
                    <Button
                      variant="subtle"
                      color="red"
                      size="compact-sm"
                      onClick={() => setDeleteId(entry.id)}
                    >
                      삭제
                    </Button>
                  </Flex>
                  <Text style={{ color: colors.text, opacity: 0.8, whiteSpace: 'pre-line' }}>
                    {entry.message}
                  </Text>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </Stack>

      <Modal
        opened={!!deleteId}
        onClose={() => {
          setDeleteId(null);
          setDeletePassword('');
        }}
        title="방명록 삭제"
        centered
      >
        <Stack gap="md">
          <Text size="sm" style={{ color: colors.text, opacity: 0.7 }}>
            비밀번호를 설정한 경우 입력해주세요
          </Text>
          <TextInput
            type="password"
            placeholder="비밀번호"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.currentTarget.value)}
            styles={inputStyles}
          />
          <Flex gap="sm">
            <Button
              variant="default"
              radius="md"
              style={{ flex: 1 }}
              onClick={() => {
                setDeleteId(null);
                setDeletePassword('');
              }}
            >
              취소
            </Button>
            <Button
              radius="md"
              color="red"
              loading={isDeleting}
              style={{ flex: 1 }}
              onClick={handleDelete}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </Container>
  );
};
