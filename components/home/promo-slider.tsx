'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { motion } from 'framer-motion';
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
        bg: 'from-[#f5efe6] via-[#ede4d6] to-[#e2d6c4]',
        accent: '#8a7a5a',
    },
    {
        id: 2,
        title: 'Luxury Rose Collection',
        subtitle: 'Handpicked Premium Roses',
        cta: 'Order Now',
        bg: 'from-[#e8ede4] via-[#dde6d6] to-[#d0dac6]',
        accent: '#5c6e4f',
    },
    {
        id: 3,
        title: 'Anniversary Specials',
        subtitle: 'Celebrate Your Love',
        cta: 'Order Now',
        bg: 'from-[#f0e6e0] via-[#e8dcd4] to-[#ddd0c6]',
        accent: '#9a6e5a',
    },
    {
        id: 4,
        title: 'Birthday Surprise Boxes',
        subtitle: 'Make Every Birthday Special',
        cta: 'Order Now',
        bg: 'from-[#e6eaf0] via-[#dce0e8] to-[#d0d6e0]',
        accent: '#5a6a8a',
    },
];

export default function PromoSlider() {
    return (
        <section className="py-6 md:py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <Swiper
                    modules={[Autoplay, FreeMode]}
                    spaceBetween={16}
                    slidesPerView={1.15}
                    centeredSlides={false}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    freeMode={{ enabled: true, sticky: true }}
                    breakpoints={{
                        640: { slidesPerView: 1.5, spaceBetween: 20 },
                        768: { slidesPerView: 2.2, spaceBetween: 24 },
                        1024: { slidesPerView: 2.5, spaceBetween: 28 },
                    }}
                    className="!px-4 md:!px-8"
                >
                    {PROMOS.map((promo) => (
                        <SwiperSlide key={promo.id}>
                            <div
                                className={`relative bg-gradient-to-br ${promo.bg} rounded-3xl overflow-hidden h-[180px] md:h-[220px] flex items-center shadow-soft hover:shadow-card transition-shadow duration-500 group cursor-pointer`}
                            >
                                {/* Left content */}
                                <div className="relative z-10 px-6 md:px-8 py-6 flex flex-col justify-center max-w-[65%]">
                                    <p
                                        className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium mb-2 opacity-70"
                                        style={{ color: promo.accent }}
                                    >
                                        {promo.subtitle}
                                    </p>
                                    <h3
                                        className="font-serif text-lg md:text-2xl mb-4 leading-snug"
                                        style={{ color: promo.accent }}
                                    >
                                        {promo.title}
                                    </h3>
                                    <Link
                                        href="/shop"
                                        className="inline-flex items-center gap-2 text-white text-xs uppercase tracking-[0.15em] font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:opacity-90 hover:gap-3 w-fit shadow-sm"
                                        style={{ backgroundColor: promo.accent }}
                                    >
                                        {promo.cta}
                                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>

                                {/* Right placeholder area */}
                                <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-2xl border-2 border-dashed flex items-center justify-center opacity-30"
                                    style={{ borderColor: promo.accent }}
                                >
                                    <span className="text-[10px] text-center px-2" style={{ color: promo.accent }}>
                                        Image Placeholder
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
        </section>
    );
}
