import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthError, applyAdminSession, getAdminSession } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    const payload = {
      authenticated: session.authenticated,
      user: session.user || null,
      transient: Boolean(session.transient),
    };

    // 瞬时网络错误返回 503，前端不应因此清会话/强退
    const status = session.transient ? 503 : 200;
    return applyAdminSession(NextResponse.json(payload, { status }), session, request);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { authenticated: false, transient: error.code === 'service' || error.code === 'configuration', message: error.message },
        { status: error.status },
      );
    }
    console.error('Supabase admin session validation failed', error);
    return NextResponse.json({ authenticated: false, transient: true, message: '会话验证失败' }, { status: 500 });
  }
}