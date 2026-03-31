-- ============================================================
-- NER WEBSITE — Add 83 New Products from /newero folder
-- All products tagged as 'New Arrival'
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tdttgbmoaskpmmkvjenq/sql
-- ============================================================

DO $$
DECLARE
  base_sort INT;
BEGIN
  SELECT COALESCE(MAX(sort_order), 0) INTO base_sort FROM products;

  -- 1. 2 Sunflower and Baby's Breath Big Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    '2 Sunflower and Baby''s Breath Big Bouquet',
    '2-sunflower-babys-breath-big-bouquet',
    'A beautiful 2 sunflower and baby''s breath big bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/2-sunflower-babys-breath-big-bouquet.jpeg',
    ARRAY['/images/products/2-sunflower-babys-breath-big-bouquet.jpeg'],
    10, true, false, base_sort + 1, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = '2-sunflower-babys-breath-big-bouquet');

  -- 2. 20 Piece Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    '20 Piece Rose Bouquet',
    '20-piece-rose-bouquet',
    'A beautiful 20 piece rose bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mum', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/20-piece-rose-bouquet.jpeg',
    ARRAY['/images/products/20-piece-rose-bouquet.jpeg'],
    10, true, false, base_sort + 2, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = '20-piece-rose-bouquet');

  -- 3. 4 Piece Sunflower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    '4 Piece Sunflower Bouquet',
    '4-piece-sunflower-bouquet',
    'A beautiful 4 piece sunflower bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/4-piece-sunflower-bouquet.jpeg',
    ARRAY['/images/products/4-piece-sunflower-bouquet.jpeg'],
    10, true, false, base_sort + 3, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = '4-piece-sunflower-bouquet');

  -- 4. 4 Teddy Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    '4 Teddy Bouquet',
    '4-teddy-bouquet',
    'A beautiful 4 teddy bouquet. Perfect for expressing your feelings on any special occasion.',
    'Teddy and Bouquet',
    'teddy-and-bouquet',
    ARRAY['Her', 'Daughter', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/4-teddy-bouquet.jpeg',
    ARRAY['/images/products/4-teddy-bouquet.jpeg'],
    10, true, false, base_sort + 4, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = '4-teddy-bouquet');

  -- 5. 5 Piece Dairy Milk Little Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    '5 Piece Dairy Milk Little Hamper',
    '5-piece-dairy-milk-little-hamper',
    'A beautiful 5 piece dairy milk little hamper. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/5-piece-dairy-milk-little-hamper.jpeg',
    ARRAY['/images/products/5-piece-dairy-milk-little-hamper.jpeg'],
    10, true, false, base_sort + 5, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = '5-piece-dairy-milk-little-hamper');

  -- 6. 5 Star Chocolate Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    '5 Star Chocolate Bouquet',
    '5-star-chocolate-bouquet',
    'A beautiful 5 star chocolate bouquet. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/5-star-chocolate-bouquet.jpeg',
    ARRAY['/images/products/5-star-chocolate-bouquet.jpeg'],
    10, true, false, base_sort + 6, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = '5-star-chocolate-bouquet');

  -- 7. 6 Piece Sunflower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    '6 Piece Sunflower Bouquet',
    '6-piece-sunflower-bouquet',
    'A beautiful 6 piece sunflower bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/6-piece-sunflower-bouquet.jpeg',
    ARRAY['/images/products/6-piece-sunflower-bouquet.jpeg'],
    10, true, false, base_sort + 7, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = '6-piece-sunflower-bouquet');

  -- 8. Chocolate Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Chocolate Hamper',
    'chocolate-hamper',
    'A beautiful chocolate hamper. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/chocolate-hamper.jpeg',
    ARRAY['/images/products/chocolate-hamper.jpeg'],
    10, true, false, base_sort + 8, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'chocolate-hamper');

  -- 9. Happy Birthday Cake and Flower Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Happy Birthday Cake and Flower Hamper',
    'happy-birthday-cake-and-flower-hamper',
    'A beautiful happy birthday cake and flower hamper. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/happy-birthday-cake-and-flower-hamper.jpeg',
    ARRAY['/images/products/happy-birthday-cake-and-flower-hamper.jpeg'],
    10, true, false, base_sort + 9, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'happy-birthday-cake-and-flower-hamper');

  -- 10. Happy Birthday Flowers and Cake Combo
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Happy Birthday Flowers and Cake Combo',
    'happy-birthday-flowers-and-cake-combo',
    'A beautiful happy birthday flowers and cake combo. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/happy-birthday-flowers-and-cake-combo.jpeg',
    ARRAY['/images/products/happy-birthday-flowers-and-cake-combo.jpeg'],
    10, true, false, base_sort + 10, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'happy-birthday-flowers-and-cake-combo');

  -- 11. Funeral Flower Decoration 2
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Funeral Flower Decoration 2',
    'funeral-flower-decoration-2',
    'A beautiful funeral flower decoration 2. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Family', 'Friend'],
    ARRAY['Sympathy'],
    'New Arrival',
    '/images/products/funeral-flower-decoration-2.jpeg',
    ARRAY['/images/products/funeral-flower-decoration-2.jpeg'],
    10, true, false, base_sort + 11, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'funeral-flower-decoration-2');

  -- 12. Sunflower Bouquet 2
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Sunflower Bouquet 2',
    'sunflower-bouquet-2',
    'A beautiful sunflower bouquet 2. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/sunflower-bouquet-2.jpeg',
    ARRAY['/images/products/sunflower-bouquet-2.jpeg'],
    10, true, false, base_sort + 12, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'sunflower-bouquet-2');

  -- 13. Balloon and Flower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Balloon and Flower Bouquet',
    'balloon-and-flower-bouquet',
    'A beautiful balloon and flower bouquet. Perfect for expressing your feelings on any special occasion.',
    'Balloon Bouquet',
    'balloon-bouquet',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/balloon-and-flower-bouquet.jpeg',
    ARRAY['/images/products/balloon-and-flower-bouquet.jpeg'],
    10, true, false, base_sort + 13, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'balloon-and-flower-bouquet');

  -- 14. Big Dairy Milk Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Big Dairy Milk Bouquet',
    'big-dairy-milk-bouquet',
    'A beautiful big dairy milk bouquet. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/big-dairy-milk-bouquet.jpeg',
    ARRAY['/images/products/big-dairy-milk-bouquet.jpeg'],
    10, true, false, base_sort + 14, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'big-dairy-milk-bouquet');

  -- 15. Big Sunflower Bouquet 2
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Big Sunflower Bouquet 2',
    'big-sunflower-bouquet-2',
    'A beautiful big sunflower bouquet 2. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/big-sunflower-bouquet-2.jpeg',
    ARRAY['/images/products/big-sunflower-bouquet-2.jpeg'],
    10, true, false, base_sort + 15, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'big-sunflower-bouquet-2');

  -- 16. Big Sunflower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Big Sunflower Bouquet',
    'big-sunflower-bouquet',
    'A beautiful big sunflower bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/big-sunflower-bouquet.jpeg',
    ARRAY['/images/products/big-sunflower-bouquet.jpeg'],
    10, true, false, base_sort + 16, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'big-sunflower-bouquet');

  -- 17. Big Flower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Big Flower Bouquet',
    'big-flower-bouquet',
    'A beautiful big flower bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Wife', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Wedding'],
    'New Arrival',
    '/images/products/big-flower-bouquet-1.jpeg',
    ARRAY['/images/products/big-flower-bouquet-1.jpeg', '/images/products/big-flower-bouquet-2.jpeg', '/images/products/big-flower-bouquet-3.jpeg'],
    10, true, false, base_sort + 17, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'big-flower-bouquet');

  -- 18. Birthday Chocolate Bouquet with Photo
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Birthday Chocolate Bouquet with Photo',
    'birthday-chocolate-bouquet-with-photo',
    'A beautiful birthday chocolate bouquet with photo. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/birthday-chocolate-bouquet-with-photo.jpeg',
    ARRAY['/images/products/birthday-chocolate-bouquet-with-photo.jpeg'],
    10, true, false, base_sort + 18, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'birthday-chocolate-bouquet-with-photo');

  -- 19. Chocolates and Teddy Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Chocolates and Teddy Hamper',
    'chocolates-and-teddy-hamper',
    'A beautiful chocolates and teddy hamper. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Her', 'Daughter', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/chocolates-and-teddy-hamper.jpeg',
    ARRAY['/images/products/chocolates-and-teddy-hamper.jpeg'],
    10, true, false, base_sort + 19, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'chocolates-and-teddy-hamper');

  -- 20. Chocolates Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Chocolates Bouquet',
    'chocolates-bouquet',
    'A beautiful chocolates bouquet. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/chocolates-bouquet.jpeg',
    ARRAY['/images/products/chocolates-bouquet.jpeg'],
    10, true, false, base_sort + 20, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'chocolates-bouquet');

  -- 21. Dairy Milk and Ferrero Rocher Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Dairy Milk and Ferrero Rocher Bouquet',
    'dairy-milk-ferrero-rocher-bouquet',
    'A beautiful dairy milk and ferrero rocher bouquet. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/dairy-milk-ferrero-rocher-bouquet.jpeg',
    ARRAY['/images/products/dairy-milk-ferrero-rocher-bouquet.jpeg'],
    10, true, false, base_sort + 21, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'dairy-milk-ferrero-rocher-bouquet');

  -- 22. Dairy Milk Chocolate Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Dairy Milk Chocolate Bouquet',
    'dairy-milk-chocolate-bouquet',
    'A beautiful dairy milk chocolate bouquet. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/dairy-milk-chocolate-bouquet.jpeg',
    ARRAY['/images/products/dairy-milk-chocolate-bouquet.jpeg'],
    10, true, false, base_sort + 22, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'dairy-milk-chocolate-bouquet');

  -- 23. Dairy Milk Chocolate Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Dairy Milk Chocolate Hamper',
    'dairy-milk-chocolate-hamper',
    'A beautiful dairy milk chocolate hamper. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/dairy-milk-chocolate-hamper.jpeg',
    ARRAY['/images/products/dairy-milk-chocolate-hamper.jpeg'],
    10, true, false, base_sort + 23, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'dairy-milk-chocolate-hamper');

  -- 24. Daughters Day Balloon Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Daughters Day Balloon Hamper',
    'daughters-day-balloon-hamper',
    'A beautiful daughters day balloon hamper. Perfect for expressing your feelings on any special occasion.',
    'Balloon Bouquet',
    'balloon-bouquet',
    ARRAY['Daughter', 'Her', 'Family'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/daughters-day-balloon-hamper.jpeg',
    ARRAY['/images/products/daughters-day-balloon-hamper.jpeg'],
    10, true, false, base_sort + 24, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'daughters-day-balloon-hamper');

  -- 25. Ferrero Rocher Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Ferrero Rocher Bouquet',
    'ferrero-rocher-bouquet',
    'A beautiful ferrero rocher bouquet. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/ferrero-rocher-bouquet.jpeg',
    ARRAY['/images/products/ferrero-rocher-bouquet.jpeg'],
    10, true, false, base_sort + 25, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ferrero-rocher-bouquet');

  -- 26. Ferrero Rocher Chocolate Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Ferrero Rocher Chocolate Bouquet',
    'ferrero-rocher-chocolate-bouquet',
    'A beautiful ferrero rocher chocolate bouquet. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/ferrero-rocher-chocolate-bouquet.jpeg',
    ARRAY['/images/products/ferrero-rocher-chocolate-bouquet.jpeg'],
    10, true, false, base_sort + 26, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ferrero-rocher-chocolate-bouquet');

  -- 27. Ferrero Rocher Chocolate Bouquet 2
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Ferrero Rocher Chocolate Bouquet 2',
    'ferrero-rocher-chocolate-bouquet-2',
    'A beautiful ferrero rocher chocolate bouquet 2. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/ferrero-rocher-chocolate-bouquet-2.jpeg',
    ARRAY['/images/products/ferrero-rocher-chocolate-bouquet-2.jpeg'],
    10, true, false, base_sort + 27, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ferrero-rocher-chocolate-bouquet-2');

  -- 28. Ferrero Rocher Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Ferrero Rocher Hamper',
    'ferrero-rocher-hamper',
    'A beautiful ferrero rocher hamper. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/ferrero-rocher-hamper.jpeg',
    ARRAY['/images/products/ferrero-rocher-hamper.jpeg'],
    10, true, false, base_sort + 28, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ferrero-rocher-hamper');

  -- 29. Flower Basket Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Flower Basket Hamper',
    'flower-basket-hamper',
    'A beautiful flower basket hamper. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Mother''s Day'],
    'New Arrival',
    '/images/products/flower-basket-hamper.jpeg',
    ARRAY['/images/products/flower-basket-hamper.jpeg'],
    10, true, false, base_sort + 29, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'flower-basket-hamper');

  -- 30. Funeral Flower Decoration
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Funeral Flower Decoration',
    'funeral-flower-decoration',
    'A beautiful funeral flower decoration. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Family', 'Friend'],
    ARRAY['Sympathy'],
    'New Arrival',
    '/images/products/funeral-flower-decoration.jpeg',
    ARRAY['/images/products/funeral-flower-decoration.jpeg'],
    10, true, false, base_sort + 30, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'funeral-flower-decoration');

  -- 31. Garland Set
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Garland Set',
    'garland-set',
    'A beautiful garland set. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Family', 'Couple'],
    ARRAY['Wedding', 'Anniversary'],
    'New Arrival',
    '/images/products/garland-set.jpeg',
    ARRAY['/images/products/garland-set.jpeg'],
    10, true, false, base_sort + 31, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'garland-set');

  -- 32. Gate Decoration
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Gate Decoration',
    'gate-decoration',
    'A beautiful gate decoration. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Family', 'Couple'],
    ARRAY['Wedding', 'Anniversary', 'Birthday'],
    'New Arrival',
    '/images/products/gate-decoration.jpeg',
    ARRAY['/images/products/gate-decoration.jpeg'],
    10, true, false, base_sort + 32, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'gate-decoration');

  -- 33. Happy Birthday Balloon and Ferrero Rocher Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Happy Birthday Balloon and Ferrero Rocher Hamper',
    'happy-birthday-balloon-ferrero-rocher-hamper',
    'A beautiful happy birthday balloon and ferrero rocher hamper. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/happy-birthday-balloon-ferrero-rocher-hamper.jpeg',
    ARRAY['/images/products/happy-birthday-balloon-ferrero-rocher-hamper.jpeg'],
    10, true, false, base_sort + 33, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'happy-birthday-balloon-ferrero-rocher-hamper');

  -- 34. Happy Birthday Balloon Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Happy Birthday Balloon Bouquet',
    'happy-birthday-balloon-bouquet',
    'A beautiful happy birthday balloon bouquet. Perfect for expressing your feelings on any special occasion.',
    'Balloon Bouquet',
    'balloon-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/happy-birthday-balloon-bouquet.jpeg',
    ARRAY['/images/products/happy-birthday-balloon-bouquet.jpeg'],
    10, true, false, base_sort + 34, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'happy-birthday-balloon-bouquet');

  -- 35. KitKat and Ferrero Rocher Love Shape Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'KitKat and Ferrero Rocher Love Shape Hamper',
    'kitkat-ferrero-rocher-love-shape-hamper',
    'A beautiful kitkat and ferrero rocher love shape hamper. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Her', 'Wife', 'Girlfriend'],
    ARRAY['Valentine''s Day', 'Anniversary', 'Birthday'],
    'New Arrival',
    '/images/products/kitkat-ferrero-rocher-love-shape-hamper.jpeg',
    ARRAY['/images/products/kitkat-ferrero-rocher-love-shape-hamper.jpeg'],
    10, true, false, base_sort + 35, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'kitkat-ferrero-rocher-love-shape-hamper');

  -- 36. KitKat Chocolate Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'KitKat Chocolate Bouquet',
    'kitkat-chocolate-bouquet',
    'A beautiful kitkat chocolate bouquet. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/kitkat-chocolate-bouquet.jpeg',
    ARRAY['/images/products/kitkat-chocolate-bouquet.jpeg'],
    10, true, false, base_sort + 36, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'kitkat-chocolate-bouquet');

  -- 37. KitKat Dairy Milk and Ferrero Rocher Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'KitKat Dairy Milk and Ferrero Rocher Bouquet',
    'kitkat-dairy-milk-ferrero-rocher-bouquet',
    'A beautiful kitkat dairy milk and ferrero rocher bouquet. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/kitkat-dairy-milk-ferrero-rocher-bouquet.jpeg',
    ARRAY['/images/products/kitkat-dairy-milk-ferrero-rocher-bouquet.jpeg'],
    10, true, false, base_sort + 37, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'kitkat-dairy-milk-ferrero-rocher-bouquet');

  -- 38. Lily and Sunflower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Lily and Sunflower Bouquet',
    'lily-and-sunflower-bouquet',
    'A beautiful lily and sunflower bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Mother''s Day'],
    'New Arrival',
    '/images/products/lily-and-sunflower-bouquet.jpeg',
    ARRAY['/images/products/lily-and-sunflower-bouquet.jpeg'],
    10, true, false, base_sort + 38, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'lily-and-sunflower-bouquet');

  -- 39. Lily Beautiful Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Lily Beautiful Bouquet',
    'lily-beautiful-bouquet',
    'A beautiful lily beautiful bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Wife', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Mother''s Day'],
    'New Arrival',
    '/images/products/lily-beautiful-bouquet.jpeg',
    ARRAY['/images/products/lily-beautiful-bouquet.jpeg'],
    10, true, false, base_sort + 39, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'lily-beautiful-bouquet');

  -- 40. Lily Bouquet 2
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Lily Bouquet 2',
    'lily-bouquet-2',
    'A beautiful lily bouquet 2. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/lily-bouquet-2.jpeg',
    ARRAY['/images/products/lily-bouquet-2.jpeg'],
    10, true, false, base_sort + 40, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'lily-bouquet-2');

  -- 41. Lily Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Lily Bouquet',
    'lily-bouquet',
    'A beautiful lily bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/lily-bouquet.jpeg',
    ARRAY['/images/products/lily-bouquet.jpeg'],
    10, true, false, base_sort + 41, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'lily-bouquet');

  -- 42. Mix Chocolate Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Chocolate Hamper',
    'mix-chocolate-hamper',
    'A beautiful mix chocolate hamper. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-chocolate-hamper.jpeg',
    ARRAY['/images/products/mix-chocolate-hamper.jpeg'],
    10, true, false, base_sort + 42, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-chocolate-hamper');

  -- 43. Mix Chocolates Aesthetic Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Chocolates Aesthetic Hamper',
    'mix-chocolates-aesthetic-hamper',
    'A beautiful mix chocolates aesthetic hamper. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-chocolates-aesthetic-hamper.jpeg',
    ARRAY['/images/products/mix-chocolates-aesthetic-hamper.jpeg'],
    10, true, false, base_sort + 43, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-chocolates-aesthetic-hamper');

  -- 44. Mix Color Babys Breath Flower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Color Babys Breath Flower Bouquet',
    'mix-color-babys-breath-flower-bouquet',
    'A beautiful mix color babys breath flower bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Wedding'],
    'New Arrival',
    '/images/products/mix-color-babys-breath-flower-bouquet.jpeg',
    ARRAY['/images/products/mix-color-babys-breath-flower-bouquet.jpeg'],
    10, true, false, base_sort + 44, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-color-babys-breath-flower-bouquet');

  -- 45. Mix Flower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Flower Bouquet',
    'mix-flower-bouquet',
    'A beautiful mix flower bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-flower-bouquet.jpeg',
    ARRAY['/images/products/mix-flower-bouquet.jpeg'],
    10, true, false, base_sort + 45, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-flower-bouquet');

  -- 46. Mix Flower Bouquet 2
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Flower Bouquet 2',
    'mix-flower-bouquet-2',
    'A beautiful mix flower bouquet 2. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-flower-bouquet-2.jpeg',
    ARRAY['/images/products/mix-flower-bouquet-2.jpeg'],
    10, true, false, base_sort + 46, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-flower-bouquet-2');

  -- 47. Mix Little Flower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Mix Little Flower Bouquet',
    'mix-little-flower-bouquet',
    'A beautiful mix little flower bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/mix-little-flower-bouquet.jpeg',
    ARRAY['/images/products/mix-little-flower-bouquet.jpeg'],
    10, true, false, base_sort + 47, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mix-little-flower-bouquet');

  -- 48. Orange Rose Garland Set
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Orange Rose Garland Set',
    'orange-rose-garland-set',
    'A beautiful orange rose garland set. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Family', 'Couple'],
    ARRAY['Wedding', 'Anniversary'],
    'New Arrival',
    '/images/products/orange-rose-garland-set.jpeg',
    ARRAY['/images/products/orange-rose-garland-set.jpeg'],
    10, true, false, base_sort + 48, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'orange-rose-garland-set');

  -- 49. Orchids Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Orchids Bouquet',
    'orchids-bouquet',
    'A beautiful orchids bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Wife', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Mother''s Day'],
    'New Arrival',
    '/images/products/orchids-bouquet.jpeg',
    ARRAY['/images/products/orchids-bouquet.jpeg'],
    10, true, false, base_sort + 49, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'orchids-bouquet');

  -- 50. Orchids Small Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Orchids Small Bouquet',
    'orchids-small-bouquet',
    'A beautiful orchids small bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/orchids-small-bouquet.jpeg',
    ARRAY['/images/products/orchids-small-bouquet.jpeg'],
    10, true, false, base_sort + 50, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'orchids-small-bouquet');

  -- 51. Pink Lily Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Lily Bouquet',
    'pink-lily-bouquet',
    'A beautiful pink lily bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Wife', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Mother''s Day'],
    'New Arrival',
    '/images/products/pink-lily-bouquet.jpeg',
    ARRAY['/images/products/pink-lily-bouquet.jpeg'],
    10, true, false, base_sort + 51, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-lily-bouquet');

  -- 52. Pink Rose Chrysanthemum and Babys Breath Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Rose Chrysanthemum and Babys Breath Bouquet',
    'pink-rose-chrysanthemum-babys-breath-bouquet',
    'A beautiful pink rose chrysanthemum and babys breath bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Wife', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Mother''s Day', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/pink-rose-chrysanthemum-babys-breath-bouquet-1.jpeg',
    ARRAY['/images/products/pink-rose-chrysanthemum-babys-breath-bouquet-1.jpeg', '/images/products/pink-rose-chrysanthemum-babys-breath-bouquet-2.jpeg'],
    10, true, false, base_sort + 52, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-rose-chrysanthemum-babys-breath-bouquet');

  -- 53. Pink Rose Babys Breath Lily and Mix Flowers Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Rose Babys Breath Lily and Mix Flowers Bouquet',
    'pink-rose-babys-breath-lily-mix-flowers-bouquet',
    'A beautiful pink rose babys breath lily and mix flowers bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Wife', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Wedding'],
    'New Arrival',
    '/images/products/pink-rose-babys-breath-lily-mix-flowers-bouquet.jpeg',
    ARRAY['/images/products/pink-rose-babys-breath-lily-mix-flowers-bouquet.jpeg'],
    10, true, false, base_sort + 53, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-rose-babys-breath-lily-mix-flowers-bouquet');

  -- 54. Pink Rose and Babys Breath Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Rose and Babys Breath Bouquet',
    'pink-rose-babys-breath-bouquet',
    'A beautiful pink rose and babys breath bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Wife', 'Girlfriend', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/pink-rose-babys-breath-bouquet.jpeg',
    ARRAY['/images/products/pink-rose-babys-breath-bouquet.jpeg'],
    10, true, false, base_sort + 54, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-rose-babys-breath-bouquet');

  -- 55. Pink Rose Lily Chrysanthemums and Babys Breath Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Rose Lily Chrysanthemums and Babys Breath Bouquet',
    'pink-rose-lily-chrysanthemums-babys-breath-bouquet',
    'A beautiful pink rose lily chrysanthemums and babys breath bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Wife', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Wedding', 'Mother''s Day'],
    'New Arrival',
    '/images/products/pink-rose-lily-chrysanthemums-babys-breath-bouquet.jpeg',
    ARRAY['/images/products/pink-rose-lily-chrysanthemums-babys-breath-bouquet.jpeg'],
    10, true, false, base_sort + 55, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-rose-lily-chrysanthemums-babys-breath-bouquet');

  -- 56. Pink Rose and Yellow Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Rose and Yellow Rose Bouquet',
    'pink-rose-and-yellow-rose-bouquet',
    'A beautiful pink rose and yellow rose bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/pink-rose-and-yellow-rose-bouquet.jpeg',
    ARRAY['/images/products/pink-rose-and-yellow-rose-bouquet.jpeg'],
    10, true, false, base_sort + 56, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-rose-and-yellow-rose-bouquet');

  -- 57. Pink Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Rose Bouquet',
    'pink-rose-bouquet',
    'A beautiful pink rose bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Wife', 'Girlfriend', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day', 'Mother''s Day'],
    'New Arrival',
    '/images/products/pink-rose-bouquet.jpeg',
    ARRAY['/images/products/pink-rose-bouquet.jpeg'],
    10, true, false, base_sort + 57, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-rose-bouquet');

  -- 58. Pinterest Birthday Decoration
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pinterest Birthday Decoration',
    'pinterest-birthday-decoration',
    'A beautiful pinterest birthday decoration. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Him', 'Family', 'Friend'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/pinterest-birthday-decoration.jpeg',
    ARRAY['/images/products/pinterest-birthday-decoration.jpeg'],
    10, true, false, base_sort + 58, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pinterest-birthday-decoration');

  -- 59. Proud of You Balloon Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Proud of You Balloon Bouquet',
    'proud-of-you-balloon-bouquet',
    'A beautiful proud of you balloon bouquet. Perfect for expressing your feelings on any special occasion.',
    'Balloon Bouquet',
    'balloon-bouquet',
    ARRAY['Her', 'Him', 'Daughter', 'Son', 'Friend', 'Family'],
    ARRAY['Graduation', 'Birthday'],
    'New Arrival',
    '/images/products/proud-of-you-balloon-bouquet.jpeg',
    ARRAY['/images/products/proud-of-you-balloon-bouquet.jpeg'],
    10, true, false, base_sort + 59, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'proud-of-you-balloon-bouquet');

  -- 60. Red and Pink Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red and Pink Rose Bouquet',
    'red-and-pink-rose-bouquet',
    'A beautiful red and pink rose bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/red-and-pink-rose-bouquet.jpeg',
    ARRAY['/images/products/red-and-pink-rose-bouquet.jpeg'],
    10, true, false, base_sort + 60, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-and-pink-rose-bouquet');

  -- 61. Red Rose Chrysanthemum and Babys Breath Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red Rose Chrysanthemum and Babys Breath Bouquet',
    'red-rose-chrysanthemum-babys-breath-bouquet',
    'A beautiful red rose chrysanthemum and babys breath bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mum', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/red-rose-chrysanthemum-babys-breath-bouquet.jpeg',
    ARRAY['/images/products/red-rose-chrysanthemum-babys-breath-bouquet.jpeg'],
    10, true, false, base_sort + 61, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-rose-chrysanthemum-babys-breath-bouquet');

  -- 62. Red Rose Pink Rose Lily and Flowers Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red Rose Pink Rose Lily and Flowers Bouquet',
    'red-rose-pink-rose-lily-flowers-bouquet',
    'A beautiful red rose pink rose lily and flowers bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mum', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Wedding'],
    'New Arrival',
    '/images/products/red-rose-pink-rose-lily-flowers-bouquet.jpeg',
    ARRAY['/images/products/red-rose-pink-rose-lily-flowers-bouquet.jpeg'],
    10, true, false, base_sort + 62, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-rose-pink-rose-lily-flowers-bouquet');

  -- 63. Red Rose and Pink Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red Rose and Pink Rose Bouquet',
    'red-rose-and-pink-rose-bouquet',
    'A beautiful red rose and pink rose bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/red-rose-and-pink-rose-bouquet.jpeg',
    ARRAY['/images/products/red-rose-and-pink-rose-bouquet.jpeg'],
    10, true, false, base_sort + 63, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-rose-and-pink-rose-bouquet');

  -- 64. Red Rose White Rose and Babys Breath Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red Rose White Rose and Babys Breath Bouquet',
    'red-rose-white-rose-babys-breath-bouquet',
    'A beautiful red rose white rose and babys breath bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day', 'Wedding'],
    'New Arrival',
    '/images/products/red-rose-white-rose-babys-breath-bouquet.jpeg',
    ARRAY['/images/products/red-rose-white-rose-babys-breath-bouquet.jpeg'],
    10, true, false, base_sort + 64, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-rose-white-rose-babys-breath-bouquet');

  -- 65. Red Rose Bouquet 2
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red Rose Bouquet 2',
    'red-rose-bouquet-2',
    'A beautiful red rose bouquet 2. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mum', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/red-rose-bouquet-2.jpeg',
    ARRAY['/images/products/red-rose-bouquet-2.jpeg'],
    10, true, false, base_sort + 65, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-rose-bouquet-2');

  -- 66. Red Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red Rose Bouquet',
    'red-rose-bouquet',
    'A beautiful red rose bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mum', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/red-rose-bouquet.jpeg',
    ARRAY['/images/products/red-rose-bouquet.jpeg'],
    10, true, false, base_sort + 66, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-rose-bouquet');

  -- 67. Red Rose Bouquet 3
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red Rose Bouquet 3',
    'red-rose-bouquet-3',
    'A beautiful red rose bouquet 3. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/red-rose-bouquet-3.jpeg',
    ARRAY['/images/products/red-rose-bouquet-3.jpeg'],
    10, true, false, base_sort + 67, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-rose-bouquet-3');

  -- 68. Red Rose Pink Rose Yellow and White Rose with Babys Breath Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red Rose Pink Rose Yellow and White Rose with Babys Breath Bouquet',
    'red-rose-pink-yellow-white-babys-breath-bouquet',
    'A beautiful red rose pink rose yellow and white rose with babys breath bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Wife', 'Girlfriend', 'Mum', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day', 'Wedding'],
    'New Arrival',
    '/images/products/red-rose-pink-yellow-white-babys-breath-bouquet-1.jpeg',
    ARRAY['/images/products/red-rose-pink-yellow-white-babys-breath-bouquet-1.jpeg', '/images/products/red-rose-pink-yellow-white-babys-breath-bouquet-2.jpeg'],
    10, true, false, base_sort + 68, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-rose-pink-yellow-white-babys-breath-bouquet');

  -- 69. Roses Ferrero Rocher and Drink Combo
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Roses Ferrero Rocher and Drink Combo',
    'roses-ferrero-rocher-drink-combo',
    'A beautiful roses ferrero rocher and drink combo. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Him', 'Wife', 'Husband', 'Couple'],
    ARRAY['Anniversary', 'Valentine''s Day', 'Birthday'],
    'New Arrival',
    '/images/products/roses-ferrero-rocher-drink-combo.jpeg',
    ARRAY['/images/products/roses-ferrero-rocher-drink-combo.jpeg'],
    10, true, false, base_sort + 69, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'roses-ferrero-rocher-drink-combo');

  -- 70. Single Sunflower Bouquet 2
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Single Sunflower Bouquet 2',
    'single-sunflower-bouquet-2',
    'A beautiful single sunflower bouquet 2. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/single-sunflower-bouquet-2.jpeg',
    ARRAY['/images/products/single-sunflower-bouquet-2.jpeg'],
    10, true, false, base_sort + 70, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'single-sunflower-bouquet-2');

  -- 71. Single Sunflower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Single Sunflower Bouquet',
    'single-sunflower-bouquet',
    'A beautiful single sunflower bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/single-sunflower-bouquet.jpeg',
    ARRAY['/images/products/single-sunflower-bouquet.jpeg'],
    10, true, false, base_sort + 71, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'single-sunflower-bouquet');

  -- 72. Sister Gifting Balloon Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Sister Gifting Balloon Hamper',
    'sister-gifting-balloon-hamper',
    'A beautiful sister gifting balloon hamper. Perfect for expressing your feelings on any special occasion.',
    'Balloon Bouquet',
    'balloon-bouquet',
    ARRAY['Her', 'Friend', 'Family'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/sister-gifting-balloon-hamper.jpeg',
    ARRAY['/images/products/sister-gifting-balloon-hamper.jpeg'],
    10, true, false, base_sort + 72, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'sister-gifting-balloon-hamper');

  -- 73. Sister Golden Balloon Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Sister Golden Balloon Bouquet',
    'sister-golden-balloon-bouquet',
    'A beautiful sister golden balloon bouquet. Perfect for expressing your feelings on any special occasion.',
    'Balloon Bouquet',
    'balloon-bouquet',
    ARRAY['Her', 'Friend', 'Family'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/sister-golden-balloon-bouquet.jpeg',
    ARRAY['/images/products/sister-golden-balloon-bouquet.jpeg'],
    10, true, false, base_sort + 73, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'sister-golden-balloon-bouquet');

  -- 74. Strawberry Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Strawberry Bouquet',
    'strawberry-bouquet',
    'A beautiful strawberry bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Friend', 'Girlfriend', 'Wife'],
    ARRAY['Birthday', 'Anniversary', 'Valentine''s Day'],
    'New Arrival',
    '/images/products/strawberry-bouquet.jpeg',
    ARRAY['/images/products/strawberry-bouquet.jpeg'],
    10, true, false, base_sort + 74, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'strawberry-bouquet');

  -- 75. Sunflower Beautiful Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Sunflower Beautiful Bouquet',
    'sunflower-beautiful-bouquet',
    'A beautiful sunflower beautiful bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary', 'Mother''s Day'],
    'New Arrival',
    '/images/products/sunflower-beautiful-bouquet.jpeg',
    ARRAY['/images/products/sunflower-beautiful-bouquet.jpeg'],
    10, true, false, base_sort + 75, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'sunflower-beautiful-bouquet');

  -- 76. Sunflower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Sunflower Bouquet',
    'sunflower-bouquet',
    'A beautiful sunflower bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/sunflower-bouquet.jpeg',
    ARRAY['/images/products/sunflower-bouquet.jpeg'],
    10, true, false, base_sort + 76, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'sunflower-bouquet');

  -- 77. Teddy and Chocolate Bouquet Mix
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Teddy and Chocolate Bouquet Mix',
    'teddy-and-chocolate-bouquet-mix',
    'A beautiful teddy and chocolate bouquet mix. Perfect for expressing your feelings on any special occasion.',
    'Teddy and Bouquet',
    'teddy-and-bouquet',
    ARRAY['Her', 'Daughter', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/teddy-and-chocolate-bouquet-mix.jpeg',
    ARRAY['/images/products/teddy-and-chocolate-bouquet-mix.jpeg'],
    10, true, false, base_sort + 77, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'teddy-and-chocolate-bouquet-mix');

  -- 78. Teddy and Chocolate Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Teddy and Chocolate Bouquet',
    'teddy-and-chocolate-bouquet',
    'A beautiful teddy and chocolate bouquet. Perfect for expressing your feelings on any special occasion.',
    'Teddy and Bouquet',
    'teddy-and-bouquet',
    ARRAY['Her', 'Daughter', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/teddy-and-chocolate-bouquet.jpeg',
    ARRAY['/images/products/teddy-and-chocolate-bouquet.jpeg'],
    10, true, false, base_sort + 78, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'teddy-and-chocolate-bouquet');

  -- 79. Teddy Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Teddy Bouquet',
    'teddy-bouquet',
    'A beautiful teddy bouquet. Perfect for expressing your feelings on any special occasion.',
    'Teddy and Bouquet',
    'teddy-and-bouquet',
    ARRAY['Her', 'Daughter', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/teddy-bouquet.jpeg',
    ARRAY['/images/products/teddy-bouquet.jpeg'],
    10, true, false, base_sort + 79, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'teddy-bouquet');

  -- 80. Teddy Chocolate and Flower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Teddy Chocolate and Flower Bouquet',
    'teddy-chocolate-and-flower-bouquet',
    'A beautiful teddy chocolate and flower bouquet. Perfect for expressing your feelings on any special occasion.',
    'Teddy and Bouquet',
    'teddy-and-bouquet',
    ARRAY['Her', 'Daughter', 'Friend', 'Family'],
    ARRAY['Birthday', 'Anniversary'],
    'New Arrival',
    '/images/products/teddy-chocolate-and-flower-bouquet.jpeg',
    ARRAY['/images/products/teddy-chocolate-and-flower-bouquet.jpeg'],
    10, true, false, base_sort + 80, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'teddy-chocolate-and-flower-bouquet');

  -- 81. Welcome Back Balloon and Flower and Chocolate Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Welcome Back Balloon and Flower and Chocolate Bouquet',
    'welcome-back-balloon-flower-chocolate-bouquet',
    'A beautiful welcome back balloon and flower and chocolate bouquet. Perfect for expressing your feelings on any special occasion.',
    'Balloon Bouquet',
    'balloon-bouquet',
    ARRAY['Her', 'Him', 'Friend', 'Family'],
    ARRAY['Birthday'],
    'New Arrival',
    '/images/products/welcome-back-balloon-flower-chocolate-bouquet.jpeg',
    ARRAY['/images/products/welcome-back-balloon-flower-chocolate-bouquet.jpeg'],
    10, true, false, base_sort + 81, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'welcome-back-balloon-flower-chocolate-bouquet');

  -- 82. White Lily Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'White Lily Bouquet',
    'white-lily-bouquet',
    'A beautiful white lily bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Wife', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Wedding', 'Sympathy'],
    'New Arrival',
    '/images/products/white-lily-bouquet.jpeg',
    ARRAY['/images/products/white-lily-bouquet.jpeg'],
    10, true, false, base_sort + 82, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'white-lily-bouquet');

  -- 83. White Lily Rose and Mix Flowers Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'White Lily Rose and Mix Flowers Bouquet',
    'white-lily-rose-mix-flowers-bouquet',
    'A beautiful white lily rose and mix flowers bouquet. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Her', 'Mum', 'Wife', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Wedding'],
    'New Arrival',
    '/images/products/white-lily-rose-mix-flowers-bouquet.jpeg',
    ARRAY['/images/products/white-lily-rose-mix-flowers-bouquet.jpeg'],
    10, true, false, base_sort + 83, 1.0
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'white-lily-rose-mix-flowers-bouquet');

END $$;

-- Verify: show all newly inserted New Arrival products
SELECT name, slug, tag, collection_name FROM products
WHERE tag = 'New Arrival'
ORDER BY sort_order DESC
LIMIT 100;