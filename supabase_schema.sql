-- =============================================
-- NER WEBSITE - FULL SUPABASE SCHEMA
-- Run this entire script in Supabase SQL Editor
-- https://supabase.com/dashboard/project/tdttgbmoaskpmmkvjenq/sql
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- 1. SITE SETTINGS TABLE
-- Control global website text and toggles
-- =============================================
create table if not exists site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value text,
  label text,          -- Human readable label for the admin panel
  type text default 'text', -- 'text' | 'boolean' | 'number' | 'url'
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 2. COLLECTIONS TABLE
-- =============================================
create table if not exists collections (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  image_url text,
  description text,
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 3. PRODUCTS TABLE
-- =============================================
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  collection_id uuid references collections(id) on delete set null,
  collection_name text,       -- Denormalized for quick access
  collection_slug text,       -- Denormalized for quick access
  relationships text[] default '{}',
  celebrations text[] default '{}',
  tag text default 'Standard', -- 'Best Seller' | 'New Arrival' | 'Seasonal' | 'Standard'
  image_url text,
  images text[] default '{}',
  image_scale numeric default 1.0,
  stock integer default 10,
  is_visible boolean default true,
  is_featured boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 4. CELEBRATIONS TABLE
-- =============================================
create table if not exists celebrations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  date_label text,          -- e.g. "4TH MAR", "8TH MAR"
  image_url text,
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 5. RELATIONSHIPS TABLE (Shop By Person)
-- =============================================
create table if not exists relationships (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  image_url text,
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 6. TESTIMONIALS TABLE
-- =============================================
create table if not exists testimonials (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  review_text text not null,
  rating numeric default 5,
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 7. BANNERS TABLE
-- Hero/CTA banners
-- =============================================
create table if not exists banners (
  id uuid default uuid_generate_v4() primary key,
  title text,
  subtitle text,
  image_url text not null,
  link_url text,
  link_text text,
  position text default 'hero',  -- 'hero' | 'cta' | 'popup'
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 8. FEATURED ROSES / HANDPICKED SECTION
-- =============================================
create table if not exists featured_items (
  id uuid default uuid_generate_v4() primary key,
  label text not null,
  image_url text not null,
  section text default 'handpicked',  -- 'handpicked' | 'other'
  is_visible boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 9. WHATSAPP SETTINGS
-- =============================================
create table if not exists whatsapp_settings (
  id uuid default uuid_generate_v4() primary key,
  phone_number text not null,
  default_message text,
  is_float_visible boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- 10. BANNED WORDS TABLE
-- Filter words from search / enquiries
-- =============================================
create table if not exists banned_words (
  id uuid default uuid_generate_v4() primary key,
  word text unique not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table site_settings enable row level security;
alter table collections enable row level security;
alter table products enable row level security;
alter table celebrations enable row level security;
alter table relationships enable row level security;
alter table testimonials enable row level security;
alter table banners enable row level security;
alter table featured_items enable row level security;
alter table whatsapp_settings enable row level security;
alter table banned_words enable row level security;

-- PUBLIC READ (website visitors can see data)
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read collections" on collections for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Public read celebrations" on celebrations for select using (true);
create policy "Public read relationships" on relationships for select using (true);
create policy "Public read testimonials" on testimonials for select using (true);
create policy "Public read banners" on banners for select using (true);
create policy "Public read featured_items" on featured_items for select using (true);
create policy "Public read whatsapp_settings" on whatsapp_settings for select using (true);
create policy "Public read banned_words" on banned_words for select using (true);

-- AUTHENTICATED (Admin) WRITE
create policy "Admin all site_settings" on site_settings for all using (auth.role() = 'authenticated');
create policy "Admin all collections" on collections for all using (auth.role() = 'authenticated');
create policy "Admin all products" on products for all using (auth.role() = 'authenticated');
create policy "Admin all celebrations" on celebrations for all using (auth.role() = 'authenticated');
create policy "Admin all relationships" on relationships for all using (auth.role() = 'authenticated');
create policy "Admin all testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "Admin all banners" on banners for all using (auth.role() = 'authenticated');
create policy "Admin all featured_items" on featured_items for all using (auth.role() = 'authenticated');
create policy "Admin all whatsapp_settings" on whatsapp_settings for all using (auth.role() = 'authenticated');
create policy "Admin all banned_words" on banned_words for all using (auth.role() = 'authenticated');

-- =============================================
-- SEED DATA
-- =============================================

-- Site Settings
insert into site_settings (key, value, label, type) values
  ('site_name', 'New Eco Roses', 'Website Name', 'text'),
  ('site_tagline', 'Crafted With Love, Delivered With Care', 'Website Tagline', 'text'),
  ('whatsapp_number', '919936911611', 'WhatsApp Number', 'text'),
  ('delivery_radius_km', '10', 'Delivery Radius (km)', 'number'),
  ('delivery_cutoff_time', '5 PM', 'Same-day Delivery Cutoff', 'text'),
  ('happy_customers_count', '5K+', 'Happy Customers Count', 'text'),
  ('gifts_delivered_count', '10K+', 'Gifts Delivered Count', 'text'),
  ('star_rating', '4.9', 'Star Rating Display', 'text'),
  ('show_new_arrivals', 'true', 'Show New Arrivals Section', 'boolean'),
  ('show_best_sellers', 'true', 'Show Best Sellers Section', 'boolean'),
  ('show_celebrations', 'true', 'Show Celebrations Section', 'boolean'),
  ('show_relationships', 'true', 'Show Shop By Relationship Section', 'boolean'),
  ('show_testimonials', 'true', 'Show Testimonials Section', 'boolean'),
  ('show_featured_roses', 'true', 'Show Featured Roses Section', 'boolean'),
  ('show_whatsapp_float', 'true', 'Show WhatsApp Floating Button', 'boolean'),
  ('store_address', 'Tollygunge, Kolkata', 'Store Address', 'text'),
  ('instagram_url', 'https://instagram.com/newecoroses', 'Instagram URL', 'url'),
  ('meta_description', 'New Eco Roses - Premium flower bouquets, gift hampers and personalized gifts in Kolkata. Same-day delivery.', 'Meta Description (SEO)', 'text')
on conflict (key) do nothing;

-- Collections
insert into collections (name, slug, image_url, description, is_visible, sort_order) values
  ('Fresh Flower', 'fresh-flower', '/images/collections/fresh-flower.webp', 'Fresh handpicked flower bouquets', true, 1),
  ('Chocolate Bouquet', 'chocolate-bouquet', '/images/collections/chocolate-bouquet.webp', 'Delicious chocolate gift bouquets', true, 2),
  ('Teddy and Bouquet', 'teddy-and-bouquet', '/images/collections/teddy-and-bouquet.webp', 'Adorable teddy bear and flower combos', true, 3),
  ('Personalized', 'personalized', '/images/collections/personalized.webp', 'Custom personalized gifts', true, 4),
  ('Hamper', 'hamper', '/images/collections/hamper.webp', 'Luxury gift hampers', true, 5),
  ('Plants', 'plants', '/images/collections/plants.webp', 'Beautiful potted plants', true, 6),
  ('Cake', 'cake', '/images/collections/cake.webp', 'Premium celebration cakes', true, 7),
  ('Balloon Bouquet', 'balloon-bouquet', '/images/collections/balloon-bouquet.webp', 'Fun and festive balloon arrangements', true, 8)
on conflict (slug) do nothing;

-- Relationships
insert into relationships (name, slug, image_url, is_visible, sort_order) values
  ('Him', 'him', '/images/relationships/forhim.webp', true, 1),
  ('Her', 'her', '/images/relationships/forher.webp', true, 2),
  ('Kids', 'kids', '/images/relationships/kids.webp', true, 3),
  ('Friend', 'friend', '/images/relationships/friends.webp', true, 4),
  ('Girlfriend', 'girlfriend', '/images/relationships/girlfriend.webp', true, 5),
  ('Boyfriend', 'boyfriend', '/images/relationships/boyfriend.webp', true, 6),
  ('Wife', 'wife', '/images/relationships/wife.webp', true, 7),
  ('Husband', 'husband', '/images/relationships/husband.webp', true, 8)
on conflict (slug) do nothing;

-- Celebrations
insert into celebrations (name, date_label, image_url, is_visible, sort_order) values
  ('Holi', '4TH MAR', '/images/celebrations/holi.webp', true, 1),
  ('Women''s Day', '8TH MAR', '/images/celebrations/womens-day.webp', true, 2),
  ('Eid Ul Fitr', '19TH-20TH MAR', '/images/celebrations/eid.webp', true, 3),
  ('Navratri', '19TH - 27TH MAR', '/images/celebrations/navratri.webp', true, 4),
  ('Husband Appreciation Day', '18TH APR', '/images/celebrations/husband-appreciation.webp', true, 5)
on conflict do nothing;

-- WhatsApp Settings
insert into whatsapp_settings (phone_number, default_message, is_float_visible) values
  ('919936911611', 'Hello! I''m interested in ordering from New Eco Roses. Can you help me?', true)
on conflict do nothing;

-- Featured Items (Handpicked Section)
insert into featured_items (label, image_url, section, is_visible, sort_order) values
  ('Red Romance', '/images/handpicked/red-romance.webp', 'handpicked', true, 1),
  ('Pastel Blush', '/images/handpicked/pastel-blush.webp', 'handpicked', true, 2),
  ('Garden Elegance', '/images/handpicked/garden-elegance.webp', 'handpicked', true, 3),
  ('Ivory Dream', '/images/handpicked/ivory-dream.webp', 'handpicked', true, 4)
on conflict do nothing;

-- Testimonials
insert into testimonials (customer_name, review_text, rating, is_visible, sort_order) values
  ('Arijit S. (Tollygunge)', 'Beautiful packaging and very fresh flowers. Delivery was on time.', 5, true, 1),
  ('Mousumi D.', 'Best gift shop experience near Tollygunge. Affordable and classy.', 5, true, 2),
  ('Sayan Chakraborty', 'Ordered a bouquet for my parents anniversary. Quality was top notch. Highly recommend.', 5, true, 3),
  ('Priyanka Sen (Behala)', 'Loved the presentation. It looked premium and not cheap at all.', 5, true, 4),
  ('Rahul Verma', 'same day delivery mil gaya. packing bhi mast tha. very satisfied.', 4.5, true, 5),
  ('Debolina Roy', 'The roses were super fresh and smelled amazing. Will order again.', 5, true, 6),
  ('Anik Ghosh', 'Best gift shop in Tollygunge area. Prices are reasonable and quality is great.', 4, true, 7),
  ('Tanushree Mitra', 'Very polite behaviour and quick WhatsApp response.', 5, true, 8),
  ('Subhajit Paul', 'Premium hampers at really good prices. Totally worth it.', 5, true, 9),
  ('Riya Sharma', 'Ordered last minute and still got timely delivery. Impressed.', 5, true, 10),
  ('Kaushik Banerjee', 'fresh flowers + elegant packaging = perfect gift.', 5, true, 11),
  ('Nandini Das', 'Loved the custom message card option. Nice personal touch.', 5, true, 12),
  ('Abhishek Gupta', 'Bahut accha experience tha. Price bhi reasonable hai.', 4.5, true, 13),
  ('Sohini Chatterjee', 'Very classy arrangements. Not like local roadside shops.', 5, true, 14),
  ('Aritra Mukherjee', 'Delivery within 10KM was fast and smooth. No complaints.', 5, true, 15),
  ('Pooja Yadav', 'Packaging was so neat and premium. Looked expensive.', 5, true, 16),
  ('Ritwick Dutta', 'Great service. Quick replies on WhatsApp. Highly recommended.', 5, true, 17),
  ('Swastika Pal', 'Ordered for birthday surprise. It was perfect.', 5, true, 18),
  ('Sourav Mondal (Tollygunge)', 'Best prices in this area with very good quality flowers.', 4.5, true, 19),
  ('Ankita Singh', 'Nice collection of gift hampers. Will definitely order again.', 5, true, 20),
  ('Debjit Sarkar', 'Fresh, affordable and premium looking. Exactly what I wanted.', 5, true, 21),
  ('Megha Kapoor', 'Loved it. Simple and elegant.', 5, true, 22),
  ('Sagnik Bhattacharya', 'One of the best gift shops near Tollygunge metro.', 5, true, 23),
  ('Rumpa Karmakar', 'Very beautiful bouquet. Everyone appreciated it.', 5, true, 24),
  ('Vishal Kumar', 'Fast delivery and safe packaging. Good service.', 4, true, 25),
  ('Oindrila Bose', 'Amazing quality flowers. Looked exactly like photos.', 5, true, 26),
  ('Arnab Nandi', 'Very reliable shop for lastminute gifts.', 5, true, 27),
  ('Sneha Das', 'Good quality, good price, good service.', 4.5, true, 28),
  ('Pratik Shaw', 'Premium feel at affordable rates. Highly satisfied.', 5, true, 29),
  ('Moumita Ghosh (South Kolkata)', 'Best gift shop in Tollygunge for bouquets and hampers. Great experience overall.', 5, true, 30)
on conflict do nothing;

-- Banned Words
insert into banned_words (word, is_active) values
  ('spam', true),
  ('fake', true),
  ('scam', true),
  ('fraud', true),
  ('cheap', false)
on conflict (word) do nothing;

-- Products (migrated from lib/products.ts)
-- First we need to seed products using collection slugs
insert into products (name, slug, description, collection_name, collection_slug, relationships, celebrations, tag, image_url, images, stock, is_visible, sort_order)
select
  p.name, p.slug, p.description, p.collection_name, p.collection_slug,
  p.relationships, p.celebrations, p.tag, p.image_url, p.images, p.stock, true, p.sort_order
from (values
  ('Crimson Elegance Bouquet','crimson-elegance-bouquet','Deep red premium roses wrapped in elegant eco-style packaging.','Fresh Flower','fresh-flower',ARRAY['Girlfriend','Wife'],ARRAY['Anniversary','Women''s Day'],'Best Seller','/images/products/crimson-elegance-bouquet.webp',ARRAY['/images/products/crimson-elegance-bouquet.webp'],10,1),
  ('Blush Harmony Roses','blush-harmony-roses','Soft blush pink roses arranged in a graceful hand-tied style.','Fresh Flower','fresh-flower',ARRAY['Her','Wife'],ARRAY['Women''s Day'],'Standard','/images/products/blush-harmony-roses.webp',ARRAY['/images/products/blush-harmony-roses.webp'],10,2),
  ('Ivory Serenity Bloom','ivory-serenity-bloom','Elegant white roses symbolizing purity and peace.','Fresh Flower','fresh-flower',ARRAY['Friend','Corporate'],ARRAY['Eid'],'Standard','/images/products/ivory-serenity-bloom.webp',ARRAY['/images/products/ivory-serenity-bloom.webp'],10,3),
  ('Heart Shape Rose Box','heart-shape-rose-box','Romantic heart-shaped box filled with fresh red roses.','Fresh Flower','fresh-flower',ARRAY['Girlfriend','Wife'],ARRAY['Anniversary'],'Best Seller','/images/products/heart-shape-rose-box.webp',ARRAY['/images/products/heart-shape-rose-box.webp'],10,4),
  ('Royal Crimson Symphony','royal-crimson-symphony','A grand bouquet of red and blush roses with luxury fillers.','Fresh Flower','fresh-flower',ARRAY['Wife','Girlfriend'],ARRAY['Anniversary'],'Best Seller','/images/products/royal-crimson-symphony.webp',ARRAY['/images/products/royal-crimson-symphony.webp'],10,5),
  ('Champagne Bloom Delight','champagne-bloom-delight','Soft champagne roses in premium wrapping.','Fresh Flower','fresh-flower',ARRAY['Her'],ARRAY['Women''s Day'],'New Arrival','/images/products/champagne-bloom-delight.webp',ARRAY['/images/products/champagne-bloom-delight.webp'],10,6),
  ('Emerald Luxe Arrangement','emerald-luxe-arrangement','A refined green-toned luxury floral composition.','Fresh Flower','fresh-flower',ARRAY['Him','Husband'],ARRAY['Corporate Events'],'Standard','/images/products/emerald-luxe-arrangement.webp',ARRAY['/images/products/emerald-luxe-arrangement.webp'],10,7),
  ('Prestige Floral Ensemble','prestige-floral-ensemble','Sophisticated floral mix crafted for celebrations.','Fresh Flower','fresh-flower',ARRAY['Friend'],ARRAY['Holi'],'Standard','/images/products/prestige-floral-ensemble.webp',ARRAY['/images/products/prestige-floral-ensemble.webp'],10,8),
  ('Custom Name Rose Box','custom-name-rose-box','Personalized rose box engraved with a custom name.','Personalized','personalized',ARRAY['Girlfriend','Wife'],ARRAY['Anniversary'],'Best Seller','/images/products/custom-name-rose-box.webp',ARRAY['/images/products/custom-name-rose-box.webp'],10,9),
  ('Photo Memory Gift Set','photo-memory-gift-set','Floral gift combo paired with a custom photo frame.','Personalized','personalized',ARRAY['Husband','Wife'],ARRAY['Anniversary'],'Standard','/images/products/photo-memory-gift-set.webp',ARRAY['/images/products/photo-memory-gift-set.webp'],10,10),
  ('Personalized Mug & Roses','personalized-mug-and-roses','Custom printed mug paired with fresh roses.','Personalized','personalized',ARRAY['Boyfriend','Girlfriend'],ARRAY['Birthday'],'New Arrival','/images/products/personalized-mug-and-roses.webp',ARRAY['/images/products/personalized-mug-and-roses.webp'],10,11),
  ('Engraved Wooden Keepsake','engraved-wooden-keepsake','Elegant engraved wooden gift with floral accent.','Personalized','personalized',ARRAY['Husband'],ARRAY['Husband Appreciation Day'],'Standard','/images/products/engraved-wooden-keepsake.webp',ARRAY['/images/products/engraved-wooden-keepsake.webp'],10,12),
  ('Golden Anniversary Bloom','golden-anniversary-bloom','Elegant floral bouquet crafted for milestone anniversaries.','Fresh Flower','fresh-flower',ARRAY['Wife'],ARRAY['Anniversary'],'Best Seller','/images/products/golden-anniversary-bloom.webp',ARRAY['/images/products/golden-anniversary-bloom.webp'],10,13),
  ('Forever Together Bouquet','forever-together-bouquet','Romantic floral arrangement celebrating eternal love.','Fresh Flower','fresh-flower',ARRAY['Couple'],ARRAY['Anniversary'],'Standard','/images/products/forever-together-bouquet.webp',ARRAY['/images/products/forever-together-bouquet.webp'],10,14),
  ('Ruby Romance Collection','ruby-romance-collection','Deep red roses designed for romantic occasions.','Fresh Flower','fresh-flower',ARRAY['Girlfriend'],ARRAY['Anniversary'],'Standard','/images/products/ruby-romance-collection.webp',ARRAY['/images/products/ruby-romance-collection.webp'],10,15),
  ('Executive Floral Hamper','executive-floral-hamper','Premium executive hamper for business gifting.','Hamper','hamper',ARRAY['Him'],ARRAY['Corporate Events'],'Best Seller','/images/products/executive-floral-hamper.webp',ARRAY['/images/products/executive-floral-hamper.webp'],10,16),
  ('Corporate Appreciation Box','corporate-appreciation-box','Luxury thank-you gift for valued clients.','Hamper','hamper',ARRAY['Corporate'],ARRAY['Festive Events'],'Standard','/images/products/corporate-appreciation-box.webp',ARRAY['/images/products/corporate-appreciation-box.webp'],10,17),
  ('Signature Business Bloom','signature-business-bloom','Minimalist professional floral arrangement.','Hamper','hamper',ARRAY['Him'],ARRAY['Office Celebrations'],'New Arrival','/images/products/signature-business-bloom.webp',ARRAY['/images/products/signature-business-bloom.webp'],10,18),
  ('Holi Color Splash Bouquet','holi-color-splash-bouquet','Vibrant bouquet inspired by Holi colors.','Fresh Flower','fresh-flower',ARRAY['Friend'],ARRAY['Holi'],'Seasonal','/images/products/holi-color-splash-bouquet.webp',ARRAY['/images/products/holi-color-splash-bouquet.webp'],10,19),
  ('Eid Mubarak Luxe Hamper','eid-mubarak-luxe-hamper','Elegant festive hamper with premium floral touch.','Hamper','hamper',ARRAY['Family','Corporate'],ARRAY['Eid'],'Seasonal','/images/products/eid-mubarak-luxe-hamper.webp',ARRAY['/images/products/eid-mubarak-luxe-hamper.webp'],10,20),
  ('Divine Navratri Bloom Box','divine-navratri-bloom-box','Festive floral arrangement inspired by Navratri.','Fresh Flower','fresh-flower',ARRAY['Family'],ARRAY['Navratri'],'Seasonal','/images/products/divine-navratri-bloom-box.webp',ARRAY['/images/products/divine-navratri-bloom-box.webp'],10,21),
  ('Gentleman''s Luxury Gift Set','gentlemans-luxury-gift-set','Premium curated gift box for modern gentlemen.','Personalized','personalized',ARRAY['Husband','Boyfriend'],ARRAY['Husband Appreciation Day'],'New Arrival','/images/products/gentlemans-luxury-gift-set.webp',ARRAY['/images/products/gentlemans-luxury-gift-set.webp'],10,22),
  ('Mix Flowers','mix-flowers','Beautiful mix flowers arrangement crafted with fresh blooms.','Fresh Flower','fresh-flower',ARRAY['Friend','Family'],ARRAY['Birthday','Anniversary'],'New Arrival','/images/products/mix-flowers.webp',ARRAY['/images/products/mix-flowers.webp'],10,23),
  ('Roses','roses-new','Beautiful roses arrangement crafted with fresh blooms.','Fresh Flower','fresh-flower',ARRAY['Friend','Family'],ARRAY['Birthday','Anniversary'],'New Arrival','/images/products/roses.webp',ARRAY['/images/products/roses.webp'],10,24),
  ('Carnation','carnation','Beautiful carnation arrangement crafted with fresh blooms.','Fresh Flower','fresh-flower',ARRAY['Friend','Family'],ARRAY['Birthday','Anniversary'],'New Arrival','/images/products/carnation.webp',ARRAY['/images/products/carnation.webp'],10,25),
  ('Lily','lily','Beautiful lily arrangement crafted with fresh blooms.','Fresh Flower','fresh-flower',ARRAY['Friend','Family'],ARRAY['Birthday','Anniversary'],'New Arrival','/images/products/lily.webp',ARRAY['/images/products/lily.webp'],10,26),
  ('Daisy','daisy','Beautiful daisy arrangement crafted with fresh blooms.','Fresh Flower','fresh-flower',ARRAY['Friend','Family'],ARRAY['Birthday','Anniversary'],'New Arrival','/images/products/daisy.webp',ARRAY['/images/products/daisy.webp'],10,27),
  ('Orchids','orchids','Beautiful orchids arrangement crafted with fresh blooms.','Fresh Flower','fresh-flower',ARRAY['Friend','Family'],ARRAY['Birthday','Anniversary'],'New Arrival','/images/products/orchids.webp',ARRAY['/images/products/orchids.webp'],10,28),
  ('Gerbera','gerbera','Beautiful gerbera arrangement crafted with fresh blooms.','Fresh Flower','fresh-flower',ARRAY['Friend','Family'],ARRAY['Birthday','Anniversary'],'New Arrival','/images/products/gerbera.webp',ARRAY['/images/products/gerbera.webp'],10,29),
  ('Sunflower','sunflower','Beautiful sunflower arrangement crafted with fresh blooms.','Fresh Flower','fresh-flower',ARRAY['Friend','Family'],ARRAY['Birthday','Anniversary'],'New Arrival','/images/products/sunflower.webp',ARRAY['/images/products/sunflower.webp'],10,30)
) as p(name, slug, description, collection_name, collection_slug, relationships, celebrations, tag, image_url, images, stock, sort_order)
on conflict (slug) do nothing;
