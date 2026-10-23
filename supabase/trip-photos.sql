-- Run in the Supabase SQL editor.
-- Album-based gallery + public trip-photos bucket.
-- NOTE: This recreates gallery_photos for the album model.
-- Existing flat photo rows will be cleared (Storage files stay until deleted in Admin).

create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  place text not null default '',
  description text not null default '',
  cover_path text not null,
  created_at timestamptz not null default now()
);

alter table public.gallery_albums enable row level security;

grant select on public.gallery_albums to anon, authenticated;
grant insert, update, delete on public.gallery_albums to authenticated;

drop policy if exists "Anyone can read gallery albums" on public.gallery_albums;
create policy "Anyone can read gallery albums"
on public.gallery_albums
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert gallery albums" on public.gallery_albums;
create policy "Authenticated can insert gallery albums"
on public.gallery_albums
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update gallery albums" on public.gallery_albums;
create policy "Authenticated can update gallery albums"
on public.gallery_albums
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete gallery albums" on public.gallery_albums;
create policy "Authenticated can delete gallery albums"
on public.gallery_albums
for delete
to authenticated
using (true);

-- Photos belong to an album
drop table if exists public.gallery_photos cascade;

create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums (id) on delete cascade,
  storage_path text not null unique,
  caption text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery_photos enable row level security;

grant select on public.gallery_photos to anon, authenticated;
grant insert, delete on public.gallery_photos to authenticated;

drop policy if exists "Anyone can read gallery photos" on public.gallery_photos;
create policy "Anyone can read gallery photos"
on public.gallery_photos
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert gallery photos" on public.gallery_photos;
create policy "Authenticated can insert gallery photos"
on public.gallery_photos
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can delete gallery photos" on public.gallery_photos;
create policy "Authenticated can delete gallery photos"
on public.gallery_photos
for delete
to authenticated
using (true);

-- Public Storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'trip-photos',
  'trip-photos',
  true,
  10485760,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view trip photos" on storage.objects;
create policy "Anyone can view trip photos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'trip-photos');

drop policy if exists "Owner can upload trip photos" on storage.objects;
drop policy if exists "Authenticated can upload trip photos" on storage.objects;
create policy "Authenticated can upload trip photos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'trip-photos');

drop policy if exists "Owner can update trip photos" on storage.objects;
drop policy if exists "Authenticated can update trip photos" on storage.objects;
create policy "Authenticated can update trip photos"
on storage.objects
for update
to authenticated
using (bucket_id = 'trip-photos')
with check (bucket_id = 'trip-photos');

drop policy if exists "Owner can delete trip photos" on storage.objects;
drop policy if exists "Authenticated can delete trip photos" on storage.objects;
create policy "Authenticated can delete trip photos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'trip-photos');
