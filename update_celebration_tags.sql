-- =============================================
-- UPDATE PRODUCT CELEBRATION TAGS IN SUPABASE
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tdttgbmoaskpmmkvjenq/sql
-- =============================================

-- Eid Ul Fitr products: Ivory Serenity Bloom, Eid Mubarak Luxe Hamper,
--                       Prestige Floral Ensemble, Mix Flowers, Roses, Sunflower,
--                       Executive Floral Hamper, Corporate Appreciation Box
UPDATE products SET celebrations = array_append(celebrations, 'Eid Ul Fitr')
WHERE slug IN ('ivory-serenity-bloom', 'eid-mubarak-luxe-hamper', 'prestige-floral-ensemble',
               'mix-flowers', 'roses-new', 'sunflower', 'executive-floral-hamper',
               'corporate-appreciation-box')
  AND NOT ('Eid Ul Fitr' = ANY(celebrations));

-- Also ensure they have 'Eid' tag for backwards compatibility
UPDATE products SET celebrations = array_append(celebrations, 'Eid')
WHERE slug IN ('ivory-serenity-bloom', 'eid-mubarak-luxe-hamper', 'prestige-floral-ensemble',
               'mix-flowers', 'roses-new', 'sunflower', 'executive-floral-hamper',
               'corporate-appreciation-box')
  AND NOT ('Eid' = ANY(celebrations));

-- Navratri products: Divine Navratri Bloom Box, Ivory Serenity Bloom,
--                   Prestige Floral Ensemble, Mix Flowers, Roses, Sunflower,
--                   Executive Floral Hamper, Corporate Appreciation Box
UPDATE products SET celebrations = array_append(celebrations, 'Navratri')
WHERE slug IN ('divine-navratri-bloom-box', 'ivory-serenity-bloom', 'prestige-floral-ensemble',
               'mix-flowers', 'roses-new', 'sunflower', 'executive-floral-hamper',
               'corporate-appreciation-box')
  AND NOT ('Navratri' = ANY(celebrations));

-- Husband Appreciation Day products: Engraved Wooden Keepsake, Gentleman's Luxury Gift Set,
--                                    Mix Flowers, Roses, Sunflower
UPDATE products SET celebrations = array_append(celebrations, 'Husband Appreciation Day')
WHERE slug IN ('engraved-wooden-keepsake', 'gentlemans-luxury-gift-set',
               'mix-flowers', 'roses-new', 'sunflower')
  AND NOT ('Husband Appreciation Day' = ANY(celebrations));

-- Verify the updates
SELECT slug, name, celebrations
FROM products
WHERE slug IN ('ivory-serenity-bloom', 'eid-mubarak-luxe-hamper', 'divine-navratri-bloom-box',
               'engraved-wooden-keepsake', 'mix-flowers', 'roses-new', 'sunflower',
               'prestige-floral-ensemble', 'executive-floral-hamper')
ORDER BY slug;
