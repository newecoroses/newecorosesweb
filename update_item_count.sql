-- Run this in your Supabase SQL Editor to add the item_count column 
-- and fill the existing products with random flower counts.

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS item_count INTEGER DEFAULT 0;

-- Optional: populate all existing NULL item_counts to random numbers between 5 and 30
UPDATE products 
SET item_count = floor(random() * 25 + 5)::int
WHERE item_count = 0 OR item_count IS NULL;
