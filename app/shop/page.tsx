'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProductCard from '@/components/product/product-card';
import SectionHeader from '@/components/ui/section-header';
import WhatsAppFloat from '@/components/ui/whatsapp-float';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, fetchCollections, DBProduct, DBCollection } from '@/lib/supabase';
import { PRODUCTS, COLLECTIONS } from '@/lib/products';

const TAG_FILTERS = ['All', 'Best Seller', 'New Arrival', 'Seasonal', 'Standard'];

function ShopContent() {
    const searchParams = useSearchParams();
    const [activeCollection, setActiveCollection] = useState('All');
    const [activeTag, setActiveTag] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [products, setProducts] = useState<DBProduct[]>([]);
    const [collections, setCollections] = useState<DBCollection[]>([]);
    const [loading, setLoading] = useState(true);

    // Load from Supabase first, fallback to static
    useEffect(() => {
        Promise.all([fetchProducts(), fetchCollections()]).then(([prods, cols]) => {
            if (prods.length > 0) {
                setProducts(prods);
            } else {
                setProducts(PRODUCTS as unknown as DBProduct[]);
            }
            if (cols.length > 0) {
                setCollections(cols);
            } else {
                setCollections(COLLECTIONS.map((c, i) => ({ id: String(i), name: c.name, slug: c.slug, image_url: '', description: '', is_visible: true, sort_order: i, created_at: '' })));
            }
            setLoading(false);
        }).catch(() => {
            setProducts(PRODUCTS as unknown as DBProduct[]);
            setCollections(COLLECTIONS.map((c, i) => ({ id: String(i), name: c.name, slug: c.slug, image_url: '', description: '', is_visible: true, sort_order: i, created_at: '' })));
            setLoading(false);
        });
    }, []);

    // Read URL query params on mount
    useEffect(() => {
        const cat = searchParams.get('cat');
        const relation = searchParams.get('relation');
        const celebration = searchParams.get('celebration');
        const tag = searchParams.get('tag');

        if (cat) {
            const found = collections.find((c) => c.slug === cat || c.name.toLowerCase() === cat.toLowerCase());
            if (found) setActiveCollection(found.name);
        }
        if (tag) {
            const found = TAG_FILTERS.find((t) => t.toLowerCase() === tag.toLowerCase());
            if (found) setActiveTag(found);
        }
        if (relation) setSearchQuery(relation);
        if (celebration) setSearchQuery(celebration);
    }, [searchParams, collections]);

    const filteredProducts = products.filter((product) => {
        const matchesCollection = activeCollection === 'All' || product.collection_name === activeCollection;
        const matchesTag = activeTag === 'All' || product.tag === activeTag;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q ||
            product.name.toLowerCase().includes(q) ||
            (product.relationships ?? []).some((r: string) => r.toLowerCase().includes(q)) ||
            (product.celebrations ?? []).some((c: string) => c.toLowerCase().includes(q)) ||
            (product.collection_name ?? '').toLowerCase().includes(q);
        return matchesCollection && matchesTag && matchesSearch;
    });

    const FilterSidebar = ({ mobile = false }: { mobile?: boolean }) => (
        <div className={mobile ? '' : 'hidden lg:block'}>
            {/* Collections */}
            <div className="mb-8">
                <h3 className="font-serif text-lg text-foreground mb-5">Collections</h3>
                <div className="space-y-2">
                    {['All', ...collections.map((c) => c.name)].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setActiveCollection(cat); if (mobile) setShowMobileFilter(false); }}
                            className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${activeCollection === cat ? 'bg-foreground text-white font-medium' : 'text-muted hover:bg-secondary hover:text-foreground'}`}
                        >
                            {cat}
                            <span className="float-right text-xs opacity-50">
                                {cat === 'All' ? products.length : products.filter((p) => p.collection_name === cat).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="mb-8 pt-6 border-t border-gray-200">
                <h3 className="font-serif text-lg text-foreground mb-5">Filter By</h3>
                <div className="space-y-2">
                    {TAG_FILTERS.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => { setActiveTag(tag); if (mobile) setShowMobileFilter(false); }}
                            className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${activeTag === tag ? 'bg-primary text-white font-medium' : 'text-muted hover:bg-secondary hover:text-foreground'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
                <h3 className="font-serif text-lg text-foreground mb-3">Delivery</h3>
                <p className="text-sm text-muted font-light leading-relaxed">Same-day delivery for orders placed before 5 PM within our 10 km radius.</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="pt-28 pb-20 min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <SectionHeader label="Browse" title="Our Collection" subtitle="Find the perfect gift — thoughtfully curated for every occasion." />
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-8 mt-10">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-20 min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader label="Browse" title="Our Collection" subtitle="Find the perfect gift — thoughtfully curated for every occasion." />

                {/* Search + Mobile Filter Toggle */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="relative flex-grow max-w-md">
                        <input
                            type="text"
                            placeholder="Search gifts, roses, bouquets, occasions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm bg-white transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <button onClick={() => setShowMobileFilter(true)} className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-full text-sm text-muted hover:border-primary transition-colors">
                        <SlidersHorizontal size={16} /> Filter
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-56 flex-shrink-0">
                        <FilterSidebar />
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-grow w-full">
                        {(activeCollection !== 'All' || activeTag !== 'All' || searchQuery) && (
                            <div className="mb-6 flex flex-wrap items-center gap-2">
                                {activeCollection !== 'All' && (
                                    <span className="inline-flex items-center gap-1.5 bg-foreground text-white text-xs uppercase tracking-wider font-medium px-3 py-1.5 rounded-full">
                                        {activeCollection}
                                        <button onClick={() => setActiveCollection('All')} className="hover:opacity-70"><X size={12} /></button>
                                    </span>
                                )}
                                {activeTag !== 'All' && (
                                    <span className="inline-flex items-center gap-1.5 bg-primary text-white text-xs uppercase tracking-wider font-medium px-3 py-1.5 rounded-full">
                                        {activeTag}
                                        <button onClick={() => setActiveTag('All')} className="hover:opacity-70"><X size={12} /></button>
                                    </span>
                                )}
                                {searchQuery && (
                                    <span className="inline-flex items-center gap-1.5 bg-secondary text-foreground text-xs uppercase tracking-wider font-medium px-3 py-1.5 rounded-full">
                                        &ldquo;{searchQuery}&rdquo;
                                        <button onClick={() => setSearchQuery('')} className="hover:opacity-70"><X size={12} /></button>
                                    </span>
                                )}
                                <span className="text-xs text-muted">{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-8">
                            <AnimatePresence mode="wait">
                                {filteredProducts.map((product, idx) => (
                                    <ProductCard key={product.id} product={product as unknown as { id: string; name: string; image_url: string; slug: string; stock: number; image_scale?: number; tag?: string }} index={idx} />
                                ))}
                            </AnimatePresence>
                        </div>

                        {filteredProducts.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={28} className="text-muted" />
                                </div>
                                <h3 className="font-serif text-xl text-foreground mb-2">No gifts found</h3>
                                <p className="text-muted text-sm font-light">Try a different search or explore all collections.</p>
                                <button onClick={() => { setSearchQuery(''); setActiveCollection('All'); setActiveTag('All'); }} className="mt-6 text-primary text-sm font-medium hover:underline">
                                    View All Products
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {showMobileFilter && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileFilter(false)} className="fixed inset-0 bg-black/30 z-50 lg:hidden" />
                        <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 p-8 shadow-luxury lg:hidden overflow-y-auto">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="font-serif text-xl">Filter</h2>
                                <button onClick={() => setShowMobileFilter(false)}><X size={22} /></button>
                            </div>
                            <FilterSidebar mobile />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <WhatsAppFloat />
        </div>
    );
}

export default function Shop() {
    return (
        <Suspense fallback={<div className="pt-28 pb-20 min-h-screen bg-background flex items-center justify-center"><p className="text-muted">Loading...</p></div>}>
            <ShopContent />
        </Suspense>
    );
}
