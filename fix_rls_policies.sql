-- FIX: RLS policies need WITH CHECK for INSERT/UPDATE operations
-- The previous policies only had USING (true) which covers SELECT/DELETE
-- but INSERT/UPDATE also need WITH CHECK (true) to pass validation.
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Fix site_settings (critical for theme changes)
drop policy if exists "Admin all site_settings" on site_settings;
create policy "Admin all site_settings" on site_settings for all using (true) with check (true);

-- Fix all other tables too to prevent similar issues
drop policy if exists "Admin all products" on products;
create policy "Admin all products" on products for all using (true) with check (true);

drop policy if exists "Admin all collections" on collections;
create policy "Admin all collections" on collections for all using (true) with check (true);

drop policy if exists "Admin all celebrations" on celebrations;
create policy "Admin all celebrations" on celebrations for all using (true) with check (true);

drop policy if exists "Admin all relationships" on relationships;
create policy "Admin all relationships" on relationships for all using (true) with check (true);

drop policy if exists "Admin all testimonials" on testimonials;
create policy "Admin all testimonials" on testimonials for all using (true) with check (true);

drop policy if exists "Admin all banners" on banners;
create policy "Admin all banners" on banners for all using (true) with check (true);

drop policy if exists "Admin all featured_items" on featured_items;
create policy "Admin all featured_items" on featured_items for all using (true) with check (true);

drop policy if exists "Admin all whatsapp_settings" on whatsapp_settings;
create policy "Admin all whatsapp_settings" on whatsapp_settings for all using (true) with check (true);

drop policy if exists "Admin all banned_words" on banned_words;
create policy "Admin all banned_words" on banned_words for all using (true) with check (true);

drop policy if exists "Admin all announcements" on announcements;
create policy "Admin all announcements" on announcements for all using (true) with check (true);

drop policy if exists "Admin all review_videos" on review_videos;
create policy "Admin all review_videos" on review_videos for all using (true) with check (true);
