import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { buildInitialAdminCatalog } from '@/lib/admin-catalog';
import { AdminAuthError, applyAdminSession, getAdminSession } from '@/lib/admin-auth';
import {
  isSupabaseAdminStateConfigured,
  readAdminCatalog,
  writeAdminCatalog,
} from '@/lib/admin/catalog-repository';

const catalogSchema = z.object({
  categories: z.array(z.record(z.string(), z.unknown())),
  subCategories: z.array(z.record(z.string(), z.unknown())),
  products: z.array(z.record(z.string(), z.unknown())),
});

function authErrorResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
  }
  console.error('Supabase admin authentication failed', error);
  return NextResponse.json({ ok: false, message: '后台鉴权服务暂时不可用' }, { status: 503 });
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request).catch((error) => error);
  if (session instanceof Error) return authErrorResponse(session);
  if (!session.authenticated) {
    return applyAdminSession(NextResponse.json({ ok: false, message: '未登录' }, { status: 401 }), session);
  }

  const fallbackCatalog = buildInitialAdminCatalog();

  if (!isSupabaseAdminStateConfigured()) {
    return applyAdminSession(NextResponse.json({ ok: true, source: 'fallback', catalog: fallbackCatalog }), session);
  }

  const catalog = await readAdminCatalog();

  if (!catalog) {
    await writeAdminCatalog(fallbackCatalog);
    return applyAdminSession(NextResponse.json({ ok: true, source: 'seeded', catalog: fallbackCatalog }), session);
  }

  if (!catalog.categories?.length && !catalog.subCategories?.length && !catalog.products?.length) {
    await writeAdminCatalog(fallbackCatalog);
    return applyAdminSession(NextResponse.json({ ok: true, source: 'seeded', catalog: fallbackCatalog }), session);
  }

  return applyAdminSession(NextResponse.json({ ok: true, source: 'supabase', catalog }), session);
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession(request).catch((error) => error);
  if (session instanceof Error) return authErrorResponse(session);
  if (!session.authenticated) {
    return applyAdminSession(NextResponse.json({ ok: false, message: '未登录' }, { status: 401 }), session);
  }

  const body = await request.json().catch(() => null);
  const parsed = catalogSchema.safeParse(body);

  if (!parsed.success) {
    return applyAdminSession(NextResponse.json({ ok: false, message: '后台数据格式不正确' }, { status: 400 }), session);
  }

  if (!isSupabaseAdminStateConfigured()) {
    return applyAdminSession(NextResponse.json({ ok: true, source: 'fallback', persisted: false }), session);
  }

  await writeAdminCatalog(body);
  revalidatePath('/products', 'layout');
  return applyAdminSession(NextResponse.json({ ok: true, source: 'supabase', persisted: true }), session);
}
