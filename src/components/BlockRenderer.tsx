import { useMemo, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { Stack, Skeleton as MantineSkeleton } from "@mantine/core";
import type { InvitationBlock, Invitation } from "@camellia-letter/shared-types";
import { AnimatedBlock } from "@/components/AnimatedBlock";

// Light components - static import (always needed, small size)
import { HeaderBlock } from "@/components/blocks/HeaderBlock";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { MessageBlock } from "@/components/blocks/MessageBlock";
import { InfoBlock } from "@/components/blocks/InfoBlock";

// Block loading skeleton
const BlockSkeleton = () => {
  return (
    <Stack gap="sm" py="xl" px="md" align="center">
      <MantineSkeleton height={24} width={128} radius="xl" />
      <MantineSkeleton height={16} width={192} radius="xl" />
      <MantineSkeleton height={16} width={160} radius="xl" />
    </Stack>
  );
};

// MapBlock skeleton - matches 200px map height to prevent CLS
const MapBlockSkeleton = dynamic(() =>
  import('@/components/skeletons/MapBlockSkeleton').then((mod) => mod.MapBlockSkeleton),
);

// Heavy components - dynamic import (lazy loaded)
const MapBlock = dynamic(() => import('@/components/blocks/MapBlock').then((mod) => mod.MapBlock), {
  loading: () => <MapBlockSkeleton />,
  ssr: false, // Kakao SDK requires client-side rendering
});

const GalleryBlock = dynamic(
  () => import('@/components/blocks/GalleryBlock').then((mod) => mod.GalleryBlock),
  {
    loading: () => <BlockSkeleton />,
    ssr: false, // Prevent hydration mismatch from responsive gallery UI
  },
);

const GuestbookBlock = dynamic(
  () => import('@/components/blocks/GuestbookBlock').then((mod) => mod.GuestbookBlock),
  {
    loading: () => <BlockSkeleton />,
    ssr: false, // Uses client-side API calls
  },
);

const AccountBlock = dynamic(
  () => import('@/components/blocks/AccountBlock').then((mod) => mod.AccountBlock),
  {
    loading: () => <BlockSkeleton />,
    ssr: false, // Prevent hydration mismatch from Mantine account block styles
  },
);

const TransportBlock = dynamic(
  () => import('@/components/blocks/TransportBlock').then((mod) => mod.TransportBlock),
  {
    loading: () => <BlockSkeleton />,
    ssr: false, // Prevent hydration mismatch from dynamic color styles
  },
);

const RsvpBlock = dynamic(
  () => import('@/components/blocks/RsvpBlock').then((mod) => mod.RsvpBlock),
  {
    loading: () => <BlockSkeleton />,
    ssr: false, // Uses client-side API calls and form state
  },
);

const ParentsBlock = dynamic(
  () => import('@/components/blocks/ParentsBlock').then((mod) => mod.ParentsBlock),
  {
    loading: () => <BlockSkeleton />,
    ssr: false, // Prevent hydration mismatch from Mantine styles
  },
);

interface BlockRendererProps {
  blocks: InvitationBlock[];
  invitation: Invitation;
}

// 메모이제이션된 AnimatedBlock 래퍼
const MemoizedAnimatedBlock = memo(
  ({
    block,
    index,
    children,
  }: {
    block: InvitationBlock;
    index: number;
    children: React.ReactNode;
  }) => {
    return (
      <AnimatedBlock key={block.id} animation="fade-up" delay={index * 100}>
        {children}
      </AnimatedBlock>
    );
  },
);

export const BlockRenderer = ({ blocks, invitation }: BlockRendererProps) => {
  // 메모이제이션: blocks 정렬 (blocks 배열이 변경될 때만 재계산)
  const sortedBlocks = useMemo(() => [...blocks].sort((a, b) => a.order - b.order), [blocks]);

  // 메모이제이션: renderBlock 함수
  const renderBlock = useCallback(
    (block: InvitationBlock) => {
      switch (block.type) {
        case 'HEADER':
          return (
            <HeaderBlock
              data={block.data}
              groomName={invitation.groomName}
              brideName={invitation.brideName}
            />
          );

        case 'HERO':
          return <HeroBlock data={block.data} />;

        case 'MESSAGE':
          return <MessageBlock data={block.data} />;

        case 'INFO':
          return (
            <InfoBlock
              groomName={invitation.groomName}
              brideName={invitation.brideName}
              weddingDate={invitation.weddingDate}
            />
          );

        case 'PARENTS':
          return (
            <ParentsBlock
              data={block.data}
              groomName={invitation.groomName}
              brideName={invitation.brideName}
            />
          );

        case 'MAP':
          return (
            <MapBlock
              venue={invitation.venue}
              venueAddress={invitation.venueAddress}
              venueLat={invitation.venueLat}
              venueLng={invitation.venueLng}
            />
          );

        case 'GALLERY':
          return <GalleryBlock data={block.data} />;

        case 'GUESTBOOK':
          return <GuestbookBlock invitationId={invitation.id} />;

        case 'ACCOUNT':
          return <AccountBlock data={block.data} />;

        case 'TRANSPORT':
          return <TransportBlock data={block.data} />;

        case 'RSVP':
          return <RsvpBlock invitationId={invitation.id} data={block.data} />;

        default: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const _exhaustive: never = block;
          return null;
        }
      }
    },
    [invitation],
  );

  return (
    <>
      {sortedBlocks.map((block, index) => (
        <MemoizedAnimatedBlock key={block.id} block={block} index={index}>
          {renderBlock(block)}
        </MemoizedAnimatedBlock>
      ))}
    </>
  );
};
