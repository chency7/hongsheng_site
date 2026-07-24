import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthError, applyAdminSession, getAdminSession } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    return applyAdminSession(
      NextResponse.json({ authenticated: session.authenticated, user: session.user || null }),
      session,
    );
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ authenticated: false, message: error.message }, { status: error.status });
    }
    console.error('Supabase admin session validation failed', error);
    return NextResponse.json({ authenticated: false, message: '会话验证失败' }, { status: 500 });
  }
}
