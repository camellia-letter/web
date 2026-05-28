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
      success?: () => void;
      fail?: (error: Error) => void;
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
      src="https://developers.kakao.com/sdk/js/kakao.js"
      strategy="afterInteractive"
      onLoad={handleLoad}
    />
  );
};
