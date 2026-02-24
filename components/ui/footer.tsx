import Link from 'next/link';
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
                        <Link href="/" className="inline-block mb-6">
                            <span className="font-serif text-2xl font-bold tracking-[0.08em] text-white">
                                NEW ECO ROSES
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block ml-0.5 mb-2" />
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
                        <h4 className="font-serif text-base text-white mb-6 tracking-wide">Visit Our Store</h4>
                        <p className="text-sm text-white/40 mb-4">
                            140/1/306, Netaji Subhash Chandra Bose Rd,<br />
                            near RUPAYAN JEWELLERY, Regent Colony,<br />
                            Regent Park, Kolkata, West Bengal 700040
                        </p>
                        <p className="text-sm text-white/40 mb-1">📞 +91 99369 11611</p>
                        <p className="text-sm text-white/40 mb-4">✉️ newecoroses@gmail.com</p>
                        <div className="w-full h-36 rounded-lg overflow-hidden border border-white/10 opacity-80 hover:opacity-100 transition-opacity">
                            <iframe
                                src="https://maps.google.com/maps?q=22.4855973,88.3518101&z=15&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                                allowFullScreen
                                loading="lazy"
                                title="Store Location"
                            />
                        </div>
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
                            className="text-white/40 hover:text-white transition-colors duration-300 font-medium tracking-[0.15em]"
                        >
                            Oryxen
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
