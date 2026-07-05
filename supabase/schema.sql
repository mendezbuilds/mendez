-- SQL Schema for Mendez Portfolio Database Setup
-- Paste this script directly into the SQL Editor of your Supabase project dashboard.

-- 1. Shared projects table (already exists in Evren, shown here for reference)
-- create table if not exists projects (
--   slug text primary key,
--   title text not null,
--   one_liner text not null,
--   description text not null,
--   problem text not null,
--   stack text[] not null,
--   status text not null check (status in ('active', 'phase-in-progress', 'completed', 'available-for-clients')),
--   phases jsonb not null,
--   video_url text,
--   github_url text,
--   live_url text,
--   contracts jsonb,
--   featured boolean default false,
--   thumbnail_url text,
--   created_at timestamp with time zone default timezone('utc'::text, now()) not null
-- );

-- 2. Settings table for editable About bio copy
create table if not exists settings (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table settings enable row level security;

-- Create policy to allow read access to everyone (public read)
create policy "Allow public read access to settings"
  on settings for select
  using (true);

-- Create policy to allow full control to authenticated users (admin write)
create policy "Allow full control to settings for authenticated users"
  on settings for all
  to authenticated
  using (true)
  with check (true);

-- 3. Storage Bucket Setup & RLS Policies
-- NOTE: Please ensure the 'images' and 'videos' buckets are created and set to "Public" in the Supabase Dashboard,
-- or run the following snippet if using pg_graphql or similar setup.
-- insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('videos', 'videos', true) on conflict do nothing;

-- Images bucket policies
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'images');

create policy "Authenticated users can update images"
on storage.objects for update
to authenticated
using (bucket_id = 'images');

create policy "Public can read images"
on storage.objects for select
using (bucket_id = 'images');

create policy "Authenticated users can delete images"
on storage.objects for delete
to authenticated
using (bucket_id = 'images');

-- Videos bucket policies
create policy "Authenticated users can upload videos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'videos');

create policy "Authenticated users can update videos"
on storage.objects for update
to authenticated
using (bucket_id = 'videos');

create policy "Public can read videos"
on storage.objects for select
using (bucket_id = 'videos');

create policy "Authenticated users can delete videos"
on storage.objects for delete
to authenticated
using (bucket_id = 'videos');
