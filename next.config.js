/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // CloudType 호스팅
      {
        protocol: 'https',
        hostname: '*.cloudtype.app',
      },
      {
        protocol: 'https',
        hostname: 'cloudtype.app',
      },
      // 일반적인 이미지 CDN
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://t1.kakaocdn.net https://developers.kakao.com http://oapi.map.naver.com https://oapi.map.naver.com https://*.pstatic.net http://*.map.naver.net https://*.map.naver.net",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "img-src 'self' data: https: http: blob:",
              "connect-src 'self' https://kapi.kakao.com https://*.kakao.com http://oapi.map.naver.com https://oapi.map.naver.com https://naveropenapi.apigw.ntruss.com https://*.navercorp.com https://*.pstatic.net http://*.map.naver.net https://*.map.naver.net " + (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002'),
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
