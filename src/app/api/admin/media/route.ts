import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AdminAuthError, applyAdminSession, getAdminSession } from '@/lib/admin-auth';
import { readAdminCatalog } from '@/lib/admin/catalog-repository';
import {
  removeUnreferencedProductMedia,
  storeProductDocument,
  storeProductImage,
} from '@/lib/admin/media-repository';

const deleteSchema = z.object({ url: z.string().url() });

function errorResponse(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ ok: false, message }, { status: 400 });
}

async function requireAdmin(request: NextRequest) {
  try {
    return await getAdminSession(request);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }
    console.error('Supabase admin authentication failed', error);
    return NextResponse.json({ ok: false, message: '后台鉴权服务暂时不可用' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (session instanceof NextResponse) return session;
  if (!session.authenticated) {
    return applyAdminSession(NextResponse.json({ ok: false, message: '未登录' }, { status: 401 }), session);
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const categoryId = String(formData.get('categoryId') || '');
    const subCategoryId = String(formData.get('subCategoryId') || '');
    const productId = String(formData.get('productId') || '');
    const detailTabId = String(formData.get('detailTabId') || '');
    const mediaType = String(formData.get('mediaType') || 'document');
    const documentKind = String(formData.get('documentKind') || 'general');

    if (!(file instanceof File) || !categoryId || !subCategoryId || !productId) {
      return applyAdminSession(NextResponse.json({ ok: false, message: '媒体上传参数不完整' }, { status: 400 }), session);
    }

    if (mediaType === 'image') {
      const image = await storeProductImage({ file, categoryId, subCategoryId, productId });
      return applyAdminSession(NextResponse.json({ ok: true, image }), session);
    }

    if (!detailTabId) {
      return applyAdminSession(NextResponse.json({ ok: false, message: '产品资料上传参数不完整' }, { status: 400 }), session);
    }

    const storedFile = await storeProductDocument({
      file,
      categoryId,
      subCategoryId,
      productId,
      detailTabId,
      documentKind: documentKind === 'presentation' ? 'presentation' : 'general',
    });
    return applyAdminSession(NextResponse.json({ ok: true, file: storedFile }), session);
  } catch (error) {
    console.error('Product document upload failed', error);
    return errorResponse(error, '产品资料上传失败');
  }
}

export async function DELETE(request: NextRequest) {
  const session = await requireAdmin(request);
  if (session instanceof NextResponse) return session;
  if (!session.authenticated) {
    return applyAdminSession(NextResponse.json({ ok: false, message: '未登录' }, { status: 401 }), session);
  }

  try {
    const parsed = deleteSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return applyAdminSession(NextResponse.json({ ok: false, message: '文件地址不正确' }, { status: 400 }), session);
    }

    const catalog = await readAdminCatalog();
    if (!catalog) {
      return applyAdminSession(NextResponse.json({ ok: false, message: '产品目录不存在' }, { status: 409 }), session);
    }

    await removeUnreferencedProductMedia(catalog, parsed.data.url);
    return applyAdminSession(NextResponse.json({ ok: true }), session);
  } catch (error) {
    console.error('Product document delete failed', error);
    return errorResponse(error, '产品资料删除失败');
  }
}
