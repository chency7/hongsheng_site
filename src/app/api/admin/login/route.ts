import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AdminAuthError, setAdminSessionCookies, signInAdminWithPassword } from '@/lib/admin-auth';

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(256),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: '请输入有效的邮箱和密码' }, { status: 400 });
  }

  try {
    const { session, user } = await signInAdminWithPassword(parsed.data.email, parsed.data.password);
    const response = NextResponse.json({ ok: true, user });
    setAdminSessionCookies(response, session);
    return response;
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }
    console.error('Supabase admin login failed', error);
    return NextResponse.json({ ok: false, message: '登录服务暂时不可用，请稍后重试' }, { status: 500 });
  }
}
