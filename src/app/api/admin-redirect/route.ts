import { auth } from "@/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get('authjs.session-token')?.value ||
    cookieStore.get('__Secure-authjs.session-token')?.value;

  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:4001';

  const redirectUrl = new URL(adminUrl);
  redirectUrl.searchParams.set('token', session.user.id);
  if (sessionToken) {
    redirectUrl.searchParams.set('session', sessionToken);
  }

  return NextResponse.json({ url: redirectUrl.toString() });
};
