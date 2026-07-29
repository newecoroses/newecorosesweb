'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Clock, MapPin, Heart, X, ExternalLink, Code2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
    const [isDevModalOpen, setIsDevModalOpen] = useState(false);

    return (
        <footer className="bg-primary text-white relative overflow-hidden">
            {/* Top Shimmer Accent */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-18 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                    
                    {/* Brand Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <Link href="/" className="inline-flex items-center gap-3 group" aria-label="New Eco Roses — Home">
                            <Image
                                src="/favicon_io/android-chrome-512x512.png"
                                alt="New Eco Roses Logo"
                                width={52}
                                height={52}
                                className="rounded-full ring-2 ring-white/40 group-hover:ring-white transition-all duration-300 drop-shadow-md"
                            />
                            <span className="font-serif text-2xl font-bold tracking-[0.08em] text-white group-hover:text-amber-200 transition-colors">
                                NEW ECO ROSES
                            </span>
                        </Link>

                        <p className="text-white/85 text-sm leading-relaxed max-w-sm font-light">
                            Kolkata&apos;s finest luxury floral &amp; gifting boutique. Hand-curated roses and bespoke gifts, delivered with love to your doorstep.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://www.instagram.com/newecoroses___kolkata/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 group shadow-sm"
                                aria-label="Instagram"
                                title="Follow us on Instagram"
                            >
                                <img src="/social%20svgs/instagram-logo-facebook-2-svgrepo-com%20%281%29.svg" alt="Instagram" className="w-5 h-5 filter invert group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="https://wa.me/919936911611"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 group shadow-sm"
                                aria-label="WhatsApp"
                                title="Message on WhatsApp"
                            >
                                <img src="/social%20svgs/whatsapp-svgrepo-com.svg" alt="WhatsApp" className="w-5 h-5 filter invert group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="/socials"
                                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 group shadow-sm"
                                aria-label="Google Reviews & Maps"
                                title="Google Reviews & Store Locations"
                            >
                                <img src="/social%20svgs/google-maps-svgrepo-com.svg" alt="Google Maps" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Column (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-serif text-base text-white font-semibold mb-4 tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            Shop
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { href: '/shop', label: 'All Collections' },
                                { href: '/shop?cat=fresh-flower', label: 'Fresh Flower' },
                                { href: '/shop?cat=chocolate-bouquet', label: 'Chocolate Bouquet' },
                                { href: '/shop?cat=personalized', label: 'Personalized' },
                                { href: '/shop?cat=hamper', label: 'Hamper' },
                                { href: '/shop?cat=balloon-bouquet', label: 'Balloon Bouquet' }
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-xs md:text-sm text-white/80 hover:text-white transition-colors duration-300 font-light inline-block hover:translate-x-1 transform"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Delivery & Support Column (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-serif text-base text-white font-semibold mb-4 tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            Delivery
                        </h4>
                        <ul className="space-y-3.5">
                            <li className="flex items-start gap-2.5">
                                <Clock size={16} className="text-white mt-0.5 flex-shrink-0" />
                                <span className="text-xs md:text-sm text-white/85 font-light leading-relaxed">
                                    Mon – Sat: 9 AM – 9 PM<br />Sun: 10 AM – 6 PM
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPin size={16} className="text-white mt-0.5 flex-shrink-0" />
                                <span className="text-xs md:text-sm text-white/85 font-light leading-relaxed">
                                    Same-day delivery within 10 km radius
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Heart size={16} className="text-rose-200 mt-0.5 flex-shrink-0" />
                                <span className="text-xs md:text-sm text-white/85 font-light leading-relaxed">
                                    Signature luxury packaging included
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Visit Our Outlets Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-3.5">
                        <h4 className="font-serif text-base text-white font-semibold mb-4 tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            Visit Our Outlets
                        </h4>

                        {/* Outlet 1 Card */}
                        <div className="bg-black/15 hover:bg-black/25 border border-white/20 rounded-2xl p-3.5 transition-all duration-300 space-y-2 group shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20">
                                    Outlet 1 — Regent Park
                                </span>
                            </div>
                            <p className="text-xs text-white/95 leading-relaxed font-normal">
                                140/1/306, Netaji Subhash Chandra Bose Rd, Regent Park, Kolkata 700040
                            </p>
                            <div>
                                <a
                                    href="https://maps.app.goo.gl/RbKpGWan1p9qDxhr6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white text-white hover:text-black text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/30 transition-all duration-300 group/btn"
                                >
                                    <img src="/social%20svgs/google-maps-svgrepo-com.svg" alt="Google Maps" className="w-4 h-4 object-contain group-hover/btn:scale-110 transition-transform" />
                                    <span>View Map ↗</span>
                                </a>
                            </div>
                        </div>

                        {/* Outlet 2 Card */}
                        <div className="bg-black/15 hover:bg-black/25 border border-white/20 rounded-2xl p-3.5 transition-all duration-300 space-y-2 group shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20">
                                    Outlet 2 — New Alipore
                                </span>
                            </div>
                            <p className="text-xs text-white/95 leading-relaxed font-normal">
                                92/C/1, BL-J, Sahapur, New Alipore, Kolkata 700053
                            </p>
                            <div>
                                <a
                                    href="https://maps.app.goo.gl/iGyTCXfQG8oEZmv57"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white text-white hover:text-black text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/30 transition-all duration-300 group/btn"
                                >
                                    <img src="/social%20svgs/google-maps-svgrepo-com.svg" alt="Google Maps" className="w-4 h-4 object-contain group-hover/btn:scale-110 transition-transform" />
                                    <span>View Map ↗</span>
                                </a>
                            </div>
                        </div>

                        {/* Contact Info Badges */}
                        <div className="space-y-2 pt-1">
                            <div className="flex items-center gap-2 text-xs text-white bg-black/15 px-3 py-2 rounded-xl border border-white/15">
                                <Phone size={14} className="text-white flex-shrink-0" />
                                <span className="font-medium">+91 99369 11611 / +91 91995 01655</span>
                            </div>
                            <a
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=newecoroses@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-white hover:text-amber-200 bg-black/15 hover:bg-black/30 px-3 py-2 rounded-xl border border-white/15 transition-all group"
                                title="Open Gmail to send email"
                            >
                                <span className="text-xs">✉️</span>
                                <span className="font-medium underline underline-offset-2 decoration-white/40">newecoroses@gmail.com</span>
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/15 bg-black/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
                    <p className="text-xs text-white/85 font-light">
                        &copy; 2026 New Eco Roses. All rights reserved — Crafted with <span className="inline-block text-rose-300 animate-pulse mx-0.5">❤️</span> in Kolkata.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-xs text-white/85 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-xs text-white/85 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>

            {/* Made by Oryxen & Compact Developer Trigger Bar */}
            <div className="border-t border-white/10 bg-black/20 py-3">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
                    <p className="text-[11px] text-white/70 tracking-widest uppercase font-light">
                        Made by{' '}
                        <a
                            href="https://oryxen.co.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block font-semibold tracking-[0.2em] bg-gradient-to-r from-amber-200 via-yellow-50 to-amber-200 bg-[length:200%_100%] bg-clip-text text-transparent animate-gold-shimmer hover:brightness-150 transition-all duration-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]"
                        >
                            ORYXEN
                        </a>
                    </p>

                    {/* Premium Developer Trigger Button */}
                    <button
                        type="button"
                        onClick={() => setIsDevModalOpen(true)}
                        className="group relative inline-flex items-center cursor-pointer"
                        aria-label="View developer profile"
                    >
                        {/* Soft ambient glow */}
                        <span className="absolute inset-0 rounded-full bg-amber-400/15 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Pill shell */}
                        <span className="relative inline-flex items-center gap-3 border border-white/[0.09] group-hover:border-amber-400/30 rounded-full pl-1 pr-4 py-1 transition-all duration-500 bg-white/[0.02] group-hover:bg-white/[0.05]">

                            {/* Icon circle */}
                            <span className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/20 group-hover:border-amber-400/50 group-hover:bg-amber-400/15 flex items-center justify-center flex-shrink-0 transition-all duration-500">
                                <svg className="w-3 h-3 text-amber-300/80 group-hover:text-amber-200 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="16 18 22 12 16 6" />
                                    <polyline points="8 6 2 12 8 18" />
                                </svg>
                            </span>

                            {/* Label stack */}
                            <span className="flex flex-col items-start leading-none">
                                <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 font-medium transition-colors">Crafted by</span>
                                <span className="text-[12px] font-semibold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-[length:200%_100%] bg-clip-text text-transparent animate-gold-shimmer tracking-wide mt-0.5">Aditya Choudhury</span>
                            </span>

                            {/* Arrow */}
                            <svg className="w-2.5 h-2.5 text-white/20 group-hover:text-amber-300/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

            {/* Developer Details Modal */}
            <AnimatePresence>
                {isDevModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDevModalOpen(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="relative z-10 w-full sm:max-w-sm overflow-hidden rounded-t-[2.5rem] sm:rounded-3xl"
                        >
                            {/* Glass layer */}
                            <div className="relative bg-[#12140f]/95 border border-white/[0.08] shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)]">

                                {/* Ambient light blobs */}
                                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute bottom-0 -right-10 w-32 h-32 bg-emerald-600/8 rounded-full blur-2xl pointer-events-none" />

                                {/* Top drag handle (mobile) */}
                                <div className="flex justify-center pt-3 pb-0 sm:hidden">
                                    <div className="w-8 h-1 bg-white/20 rounded-full" />
                                </div>

                                <div className="px-6 pt-4 pb-6 sm:px-8 sm:pt-6 sm:pb-8 space-y-5">

                                    {/* Header row */}
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-1.5 mb-2">
                                                {/* Premium code SVG */}
                                                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.25em] font-semibold text-amber-400/80 bg-amber-400/8 border border-amber-400/15 px-2 py-0.5 rounded-full">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
                                                        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                                                    </svg>
                                                    Web Developer
                                                </span>
                                            </div>
                                            <h3 className="font-serif text-2xl font-bold text-white tracking-tight">Aditya Choudhury</h3>
                                            <p className="text-[11px] text-white/40 font-light tracking-wide">Freelance / Full-Stack Architect</p>
                                        </div>
                                        <button
                                            onClick={() => setIsDevModalOpen(false)}
                                            className="mt-1 w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/80 transition-all"
                                            aria-label="Close"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    {/* Thin divider with shimmer */}
                                    <div className="h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

                                    {/* Skills chips */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {['Next.js', 'React', 'Tailwind CSS', 'Supabase', 'UI/UX'].map(s => (
                                            <span key={s} className="text-[10px] text-white/50 bg-white/[0.05] border border-white/[0.07] px-2.5 py-1 rounded-full font-medium">
                                                {s}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Bio */}
                                    <p className="text-[13px] text-white/55 font-light leading-relaxed">
                                        Engineered this platform, from database architecture to micro-animations, with a sharp focus on performance, aesthetics, and premium experience.
                                    </p>

                                    {/* CTA */}
                                    <a
                                        href="https://www.linkedin.com/in/adityabuilds/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/cta relative w-full flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-5 py-3.5 transition-all duration-300"
                                    >
                                        {/* Button background */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-[length:200%_100%] animate-gold-shimmer" />
                                        <span className="absolute inset-0 opacity-0 group-hover/cta:opacity-100 bg-white/10 transition-opacity" />
                                        {/* LinkedIn SVG */}
                                        <svg className="relative w-4 h-4 text-black/80 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                        <span className="relative text-sm font-bold text-black/80 tracking-wide">Connect on LinkedIn</span>
                                        <svg className="relative w-3.5 h-3.5 text-black/70 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </footer>
    );
}
