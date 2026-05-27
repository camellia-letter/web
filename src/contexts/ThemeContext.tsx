'use client';

import { createContext, useContext, ReactNode } from "react";
import { DEFAULT_THEME } from "@camellia-letter/shared-types";
import type { InvitationTheme, FontFamily, GradientConfig } from "@camellia-letter/shared-types";
import { FONT_FAMILY_CSS } from "@/lib/fonts";

interface ThemeContextType {
  theme: InvitationTheme;
  colors: InvitationTheme['colors'];
  fontFamily: string;
  borderRadius: string;
  gradientCSS: string | null;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

// 폰트 패밀리 CSS 값 매핑 (next/font에서 최적화된 폰트 사용)
const FONT_FAMILY_MAP: Record<FontFamily, string> = FONT_FAMILY_CSS;

// 모서리 둥글기 CSS 값 매핑
const BORDER_RADIUS_MAP: Record<string, string> = {
  none: '0',
  small: '0.25rem',
  medium: '0.5rem',
  large: '1rem',
};

// 그라디언트 CSS 생성
const getGradientCSS = (gradient: GradientConfig | undefined): string | null => {
  if (!gradient?.enabled) return null;

  const directionMap: Record<GradientConfig['direction'], string> = {
    'to-b': '180deg',
    'to-t': '0deg',
    'to-r': '90deg',
    'to-l': '270deg',
    'to-br': '135deg',
    'to-bl': '225deg',
    'to-tr': '45deg',
    'to-tl': '315deg',
  };

  if (gradient.type === 'linear') {
    const colors = gradient.viaColor
      ? `${gradient.fromColor}, ${gradient.viaColor}, ${gradient.toColor}`
      : `${gradient.fromColor}, ${gradient.toColor}`;
    return `linear-gradient(${directionMap[gradient.direction]}, ${colors})`;
  } else {
    const colors = gradient.viaColor
      ? `${gradient.fromColor}, ${gradient.viaColor}, ${gradient.toColor}`
      : `${gradient.fromColor}, ${gradient.toColor}`;
    return `radial-gradient(circle, ${colors})`;
  }
};

interface ThemeProviderProps {
  theme: InvitationTheme | undefined;
  children: ReactNode;
}

export const ThemeProvider = ({ theme, children }: ThemeProviderProps) => {
  const currentTheme = theme || DEFAULT_THEME;

  const value: ThemeContextType = {
    theme: currentTheme,
    colors: currentTheme.colors,
    fontFamily: FONT_FAMILY_MAP[currentTheme.fontFamily] || FONT_FAMILY_MAP.pretendard,
    borderRadius: BORDER_RADIUS_MAP[currentTheme.borderRadius || 'medium'],
    gradientCSS: getGradientCSS(currentTheme.gradient),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // 기본 테마 반환 (ThemeProvider 없이 사용할 경우)
    return {
      theme: DEFAULT_THEME,
      colors: DEFAULT_THEME.colors,
      fontFamily: FONT_FAMILY_CSS.pretendard,
      borderRadius: BORDER_RADIUS_MAP.medium,
      gradientCSS: null,
    };
  }
  return context;
};
