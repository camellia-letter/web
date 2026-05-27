import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getInvitationByIdOrSlug } from "@/lib/api";
import { formatDateKR, safeParseDate } from "@/lib/dateUtils";
import { ThemedContent } from "@/components/ThemedContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id: idOrSlug } = await params;
  const invitation = await getInvitationByIdOrSlug(idOrSlug);

  if (!invitation) {
    return { title: '청첩장을 찾을 수 없습니다' };
  }

  const title = `${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다`;
  const formattedDate = formatDateKR(invitation.weddingDate, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const description = `${formattedDate} | ${invitation.venue}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';
  const url = invitation.slug
    ? `${baseUrl}/invitation/${invitation.slug}`
    : `${baseUrl}/invitation/${invitation.id}`;

  // 이미지 URL을 절대 URL로 변환
  const absoluteImageUrl = invitation.mainImageUrl
    ? invitation.mainImageUrl.startsWith('http')
      ? invitation.mainImageUrl
      : `${baseUrl}${invitation.mainImageUrl}`
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      ...(absoluteImageUrl && {
        images: [{ url: absoluteImageUrl, width: 800, height: 400 }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(absoluteImageUrl && {
        images: [absoluteImageUrl],
      }),
    },
  };
};

const InvitationPage = async ({ params }: PageProps) => {
  const { id: idOrSlug } = await params;
  const invitation = await getInvitationByIdOrSlug(idOrSlug);

  if (!invitation) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';
  // slug가 있으면 slug 기반 URL 사용, 없으면 ID 사용
  const invitationUrl = invitation.slug
    ? `${baseUrl}/invitation/${invitation.slug}`
    : `${baseUrl}/invitation/${invitation.id}`;

  // 이미지 URL을 절대 URL로 변환
  const absoluteImageUrl = invitation.mainImageUrl
    ? invitation.mainImageUrl.startsWith('http')
      ? invitation.mainImageUrl
      : `${baseUrl}${invitation.mainImageUrl}`
    : undefined;

  const startDate = safeParseDate(invitation.weddingDate);
  const jsonLd = startDate
    ? {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: `${invitation.groomName} ♥ ${invitation.brideName} 결혼식`,
        startDate: startDate.toISOString(),
        endDate: new Date(startDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: invitation.venue,
          address: invitation.venueAddress,
        },
        url: invitationUrl,
        ...(absoluteImageUrl && { image: absoluteImageUrl }),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ThemedContent invitation={invitation} invitationUrl={invitationUrl} />
    </>
  );
};

export default InvitationPage;
