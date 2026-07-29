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
            <svg viewBox="0 0 32 32" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                <path d="M22.3,8.4c-0.8,0-1.4,0.6-1.4,1.4c0,0.8,0.6,1.4,1.4,1.4c0.8,0,1.4-0.6,1.4-1.4C23.7,9,23.1,8.4,22.3,8.4z" />
                <path d="M16,10.2c-3.3,0-5.9,2.7-5.9,5.9s2.7,5.9,5.9,5.9s5.9-2.7,5.9-5.9S19.3,10.2,16,10.2z M16,19.9c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C19.8,18.2,18.1,19.9,16,19.9z" />
                <path d="M20.8,4h-9.5C7.2,4,4,7.2,4,11.2v9.5c0,4,3.2,7.2,7.2,7.2h9.5c4,0,7.2-3.2,7.2-7.2v-9.5C28,7.2,24.8,4,20.8,4z M25.7,20.8c0,2.7-2.2,5-5,5h-9.5c-2.7,0-5-2.2-5-5v-9.5c0-2.7,2.2-5,5-5h9.5c2.7,0,5,2.2,5,5V20.8z" />
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
            <svg viewBox="0 0 32 32" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z" />
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
            <svg viewBox="0 0 512 512" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M418.275,146h-46.667c-5.365-22.513-12.324-43.213-20.587-61.514c15.786,8.776,30.449,19.797,43.572,32.921C403.463,126.277,411.367,135.854,418.275,146z M452,256c0,17.108-2.191,33.877-6.414,50h-64.034c1.601-16.172,2.448-32.887,2.448-50s-0.847-33.828-2.448-50h64.034C449.809,222.123,452,238.892,452,256z M256,452c-5.2,0-21.048-10.221-36.844-41.813c-6.543-13.087-12.158-27.994-16.752-44.187h107.191c-4.594,16.192-10.208,31.1-16.752,44.187C277.048,441.779,261.2,452,256,452z M190.813,306c-1.847-16.247-2.813-33.029-2.813-50s0.966-33.753,2.813-50h130.374c1.847,16.247,2.813,33.029,2.813,50s-0.966,33.753-2.813,50H190.813z M60,256c0-17.108,2.191-33.877,6.414-50h64.034c-1.601,16.172-2.448-32.887-2.448-50s0.847,33.828,2.448,50H66.414C62.191,289.877,60,273.108,60,256z M256,60c5.2,0,21.048,10.221,36.844,41.813c6.543,13.087,12.158,27.994,16.752,44.187H202.404c4.594-16.192,10.208-31.1,16.752-44.187C234.952,70.221,250.8,60,256,60z M160.979,84.486c-8.264,18.301-15.222,39-20.587,61.514H93.725c6.909-10.146,14.812-19.723,23.682-28.593C130.531,104.283,145.193,93.262,160.979,84.486z M93.725,366h46.667c5.365,22.513,12.324,43.213,20.587,61.514c-15.786-8.776-30.449-19.797-43.572-32.921C108.537,385.723,100.633,376.146,93.725,366z M351.021,427.514c8.264-18.301,15.222-39,20.587-61.514h46.667c-6.909,10.146-14.812,19.723-23.682,28.593C381.469,407.717,366.807,418.738,351.021,427.514z" />
            </svg>
        ),
        cta: 'Visit Website',
        badge: 'Shop Online',
    },
    {
        id: 'google-outlet1',
        name: 'Google Review — Outlet 1',
        handle: 'Regent Park Store, Kolkata',
        description: 'Loved your experience at our Regent Park outlet? Leave us a review on Google!',
        href: 'https://maps.google.com/?q=NEW+ECO+ROSES,+140/1/306,+Netaji+Subhash+Chandra+Bose+Rd,+Regent+Park,+Kolkata+700040',
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
