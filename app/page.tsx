'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/product-card';
import SectionHeader from '@/components/ui/section-header';
import WhatsAppFloat from '@/components/ui/whatsapp-float';
import {
  fetchProducts,
  fetchCollections,
  fetchCelebrations,
  DBProduct,
  DBCollection,
  DBCelebration
} from '@/lib/supabase';

export default function Home() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [collections, setCollections] = useState<DBCollection[]>([]);
  const [celebrations, setCelebrations] = useState<DBCelebration[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeSort, setActiveSort] = useState('Recommended');
  const [activeType, setActiveType] = useState('All');
  const [activeOccasion, setActiveOccasion] = useState('All');

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCollections(), fetchCelebrations()])
      .then(([prods, cols, celebs]) => {
        if (prods.length > 0) setProducts(prods);
        if (cols.length > 0) setCollections(cols);
        if (celebs.length > 0) setCelebrations(celebs);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
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

    if (activeSort === 'Newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (activeSort === 'Best Seller') {
      filtered.sort((a, b) => (a.tag === 'Best Seller' ? -1 : 1));
    }

    // Return up to 12 items for the homepage (3 rows of 4)
    return filtered.slice(0, 12);
  }, [products, activeType, activeOccasion, activeSort]);

  if (loading) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader label="Curated Collection" title="Our Best Gifts" subtitle="Find the perfect arrangement for any moment." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader label="Handpicked Selection" title="Premium Collections" subtitle="Explore a curated selection of our finest roses, boxes, and luxury gifts." />

        {/* Horizontal Filter Bar */}
        <div className="mb-12 mt-10">
          <div className="flex flex-wrap items-center justify-start lg:justify-center gap-4">
            {/* Sort By */}
            <div className="relative group">
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-foreground px-6 py-3 pr-10 rounded-full text-sm font-medium hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
              >
                <option value="Recommended">Sort By: Recommended</option>
                <option value="Newest">Sort By: Newest Arrivals</option>
                <option value="Best Seller">Sort By: Best Seller</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" />
            </div>

            {/* Gift Type (Collection) */}
            <div className="relative group">
              <select
                value={activeType}
                onChange={(e) => setActiveType(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-foreground px-6 py-3 pr-10 rounded-full text-sm font-medium hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
              >
                <option value="All">Gift Type: All</option>
                {collections.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" />
            </div>

            {/* Occasion (Celebration) */}
            <div className="relative group">
              <select
                value={activeOccasion}
                onChange={(e) => setActiveOccasion(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-foreground px-6 py-3 pr-10 rounded-full text-sm font-medium hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
              >
                <option value="All">Occasion: All Occasions</option>
                {celebrations.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
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
            <button onClick={() => { setActiveSort('Recommended'); setActiveType('All'); setActiveOccasion('All'); }} className="text-primary hover:underline font-medium">Clear Filters</button>
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

      <WhatsAppFloat />
    </div>
  );
}
