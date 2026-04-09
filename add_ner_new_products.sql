-- ============================================================
-- NER WEBSITE — Add New Arrival Products (ner new products folder)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tdttgbmoaskpmmkvjenq/sql
-- ============================================================

DO $$
DECLARE
  base_sort INT;
BEGIN
  SELECT COALESCE(MAX(sort_order), 0) INTO base_sort FROM products;

  -- 1. Balloons, Chocolates & Flower Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Balloons, Chocolates & Flower Hamper',
    'balloons-chocolates-flower-hamper',
    'A festive celebration hamper packed with colourful balloons, premium chocolates, and fresh flowers. Perfect for surprising a loved one on their birthday or any joyful occasion.',
    'Hampers',
    'hampers',
    ARRAY['Friend', 'Family', 'Her', 'Him', 'Wife', 'Girlfriend'],
    ARRAY['Birthday', 'Anniversary', 'Congratulations'],
    'New Arrival',
    '/images/new-products/balloons-chocolates-flower-hamper.jpeg',
    ARRAY['/images/new-products/balloons-chocolates-flower-hamper.jpeg'],
    10, 1, true, false, base_sort + 1, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'balloons-chocolates-flower-hamper');

  -- 2. Custom Printed Bottle
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Custom Printed Bottle',
    'custom-printed-bottle',
    'A personalised printed bottle that makes for a thoughtful and unique gift. Customise it with a name, message, or photo to create a memorable keepsake for any occasion.',
    'Personalized Gifts',
    'personalized-gifts',
    ARRAY['Friend', 'Family', 'Him', 'Her', 'Husband', 'Wife', 'Colleague'],
    ARRAY['Birthday', 'Anniversary', 'Farewell', 'Congratulations'],
    'New Arrival',
    '/images/new-products/custom-printed-bottle.jpeg',
    ARRAY['/images/new-products/custom-printed-bottle.jpeg', '/images/new-products/custom-printed-bottle-2.jpeg'],
    10, 1, true, false, base_sort + 2, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'custom-printed-bottle');

  -- 3. Custom Printed Coffee Mug
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Custom Printed Coffee Mug',
    'custom-printed-coffee-mug',
    'Start every morning with a smile. This custom printed coffee mug can be personalised with a name, photo, or special message — the perfect gift for anyone who loves their daily cup of coffee.',
    'Personalized Gifts',
    'personalized-gifts',
    ARRAY['Friend', 'Family', 'Him', 'Her', 'Husband', 'Wife', 'Colleague'],
    ARRAY['Birthday', 'Anniversary', 'Farewell', 'Congratulations'],
    'New Arrival',
    '/images/new-products/custom-printed-coffee-mug.jpeg',
    ARRAY[
      '/images/new-products/custom-printed-coffee-mug.jpeg',
      '/images/new-products/custom-printed-coffee-mug-3.jpeg',
      '/images/new-products/custom-printed-coffee-mug-4.jpeg',
      '/images/new-products/custom-printed-coffee-mug-5.jpeg',
      '/images/new-products/custom-printed-coffee-mug-6.jpeg',
      '/images/new-products/printed-coffee-mug-cup.jpeg'
    ],
    10, 1, true, false, base_sort + 3, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'custom-printed-coffee-mug');

  -- 4. Dairy Milk Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Dairy Milk Bouquet',
    'dairy-milk-bouquet',
    'A delightful bouquet crafted entirely from Cadbury Dairy Milk chocolates — a sweet surprise that combines the charm of flowers with the joy of chocolate. A truly unique gift for chocolate lovers.',
    'Chocolate Bouquets',
    'chocolate-bouquets',
    ARRAY['Her', 'Him', 'Friend', 'Family', 'Wife', 'Girlfriend', 'Boyfriend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day', 'Congratulations'],
    'New Arrival',
    '/images/new-products/dairy-milk-bouquet.jpeg',
    ARRAY['/images/new-products/dairy-milk-bouquet.jpeg'],
    10, 1, true, false, base_sort + 4, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'dairy-milk-bouquet');

  -- 5. Dairy Milk Hamper with Toy
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Dairy Milk Hamper with Toy',
    'dairy-milk-hamper-toy',
    'A fun and sweet hamper combining Cadbury Dairy Milk chocolates with an adorable soft toy. A charming gift that brings double the joy — perfect for kids and the young at heart.',
    'Hampers',
    'hampers',
    ARRAY['Friend', 'Family', 'Her', 'Him', 'Girlfriend', 'Boyfriend'],
    ARRAY['Birthday', 'Valentine''s Day', 'Congratulations'],
    'New Arrival',
    '/images/new-products/dairy-milk-hamper-toy.jpeg',
    ARRAY['/images/new-products/dairy-milk-hamper-toy.jpeg'],
    10, 1, true, false, base_sort + 5, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'dairy-milk-hamper-toy');

  -- 6. Happy Birthday Balloon Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Happy Birthday Balloon Hamper',
    'happy-birthday-balloon-hamper',
    'Brighten up any birthday with this cheerful balloon hamper filled with vibrant, colourful balloons and thoughtful goodies. A festive gift that sets the celebration mood instantly.',
    'Hampers',
    'hampers',
    ARRAY['Friend', 'Family', 'Her', 'Him', 'Wife', 'Husband', 'Girlfriend', 'Boyfriend'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/new-products/happy-birthday-balloon-hamper.jpeg',
    ARRAY['/images/new-products/happy-birthday-balloon-hamper.jpeg'],
    10, 1, true, false, base_sort + 6, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'happy-birthday-balloon-hamper');

  -- 7. Happy Birthday Cake & Gift Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Happy Birthday Cake & Gift Hamper',
    'happy-birthday-cake-gift-hamper',
    'Make every birthday unforgettable with this beautifully arranged hamper featuring a birthday cake and curated gifts. A complete celebration package that shows how much you care.',
    'Hampers',
    'hampers',
    ARRAY['Friend', 'Family', 'Her', 'Him', 'Wife', 'Husband'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/new-products/happy-birthday-cake-gift-hamper.jpeg',
    ARRAY['/images/new-products/happy-birthday-cake-gift-hamper.jpeg'],
    10, 1, true, false, base_sort + 7, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'happy-birthday-cake-gift-hamper');

  -- 8. Lily Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Lily Bouquet',
    'lily-bouquet',
    'An elegant bouquet of fresh lilies with their graceful blooms and gentle fragrance. A sophisticated gift that conveys purity, beauty, and heartfelt admiration.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mother', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Mother''s Day', 'Congratulations'],
    'New Arrival',
    '/images/new-products/lily-bouquet.jpeg',
    ARRAY['/images/new-products/lily-bouquet.jpeg'],
    10, 1, true, false, base_sort + 8, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'lily-bouquet');

  -- 9. Lucky Bamboo Tree
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Lucky Bamboo Tree',
    'lucky-bamboo-tree',
    'Bring good fortune and positive energy into any space with this beautiful lucky bamboo tree. A symbol of prosperity and good luck, it makes a meaningful gift for housewarming, new beginnings, or simply to wish someone well.',
    'Plants',
    'plants',
    ARRAY['Friend', 'Family', 'Colleague', 'Him', 'Her'],
    ARRAY['Housewarming', 'Congratulations', 'Birthday', 'New Year'],
    'New Arrival',
    '/images/new-products/lucky-bamboo-tree.jpeg',
    ARRAY['/images/new-products/lucky-bamboo-tree.jpeg'],
    10, 1, true, false, base_sort + 9, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'lucky-bamboo-tree');

  -- 10. Mix Flower Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Flower Hamper',
    'mix-flower-hamper',
    'A vibrant hamper bursting with a colourful mix of fresh seasonal flowers. A cheerful and versatile gift suitable for any occasion — from birthdays to anniversaries to just saying "I care".',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mother', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Mother''s Day', 'Congratulations'],
    'New Arrival',
    '/images/new-products/mix-flower-hamper.jpeg',
    ARRAY['/images/new-products/mix-flower-hamper.jpeg'],
    10, 1, true, false, base_sort + 10, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-flower-hamper');

  -- 11. Mix Lily & Flowers Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Lily & Flowers Bouquet',
    'mix-lily-flowers-bouquet',
    'A stunning arrangement of lilies combined with a variety of fresh seasonal flowers. This mixed bouquet strikes the perfect balance of elegance and colour, making it an ideal gift for any special moment.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mother', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Mother''s Day', 'Congratulations'],
    'New Arrival',
    '/images/new-products/mix-lily-flowers-bouquet.jpeg',
    ARRAY['/images/new-products/mix-lily-flowers-bouquet.jpeg'],
    10, 1, true, false, base_sort + 11, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-lily-flowers-bouquet');

  -- 12. Orchids Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Orchids Bouquet',
    'orchids-bouquet',
    'A luxurious bouquet of exquisite orchids — one of nature''s most elegant blooms. Orchids symbolise love, luxury, and beauty, making this a refined and memorable gift for someone truly special.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mother', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day', 'Mother''s Day'],
    'New Arrival',
    '/images/new-products/orchids-bouquet.jpeg',
    ARRAY['/images/new-products/orchids-bouquet.jpeg'],
    10, 1, true, false, base_sort + 12, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'orchids-bouquet');

  -- 13. Pink Lily Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Lily Bouquet',
    'pink-lily-bouquet',
    'A soft and romantic bouquet of delicate pink lilies. The blush tones radiate warmth and affection, making this a wonderful gift to celebrate love, friendship, and cherished moments.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mother', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day', 'Mother''s Day'],
    'New Arrival',
    '/images/new-products/pink-lily-bouquet.jpeg',
    ARRAY['/images/new-products/pink-lily-bouquet.jpeg'],
    10, 1, true, false, base_sort + 13, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-lily-bouquet');

  -- 14. Pink Rose Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Rose Hamper',
    'pink-rose-hamper',
    'A beautifully presented hamper featuring gorgeous pink roses alongside thoughtfully chosen gifts. Pink roses represent admiration and gratitude — making this an ideal way to show someone how much they mean to you.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mother', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day', 'Mother''s Day'],
    'New Arrival',
    '/images/new-products/pink-rose-hamper.jpeg',
    ARRAY['/images/new-products/pink-rose-hamper.jpeg'],
    10, 1, true, false, base_sort + 14, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-rose-hamper');

  -- 15. Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Rose Bouquet',
    'rose-bouquet',
    'A classic and timeless bouquet of fresh roses — the universal symbol of love and romance. Whether it''s a birthday, anniversary, or just because, a rose bouquet always says it perfectly.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mother', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day', 'Mother''s Day', 'Congratulations'],
    'New Arrival',
    '/images/new-products/rose-bouquet.jpeg',
    ARRAY['/images/new-products/rose-bouquet.jpeg'],
    10, 1, true, false, base_sort + 15, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'rose-bouquet');

  -- 16. Strawberry Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Strawberry Bouquet',
    'strawberry-bouquet',
    'A delightfully unique bouquet crafted from fresh, juicy strawberries arranged just like a flower bouquet. Sweet, fun, and absolutely Instagram-worthy — a one-of-a-kind gift for fruit lovers.',
    'Chocolate Bouquets',
    'chocolate-bouquets',
    ARRAY['Her', 'Him', 'Friend', 'Family', 'Girlfriend', 'Boyfriend', 'Wife'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day', 'Congratulations'],
    'New Arrival',
    '/images/new-products/strawberry-bouquet.jpeg',
    ARRAY['/images/new-products/strawberry-bouquet.jpeg'],
    10, 1, true, false, base_sort + 16, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'strawberry-bouquet');

  -- 17. White Lily Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'White Lily Hamper',
    'white-lily-hamper',
    'A serene and elegant hamper featuring pristine white lilies paired with thoughtful gifts. White lilies symbolise purity, peace, and deep respect — a heartfelt gesture for any meaningful occasion.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Wife', 'Mother', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Mother''s Day', 'Congratulations'],
    'New Arrival',
    '/images/new-products/white-lily-hamper.jpeg',
    ARRAY['/images/new-products/white-lily-hamper.jpeg'],
    10, 1, true, false, base_sort + 17, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'white-lily-hamper');

  -- 18. White Lily, Rose & Mix Flowers Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'White Lily, Rose & Mix Flowers Bouquet',
    'white-lily-rose-mix-bouquet',
    'A breathtaking bouquet combining the purity of white lilies, the romance of roses, and the vibrancy of mixed seasonal flowers. A lavish floral arrangement that makes a grand statement on any special day.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mother', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day', 'Mother''s Day', 'Congratulations'],
    'New Arrival',
    '/images/new-products/white-lily-rose-mix-bouquet.jpeg',
    ARRAY['/images/new-products/white-lily-rose-mix-bouquet.jpeg'],
    10, 1, true, false, base_sort + 18, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'white-lily-rose-mix-bouquet');

  -- 19. White Rose & White Lily Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'White Rose & White Lily Hamper',
    'white-rose-white-lily-hamper',
    'An exquisite hamper featuring the delicate elegance of white roses and white lilies together. This pristine floral hamper conveys grace, sincerity, and deep appreciation — perfect for life''s most meaningful moments.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Wife', 'Mother', 'Friend', 'Family', 'Girlfriend'],
    ARRAY['Birthday', 'Anniversary', 'Mother''s Day', 'Congratulations', 'Valentine''s Day'],
    'New Arrival',
    '/images/new-products/white-rose-white-lily-hamper.jpeg',
    ARRAY['/images/new-products/white-rose-white-lily-hamper.jpeg'],
    10, 1, true, false, base_sort + 19, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'white-rose-white-lily-hamper');

END $$;
