import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";

// 환경 변수 검증
const requiredEnvVars = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file or Vercel environment variables.`,
  );
}

const naverProvider =
  process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET
    ? Naver({
        clientId: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
      })
    : null;

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile(profile: any) {
        const imageUrl = profile.kakao_account?.profile?.profile_image_url;
        return {
          id: String(profile.id),
          name: profile.kakao_account?.profile?.nickname || null,
          email: profile.kakao_account?.email || null,
          // http를 https로 변경하여 CSP 에러 방지
          image: imageUrl ? imageUrl.replace('http://', 'https://') : null,
        };
      },
    }),
    ...(naverProvider ? [naverProvider] : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // API에 사용자 정보 전송하여 DB 저장
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/oauth-signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
            email: user.email,
            name: user.name,
            image: user.image,
          }),
        });

        if (!response.ok) return false;

        const data = await response.json();
        user.id = data.userId;
        user.sessionToken = data.sessionToken;

        return true;
      } catch (error) {
        console.error('OAuth sign-in error:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // 첫 로그인 시 user 정보를 token에 저장
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.sessionToken = user.sessionToken;
      }
      return token;
    },
    async session({ session, token }) {
      // JWT token의 정보를 session에 전달
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.sessionToken = token.sessionToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
