-- ================================================================
-- Migration: Insert 25 New Products (4 Sep 2026 Batch)
-- ================================================================

DO 
BEGIN
  -- Bump existing products sort_order by 30 so new products stay at top
  UPDATE products SET sort_order = sort_order + 30;

  -- 1. Black & Crimson Rose Luxe Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Black & Crimson Rose Luxe Bouquet',
    'black-crimson-rose-luxe-bouquet',
    'Exquisite handcrafted black & crimson rose luxe bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Girlfriend', 'Wife', 'Her', 'Partner'],
    ARRAY['Anniversary', 'Birthday', 'Valentine'],
    'Best Seller',
    '/images/products/black-crimson-rose-luxe-bouquet.webp',
    ARRAY['/images/products/black-crimson-rose-luxe-bouquet.webp'],
    15, true, true, 1, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'black-crimson-rose-luxe-bouquet');

  -- 2. Black Velvet Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Black Velvet Rose Bouquet',
    'black-velvet-rose-bouquet',
    'Exquisite handcrafted black velvet rose bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Girlfriend', 'Wife', 'Her', 'Partner'],
    ARRAY['Anniversary', 'Birthday', 'Valentine'],
    'New Arrival',
    '/images/products/black-velvet-rose-bouquet.webp',
    ARRAY['/images/products/black-velvet-rose-bouquet.webp'],
    15, true, true, 2, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'black-velvet-rose-bouquet');

  -- 3. Blue Balloon Floral Celebration Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Blue Balloon Floral Celebration Bouquet',
    'blue-balloon-floral-celebration-bouquet',
    'Exquisite handcrafted blue balloon floral celebration bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Balloon Bouquet',
    'balloon-bouquet',
    ARRAY['Friend', 'Family', 'Brother', 'Boyfriend'],
    ARRAY['Birthday', 'Graduation', 'Congratulations'],
    'New Arrival',
    '/images/products/blue-balloon-floral-celebration-bouquet.webp',
    ARRAY['/images/products/blue-balloon-floral-celebration-bouquet.webp'],
    15, true, true, 3, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'blue-balloon-floral-celebration-bouquet');

  -- 4. Blue Garden Lily Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Blue Garden Lily Bouquet',
    'blue-garden-lily-bouquet',
    'Exquisite handcrafted blue garden lily bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Mum', 'Her', 'Family', 'Wife'],
    ARRAY['Birthday', 'Anniversary', 'Mothers Day'],
    'Seasonal',
    '/images/products/blue-garden-lily-bouquet.webp',
    ARRAY['/images/products/blue-garden-lily-bouquet.webp'],
    15, true, true, 4, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'blue-garden-lily-bouquet');

  -- 5. Blush & Ivory Celebration Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Blush & Ivory Celebration Bouquet',
    'blush-ivory-celebration-bouquet',
    'Exquisite handcrafted blush & ivory celebration bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Girlfriend', 'Wife', 'Her', 'Partner'],
    ARRAY['Anniversary', 'Birthday', 'Valentine'],
    'Best Seller',
    '/images/products/blush-ivory-celebration-bouquet.webp',
    ARRAY['/images/products/blush-ivory-celebration-bouquet.webp'],
    15, true, true, 5, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'blush-ivory-celebration-bouquet');

  -- 6. Blush & Ivory Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Blush & Ivory Rose Bouquet',
    'blush-ivory-rose-bouquet',
    'Exquisite handcrafted blush & ivory rose bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Girlfriend', 'Wife', 'Her', 'Partner'],
    ARRAY['Anniversary', 'Birthday', 'Valentine'],
    'New Arrival',
    '/images/products/blush-ivory-rose-bouquet.webp',
    ARRAY['/images/products/blush-ivory-rose-bouquet.webp'],
    15, true, true, 6, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'blush-ivory-rose-bouquet');

  -- 7. Blush Lily & Wildflower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Blush Lily & Wildflower Bouquet',
    'blush-lily-wildflower-bouquet',
    'Exquisite handcrafted blush lily & wildflower bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Mum', 'Her', 'Family', 'Wife'],
    ARRAY['Birthday', 'Anniversary', 'Mothers Day'],
    'Standard',
    '/images/products/blush-lily-wildflower-bouquet.webp',
    ARRAY['/images/products/blush-lily-wildflower-bouquet.webp'],
    15, true, false, 7, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'blush-lily-wildflower-bouquet');

  -- 8. Crimson Rose Luxe Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Crimson Rose Luxe Bouquet',
    'crimson-rose-luxe-bouquet',
    'Exquisite handcrafted crimson rose luxe bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Girlfriend', 'Wife', 'Her', 'Partner'],
    ARRAY['Anniversary', 'Birthday', 'Valentine'],
    'Best Seller',
    '/images/products/crimson-rose-luxe-bouquet.webp',
    ARRAY['/images/products/crimson-rose-luxe-bouquet.webp'],
    15, true, true, 8, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'crimson-rose-luxe-bouquet');

  -- 9. Golden Meadow Mixed Flower Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Golden Meadow Mixed Flower Bouquet',
    'golden-meadow-mixed-flower-bouquet',
    'Exquisite handcrafted golden meadow mixed flower bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Friend', 'Sister', 'Colleague', 'Teacher'],
    ARRAY['Birthday', 'Friendship Day', 'Teachers Day'],
    'New Arrival',
    '/images/products/golden-meadow-mixed-flower-bouquet.webp',
    ARRAY['/images/products/golden-meadow-mixed-flower-bouquet.webp'],
    15, true, false, 9, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'golden-meadow-mixed-flower-bouquet');

  -- 10. Golden Yellow Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Golden Yellow Rose Bouquet',
    'golden-yellow-rose-bouquet',
    'Exquisite handcrafted golden yellow rose bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Friend', 'Sister', 'Colleague', 'Teacher'],
    ARRAY['Birthday', 'Friendship Day', 'Teachers Day'],
    'Seasonal',
    '/images/products/golden-yellow-rose-bouquet.webp',
    ARRAY['/images/products/golden-yellow-rose-bouquet.webp'],
    15, true, false, 10, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'golden-yellow-rose-bouquet');

  -- 11. Pink Balloon Sweet Celebration Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Balloon Sweet Celebration Bouquet',
    'pink-balloon-sweet-celebration-bouquet',
    'Exquisite handcrafted pink balloon sweet celebration bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Balloon Bouquet',
    'balloon-bouquet',
    ARRAY['Friend', 'Family', 'Brother', 'Boyfriend'],
    ARRAY['Birthday', 'Graduation', 'Congratulations'],
    'Best Seller',
    '/images/products/pink-balloon-sweet-celebration-bouquet.webp',
    ARRAY['/images/products/pink-balloon-sweet-celebration-bouquet.webp'],
    15, true, true, 11, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-balloon-sweet-celebration-bouquet');

  -- 12. Pink Chocolate Celebration Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Chocolate Celebration Bouquet',
    'pink-chocolate-celebration-bouquet',
    'Exquisite handcrafted pink chocolate celebration bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Chocolate Bouquet',
    'chocolate-bouquet',
    ARRAY['Her', 'Girlfriend', 'Sister', 'Friend'],
    ARRAY['Birthday', 'Anniversary', 'Valentine'],
    'New Arrival',
    '/images/products/pink-chocolate-celebration-bouquet.webp',
    ARRAY['/images/products/pink-chocolate-celebration-bouquet.webp'],
    15, true, false, 12, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-chocolate-celebration-bouquet');

  -- 13. Pink Lily Blossom Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Lily Blossom Bouquet',
    'pink-lily-blossom-bouquet',
    'Exquisite handcrafted pink lily blossom bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Mum', 'Her', 'Family', 'Wife'],
    ARRAY['Birthday', 'Anniversary', 'Mothers Day'],
    'Best Seller',
    '/images/products/pink-lily-blossom-bouquet.webp',
    ARRAY['/images/products/pink-lily-blossom-bouquet.webp'],
    15, true, true, 13, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-lily-blossom-bouquet');

  -- 14. Pink Lily Garden Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Lily Garden Bouquet',
    'pink-lily-garden-bouquet',
    'Exquisite handcrafted pink lily garden bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Mum', 'Her', 'Family', 'Wife'],
    ARRAY['Birthday', 'Anniversary', 'Mothers Day'],
    'Standard',
    '/images/products/pink-lily-garden-bouquet.webp',
    ARRAY['/images/products/pink-lily-garden-bouquet.webp'],
    15, true, false, 14, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-lily-garden-bouquet');

  -- 15. Pink Rose Celebration Gift Hamper
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Rose Celebration Gift Hamper',
    'pink-rose-celebration-gift-hamper',
    'Exquisite handcrafted pink rose celebration gift hamper made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Family', 'Parents', 'Wife', 'Her'],
    ARRAY['Anniversary', 'Birthday', 'Festivals'],
    'Best Seller',
    '/images/products/pink-rose-celebration-gift-hamper.webp',
    ARRAY['/images/products/pink-rose-celebration-gift-hamper.webp'],
    15, true, true, 15, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-rose-celebration-gift-hamper');

  -- 16. Pink Rose Garden Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Pink Rose Garden Bouquet',
    'pink-rose-garden-bouquet',
    'Exquisite handcrafted pink rose garden bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Girlfriend', 'Wife', 'Her', 'Partner'],
    ARRAY['Anniversary', 'Birthday', 'Valentine'],
    'New Arrival',
    '/images/products/pink-rose-garden-bouquet.webp',
    ARRAY['/images/products/pink-rose-garden-bouquet.webp'],
    15, true, false, 16, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pink-rose-garden-bouquet');

  -- 17. Purple Celebration Floral Basket
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Purple Celebration Floral Basket',
    'purple-celebration-floral-basket',
    'Exquisite handcrafted purple celebration floral basket made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Hamper',
    'hamper',
    ARRAY['Family', 'Parents', 'Wife', 'Her'],
    ARRAY['Anniversary', 'Birthday', 'Festivals'],
    'Seasonal',
    '/images/products/purple-celebration-floral-basket.webp',
    ARRAY['/images/products/purple-celebration-floral-basket.webp'],
    15, true, false, 17, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'purple-celebration-floral-basket');

  -- 18. Purple Elegance Lily Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Purple Elegance Lily Bouquet',
    'purple-elegance-lily-bouquet',
    'Exquisite handcrafted purple elegance lily bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Mum', 'Her', 'Family', 'Wife'],
    ARRAY['Birthday', 'Anniversary', 'Mothers Day'],
    'New Arrival',
    '/images/products/purple-elegance-lily-bouquet.webp',
    ARRAY['/images/products/purple-elegance-lily-bouquet.webp'],
    15, true, false, 18, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'purple-elegance-lily-bouquet');

  -- 19. Red Velvet BEER Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Red Velvet BEER Rose Bouquet',
    'red-velvet-beer-rose-bouquet',
    'Exquisite handcrafted red velvet beer rose bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Personalized',
    'personalized',
    ARRAY['Him', 'Boyfriend', 'Husband', 'Friend'],
    ARRAY['Birthday', 'Bachelor Party', 'Anniversary'],
    'New Arrival',
    '/images/products/red-velvet-beer-rose-bouquet.webp',
    ARRAY['/images/products/red-velvet-beer-rose-bouquet.webp'],
    15, true, false, 19, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'red-velvet-beer-rose-bouquet');

  -- 20. Royal Orchid Lily Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Royal Orchid Lily Bouquet',
    'royal-orchid-lily-bouquet',
    'Exquisite handcrafted royal orchid lily bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Mum', 'Her', 'Family', 'Wife'],
    ARRAY['Birthday', 'Anniversary', 'Mothers Day'],
    'Best Seller',
    '/images/products/royal-orchid-lily-bouquet.webp',
    ARRAY['/images/products/royal-orchid-lily-bouquet.webp'],
    15, true, true, 20, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'royal-orchid-lily-bouquet');

  -- 21. Ruby Blush Rose Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Ruby Blush Rose Bouquet',
    'ruby-blush-rose-bouquet',
    'Exquisite handcrafted ruby blush rose bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Girlfriend', 'Wife', 'Her', 'Partner'],
    ARRAY['Anniversary', 'Birthday', 'Valentine'],
    'New Arrival',
    '/images/products/ruby-blush-rose-bouquet.webp',
    ARRAY['/images/products/ruby-blush-rose-bouquet.webp'],
    15, true, false, 21, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ruby-blush-rose-bouquet');

  -- 22. Sunshine Balloon Floral Celebration Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'Sunshine Balloon Floral Celebration Bouquet',
    'sunshine-balloon-floral-celebration-bouquet',
    'Exquisite handcrafted sunshine balloon floral celebration bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Balloon Bouquet',
    'balloon-bouquet',
    ARRAY['Friend', 'Family', 'Brother', 'Boyfriend'],
    ARRAY['Birthday', 'Graduation', 'Congratulations'],
    'Seasonal',
    '/images/products/sunshine-balloon-floral-celebration-bouquet.webp',
    ARRAY['/images/products/sunshine-balloon-floral-celebration-bouquet.webp'],
    15, true, false, 22, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'sunshine-balloon-floral-celebration-bouquet');

  -- 23. White & Blush Lily Romance Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'White & Blush Lily Romance Bouquet',
    'white-blush-lily-romance-bouquet',
    'Exquisite handcrafted white & blush lily romance bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Mum', 'Her', 'Family', 'Wife'],
    ARRAY['Birthday', 'Anniversary', 'Mothers Day'],
    'Best Seller',
    '/images/products/white-blush-lily-romance-bouquet.webp',
    ARRAY['/images/products/white-blush-lily-romance-bouquet.webp'],
    15, true, true, 23, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'white-blush-lily-romance-bouquet');

  -- 24. White & Red Rose Romance Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'White & Red Rose Romance Bouquet',
    'white-red-rose-romance-bouquet',
    'Exquisite handcrafted white & red rose romance bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Girlfriend', 'Wife', 'Her', 'Partner'],
    ARRAY['Anniversary', 'Birthday', 'Valentine'],
    'New Arrival',
    '/images/products/white-red-rose-romance-bouquet.webp',
    ARRAY['/images/products/white-red-rose-romance-bouquet.webp'],
    15, true, false, 24, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'white-red-rose-romance-bouquet');

  -- 25. White Lily & Gypsophila Elegance Bouquet
  INSERT INTO products (
    name, slug, description, collection_name, collection_slug,
    relationships, celebrations, tag, image_url, images,
    stock, is_visible, is_featured, sort_order, image_scale
  )
  SELECT
    'White Lily & Gypsophila Elegance Bouquet',
    'white-lily-gypsophila-elegance-bouquet',
    'Exquisite handcrafted white lily & gypsophila elegance bouquet made with fresh premium blooms. Perfect for expressing your feelings on any special occasion.',
    'Fresh Flower',
    'fresh-flower',
    ARRAY['Mum', 'Her', 'Family', 'Wife'],
    ARRAY['Birthday', 'Anniversary', 'Mothers Day'],
    'Best Seller',
    '/images/products/white-lily-gypsophila-elegance-bouquet.webp',
    ARRAY['/images/products/white-lily-gypsophila-elegance-bouquet.webp'],
    15, true, true, 25, 1
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'white-lily-gypsophila-elegance-bouquet');

END ;
