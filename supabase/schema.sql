-- ============================================================
-- schema.sql  |  انسخ الملف كله والصقه في Supabase > SQL Editor > Run
-- آمن إنك تشغّله أكتر من مرة (مش هيمسح بيانات).
-- ============================================================

-- ---------- 1) الأدمن ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

alter table public.admins enable row level security;
drop policy if exists "admin reads own row" on public.admins;
create policy "admin reads own row" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ---------- 2) بيانات التواصل (صف واحد بس) ----------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  whatsapp text not null default '201022349414',   -- بصيغة دولية من غير + (واتساب)
  phone text not null default '01022349414',       -- رقم الاتصال (ممكن يختلف عن الواتساب)
  location text not null default '6 أكتوبر، الشيخ زايد',
  imported boolean not null default false           -- بيتحول true بعد ضغط زر الاستيراد
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ---------- 3) المعرض ----------
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  group_key text not null check (group_key in ('trainees', 'events')),
  caption text not null default '',
  alt text,
  image_path text not null,
  image_url text not null,
  width int,
  height int,
  size_bytes bigint not null default 0,
  sort_order int not null default 0,
  source_key text unique,        -- بيستخدمه الاستيراد عشان ما يكرّرش
  created_at timestamptz not null default now()
);

-- ---------- 4) الفيديوهات ----------
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  video_path text not null,
  video_url text not null,
  poster_path text,
  poster_url text,
  size_bytes bigint not null default 0,
  sort_order int not null default 0,
  source_key text unique,
  created_at timestamptz not null default now()
);

-- ---------- 5) الشهادات ----------
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_path text not null,
  image_url text not null,
  width int,
  height int,
  size_bytes bigint not null default 0,
  sort_order int not null default 0,
  source_key text unique,
  created_at timestamptz not null default now()
);

-- ---------- 6) السوشيال ميديا ----------
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,     -- facebook / instagram / ... / other
  label text,                 -- اسم يظهر لو المنصة "other"
  url text not null,
  sort_order int not null default 0,
  source_key text unique,
  created_at timestamptz not null default now()
);

-- ---------- 7) الصلاحيات: الكل يقرا، الأدمن بس يعدّل ----------
do $$
declare t text;
begin
  foreach t in array array['site_settings','gallery_items','videos','certificates','social_links']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format('create policy "admin write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- ---------- 8) مخزن الملفات (صور وفيديوهات) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800,
        array['image/webp','image/jpeg','image/png','video/mp4','video/webm'])
on conflict (id) do update
  set public = true, file_size_limit = 52428800,
      allowed_mime_types = array['image/webp','image/jpeg','image/png','video/mp4','video/webm'];

drop policy if exists "media admin select" on storage.objects;
drop policy if exists "media admin insert" on storage.objects;
drop policy if exists "media admin update" on storage.objects;
drop policy if exists "media admin delete" on storage.objects;

create policy "media admin select" on storage.objects
  for select to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
