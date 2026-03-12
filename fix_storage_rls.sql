-- =============================================
-- FIX: Storage bucket RLS for image uploads
-- Run in Supabase SQL Editor
-- =============================================

-- 1. Ensure the 'images' bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'];

-- 2. Drop ALL existing storage policies to start clean
DROP POLICY IF EXISTS "Allow public image access" ON storage.objects;
DROP POLICY IF EXISTS "Public image access" ON storage.objects;
DROP POLICY IF EXISTS "Allow image uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow image deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow image updates" ON storage.objects;
DROP POLICY IF EXISTS "images_select" ON storage.objects;
DROP POLICY IF EXISTS "images_insert" ON storage.objects;
DROP POLICY IF EXISTS "images_update" ON storage.objects;
DROP POLICY IF EXISTS "images_delete" ON storage.objects;

-- 3. Create separate policies for each operation on the images bucket
-- SELECT: Anyone can view images
CREATE POLICY "images_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- INSERT: Anyone can upload images
CREATE POLICY "images_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

-- UPDATE: Anyone can update images
CREATE POLICY "images_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

-- DELETE: Anyone can delete images
CREATE POLICY "images_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');

-- 4. Verify RLS is enabled on storage.objects (it should be by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 5. Verify the setup
SELECT id, name, public FROM storage.buckets WHERE id = 'images';
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
