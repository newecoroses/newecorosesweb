'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const SOCIALS = [
    {
        id: 'instagram',
        name: 'Instagram',
        handle: '@newecoroses___kolkata',
        description: 'Follow us for daily floral inspiration, new arrivals, and behind-the-scenes magic.',
        href: 'https://www.instagram.com/newecoroses___kolkata/',
        gradient: 'from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
        hoverGlow: 'hover:shadow-[0_8px_40px_rgba(238,42,123,0.35)]',
        icon: (
            <img src="/social%20svgs/instagram-logo-facebook-2-svgrepo-com%20%281%29.svg" alt="Instagram" className="w-6 h-6 md:w-8 md:h-8" />
        ),
        cta: 'Follow on Instagram',
        badge: 'Social Media',
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        handle: '+91 99369 11611',
        description: 'Chat with us to place orders, ask about customization, or get delivery updates.',
        href: 'https://wa.me/919936911611?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products.',
        gradient: 'from-[#25D366] to-[#128C7E]',
        hoverGlow: 'hover:shadow-[0_8px_40px_rgba(37,211,102,0.35)]',
        icon: (
            <img src="/social%20svgs/whatsapp-svgrepo-com.svg" alt="WhatsApp" className="w-6 h-6 md:w-8 md:h-8" />
        ),
        cta: 'Message on WhatsApp',
        badge: 'Order & Enquiry',
    },
    {
        id: 'website',
        name: 'Our Website',
        handle: 'newecoroses.com',
        description: 'Explore our full collection of luxury floral gifts, seasonal bouquets, and bespoke arrangements.',
        href: 'https://newecoroses.com',
        gradient: 'from-[#5c6e4f] to-[#3a5a3a]',
        hoverGlow: 'hover:shadow-[0_8px_40px_rgba(92,110,79,0.35)]',
        icon: (
            <img src="/social%20svgs/website-ui-web-svgrepo-com.svg" alt="Website" className="w-6 h-6 md:w-8 md:h-8" />
        ),
        cta: 'Visit Website',
        badge: 'Shop Online',
    },
    {
        id: 'google-outlet1',
        name: 'Google Review — Outlet 1',
        handle: 'Regent Park Store, Kolkata',
        description: 'Loved your experience at our Regent Park outlet? Leave us a review on Google!',
        href: 'https://maps.app.goo.gl/RbKpGWan1p9qDxhr6',
        gradient: 'from-[#4285F4] via-[#EA4335] to-[#FBBC05]',
        hoverGlow: 'hover:shadow-[0_8px_40px_rgba(66,133,244,0.35)]',
        icon: (
            <img src="/social%20svgs/google-maps-svgrepo-com.svg" alt="Google Maps" className="w-6 h-6 md:w-8 md:h-8" />
        ),
        cta: 'Rate Outlet 1',
        badge: 'Regent Park',
    },
    {
        id: 'google-outlet2',
        name: 'Google Review — Outlet 2',
        handle: 'New Alipore Store, Kolkata',
        description: 'Visited our new store in New Alipore? Rate us on Google Maps!',
        href: 'https://maps.app.goo.gl/iGyTCXfQG8oEZmv57',
        gradient: 'from-[#34A853] via-[#4285F4] to-[#EA4335]',
        hoverGlow: 'hover:shadow-[0_8px_40px_rgba(52,168,83,0.35)]',
        icon: (
            <img src="/social%20svgs/google-maps-svgrepo-com.svg" alt="Google Maps" className="w-6 h-6 md:w-8 md:h-8" />
        ),
        cta: 'Rate Outlet 2',
        badge: 'New Alipore',
    },
];

export default function SocialsPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col justify-center pt-24 md:pt-36 pb-8 md:pb-16 px-4 md:px-6">
            <div className="max-w-3xl mx-auto w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-6 md:mb-12"
                >
                    <span className="inline-block text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-primary font-semibold mb-2 md:mb-4 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
                        Connect With Us
                    </span>
                    <h1 className="font-serif text-2xl md:text-5xl text-foreground mb-2 md:mb-4 leading-tight">
                        Find Us Online
                    </h1>
                    <p className="text-muted font-light text-sm md:text-lg max-w-md mx-auto leading-relaxed">
                        Follow, chat, or browse — we&apos;re just a tap away.
                    </p>
                </motion.div>

                {/* Social Cards */}
                <div className="flex flex-col gap-3 md:gap-5">
                    {SOCIALS.map((social, i) => (
                        <motion.a
                            key={social.id}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.1 + i * 0.1 }}
                            className={`group relative flex items-center gap-4 md:gap-6 bg-white border border-gray-100 rounded-2xl p-4 md:p-7 shadow-sm transition-all duration-300 ${social.hoverGlow} hover:-translate-y-0.5`}
                        >
                            {/* Icon container (transparent background) */}
                            <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                {social.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-serif text-base md:text-xl text-foreground font-semibold">{social.name}</span>
                                    <span className="hidden sm:inline-block text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/15">
                                        {social.badge}
                                    </span>
                                </div>
                                <p className="text-xs md:text-sm font-medium text-primary mb-1">{social.handle}</p>
                                <p className="text-xs md:text-sm text-muted font-light leading-relaxed line-clamp-1 md:line-clamp-2">{social.description}</p>
                            </div>

                            {/* Arrow CTA desktop */}
                            <div className="hidden md:flex flex-shrink-0 items-center gap-2 text-xs uppercase tracking-widest font-semibold text-primary group-hover:gap-3 transition-all duration-300">
                                {social.cta}
                                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Mobile arrow */}
                            <div className="md:hidden flex-shrink-0 text-primary">
                                <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Footer note + back link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="flex flex-col items-center gap-3 mt-6 md:mt-10"
                >
                    <p className="text-center text-xs text-muted font-light tracking-wide">
                        New Eco Roses — Kolkata&apos;s finest luxury floral boutique
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline underline-offset-4 transition-all"
                    >
                        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                            <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
