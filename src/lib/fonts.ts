/**
 * Next.js Font Optimization
 *
 * next/font를 사용하여 폰트를 최적화합니다:
 * - 자동 셀프 호스팅 (Google Fonts CDN 요청 제거)
 * - CLS(Cumulative Layout Shift) 제거
 * - 자동 서브셋 생성 및 preload
 */

import localFont from 'next/font/local';
import { Noto_Sans_KR, Noto_Serif_KR, Gowun_Batang, Nanum_Myeongjo } from 'next/font/google';

export const maruBuri = localFont({
  src: [
    {
      path: '../app/fonts/MaruBuri-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../app/fonts/MaruBuri-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../app/fonts/MaruBuri-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../app/fonts/MaruBuri-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../app/fonts/MaruBuri-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-maru-buri',
  preload: true,
});

// 기본 폰트 (Pretendard 대체) - Noto Sans KR
export const notoSans = Noto_Sans_KR({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
  preload: true,
});

// Noto Serif KR
export const notoSerif = Noto_Serif_KR({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif',
  preload: false, // 기본 폰트가 아니므로 필요시에만 로드
});

// Gowun Batang
export const gowunBatang = Gowun_Batang({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gowun-batang',
  preload: false,
});

// Nanum Myeongjo
export const nanumMyeongjo = Nanum_Myeongjo({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nanum-myeongjo',
  preload: false,
});

/**
 * 폰트 패밀리 CSS 값 매핑
 * ThemeContext에서 사용할 실제 CSS font-family 문자열
 */
export const FONT_FAMILY_CSS = {
  // Pretendard → Noto Sans KR로 대체 (가장 유사한 한글 sans-serif)
  pretendard: maruBuri.style.fontFamily,
  'noto-serif': notoSerif.style.fontFamily,
  'gowun-batang': gowunBatang.style.fontFamily,
  'nanum-myeongjo': nanumMyeongjo.style.fontFamily,
  // Cafe24Surround → MaruBuri로 대체
  'cafe24-surround': maruBuri.style.fontFamily,
} as const;
