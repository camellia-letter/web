'use client';

import { useEffect, useRef, useState } from "react";
import { Flex, Text } from "@mantine/core";
import { NaverMapScript } from "./NaverMapScript";

interface NaverMapProps {
  lat: number;
  lng: number;
  venue: string;
  level?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const NaverMap = ({ lat, lng, venue, level = 15, className, style }: NaverMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setMap] = useState<any>(null);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.naver?.maps) return;

    const position = new window.naver.maps.LatLng(lat, lng);

    const mapInstance = new window.naver.maps.Map(mapRef.current, {
      center: position,
      zoom: level,
    });

    const marker = new window.naver.maps.Marker({
      position,
      map: mapInstance,
    });

    const infowindow = new window.naver.maps.InfoWindow({
      content: `<div style="padding:8px 12px;font-size:14px;white-space:nowrap;font-weight:500;">${venue}</div>`,
    });
    infowindow.open(mapInstance, marker);

    setMap(mapInstance);

    return () => {
      setMap(null);
    };
  }, [isLoaded, lat, lng, venue, level]);

  return (
    <>
      <NaverMapScript onLoad={() => setIsLoaded(true)} />
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
