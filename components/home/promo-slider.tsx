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
        image: '/images/banners/promo/housewarming.webp',
        link: '/shop?celebration=housewarming',
        textColor: '#3a3226',
        ctaBg: '#5c6e4f',
    },
    {
        id: 2,
        title: 'Luxury Rose Collection',
        subtitle: 'Handpicked Premium Roses',
        cta: 'Order Now',
        image: '/images/banners/promo/luxury-roses.webp',
        link: '/shop?search=rose',
        textColor: '#3a3226',
        ctaBg: '#8a3a50',
    },
    {
        id: 3,
        title: 'Anniversary Specials',
        subtitle: 'Celebrate Your Love',
        cta: 'Order Now',
        image: '/images/banners/promo/anniversary.webp',
        link: '/shop?celebration=anniversary',
        textColor: '#3a3226',
        ctaBg: '#9a6e5a',
    },
    {
        id: 4,
        title: 'Wedding Gifting',
        subtitle: 'Make Every Wedding Special',
        cta: 'Order Now',
        image: '/images/banners/promo/wedding.webp',
        link: '/shop?celebration=wedding',
        textColor: '#3a3226',
        ctaBg: '#5a6a8a',
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
                            <Link href={promo.link} className="block">
                                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden h-[160px] md:h-[220px] shadow-soft hover:shadow-card transition-shadow duration-500 group cursor-pointer">
                                    {/* Full background image */}
                                    <Image
                                        src={promo.image}
                                        alt={promo.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 40vw"
                                    />

                                    {/* Right 40% text overlay */}
                                    <div className="absolute top-0 right-0 w-[45%] h-full flex flex-col justify-center px-3 md:px-5 py-4 z-10 bg-gradient-to-l from-white/90 via-white/75 to-transparent">
                                        <p
                                            className="text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] font-semibold mb-1 md:mb-2 opacity-60"
                                            style={{ color: promo.textColor }}
                                        >
                                            {promo.subtitle}
                                        </p>
                                        <h3
                                            className="font-serif text-[13px] md:text-lg leading-tight mb-2 md:mb-4"
                                            style={{ color: promo.textColor }}
                                        >
                                            {promo.title}
                                        </h3>
                                        <span
                                            className="inline-flex items-center gap-1 text-white text-[8px] md:text-[10px] uppercase tracking-[0.12em] font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full w-fit shadow-sm group-hover:gap-2 transition-all duration-300"
                                            style={{ backgroundColor: promo.ctaBg }}
                                        >
                                            {promo.cta}
                                            <ArrowRight size={10} />
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
