'use client';

import { Container, Stack, Text, Box, Flex, Divider } from "@mantine/core";
import type { ParentsBlockData } from "@camellia-letter/shared-types";
import { useTheme } from "@/contexts/ThemeContext";
import { withAlpha } from "@/lib/themeUtils";

interface ParentsBlockProps {
  data: ParentsBlockData;
  groomName: string;
  brideName: string;
}

export const ParentsBlock = ({ data, groomName, brideName }: ParentsBlockProps) => {
  const { colors, fontFamily } = useTheme();

  const { groomFatherName, groomMotherName, brideFatherName, brideMotherName } = data;

  // Check if any parent info exists
  const hasGroomParents = groomFatherName || groomMotherName;
  const hasBrideParents = brideFatherName || brideMotherName;

  if (!hasGroomParents && !hasBrideParents) {
    return null;
  }

  return (
    <Box py={48} style={{ backgroundColor: withAlpha(colors.secondary, 0.15) }}>
      <Container size="sm">
        <Stack gap={32} style={{ fontFamily }}>
          {hasGroomParents && (
            <ParentRow
              side="신랑"
              fatherName={groomFatherName}
              motherName={groomMotherName}
              childName={groomName}
              childLabel="아들"
              colors={colors}
            />
          )}

          {hasGroomParents && hasBrideParents && <Divider color={colors.text} opacity={0.1} />}

          {hasBrideParents && (
            <ParentRow
              side="신부"
              fatherName={brideFatherName}
              motherName={brideMotherName}
              childName={brideName}
              childLabel="딸"
              colors={colors}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
};

interface ParentRowProps {
  side: string;
  fatherName?: string;
  motherName?: string;
  childName: string;
  childLabel: string;
  colors: {
    text: string;
  };
}

const ParentRow = ({
  side,
  fatherName,
  motherName,
  childName,
  childLabel,
  colors,
}: ParentRowProps) => {
  return (
    <Flex justify="space-between" align="center" p="md" gap="md" wrap="nowrap">
      {/* 왼쪽: 신랑/신부 */}
      <Text
        size="md"
        fw={500}
        style={{
          color: colors.text,
          minWidth: 50,
          textAlign: 'left',
        }}
      >
        {side}
      </Text>

      {/* 가운데: 부모님 이름 + "의" */}
      <Flex align="center" gap={8} style={{ flex: 1, justifyContent: 'center' }}>
        {/* 부모님 이름 (세로) */}
        <Stack gap={4} style={{ alignItems: 'center' }}>
          {fatherName && (
            <Text
              size="md"
              fw={600}
              style={{
                color: colors.text,
                whiteSpace: 'nowrap',
              }}
            >
              {fatherName}
            </Text>
          )}
          {motherName && (
            <Text
              size="md"
              fw={600}
              style={{
                color: colors.text,
                whiteSpace: 'nowrap',
              }}
            >
              {motherName}
            </Text>
          )}
        </Stack>

        {/* "의" - 부모 이름 옆에 별도로 */}
        {fatherName && motherName && (
          <Text
            size="xs"
            fw={400}
            style={{
              color: colors.text,
              opacity: 0.6,
            }}
          >
            의
          </Text>
        )}
      </Flex>

      {/* 오른쪽: 아들/딸 이름 */}
      <Flex align="center" gap={4} style={{ minWidth: 80, justifyContent: 'flex-end' }}>
        <Text
          size="xs"
          fw={400}
          style={{
            color: colors.text,
            opacity: 0.6,
          }}
        >
          {childLabel}
        </Text>
        <Text
          size="md"
          fw={600}
          style={{
            color: colors.text,
            whiteSpace: 'nowrap',
          }}
        >
          {childName}
        </Text>
      </Flex>
    </Flex>
  );
};
