import { notFound } from "next/navigation";
import { getInvitationByIdOrSlug } from "@/lib/api";
import { RsvpListContent } from "./RsvpListContent";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params;
  const invitation = await getInvitationByIdOrSlug(id);

  if (!invitation) {
    return {
      title: 'RSVP 목록 - Camellia Letter',
    };
  }

  return {
    title: `${invitation.groomName} & ${invitation.brideName} RSVP 목록 - Camellia Letter`,
    description: `${invitation.groomName}님과 ${invitation.brideName}님의 결혼식 참석 확인 목록`,
  };
};

export default async function RsvpListPage({ params }: PageProps) {
  const { id } = await params;
  const invitation = await getInvitationByIdOrSlug(id);

  if (!invitation) {
    notFound();
  }

  return <RsvpListContent invitation={invitation} />;
}
