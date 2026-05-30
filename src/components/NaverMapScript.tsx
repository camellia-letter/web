'use client';

import Script from 'next/script';

interface NaverMapsSDK {
  maps: {
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
    naver: NaverMapsSDK | undefined;
  }
}

interface NaverMapScriptProps {
  onLoad?: () => void;
}

export const NaverMapScript = ({ onLoad }: NaverMapScriptProps) => {
  const handleLoad = () => {
    if (window.naver && window.naver.maps) {
      onLoad?.();
    }
  };

  return (
    <Script
      src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
      onLoad={handleLoad}
      strategy="lazyOnload"
    />
  );
};
