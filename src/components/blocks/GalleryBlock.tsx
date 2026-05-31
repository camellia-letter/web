'use client';

import { useState, useCallback, memo } from "react";
import {
  AspectRatio,
  Container,
  Flex,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
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
    onClick,
    backgroundColor,
    borderRadius,
  }: {
    image: GalleryImage;
    index: number;
    onClick: () => void;
    backgroundColor: string;
    borderRadius: string;
  }) => {
    const isExternalUrl = image.url.startsWith('http');

    return (
      <button
        onClick={onClick}
        style={{
          border: 0,
          padding: 0,
          background: 'transparent',
          cursor: 'pointer',
        }}
        aria-label={image.caption || `갤러리 이미지 ${index + 1} 확대`}
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
      </button>
    );
  },
);

export const GalleryBlock = ({ data }: GalleryBlockProps) => {
  const { colors, fontFamily, borderRadius } = useTheme();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const images = data.images || [];

  const handleImageClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

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
                onClick={() => handleImageClick(index)}
                backgroundColor={backgroundColor}
                borderRadius={borderRadius}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <Modal
        opened={selectedImageIndex !== null}
        onClose={handleClose}
        centered
        size="xl"
        withCloseButton
        overlayProps={{ backgroundOpacity: 0.85, blur: 2 }}
        styles={{
          content: { backgroundColor: colors.background },
          header: { backgroundColor: colors.background },
          body: { paddingBottom: '60px' },
          title: { color: colors.text },
          close: { color: colors.text },
        }}
      >
        {selectedImageIndex !== null && (
          <Carousel
            initialSlide={selectedImageIndex}
            styles={{
              control: {
                backgroundColor: withAlpha(colors.primary, 0.3),
                border: 'none',
                color: colors.primary,
                '&:hover': {
                  backgroundColor: withAlpha(colors.primary, 0.5),
                },
              },
            }}
          >
            {images.map((image, index) => {
              const isExternalUrl = image.url.startsWith('http');
              return (
                <Carousel.Slide key={index}>
                  <Stack gap="md">
                    <Flex justify="center">
                      <div style={{ position: 'relative', width: '100%', height: '70vh' }}>
                        {isExternalUrl ? (
                          <Image
                            src={image.url}
                            alt={image.caption || `갤러리 이미지 ${index + 1}`}
                            fill
                            style={{ borderRadius, objectFit: 'contain' }}
                            sizes="100vw"
                            unoptimized
                          />
                        ) : (
                          <Image
                            src={image.url}
                            alt={image.caption || `갤러리 이미지 ${index + 1}`}
                            fill
                            style={{ borderRadius, objectFit: 'contain' }}
                            sizes="100vw"
                          />
                        )}
                      </div>
                    </Flex>
                    {image.caption && (
                      <Text ta="center" style={{ color: colors.text, fontFamily }}>
                        {image.caption}
                      </Text>
                    )}
                  </Stack>
                </Carousel.Slide>
              );
            })}
          </Carousel>
        )}
      </Modal>
    </>
  );
};
