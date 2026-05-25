import type { ThemeColors } from '@camellia-letter/shared-types';

// 색상을 투명도와 함께 반환
export const withAlpha = (color: string, alpha: number): string => {
  // HEX 색상을 rgba로 변환
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// 테마 색상을 기반으로 스타일 객체 생성
export const createThemedStyles = (colors: ThemeColors) => {
  return {
    // 버튼 스타일
    primaryButton: {
      backgroundColor: colors.primary,
      color: '#FFFFFF',
    },
    secondaryButton: {
      backgroundColor: colors.secondary,
      color: colors.text,
    },
    outlineButton: {
      borderColor: colors.primary,
      color: colors.primary,
      backgroundColor: 'transparent',
    },

    // 텍스트 스타일
    primaryText: {
      color: colors.primary,
    },
    secondaryText: {
      color: colors.secondary,
    },
    bodyText: {
      color: colors.text,
    },
    accentText: {
      color: colors.accent,
    },

    // 배경 스타일
    primaryBg: {
      backgroundColor: colors.primary,
    },
    secondaryBg: {
      backgroundColor: colors.secondary,
    },
    pageBg: {
      backgroundColor: colors.background,
    },
    lightBg: {
      backgroundColor: withAlpha(colors.primary, 0.1),
    },

    // 보더 스타일
    primaryBorder: {
      borderColor: colors.primary,
    },
    secondaryBorder: {
      borderColor: colors.secondary,
    },

    // 특별 요소
    badge: {
      backgroundColor: withAlpha(colors.primary, 0.1),
      color: colors.primary,
    },
    divider: {
      backgroundColor: colors.secondary,
    },

    // 입력 폼
    input: {
      borderColor: colors.secondary,
    },
    inputFocus: {
      borderColor: colors.primary,
      boxShadow: `0 0 0 2px ${withAlpha(colors.primary, 0.2)}`,
    },
  };
};

// CSS 변수 생성 (인라인 스타일에서 사용)
export const generateCssVariables = (colors: ThemeColors): React.CSSProperties => {
  return {
    '--theme-primary': colors.primary,
    '--theme-secondary': colors.secondary,
    '--theme-background': colors.background,
    '--theme-text': colors.text,
    '--theme-accent': colors.accent,
  } as React.CSSProperties;
};
