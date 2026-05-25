'use client';

import { useEffect, useRef, useState } from 'react';
import { Flex, Text } from '@mantine/core';
import { KakaoMapScript } from './KakaoMapScript';

interface KakaoMapProps {
  lat: number;
  lng: number;
  venue: string;
  level?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const KakaoMap = ({ lat, lng, venue, level = 3, className, style }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setMap] = useState<any>(null);

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
      content: `<div style="padding:5px;font-size:12px;white-space:nowrap;">${venue}</div>`,
    });
    infowindow.open(mapInstance, marker);

    setMap(mapInstance);

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
