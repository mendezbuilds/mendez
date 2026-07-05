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
