import Link from 'next/link';
import Image from 'next/image';
import { Phone, Clock, MapPin, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-[#181a16] via-[#121410] to-[#0c0d0a] text-white/90 relative overflow-hidden border-t border-amber-900/20">
            {/* Top Metallic Shimmer Accent */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
                    
                    {/* Brand Column (3 cols) */}
                    <div className="lg:col-span-4 space-y-5">
                        <Link href="/" className="inline-flex items-center gap-3 group" aria-label="New Eco Roses — Home">
                            <Image
                                src="/favicon_io/android-chrome-512x512.png"
                                alt="New Eco Roses Logo"
                                width={52}
                                height={52}
                                className="rounded-full ring-2 ring-amber-400/40 group-hover:ring-amber-400 transition-all duration-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                            />
                            <span className="font-serif text-2xl font-bold tracking-[0.08em] bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent group-hover:brightness-125 transition-all">
                                NEW ECO ROSES
                            </span>
                        </Link>

                        <p className="text-gray-300 text-sm leading-relaxed max-w-sm font-light">
                            Kolkata&apos;s finest luxury floral &amp; gifting boutique. Hand-curated roses and bespoke gifts, delivered with love to your doorstep.
                        </p>

                        {/* Social Badges */}
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://www.instagram.com/newecoroses___kolkata/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/50 flex items-center justify-center transition-all duration-300 group shadow-md"
                                aria-label="Instagram"
                                title="Follow us on Instagram"
                            >
                                <img src="/social%20svgs/instagram-logo-facebook-2-svgrepo-com%20%281%29.svg" alt="Instagram" className="w-5 h-5 filter invert group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="https://wa.me/919936911611"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/50 flex items-center justify-center transition-all duration-300 group shadow-md"
                                aria-label="WhatsApp"
                                title="Message on WhatsApp"
                            >
                                <img src="/social%20svgs/whatsapp-svgrepo-com.svg" alt="WhatsApp" className="w-5 h-5 filter invert group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="/socials"
                                className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-blue-500/20 border border-white/10 hover:border-blue-400/50 flex items-center justify-center transition-all duration-300 group shadow-md"
                                aria-label="Google Reviews & Maps"
                                title="Google Reviews & Store Locations"
                            >
                                <img src="/social%20svgs/google-maps-svgrepo-com.svg" alt="Google Maps" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Column (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-serif text-base text-white font-semibold mb-5 tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Shop
                        </h4>
                        <ul className="space-y-3">
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
                                        className="text-xs md:text-sm text-gray-300 hover:text-amber-300 transition-colors duration-300 font-light inline-block hover:translate-x-1 transform transition-transform"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Delivery & Support Column (3 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-serif text-base text-white font-semibold mb-5 tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Delivery
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Clock size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                <span className="text-xs md:text-sm text-gray-300 font-light leading-relaxed">
                                    Mon – Sat: 9 AM – 9 PM<br />Sun: 10 AM – 6 PM
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                <span className="text-xs md:text-sm text-gray-300 font-light leading-relaxed">
                                    Same-day delivery within 10 km radius
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Heart size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                                <span className="text-xs md:text-sm text-gray-300 font-light leading-relaxed">
                                    Signature luxury packaging included
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Visit Our Outlets Cards Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <h4 className="font-serif text-base text-white font-semibold mb-4 tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Visit Our Outlets
                        </h4>

                        {/* Outlet 1 Card */}
                        <div className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 transition-all duration-300 space-y-2.5 group shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                                    Outlet 1 — Regent Park
                                </span>
                            </div>
                            <p className="text-xs text-gray-200 leading-relaxed font-normal">
                                140/1/306, Netaji Subhash Chandra Bose Rd, Regent Park, Kolkata 700040
                            </p>
                            <div>
                                <a
                                    href="https://maps.app.goo.gl/RbKpGWan1p9qDxhr6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-black text-xs font-semibold px-3 py-1.5 rounded-xl border border-amber-400/30 transition-all duration-300 group/btn"
                                >
                                    <img src="/social%20svgs/google-maps-svgrepo-com.svg" alt="Google Maps" className="w-4 h-4 object-contain group-hover/btn:scale-110 transition-transform" />
                                    <span>View Map ↗</span>
                                </a>
                            </div>
                        </div>

                        {/* Outlet 2 Card */}
                        <div className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/40 rounded-2xl p-4 transition-all duration-300 space-y-2.5 group shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
                                    Outlet 2 — New Alipore
                                </span>
                            </div>
                            <p className="text-xs text-gray-200 leading-relaxed font-normal">
                                92/C/1, BL-J, Sahapur, New Alipore, Kolkata 700053
                            </p>
                            <div>
                                <a
                                    href="https://maps.app.goo.gl/iGyTCXfQG8oEZmv57"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-emerald-400/10 hover:bg-emerald-400 text-emerald-300 hover:text-black text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-400/30 transition-all duration-300 group/btn"
                                >
                                    <img src="/social%20svgs/google-maps-svgrepo-com.svg" alt="Google Maps" className="w-4 h-4 object-contain group-hover/btn:scale-110 transition-transform" />
                                    <span>View Map ↗</span>
                                </a>
                            </div>
                        </div>

                        {/* Contact Badges */}
                        <div className="space-y-2 pt-1">
                            <div className="flex items-center gap-2 text-xs text-gray-200 bg-white/[0.04] px-3 py-2 rounded-xl border border-white/5">
                                <Phone size={14} className="text-amber-400 flex-shrink-0" />
                                <span className="font-medium">+91 99369 11611 / +91 91995 01655</span>
                            </div>
                            <a
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=newecoroses@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-amber-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-2 rounded-xl border border-white/5 hover:border-amber-400/30 transition-all group"
                                title="Open Gmail to send email"
                            >
                                <span className="text-xs">✉️</span>
                                <span className="font-medium underline underline-offset-2 decoration-amber-400/40">newecoroses@gmail.com</span>
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Legal & Attribution Bar */}
            <div className="border-t border-white/10 bg-black/40">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-xs text-gray-400 font-light">
                        &copy; 2026 New Eco Roses. All rights reserved — Crafted with <span className="inline-block text-rose-500 animate-pulse mx-0.5">❤️</span> in Kolkata.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-xs text-gray-400 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-xs text-gray-400 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>

            {/* Made by Oryxen & Creative Developer Credit */}
            <div className="border-t border-white/5 bg-black/60 py-3.5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
                    <p className="text-[11px] text-gray-400 tracking-widest uppercase font-light">
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

                    <p className="text-[11px] text-gray-300 font-light tracking-wide flex items-center gap-1.5">
                        <span className="text-amber-400 font-medium">⚡ Web Architecture &amp; Experience Engineered by</span>
                        <a
                            href="https://www.linkedin.com/in/adityabuilds/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-white hover:text-amber-300 underline underline-offset-4 decoration-amber-400/50 hover:decoration-amber-300 transition-all inline-flex items-center gap-1 group"
                        >
                            <span>Aditya Choudhury</span>
                            <span className="text-[10px] opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
