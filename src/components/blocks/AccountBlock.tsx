'use client';

import { useState } from "react";
import { Accordion, Button, Container, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import type { AccountInfo, AccountBlockData, ThemeColors } from "@camellia-letter/shared-types";
import { useTheme } from "@/contexts/ThemeContext";
import { withAlpha } from "@/lib/themeUtils";

interface AccountBlockProps {
  data: AccountBlockData;
}

export const AccountBlock = ({ data }: AccountBlockProps) => {
  const { colors, fontFamily, borderRadius } = useTheme();

  const {
    title = '마음 전하실 곳',
    description = '',
    initialCollapsed = true,
    groomTitle = '신랑측',
    groomAccounts = [],
    brideTitle = '신부측',
    brideAccounts = [],
  } = data;

  const hasGroomAccounts = groomAccounts.length > 0;
  const hasBrideAccounts = brideAccounts.length > 0;

  if (!hasGroomAccounts && !hasBrideAccounts) {
    return null;
  }

  return (
    <Paper
      py={48}
      radius={0}
      style={{
        background: `linear-gradient(to bottom, ${withAlpha(colors.secondary, 0.2)}, ${colors.background})`,
      }}
    >
      <Container size="sm">
        <Stack gap="xl" style={{ fontFamily }}>
          <Stack gap="md" align="center">
            <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
              {title}
            </Title>
            {description && (
              <Text
                size="sm"
                ta="center"
                style={{ color: colors.text, opacity: 0.8, whiteSpace: 'pre-line' }}
              >
                {description}
              </Text>
            )}
          </Stack>

          <Stack gap="md">
            {hasGroomAccounts && (
              <AccountSection
                title={groomTitle}
                accounts={groomAccounts}
                variant="groom"
                colors={colors}
                borderRadius={borderRadius}
                initialCollapsed={initialCollapsed}
              />
            )}

            {hasBrideAccounts && (
              <AccountSection
                title={brideTitle}
                accounts={brideAccounts}
                variant="bride"
                colors={colors}
                borderRadius={borderRadius}
                initialCollapsed={initialCollapsed}
              />
            )}
          </Stack>
        </Stack>
      </Container>
    </Paper>
  );
};

interface AccountSectionProps {
  title: string;
  accounts: AccountInfo[];
  variant: 'groom' | 'bride';
  colors: ThemeColors;
  borderRadius: string;
  initialCollapsed: boolean;
}

const AccountSection = ({
  title,
  accounts,
  variant,
  colors,
  borderRadius,
  initialCollapsed,
}: AccountSectionProps) => {
  const sectionColor = variant === 'groom' ? colors.primary : colors.accent;

  return (
    <Paper
      style={{
        backgroundColor: withAlpha(sectionColor, 0.05),
        border: `1px solid ${withAlpha(sectionColor, 0.2)}`,
        borderRadius,
      }}
    >
      <Accordion
        defaultValue={!initialCollapsed ? title : undefined}
        styles={{
          control: {
            padding: '0rem 1rem',
            borderRadius: borderRadius,
            '&:hover': {
              backgroundColor: withAlpha(sectionColor, 0.15),
            },
          },
          content: {
            padding: '1rem 1rem 0.75rem',
          },
          item: {
            border: 'none',
            borderRadius: borderRadius,
            overflow: 'hidden',
          },
          chevron: {
            color: sectionColor,
          },
        }}
      >
        <Accordion.Item value={title}>
          <Accordion.Control>
            <Text fw={600} style={{ color: sectionColor }}>
              {title}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              {accounts.map((account) => (
                <AccountItem
                  key={`${account.bank}-${account.accountNumber}`}
                  account={account}
                  buttonColor={sectionColor}
                  textColor={colors.text}
                  borderRadius={borderRadius}
                />
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Paper>
  );
};

interface AccountItemProps {
  account: AccountInfo;
  buttonColor: string;
  textColor: string;
  borderRadius: string;
}

const AccountItem = ({ account, buttonColor, textColor, borderRadius }: AccountItemProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = account.accountNumber;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Paper p="md" shadow="sm" style={{ borderRadius }}>
      <Flex justify="space-between" align="center" gap="md">
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" style={{ color: textColor, opacity: 0.6 }}>
            {account.bank}
          </Text>
          <Text fw={600} truncate style={{ color: textColor }}>
            {account.accountNumber}
          </Text>
          <Text size="sm" style={{ color: textColor, opacity: 0.7 }}>
            {account.holder}
          </Text>
        </Stack>
        <Button
          onClick={handleCopy}
          size="sm"
          radius="md"
          style={{ backgroundColor: buttonColor, flexShrink: 0 }}
        >
          {copied ? '복사됨!' : '복사'}
        </Button>
      </Flex>
    </Paper>
  );
};
