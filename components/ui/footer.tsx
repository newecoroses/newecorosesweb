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
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsDevModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ type: "spring", stiffness: 350, damping: 32 }}
                            className="relative z-10 w-full sm:max-w-[460px]"
                        >
                            {/* Outer glass shell */}
                            <div className="relative overflow-hidden rounded-t-[2.5rem] sm:rounded-[2rem] border border-white/[0.1] bg-white/[0.04] backdrop-blur-3xl shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_40px_80px_rgba(0,0,0,0.9)] max-h-[90vh] sm:max-h-[82vh] flex flex-col">

                                {/* Subtle dot-grid texture overlay */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                                {/* Top white glow arc */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                                {/* Mobile drag handle */}
                                <div className="flex justify-center pt-3 sm:hidden flex-shrink-0">
                                    <div className="w-9 h-[3px] bg-white/20 rounded-full" />
                                </div>

                                {/* Scrollable content */}
                                <div className="px-7 pt-5 pb-7 sm:px-8 sm:pt-7 sm:pb-8 space-y-6 overflow-y-auto">

                                    {/* ── Header ── */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            {/* Role tag */}
                                            <div className="inline-flex items-center gap-1.5 border border-white/[0.1] bg-white/[0.05] rounded-full px-2.5 py-1 mb-3">
                                                <svg className="w-2.5 h-2.5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                                                </svg>
                                                <span className="text-[9px] uppercase tracking-[0.25em] text-white/45 font-semibold">Full-Stack Developer</span>
                                            </div>
                                            <h3 className="text-[26px] font-bold text-white tracking-tight leading-none">Aditya Choudhury</h3>
                                            <p className="text-[11px] text-white/30 font-light mt-1.5 tracking-wider">Freelance Architect · Kolkata, India</p>
                                        </div>
                                        <button
                                            onClick={() => setIsDevModalOpen(false)}
                                            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-white/70 transition-all flex-shrink-0 mt-1"
                                            aria-label="Close"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    {/* ── Divider ── */}
                                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                    {/* ── Tech Stack ── */}
                                    <div className="space-y-3">
                                        <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-semibold">Technologies</p>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                {
                                                    label: 'Next.js',
                                                    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/></svg>
                                                },
                                                {
                                                    label: 'React',
                                                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-3 h-3"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>
                                                },
                                                {
                                                    label: 'TypeScript',
                                                    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>
                                                },
                                                {
                                                    label: 'Tailwind CSS',
                                                    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>
                                                },
                                                {
                                                    label: 'Supabase',
                                                    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.199 12.787.752 13.834 1.676 13.834h8.85c.347 0 .655.194.802.5l2.604 5.54c.394.836 1.638.63 1.738-.289l.943-12.345c.038-.495-.29-.953-.785-1.042L11.9 5.2V1.036z"/></svg>
                                                },
                                                {
                                                    label: 'PostgreSQL',
                                                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-3 h-3" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5"/><path d="M3 12c0 1.657 4.03 3 9 3s9-1.343 9-3"/></svg>
                                                },
                                                {
                                                    label: 'Framer Motion',
                                                    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/></svg>
                                                },
                                            ].map(s => (
                                                <span key={s.label} className="inline-flex items-center gap-1.5 text-[10px] text-white/40 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] px-2.5 py-1.5 rounded-lg font-medium transition-colors">
                                                    <span className="text-white/30">{s.svg}</span>
                                                    {s.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Divider ── */}
                                    {/* ── Bio ── */}
                                    <p className="text-[13px] text-white/40 font-light leading-relaxed tracking-wide">
                                        Freelance full-stack developer specializing in building premium web platforms, e-commerce systems, backend APIs, and polished user interfaces. Every line of this platform was designed and engineered by Aditya.
                                    </p>

                                    {/* ── CTA ── */}
                                    <a
                                        href="https://www.linkedin.com/in/adityabuilds/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/cta relative w-full flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-5 py-3.5 border border-white/[0.1] hover:border-white/[0.2] bg-white/[0.05] hover:bg-white/[0.09] transition-all duration-400"
                                    >
                                        {/* Subtle shine sweep */}
                                        <span className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                                        {/* LinkedIn SVG */}
                                        <svg className="relative w-4 h-4 text-white/60 group-hover/cta:text-white/90 flex-shrink-0 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                        <span className="relative text-sm font-semibold text-white/60 group-hover/cta:text-white/90 tracking-wide transition-colors">Connect on LinkedIn</span>
                                        <svg className="relative w-3.5 h-3.5 text-white/30 group-hover/cta:text-white/70 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
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
