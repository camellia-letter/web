import { DefaultSession } from "next-auth";

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      status?: string;
    } & DefaultSession['user'];
    sessionToken?: string;
  }

  interface User {
    id: string;
    sessionToken?: string;
    status?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    userId?: string;
    sessionToken?: string;
    status?: string;
  }
}
