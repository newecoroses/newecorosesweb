-- ================================================================
-- NER WEBSITE — Complete CRUD + Storage Setup
-- Run this ONCE in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tdttgbmoaskpmmkvjenq/sql
-- ================================================================
-- This enables full Create, Read, Update, Delete on all tables
-- and sets up the image storage bucket with public access.
-- ================================================================


-- ────────────────────────────────────────────────────────────────
-- SECTION 1: Enable RLS on all tables (required for policies)
-- ────────────────────────────────────────────────────────────────
ALTER TABLE IF EXISTS products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS collections      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS celebrations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS relationships    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS testimonials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS banners          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS featured_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS whatsapp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS banned_words     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS announcements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS review_videos    ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────────────────────────────
-- SECTION 2: Drop old policies (clean slate)
-- ────────────────────────────────────────────────────────────────
DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE tablename IN (
      'products','collections','celebrations','relationships',
      'testimonials','banners','featured_items','site_settings',
      'whatsapp_settings','banned_words','announcements','review_videos'
    )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;


-- ────────────────────────────────────────────────────────────────
-- SECTION 3: Create CRUD policies for every table
-- (SELECT for everyone, INSERT/UPDATE/DELETE for all — admin app)
-- ────────────────────────────────────────────────────────────────

-- products
CREATE POLICY "products_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update" ON products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "products_delete" ON products FOR DELETE USING (true);

-- collections
CREATE POLICY "collections_select" ON collections FOR SELECT USING (true);
CREATE POLICY "collections_insert" ON collections FOR INSERT WITH CHECK (true);
CREATE POLICY "collections_update" ON collections FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "collections_delete" ON collections FOR DELETE USING (true);

-- celebrations
CREATE POLICY "celebrations_select" ON celebrations FOR SELECT USING (true);
CREATE POLICY "celebrations_insert" ON celebrations FOR INSERT WITH CHECK (true);
CREATE POLICY "celebrations_update" ON celebrations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "celebrations_delete" ON celebrations FOR DELETE USING (true);

-- relationships
CREATE POLICY "relationships_select" ON relationships FOR SELECT USING (true);
CREATE POLICY "relationships_insert" ON relationships FOR INSERT WITH CHECK (true);
CREATE POLICY "relationships_update" ON relationships FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "relationships_delete" ON relationships FOR DELETE USING (true);

-- testimonials
CREATE POLICY "testimonials_select" ON testimonials FOR SELECT USING (true);
CREATE POLICY "testimonials_insert" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "testimonials_update" ON testimonials FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "testimonials_delete" ON testimonials FOR DELETE USING (true);

-- banners
CREATE POLICY "banners_select" ON banners FOR SELECT USING (true);
CREATE POLICY "banners_insert" ON banners FOR INSERT WITH CHECK (true);
CREATE POLICY "banners_update" ON banners FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "banners_delete" ON banners FOR DELETE USING (true);

-- featured_items
CREATE POLICY "featured_items_select" ON featured_items FOR SELECT USING (true);
CREATE POLICY "featured_items_insert" ON featured_items FOR INSERT WITH CHECK (true);
CREATE POLICY "featured_items_update" ON featured_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "featured_items_delete" ON featured_items FOR DELETE USING (true);

-- site_settings
CREATE POLICY "site_settings_select" ON site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_insert" ON site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "site_settings_update" ON site_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "site_settings_delete" ON site_settings FOR DELETE USING (true);

-- whatsapp_settings
CREATE POLICY "whatsapp_settings_select" ON whatsapp_settings FOR SELECT USING (true);
CREATE POLICY "whatsapp_settings_insert" ON whatsapp_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "whatsapp_settings_update" ON whatsapp_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "whatsapp_settings_delete" ON whatsapp_settings FOR DELETE USING (true);

-- banned_words
CREATE POLICY "banned_words_select" ON banned_words FOR SELECT USING (true);
CREATE POLICY "banned_words_insert" ON banned_words FOR INSERT WITH CHECK (true);
CREATE POLICY "banned_words_update" ON banned_words FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "banned_words_delete" ON banned_words FOR DELETE USING (true);

-- announcements
CREATE POLICY "announcements_select" ON announcements FOR SELECT USING (true);
CREATE POLICY "announcements_insert" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "announcements_update" ON announcements FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "announcements_delete" ON announcements FOR DELETE USING (true);

-- review_videos
CREATE POLICY "review_videos_select" ON review_videos FOR SELECT USING (true);
CREATE POLICY "review_videos_insert" ON review_videos FOR INSERT WITH CHECK (true);
CREATE POLICY "review_videos_update" ON review_videos FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "review_videos_delete" ON review_videos FOR DELETE USING (true);


-- ────────────────────────────────────────────────────────────────
-- SECTION 4: Storage bucket for images
-- ────────────────────────────────────────────────────────────────

-- Create/update the 'images' bucket (public, 10MB max)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images', 'images', true, 10485760,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/avif','image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public            = true,
  file_size_limit   = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/avif','image/svg+xml'];

-- Drop old storage policies
DROP POLICY IF EXISTS "Allow public image access"  ON storage.objects;
DROP POLICY IF EXISTS "Public image access"         ON storage.objects;
DROP POLICY IF EXISTS "Allow image uploads"         ON storage.objects;
DROP POLICY IF EXISTS "Allow image deletes"         ON storage.objects;
DROP POLICY IF EXISTS "Allow image updates"         ON storage.objects;
DROP POLICY IF EXISTS "images_select"               ON storage.objects;
DROP POLICY IF EXISTS "images_insert"               ON storage.objects;
DROP POLICY IF EXISTS "images_update"               ON storage.objects;
DROP POLICY IF EXISTS "images_delete"               ON storage.objects;

-- Create fresh storage policies
CREATE POLICY "images_select" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "images_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "images_update" ON storage.objects FOR UPDATE USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');
CREATE POLICY "images_delete" ON storage.objects FOR DELETE USING (bucket_id = 'images');

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────────────────────────────
-- SECTION 5: Verify everything is set up correctly
-- ────────────────────────────────────────────────────────────────
SELECT
  tablename,
  COUNT(*) AS policy_count
FROM pg_policies
WHERE tablename IN (
  'products','collections','celebrations','relationships',
  'testimonials','banners','featured_items','site_settings',
  'whatsapp_settings','banned_words','announcements','review_videos'
)
GROUP BY tablename
ORDER BY tablename;

-- Should show 4 policies per table (select, insert, update, delete)

SELECT id, name, public FROM storage.buckets WHERE id = 'images';
-- Should show: images | images | true
