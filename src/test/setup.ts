import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// 각 테스트 후 cleanup
afterEach(() => {
  cleanup();
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
  configurable: true,
});

// Mock next/font - next/font는 빌드 타임에만 작동하므로 테스트 환경에서는 모킹 필요
vi.mock('@/lib/fonts', () => ({
  maruBuri: {
    style: { fontFamily: 'MaruBuri, sans-serif' },
    className: 'font-maru-buri',
    variable: '--font-maru-buri',
  },
  notoSans: {
    style: { fontFamily: 'Noto Sans KR, sans-serif' },
    className: 'font-noto-sans',
    variable: '--font-noto-sans',
  },
  notoSerif: {
    style: { fontFamily: 'Noto Serif KR, serif' },
    className: 'font-noto-serif',
    variable: '--font-noto-serif',
  },
  gowunBatang: {
    style: { fontFamily: 'Gowun Batang, serif' },
    className: 'font-gowun-batang',
    variable: '--font-gowun-batang',
  },
  nanumMyeongjo: {
    style: { fontFamily: 'Nanum Myeongjo, serif' },
    className: 'font-nanum-myeongjo',
    variable: '--font-nanum-myeongjo',
  },
  FONT_FAMILY_CSS: {
    pretendard: 'MaruBuri, sans-serif',
    'noto-serif': 'Noto Serif KR, serif',
    'gowun-batang': 'Gowun Batang, serif',
    'nanum-myeongjo': 'Nanum Myeongjo, serif',
    'cafe24-surround': 'MaruBuri, sans-serif',
  },
}));
