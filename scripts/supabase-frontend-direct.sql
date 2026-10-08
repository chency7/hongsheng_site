-- =============================================================================
-- Supabase 完整执行脚本（纯前端直连改造）
-- 在 Supabase Dashboard → SQL Editor 中整段执行
--
-- 特性：幂等（idempotent），可重复执行；适用于全新实例或已有数据的生产实例。
--   * 已有表/函数会被安全跳过或原位替换，不会影响现有数据
--
-- 内容：
--   1. 基础表：admin_state / admin_categories / admin_sub_categories / admin_products
--   2. 管理员判定函数 is_admin()（基于 Supabase Auth 的 app_metadata.role）
--   3. RPC：
--      - get_public_catalog()    匿名可读，只返回"对外可见"目录
--      - get_admin_catalog()     仅管理员，返回完整目录（含未启用草稿）
--      - replace_admin_catalog() 仅管理员，全量替换目录
--   4. Storage：files 公共桶，管理员可写、公开可读
--
-- 执行后前端（anon key 直连）即可：
--   - 站点公开数据:  supabase.rpc('get_public_catalog')
--   - 后台完整目录:  supabase.rpc('get_admin_catalog')      （需管理员登录态）
--   - 后台保存目录:  supabase.rpc('replace_admin_catalog')  （需管理员登录态）
--   - 产品媒体上传:  supabase.storage.from('files')         （需管理员登录态）
-- =============================================================================


-- =============================================================================
-- 第 1 部分：基础表结构（已存在则自动跳过）
-- =============================================================================

-- 后台状态快照（目录 JSON 全量备份）
create table if not exists public.admin_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- 产品分类
create table if not exists public.admin_categories (
  id text primary key,
  name text not null,
  slug text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 产品子分类
create table if not exists public.admin_sub_categories (
  id text primary key,
  category_id text references public.admin_categories(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  product_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 产品
create table if not exists public.admin_products (
  id text primary key,
  slug text not null,
  sub_category_id text,
  name text not null,
  model text not null default '',
  description text not null default '',
  cover_image text not null default '',
  cover_thumbnail text not null default '',
  images text[] not null default '{}',
  specs jsonb not null default '[]'::jsonb,
  features text[] not null default '{}',
  sub_products jsonb not null default '[]'::jsonb,
  detail_tabs jsonb not null default '[]'::jsonb,
  files jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_sub_categories_category_idx
  on public.admin_sub_categories(category_id, sort_order);

create index if not exists admin_products_sub_category_idx
  on public.admin_products(sub_category_id, sort_order);

create unique index if not exists admin_products_slug_idx
  on public.admin_products(slug);

-- 旧版本列兼容（存在则补充/删除）
alter table public.admin_products
  add column if not exists cover_thumbnail text not null default '';

alter table public.admin_products
  drop constraint if exists admin_products_sub_category_id_fkey;

alter table public.admin_products
  drop column if exists brand;

-- 开启行级安全：数据仅能通过下方的 security definer RPC 访问
alter table public.admin_state enable row level security;
alter table public.admin_categories enable row level security;
alter table public.admin_sub_categories enable row level security;
alter table public.admin_products enable row level security;

-- 表本身不对 anon/authenticated 开放（只有 service_role 直连权限）
drop policy if exists "admin_state_service_role_all" on public.admin_state;
create policy "admin_state_service_role_all"
  on public.admin_state
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "admin_categories_service_role_all" on public.admin_categories;
create policy "admin_categories_service_role_all"
  on public.admin_categories
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "admin_sub_categories_service_role_all" on public.admin_sub_categories;
create policy "admin_sub_categories_service_role_all"
  on public.admin_sub_categories
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "admin_products_service_role_all" on public.admin_products;
create policy "admin_products_service_role_all"
  on public.admin_products
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- updated_at 自动维护触发器
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_state_updated_at on public.admin_state;
create trigger admin_state_updated_at
before update on public.admin_state
for each row
execute function public.touch_updated_at();

drop trigger if exists admin_categories_updated_at on public.admin_categories;
create trigger admin_categories_updated_at
before update on public.admin_categories
for each row
execute function public.touch_updated_at();

drop trigger if exists admin_sub_categories_updated_at on public.admin_sub_categories;
create trigger admin_sub_categories_updated_at
before update on public.admin_sub_categories
for each row
execute function public.touch_updated_at();

drop trigger if exists admin_products_updated_at on public.admin_products;
create trigger admin_products_updated_at
before update on public.admin_products
for each row
execute function public.touch_updated_at();


-- =============================================================================
-- 第 2 部分：管理员判定函数
-- 判定依据：Supabase Auth 用户 app_metadata.role = 'admin'
--          （或 app_metadata.roles 数组包含 'admin'）
-- =============================================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    or coalesce(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin';
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, service_role;


-- =============================================================================
-- 第 3 部分：产品目录 RPC
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 3.1 内部函数：完整目录 JSON（不对普通用户开放）
-- -----------------------------------------------------------------------------
create or replace function public.admin_catalog_json()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'categories', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'sortOrder', c.sort_order,
          'isActive', c.is_active,
          'createdAt', to_jsonb(c.created_at),
          'updatedAt', to_jsonb(c.updated_at)
        )
        order by c.sort_order, c.name
      )
      from public.admin_categories c
    ), '[]'::jsonb),
    'subCategories', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'categoryId', s.category_id,
          'name', s.name,
          'slug', s.slug,
          'sortOrder', s.sort_order,
          'isActive', s.is_active,
          'createdAt', to_jsonb(s.created_at),
          'updatedAt', to_jsonb(s.updated_at),
          'productIds', to_jsonb(coalesce(s.product_ids, '{}'::text[]))
        )
        order by s.sort_order, s.name
      )
      from public.admin_sub_categories s
    ), '[]'::jsonb),
    'products', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'slug', p.slug,
          'subCategoryId', coalesce(p.sub_category_id, ''),
          'name', p.name,
          'model', p.model,
          'description', p.description,
          'coverImage', p.cover_image,
          'coverThumbnail', p.cover_thumbnail,
          'images', to_jsonb(coalesce(p.images, '{}'::text[])),
          'specs', p.specs,
          'features', to_jsonb(coalesce(p.features, '{}'::text[])),
          'subProducts', p.sub_products,
          'detailTabs', p.detail_tabs,
          'files', p.files,
          'sortOrder', p.sort_order,
          'isActive', p.is_active,
          'createdAt', to_jsonb(p.created_at),
          'updatedAt', to_jsonb(p.updated_at)
        )
        order by p.sort_order, p.name
      )
      from public.admin_products p
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.admin_catalog_json() from public, anon, authenticated;
grant execute on function public.admin_catalog_json() to service_role;

