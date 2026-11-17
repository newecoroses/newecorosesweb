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

/* ─── Helper to format category display names matching reference image ─── */
function getCategoryDisplayName(name: string): string {
    const lower = name.toLowerCase().trim();
    if (lower === 'fresh flower' || lower === 'fresh flowers') return 'Flowers';
    if (lower === 'chocolate bouquet' || lower === 'chocolate bouquets') return 'Bouquets';
    if (lower === 'hamper' || lower === 'hampers') return 'Gift Hampers';
    if (lower === 'cake') return 'Cakes';
    if (lower === 'plants') return 'Plants';
    if (lower === 'balloon bouquet' || lower === 'balloon bouquets') return 'Balloons';
    if (lower === 'teddy and bouquet' || lower === 'teddy & bouquet') return 'Teddy Gifts';
    return name;
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

    return tags.slice(0, 6);
}

/* ─── Desktop Mega Dropdown Panel (Vertically Slim FNP Style) ─── */
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

    const hasProducts = featuredProducts.length > 0;
    const hasTags = tags.length > 0;
    const hasBanner = !!collection.image_url;

    return (
        <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute top-full left-0 w-full bg-white shadow-[0_14px_36px_rgba(0,0,0,0.08)] rounded-b-xl border-t border-black/[0.06] z-50 overflow-hidden"
            onMouseLeave={onClose}
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-3.5">
                <div className="flex items-center justify-between gap-6">
                    {/* Column 1 — Collection Details & Browse */}
                    <div className="flex-shrink-0 w-[180px]">
                        <h3 className="font-sans text-[14px] text-[#111] font-bold leading-tight">
                            {collection.name}
                        </h3>
                        {collection.description && (
                            <p className="text-[11.5px] text-[#666] leading-snug line-clamp-2 my-1 font-normal">
                                {collection.description}
                            </p>
                        )}
                        <Link
                            href={`/shop?cat=${collection.slug}`}
                            className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-[#bfa81f] hover:text-[#a89216] transition-colors mt-1"
                            onClick={onClose}
                        >
                            View All <ChevronRight size={11} />
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-20 bg-black/[0.06] flex-shrink-0" />

                    {/* Column 2 — Popular Products (Slim Grid) */}
                    {hasProducts && (
                        <div className="flex-1 min-w-[260px]">
                            <h4 className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#888] mb-1.5">
                                Popular Picks
                            </h4>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-1">
                                {featuredProducts.map(product => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        className="group flex items-center gap-1.5 py-0.5"
                                        onClick={onClose}
                                    >
                                        <span className="w-1 h-1 rounded-full bg-black/20 group-hover:bg-[#bfa81f] transition-colors flex-shrink-0" />
                                        <p className="text-[12.5px] font-medium text-[#222] group-hover:text-[#bfa81f] transition-colors truncate">
                                            {product.name}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    {hasProducts && hasTags && (
                        <div className="w-px h-20 bg-black/[0.06] flex-shrink-0" />
                    )}

                    {/* Column 3 — Tags / Filtered Collections */}
                    {hasTags && (
                        <div className="flex-shrink-0 w-[150px]">
                            <h4 className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#888] mb-1.5">
                                Quick Filters
                            </h4>
                            <ul className="space-y-1">
                                {tags.map((tag, idx) => (
                                    <li key={idx}>
                                        <Link
                                            href={tag.link}
                                            className="text-[12px] text-[#444] hover:text-[#bfa81f] transition-colors font-medium block truncate"
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
                        <div className="w-px h-20 bg-black/[0.06] flex-shrink-0" />
                    )}

                    {/* Right Side — Compact Slim Banner */}
                    {hasBanner && (
                        <div className="flex-shrink-0 w-[170px]">
                            <Link
                                href={`/shop?cat=${collection.slug}`}
                                className="group block relative h-[84px] w-full rounded-xl overflow-hidden shadow-2xs border border-black/[0.08]"
                                onClick={onClose}
                            >
                                <Image
                                    src={collection.image_url}
                                    alt={collection.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="170px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-2.5">
                                    <p className="text-white font-sans text-xs font-bold leading-tight drop-shadow-xs">
                                        Explore {collection.name}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Empty state */}
                {!hasProducts && !hasTags && !hasBanner && (
                    <div className="text-center py-4">
                        <p className="text-xs text-[#666]">
                            Explore our <span className="font-semibold text-[#111]">{collection.name}</span> collection
                        </p>
                        <Link
                            href={`/shop?cat=${collection.slug}`}
                            className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-[#bfa81f] hover:text-[#a89216] transition-colors mt-1"
                            onClick={onClose}
                        >
                            Browse Now <ChevronRight size={11} />
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
        <div className="border-b border-gray-100">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-3 px-2 text-left"
                aria-expanded={isOpen}
            >
                <span className="font-sans font-bold text-sm text-[#1c1917]">{collection.name}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} className="text-gray-400" />
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-3 px-2 space-y-2.5">
                            {/* Browse all link */}
                            <Link
                                href={`/shop?cat=${collection.slug}`}
                                className="block text-xs text-[#bfa81f] font-bold uppercase tracking-wider hover:text-[#a89216]"
                                onClick={onClose}
                            >
                                View All →
                            </Link>

                            {/* Products */}
                            {productsInCollection.length > 0 && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400 font-semibold mb-1.5">
                                        Popular
                                    </p>
                                    <div className="space-y-1">
                                        {productsInCollection.map(p => (
                                            <Link
                                                key={p.id}
                                                href={`/product/${p.slug}`}
                                                className="block text-xs text-[#1c1917] hover:text-[#bfa81f] transition-colors pl-2.5 border-l-2 border-gray-200"
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
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400 font-semibold mb-1.5">
                                        Quick Filters
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.slice(0, 4).map((tag, idx) => (
                                            <Link
                                                key={idx}
                                                href={tag.link}
                                                className="text-[11px] bg-[#faf7f2] text-[#1c1917] px-2.5 py-1 rounded-full border border-gray-200 hover:border-black transition-colors"
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
            <div className="mt-4 border-t border-gray-100">
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mt-3 mb-2 px-2">
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

    /* ─── Desktop Mega Menu (Single-Row Center Style) ─── */
    const PRIORITY_SLUG_ORDER = [
        'fresh-flower',
        'chocolate-bouquet',
        'hamper',
        'cake',
        'plants',
        'personalized',
        'decorations',
        'teddy-and-bouquet',
        'balloon-bouquet',
    ];

    const sortedCollections = [...data.collections].sort((a, b) => {
        const idxA = PRIORITY_SLUG_ORDER.indexOf(a.slug);
        const idxB = PRIORITY_SLUG_ORDER.indexOf(b.slug);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });

    const primaryCollections = sortedCollections.slice(0, 7);
    const moreCollections = sortedCollections.slice(7);

    const activeColl = data.collections.find(c => c.slug === activeCollection);

    return (
        <div ref={menuRef} className="relative flex items-center justify-center">
            {/* Category Navigation Bar — Exact Reference Design */}
            <div
                className="flex items-center justify-center gap-0.5 xl:gap-2 overflow-x-auto no-scrollbar"
                role="menubar"
                aria-label="Product categories"
            >
                {/* Primary 7 Categories (Always visible on desktop) */}
                {primaryCollections.map(col => (
                    <div
                        key={col.id}
                        className="relative flex-shrink-0"
                        onMouseEnter={() => handleMouseEnter(col.slug)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link
                            href={`/shop?cat=${col.slug}`}
                            className={`group inline-flex items-center gap-0.5 xl:gap-1 text-[12px] xl:text-[13px] font-semibold px-1.5 xl:px-2.5 py-1.5 transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                                activeCollection === col.slug
                                    ? 'text-[#bfa81f]'
                                    : 'text-[#1c1917] hover:text-[#bfa81f]'
                            }`}
                            role="menuitem"
                            aria-haspopup="true"
                            aria-expanded={activeCollection === col.slug}
                            onKeyDown={(e) => handleKeyDown(e, col.slug)}
                            tabIndex={0}
                        >
                            <span>{getCategoryDisplayName(col.name)}</span>
                            <ChevronDown
                                size={11}
                                className={`stroke-[2.2] transition-transform duration-200 ${
                                    activeCollection === col.slug
                                        ? 'rotate-180 text-[#bfa81f]'
                                        : 'text-[#1c1917]/70 group-hover:text-[#bfa81f]'
                                }`}
                            />
                        </Link>
                    </div>
                ))}

                {/* Additional Categories: Shown directly on 2xl screens */}
                {moreCollections.map(col => (
                    <div
                        key={col.id}
                        className="relative flex-shrink-0 hidden 2xl:block"
                        onMouseEnter={() => handleMouseEnter(col.slug)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link
                            href={`/shop?cat=${col.slug}`}
                            className={`group inline-flex items-center gap-1 text-[13px] font-semibold px-2 py-1.5 transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                                activeCollection === col.slug
                                    ? 'text-[#bfa81f]'
                                    : 'text-[#1c1917] hover:text-[#bfa81f]'
                            }`}
                            role="menuitem"
                            aria-haspopup="true"
                            aria-expanded={activeCollection === col.slug}
                            onKeyDown={(e) => handleKeyDown(e, col.slug)}
                            tabIndex={0}
                        >
                            <span>{getCategoryDisplayName(col.name)}</span>
                            <ChevronDown
                                size={11}
                                className={`stroke-[2.2] transition-transform duration-200 ${
                                    activeCollection === col.slug
                                        ? 'rotate-180 text-[#bfa81f]'
                                        : 'text-[#1c1917]/70 group-hover:text-[#bfa81f]'
                                }`}
                            />
                        </Link>
                    </div>
                ))}

                {/* 'More ∨' Dropdown on screens below 2xl */}
                {moreCollections.length > 0 && (
                    <div
                        className="relative flex-shrink-0 2xl:hidden"
                        onMouseEnter={() => handleMouseEnter('__more__')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            type="button"
                            className={`group inline-flex items-center gap-0.5 xl:gap-1 text-[12px] xl:text-[13px] font-semibold px-1.5 xl:px-2.5 py-1.5 transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                                activeCollection === '__more__'
                                    ? 'text-[#bfa81f]'
                                    : 'text-[#1c1917] hover:text-[#bfa81f]'
                            }`}
                            aria-haspopup="true"
                            aria-expanded={activeCollection === '__more__'}
                        >
                            <span>More</span>
                            <ChevronDown
                                size={11}
                                className={`stroke-[2.2] transition-transform duration-200 ${
                                    activeCollection === '__more__'
                                        ? 'rotate-180 text-[#bfa81f]'
                                        : 'text-[#1c1917]/70 group-hover:text-[#bfa81f]'
                                }`}
                            />
                        </button>

                        {/* Floating More Submenu */}
                        {activeCollection === '__more__' && (
                            <div
                                className="absolute top-full right-0 mt-1 w-44 bg-white border border-black/[0.08] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                                onMouseEnter={handleDropdownEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {moreCollections.map(col => (
                                    <Link
                                        key={col.id}
                                        href={`/shop?cat=${col.slug}`}
                                        onClick={closeMenu}
                                        className="flex items-center justify-between px-3.5 py-2 text-[12.5px] font-semibold text-[#1c1917] hover:text-[#bfa81f] hover:bg-[#faf8f0] transition-colors"
                                    >
                                        <span>{getCategoryDisplayName(col.name)}</span>
                                        <ChevronRight size={13} className="text-gray-400" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mega Dropdown Panel (Vertically Slim) */}
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
