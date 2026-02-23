-- Run this SQL in your Supabase SQL Editor to add the 3 new plant products to your live database!

INSERT INTO products (name, slug, description, collection_name, collection_slug, relationships, celebrations, tag, image_url, images, stock, item_count, is_visible, sort_order)
VALUES
  (
    'Lucky Bamboo', 
    'lucky-bamboo', 
    'A beautiful indoor Lucky Bamboo plant symbolizing good luck and prosperity. Perfect for gifting and home decor.', 
    'Plants', 
    'plants', 
    ARRAY['Friend', 'Family', 'Corporate'], 
    ARRAY['Birthday', 'Anniversary'], 
    'Best Seller', 
    '/images/products/lucky-bamboo-1.webp', 
    ARRAY['/images/products/lucky-bamboo-1.webp', '/images/products/lucky-bamboo-2.webp', '/images/products/lucky-bamboo-3.webp'], 
    10, 
    3, 
    true, 
    31
  ),
  (
    'Jade Plant', 
    'jade-plant', 
    'A stunning Jade Plant known for attracting wealth and financial success. Easy to care for and highly decorative.', 
    'Plants', 
    'plants', 
    ARRAY['Friend', 'Family', 'Corporate'], 
    ARRAY['Birthday', 'Anniversary'], 
    'New Arrival', 
    '/images/products/jade-plant-1.webp', 
    ARRAY['/images/products/jade-plant-1.webp', '/images/products/jade-plant-2.webp', '/images/products/jade-plant-3.webp'], 
    10, 
    1, 
    true, 
    32
  ),
  (
    'ZZ Plant', 
    'zz-plant', 
    'The highly resilient ZZ plant with its glossy, dark green leaves. Perfect for modern spaces and requires very little maintenance.', 
    'Plants', 
    'plants', 
    ARRAY['Friend', 'Family', 'Corporate'], 
    ARRAY['Birthday', 'Anniversary'], 
    'Standard', 
    '/images/products/zz-plant-1.webp', 
    ARRAY['/images/products/zz-plant-1.webp', '/images/products/zz-plant-2.webp', '/images/products/zz-plant-3.webp', '/images/products/zz-plant-4.webp'], 
    10, 
    1, 
    true, 
    33
  )
ON CONFLICT (slug) DO UPDATE 
SET 
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  item_count = EXCLUDED.item_count;