-- -----------------------------------------------------------------------------
-- 3.2 get_admin_catalog：仅管理员（后台管理界面使用，返回完整目录含草稿）
-- -----------------------------------------------------------------------------
create or replace function public.get_admin_catalog()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    return null;
  end if;

  return public.admin_catalog_json();
end;
$$;

revoke all on function public.get_admin_catalog() from public, anon, authenticated;
grant execute on function public.get_admin_catalog() to authenticated;

-- -----------------------------------------------------------------------------
-- 3.3 get_public_catalog：匿名可读，仅返回对外可见的产品目录
--     可见规则：产品启用，且所属子分类启用，且子分类的上级分类启用
--     （与前端 adminCatalogToProducts 的过滤逻辑完全一致）
-- -----------------------------------------------------------------------------
create or replace function public.get_public_catalog()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_full jsonb;
  v_category_ids text[];
  v_sub_category_ids text[];
begin
  v_full := public.admin_catalog_json();

  if v_full is null then
    return null;
  end if;

  select coalesce(array_agg(c ->> 'id'), '{}')
    into v_category_ids
    from jsonb_array_elements(v_full -> 'categories') as c
   where coalesce(c ->> 'isActive', 'false')::boolean;

  select coalesce(array_agg(s ->> 'id'), '{}')
    into v_sub_category_ids
    from jsonb_array_elements(v_full -> 'subCategories') as s
   where coalesce(s ->> 'isActive', 'false')::boolean
     and s ->> 'categoryId' = any (v_category_ids);

  return jsonb_build_object(
    'categories', coalesce((
      select jsonb_agg(c)
        from jsonb_array_elements(v_full -> 'categories') as c
       where coalesce(c ->> 'isActive', 'false')::boolean
    ), '[]'::jsonb),
    'subCategories', coalesce((
      select jsonb_agg(s)
        from jsonb_array_elements(v_full -> 'subCategories') as s
       where coalesce(s ->> 'isActive', 'false')::boolean
         and s ->> 'categoryId' = any (v_category_ids)
    ), '[]'::jsonb),
    'products', coalesce((
      select jsonb_agg(p)
        from jsonb_array_elements(v_full -> 'products') as p
       where coalesce(p ->> 'isActive', 'false')::boolean
         and (
           p ->> 'subCategoryId' = any (v_sub_category_ids)
           or p ->> 'subCategoryId' = any (v_category_ids)
         )
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_public_catalog() from public;
grant execute on function public.get_public_catalog() to anon, authenticated;

-- -----------------------------------------------------------------------------
-- 3.4 replace_admin_catalog：仅管理员，全量替换目录
-- -----------------------------------------------------------------------------
create or replace function public.replace_admin_catalog(catalog jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception '需要管理员权限才能修改产品目录' using errcode = '42501';
  end if;

  delete from public.admin_products where true;
  delete from public.admin_sub_categories where true;
  delete from public.admin_categories where true;

  insert into public.admin_categories (
    id, name, slug, sort_order, is_active, created_at, updated_at
  )
  select
    c.id,
    c.name,
    c.slug,
    coalesce(c."sortOrder", 0),
    coalesce(c."isActive", true),
    coalesce(c."createdAt", now()),
    coalesce(c."updatedAt", now())
  from jsonb_to_recordset(coalesce(catalog -> 'categories', '[]'::jsonb)) as c(
    id text,
    name text,
    slug text,
    "sortOrder" integer,
    "isActive" boolean,
    "createdAt" timestamptz,
    "updatedAt" timestamptz
  );

  insert into public.admin_sub_categories (
    id, category_id, name, slug, sort_order, is_active, product_ids, created_at, updated_at
  )
  select
    s.id,
    nullif(s."categoryId", ''),
    s.name,
    s.slug,
    coalesce(s."sortOrder", 0),
    coalesce(s."isActive", true),
    coalesce(array(select jsonb_array_elements_text(coalesce(s."productIds", '[]'::jsonb))), '{}'::text[]),
    coalesce(s."createdAt", now()),
    coalesce(s."updatedAt", now())
  from jsonb_to_recordset(coalesce(catalog -> 'subCategories', '[]'::jsonb)) as s(
    id text,
    "categoryId" text,
    name text,
    slug text,
    "sortOrder" integer,
    "isActive" boolean,
    "createdAt" timestamptz,
    "updatedAt" timestamptz,
    "productIds" jsonb
  );

  insert into public.admin_products (
    id, slug, sub_category_id, name, model, description, cover_image, cover_thumbnail, images,
    specs, features, sub_products, detail_tabs, files, sort_order, is_active, created_at, updated_at
  )
  select
    p.id,
    p.slug,
    nullif(p."subCategoryId", ''),
    p.name,
    coalesce(p.model, ''),
    coalesce(p.description, ''),
    coalesce(p."coverImage", ''),
    coalesce(p."coverThumbnail", p."coverImage", ''),
    coalesce(array(select jsonb_array_elements_text(coalesce(p.images, '[]'::jsonb))), '{}'::text[]),
    coalesce(p.specs, '[]'::jsonb),
    coalesce(array(select jsonb_array_elements_text(coalesce(p.features, '[]'::jsonb))), '{}'::text[]),
    coalesce(p."subProducts", '[]'::jsonb),
    coalesce(p."detailTabs", '[]'::jsonb),
    coalesce(p.files, '[]'::jsonb),
    coalesce(p."sortOrder", 0),
    coalesce(p."isActive", true),
    coalesce(p."createdAt", now()),
    coalesce(p."updatedAt", now())
  from jsonb_to_recordset(coalesce(catalog -> 'products', '[]'::jsonb)) as p(
    id text,
    slug text,
    "subCategoryId" text,
    name text,
    model text,
    description text,
    "coverImage" text,
    "coverThumbnail" text,
    images jsonb,
    specs jsonb,
    features jsonb,
    "subProducts" jsonb,
    "detailTabs" jsonb,
    files jsonb,
    "sortOrder" integer,
    "isActive" boolean,
    "createdAt" timestamptz,
    "updatedAt" timestamptz
  );

  insert into public.admin_state (key, value, updated_at)
  values ('catalog', catalog, now())
  on conflict (key) do update
  set value = excluded.value,
      updated_at = excluded.updated_at;
end;
$$;

revoke all on function public.replace_admin_catalog(jsonb) from public, anon, authenticated;
grant execute on function public.replace_admin_catalog(jsonb) to authenticated;


-- =============================================================================
-- 第 4 部分：Storage（files 公共桶）
-- 管理员可上传/更新/删除，匿名可读（公共桶公开 URL）
-- =============================================================================

-- 确保 files 桶存在且为公共桶（已存在则跳过）
insert into storage.buckets (id, name, public)
values ('files', 'files', true)
on conflict (id) do update set public = true;

drop policy if exists "files_admin_insert" on storage.objects;
create policy "files_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'files' and public.is_admin());

drop policy if exists "files_admin_update" on storage.objects;
create policy "files_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'files' and public.is_admin())
  with check (bucket_id = 'files' and public.is_admin());

drop policy if exists "files_admin_delete" on storage.objects;
create policy "files_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'files' and public.is_admin());


-- =============================================================================
-- 第 5 部分：通知 PostgREST 重新加载 schema（RPC 权限/定义立即生效）
-- =============================================================================
notify pgrst, 'reload schema';


-- =============================================================================
-- 执行后自检（可选，手动运行验证）：
--
--   -- 1. 匿名视角调用公开 RPC，应返回 {"categories":[...],"subCategories":[...],"products":[...]}
--   select public.get_public_catalog();
--
--   -- 2. 未登录调用管理 RPC，应返回 null
--   select public.get_admin_catalog();
--
--   -- 3. 查看目录数据量
--   select
--     (select count(*) from public.admin_categories)   as categories,
--     (select count(*) from public.admin_sub_categories) as sub_categories,
--     (select count(*) from public.admin_products)     as products;
-- =============================================================================
