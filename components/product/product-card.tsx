'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';
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
    const { addItem, updateQuantity, getItemQuantity } = useCart();
    const cartQuantity = getItemQuantity(product.id);

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
        'Best Seller': 'bg-white/90 text-[#8c6b2d] border-[#e8d5b5]/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
        'New Arrival': 'bg-white/90 text-[#2d6a4f] border-[#b7e4c7]/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
        'Seasonal': 'bg-white/90 text-[#6d4c7d] border-[#d8c5e2]/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
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
                {/* Minimal Aesthetic Tag Badge */}
                {tagBadge && product.tag && (
                    <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10">
                        <span className={`inline-flex items-center gap-1.5 text-[8px] sm:text-[9px] font-medium tracking-[0.14em] uppercase px-2.5 py-0.5 sm:py-1 rounded-full border backdrop-blur-sm ${tagBadge}`}>
                            {product.tag === 'Best Seller' && <span className="w-1 h-1 rounded-full bg-[#8c6b2d]" />}
                            {product.tag === 'New Arrival' && <span className="w-1 h-1 rounded-full bg-[#2d6a4f]" />}
                            {product.tag === 'Seasonal' && <span className="w-1 h-1 rounded-full bg-[#6d4c7d]" />}
                            <span>{product.tag}</span>
                        </span>
                    </div>
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
                </Link>

                <div className="mb-2 sm:mb-3">
                    {stockLabel.text && (
                        <span className={`inline-block text-[9px] md:text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${stockLabel.color}`}>
                            {stockLabel.text}
                        </span>
                    )}
                </div>

                <div className="mt-auto flex gap-1.5 sm:gap-2">
                    {/* Add to Cart / Quantity Stepper Button */}
                    {cartQuantity > 0 ? (
                        <div className="flex-1 flex items-center justify-between border-2 border-primary bg-primary/5 rounded-lg md:rounded-xl px-0.5 sm:px-1 py-0.5 text-primary min-w-0">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateQuantity(product.id, cartQuantity - 1);
                                }}
                                className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-white border border-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors flex-shrink-0"
                                title="Decrease quantity"
                            >
                                <Minus size={11} />
                            </button>
                            <span className="text-[9px] min-[360px]:text-[10px] sm:text-xs font-bold px-0.5 text-primary truncate text-center flex-1">
                                <span className="hidden min-[360px]:inline">{cartQuantity} in Cart</span>
                                <span className="inline min-[360px]:hidden">{cartQuantity} Cart</span>
                            </span>
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
                                }}
                                className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-primary text-white flex items-center justify-center hover:opacity-90 transition-colors flex-shrink-0"
                                title="Increase quantity"
                            >
                                <Plus size={11} />
                            </button>
                        </div>
                    ) : (
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
                            }}
                            className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 rounded-lg md:rounded-xl text-[9px] sm:text-xs uppercase tracking-wider font-semibold transition-all duration-300 border bg-white border-primary/40 text-primary hover:bg-primary/10 hover:border-primary"
                            title="Add to Cart"
                        >
                            <ShoppingCart size={13} />
                            <span className="hidden min-[380px]:inline">Add to Cart</span>
                            <span className="inline min-[380px]:hidden">Add</span>
                        </button>
                    )}

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
