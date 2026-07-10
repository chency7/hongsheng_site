import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildInitialAdminCatalog } from '@/lib/admin-catalog';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';
import {
  isSupabaseAdminStateConfigured,
  readAdminCatalogFromSupabase,
  writeAdminCatalogToSupabase,
} from '@/lib/supabase-admin-state';

const catalogSchema = z.object({
  categories: z.array(z.record(z.string(), z.unknown())),
  subCategories: z.array(z.record(z.string(), z.unknown())),
  products: z.array(z.record(z.string(), z.unknown())),
});

function isAuthed(request: NextRequest) {
  return verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ ok: false, message: '未登录' }, { status: 401 });
  }

  const fallbackCatalog = buildInitialAdminCatalog();

  if (!isSupabaseAdminStateConfigured()) {
    return NextResponse.json({ ok: true, source: 'fallback', catalog: fallbackCatalog });
  }

  const catalog = await readAdminCatalogFromSupabase();

  if (!catalog) {
    await writeAdminCatalogToSupabase(fallbackCatalog);
    return NextResponse.json({ ok: true, source: 'seeded', catalog: fallbackCatalog });
  }

  return NextResponse.json({ ok: true, source: 'supabase', catalog });
}

export async function PUT(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ ok: false, message: '未登录' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = catalogSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: '后台数据格式不正确' }, { status: 400 });
  }

  if (!isSupabaseAdminStateConfigured()) {
    return NextResponse.json({ ok: true, source: 'fallback', persisted: false });
  }

  await writeAdminCatalogToSupabase(body);
  return NextResponse.json({ ok: true, source: 'supabase', persisted: true });
}
