-- =============================================
-- FIX: Product creation RLS policy violation
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tdttgbmoaskpmmkvjenq/sql
-- =============================================

-- The admin panel uses the anon key (not authenticated via Supabase Auth),
-- so we need policies that allow all operations for the anon role.

-- 1. Fix products table RLS
drop policy if exists "Public read products" on products;
drop policy if exists "Admin all products" on products;
create policy "Public read products" on products for select using (true);
create policy "Allow all products" on products for all using (true) with check (true);

-- 2. Fix collections table RLS
drop policy if exists "Public read collections" on collections;
drop policy if exists "Admin all collections" on collections;
create policy "Public read collections" on collections for select using (true);
create policy "Allow all collections" on collections for all using (true) with check (true);

-- 3. Fix all other tables that admin manages
drop policy if exists "Public read celebrations" on celebrations;
drop policy if exists "Admin all celebrations" on celebrations;
create policy "Public read celebrations" on celebrations for select using (true);
create policy "Allow all celebrations" on celebrations for all using (true) with check (true);

drop policy if exists "Public read relationships" on relationships;
drop policy if exists "Admin all relationships" on relationships;
create policy "Public read relationships" on relationships for select using (true);
create policy "Allow all relationships" on relationships for all using (true) with check (true);

drop policy if exists "Public read testimonials" on testimonials;
drop policy if exists "Admin all testimonials" on testimonials;
create policy "Public read testimonials" on testimonials for select using (true);
create policy "Allow all testimonials" on testimonials for all using (true) with check (true);

drop policy if exists "Public read banners" on banners;
drop policy if exists "Admin all banners" on banners;
create policy "Public read banners" on banners for select using (true);
create policy "Allow all banners" on banners for all using (true) with check (true);

drop policy if exists "Public read featured_items" on featured_items;
drop policy if exists "Admin all featured_items" on featured_items;
create policy "Public read featured_items" on featured_items for select using (true);
create policy "Allow all featured_items" on featured_items for all using (true) with check (true);

drop policy if exists "Public read site_settings" on site_settings;
drop policy if exists "Admin all site_settings" on site_settings;
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Allow all site_settings" on site_settings for all using (true) with check (true);

drop policy if exists "Public read whatsapp_settings" on whatsapp_settings;
drop policy if exists "Admin all whatsapp_settings" on whatsapp_settings;
create policy "Public read whatsapp_settings" on whatsapp_settings for select using (true);
create policy "Allow all whatsapp_settings" on whatsapp_settings for all using (true) with check (true);

drop policy if exists "Public read banned_words" on banned_words;
drop policy if exists "Admin all banned_words" on banned_words;
create policy "Public read banned_words" on banned_words for select using (true);
create policy "Allow all banned_words" on banned_words for all using (true) with check (true);

drop policy if exists "Public read announcements" on announcements;
drop policy if exists "Admin all announcements" on announcements;
create policy "Public read announcements" on announcements for select using (true);
create policy "Allow all announcements" on announcements for all using (true) with check (true);

drop policy if exists "Public read review_videos" on review_videos;
drop policy if exists "Admin all review_videos" on review_videos;
create policy "Public read review_videos" on review_videos for select using (true);
create policy "Allow all review_videos" on review_videos for all using (true) with check (true);

-- 4. Fix Storage bucket RLS for image uploads
drop policy if exists "Public image access" on storage.objects;
drop policy if exists "Allow public image access" on storage.objects;
create policy "Allow public image access" on storage.objects
  for all using (bucket_id = 'images') with check (bucket_id = 'images');

-- 5. Make sure the 'images' storage bucket exists and is public
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;
