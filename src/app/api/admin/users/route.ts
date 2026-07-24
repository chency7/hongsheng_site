import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AdminAuthError, applyAdminSession, getAdminSession } from '@/lib/admin-auth';
import {
  createManagedAdminUser,
  listManagedAdminUsers,
  setManagedAdminRole,
} from '@/lib/admin/auth-users';

const createUserSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(256),
  isAdmin: z.boolean().default(true),
});

const updateUserSchema = z.object({
  userId: z.string().uuid(),
  isAdmin: z.boolean(),
});

function authErrorResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
  }
  console.error('Supabase admin users API failed', error);
  return NextResponse.json({ ok: false, message: '账号权限服务暂时不可用' }, { status: 503 });
}

async function requireAdminSession(request: NextRequest) {
  const session = await getAdminSession(request).catch((error) => error);
  if (session instanceof Error) return { session, response: authErrorResponse(session) };
  if (!session.authenticated) {
    return {
      session,
      response: applyAdminSession(NextResponse.json({ ok: false, message: '未登录' }, { status: 401 }), session),
    };
  }
  return { session, response: null };
}

export async function GET(request: NextRequest) {
  const { session, response } = await requireAdminSession(request);
  if (response) return response;

  const users = await listManagedAdminUsers().catch((error) => error);
  if (users instanceof Error) return applyAdminSession(authErrorResponse(users), session);

  return applyAdminSession(NextResponse.json({ ok: true, users }), session);
}

export async function POST(request: NextRequest) {
  const { session, response } = await requireAdminSession(request);
  if (response) return response;

  const parsed = createUserSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return applyAdminSession(
      NextResponse.json({ ok: false, message: '请输入有效的邮箱和不少于 6 位的密码' }, { status: 400 }),
      session,
    );
  }

  const user = await createManagedAdminUser(parsed.data).catch((error) => error);
  if (user instanceof Error) return applyAdminSession(authErrorResponse(user), session);

  return applyAdminSession(NextResponse.json({ ok: true, user }), session);
}

export async function PATCH(request: NextRequest) {
  const { session, response } = await requireAdminSession(request);
  if (response) return response;

  const parsed = updateUserSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return applyAdminSession(
      NextResponse.json({ ok: false, message: '账号权限请求格式不正确' }, { status: 400 }),
      session,
    );
  }

  if (session.user?.id === parsed.data.userId && !parsed.data.isAdmin) {
    return applyAdminSession(
      NextResponse.json({ ok: false, message: '不能取消当前登录账号的管理员权限' }, { status: 400 }),
      session,
    );
  }

  const user = await setManagedAdminRole(parsed.data.userId, parsed.data.isAdmin).catch((error) => error);
  if (user instanceof Error) return applyAdminSession(authErrorResponse(user), session);

  return applyAdminSession(NextResponse.json({ ok: true, user }), session);
}
