-- =============================================
-- NER WEBSITE - ADDITIONAL TABLES
-- Run this AFTER the main supabase_schema.sql
-- https://supabase.com/dashboard/project/tdttgbmoaskpmmkvjenq/sql
-- =============================================

-- =============================================
-- ANNOUNCEMENTS TABLE (Scrolling top bar)
-- =============================================
create table if not exists announcements (
  id uuid default uuid_generate_v4() primary key,
  text text not null,
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- REVIEW VIDEOS TABLE
-- =============================================
create table if not exists review_videos (
  id uuid default uuid_generate_v4() primary key,
  video_url text not null,
  title text,
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table announcements enable row level security;
alter table review_videos enable row level security;

create policy "Public read announcements" on announcements for select using (true);
create policy "Public read review_videos" on review_videos for select using (true);
create policy "Admin all announcements" on announcements for all using (auth.role() = 'authenticated');
create policy "Admin all review_videos" on review_videos for all using (auth.role() = 'authenticated');

-- =============================================
-- SEED DATA
-- =============================================

insert into announcements (text, is_visible, sort_order) values
  ('FLAT 15% OFF ON PREMIUM GIFT HAMPERS', true, 1),
  ('SAME DAY DELIVERY WITHIN 10KM', true, 2),
  ('FRESH HANDCRAFTED BOUQUETS DAILY', true, 3),
  ('CUSTOM MESSAGE CARDS AVAILABLE', true, 4),
  ('LUXURY PACKAGING AT NO EXTRA COST', true, 5),
  ('FAST & SECURE DELIVERY', true, 6),
  ('SURPRISE YOUR LOVED ONES TODAY', true, 7)
on conflict do nothing;

insert into review_videos (video_url, title, is_visible, sort_order) values
  ('/review%20videos/review1.mp4', 'Customer Review 1', true, 1),
  ('/review%20videos/review2.mp4', 'Customer Review 2', true, 2),
  ('/review%20videos/review3.mp4', 'Customer Review 3', true, 3),
  ('/review%20videos/review4.mp4', 'Customer Review 4', true, 4),
  ('/review%20videos/review5.mp4', 'Customer Review 5', true, 5),
  ('/review%20videos/review6.mp4', 'Customer Review 6', true, 6),
  ('/review%20videos/review7.mp4', 'Customer Review 7', true, 7)
on conflict do nothing;
