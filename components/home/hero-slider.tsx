'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
    {
        id: 'beauty-in-every-bloom',
        src: '/images/banners/hero/beauty-in-every-bloom.webp',
        alt: 'Beauty in Every Bloom',
        link: '/shop',
        evergreen: true,
    },
    {
        id: 'colour-me-happy',
        src: '/images/banners/hero/colour-me-happy-floral-still-life.webp',
        alt: 'Colour Me Happy Floral Still Life',
        link: '/shop?cat=fresh-flower',
        evergreen: true,
    },
    {
        id: 'naturally-beautiful-eco-roses',
        src: '/images/banners/hero/naturally-beautiful-eco-roses.webp',
        alt: 'Naturally Beautiful Eco Roses',
        link: '/shop',
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

    return (
        <section className="w-full max-w-full overflow-hidden px-3 md:px-8 pt-5 md:pt-6">
            <div className="relative w-full aspect-[3/1] rounded-2xl md:rounded-3xl overflow-hidden shadow-elevated bg-gray-100">
                {/* Crossfade Slides — All active banners rendered with instant smooth crossfade */}
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
                                    priority
                                    unoptimized
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
