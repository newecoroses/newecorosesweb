'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ROW_1 = [
    { name: 'Birthday', slug: 'birthday', image: '/images/categories/birthday.webp', link: '/shop?celebration=birthday' },
    { name: 'Anniversary', slug: 'anniversary', image: '/images/categories/anniversary.webp', link: '/shop?celebration=anniversary' },
    { name: 'Personalised', slug: 'personalised', image: '/images/categories/personalised.webp', link: '/shop?cat=personalized' },
    { name: 'Ramadan', slug: 'ramadan', image: '/images/categories/ramadan.webp', link: '/shop?celebration=ramadan' },
    { name: 'Chocolates', slug: 'chocolates', image: '/images/categories/chocolates.webp', link: '/shop?cat=chocolate-bouquet' },
    { name: 'Sunflowers', slug: 'sunflowers', image: '/images/categories/sunflowers.webp', link: '/shop?search=sunflower' },
    { name: 'Balloon Decor', slug: 'balloon-decor', image: '/images/categories/balloon-decor.webp', link: '/shop?cat=balloon-bouquet' },
    { name: 'Fashion Gift', slug: 'fashion-gift', image: '/images/categories/fashion-gift.webp', link: '/shop?search=fashion' },
];

const ROW_2 = [
    { name: 'Flowers', slug: 'flowers', image: '/images/categories/flowers.webp', link: '/shop?cat=fresh-flower' },
    { name: 'Luxe', slug: 'luxe', image: '/images/categories/luxe.webp', link: '/shop?tag=best+seller' },
    { name: 'Cake', slug: 'cake', image: '/images/categories/cake.webp', link: '/shop?cat=cake' },
    { name: 'Wedding Gifts', slug: 'wedding-gifts', image: '/images/categories/wedding-gifts.webp', link: '/shop?celebration=wedding' },
    { name: 'Plants', slug: 'plants', image: '/images/categories/plants.webp', link: '/shop?cat=plants' },
    { name: 'Gift Hampers', slug: 'gift-hampers', image: '/images/categories/gift-hampers.webp', link: '/shop?cat=hamper' },
    { name: 'Gift Sets', slug: 'gift-sets', image: '/images/categories/gift-sets.webp', link: '/shop?search=gift+set' },
];

function CategoryRow({ items, delay = 0 }: { items: typeof ROW_1; delay?: number }) {
    return (
        <div className="w-full overflow-x-auto overflow-y-hidden no-scrollbar snap-x snap-mandatory md:overflow-visible overscroll-x-contain" style={{ touchAction: 'pan-x' }}>
            <div className="flex md:grid md:grid-cols-8 gap-3 md:gap-4 px-3 md:px-0 w-max md:w-full">
                {items.map((item, idx) => (
                    <motion.div
                        key={item.slug}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: delay + idx * 0.05 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href={item.link}
                            className="group snap-start flex flex-col items-center gap-2 w-[76px] md:w-full"
                        >
                            <div className="w-[68px] h-[68px] md:w-full md:aspect-square rounded-2xl bg-[#faf7f2] border border-[#e8dcc8]/60 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-card group-hover:border-[#5c6e4f]/30 relative overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 68px, 120px"
                                />
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
        <section className="py-5 md:py-10">
            <div className="max-w-6xl mx-auto md:px-8 space-y-4 md:space-y-5">
                <CategoryRow items={ROW_1} delay={0} />
                <CategoryRow items={ROW_2} delay={0.15} />
            </div>
        </section>
    );
}
