import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Phone, MapPin, Clock, Heart } from 'lucide-react';
import WhatsappIcon from '@/components/ui/whatsapp-icon';

export default function Footer() {
    return (
        <footer className="bg-primary text-white/80">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group" aria-label="New Eco Roses — Home">
                            <Image
                                src="/favicon_io/android-chrome-512x512.png"
                                alt="New Eco Roses Logo"
                                width={52}
                                height={52}
                                className="rounded-full ring-1 ring-white/20 group-hover:ring-white/50 transition-all duration-300 drop-shadow-md"
                            />
                            <span className="font-serif text-xl font-bold tracking-[0.08em] text-white group-hover:text-white/80 transition-colors duration-300">
                                NEW ECO ROSES
                            </span>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
                            Kolkata&apos;s finest luxury floral &amp; gifting boutique. Hand-curated roses and bespoke gifts, delivered with love.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-all duration-300"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="https://wa.me/919936911611"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-all duration-300"
                                aria-label="WhatsApp"
                            >
                                <WhatsappIcon size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif text-base text-white mb-6 tracking-wide">Shop</h4>
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
                                        className="text-sm text-white/40 hover:text-white transition-colors duration-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Delivery & Support */}
                    <div>
                        <h4 className="font-serif text-base text-white mb-6 tracking-wide">Delivery</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Clock size={16} className="text-white mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-white/40">Mon – Sat: 9 AM – 9 PM<br />Sun: 10 AM – 6 PM</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="text-white mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-white/40">Same-day delivery within 10 km radius</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Heart size={16} className="text-white mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-white/40">Premium luxury packaging included</span>
                            </li>
                        </ul>
                    </div>

                    {/* Visit Us / Map */}
                    <div>
                        <h4 className="font-serif text-base text-white mb-6 tracking-wide">Visit Our Outlets</h4>
                        <div className="space-y-3 mb-4">
                            <div>
                                <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Outlet 1 — Regent Park</p>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    140/1/306, Netaji Subhash Chandra Bose Rd, Regent Park, Kolkata 700040
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Outlet 2 — New Alipore</p>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    92/C/1, BL-J, Sahapur, New Alipore, Kolkata 700053
                                </p>
                                <a
                                    href="https://maps.app.goo.gl/iGyTCXfQG8oEZmv57"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-white/60 hover:text-white underline inline-flex items-center gap-1 mt-0.5"
                                >
                                    📍 View Map ↗
                                </a>
                            </div>
                        </div>
                        <p className="text-xs text-white/40 mb-1">📞 +91 99369 11611 / +91 91995 01655</p>
                        <p className="text-xs text-white/40 mb-4">✉️ newecoroses@gmail.com</p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/30">
                        &copy; 2026 New Eco Roses. All rights reserved — Crafted with love in Kolkata.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-xs text-white/30 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-xs text-white/30 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>

            {/* Made by Oryxen */}
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-center items-center">
                    <p className="text-[11px] text-white/20 tracking-widest uppercase font-light">
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
                </div>
            </div>
        </footer>
    );
}
