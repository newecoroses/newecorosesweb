'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const FAV_FLOWERS = [
    { name: 'Roses', image: '/images/picks/flowers/roses.webp', link: '/shop?search=rose', bg: '#f5e6e0' },
    { name: 'Carnations', image: '/images/picks/flowers/carnations.webp', link: '/shop?search=carnation', bg: '#f0e0e8' },
    { name: 'Orchids', image: '/images/picks/flowers/orchids.webp', link: '/shop?search=orchid', bg: '#e8eae0', scale: 1.1 },
    { name: 'Sunflowers', image: '/images/picks/flowers/sunflowers.webp', link: '/shop?search=sunflower', bg: '#f5f0e0' },
    { name: 'Gerberas', image: '/images/picks/flowers/gerberas.webp', link: '/shop?search=gerbera', bg: '#f0e8e0' },
    { name: 'Luxe', image: '/images/picks/flowers/luxe.webp', link: '/shop?tag=best+seller', bg: '#e8e4f0' },
];

const BIRTHDAY_GIFTS = [
    { name: 'Flowers', image: '/images/picks/birthday/flowers.webp', link: '/shop?cat=fresh-flower', bg: '#f5efe6' },
    { name: 'Cakes', image: '/images/picks/birthday/cakes.webp', link: '/shop?cat=cake', bg: '#f5e8e0' },
    { name: 'Personalised', image: '/images/picks/birthday/personalised.webp', link: '/shop?cat=personalized', bg: '#e8ede4' },
];

interface PickItem {
    name: string;
    image: string;
    link: string;
    bg: string;
    scale?: number;
}

function ScrollRow({ items, cardWidth }: { items: PickItem[]; cardWidth: string }) {
    return (
        <div
            className="w-full overflow-x-auto overflow-y-hidden no-scrollbar snap-x snap-mandatory md:overflow-visible"
            style={{ touchAction: 'pan-x' }}
        >
            <div className="flex md:flex-wrap gap-3 md:gap-4 px-4 md:px-0 w-max md:w-full">
                {items.map((item, idx) => (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: idx * 0.06 }}
                        viewport={{ once: true }}
                        className={`snap-start flex-shrink-0 ${cardWidth} md:flex-1`}
                    >
                        <Link href={item.link} className="group block">
                            <div
                                className="relative aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm group-hover:shadow-card transition-all duration-500 group-hover:-translate-y-1"
                                style={{ backgroundColor: item.bg }}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    sizes="(max-width: 768px) 45vw, 20vw"
                                    style={item.scale ? { transform: `scale(${item.scale})` } : undefined}
                                />
                            </div>
                            <p className="text-center font-semibold text-[#3a3226] text-sm md:text-base mt-2.5 group-hover:text-[#5c6e4f] transition-colors">
                                {item.name}
                            </p>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default function FeaturedPicks() {
    return (
        <>
            {/* ── Pick Their Fav Flowers ── */}
            <section className="py-5 md:py-10 bg-white">
                <div className="max-w-7xl mx-auto md:px-8">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="font-serif text-xl md:text-2xl text-[#3a3226] font-bold px-4 md:px-0 mb-4 md:mb-6"
                    >
                        Pick Their Fav Flowers
                    </motion.h2>
                    <ScrollRow items={FAV_FLOWERS} cardWidth="w-[42vw]" />
                </div>
            </section>

            {/* ── Birthday Gifts That Wow ── */}
            <section className="py-5 md:py-10 bg-white">
                <div className="max-w-7xl mx-auto md:px-8">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="font-serif text-xl md:text-2xl text-[#3a3226] font-bold px-4 md:px-0 mb-4 md:mb-6"
                    >
                        Birthday Gifts That Wow
                    </motion.h2>
                    <ScrollRow items={BIRTHDAY_GIFTS} cardWidth="w-[38vw]" />
                </div>
            </section>
        </>
    );
}
