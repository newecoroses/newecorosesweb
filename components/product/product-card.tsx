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
    image_scale?: number;
    slug: string;
    stock: number;
    tag?: string;
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

    useEffect(() => {
        const origin = window.location.origin;
        const productUrl = `${origin}/product/${product.slug}`;

        getWhatsappPhone().then(phone => {
            const message = `Hi, I'm interested in ${product.name}. Is it available for delivery today? Reference: ${productUrl}`;
            setWhatsappLink(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
        });
    }, [product.name, product.slug]);

    const stockLabel =
        product.stock === 0
            ? { text: 'Sold Out', color: 'bg-charcoal text-white' }
            : product.stock <= 5
                ? { text: `Only ${product.stock} left`, color: 'bg-red-50 text-red-600' }
                : { text: null, color: null };

    const tagBadge = product.tag && product.tag !== 'Standard' ? {
        'Best Seller': 'bg-yellow-100 text-yellow-700',
        'New Arrival': 'bg-blue-100 text-blue-700',
        'Seasonal': 'bg-green-100 text-green-700',
    }[product.tag] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            viewport={{ once: true, margin: '-30px' }}
            className="group card-lift flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary mb-4">
                {/* Tag badge */}
                {tagBadge && product.tag && (
                    <span className={`absolute top-2 left-2 z-10 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${tagBadge}`}>
                        {product.tag}
                    </span>
                )}
                <Link href={`/product/${product.slug}`} className="block w-full h-full">
                    <Image
                        src={product.image_url || 'https://images.unsplash.com/photo-1596541671913-904e20790409'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        style={product.image_scale && product.image_scale !== 1 ? { transform: `scale(${product.image_scale})` } : undefined}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                </Link>
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-grow px-1">
                <Link href={`/product/${product.slug}`} className="mb-2">
                    <h3 className="text-[1rem] font-serif text-foreground group-hover:text-primary transition-colors duration-300 truncate tracking-wide">
                        {product.name}
                    </h3>
                </Link>

                <div className="mb-4">
                    {stockLabel.text && (
                        <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${stockLabel.color}`}>
                            {stockLabel.text}
                        </span>
                    )}
                </div>

                <div className="mt-auto">
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg text-xs uppercase tracking-[0.15em] font-medium hover:opacity-90 transition-colors shadow-sm hover:shadow-md group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <WhatsappIcon size={16} className="opacity-90" />
                        Enquire Now
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
