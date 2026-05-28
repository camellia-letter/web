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
    sendCustom: (options: {
      templateId: number;
      templateArgs?: Record<string, string>;
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
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js"
      integrity="sha384-OL+ylM/iuPLtW5U3XcvLSGhE8JzReKDank5InqlHGWPhb4140/yrBw0bg0y7+C9J"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={handleLoad}
    />
  );
};
