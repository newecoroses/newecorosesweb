'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Quote, Truck, Gift, MessageCircle } from 'lucide-react';

import HeroSlider from '@/components/home/hero-slider';
import SearchBar from '@/components/home/search-bar';
import CategoryGrid from '@/components/home/category-grid';
import FeaturedPicks from '@/components/home/featured-picks';
import PromoSlider from '@/components/home/promo-slider';
import ReviewVideos from '@/components/home/review-videos';
import PhotoReviews from '@/components/home/photo-reviews';
import CelebrateLove from '@/components/home/celebrate-love';
import ProductCard from '@/components/product/product-card';
import SectionHeader from '@/components/ui/section-header';
import WhatsAppFloat from '@/components/ui/whatsapp-float';

import {
  fetchProducts,
  fetchCollections, fetchCelebrations, fetchRelationships,
  fetchProductsByTag, fetchFeaturedItems, fetchTestimonials,
  fetchAllSettings,
  DBProduct, DBCollection, DBCelebration, DBRelationship,
  DBFeaturedItem, DBTestimonial
} from '@/lib/supabase';

// ── Fallback static data (used only when Supabase is not connected) ──
import { PRODUCTS, getProductsByTag, COLLECTIONS } from '@/lib/products';

const FALLBACK_CELEBRATIONS = [
  { id: '1', name: 'Holi', date_label: '4TH MAR', image_url: '/images/celebrations/holi.webp', is_visible: true, sort_order: 1, created_at: '' },
  { id: '2', name: "Women's Day", date_label: '8TH MAR', image_url: '/images/celebrations/womens-day.webp', is_visible: true, sort_order: 2, created_at: '' },
  { id: '3', name: 'Eid Ul Fitr', date_label: '19TH-20TH MAR', image_url: '/images/celebrations/eid.webp', is_visible: true, sort_order: 3, created_at: '' },
  { id: '4', name: 'Navratri', date_label: '19TH - 27TH MAR', image_url: '/images/celebrations/navratri.webp', is_visible: true, sort_order: 4, created_at: '' },
  { id: '5', name: 'Husband Appreciation Day', date_label: '18TH APR', image_url: '/images/celebrations/husband-appreciation.webp', is_visible: true, sort_order: 5, created_at: '' },
];

const FALLBACK_RELATIONSHIPS = [
  { id: '1', name: 'Him', slug: 'him', image_url: '/images/relationships/forhim.webp', is_visible: true, sort_order: 1, created_at: '' },
  { id: '2', name: 'Her', slug: 'her', image_url: '/images/relationships/forher.webp', is_visible: true, sort_order: 2, created_at: '' },
  { id: '3', name: 'Kids', slug: 'kids', image_url: '/images/relationships/kids.webp', is_visible: true, sort_order: 3, created_at: '' },
  { id: '4', name: 'Friend', slug: 'friend', image_url: '/images/relationships/friends.webp', is_visible: true, sort_order: 4, created_at: '' },
  { id: '5', name: 'Girlfriend', slug: 'girlfriend', image_url: '/images/relationships/girlfriend.webp', is_visible: true, sort_order: 5, created_at: '' },
  { id: '6', name: 'Boyfriend', slug: 'boyfriend', image_url: '/images/relationships/boyfriend.webp', is_visible: true, sort_order: 6, created_at: '' },
  { id: '7', name: 'Wife', slug: 'wife', image_url: '/images/relationships/wife.webp', is_visible: true, sort_order: 7, created_at: '' },
  { id: '8', name: 'Husband', slug: 'husband', image_url: '/images/relationships/husband.webp', is_visible: true, sort_order: 8, created_at: '' },
];

const FALLBACK_FEATURED = [
  { id: '1', label: 'Red Romance', image_url: '/images/handpicked/red-romance.webp', section: 'handpicked', is_visible: true, sort_order: 1, created_at: '' },
  { id: '2', label: 'Pastel Blush', image_url: '/images/handpicked/pastel-blush.webp', section: 'handpicked', is_visible: true, sort_order: 2, created_at: '' },
  { id: '3', label: 'Garden Elegance', image_url: '/images/handpicked/garden-elegance.webp', section: 'handpicked', is_visible: true, sort_order: 3, created_at: '' },
  { id: '4', label: 'Ivory Dream', image_url: '/images/handpicked/ivory-dream.webp', section: 'handpicked', is_visible: true, sort_order: 4, created_at: '' },
];

