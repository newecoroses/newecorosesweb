'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
    fetchCollections, fetchProducts,
    DBCollection, DBProduct
} from '@/lib/supabase';

/* ─── Types ─── */
interface MegaMenuData {
    collections: DBCollection[];
    products: DBProduct[];
}

/* ─── Tag generators from product metadata ─── */
function generateTags(products: DBProduct[]): { label: string; link: string }[] {
    const tags: { label: string; link: string }[] = [];

    // Best Sellers
    if (products.some(p => p.tag === 'Best Seller')) {
        tags.push({ label: 'Best Sellers', link: '/shop?tag=best+seller' });
    }
    // New Arrivals
    if (products.some(p => p.tag === 'New Arrival')) {
        tags.push({ label: 'New Arrivals', link: '/shop?tag=new+arrival' });
    }
    // Seasonal
    if (products.some(p => p.tag === 'Seasonal')) {
        tags.push({ label: 'Seasonal Picks', link: '/shop?tag=seasonal' });
    }
    // Featured
    if (products.some(p => p.is_featured)) {
        tags.push({ label: 'Featured', link: '/shop?featured=true' });
    }

    // Dynamic celebrations-based tags  
    const allCelebrations = new Set<string>();
    products.forEach(p => (p.celebrations ?? []).forEach(c => allCelebrations.add(c)));
    const topCelebrations = Array.from(allCelebrations).slice(0, 4);
    topCelebrations.forEach(c => {
        tags.push({ label: c, link: `/shop?celebration=${encodeURIComponent(c.toLowerCase())}` });
    });

    return tags.slice(0, 8);
}

