'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { fetchAnnouncements } from '@/lib/supabase';

// Fallback if Supabase is not set up yet
const FALLBACK_ANNOUNCEMENTS = [
    "FLAT 15% OFF ON PREMIUM GIFT HAMPERS",
    "SAME DAY DELIVERY AVAILABLE",
    "FRESH HANDCRAFTED BOUQUETS DAILY",
    "CUSTOM MESSAGE CARDS AVAILABLE",
    "LUXURY PACKAGING AT NO EXTRA COST",
    "FAST & SECURE DELIVERY",
    "SURPRISE YOUR LOVED ONES TODAY"
];

// 4-point Sparkle Star Component
function StarSparkle({ className = "w-3 h-3 text-[#93c5fd]" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z" />
        </svg>
    );
}

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
        <div 
            className="relative overflow-hidden py-2.5 border-b border-[#a89216] z-[51] select-none shadow-xs text-[#1c1917]"
            style={{ backgroundColor: '#bfa81f' }}
        >
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none" />

            {/* Scrolling Marquee Content */}
            <div className="flex whitespace-nowrap relative z-10">
                <motion.div
                    className="flex gap-10 sm:gap-14 items-center w-max"
                    animate={{ x: "-50%" }}
                    transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                >
                    {marqueeItems.map((text, i) => (
                        <div key={i} className="flex items-center gap-10 sm:gap-14">
                            <span className="text-[10px] md:text-[11.5px] font-extrabold tracking-[0.22em] uppercase text-[#1c1917] shrink-0">
                                {text}
                            </span>
                            
                            {/* Star detailing separator between items */}
                            <div className="flex items-center gap-1.5 shrink-0 text-[#1c1917]">
                                <StarSparkle className="w-2.5 h-2.5 text-[#1c1917]/70" />
                                <StarSparkle className="w-3.5 h-3.5 text-[#1c1917]" />
                                <StarSparkle className="w-2.5 h-2.5 text-[#1c1917]/70" />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

