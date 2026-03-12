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
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
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
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a9.18 9.18 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 md:w-8 md:h-8">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
            </svg>
        ),
        cta: 'Visit Website',
        badge: 'Shop Online',
    },
    {
        id: 'google',
        name: 'Google Reviews',
        handle: 'New Eco Roses, Kolkata',
        description: 'Loved our flowers? Leave us a review on Google and help others discover us!',
        href: 'https://share.google/Ub9RaULfeFClnGdwn',
        gradient: 'from-[#4285F4] via-[#EA4335] to-[#FBBC05]',
        hoverGlow: 'hover:shadow-[0_8px_40px_rgba(66,133,244,0.35)]',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="white" />
            </svg>
        ),
        cta: 'Rate Us on Google',
        badge: 'Reviews',
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
                            {/* Icon bubble */}
                            <div className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${social.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
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
