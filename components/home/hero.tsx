'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import { fetchWhatsappSettings } from '@/lib/supabase';

const HERO_IMAGES_DESKTOP = [
    '/images/landing-page/slide-1.webp',
    '/images/landing-page/slide-2.webp',
    '/images/landing-page/slide-3.webp',
];

const HERO_IMAGES_MOBILE = [
    '/images/landing-page/lp1mv.webp',
    '/images/landing-page/lp2mv.webp',
    '/images/landing-page/lp3mv.webp',
];

export default function Hero() {
    const [tick, setTick] = useState(0);
    const [waLink, setWaLink] = useState('https://wa.me/918910408544?text=Hello!');

    useEffect(() => {
        const interval = setInterval(() => {
            setTick((prev) => prev + 1);
        }, 4000); // changes every 4 seconds

        fetchWhatsappSettings().then((s) => {
            if (s) {
                setWaLink(`https://wa.me/${s.phone_number}?text=${encodeURIComponent(s.default_message)}`);
            }
        });

        return () => clearInterval(interval);
    }, []);

    const desktopIndex = tick % HERO_IMAGES_DESKTOP.length;
    const mobileIndex = tick % HERO_IMAGES_MOBILE.length;

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            {/* Desktop Background Images */}
            <div className="hidden md:block absolute inset-0">
                {HERO_IMAGES_DESKTOP.map((src, index) => (
                    <motion.div
                        key={src}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: index === desktopIndex ? 1 : 0,
                            scale: index === desktopIndex ? 1 : 1.05
                        }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0"
                        style={{ zIndex: index === desktopIndex ? 1 : 0 }}
                    >
                        <Image
                            src={src}
                            alt={`New Eco Roses Banner ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            sizes="100vw"
                            quality={100}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Mobile Background Images */}
            <div className="block md:hidden absolute inset-0">
                {HERO_IMAGES_MOBILE.map((src, index) => (
                    <motion.div
                        key={src}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: index === mobileIndex ? 1 : 0,
                            scale: index === mobileIndex ? 1 : 1.05
                        }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0"
                        style={{ zIndex: index === mobileIndex ? 1 : 0 }}
                    >
                        <Image
                            src={src}
                            alt={`New Eco Roses Mobile Banner ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            sizes="100vw"
                            quality={100}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Overlay Gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 z-20">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    className="max-w-2xl"
                >
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight">
                        New Eco Roses
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-light mb-10 tracking-wide">
                        Fresh Roses. Timeless Emotions.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-start gap-4 md:gap-6"
                >
                    <Link
                        href="/shop"
                        className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-full min-w-[200px] flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)] hover:scale-105"
                    >
                        <span className="relative z-10 text-sm font-bold uppercase tracking-[0.15em]">Explore</span>
                        <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="relative z-10 group-hover:translate-x-1 transition-transform"
                        >
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>

                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden bg-[#25D366] text-white px-8 py-4 rounded-full min-w-[200px] flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(37,211,102,0.6)] hover:scale-105"
                    >
                        <span className="relative z-10 text-sm font-bold uppercase tracking-[0.15em]">WhatsApp</span>
                        <div className="absolute inset-0 bg-[#1fb855] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                        <WhatsappIcon
                            size={18}
                            className="relative z-10"
                        />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
