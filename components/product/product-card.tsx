'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import { fetchWhatsappSettings } from '@/lib/supabase';
import { trackEnquiry } from '@/lib/analytics';
import { useCart } from '@/lib/cart-context';

interface Product {
    id: string;
    name: string;
    price?: number;
    original_price?: number;
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

// Singleton cache so we only fetch once per page load
let cachedPhone: string | null = null;
let fetchPromise: Promise<string> | null = null;

function getWhatsappPhone(): Promise<string> {
    if (cachedPhone) return Promise.resolve(cachedPhone);
    if (!fetchPromise) {
        fetchPromise = fetchWhatsappSettings()
            .then(s => {
                cachedPhone = s?.phone_number ?? FALLBACK_PHONE;
                return cachedPhone;
            })
            .catch(() => {
                cachedPhone = FALLBACK_PHONE;
                return cachedPhone;
            });
    }
    return fetchPromise;
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
    const [whatsappLink, setWhatsappLink] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addItem } = useCart();

    // Extract images, deduplicated, main image first
    const allImages = [...new Set([product.image_url, ...(product.images || [])])]
        .filter(Boolean)
        .filter(img => !img.startsWith('HIDDEN::'));

    // Only the primary image + the first hover image — don't preload all variants
    const primaryImage = allImages[0];
    const hoverImage = allImages[1] ?? null;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const productUrl = `${origin}/product/${product.slug}`;

    // Priority load the first 6 cards (above-the-fold)
    const isPriority = index < 6;

    useEffect(() => {
        getWhatsappPhone().then(phone => {
            const message = `Hi, I'm interested in ${product.name}. Is it available for delivery today? Reference: ${productUrl}`;
            setWhatsappLink(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
        });
    }, [product.name, product.slug, productUrl]);

    const stockLabel =
        product.stock === 0
            ? { text: 'Sold Out', color: 'bg-red-50 text-red-600 border border-red-100' }
            : product.stock <= 5
                ? { text: `Only ${product.stock} left`, color: 'bg-amber-50 text-amber-700 border border-amber-100' }
                : { text: null, color: null };

    const tagBadge = product.tag && product.tag !== 'Standard' ? {
        'Best Seller': 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm',
        'New Arrival': 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm',
        'Seasonal': 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-sm',
    }[product.tag] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
            viewport={{ once: true, margin: '0px' }}
            className="group flex flex-col h-full"
        >
            {/* Image Container */}
            <div
                className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-[#faf7f2] mb-2.5 sm:mb-4 shadow-sm group-hover:shadow-card transition-shadow duration-500"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); setCurrentImageIdx(0); }}
            >
                {/* Tag badge */}
                {tagBadge && product.tag && (
                    <span className={`absolute top-2 left-2 z-10 text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${tagBadge}`}>
                        {product.tag === 'Best Seller' ? '🔥 Best Seller' : product.tag}
                    </span>
                )}
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
                    {/* Primary image — always rendered, loads eagerly for first 6 */}
                    <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        priority={isPriority}
                        loading={isPriority ? 'eager' : 'lazy'}
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                        className={`object-cover transition-all duration-500 ease-out absolute inset-0 group-hover:scale-105 ${currentImageIdx === 0 ? 'opacity-100' : 'opacity-0'}`}
                        style={product.image_scale && product.image_scale !== 1 ? { transform: `scale(${product.image_scale})` } : undefined}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Hover image — only rendered after first hover, preventing wasted requests */}
                    {hoverImage && isHovered && (
                        <Image
                            src={hoverImage}
                            alt={`${product.name} - alternate view`}
                            fill
                            loading="eager"
                            placeholder="blur"
                            blurDataURL={BLUR_PLACEHOLDER}
                            className={`object-cover transition-all duration-500 ease-out absolute inset-0 group-hover:scale-105 ${currentImageIdx > 0 ? 'opacity-100' : 'opacity-0'}`}
                            style={product.image_scale && product.image_scale !== 1 ? { transform: `scale(${product.image_scale})` } : undefined}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    )}

                    {/* Image indicator dots */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {allImages.slice(0, 4).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1 rounded-full transition-all duration-300 ${currentImageIdx === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                                />
                            ))}
                        </div>
                    )}
                </Link>
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-grow px-0.5 sm:px-1">
                <Link href={`/product/${product.slug}`} className="mb-1.5 sm:mb-2">
                    <h3 className="text-xs sm:text-sm font-medium text-[#3a3226] group-hover:text-[#5c6e4f] transition-colors duration-300 line-clamp-2 leading-tight tracking-wide">
                        {product.name}
                    </h3>
                    {product.item_count && product.item_count > 0 && (
                        <p className="text-[#8a7a5a] text-[10px] font-medium mt-1 uppercase tracking-wider">
                            Count: {product.item_count}
                        </p>
                    )}
                </Link>

                <div className="mb-2 sm:mb-3">
                    {stockLabel.text && (
                        <span className={`inline-block text-[9px] md:text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${stockLabel.color}`}>
                            {stockLabel.text}
                        </span>
                    )}
                </div>

                <div className="mt-auto flex gap-1.5 sm:gap-2">
                    {/* Add to Cart button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem({
                                id: product.id,
                                name: product.name,
                                slug: product.slug,
                                image_url: product.image_url,
                                price: product.price ?? null,
                            });
                            setAddedToCart(true);
                            setTimeout(() => setAddedToCart(false), 1800);
                        }}
                        className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 rounded-lg md:rounded-xl text-[9px] sm:text-xs uppercase tracking-wider font-semibold transition-all duration-300 border ${
                            addedToCart
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                                : 'bg-white border-primary/40 text-primary hover:bg-primary/10 hover:border-primary'
                        }`}
                        title="Add to Cart"
                    >
                        {addedToCart ? (
                            <>
                                <Check size={13} />
                                <span>Added</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={13} />
                                <span className="hidden min-[380px]:inline">Add to Cart</span>
                                <span className="inline min-[380px]:hidden">Add</span>
                            </>
                        )}
                    </button>

                    {/* Enquire Now button */}
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 bg-primary text-white py-2 sm:py-2.5 rounded-lg md:rounded-xl text-[9px] sm:text-xs uppercase tracking-wider font-semibold hover:opacity-90 hover:scale-[1.01] transition-all duration-300"
                        onClick={(e) => {
                            e.stopPropagation();
                            trackEnquiry(product.id, product.name);
                        }}
                        title="Enquire via WhatsApp"
                    >
                        <WhatsappIcon size={13} className="opacity-90 flex-shrink-0" />
                        <span>Enquire</span>
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
