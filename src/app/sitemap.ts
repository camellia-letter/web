import type { MetadataRoute } from 'next';
import { getInvitations } from '@/lib/api';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  try {
    const invitations = await getInvitations();

    for (const inv of invitations) {
      if (inv.slug) {
        entries.push({
          url: `${baseUrl}/invitation/${inv.slug}`,
          lastModified: inv.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    }
  } catch {
    // DB 연결 실패 시 정적 사이트맵만 반환
  }

  return entries;
};

export default sitemap;
