'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const heartCategories = [
    { title: 'Wedding', image: '/celebrate-love/wedding.webp', link: '/shop?celebration=anniversary' },
    { title: 'Anniversary', image: '/celebrate-love/anniversary.webp', link: '/shop?celebration=anniversary' },
    { title: 'Thinking Of You', image: '/celebrate-love/thinking-of-you.webp', link: '/shop?cat=personalized' },
    { title: 'I Am Sorry', image: '/celebrate-love/i-am-sorry.webp', link: '/shop?cat=fresh-flower' },
    { title: 'Romantic Flowers', image: '/celebrate-love/romantic-flowers.webp', link: '/shop?cat=fresh-flower' },
    { title: 'For Girlfriend', image: '/celebrate-love/for-girlfriend.webp', link: '/shop?relation=girlfriend' },
    { title: 'For Boyfriend', image: '/celebrate-love/for-boyfriend.webp', link: '/shop?relation=boyfriend' },
    { title: 'Miss You', image: '/celebrate-love/miss-you.webp', link: '/shop?cat=teddy-and-bouquet' },
];

export default function CelebrateLove() {
    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">
                    {/* Left Banner */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-[45%] flex-shrink-0"
                    >
                        <Link href="/shop" className="block relative w-full aspect-[4/5] xl:aspect-square hover:scale-[1.02] transition-transform duration-500">
                            <Image
                                src="/celebrate-love/banner.webp"
                                alt="Celebrate Love Perfect gifts for every story"
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 100vw, 45vw"
                                priority
                            />
                        </Link>
                    </motion.div>

                    {/* Right Heart Grid */}
                    <div className="w-full lg:w-[55%] grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {heartCategories.map((cat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                viewport={{ once: true }}
                            >
                                <Link href={cat.link} className="flex flex-col items-center gap-3 group">
                                    <div className="w-full aspect-square relative hover:-translate-y-1 transition-transform duration-300">
                                        <div className={`w-full h-full relative transition-transform duration-500 ${cat.title === 'Miss You' ? 'scale-[1.18] group-hover:scale-[1.23]' : 'scale-100 group-hover:scale-105'}`}>
                                            <Image
                                                src={cat.image}
                                                alt={cat.title}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 640px) 50vw, 25vw"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-[11px] md:text-[13px] font-semibold text-[#3a3226] text-center group-hover:text-[#5c6e4f] transition-colors tracking-wide">
                                        {cat.title}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
