'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/free-mode';

const PROMOS = [
    {
        id: 1,
        title: 'Warm Gifts for New Homes',
        subtitle: 'Housewarming Collection',
        cta: 'Order Now',
        image: '/images/banners/hero/housewarming.webp',
        accent: '#8a7a5a',
        overlayFrom: 'from-[#3a3226]/70',
    },
    {
        id: 2,
        title: 'Luxury Rose Collection',
        subtitle: 'Handpicked Premium Roses',
        cta: 'Order Now',
        image: '/images/banners/hero/shop-the-trend.webp',
        accent: '#5c6e4f',
        overlayFrom: 'from-[#2a3a20]/70',
    },
    {
        id: 3,
        title: 'Anniversary Specials',
        subtitle: 'Celebrate Your Love',
        cta: 'Order Now',
        image: '/images/banners/hero/anniversary.webp',
        accent: '#9a6e5a',
        overlayFrom: 'from-[#3a2a20]/70',
    },
    {
        id: 4,
        title: 'Wedding Gifting',
        subtitle: 'Make Every Wedding Special',
        cta: 'Order Now',
        image: '/images/banners/hero/wedding-gifts.webp',
        accent: '#5a6a8a',
        overlayFrom: 'from-[#2a3040]/70',
    },
];

export default function PromoSlider() {
    return (
        <section className="py-4 md:py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <Swiper
                    modules={[Autoplay, FreeMode]}
                    spaceBetween={12}
                    slidesPerView={1.15}
                    centeredSlides={false}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    freeMode={{ enabled: true, sticky: true }}
                    breakpoints={{
                        640: { slidesPerView: 1.5, spaceBetween: 16 },
                        768: { slidesPerView: 2.2, spaceBetween: 20 },
                        1024: { slidesPerView: 2.5, spaceBetween: 24 },
                    }}
                    className="!px-3 md:!px-8"
                >
                    {PROMOS.map((promo) => (
                        <SwiperSlide key={promo.id}>
                            <Link href="/shop" className="block">
                                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden h-[160px] md:h-[220px] shadow-soft hover:shadow-card transition-shadow duration-500 group cursor-pointer">
                                    {/* Background image */}
                                    <Image
                                        src={promo.image}
                                        alt={promo.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 40vw"
                                    />
                                    {/* Gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${promo.overlayFrom} via-black/30 to-transparent`} />

                                    {/* Left content */}
                                    <div className="absolute inset-0 flex flex-col justify-center px-5 md:px-8 py-5 z-10 max-w-[75%]">
                                        <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium mb-1.5 md:mb-2 text-white/70">
                                            {promo.subtitle}
                                        </p>
                                        <h3 className="font-serif text-base md:text-2xl text-white mb-3 md:mb-4 leading-snug">
                                            {promo.title}
                                        </h3>
                                        <span
                                            className="inline-flex items-center gap-1.5 text-white text-[10px] md:text-xs uppercase tracking-[0.15em] font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-full w-fit shadow-sm transition-all duration-300 group-hover:gap-2.5"
                                            style={{ backgroundColor: promo.accent }}
                                        >
                                            {promo.cta}
                                            <ArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
        </section>
    );
}
