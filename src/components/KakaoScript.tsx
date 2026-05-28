'use client';

import Script from "next/script";

interface KakaoButton {
  title: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

interface KakaoContent {
  title: string;
  description: string;
  imageUrl?: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share?: {
    sendScrap: (options: { requestUrl: string }) => void;
    sendDefault: (options: {
      objectType: 'feed';
      content: KakaoContent;
      buttons?: KakaoButton[];
    }) => void;
  };
}

declare global {
  interface Window {
    Kakao: KakaoSDK | undefined;
  }
}

export const KakaoScript = () => {
  const handleLoad = () => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (window.Kakao && appKey && !window.Kakao.isInitialized()) {
      window.Kakao.init(appKey);
    }
  };

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js"
      integrity="sha384-6MFdIr0zOira1CHQkedUqJVql0YtcZA1P0nbPrQYJXVJZUkTk/oX4U9GhUIs3/z8"
      crossOrigin="anonymous"
      strategy="afterInteractive" // 페이지 로드 후 비동기로 로드 (성능 최적화)
      onLoad={handleLoad}
    />
  );
};
