'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const BANNERS = [
    { id: 1, src: '/images/banners/hero/birthday.webp', alt: 'Birthday Gifts' },
    { id: 2, src: '/images/banners/hero/anniversary.webp', alt: 'Anniversary Specials' },
    { id: 3, src: '/images/banners/hero/women.webp', alt: "Women's Collection" },
    { id: 4, src: '/images/banners/hero/wedding-gifts.webp', alt: 'Wedding Gifts' },
    { id: 5, src: '/images/banners/hero/housewarming.webp', alt: 'Housewarming Gifts' },
    { id: 6, src: '/images/banners/hero/ramadan.webp', alt: 'Ramadan Collection' },
    { id: 7, src: '/images/banners/hero/plants.webp', alt: 'Plants Collection' },
    { id: 8, src: '/images/banners/hero/shop-the-trend.webp', alt: 'Shop The Trend' },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [next]);

    return (
        <section className="w-full px-3 md:px-8 pt-3 md:pt-4">
            <div className="relative w-full aspect-[16/7] md:aspect-[3/1] rounded-2xl md:rounded-3xl overflow-hidden shadow-elevated">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={BANNERS[current].id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={BANNERS[current].src}
                            alt={BANNERS[current].alt}
                            fill
                            className="object-cover"
                            priority={current === 0}
                            sizes="100vw"
                            quality={85}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Dot indicators */}
                <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-10">
                    {BANNERS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${current === idx
                                    ? 'w-6 md:w-8 bg-white shadow-sm'
                                    : 'w-1.5 md:w-2 bg-white/40 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
