'use client';

import { memo } from "react";
import {
  AspectRatio,
  Container,
  Paper,
  SimpleGrid,
  Stack,
  Title,
} from "@mantine/core";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { withAlpha } from "@/lib/themeUtils";

interface GalleryImage {
  url: string;
  caption?: string;
}

interface GalleryBlockProps {
  data: {
    images?: GalleryImage[];
  };
}

const GalleryImageItem = memo(
  ({
    image,
    index,
    backgroundColor,
    borderRadius,
  }: {
    image: GalleryImage;
    index: number;
    backgroundColor: string;
    borderRadius: string;
  }) => {
    const isExternalUrl = image.url.startsWith('http');

    return (
      <div
        style={{
          border: 0,
          padding: 0,
          background: 'transparent',
        }}
      >
        <AspectRatio ratio={1}>
          <Paper
            style={{ position: 'relative', overflow: 'hidden', backgroundColor, borderRadius }}
          >
            {isExternalUrl ? (
              <Image
                src={image.url}
                alt={image.caption || `갤러리 이미지 ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            ) : (
              <Image
                src={image.url}
                alt={image.caption || `갤러리 이미지 ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
            )}
          </Paper>
        </AspectRatio>
      </div>
    );
  },
);

export const GalleryBlock = ({ data }: GalleryBlockProps) => {
  const { colors, fontFamily, borderRadius } = useTheme();
  const images = data.images || [];

  if (images.length === 0) return null;

  const backgroundColor = withAlpha(colors.secondary, 0.2);

  return (
    <>
      <Container size="lg" py={48} style={{ fontFamily }}>
        <Stack gap="lg">
          <Title order={2} size="h3" ta="center" style={{ color: colors.text }}>
            갤러리
          </Title>
          <SimpleGrid cols={3} spacing="sm">
            {images.map((image, index) => (
              <GalleryImageItem
                key={index}
                image={image}
                index={index}
                backgroundColor={backgroundColor}
                borderRadius={borderRadius}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
};