const FALLBACK_CATEGORIES = COLLECTIONS.map((c, i) => ({
  id: String(i + 1), name: c.name, slug: c.slug,
  image_url: `/images/collections/${c.slug}.webp`, description: '', is_visible: true, sort_order: i + 1, created_at: '',
}));

const COLLECTION_SPANS = ['md:col-span-2 md:row-span-2', '', '', '', '', 'md:col-span-2', 'md:col-span-2', 'md:col-span-4 md:row-span-1'];

// ── Stagger animation container ──
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export default function Home() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [collections, setCollections] = useState<DBCollection[]>([]);
  const [celebrations, setCelebrations] = useState<DBCelebration[]>(FALLBACK_CELEBRATIONS as DBCelebration[]);
  const [relationships, setRelationships] = useState<DBRelationship[]>(FALLBACK_RELATIONSHIPS as DBRelationship[]);
  const [newArrivals, setNewArrivals] = useState<DBProduct[]>([]);
  const [bestSellers, setBestSellers] = useState<DBProduct[]>([]);
  const [featuredRoses, setFeaturedRoses] = useState<DBFeaturedItem[]>(FALLBACK_FEATURED as DBFeaturedItem[]);
  const [testimonials, setTestimonials] = useState<DBTestimonial[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetchCollections(),
      fetchCelebrations(),
      fetchRelationships(),
      fetchProductsByTag('New Arrival'),
      fetchProductsByTag('Best Seller'),
      fetchFeaturedItems('handpicked'),
      fetchTestimonials(),
      fetchAllSettings(),
    ]).then(([prods, cols, celebs, rels, arrivals, sellers, featured, testimonial, setts]) => {
      if (prods.length > 0) setProducts(prods);
      else setProducts(PRODUCTS as unknown as DBProduct[]); // fallback

      if (cols.length > 0) setCollections(cols);
      if (celebs.length > 0) setCelebrations(celebs);
      if (rels.length > 0) setRelationships(rels);
      if (arrivals.length > 0) setNewArrivals(arrivals);
      if (sellers.length > 0) setBestSellers(sellers);
      if (featured.length > 0) setFeaturedRoses(featured);
      if (testimonial.length > 0) setTestimonials(testimonial);
      setSettings(setts);
      setLoaded(true);
    }).catch(() => {
      // Load from static fallback
      setProducts(PRODUCTS as unknown as DBProduct[]);
      setNewArrivals(getProductsByTag('New Arrival') as unknown as DBProduct[]);
      setBestSellers(getProductsByTag('Best Seller') as unknown as DBProduct[]);
      setLoaded(true);
    });
  }, []);

  const displayProducts = useMemo(() => {
    return products.slice(0, 12);
  }, [products]);

  // Use collections from Supabase; fallback to static
  const displayCollections = collections.length > 0 ? collections : FALLBACK_CATEGORIES as unknown as DBCollection[];

  // Site settings helpers
  const showNewArrivals = settings['show_new_arrivals'] !== 'false';
  const showBestSellers = settings['show_best_sellers'] !== 'false';
  const showCelebrations = settings['show_celebrations'] !== 'false';
  const showRelationships = settings['show_relationships'] !== 'false';
  const showTestimonials = settings['show_testimonials'] !== 'false';
  const showFeaturedRoses = settings['show_featured_roses'] !== 'false';
  const happyCustomers = settings['happy_customers_count'] || '5K+';
  const giftsDelivered = settings['gifts_delivered_count'] || '10K+';
  const starRating = settings['star_rating'] || '4.9';
  const deliveryCutoff = settings['delivery_cutoff_time'] || '5 PM';
  const deliveryRadius = settings['delivery_radius_km'] || '10';
  const whatsappNumber = settings['whatsapp_number'] || '919936911611';

  const ctaWaLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello! I'm interested in ordering from New Eco Roses. Can you help me?")}`;

  // Testimonials for scrolling marquee
  const T1 = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const T2 = testimonials.slice(Math.ceil(testimonials.length / 2));

  // Celebrations to hide
  const HIDDEN_CELEBRATIONS = ['holi', "women's day", 'womens day'];
  const visibleCelebrations = celebrations.filter(
    e => !HIDDEN_CELEBRATIONS.includes(e.name.toLowerCase())
  );


  if (!loaded) {
    return (
      <div className="pt-32 pb-20 min-h-[80vh] bg-white">
        {/* Skeleton hero */}
        <div className="px-4 md:px-8 pt-4">
          <div className="w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl bg-[#f5f0ea] animate-pulse" />
        </div>
        {/* Skeleton search */}
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="h-14 rounded-xl bg-[#faf7f2] animate-pulse" />
        </div>
        {/* Skeleton categories */}
        <div className="flex gap-3 px-4 py-4 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-[72px] h-[72px] rounded-2xl bg-[#faf7f2] animate-pulse flex-shrink-0" />
          ))}
        </div>
        {/* Skeleton products grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[#faf7f2] rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ═══ 1. HERO BANNER CAROUSEL ═══ */}
      <div className="pt-[7.5rem] md:pt-[8.5rem] bg-white">
        <HeroSlider />
      </div>

      {/* ═══ 2. SEARCH BAR WITH TYPING ANIMATION ═══ */}
      <div className="bg-white">
        <SearchBar />
      </div>

      {/* ═══ 3. CATEGORY GRID ═══ */}
      <div className="bg-white">
        <CategoryGrid />
      </div>

      {/* ═══ 3.5 FEATURED PICKS — Fav Flowers + Birthday Gifts ═══ */}
      <div className="bg-white">
        <FeaturedPicks />
      </div>

      {/* ═══ 4. PROMO SLIDER BANNERS ═══ */}
      <div className="bg-white pb-6">
        <PromoSlider />
      </div>

      {/* ═══ 5. PRODUCT GRID — ALL PRODUCTS ═══ */}
      <section className="py-12 md:py-20 bg-white border-t border-[#f0ece4]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8 md:mb-12"
          >
            <span className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium text-[#5c6e4f] mb-3">Curated For You</span>
            <h2 className="font-serif text-2xl md:text-4xl text-[#3a3226] leading-tight">Our Best Picks</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
          >
            <AnimatePresence mode="wait">
              {displayProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product as unknown as { id: string; name: string; image_url: string; slug: string; stock: number; image_scale?: number; tag?: string }}
                  index={idx}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Explore More Button */}
          {products.length > 0 && (
            <div className="mt-12 md:mt-16 text-center">
              <Link href="/shop" className="inline-flex items-center gap-2.5 bg-[#5c6e4f] text-white px-8 md:px-10 py-3.5 md:py-4 text-xs uppercase tracking-[0.2em] font-semibold rounded-full hover:bg-[#4a5a3f] transition-all duration-400 group shadow-md hover:shadow-lg">
                Explore All Products
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══ SHOP BY RELATIONSHIP ═══ */}
      {showRelationships && (
        <section className="py-12 md:py-16 bg-[#faf7f2] border-y border-[#ede4d6]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <span className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium text-[#5c6e4f] mb-3">Shop By</span>
              <h2 className="font-serif text-xl md:text-3xl text-[#3a3226]">For Every Relationship</h2>
            </motion.div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-6 w-full">
              {relationships.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/shop?relation=${item.name.toLowerCase()}`} className="flex flex-col items-center gap-2.5 group">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-card transition-all duration-300 group-hover:-translate-y-1">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 25vw, 12vw" />
                      {/* Floating petal particles — only visible over the icon on hover */}
                      <span className="rel-petal" style={{ left: '30%', ['--tx' as string]: '-8px', ['--rot' as string]: '-25deg' }}>♥</span>
                      <span className="rel-petal" style={{ left: '55%', ['--tx' as string]: '10px', ['--rot' as string]: '20deg' }}>♥</span>
                      <span className="rel-petal" style={{ left: '20%', ['--tx' as string]: '-12px', ['--rot' as string]: '15deg' }}>♥</span>
                      <span className="rel-petal" style={{ left: '65%', ['--tx' as string]: '6px', ['--rot' as string]: '-30deg' }}>♥</span>
                    </div>
                    <span className="text-[10px] md:text-xs font-medium text-[#3a3226] text-center line-clamp-1 group-hover:text-[#5c6e4f] transition-colors">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ LUXURY COLLECTION GRID ═══ */}
      <section id="categories" className="py-14 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8 md:mb-12"
          >
            <span className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium text-[#5c6e4f] mb-3">Curated For You</span>
            <h2 className="font-serif text-xl md:text-3xl text-[#3a3226]">Our Collections</h2>
            <p className="text-[#8a7a5a] text-sm font-light mt-2 max-w-lg">Discover thoughtfully arranged categories, each designed to make every occasion unforgettable.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[240px]">
            {displayCollections.map((cat, idx) => (
              <motion.div
                key={cat.id || cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                viewport={{ once: true }}
                className={COLLECTION_SPANS[idx] || ''}
              >
                <Link href={`/shop?cat=${cat.slug}`} className="group relative block h-full overflow-hidden rounded-2xl md:rounded-3xl shadow-sm hover:shadow-card transition-shadow duration-500">
                  <Image src={cat.image_url || `/images/collections/${cat.slug}.webp`} alt={cat.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent group-hover:from-black/45 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 p-4 md:p-6">
                    <h3 className="font-serif text-base md:text-xl text-white mb-1">{cat.name}</h3>
                    <span className="inline-flex items-center gap-1 text-white/60 text-[10px] md:text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Explore <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CELEBRATE LOVE ═══ */}
      <CelebrateLove />

      {/* ═══ REVIEW VIDEOS ═══ */}
      <ReviewVideos />

      {/* ═══ PHOTO REVIEWS ═══ */}
      <PhotoReviews />

      {/* ═══ CELEBRATIONS CALENDAR ═══ */}
      {showCelebrations && visibleCelebrations.length > 0 && (
        <section className="py-12 md:py-16 bg-white border-t border-[#f0ece4]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8 md:mb-12"
            >
              <span className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium text-[#5c6e4f] mb-3">Mark Your Calendar</span>
              <h2 className="font-serif text-xl md:text-3xl text-[#3a3226]">Celebrations Calendar</h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {visibleCelebrations.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/shop?celebration=${encodeURIComponent(event.name.toLowerCase())}`} className="group cursor-pointer block">
                    <div className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-card transition-all duration-500 group-hover:-translate-y-1">
                      {event.date_label && (
                        <div className="bg-[#faf7f2] text-[#3a3226] text-xs md:text-sm font-bold text-center py-3 md:py-4 uppercase tracking-wider">
                          {event.date_label}
                        </div>
                      )}
                      <div className="relative aspect-[4/3]">
                        <Image src={event.image_url} alt={event.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />
                      </div>
                    </div>
                    <h3 className="text-center font-semibold text-[#3a3226] text-sm md:text-base mt-4 group-hover:text-[#5c6e4f] transition-colors">{event.name}</h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ NEW ARRIVALS ═══ */}
      {showNewArrivals && newArrivals.length > 0 && (
        <section className="py-14 md:py-20 bg-[#faf7f2] border-y border-[#ede4d6]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8 md:mb-12"
            >
              <span className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium text-[#5c6e4f] mb-3">Just In</span>
              <h2 className="font-serif text-xl md:text-3xl text-[#3a3226]">New Arrivals</h2>
              <p className="text-[#8a7a5a] text-sm font-light mt-2">Discover our latest collection of premium gifts and floral arrangements.</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {newArrivals.map((product, idx) => (
                <ProductCard key={product.id} product={product as unknown as { id: string; name: string; image_url: string; slug: string; stock: number; image_scale?: number; tag?: string }} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ BEST SELLERS ═══ */}
      {showBestSellers && bestSellers.length > 0 && (
        <section className="py-14 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8 md:mb-12"
            >
              <span className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium text-[#5c6e4f] mb-3">Most Loved</span>
              <h2 className="font-serif text-xl md:text-3xl text-[#3a3226]">Best Sellers</h2>
              <p className="text-[#8a7a5a] text-sm font-light mt-2">Our most adored premium gifts — curated for those who appreciate the finest.</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {bestSellers.map((product, idx) => (
                <ProductCard key={product.id} product={product as unknown as { id: string; name: string; image_url: string; slug: string; stock: number; image_scale?: number; tag?: string }} index={idx} />
              ))}
            </div>
            <div className="text-center mt-12 md:mt-14">
              <Link href="/shop" className="group inline-flex items-center gap-2.5 border-2 border-[#5c6e4f]/30 text-[#3a3226] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold rounded-full hover:bg-[#5c6e4f] hover:text-white hover:border-[#5c6e4f] transition-all duration-400 shadow-sm hover:shadow-md">
                View All Products <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ FEATURED ROSES GRID ═══ */}
      {showFeaturedRoses && featuredRoses.length > 0 && (
        <section className="py-14 md:py-24 bg-[#faf7f2]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8 md:mb-12"
            >
              <span className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium text-[#5c6e4f] mb-3">The Rose Collection</span>
              <h2 className="font-serif text-xl md:text-3xl text-[#3a3226]">Handpicked Perfection</h2>
              <p className="text-[#8a7a5a] text-sm font-light mt-2">Every rose is carefully selected and arranged by our master florists.</p>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {featuredRoses.map((rose, idx) => (
                <motion.div
                  key={rose.id ?? idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer shadow-sm hover:shadow-card transition-shadow duration-500"
                >
                  <Image src={rose.image_url} alt={rose.label} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 p-4 md:p-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                    <p className="text-white font-serif text-base md:text-lg">{rose.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ABOUT BRAND ═══ */}
      <section id="about" className="py-14 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card">
              <Image src="/images/our-story.webp" alt="New Eco Roses Storefront" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true }}>
              <span className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium text-[#5c6e4f] mb-5">Our Story</span>
              <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl text-[#3a3226] mb-6 leading-tight">
                Crafted With Love,<br /><em className="italic text-[#5c6e4f]">Delivered With Care</em>
              </h2>
              <p className="text-[#8a7a5a] leading-relaxed mb-5 font-light max-w-lg">
                At New Eco Roses, we believe every occasion deserves to be celebrated beautifully. Located in the heart of Kolkata, we have built a reputation as one of the city&apos;s most trusted and loved gifting destinations.
              </p>
              <p className="text-[#8a7a5a] leading-relaxed mb-10 font-light max-w-lg">
                Every arrangement is crafted using fresh, handpicked blooms sourced with care and arranged by experienced florists who understand the art of elegance.
              </p>
              <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 border-t border-[#ede4d6]">
                <div className="text-center">
                  <p className="font-serif text-2xl md:text-3xl text-[#5c6e4f] mb-1">{happyCustomers}</p>
                  <p className="text-[10px] md:text-xs text-[#8a7a5a] uppercase tracking-widest">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-2xl md:text-3xl text-[#5c6e4f] mb-1">{giftsDelivered}</p>
                  <p className="text-[10px] md:text-xs text-[#8a7a5a] uppercase tracking-widest">Gifts Delivered</p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-2xl md:text-3xl text-[#5c6e4f] mb-1">{starRating}</p>
                  <p className="text-[10px] md:text-xs text-[#8a7a5a] uppercase tracking-widest">Star Rating</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      {showTestimonials && testimonials.length > 0 && (
        <section className="py-14 md:py-24 bg-[#faf7f2] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="block text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium text-[#5c6e4f] mb-3">What Our Clients Say</span>
              <h2 className="font-serif text-xl md:text-3xl text-[#3a3226]">Love Notes</h2>
              <p className="text-[#8a7a5a] text-sm font-light mt-2">Real stories from people who chose us for their most special moments.</p>
            </motion.div>
          </div>
          <div className="relative w-full mask-linear-fade">
            {/* Row 1 */}
            <motion.div className="flex gap-4 md:gap-6 w-max mb-4 md:mb-6 pl-4" animate={{ x: "-50%" }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }}>
              {[...T1, ...T1].map((t, idx) => (
                <div key={`r1-${idx}`} className="bg-white rounded-2xl p-5 md:p-6 shadow-soft w-[280px] md:w-[350px] flex-shrink-0 relative border border-[#ede4d6]/50">
                  <Quote size={18} className="text-[#5c6e4f]/20 absolute top-4 right-4" />
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < Math.floor(t.rating) ? "text-[#c9a247] fill-[#c9a247]" : i < t.rating ? "text-[#c9a247] fill-[#c9a247]/50" : "text-gray-200 fill-gray-200"} />
                    ))}
                  </div>
                  <p className="text-[#8a7a5a] text-xs md:text-sm leading-relaxed mb-3 font-light italic line-clamp-3">&ldquo;{t.review_text}&rdquo;</p>
                  <p className="font-semibold text-[#3a3226] text-[10px] md:text-xs uppercase tracking-wider">{t.customer_name}</p>
                </div>
              ))}
            </motion.div>
            {/* Row 2 */}
            {T2.length > 0 && (
              <motion.div className="flex gap-4 md:gap-6 w-max pl-4" animate={{ x: "0%" }} initial={{ x: "-50%" }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }}>
                {[...T2, ...T2].map((t, idx) => (
                  <div key={`r2-${idx}`} className="bg-white rounded-2xl p-5 md:p-6 shadow-soft w-[280px] md:w-[350px] flex-shrink-0 relative border border-[#ede4d6]/50">
                    <Quote size={18} className="text-[#5c6e4f]/20 absolute top-4 right-4" />
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} className={i < Math.floor(t.rating) ? "text-[#c9a247] fill-[#c9a247]" : i < t.rating ? "text-[#c9a247] fill-[#c9a247]/50" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                    <p className="text-[#8a7a5a] text-xs md:text-sm leading-relaxed mb-3 font-light italic line-clamp-3">&ldquo;{t.review_text}&rdquo;</p>
                    <p className="font-semibold text-[#3a3226] text-[10px] md:text-xs uppercase tracking-wider">{t.customer_name}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="py-20 md:py-32 overflow-hidden relative bg-[#FAF7F2]">
        {/* Custom Luxury Background Image */}
        <Image
          src="/why%20new%20eco%20roses%20banner.webp"
          alt="Why New Eco Roses background"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/85 via-[#FAF7F2]/65 to-[#FAF7F2]/90 backdrop-blur-[2px]" />

        {/* Organic Soft Radial Glow & Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#556B4E]/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#2E2A26_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-[#556B4E]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-semibold mb-4 text-[#556B4E] px-4 py-1.5 rounded-full bg-[#556B4E]/10 border border-[#556B4E]/20 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#556B4E] animate-pulse" />
              Our Promise
            </span>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#2E2A26] mb-4 font-bold tracking-tight">
              Why New Eco Roses?
            </h2>
            
            {/* Elegant Botanical Divider */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#556B4E]/30 to-transparent" />
              <svg className="w-4 h-4 text-[#556B4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 14c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
              </svg>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#556B4E]/30 to-transparent" />
            </div>

            <p className="text-[#6D6A66] text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
              Every detail is crafted to make your gifting experience effortless, elegant, and unforgettable.
            </p>
          </motion.div>

          {/* Three Floating Luxury Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {[
              {
                icon: <Truck className="w-7 h-7 text-white stroke-[1.75]" />,
                title: 'Same-Day Delivery',
                desc: 'Same-day delivery available across Kolkata.',
                isFeatured: false,
              },
              {
                icon: <Gift className="w-7 h-7 text-white stroke-[1.75]" />,
                title: 'Premium Packaging',
                desc: 'Every gift is wrapped in our signature luxury packaging — ribbons, tissue, and a personal handwritten note included.',
                isFeatured: true,
              },
              {
                icon: <MessageCircle className="w-7 h-7 text-white stroke-[1.75]" />,
                title: 'Instant WhatsApp Support',
                desc: 'Direct line to our team. Get recommendations, customise orders, and track your delivery in real time.',
                isFeatured: false,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className={`group relative bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2.5 hover:scale-[1.02] overflow-hidden ${
                  item.isFeatured
                    ? 'shadow-[0_20px_45px_-5px_rgba(85,107,78,0.12)] hover:shadow-[0_30px_60px_-10px_rgba(85,107,78,0.22)] border border-[#556B4E]/30 md:-translate-y-3'
                    : 'shadow-[0_15px_35px_-5px_rgba(46,42,38,0.06)] hover:shadow-[0_25px_50px_-12px_rgba(85,107,78,0.18)] border border-[#2E2A26]/5 hover:border-[#556B4E]/40'
                }`}
              >
                {/* Top Subtle Shimmer Line */}
                <div
                  className={`absolute top-0 inset-x-0 h-[2px] transition-opacity duration-500 ${
                    item.isFeatured
                      ? 'bg-gradient-to-r from-[#C9A86A]/80 via-[#556B4E] to-[#C9A86A]/80 opacity-100'
                      : 'bg-gradient-to-r from-transparent via-[#556B4E]/40 to-transparent opacity-40 group-hover:opacity-100'
                  }`}
                />

                {/* Olive Green Icon Container with Soft Glow */}
                <div className="relative mb-7">
                  <div className="absolute -inset-1.5 bg-[#556B4E]/20 rounded-2xl blur-md -z-10 group-hover:bg-[#556B4E]/35 transition-colors" />
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#556B4E] flex items-center justify-center shadow-lg shadow-[#556B4E]/25 ring-4 ring-[#556B4E]/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 border border-white/20">
                    {item.icon}
                  </div>
                </div>

                <h3 className="font-serif text-xl md:text-2xl text-[#2E2A26] font-bold mb-3 group-hover:text-[#556B4E] transition-colors">
                  {item.title}
                </h3>
                <div className="w-10 h-0.5 mb-4 mx-auto bg-gradient-to-r from-transparent via-[#556B4E]/30 to-transparent group-hover:via-[#556B4E] transition-colors" />
                <p className="text-[#6D6A66] text-xs md:text-sm font-light leading-relaxed max-w-[270px]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Premium Trust Metrics Bar */}
          <div className="mt-16 md:mt-24 pt-12 border-t border-[#556B4E]/15">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
              {[
                { value: '10,000+', label: 'Happy Customers' },
                { value: 'Same-Day', label: 'Guaranteed Delivery' },
                { value: 'Signature', label: 'Luxury Packaging' },
                {
                  value: (
                    <span className="inline-flex items-center gap-1.5">
                      <span>4.9</span>
                      <span className="inline-block bg-gradient-to-r from-amber-200 via-yellow-50 to-amber-200 bg-[length:200%_100%] bg-clip-text text-transparent animate-gold-shimmer drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] text-2xl md:text-3xl leading-none select-none">
                        ★
                      </span>
                    </span>
                  ),
                  label: 'Customer Rating',
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="space-y-1 p-4 rounded-2xl hover:bg-white/50 transition-colors"
                >
                  <div className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#2E2A26] font-bold tracking-tight flex items-center justify-center">
                    {stat.value}
                  </div>
                  <p className="text-[11px] md:text-xs text-[#6D6A66] uppercase tracking-[0.15em] font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <Image src="/images/banners/cta-banner.webp" alt="Premium gifts" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <h2 className="font-serif text-2xl md:text-5xl text-white mb-4">Ready to Make Someone&apos;s Day?</h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto font-light text-sm md:text-base">Browse our collection or message us on WhatsApp for a bespoke gift.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-[#3a3226] px-7 md:px-8 py-3.5 md:py-4 text-xs uppercase tracking-[0.2em] font-semibold rounded-full hover:bg-[#5c6e4f] hover:text-white transition-all duration-400">
                Browse Collection <ArrowRight size={14} />
              </Link>
              <a href={ctaWaLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-7 md:px-8 py-3.5 md:py-4 text-xs uppercase tracking-[0.2em] font-semibold rounded-full hover:bg-[#1fb855] transition-all duration-300">
                Message on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <WhatsAppFloat />
    </>
  );
}
