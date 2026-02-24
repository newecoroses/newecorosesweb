'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import { fetchWhatsappSettings } from '@/lib/supabase';

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
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    // Extract an array of all images, deduplicated, starting with the main image
    const allImages = [...new Set([product.image_url, ...(product.images || [])])]
        .filter(Boolean)
        .filter(img => !img.startsWith('HIDDEN::'));
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const productUrl = `${origin}/product/${product.slug}`;

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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            viewport={{ once: true, margin: '-30px' }}
            className="group flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-[#faf7f2] mb-2.5 sm:mb-4 shadow-sm group-hover:shadow-card transition-shadow duration-500">
                {/* Tag badge */}
                {tagBadge && product.tag && (
                    <span className={`absolute top-2 left-2 z-10 text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${tagBadge}`}>
                        {product.tag === 'Best Seller' ? '🔥 Best Seller' : product.tag}
                    </span>
                )}
                <Link
                    href={`/product/${product.slug}`}
                    className="block w-full h-full relative"
                    onMouseEnter={() => {
                        if (allImages.length > 1) {
                            setCurrentImageIdx(1);
                        }
                    }}
                    onMouseLeave={() => setCurrentImageIdx(0)}
                    onMouseMove={(e) => {
                        if (allImages.length > 1) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const percentage = x / rect.width;
                            const idx = Math.min(Math.floor(percentage * allImages.length), allImages.length - 1);
                            setCurrentImageIdx(Math.max(0, idx));
                        }
                    }}
                >
                    {allImages.map((img, idx) => (
                        <Image
                            key={idx}
                            src={img}
                            alt={`${product.name} - view ${idx + 1}`}
                            fill
                            className={`object-cover transition-all duration-700 ease-out absolute inset-0 group-hover:scale-105 ${currentImageIdx === idx ? 'opacity-100' : 'opacity-0'}`}
                            style={product.image_scale && product.image_scale !== 1 ? { transform: `scale(${product.image_scale})` } : undefined}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ))}

                    {/* Image indicator dots */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {allImages.map((_, idx) => (
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

                <div className="mt-auto">
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-[#5c6e4f] text-white py-2.5 sm:py-3 rounded-lg md:rounded-xl text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.15em] font-semibold hover:bg-[#4a5a3f] transition-all duration-300 shadow-sm hover:shadow-md group-hover:bg-[#25D366] group-hover:shadow-[#25D366]/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <WhatsappIcon size={15} className="opacity-90" />
                        Enquire Now
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
