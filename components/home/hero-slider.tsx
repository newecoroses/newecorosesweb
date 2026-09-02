'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface BannerItem {
    id: string;
    src: string;
    alt: string;
    link: string;
    evergreen?: boolean;
    startDate?: string;
    endDate?: string;
}

const ALL_BANNERS: BannerItem[] = [
    // ── Scheduled Seasonal Event Banners (Dynamic Date Window) ──
    {
        id: 'janmashtami',
        src: '/images/banners/hero/janmastami.webp',
        alt: 'Janmashtami Specials',
        link: '/shop?search=janmashtami',
        startDate: '2026-08-25', // 10 days before Sept 4
        endDate: '2026-09-06',   // 2 days after Sept 4
    },
    {
        id: 'teachers-day',
        src: '/images/banners/hero/teachers day.webp',
        alt: "Teachers' Day Specials",
        link: '/shop?search=teachers+day',
        startDate: '2026-08-26', // 10 days before Sept 5
        endDate: '2026-09-07',   // 2 days after Sept 5
    },
    {
        id: 'ganesh-chaturthi',
        src: '/images/banners/hero/ganesh chaturthi.webp',
        alt: 'Ganesh Chaturthi Specials',
        link: '/shop?search=ganesh+chaturthi',
        startDate: '2026-09-04', // 10 days before Sept 14
        endDate: '2026-09-16',   // 2 days after Sept 14
    },
    {
        id: 'vishwakarma-puja',
        src: '/images/banners/hero/viswakarma puja.webp',
        alt: 'Vishwakarma Puja Specials',
        link: '/shop?search=vishwakarma',
        startDate: '2026-09-07', // 10 days before Sept 17
        endDate: '2026-09-19',   // 2 days after Sept 17
    },
    {
        id: 'durga-puja',
        src: '/images/banners/hero/durga puja.webp',
        alt: 'Durga Puja Specials',
        link: '/shop?search=durga+puja',
        startDate: '2026-09-27', // 20 days before Oct 17
        endDate: '2026-10-22',   // 2 days after Oct 20
    },
    {
        id: 'dussehra',
        src: '/images/banners/hero/dussehra.webp',
        alt: 'Dussehra Specials',
        link: '/shop?search=dussehra',
        startDate: '2026-10-10', // 10 days before Oct 20
        endDate: '2026-10-22',   // 2 days after Oct 20
    },

    // ── Evergreen Year-Round Banners ──
    {
        id: 'birthday',
        src: '/images/banners/hero/birthday.webp',
        alt: 'Birthday Gifts',
        link: '/shop?celebration=birthday',
        evergreen: true,
    },
    {
        id: 'anniversary',
        src: '/images/banners/hero/anniversary.webp',
        alt: 'Anniversary Specials',
        link: '/shop?celebration=anniversary',
        evergreen: true,
    },
    {
        id: 'wedding-gifts',
        src: '/images/banners/hero/wedding-gifts.webp',
        alt: 'Wedding Gifts',
        link: '/shop?cat=wedding-gifts',
        evergreen: true,
    },
    {
        id: 'housewarming',
        src: '/images/banners/hero/housewarming.webp',
        alt: 'Housewarming Gifts',
        link: '/shop?celebration=housewarming',
        evergreen: true,
    },
    {
        id: 'plants',
        src: '/images/banners/hero/plants.webp',
        alt: 'Plants Collection',
        link: '/shop?cat=plants',
        evergreen: true,
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    // Compute active banners dynamically based on current date
    const activeBanners = useMemo(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        const filtered = ALL_BANNERS.filter((banner) => {
            if (banner.evergreen) return true;
            if (banner.startDate && banner.endDate) {
                return todayStr >= banner.startDate && todayStr <= banner.endDate;
            }
            return true;
        });

        return filtered.length > 0 ? filtered : ALL_BANNERS.filter((b) => b.evergreen);
    }, []);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % activeBanners.length);
    }, [activeBanners.length]);

    useEffect(() => {
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [next]);

    // Safety fallback if activeBanners changes length
    const activeCurrent = current % activeBanners.length;
    const currentBanner = activeBanners[activeCurrent] || activeBanners[0];

    return (
        <section className="w-full max-w-full overflow-hidden px-3 md:px-8 pt-5 md:pt-6">
            <div className="relative w-full aspect-[3/1] rounded-2xl md:rounded-3xl overflow-hidden shadow-elevated bg-[#2a2420]">
                {/* Crossfade Slides — All active banners rendered with instant smooth crossfade (Zero white flash) */}
                {activeBanners.map((banner, idx) => {
                    const isActive = idx === activeCurrent;
                    return (
                        <div
                            key={banner.id}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                        >
                            <Link href={banner.link} className="block w-full h-full relative">
                                <Image
                                    src={banner.src}
                                    alt={banner.alt}
                                    fill
                                    className="object-cover"
                                    priority={idx === 0 || idx === 1}
                                    sizes="(max-width: 768px) 100vw, 90vw"
                                    quality={90}
                                />
                            </Link>
                        </div>
                    );
                })}

                {/* Dot indicators */}
                <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-20">
                    {activeBanners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`h-1.5 md:h-2 rounded-full transition-all duration-300 cursor-pointer ${activeCurrent === idx
                                ? 'w-6 md:w-8 bg-white shadow-sm'
                                : 'w-1.5 md:w-2 bg-white/40 hover:bg-white/75'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
