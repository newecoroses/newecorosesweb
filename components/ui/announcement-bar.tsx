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
            className="relative overflow-hidden py-2.5 border-b border-[#0f3d7d] z-[51] select-none shadow-xs text-white"
            style={{ backgroundColor: '#072B61' }}
        >
            {/* Orion Blue Celestial Star Geo Pattern Background */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40' viewBox='0 0 100 40'%3E%3Cpath d='M0 0 A25 25 0 0 1 50 0 A25 25 0 0 1 100 0' fill='none' stroke='%2338bdf8' stroke-width='1.2' stroke-opacity='0.5'/%3E%3Cpath d='M50 2 Q50 20 68 20 Q50 20 50 38 Q50 20 32 20 Q50 20 50 2 Z' fill='none' stroke='%237dd3fc' stroke-width='1.3' stroke-opacity='0.85'/%3E%3Cpath d='M0 8 Q0 20 12 20 Q0 20 0 32 Q0 20 -12 20 Q0 20 0 8 Z' fill='none' stroke='%237dd3fc' stroke-width='1' stroke-opacity='0.7'/%3E%3Cpath d='M100 8 Q100 20 112 20 Q100 20 100 32 Q100 20 88 20 Q100 20 100 8 Z' fill='none' stroke='%237dd3fc' stroke-width='1' stroke-opacity='0.7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat-x',
                    backgroundPosition: 'center',
                    backgroundSize: '80px 36px',
                }}
            />

            {/* Orion Blue Cosmic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#041a3d]/80 via-transparent to-[#041a3d]/80 pointer-events-none" />

            {/* Scrolling Marquee Content */}
            <div className="flex whitespace-nowrap relative z-10">
                <motion.div
                    className="flex gap-10 sm:gap-14 items-center w-max"
                    animate={{ x: "-50%" }}
                    transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                >
                    {marqueeItems.map((text, i) => (
                        <div key={i} className="flex items-center gap-10 sm:gap-14">
                            <span className="text-[10px] md:text-[11.5px] font-semibold tracking-[0.22em] uppercase text-white shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                                {text}
                            </span>
                            
                            {/* Star detailing separator between items */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                <StarSparkle className="w-2.5 h-2.5 text-[#7dd3fc]/80" />
                                <StarSparkle className="w-3.5 h-3.5 text-[#fbbf24] drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]" />
                                <StarSparkle className="w-2.5 h-2.5 text-[#7dd3fc]/80" />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

