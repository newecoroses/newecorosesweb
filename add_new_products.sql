-- ============================================================
-- NER WEBSITE — Add 40 New Products
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tdttgbmoaskpmmkvjenq/sql
-- ============================================================

-- Get the current max sort_order so new products appear at the end
DO $$
DECLARE
  base_sort INT;
BEGIN
  SELECT COALESCE(MAX(sort_order), 0) INTO base_sort FROM products;

  -- 1. 20 Roses Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    '20 Roses Bouquet',
    '20-roses-bouquet',
    'A stunning bouquet of 20 fresh roses, perfect for expressing love and appreciation. A timeless gift for any special occasion.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/20-roses-bouquet.jpeg',
    ARRAY['/images/products/20-roses-bouquet.jpeg'],
    10, 1, true, false, base_sort + 1, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = '20-roses-bouquet');

  -- 2. Anniversary Beautiful Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Anniversary Beautiful Hamper',
    'anniversary-beautiful-hamper',
    'A beautifully curated anniversary hamper filled with flowers and thoughtful gifts to celebrate your special milestone together.',
    'Hampers',
    'hampers',
    ARRAY['Wife', 'Husband', 'Couple', 'Girlfriend', 'Boyfriend'],
    ARRAY['Anniversary'],
    'New Arrival',
    '/images/products/anniversary-beautiful-hamper.jpeg',
    ARRAY['/images/products/anniversary-beautiful-hamper.jpeg'],
    10, 1, true, false, base_sort + 2, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'anniversary-beautiful-hamper');

  -- 3. Happy Birthday Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Happy Birthday Hamper',
    'happy-birthday-hamper',
    'Make someone''s birthday extra special with this delightful hamper filled with flowers and celebratory goodies.',
    'Hampers',
    'hampers',
    ARRAY['Friend', 'Family', 'Her', 'Him'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/happy-birthday-hamper.jpeg',
    ARRAY['/images/products/happy-birthday-hamper.jpeg'],
    10, 1, true, false, base_sort + 3, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'happy-birthday-hamper');

  -- 4. Happy Birthday Rose Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Happy Birthday Rose Hamper',
    'happy-birthday-rose-hamper',
    'A gorgeous birthday rose hamper combining fresh roses with curated gifts — the perfect birthday surprise.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend', 'Family'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/happy-birthday-rose-hamper.jpeg',
    ARRAY['/images/products/happy-birthday-rose-hamper.jpeg'],
    10, 1, true, false, base_sort + 4, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'happy-birthday-rose-hamper');

  -- 5. Mix Flower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Flower Bouquet',
    'mix-flower-bouquet-new',
    'A vibrant mix of seasonal flowers expertly arranged into a colourful bouquet that brightens any room.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Friend', 'Family', 'Wife', 'Girlfriend'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-flower-bouquet-new.jpeg',
    ARRAY['/images/products/mix-flower-bouquet-new.jpeg'],
    10, 1, true, false, base_sort + 5, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-flower-bouquet-new');

  -- 6. Pink Rose and Flowers Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Rose and Flowers Hamper',
    'pink-rose-and-flowers-hamper',
    'An elegant hamper featuring soft pink roses and a variety of blooms, perfect for expressing tenderness and love.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/pink-rose-and-flowers-hamper.jpeg',
    ARRAY['/images/products/pink-rose-and-flowers-hamper.jpeg'],
    10, 1, true, false, base_sort + 6, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-rose-and-flowers-hamper');

  -- 7. Teddy and Balloon with Flower Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Teddy and Balloon with Flower Hamper',
    'teddy-and-balloon-with-flower-hamper',
    'A fun and festive hamper with a cute teddy, cheerful balloons, and fresh flowers — a complete celebration package.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Kids', 'Friend', 'Girlfriend', 'Wife'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/teddy-and-balloon-with-flower-hamper.jpeg',
    ARRAY['/images/products/teddy-and-balloon-with-flower-hamper.jpeg'],
    10, 1, true, false, base_sort + 7, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'teddy-and-balloon-with-flower-hamper');

  -- 8. Anniversary Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Anniversary Hamper',
    'anniversary-hamper',
    'Celebrate your anniversary in style with this thoughtfully assembled hamper featuring flowers and special gifts.',
    'Hampers',
    'hampers',
    ARRAY['Wife', 'Husband', 'Couple', 'Girlfriend', 'Boyfriend'],
    ARRAY['Anniversary'],
    'New Arrival',
    '/images/products/anniversary-hamper.jpeg',
    ARRAY['/images/products/anniversary-hamper.jpeg'],
    10, 1, true, false, base_sort + 8, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'anniversary-hamper');

  -- 9. Baby's Breath Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Baby''s Breath Bouquet',
    'baby-breath-bouquet',
    'A delicate and ethereal bouquet of pure white baby''s breath, symbolising innocence and everlasting love.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/baby-breath-bouquet.jpeg',
    ARRAY['/images/products/baby-breath-bouquet.jpeg'],
    10, 1, true, false, base_sort + 9, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'baby-breath-bouquet');

  -- 10. Ferrero Rocher Chocolate Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Ferrero Rocher Chocolate Bouquet',
    'ferrero-rocher-chocolate-bouquet',
    'A delicious bouquet crafted from golden Ferrero Rocher chocolates — an indulgent treat for any sweet lover.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Him', 'Friend', 'Family', 'Corporate'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/ferrero-rocher-chocolate-bouquet.jpeg',
    ARRAY['/images/products/ferrero-rocher-chocolate-bouquet.jpeg'],
    10, 1, true, false, base_sort + 10, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ferrero-rocher-chocolate-bouquet');

  -- 11. Flower and Balloon Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Flower and Balloon Hamper',
    'flower-and-balloon-hamper',
    'A cheerful combination of fresh flowers and colourful balloons that creates an uplifting and festive celebration gift.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Friend', 'Family', 'Girlfriend', 'Kids'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/flower-and-balloon-hamper.jpeg',
    ARRAY['/images/products/flower-and-balloon-hamper.jpeg'],
    10, 1, true, false, base_sort + 11, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'flower-and-balloon-hamper');

  -- 12. Flower Mix Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Flower Mix Hamper',
    'flower-mix-hamper',
    'A beautifully arranged hamper featuring a mix of fresh seasonal flowers, perfect for any gifting occasion.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Friend', 'Family', 'Wife'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/flower-mix-hamper.jpeg',
    ARRAY['/images/products/flower-mix-hamper.jpeg'],
    10, 1, true, false, base_sort + 12, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'flower-mix-hamper');

  -- 13. Happy Birthday Gift Box
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Happy Birthday Gift Box',
    'happy-birthday-gift-box',
    'A carefully curated birthday gift box packed with surprises to make the birthday person feel truly special.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/happy-birthday-gift-box.jpeg',
    ARRAY['/images/products/happy-birthday-gift-box.jpeg'],
    10, 1, true, false, base_sort + 13, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'happy-birthday-gift-box');

  -- 14. Happy Birthday Papa Balloon Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Happy Birthday Papa Balloon Bouquet',
    'happy-birthday-papa-balloon-bouquet',
    'A fun and heartfelt birthday balloon bouquet dedicated to Dad, filled with love and celebratory cheer.',
    'Bouquets',
    'bouquets',
    ARRAY['Family', 'Him'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/happy-birthday-papa-balloon-bouquet.jpeg',
    ARRAY['/images/products/happy-birthday-papa-balloon-bouquet.jpeg'],
    10, 1, true, false, base_sort + 14, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'happy-birthday-papa-balloon-bouquet');

  -- 15. Lily Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Lily Bouquet',
    'lily-bouquet',
    'An elegant bouquet of fresh lilies exuding grace and sophistication — ideal for birthdays and special celebrations.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/lily-bouquet.jpeg',
    ARRAY['/images/products/lily-bouquet.jpeg'],
    10, 1, true, false, base_sort + 15, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'lily-bouquet');

  -- 16. Lily Flower Funeral Wreath
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Lily Flower Funeral Wreath',
    'lily-flower-funeral-wreath',
    'A serene and respectful funeral wreath crafted from fresh white lilies, offering comfort and peace.',
    'Bouquets',
    'bouquets',
    ARRAY['Family', 'Friend'],
    ARRAY[]::text[],
    'New Arrival',
    '/images/products/lily-flower-funeral-wreath.jpeg',
    ARRAY['/images/products/lily-flower-funeral-wreath.jpeg'],
    10, 1, true, false, base_sort + 16, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'lily-flower-funeral-wreath');

  -- 17. Love Gift Hamper (Deluxe)
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Love Gift Hamper (Deluxe)',
    'love-gift-hamper-2',
    'A luxurious love hamper brimming with romantic flowers and premium gifts — a grand gesture of love.',
    'Hampers',
    'hampers',
    ARRAY['Wife', 'Husband', 'Girlfriend', 'Boyfriend', 'Couple'],
    ARRAY['Anniversary'],
    'New Arrival',
    '/images/products/love-gift-hamper-2.jpeg',
    ARRAY['/images/products/love-gift-hamper-2.jpeg'],
    10, 1, true, false, base_sort + 17, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'love-gift-hamper-2');

  -- 18. Love Gift Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Love Gift Hamper',
    'love-gift-hamper',
    'Express your deepest feelings with this romantic love hamper, thoughtfully filled with blooms and heartfelt gifts.',
    'Hampers',
    'hampers',
    ARRAY['Wife', 'Husband', 'Girlfriend', 'Boyfriend', 'Couple'],
    ARRAY['Anniversary'],
    'New Arrival',
    '/images/products/love-gift-hamper.jpeg',
    ARRAY['/images/products/love-gift-hamper.jpeg'],
    10, 1, true, false, base_sort + 18, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'love-gift-hamper');

  -- 19. Lucky Bamboo Plant
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Lucky Bamboo Plant',
    'lucky-bamboo-plant',
    'A beautiful Lucky Bamboo plant symbolising good luck, prosperity, and positive energy — a perfect gift.',
    'Bouquets',
    'bouquets',
    ARRAY['Friend', 'Family', 'Corporate'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/lucky-bamboo-plant.jpeg',
    ARRAY['/images/products/lucky-bamboo-plant.jpeg'],
    10, 1, true, false, base_sort + 19, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'lucky-bamboo-plant');

  -- 20. Mix Beautiful Flower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Beautiful Flower Bouquet',
    'mix-beautiful-flower-bouquet',
    'A breathtaking arrangement of mixed beautiful flowers bursting with colour and fragrance for any celebration.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-beautiful-flower-bouquet.jpeg',
    ARRAY['/images/products/mix-beautiful-flower-bouquet.jpeg'],
    10, 1, true, false, base_sort + 20, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-beautiful-flower-bouquet');

  -- 21. Classic Mix Flower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Classic Mix Flower Bouquet',
    'mix-flower-bouquet-classic',
    'A classic arrangement of mixed fresh flowers, beautifully wrapped for a charming and heartfelt gift.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Friend', 'Family', 'Wife'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-flower-bouquet-classic.jpeg',
    ARRAY['/images/products/mix-flower-bouquet-classic.jpeg'],
    10, 1, true, false, base_sort + 21, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-flower-bouquet-classic');

  -- 22. Premium Mix Flower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Premium Mix Flower Bouquet',
    'mix-flower-bouquet-premium',
    'A premium mixed flower bouquet thoughtfully arranged to impress and delight on any special occasion.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-flower-bouquet-premium.jpeg',
    ARRAY['/images/products/mix-flower-bouquet-premium.jpeg'],
    10, 1, true, false, base_sort + 22, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-flower-bouquet-premium');

  -- 23. Mix Flower Hamper with Chocolate
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Flower Hamper with Chocolate',
    'mix-flower-hamper-with-chocolate',
    'The perfect pairing — a lush mix flower hamper combined with indulgent chocolates for a truly special gift.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Him', 'Wife', 'Girlfriend', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-flower-hamper-with-chocolate.jpeg',
    ARRAY['/images/products/mix-flower-hamper-with-chocolate.jpeg'],
    10, 1, true, false, base_sort + 23, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-flower-hamper-with-chocolate');

  -- 24. Mix Flower Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Flower Hamper',
    'mix-flower-hamper',
    'A delightful hamper featuring a colourful mix of fresh flowers, perfect for celebrating life''s beautiful moments.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Friend', 'Family', 'Wife'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-flower-hamper.jpeg',
    ARRAY['/images/products/mix-flower-hamper.jpeg'],
    10, 1, true, false, base_sort + 24, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-flower-hamper');

  -- 25. Mix Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Rose Bouquet',
    'mix-rose-bouquet',
    'A romantic bouquet of mixed-colour roses symbolising all shades of love — perfect for every occasion.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-rose-bouquet.jpeg',
    ARRAY['/images/products/mix-rose-bouquet.jpeg'],
    10, 1, true, false, base_sort + 25, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-rose-bouquet');

  -- 26. Mix Flower Beautiful Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Flower Beautiful Hamper',
    'mix-flower-beautiful-hamper',
    'An exquisite hamper bursting with a beautiful mix of fresh flowers, crafted to make every moment memorable.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-flower-beautiful-hamper.jpeg',
    ARRAY['/images/products/mix-flower-beautiful-hamper.jpeg'],
    10, 1, true, false, base_sort + 26, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-flower-beautiful-hamper');

  -- 27. Pink and White Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink and White Rose Bouquet',
    'pink-and-white-rose-bouquet',
    'A soft and elegant bouquet of pink and white roses, representing grace, purity, and heartfelt affection.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/pink-and-white-rose-bouquet.jpeg',
    ARRAY['/images/products/pink-and-white-rose-bouquet.jpeg'],
    10, 1, true, false, base_sort + 27, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-and-white-rose-bouquet');

  -- 28. Pink Lily Bouquet (Deluxe)
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Lily Bouquet (Deluxe)',
    'pink-lily-bouquet-2',
    'A lavish bouquet of vibrant pink lilies radiating warmth, joy, and admiration — for someone truly special.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/pink-lily-bouquet-2.jpeg',
    ARRAY['/images/products/pink-lily-bouquet-2.jpeg'],
    10, 1, true, false, base_sort + 28, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-lily-bouquet-2');

  -- 29. Pink Lily Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Lily Bouquet',
    'pink-lily-bouquet',
    'Fresh and cheerful pink lilies arranged in a gorgeous bouquet, perfect for birthdays and anniversaries.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/pink-lily-bouquet.jpeg',
    ARRAY['/images/products/pink-lily-bouquet.jpeg'],
    10, 1, true, false, base_sort + 29, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-lily-bouquet');

  -- 30. Pink Rose Bouquet (Premium)
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Rose Bouquet (Premium)',
    'pink-rose-bouquet-2',
    'A premium arrangement of soft pink roses evoking romance, tenderness, and admiration.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/pink-rose-bouquet-2.jpeg',
    ARRAY['/images/products/pink-rose-bouquet-2.jpeg'],
    10, 1, true, false, base_sort + 30, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-rose-bouquet-2');

  -- 31. Pink Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Rose Bouquet',
    'pink-rose-bouquet',
    'Delicate and charming pink roses beautifully arranged for a timeless gift that speaks from the heart.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/pink-rose-bouquet.jpeg',
    ARRAY['/images/products/pink-rose-bouquet.jpeg'],
    10, 1, true, false, base_sort + 31, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-rose-bouquet');

  -- 32. Purple Baby's Breath Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Purple Baby''s Breath Bouquet',
    'purple-baby-breath-bouquet',
    'A dreamy bouquet of purple baby''s breath — soft, romantic, and wonderfully unique for any occasion.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/purple-baby-breath-bouquet.jpeg',
    ARRAY['/images/products/purple-baby-breath-bouquet.jpeg'],
    10, 1, true, false, base_sort + 32, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'purple-baby-breath-bouquet');

  -- 33. Red Rose Bouquet (Special Edition)
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red Rose Bouquet (Special Edition)',
    'red-rose-bouquet-special',
    'A special edition red rose bouquet showcasing the timeless beauty of love — perfect for anniversaries and grand gestures.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Couple'],
    ARRAY['Anniversary'],
    'New Arrival',
    '/images/products/red-rose-bouquet-special.jpeg',
    ARRAY['/images/products/red-rose-bouquet-special.jpeg'],
    10, 1, true, false, base_sort + 33, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-rose-bouquet-special');

  -- 34. Red Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red Rose Bouquet',
    'red-rose-bouquet',
    'The classic symbol of love — a beautiful bouquet of vibrant red roses for the most romantic moments.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Couple'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/red-rose-bouquet.jpeg',
    ARRAY['/images/products/red-rose-bouquet.jpeg'],
    10, 1, true, false, base_sort + 34, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-rose-bouquet');

  -- 35. Red Roses Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red Roses Bouquet',
    'red-roses-bouquet',
    'A lush arrangement of fresh red roses, passionately presented for the most heartfelt of declarations.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Couple'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/red-roses-bouquet.jpeg',
    ARRAY['/images/products/red-roses-bouquet.jpeg'],
    10, 1, true, false, base_sort + 35, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-roses-bouquet');

  -- 36. Sunflower and Carnation Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Sunflower and Carnation Hamper',
    'sunflower-and-carnation-hamper',
    'A sunny and cheerful hamper combining vibrant sunflowers with elegant carnations for a warm, uplifting gift.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Friend', 'Family', 'Wife', 'Girlfriend'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/sunflower-and-carnation-hamper.jpeg',
    ARRAY['/images/products/sunflower-and-carnation-hamper.jpeg'],
    10, 1, true, false, base_sort + 36, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'sunflower-and-carnation-hamper');

  -- 37. Teddy and Chocolate Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Teddy and Chocolate Hamper',
    'teddy-and-chocolate-hamper',
    'A sweet and cuddly hamper featuring a soft teddy bear and indulgent chocolates — the ultimate comfort gift.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Kids', 'Friend', 'Girlfriend', 'Wife'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/teddy-and-chocolate-hamper.jpeg',
    ARRAY['/images/products/teddy-and-chocolate-hamper.jpeg'],
    10, 1, true, false, base_sort + 37, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'teddy-and-chocolate-hamper');

  -- 38. White Lily Beautiful Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'White Lily Beautiful Hamper',
    'white-lily-beautiful-hamper',
    'A refined hamper of pristine white lilies symbolising purity and elegance — a deeply meaningful gift.',
    'Hampers',
    'hampers',
    ARRAY['Her', 'Wife', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/white-lily-beautiful-hamper.jpeg',
    ARRAY['/images/products/white-lily-beautiful-hamper.jpeg'],
    10, 1, true, false, base_sort + 38, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'white-lily-beautiful-hamper');

  -- 39. White Lily Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'White Lily Bouquet',
    'white-lily-bouquet',
    'Pure and graceful white lilies arranged in a stunning bouquet — a classic expression of beauty and devotion.',
    'Bouquets',
    'bouquets',
    ARRAY['Her', 'Wife', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/white-lily-bouquet.jpeg',
    ARRAY['/images/products/white-lily-bouquet.jpeg'],
    10, 1, true, false, base_sort + 39, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'white-lily-bouquet');

  -- 40. Yellow Rose Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Yellow Rose Hamper',
    'yellow-rose-hamper',
    'Bright and joyful yellow roses arranged in a beautiful hamper, perfect for celebrating friendship and happiness.',
    'Hampers',
    'hampers',
    ARRAY['Friend', 'Family', 'Her'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/yellow-rose-hamper.jpeg',
    ARRAY['/images/products/yellow-rose-hamper.jpeg'],
    10, 1, true, false, base_sort + 40, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'yellow-rose-hamper');

  -- 41. Yellow Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, item_count, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Yellow Rose Bouquet',
    'yellow-rose-bouquet',
    'A cheerful bouquet of sunny yellow roses that spread joy and warmth — perfect for brightening someone''s day.',
    'Bouquets',
    'bouquets',
    ARRAY['Friend', 'Family', 'Her'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/yellow-rose-bouquet.jpeg',
    ARRAY['/images/products/yellow-rose-bouquet.jpeg'],
    10, 1, true, false, base_sort + 41, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'yellow-rose-bouquet');

END $$;

-- Verify: count newly added products
SELECT COUNT(*) as total_products FROM products;

-- Preview the new products (last 41)
SELECT name, slug, tag, is_visible FROM products ORDER BY sort_order DESC LIMIT 41;