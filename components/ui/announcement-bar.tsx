'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { fetchAnnouncements } from '@/lib/supabase';

// Fallback if Supabase is not set up yet
const FALLBACK_ANNOUNCEMENTS = [
    "FLAT 15% OFF ON PREMIUM GIFT HAMPERS",
    "SAME DAY DELIVERY WITHIN 10KM",
    "FRESH HANDCRAFTED BOUQUETS DAILY",
    "CUSTOM MESSAGE CARDS AVAILABLE",
    "LUXURY PACKAGING AT NO EXTRA COST",
    "FAST & SECURE DELIVERY",
    "SURPRISE YOUR LOVED ONES TODAY"
];

export default function AnnouncementBar() {
    const [texts, setTexts] = useState<string[]>(FALLBACK_ANNOUNCEMENTS);

    useEffect(() => {
        fetchAnnouncements().then(data => {
            if (data.length > 0) {
                setTexts(data.map(a => a.text));
            }
        }).catch(() => {/* use fallback */ });
    }, []);

    // Repeat 4x for a seamless infinite loop
    const marqueeItems = [...texts, ...texts, ...texts, ...texts];

    return (
        <div className="bg-primary text-white overflow-hidden py-2.5 border-b border-white/10 relative z-[51]">
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex gap-12 items-center w-max"
                    animate={{ x: "-50%" }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    {marqueeItems.map((text, i) => (
                        <div key={i} className="flex items-center gap-12">
                            <span className="text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase shrink-0">
                                {text}
                            </span>
                            <span className="text-[8px] text-primary/60">•</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
