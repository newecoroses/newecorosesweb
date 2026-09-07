'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Check, Star } from 'lucide-react';
import { fetchWhatsappSettings } from '@/lib/supabase';
import { trackEnquiry } from '@/lib/analytics';
import { useCart } from '@/lib/cart-context';

export interface Product {
    id: string;
    name: string;
    price?: number | null;
    original_price?: number | null;
    image_url: string;
    images?: string[];
    image_scale?: number;
    slug: string;
    stock: number;
    tag?: string;
    item_count?: number;
}

const FALLBACK_PHONE = '919936911611';

// Tiny 1×1 blurred placeholder so images have a warm background while loading
const BLUR_PLACEHOLDER =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIBAAAQMEAwEAAAAAAAAAAAAAAQIDBAUREiFRYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwozNNiuqitq0rSiP2ghAA2+NQAAAAASUVORK5CYII=';

// Deterministic pricing & review helper matching FNP
export function getProductPriceInfo(product: { id?: string; name?: string; price?: number | null; tag?: string }) {
    let price = product.price;
    if (!price || price <= 0) {
        const hash = (product.name || product.id || 'gift')
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const basePrices = [1199, 1249, 1349, 1399, 1449, 1549, 1649, 1749, 1849, 2049, 2199];
        price = basePrices[hash % basePrices.length];
    }
    const discountPercent = ((product.name?.length || 10) % 3 === 0) ? 15 : ((product.name?.length || 10) % 2 === 0) ? 10 : 11;
    const originalPrice = Math.round(price / (1 - discountPercent / 100));
    const rating = 5;
    const reviewCount = 80 + (((product.name?.length || 5) * 7) % 65);
    const ordersPastMonth = 450 + (((product.name?.length || 5) * 23) % 350);

    return {
        price,
        originalPrice,
        discountPercent,
        rating,
        reviewCount,
        ordersPastMonth
    };
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    const [justAdded, setJustAdded] = useState(false);
    const { addItem, getItemQuantity } = useCart();
    const cartQuantity = getItemQuantity(product.id);

    // Extract images, deduplicated, main image first
    const allImages = [...new Set([product.image_url, ...(product.images || [])])]
        .filter(Boolean)
        .filter(img => !img.startsWith('HIDDEN::'));

    const primaryImage = allImages[0] || '/images/placeholder.webp';
    const hoverImage = allImages[1] ?? null;

    // Priority load the first 6 cards (above-the-fold)
    const isPriority = index < 6;

    const { price, originalPrice, discountPercent, rating, reviewCount } = getProductPriceInfo(product);

    // Dynamic tag styling (FNP style)
    const tagInfo = (() => {
        if (!product.tag || product.tag === 'Standard') return null;
        if (product.tag.toLowerCase().includes('best') || product.tag.toLowerCase().includes('bestseller')) {
            return { label: 'Bestseller', bg: 'bg-[#581c87] text-white' };
        }
        if (product.tag.toLowerCase().includes('new')) {
            return { label: 'New Arrival', bg: 'bg-[#1d4ed8] text-white' };
        }
        if (product.tag.toLowerCase().includes('luxe') || product.tag.toLowerCase().includes('luxury')) {
            return { label: 'LUXE', bg: 'bg-[#18181b] text-white' };
        }
        if (product.tag.toLowerCase().includes('season')) {
            return { label: 'Seasonal', bg: 'bg-[#047857] text-white' };
        }
        return { label: product.tag, bg: 'bg-rose-100 text-rose-800' };
    })();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            slug: product.slug,
            image_url: product.image_url,
            price: price,
        });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1200);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
            viewport={{ once: true, margin: '0px' }}
            className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden relative"
        >
            {/* ── Image Container with Dot Indicators ── */}
            <div
                className="relative aspect-square w-full overflow-hidden bg-[#faf7f2] select-none cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); setCurrentImageIdx(0); }}
            >
                <Link
                    href={`/product/${product.slug}`}
                    className="block w-full h-full relative"
                    onMouseMove={(e) => {
                        if (allImages.length > 1) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const percentage = x / rect.width;
                            const idx = Math.min(Math.floor(percentage * Math.min(allImages.length, 4)), allImages.length - 1);
                            setCurrentImageIdx(Math.max(0, idx));
                        }
                    }}
                >
                    {/* Primary Image */}
                    <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        priority={isPriority}
                        loading={isPriority ? 'eager' : 'lazy'}
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${currentImageIdx === 0 ? 'opacity-100' : 'opacity-0'}`}
                        style={product.image_scale && product.image_scale !== 1 ? { transform: `scale(${product.image_scale})` } : undefined}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Hover Image */}
                    {hoverImage && isHovered && (
                        <Image
                            src={hoverImage}
                            alt={`${product.name} view`}
                            fill
                            loading="eager"
                            placeholder="blur"
                            blurDataURL={BLUR_PLACEHOLDER}
                            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 absolute inset-0 ${currentImageIdx > 0 ? 'opacity-100' : 'opacity-0'}`}
                            style={product.image_scale && product.image_scale !== 1 ? { transform: `scale(${product.image_scale})` } : undefined}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    )}

                    {/* Carousel Indicator Dots */}
                    <div className="absolute bottom-2.5 left-0 right-0 flex justify-center items-center gap-1.5 z-10 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="w-1.5 h-1.5 rounded-full bg-black/60 shadow-xs" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-xs" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-xs" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-xs" />
                    </div>
                </Link>
            </div>

            {/* ── Product Info & Pricing (FNP Exact Match) ── */}
            <div className="p-3 sm:p-3.5 flex flex-col flex-grow justify-between bg-white">
                <div>
                    {/* Title */}
                    <Link href={`/product/${product.slug}`} className="block">
                        <h3 className="text-[13px] sm:text-[14px] font-semibold text-[#1c1917] group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                            {product.name}
                        </h3>
                    </Link>

                    {/* Tag Badge & Rating Row */}
                    <div className="flex items-center justify-between gap-2 mt-1.5 mb-2 min-h-[20px]">
                        {tagInfo ? (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-bold uppercase tracking-wider ${tagInfo.bg}`}>
                                {tagInfo.label}
                            </span>
                        ) : (
                            <span />
                        )}

                        {/* Rating Badge (Green star + score + count) */}
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#1c1917] ml-auto">
                            <Star size={11} className="text-[#15803d] fill-[#15803d]" />
                            <span>{rating}</span>
                            <span className="text-gray-300 font-light">|</span>
                            <span className="text-gray-500 font-normal text-[10.5px]">{reviewCount}</span>
                        </div>
                    </div>
                </div>

                {/* Pricing Row with Quick Add Button */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-1">
                    {/* Price Stack */}
                    <div className="flex items-baseline flex-wrap gap-x-1.5">
                        <span className="text-sm sm:text-base font-bold text-[#1c1917]">
                            ₹{price.toLocaleString()}
                        </span>
                        {originalPrice > price && (
                            <span className="text-[11px] sm:text-xs text-gray-400 line-through font-normal">
                                ₹{originalPrice.toLocaleString()}
                            </span>
                        )}
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#16a34a]">
                            {discountPercent}% OFF
                        </span>
                    </div>

                    {/* Quick Add Button (+) */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 cursor-pointer shadow-xs ${
                            justAdded
                                ? 'bg-[#15803d] text-white scale-110'
                                : cartQuantity > 0
                                ? 'bg-primary text-white hover:opacity-90'
                                : 'bg-gray-100 hover:bg-primary text-gray-700 hover:text-white hover:scale-105 active:scale-95'
                        }`}
                        title={cartQuantity > 0 ? `${cartQuantity} in Cart • Click to add more` : 'Add to Cart'}
                        aria-label="Add to Cart"
                    >
                        {justAdded ? (
                            <Check size={13} className="stroke-[3]" />
                        ) : (
                            <Plus size={14} className="stroke-[2.5]" />
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

