-- Run this in the Supabase SQL editor.
-- Replace you@example.com with the email of the account that should manage trips.

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  route text not null,
  distance_km integer not null check (distance_km > 0),
  description text not null,
  youtube_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  question text not null,
  created_at timestamptz not null default now()
);

alter table public.trips enable row level security;
alter table public.questions enable row level security;

grant select on public.trips to anon, authenticated;
grant insert, update, delete on public.trips to authenticated;
grant insert on public.questions to anon, authenticated;
grant select on public.questions to authenticated;

drop policy if exists "Anyone can read trips" on public.trips;
create policy "Anyone can read trips"
on public.trips
for select
to anon, authenticated
using (true);

drop policy if exists "Owner can insert trips" on public.trips;
create policy "Owner can insert trips"
on public.trips
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'you@example.com');

drop policy if exists "Owner can update trips" on public.trips;
create policy "Owner can update trips"
on public.trips
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'you@example.com')
with check ((auth.jwt() ->> 'email') = 'you@example.com');

drop policy if exists "Owner can delete trips" on public.trips;
create policy "Owner can delete trips"
on public.trips
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'you@example.com');

drop policy if exists "Anyone can submit a question" on public.questions;
create policy "Anyone can submit a question"
on public.questions
for insert
to anon, authenticated
with check (
  char_length(trim(name)) between 2 and 80
  and char_length(trim(email)) between 3 and 120
  and position('@' in email) > 1
  and char_length(trim(question)) between 10 and 1000
);

drop policy if exists "Owner can read questions" on public.questions;
create policy "Owner can read questions"
on public.questions
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'you@example.com');

-- Public trip photo gallery (files in Storage, optional captions in this table).
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  place text not null default '',
  caption text not null default '',
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

drop policy if exists "Owner can insert gallery photos" on public.gallery_photos;
create policy "Owner can insert gallery photos"
on public.gallery_photos
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'you@example.com');

drop policy if exists "Owner can delete gallery photos" on public.gallery_photos;
create policy "Owner can delete gallery photos"
on public.gallery_photos
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'you@example.com');

-- Storage bucket: public trip photos (run once in the SQL editor).
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
create policy "Owner can upload trip photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'trip-photos'
  and (auth.jwt() ->> 'email') = 'you@example.com'
);

drop policy if exists "Owner can update trip photos" on storage.objects;
create policy "Owner can update trip photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'trip-photos'
  and (auth.jwt() ->> 'email') = 'you@example.com'
)
with check (
  bucket_id = 'trip-photos'
  and (auth.jwt() ->> 'email') = 'you@example.com'
);

drop policy if exists "Owner can delete trip photos" on storage.objects;
create policy "Owner can delete trip photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'trip-photos'
  and (auth.jwt() ->> 'email') = 'you@example.com'
);

-- Optional starter rows. Safe to run once; they are not tied to a unique route.
insert into public.trips (title, route, distance_km, description, youtube_url)
values
  (
    'Makran Coastal Highway',
    'Karachi → Gwadar',
    750,
    'A long southern ride beside the Arabian Sea, through desert towns and the empty coastal road into Balochistan.',
    'https://www.youtube.com/results?search_query=Makran+Coastal+Highway+motorcycle'
  ),
  (
    'Karakoram Highway',
    'Hassan Abdal → Khunjerab Pass',
    810,
    'The high road into Gilgit Baltistan, climbing from the plains to the mountains and the Chinese border.',
    'https://www.youtube.com/results?search_query=Karakoram+Highway+motorcycle+Pakistan'
  ),
  (
    'Neelum Valley',
    'Muzaffarabad → Kel',
    185,
    'A narrower ride through Azad Kashmir, following the river as the valley walls close in.',
    'https://www.youtube.com/results?search_query=Neelum+Valley+motorcycle'
  ),
  (
    'Lowari to Chitral',
    'Dir → Chitral',
    140,
    'A mountain crossing in KPK, over Lowari Pass and down into the Chitral valley.',
    'https://www.youtube.com/results?search_query=Lowari+Pass+Chitral+motorcycle'
  );
