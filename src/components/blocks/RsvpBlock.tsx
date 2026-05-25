'use client';

import { useState } from 'react';
import {
  Button,
  Container,
  NativeSelect,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { createRsvp } from '@/lib/api';
import type { RsvpBlockData, AttendanceStatus, MealType } from '@camellia-letter/shared-types';
import type { CreateRsvpDto } from '@camellia-letter/shared-types';
import { CreateRsvpDtoSchema } from '@camellia-letter/shared-types';
import { useTheme } from '@/contexts/ThemeContext';
import { withAlpha } from '@/lib/themeUtils';

interface RsvpBlockProps {
  invitationId: string;
  data: RsvpBlockData;
}

export const RsvpBlock = ({ invitationId, data }: RsvpBlockProps) => {
  const { colors, fontFamily, borderRadius } = useTheme();

  const {
    title = '참석 여부',
    description = '참석 여부를 알려주세요.',
    deadline,
    showMealOption = false,
    showGuestCount = true,
  } = data;

  const [formData, setFormData] = useState<{
    name: string;
    phoneNumber: string;
    attendance: AttendanceStatus;
    guestCount: number;
    mealType: MealType;
    message: string;
    side: 'groom' | 'bride' | '';
  }>({
    name: '',
    phoneNumber: '',
    attendance: 'attending',
    guestCount: 1,
    mealType: 'standard',
    message: '',
    side: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isExpired = deadline ? new Date(deadline) < new Date() : false;

  const inputStyles = {
    input: {
      borderColor: colors.secondary,
      borderRadius,
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const rsvpData: CreateRsvpDto = {
      invitationId,
      name: formData.name.trim(),
      phoneNumber: formData.phoneNumber.trim() || undefined,
      attendance: formData.attendance,
      guestCount: formData.attendance === 'attending' ? formData.guestCount : 1,
      mealType:
        showMealOption && formData.attendance === 'attending' ? formData.mealType : undefined,
      message: formData.message.trim() || undefined,
      side: formData.side || undefined,
    };

    const validation = CreateRsvpDtoSchema.safeParse(rsvpData);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      setError(firstError.message);
      return;
    }

    setIsSubmitting(true);

    const result = await createRsvp(rsvpData);

    if (result) {
      setIsSubmitted(true);
    } else {
      setError('제출에 실패했습니다. 다시 시도해주세요.');
    }

    setIsSubmitting(false);
  };

  if (isExpired) {
    return (
      <Paper
        py={48}
        radius={0}
        style={{ backgroundColor: withAlpha(colors.background, 0.5), fontFamily }}
      >
        <Container size="sm">
          <Stack gap="md" align="center">
            <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
              {title}
            </Title>
            <Text ta="center" style={{ color: colors.text, opacity: 0.6 }}>
              참석 여부 응답이 마감되었습니다.
            </Text>
          </Stack>
        </Container>
      </Paper>
    );
  }

  if (isSubmitted) {
    return (
      <Paper
        py={48}
        radius={0}
        style={{
          background: `linear-gradient(to bottom, ${withAlpha(colors.secondary, 0.2)}, ${colors.background})`,
          fontFamily,
        }}
      >
        <Container size="sm">
          <Stack gap="md" align="center">
            <Text fz={48}>💌</Text>
            <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
              감사합니다!
            </Title>
            <Text ta="center" style={{ color: colors.text, opacity: 0.8 }}>
              참석 여부가 전달되었습니다.
            </Text>
          </Stack>
        </Container>
      </Paper>
    );
  }

  return (
    <Paper
      py={48}
      radius={0}
      style={{
        background: `linear-gradient(to bottom, ${withAlpha(colors.secondary, 0.2)}, ${colors.background})`,
        fontFamily,
      }}
    >
      <Container size="sm">
        <Paper p="xl" shadow="sm" style={{ borderRadius: `calc(${borderRadius} * 2)` }}>
          <Stack gap="lg">
            <Stack gap={6} align="center">
              <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
                {title}
              </Title>
              {description && (
                <Text size="sm" ta="center" style={{ color: colors.text, opacity: 0.6 }}>
                  {description}
                </Text>
              )}
              {deadline && (
                <Text size="xs" ta="center" style={{ color: colors.primary }}>
                  응답 마감: {new Date(deadline).toLocaleDateString('ko-KR')}
                </Text>
              )}
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="이름 *"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setFormData((prev) => ({ ...prev, name: value }));
                  }}
                  styles={inputStyles}
                />

                <TextInput
                  label="연락처"
                  placeholder="010-1234-5678"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setFormData((prev) => ({ ...prev, phoneNumber: value }));
                  }}
                  styles={inputStyles}
                />

                <NativeSelect
                  label="구분"
                  data={[
                    { value: '', label: '선택안함' },
                    { value: 'groom', label: '신랑측' },
                    { value: 'bride', label: '신부측' },
                  ]}
                  value={formData.side}
                  onChange={(e) => {
                    const value = e.currentTarget.value as 'groom' | 'bride' | '';
                    setFormData((prev) => ({ ...prev, side: value }));
                  }}
                  styles={inputStyles}
                />

                <Stack gap="xs">
                  <Text size="sm" fw={500} style={{ color: colors.text }}>
                    참석 여부 *
                  </Text>
                  <SimpleGrid cols={3} spacing="sm">
                    {[
                      { value: 'attending', label: '참석', emoji: '😊' },
                      { value: 'not_attending', label: '불참', emoji: '😢' },
                      { value: 'undecided', label: '미정', emoji: '🤔' },
                    ].map((option) => {
                      const selected = formData.attendance === option.value;

                      return (
                        <Paper
                          key={option.value}
                          p="md"
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              attendance: option.value as AttendanceStatus,
                            }))
                          }
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setFormData((prev) => ({
                                ...prev,
                                attendance: option.value as AttendanceStatus,
                              }));
                            }
                          }}
                          style={{
                            cursor: 'pointer',
                            border: `1px solid ${selected ? colors.primary : colors.secondary}`,
                            backgroundColor: selected
                              ? withAlpha(colors.primary, 0.1)
                              : 'transparent',
                            borderRadius,
                          }}
                        >
                          <Stack gap={4} align="center">
                            <Text fz={24}>{option.emoji}</Text>
                            <Text size="sm" style={{ color: colors.text }}>
                              {option.label}
                            </Text>
                          </Stack>
                        </Paper>
                      );
                    })}
                  </SimpleGrid>
                </Stack>

                {showGuestCount && formData.attendance === 'attending' && (
                  <NativeSelect
                    label="참석 인원 (본인 포함)"
                    data={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}명` }))}
                    value={String(formData.guestCount)}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      setFormData((prev) => ({
                        ...prev,
                        guestCount: parseInt(value, 10) || 1,
                      }));
                    }}
                    styles={inputStyles}
                  />
                )}

                {showMealOption && formData.attendance === 'attending' && (
                  <NativeSelect
                    label="식사"
                    data={[
                      { value: 'standard', label: '일반식' },
                      { value: 'vegetarian', label: '채식' },
                      { value: 'none', label: '식사 안함' },
                    ]}
                    value={formData.mealType}
                    onChange={(e) => {
                      const value = e.currentTarget.value as MealType;
                      setFormData((prev) => ({ ...prev, mealType: value }));
                    }}
                    styles={inputStyles}
                  />
                )}

                <Textarea
                  label="축하 메시지 (선택)"
                  placeholder="축하 메시지를 남겨주세요"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setFormData((prev) => ({ ...prev, message: value }));
                  }}
                  styles={inputStyles}
                />

                {error && (
                  <Text size="sm" ta="center" style={{ color: colors.accent }}>
                    {error}
                  </Text>
                )}

                <Button
                  type="submit"
                  fullWidth
                  radius="md"
                  loading={isSubmitting}
                  style={{ backgroundColor: colors.primary }}
                >
                  {isSubmitting ? '제출 중...' : '참석 여부 제출'}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </Paper>
  );
};
