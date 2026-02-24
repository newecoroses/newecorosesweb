'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const ROW_1 = [
    { name: 'Birthday', slug: 'birthday', emoji: '🎂' },
    { name: 'Anniversary', slug: 'anniversary', emoji: '💍' },
    { name: 'Personalised', slug: 'personalised', emoji: '✨' },
    { name: 'Ramadan', slug: 'ramadan', emoji: '🌙' },
    { name: 'Chocolates', slug: 'chocolates', emoji: '🍫' },
    { name: 'Sunflowers', slug: 'sunflowers', emoji: '🌻' },
    { name: 'Balloon Decor', slug: 'balloon-decor', emoji: '🎈' },
    { name: 'Fashion Gift', slug: 'fashion-gift', emoji: '👗' },
];

const ROW_2 = [
    { name: 'Flowers', slug: 'flowers', emoji: '🌹' },
    { name: 'Luxe', slug: 'luxe', emoji: '💎' },
    { name: 'Cake', slug: 'cake', emoji: '🎂' },
    { name: 'Wedding Gifts', slug: 'wedding-gifts', emoji: '💒' },
    { name: 'Plants', slug: 'plants', emoji: '🌿' },
    { name: 'Gift Hampers', slug: 'gift-hampers', emoji: '🎁' },
    { name: 'Gift Sets', slug: 'gift-sets', emoji: '🎀' },
];

function CategoryRow({ items, delay = 0 }: { items: typeof ROW_1; delay?: number }) {
    return (
        <div className="w-full overflow-x-auto no-scrollbar snap-x snap-mandatory md:overflow-visible">
            <div className="flex md:grid md:grid-cols-8 gap-3 md:gap-4 px-4 md:px-0 w-max md:w-full">
                {items.map((item, idx) => (
                    <motion.div
                        key={item.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: delay + idx * 0.05 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href={`/shop?cat=${item.slug}`}
                            className="group snap-start flex flex-col items-center gap-2.5 w-[80px] md:w-full"
                        >
                            <div className="w-[72px] h-[72px] md:w-full md:aspect-square rounded-2xl bg-[#faf7f2] border border-[#e8dcc8]/60 flex flex-col items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-card group-hover:border-[#5c6e4f]/30 relative overflow-hidden">
                                {/* Subtle inner gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
                                <span className="text-2xl md:text-3xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                                    {item.emoji}
                                </span>
                            </div>
                            <span className="text-[10px] md:text-xs font-medium text-[#3a3226] text-center leading-tight line-clamp-2 group-hover:text-[#5c6e4f] transition-colors">
                                {item.name}
                            </span>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default function CategoryGrid() {
    return (
        <section className="py-6 md:py-10">
            <div className="max-w-6xl mx-auto md:px-8 space-y-4 md:space-y-5">
                <CategoryRow items={ROW_1} delay={0} />
                <CategoryRow items={ROW_2} delay={0.15} />
            </div>
        </section>
    );
}
