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
    const [whatsappPhone, setWhatsappPhone] = useState(FALLBACK_PHONE);
    const { addItem, getItemQuantity } = useCart();
    const cartQuantity = getItemQuantity(product.id);

    useEffect(() => {
        fetchWhatsappSettings()
            .then((s) => {
                if (s?.phone_number) {
                    setWhatsappPhone(s.phone_number.replace(/\D/g, ''));
                }
            })
            .catch(() => {});
    }, []);

    const whatsappMsg = `Hi, I'm interested in ${product.name}. Is it available for delivery today?\n\nProduct: https://www.newecoroses.com/product/${product.slug}`;
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMsg)}`;

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

                {/* Aesthetic Action Bar: Add to Cart (Left) + WhatsApp Enquire (Right) */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 mt-1.5">
                    {/* Add to Cart Button (LEFT) */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all duration-300 text-[11px] font-semibold flex-shrink-0 cursor-pointer border active:scale-95 ${
                            justAdded
                                ? 'bg-emerald-600 text-white border-emerald-600 scale-105 shadow-sm'
                                : cartQuantity > 0
                                ? 'bg-white text-[#1c1917] border-gray-200 hover:border-[#bfa81f] hover:bg-gray-50 shadow-xs'
                                : 'bg-white text-[#1c1917] border-gray-200 hover:border-[#bfa81f] hover:bg-gray-50 shadow-xs'
                        }`}
                        title={cartQuantity > 0 ? `${cartQuantity} in Cart • Click to add more` : 'Add to Cart'}
                        aria-label="Add to Cart"
                    >
                        {justAdded ? (
                            <>
                                <Check size={13} className="stroke-[3]" />
                                <span>Added</span>
                            </>
                        ) : (
                            <>
                                <Plus size={13} className="stroke-[2.5] text-[#bfa81f]" />
                                <span>{cartQuantity > 0 ? `Cart (${cartQuantity})` : 'Cart'}</span>
                            </>
                        )}
                    </button>

                    {/* WhatsApp Enquire Button (RIGHT) */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                            e.stopPropagation();
                            trackEnquiry(product.name, 'card_whatsapp');
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-[#bfa81f] hover:bg-[#a89216] text-white border border-[#a89216] transition-all duration-300 text-[11px] font-semibold active:scale-95 group/wa shadow-2xs"
                        title="Enquire on WhatsApp"
                        aria-label="Enquire on WhatsApp"
                    >
                        <svg className="w-3.5 h-3.5 fill-white group-hover/wa:scale-110 transition-transform flex-shrink-0" viewBox="0 0 24 24">
                            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.763.459 3.485 1.332 5.001L2 22l5.127-1.343c1.465.799 3.116 1.22 4.881 1.22.004 0 .007 0 .011 0 5.504 0 9.988-4.478 9.989-9.985 0-2.668-1.039-5.176-2.927-7.062A9.923 9.923 0 0 0 12.012 2zm5.66 14.195c-.237.667-1.376 1.272-1.9 1.346-.494.07-1.134.1-3.32-.806-2.797-1.159-4.597-4.004-4.737-4.191-.14-.187-1.136-1.514-1.136-2.887 0-1.373.719-2.05.976-2.332.257-.282.561-.353.748-.353.187 0 .374.002.537.01.173.008.406-.065.635.485.237.569.807 1.97.877 2.112.07.141.117.306.023.493-.094.187-.14.305-.281.47-.14.165-.295.369-.422.496-.14.141-.286.295-.123.575.163.28 0.725 1.196 1.558 1.938 1.07.953 1.973 1.25 2.253 1.39.28.14.444.117.608-.07.163-.187.699-.817.886-1.097.187-.28.374-.235.631-.14.257.094 1.636.77 1.916.91.28.14.468.211.538.328.07.117.07.678-.167 1.345z" />
                        </svg>
                        <span className="truncate">Enquire</span>
                    </a>
                </div>
            </div>
        </motion.div>
    );
}

