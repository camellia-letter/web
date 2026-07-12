'use client';

import { useEffect, useRef, useState } from "react";
import { Flex, Text } from "@mantine/core";
import { KakaoMapScript } from "./KakaoMapScript";

interface KakaoMapProps {
  lat: number;
  lng: number;
  venue: string;
  level?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface KakaoMapInstance {
  setCenter: (position: unknown) => void;
  setLevel: (level: number) => void;
}

const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const KakaoMap = ({ lat, lng, venue, level = 3, className, style }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [, setMap] = useState<KakaoMapInstance | null>(null);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.kakao?.maps) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    const mapInstance = new window.kakao.maps.Map(mapRef.current, {
      center: position,
      level,
    });

    const marker = new window.kakao.maps.Marker({
      position,
      map: mapInstance,
    });

    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;white-space:nowrap;">${escapeHtml(venue)}</div>`,
    });
    infowindow.open(mapInstance, marker);

    setMap(mapInstance as KakaoMapInstance);

    return () => {
      setMap(null);
    };
  }, [isLoaded, lat, lng, venue, level]);

  return (
    <>
      <KakaoMapScript onLoad={() => setIsLoaded(true)} />
      <div
        ref={mapRef}
        className={className}
        style={{
          width: '100%',
          height: '200px',
          ...style,
        }}
      >
        {!isLoaded && (
          <Flex
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f3f4f6',
            }}
          >
            <Text c="dimmed" size="sm">
              지도 로딩 중...
            </Text>
          </Flex>
        )}
      </div>
    </>
  );
};