/* ─── Desktop Mega Dropdown Panel ─── */
function MegaDropdownPanel({
    collection,
    allProducts,
    onClose,
}: {
    collection: DBCollection;
    allProducts: DBProduct[];
    onClose: () => void;
}) {
    const productsInCollection = allProducts.filter(
        p => p.collection_slug === collection.slug && p.is_visible
    );
    const featuredProducts = productsInCollection.slice(0, 6);
    const tags = generateTags(productsInCollection);

    // Find related subcollections (other collections as "related")
    const hasProducts = featuredProducts.length > 0;
    const hasTags = tags.length > 0;
    const hasBanner = !!collection.image_url;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute top-full left-0 w-full bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-b-2xl border-t border-[#f0ece4] z-50"
            onMouseLeave={onClose}
        >
            <div className="max-w-7xl mx-auto px-8 py-8">
                <div className="flex gap-8">
                    {/* Column 1 — Collection Details & Browse */}
                    <div className="flex-shrink-0 w-[200px]">
                        <h3 className="font-serif text-base text-[#3a3226] font-semibold mb-4 pb-2 border-b border-[#ede4d6]">
                            {collection.name}
                        </h3>
                        {collection.description && (
                            <p className="text-xs text-[#8a7a5a] leading-relaxed mb-4 font-light">
                                {collection.description}
                            </p>
                        )}
                        <Link
                            href={`/shop?cat=${collection.slug}`}
                            className="mega-link inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] font-semibold text-[#5c6e4f] hover:text-[#3a3226] transition-colors"
                            onClick={onClose}
                        >
                            View All <ChevronRight size={12} />
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-[#ede4d6] flex-shrink-0" />

                    {/* Column 2 — Featured Products (Text Only) */}
                    {hasProducts && (
                        <div className="flex-[2] min-w-[250px]">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8a7a5a] mb-4">
                                Popular Picks
                            </h4>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                {featuredProducts.map(product => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        className="group flex flex-col"
                                        onClick={onClose}
                                    >
                                        <p className="text-sm font-medium text-[#3a3226] group-hover:text-[#5c6e4f] transition-colors line-clamp-2">
                                            {product.name}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    {hasProducts && hasTags && (
                        <div className="w-px bg-[#ede4d6] flex-shrink-0" />
                    )}

                    {/* Column 3 — Tags / Filtered Collections */}
                    {hasTags && (
                        <div className="flex-shrink-0 w-[180px]">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8a7a5a] mb-4">
                                Quick Filters
                            </h4>
                            <ul className="space-y-2.5">
                                {tags.map((tag, idx) => (
                                    <li key={idx}>
                                        <Link
                                            href={tag.link}
                                            className="mega-link text-sm text-[#3a3226] hover:text-[#5c6e4f] transition-colors font-light"
                                            onClick={onClose}
                                        >
                                            {tag.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Divider */}
                    {hasBanner && (
                        <div className="w-px bg-[#ede4d6] flex-shrink-0" />
                    )}

                    {/* Right Side — Featured Banner */}
                    {hasBanner && (
                        <div className="flex-shrink-0 w-[220px]">
                            <Link
                                href={`/shop?cat=${collection.slug}`}
                                className="group block relative aspect-[3/4] rounded-2xl overflow-hidden"
                                onClick={onClose}
                            >
                                <Image
                                    src={collection.image_url}
                                    alt={collection.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    sizes="220px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-4">
                                    <p className="text-white font-serif text-sm">
                                        Explore {collection.name}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Empty state */}
                {!hasProducts && !hasTags && !hasBanner && (
                    <div className="text-center py-8">
                        <p className="text-sm text-[#8a7a5a] font-light">
                            Explore our <span className="font-medium">{collection.name}</span> collection
                        </p>
                        <Link
                            href={`/shop?cat=${collection.slug}`}
                            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] font-semibold text-[#5c6e4f] hover:text-[#3a3226] transition-colors mt-3"
                            onClick={onClose}
                        >
                            Browse Now <ChevronRight size={12} />
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/* ─── Mobile Accordion Item ─── */
function MobileAccordion({
    collection,
    allProducts,
    isOpen,
    onToggle,
    onClose,
}: {
    collection: DBCollection;
    allProducts: DBProduct[];
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
}) {
    const productsInCollection = allProducts
        .filter(p => p.collection_slug === collection.slug && p.is_visible)
        .slice(0, 4);
    const tags = generateTags(
        allProducts.filter(p => p.collection_slug === collection.slug)
    );

    return (
        <div className="border-b border-[#f0ece4]">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-4 px-2 text-left"
                aria-expanded={isOpen}
            >
                <span className="font-serif text-lg text-[#3a3226]">{collection.name}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <ChevronDown size={18} className="text-[#8a7a5a]" />
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4 px-2 space-y-3">
                            {/* Browse all link */}
                            <Link
                                href={`/shop?cat=${collection.slug}`}
                                className="block text-sm text-[#5c6e4f] font-semibold uppercase tracking-wider"
                                onClick={onClose}
                            >
                                View All →
                            </Link>

                            {/* Products */}
                            {productsInCollection.length > 0 && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a7a5a] font-semibold mb-2">
                                        Popular
                                    </p>
                                    <div className="space-y-1.5">
                                        {productsInCollection.map(p => (
                                            <Link
                                                key={p.id}
                                                href={`/product/${p.slug}`}
                                                className="block text-sm text-[#3a3226] hover:text-[#5c6e4f] transition-colors pl-3 border-l-2 border-[#ede4d6]"
                                                onClick={onClose}
                                            >
                                                {p.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {tags.length > 0 && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a7a5a] font-semibold mb-2">
                                        Quick Filters
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.slice(0, 4).map((tag, idx) => (
                                            <Link
                                                key={idx}
                                                href={tag.link}
                                                className="text-xs bg-[#faf7f2] text-[#3a3226] px-3 py-1.5 rounded-full border border-[#ede4d6] hover:border-[#5c6e4f] transition-colors"
                                                onClick={onClose}
                                            >
                                                {tag.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─── Main MegaMenu Component ─── */
export default function MegaMenu({
    onMobileClose,
    isMobile = false,
}: {
    onMobileClose?: () => void;
    isMobile?: boolean;
}) {
    const [data, setData] = useState<MegaMenuData>({ collections: [], products: [] });
    const [activeCollection, setActiveCollection] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState<string | null>(null);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Fetch data from API
    useEffect(() => {
        Promise.all([fetchCollections(), fetchProducts()])
            .then(([cols, prods]) => {
                setData({ collections: cols, products: prods });
            })
            .catch(() => { });
    }, []);

    // Desktop hover handlers with debounce to prevent flicker
    const handleMouseEnter = useCallback((slug: string) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setActiveCollection(slug);
    }, []);

    const handleMouseLeave = useCallback(() => {
        hoverTimeout.current = setTimeout(() => {
            setActiveCollection(null);
        }, 150);
    }, []);

    const handleDropdownEnter = useCallback(() => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    }, []);

    const closeMenu = useCallback(() => {
        setActiveCollection(null);
    }, []);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent, slug: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActiveCollection(prev => prev === slug ? null : slug);
        }
        if (e.key === 'Escape') {
            setActiveCollection(null);
        }
    }, []);

    if (data.collections.length === 0) return null;

    /* ─── Mobile Accordion Layout ─── */
    if (isMobile) {
        return (
            <div className="mt-6 border-t border-[#f0ece4]">
                <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8a7a5a] mt-4 mb-2 px-2">
                    Collections
                </p>
                {data.collections.map(col => (
                    <MobileAccordion
                        key={col.id}
                        collection={col}
                        allProducts={data.products}
                        isOpen={mobileOpen === col.slug}
                        onToggle={() => setMobileOpen(prev => prev === col.slug ? null : col.slug)}
                        onClose={() => onMobileClose?.()}
                    />
                ))}
            </div>
        );
    }

    /* ─── Desktop Mega Menu ─── */
    const activeColl = data.collections.find(c => c.slug === activeCollection);

    return (
        <div ref={menuRef} className="relative">
            {/* Category Navigation Bar */}
            <div
                className="flex items-center gap-0.5 bg-white/95 backdrop-blur-sm rounded-xl px-1 py-1 border border-[#f0ece4]/60"
                role="menubar"
                aria-label="Product categories"
            >
                {data.collections.map(col => (
                    <div
                        key={col.id}
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(col.slug)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link
                            href={`/shop?cat=${col.slug}`}
                            className={`mega-nav-link inline-flex items-center gap-1 text-[0.7rem] uppercase tracking-[0.12em] font-medium px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${activeCollection === col.slug
                                ? 'text-[#3a3226] bg-[#faf7f2]'
                                : 'text-[#8a7a5a] hover:text-[#3a3226]'
                                }`}
                            role="menuitem"
                            aria-haspopup="true"
                            aria-expanded={activeCollection === col.slug}
                            onKeyDown={(e) => handleKeyDown(e, col.slug)}
                            tabIndex={0}
                        >
                            {col.name}
                            <ChevronDown
                                size={11}
                                className={`transition-transform duration-250 ${activeCollection === col.slug ? 'rotate-180 text-[#5c6e4f]' : 'text-[#b0a48a]'}`}
                            />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Mega Dropdown Panel */}
            <AnimatePresence>
                {activeColl && (
                    <div
                        onMouseEnter={handleDropdownEnter}
                        onMouseLeave={handleMouseLeave}
                        className="fixed left-0 w-full"
                        style={{ top: 'var(--mega-menu-top, 100%)' }}
                    >
                        <MegaDropdownPanel
                            collection={activeColl}
                            allProducts={data.products}
                            onClose={closeMenu}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
