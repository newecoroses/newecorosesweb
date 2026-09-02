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
        title: 'Luxury Rose Collection',
        cta: 'Order Now',
        image: '/images/banners/promo/luxary rose collection.webp',
        link: '/shop?search=rose',
        ctaBg: '#8a3a50',
    },
    {
        id: 2,
        title: 'Anniversary Specials',
        cta: 'Order Now',
        image: '/images/banners/promo/annieversary specials.webp',
        link: '/shop?celebration=anniversary',
        ctaBg: '#9a6e5a',
    },
    {
        id: 3,
        title: 'Wedding Gifting',
        cta: 'Order Now',
        image: '/images/banners/promo/wedding gifting.webp',
        link: '/shop?celebration=wedding',
        ctaBg: '#5a6a8a',
    },
    {
        id: 4,
        title: 'Birthday Gifts That Delight',
        cta: 'Order Now',
        image: '/images/banners/promo/birthday gifts that delights.webp',
        link: '/shop?celebration=birthday',
        ctaBg: '#5c6e4f',
    },
];

export default function PromoSlider() {
    return (
        <section className="py-4 md:py-10 w-full max-w-full overflow-hidden">
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

                                    {/* Order Now button overlay in bottom right */}
                                    <div className="absolute bottom-3 md:bottom-5 right-3 md:right-6 z-10">
                                        <span
                                            className="inline-flex items-center gap-1.5 text-white text-[9px] md:text-xs uppercase tracking-[0.14em] font-bold px-3.5 md:px-5 py-1.5 md:py-2 rounded-full shadow-md group-hover:gap-2.5 transition-all duration-300"
                                            style={{ backgroundColor: promo.ctaBg }}
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
