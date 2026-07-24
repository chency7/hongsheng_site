-- Supabase SQL Editor / MCP migration: product admin catalog tables.
-- The Next.js app calls get_admin_catalog() and replace_admin_catalog() with the service-role key.

create table if not exists public.admin_categories (
  id text primary key,
  name text not null,
  slug text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

alter table public.admin_products
  add column if not exists cover_thumbnail text not null default '';

drop index if exists public.admin_products_slug_idx;
create unique index admin_products_slug_idx
  on public.admin_products(slug);

alter table public.admin_products
  drop constraint if exists admin_products_sub_category_id_fkey;

alter table public.admin_categories enable row level security;
alter table public.admin_sub_categories enable row level security;
alter table public.admin_products enable row level security;

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

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

create or replace function public.get_admin_catalog()
returns jsonb
language sql
stable
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

create or replace function public.replace_admin_catalog(catalog jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
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

-- Keep this last so existing RPC functions are replaced before their legacy column disappears.
alter table public.admin_products
  drop column if exists brand;
