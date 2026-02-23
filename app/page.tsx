'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Star, Quote, HeartPulse, Sparkles, Filter } from 'lucide-react';

import ReviewVideos from '@/components/home/review-videos';
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
  span: i === 0 ? 'md:col-span-2 md:row-span-2' : i === 5 ? 'md:col-span-2' : i === 6 ? 'md:col-span-2' : i === 7 ? 'md:col-span-4 md:row-span-1' : '',
}));

const COLLECTION_SPANS = ['md:col-span-2 md:row-span-2', '', '', '', '', 'md:col-span-2', 'md:col-span-2', 'md:col-span-4 md:row-span-1'];

export default function Home() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [activeSort, setActiveSort] = useState('Recommended');
  const [activeType, setActiveType] = useState('All');
  const [activeOccasion, setActiveOccasion] = useState('All');
  const [activeRelation, setActiveRelation] = useState('All');

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

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (activeType !== 'All') {
      filtered = filtered.filter(p => p.collection_name === activeType);
    }

    if (activeOccasion !== 'All') {
      filtered = filtered.filter(p => p.celebrations?.includes(activeOccasion));
    }

    if (activeRelation !== 'All') {
      filtered = filtered.filter(p => p.relationships?.includes(activeRelation));
    }

    if (activeSort === 'Newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (activeSort === 'Best Seller') {
      filtered.sort((a, b) => (a.tag === 'Best Seller' ? -1 : 1));
    }

    // Return up to 12 items for the homepage (3 rows of 4)
    return filtered.slice(0, 12);
  }, [products, activeType, activeOccasion, activeRelation, activeSort]);

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

  if (!loaded) {
    return (
      <div className="pt-28 pb-20 min-h-[80vh] bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ═══ FILTERED PRODUCT GRID (TOP SECTION) ═══ */}
      <section className="pt-32 pb-24 bg-background border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Horizontal Filter Bar */}
          <div className="mb-10 space-y-6">

            {/* 1. Gift Types (Categories) - Scrollable on Mobile, Wrap on PC */}
            <div className="w-full relative">
              <div className="flex overflow-x-auto lg:overflow-visible lg:flex-wrap no-scrollbar gap-2 w-full pb-2 snap-x justify-start items-center">
                <button
                  onClick={() => setActiveType('All')}
                  className={`whitespace-nowrap flex-shrink-0 snap-start px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${activeType === 'All' ? 'bg-foreground text-white shadow-md' : 'bg-white text-muted border border-gray-200 hover:border-foreground hover:text-foreground'}`}
                >
                  All Gifts
                </button>
                {collections.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveType(c.name)}
                    className={`whitespace-nowrap flex-shrink-0 snap-start px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${activeType === c.name ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-muted border border-gray-200 hover:border-primary hover:text-primary'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Advanced Dropdown Filters - Stacked on Mobile, Side-by-side on Tablet/PC */}
            <div className="flex flex-col md:flex-row items-center justify-start gap-4 w-full">
              {/* Occasion (Celebration) */}
              <div className="relative group w-full md:w-auto">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                  <Sparkles size={16} />
                </div>
                <select
                  value={activeOccasion}
                  onChange={(e) => setActiveOccasion(e.target.value)}
                  className="w-full md:w-auto appearance-none bg-white border border-gray-200 text-foreground pl-11 pr-10 py-3.5 rounded-xl text-sm font-medium hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
                >
                  <option value="All">All Occasions</option>
                  {celebrations.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" />
              </div>

              {/* Relationship Filter */}
              <div className="relative group w-full md:w-auto">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                  <HeartPulse size={16} />
                </div>
                <select
                  value={activeRelation}
                  onChange={(e) => setActiveRelation(e.target.value)}
                  className="w-full md:w-auto appearance-none bg-white border border-gray-200 text-foreground pl-11 pr-10 py-3.5 rounded-xl text-sm font-medium hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
                >
                  <option value="All">All Relationships</option>
                  {relationships.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" />
              </div>

              {/* Sort By */}
              <div className="relative group w-full md:w-auto">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                  <Filter size={16} />
                </div>
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  className="w-full md:w-auto appearance-none bg-white border border-gray-200 text-foreground pl-11 pr-10 py-3.5 rounded-xl text-sm font-medium hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
                >
                  <option value="Recommended">Sort: Recommended</option>
                  <option value="Newest">Sort: Newest Arrivals</option>
                  <option value="Best Seller">Sort: Best Seller</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="wait">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product as unknown as { id: string; name: string; image_url: string; slug: string; stock: number; image_scale?: number; tag?: string }}
                  index={idx}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-muted">
              <p className="mb-4">No products found matching these filters.</p>
              <button onClick={() => { setActiveSort('Recommended'); setActiveType('All'); setActiveOccasion('All'); setActiveRelation('All'); }} className="text-primary hover:underline font-medium">Clear Filters</button>
            </motion.div>
          )}

          {/* Explore More Button */}
          {products.length > 0 && (
            <div className="mt-16 text-center">
              <Link href="/shop" className="inline-flex items-center gap-2 border border-foreground/20 text-foreground px-10 py-4 text-xs uppercase tracking-[0.2em] font-semibold rounded-full hover:bg-foreground hover:text-white transition-all duration-400 group shadow-sm hover:shadow-md">
                Explore All Products
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══ SHOP BY RELATIONSHIP ═══ */}
      {showRelationships && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8 text-left">For Every Relationship</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-6 justify-between w-full pb-4">
              {relationships.map((item, idx) => (
                <Link key={idx} href={`/shop?relation=${item.name.toLowerCase()}`} className="flex flex-col items-center gap-3 w-full group cursor-pointer hover:bg-secondary/30 rounded-2xl py-2 transition-colors">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-md transition-all">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12vw, 150px" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground text-center line-clamp-1 w-full px-1">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ LUXURY CATEGORY GRID ═══ */}
      <section id="categories" className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader label="Curated For You" title="Our Collections" subtitle="Discover thoughtfully arranged categories, each designed to make every occasion unforgettable." />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px] md:auto-rows-[240px]">
            {displayCollections.map((cat, idx) => (
              <motion.div
                key={cat.id || cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className={COLLECTION_SPANS[idx] || ''}
              >
                <Link href={`/shop?cat=${cat.slug}`} className="group relative block h-full overflow-hidden rounded-xl img-shimmer">
                  <Image src={cat.image_url || `/images/collections/${cat.slug}.webp`} alt={cat.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/50 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="font-serif text-xl md:text-2xl text-white mb-1">{cat.name}</h3>
                    <span className="inline-flex items-center gap-1 text-white/70 text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Explore <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REVIEW VIDEOS ═══ */}
      <ReviewVideos />

      {/* ═══ CELEBRATIONS CALENDAR ═══ */}
      {showCelebrations && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader label="Mark Your Calendar" title="Celebrations Calendar" />
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {celebrations.map((event, idx) => (
                <Link key={idx} href={`/shop?celebration=${encodeURIComponent(event.name.toLowerCase())}`} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all">
                    {event.date_label && (
                      <div className="bg-[#EAF4F4] text-foreground text-xs font-bold text-center py-3 uppercase tracking-wider">
                        {event.date_label}
                      </div>
                    )}
                    <div className="relative aspect-square img-shimmer">
                      <Image src={event.image_url} alt={event.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 20vw" />
                    </div>
                  </div>
                  <h3 className="text-center font-bold text-foreground text-sm mt-3 group-hover:text-primary transition-colors">{event.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ NEW ARRIVALS ═══ */}
      {showNewArrivals && newArrivals.length > 0 && (
        <section className="py-20 bg-background border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader label="Just In" title="New Arrivals" subtitle="Discover our latest collection of premium gifts and floral arrangements." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product, idx) => (
                <ProductCard key={product.id} product={product as unknown as { id: string; name: string; image_url: string; slug: string; stock: number; image_scale?: number; tag?: string }} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ BEST SELLERS ═══ */}
      {showBestSellers && bestSellers.length > 0 && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader label="Most Loved" title="Best Sellers" subtitle="Our most adored premium gifts — curated for those who appreciate the finest." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((product, idx) => (
                <ProductCard key={product.id} product={product as unknown as { id: string; name: string; image_url: string; slug: string; stock: number; image_scale?: number; tag?: string }} index={idx} />
              ))}
            </div>
            <div className="text-center mt-14">
              <Link href="/shop" className="group inline-flex items-center gap-2 border border-foreground/20 text-foreground px-8 py-3.5 text-[0.75rem] uppercase tracking-[0.2em] font-medium rounded-full hover:bg-foreground hover:text-white transition-all duration-400">
                View All Products <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ FEATURED ROSES GRID ═══ */}
      {showFeaturedRoses && featuredRoses.length > 0 && (
        <section className="py-20 lg:py-28 bg-secondary">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader label="The Rose Collection" title="Handpicked Perfection" subtitle="Every rose is carefully selected and arranged by our master florists." />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredRoses.map((rose, idx) => (
                <motion.div
                  key={rose.id ?? idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative aspect-[3/4] overflow-hidden rounded-xl img-zoom cursor-pointer"
                >
                  <Image src={rose.image_url} alt={rose.label} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 p-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                    <p className="text-white font-serif text-lg">{rose.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ABOUT BRAND ═══ */}
      <section id="about" className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/images/our-story.webp" alt="New Eco Roses Storefront" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true }}>
              <span className="block text-xs uppercase tracking-[0.25em] font-accent font-medium text-primary mb-6">Our Story</span>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground mb-8 leading-tight">
                Crafted With Love,<br /><em className="italic text-primary not-italic" style={{ fontStyle: 'italic' }}>Delivered With Care</em>
              </h2>
              <p className="text-muted leading-relaxed mb-6 font-light max-w-lg text-left md:text-justify">
                At New Eco Roses, we believe every occasion deserves to be celebrated beautifully. Located in the heart of Kolkata, we have built a reputation as one of the city&apos;s most trusted and loved gifting destinations.
              </p>
              <p className="text-muted leading-relaxed mb-10 font-light max-w-lg text-left md:text-justify">
                Every arrangement is created using fresh, handpicked blooms sourced with care and arranged by experienced florists who understand the art of elegance. With our signature premium packaging and warm, personalized service, New Eco Roses continues to be recognized as one of the best gift shops in Kolkata.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="font-serif text-3xl text-primary mb-1">{happyCustomers}</p>
                  <p className="text-xs text-muted uppercase tracking-widest">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-3xl text-primary mb-1">{giftsDelivered}</p>
                  <p className="text-xs text-muted uppercase tracking-widest">Gifts Delivered</p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-3xl text-primary mb-1">{starRating}</p>
                  <p className="text-xs text-muted uppercase tracking-widest">Star Rating</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      {showTestimonials && testimonials.length > 0 && (
        <section className="py-20 lg:py-28 bg-blush overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
            <SectionHeader label="What Our Clients Say" title="Love Notes" subtitle="Real stories from people who chose us for their most special moments." />
          </div>
          <div className="relative w-full mask-linear-fade">
            {/* Row 1 */}
            <motion.div className="flex gap-6 w-max mb-6 pl-4" animate={{ x: "-50%" }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }}>
              {[...T1, ...T1].map((t, idx) => (
                <div key={`r1-${idx}`} className="bg-white rounded-2xl p-6 shadow-soft w-[350px] flex-shrink-0 relative border border-gray-50">
                  <Quote size={20} className="text-primary/20 absolute top-5 right-5" />
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < Math.floor(t.rating) ? "text-primary fill-primary" : i < t.rating ? "text-primary fill-primary/50" : "text-gray-200 fill-gray-200"} />
                    ))}
                  </div>
                  <p className="text-muted text-sm leading-relaxed mb-4 font-light italic line-clamp-3">&ldquo;{t.review_text}&rdquo;</p>
                  <p className="font-medium text-foreground text-xs uppercase tracking-wider">{t.customer_name}</p>
                </div>
              ))}
            </motion.div>
            {/* Row 2 */}
            {T2.length > 0 && (
              <motion.div className="flex gap-6 w-max pl-4" animate={{ x: "0%" }} initial={{ x: "-50%" }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }}>
                {[...T2, ...T2].map((t, idx) => (
                  <div key={`r2-${idx}`} className="bg-white rounded-2xl p-6 shadow-soft w-[350px] flex-shrink-0 relative border border-gray-50">
                    <Quote size={20} className="text-primary/20 absolute top-5 right-5" />
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className={i < Math.floor(t.rating) ? "text-primary fill-primary" : i < t.rating ? "text-primary fill-primary/50" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                    <p className="text-muted text-sm leading-relaxed mb-4 font-light italic line-clamp-3">&ldquo;{t.review_text}&rdquo;</p>
                    <p className="font-medium text-foreground text-xs uppercase tracking-wider">{t.customer_name}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="py-24 lg:py-32 overflow-hidden relative">
        <Image src="/images/why-new-eco-roses.webp" alt="Why New Eco Roses background" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-white/80" />
        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-medium mb-4 text-primary">Our Promise</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-5 leading-tight">Why New Eco Roses?</h2>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-12 bg-gray-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <div className="h-px w-12 bg-gray-200" />
            </div>
            <p className="text-muted text-sm font-light max-w-md mx-auto leading-relaxed tracking-wide">Every detail is crafted to make your gifting experience effortless, elegant, and unforgettable.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H3l9-9 9 9h-2" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /><path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" /></svg>),
                title: 'Same-Day Delivery',
                desc: `Order by ${deliveryCutoff} for guaranteed same-day delivery within our ${deliveryRadius} km service radius.`,
              },
              {
                icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>),
                title: 'Premium Packaging',
                desc: 'Every gift is wrapped in our signature luxury packaging — ribbons, tissue, and a personal handwritten note included.',
              },
              {
                icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>),
                title: 'Instant WhatsApp Support',
                desc: 'Direct line to our team. Get recommendations, customise orders, and track your delivery in real time.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.13), 0 8px 24px rgba(0,0,0,0.07)' }}
                className="group relative bg-white rounded-[20px] p-8 lg:p-10 flex flex-col items-center text-center"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', transition: 'box-shadow 0.35s ease, transform 0.35s ease' }}
              >
                <div className="absolute top-0 left-8 right-8 h-[2px] rounded-full transition-all duration-300 group-hover:left-4 group-hover:right-4" style={{ background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)' }} />
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-7 transition-all duration-300 bg-primary/10 text-primary">
                  <span className="group-hover:scale-110 transition-transform duration-300 inline-flex text-primary">{item.icon}</span>
                </div>
                <h3 className="font-serif text-xl lg:text-2xl text-foreground mb-4 leading-snug">{item.title}</h3>
                <div className="w-8 h-px mb-4 mx-auto bg-primary/50" />
                <p className="text-muted text-sm font-light leading-[1.85] max-w-[240px]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="relative py-28 lg:py-36 overflow-hidden">
        <Image src="/images/banners/cta-banner.webp" alt="Premium gifts" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">Ready to Make Someone&apos;s Day?</h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto font-light">Browse our collection or message us on WhatsApp for a bespoke gift.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-400">
                Browse Collection <ArrowRight size={14} />
              </Link>
              <a href={ctaWaLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-semibold rounded-full hover:bg-[#1fb855] transition-all duration-300">
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
