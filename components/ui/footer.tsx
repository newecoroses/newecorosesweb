import Link from 'next/link';
import Image from 'next/image';
import { Phone, Clock, MapPin, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#c5ad1b] text-gray-900 relative overflow-hidden">
            {/* Top Shimmer Accent */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-black/20 to-transparent" />

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
                                className="rounded-full ring-2 ring-black/30 group-hover:ring-black/60 transition-all duration-300 drop-shadow-md"
                            />
                            <span className="font-serif text-2xl font-bold tracking-[0.08em] text-gray-900 group-hover:text-black transition-colors">
                                NEW ECO ROSES
                            </span>
                        </Link>

                        <p className="text-gray-900/80 text-sm leading-relaxed max-w-sm font-normal">
                            Kolkata&apos;s finest luxury floral &amp; gifting boutique. Hand-curated roses and bespoke gifts, delivered with love to your doorstep.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://www.instagram.com/newecoroses___kolkata/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-black/10 hover:bg-black/20 border border-black/15 flex items-center justify-center transition-all duration-300 group shadow-sm"
                                aria-label="Instagram"
                                title="Follow us on Instagram"
                            >
                                <img src="/social%20svgs/instagram-logo-facebook-2-svgrepo-com%20%281%29.svg" alt="Instagram" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="https://wa.me/919936911611"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-black/10 hover:bg-black/20 border border-black/15 flex items-center justify-center transition-all duration-300 group shadow-sm"
                                aria-label="WhatsApp"
                                title="Message on WhatsApp"
                            >
                                <img src="/social%20svgs/whatsapp-svgrepo-com.svg" alt="WhatsApp" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="/socials"
                                className="w-10 h-10 rounded-xl bg-black/10 hover:bg-black/20 border border-black/15 flex items-center justify-center transition-all duration-300 group shadow-sm"
                                aria-label="Google Reviews & Maps"
                                title="Google Reviews & Store Locations"
                            >
                                <img src="/social%20svgs/google-maps-svgrepo-com.svg" alt="Google Maps" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Column (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-serif text-base text-gray-900 font-bold mb-4 tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
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
                                        className="text-xs md:text-sm text-gray-900/80 hover:text-black font-medium transition-colors duration-300 inline-block hover:translate-x-1 transform"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Delivery & Support Column (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-serif text-base text-gray-900 font-bold mb-4 tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                            Delivery
                        </h4>
                        <ul className="space-y-3.5">
                            <li className="flex items-start gap-2.5">
                                <Clock size={16} className="text-gray-900 mt-0.5 flex-shrink-0" />
                                <span className="text-xs md:text-sm text-gray-900/80 font-medium leading-relaxed">
                                    Mon – Sat: 9 AM – 9 PM<br />Sun: 10 AM – 6 PM
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPin size={16} className="text-gray-900 mt-0.5 flex-shrink-0" />
                                <span className="text-xs md:text-sm text-gray-900/80 font-medium leading-relaxed">
                                    Same-day delivery within 10 km radius
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Heart size={16} className="text-rose-700 mt-0.5 flex-shrink-0" />
                                <span className="text-xs md:text-sm text-gray-900/80 font-medium leading-relaxed">
                                    Signature luxury packaging included
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Visit Our Outlets Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-3.5">
                        <h4 className="font-serif text-base text-gray-900 font-bold mb-4 tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                            Visit Our Outlets
                        </h4>

                        {/* Outlet 1 Card */}
                        <div className="bg-black/10 hover:bg-black/15 border border-black/15 rounded-2xl p-3.5 transition-all duration-300 space-y-2 group shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest bg-black/10 px-2.5 py-0.5 rounded-full">
                                    Outlet 1 — Regent Park
                                </span>
                            </div>
                            <p className="text-xs text-gray-900 leading-relaxed font-medium">
                                140/1/306, Netaji Subhash Chandra Bose Rd, Regent Park, Kolkata 700040
                            </p>
                            <div>
                                <a
                                    href="https://maps.app.goo.gl/RbKpGWan1p9qDxhr6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-black/15 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-black/20 transition-all duration-300 group/btn"
                                >
                                    <img src="/social%20svgs/google-maps-svgrepo-com.svg" alt="Google Maps" className="w-4 h-4 object-contain group-hover/btn:scale-110 transition-transform" />
                                    <span>View Map ↗</span>
                                </a>
                            </div>
                        </div>

                        {/* Outlet 2 Card */}
                        <div className="bg-black/10 hover:bg-black/15 border border-black/15 rounded-2xl p-3.5 transition-all duration-300 space-y-2 group shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest bg-black/10 px-2.5 py-0.5 rounded-full">
                                    Outlet 2 — New Alipore
                                </span>
                            </div>
                            <p className="text-xs text-gray-900 leading-relaxed font-medium">
                                92/C/1, BL-J, Sahapur, New Alipore, Kolkata 700053
                            </p>
                            <div>
                                <a
                                    href="https://maps.app.goo.gl/iGyTCXfQG8oEZmv57"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-black/15 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-black/20 transition-all duration-300 group/btn"
                                >
                                    <img src="/social%20svgs/google-maps-svgrepo-com.svg" alt="Google Maps" className="w-4 h-4 object-contain group-hover/btn:scale-110 transition-transform" />
                                    <span>View Map ↗</span>
                                </a>
                            </div>
                        </div>

                        {/* Contact Info Badges */}
                        <div className="space-y-2 pt-1">
                            <div className="flex items-center gap-2 text-xs text-gray-900 bg-black/10 px-3 py-2 rounded-xl border border-black/15">
                                <Phone size={14} className="text-gray-900 flex-shrink-0" />
                                <span className="font-semibold">+91 99369 11611 / +91 91995 01655</span>
                            </div>
                            <a
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=newecoroses@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-gray-900 hover:text-black bg-black/10 hover:bg-black/20 px-3 py-2 rounded-xl border border-black/15 transition-all group"
                                title="Open Gmail to send email"
                            >
                                <span className="text-xs">✉️</span>
                                <span className="font-semibold underline underline-offset-2 decoration-black/40">newecoroses@gmail.com</span>
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-black/15 bg-black/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
                    <p className="text-xs text-gray-900/80 font-medium">
                        &copy; 2026 New Eco Roses. All rights reserved — Crafted with <span className="inline-block text-rose-700 animate-pulse mx-0.5">❤️</span> in Kolkata.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-xs text-gray-900/80 hover:text-black font-medium transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-xs text-gray-900/80 hover:text-black font-medium transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>

            {/* Made by Oryxen & Developer Signature Bar */}
            <div className="border-t border-black/10 bg-black/10 py-3.5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
                    <p className="text-[11px] text-gray-900/80 tracking-widest uppercase font-medium">
                        Made by{' '}
                        <a
                            href="https://oryxen.co.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block font-bold tracking-[0.2em] text-gray-900 hover:text-black transition-all duration-300"
                        >
                            ORYXEN
                        </a>
                    </p>

                    <p className="text-xs text-gray-900 font-medium tracking-wide flex items-center gap-1">
                        <span>⚡ Web Architecture &amp; Experience Engineered by</span>
                        <a
                            href="https://www.linkedin.com/in/adityabuilds/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-gray-900 hover:text-black underline underline-offset-4 decoration-black/40 transition-all inline-flex items-center gap-0.5"
                        >
                            <span>Aditya Choudhury</span>
                            <span className="text-[10px]">↗</span>
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
