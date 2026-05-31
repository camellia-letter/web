import { notFound } from "next/navigation";
import { getInvitationByIdOrSlug } from "@/lib/api";
import { RsvpListContent } from "./RsvpListContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RsvpListPage({ params }: PageProps) {
  const { id } = await params;
  const invitation = await getInvitationByIdOrSlug(id);

  if (!invitation) {
    notFound();
  }

  return <RsvpListContent invitation={invitation} />;
}
