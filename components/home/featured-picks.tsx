'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

const FAV_FLOWERS = [
    { name: 'Roses', image: '/images/picks/flowers/roses.webp', link: '/shop?search=rose', bg: '#f5e6e0' },
    { name: 'Carnations', image: '/images/picks/flowers/carnations.webp', link: '/shop?search=carnation', bg: '#f0e0e8' },
    { name: 'Lily', image: '/images/picks/flowers/lily.webp', link: '/shop?search=lily', bg: '#f5e8f0' },
    { name: 'Orchids', image: '/images/picks/flowers/orchids.webp', link: '/shop?search=orchid', bg: '#e8eae0', scale: 1.1 },
    { name: 'Sunflowers', image: '/images/picks/flowers/sunflowers.webp', link: '/shop?search=sunflower', bg: '#f5f0e0' },
    { name: 'Gerberas', image: '/images/picks/flowers/gerberas.webp', link: '/shop?search=gerbera', bg: '#f0e8e0' },
    { name: 'Luxe', image: '/images/picks/flowers/luxe.webp', link: '/shop?tag=best+seller', bg: '#e8e4f0' },
];

const BIRTHDAY_GIFTS = [
    { name: 'Flowers', image: '/images/picks/birthday/flowers.webp', link: '/shop?cat=fresh-flower', bg: '#f5efe6' },
    { name: 'Personalised', image: '/images/picks/birthday/personalised.webp', link: '/shop?cat=personalized', bg: '#e8ede4' },
    { name: 'Chocolate Bouquets', image: '/images/picks/birthday/chocolate-bouquet.webp', link: '/shop?cat=chocolate-bouquet', bg: '#f5ece0' },
    { name: 'Cakes', image: '/images/picks/birthday/cakes.webp', link: '/shop?cat=cake', bg: '#f5e8e0' },
];

interface PickItem {
    name: string;
    image: string;
    link: string;
    bg: string;
    scale?: number;
}

interface PickSwiperProps {
    items: PickItem[];
    breakpoints: Record<number, { slidesPerView: number; spaceBetween: number }>;
}

function PickSwiper({ items, breakpoints }: PickSwiperProps) {
    return (
        <Swiper
            modules={[FreeMode]}
            spaceBetween={12}
            slidesPerView={2.35}
            freeMode={{ enabled: true, sticky: true }}
            breakpoints={breakpoints}
            className="!px-3 md:!px-8 !pb-1"
        >
            {items.map((item) => (
                <SwiperSlide key={item.name}>
                    <Link href={item.link} className="group block">
                        <div
                            className="relative aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm group-hover:shadow-card transition-all duration-500 group-hover:-translate-y-1"
                            style={{ backgroundColor: item.bg }}
                        >
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 15vw"
                                style={item.scale ? { transform: `scale(${item.scale})` } : undefined}
                                unoptimized
                            />
                        </div>
                        <p className="text-center font-bold text-[#1c1917] text-xs sm:text-sm mt-2 group-hover:text-black transition-colors">
                            {item.name}
                        </p>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default function FeaturedPicks() {
    return (
        <>
            {/* ── Pick Their Fav Flowers ── */}
            <section className="py-3 md:py-6 bg-white w-full max-w-full overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* Header with matching left-padding to Swiper slides */}
                    <div className="px-3 md:px-8 mb-2 md:mb-3">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="font-sans text-base sm:text-lg md:text-xl text-[#1c1917] font-extrabold tracking-tight"
                        >
                            Pick Their Fav Flowers
                        </motion.h2>
                    </div>

                    <PickSwiper
                        items={FAV_FLOWERS}
                        breakpoints={{
                            640: { slidesPerView: 3.5, spaceBetween: 14 },
                            768: { slidesPerView: 5.2, spaceBetween: 16 },
                            1024: { slidesPerView: 7, spaceBetween: 16 },
                        }}
                    />
                </div>
            </section>

            {/* ── Birthday Gifts That Wow ── */}
            <section className="py-3 md:py-6 bg-white w-full max-w-full overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="px-3 md:px-8 mb-2 md:mb-3">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="font-sans text-base sm:text-lg md:text-xl text-[#1c1917] font-extrabold tracking-tight"
                        >
                            Birthday Gifts That Wow
                        </motion.h2>
                    </div>

                    <PickSwiper
                        items={BIRTHDAY_GIFTS}
                        breakpoints={{
                            640: { slidesPerView: 2.8, spaceBetween: 14 },
                            768: { slidesPerView: 4, spaceBetween: 16 },
                            1024: { slidesPerView: 4, spaceBetween: 20 },
                        }}
                    />
                </div>
            </section>
        </>
    );
}
