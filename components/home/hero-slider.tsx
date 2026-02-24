'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BANNERS = [
    {
        id: 1,
        label: 'Banner 1 Placeholder',
        subtitle: 'Premium Floral Arrangements',
        bg: 'from-[#f5efe6] to-[#e8dcc8]',
    },
    {
        id: 2,
        label: 'Banner 2 Placeholder',
        subtitle: 'Same Day Delivery Available',
        bg: 'from-[#e8ede4] to-[#d4dece]',
    },
    {
        id: 3,
        label: 'Banner 3 Placeholder',
        subtitle: 'Handcrafted With Love',
        bg: 'from-[#f0e6e0] to-[#e2d4cc]',
    },
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
        <section className="w-full px-4 md:px-8 pt-4">
            <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl overflow-hidden shadow-elevated">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={BANNERS[current].id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className={`absolute inset-0 bg-gradient-to-br ${BANNERS[current].bg} flex items-center justify-center`}
                    >
                        <div className="text-center px-6">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-[#8a7a5a] text-xs uppercase tracking-[0.3em] font-medium mb-3"
                            >
                                {BANNERS[current].subtitle}
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.5 }}
                                className="font-serif text-2xl md:text-5xl text-[#3a3226] mb-2"
                            >
                                {BANNERS[current].label}
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-sm text-[#8a7a5a] mt-2"
                            >
                                Tap to replace with your banner image
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {BANNERS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-2 rounded-full transition-all duration-500 ${current === idx
                                    ? 'w-8 bg-[#5c6e4f]'
                                    : 'w-2 bg-[#5c6e4f]/30 hover:bg-[#5c6e4f]/50'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
