'use client';

import Script from 'next/script';

interface KakaoMapsSDK {
  maps: {
    load: (callback: () => void) => void;
    LatLng: new (lat: number, lng: number) => unknown;
    Map: new (container: HTMLElement, options: Record<string, unknown>) => unknown;
    Marker: new (options: Record<string, unknown>) => unknown;
    InfoWindow: new (options: Record<string, unknown>) => {
      open: (map: unknown, marker: unknown) => void;
    };
  };
}

declare global {
  interface Window {
    kakao: KakaoMapsSDK | undefined;
  }
}

interface KakaoMapScriptProps {
  onLoad?: () => void;
}

export const KakaoMapScript = ({ onLoad }: KakaoMapScriptProps) => {
  const handleLoad = () => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        onLoad?.();
      });
    }
  };

  return (
    <Script
      src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`}
      onLoad={handleLoad}
      strategy="lazyOnload"
    />
  );
};
