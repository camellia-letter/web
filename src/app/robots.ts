import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';

  return {
    rules: {
      userAgent: '*',
      allow: '/invitation/',
      disallow: ['/api/', '/auth/', '/dashboard/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
};

export default robots;
