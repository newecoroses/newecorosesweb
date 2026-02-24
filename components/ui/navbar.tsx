'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementBar from '@/components/ui/announcement-bar';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import { fetchWhatsappSettings } from '@/lib/supabase';

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/#categories', label: 'Collections' },
    { href: '/#about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

const FALLBACK_ORDER_LINK = 'https://wa.me/919936911611?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order.';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [orderLink, setOrderLink] = useState(FALLBACK_ORDER_LINK);
    const pathname = usePathname();
    const isScrolled = hasScrolled;

    useEffect(() => {
        const handleScroll = () => setHasScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetchWhatsappSettings().then(s => {
            if (s?.phone_number) {
                const msg = s.default_message ?? 'Hi, I would like to place an order.';
                setOrderLink(`https://wa.me/${s.phone_number}?text=${encodeURIComponent(msg)}`);
            }
        }).catch(() => { });
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            <header className="fixed w-full z-50 top-0 left-0 flex flex-col">
                <AnnouncementBar />
                <nav
                    className={`w-full transition-all duration-500 ${isScrolled
                        ? 'glass py-3 shadow-soft'
                        : 'bg-transparent py-5'
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/" className="group relative flex items-center gap-2">
                            <Gift size={28} className="text-foreground group-hover:text-primary transition-colors duration-300" />
                            <span className="font-serif text-xl sm:text-2xl lg:text-[1.65rem] font-bold tracking-[0.08em] text-foreground">
                                New Eco Roses
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block mb-3 hidden sm:inline-block" />
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-10">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="link-underline text-[0.8rem] uppercase tracking-[0.18em] font-medium transition-colors duration-300 text-muted hover:text-foreground"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {/* Order Now CTA */}
                            <a
                                href={orderLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 bg-primary text-white hover:opacity-90 hover:shadow-primary/20"
                            >
                                <ShoppingBag size={15} />
                                Order Now
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-1 relative z-[70] text-foreground"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={26} className="text-foreground" /> : <Menu size={26} />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu — Full Screen Overlay (outside header for correct z-indexing) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[60] bg-white flex flex-col justify-center items-center lg:hidden"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 z-[70] text-foreground p-2"
                            aria-label="Close menu"
                        >
                            <X size={28} />
                        </button>

                        <div className="flex flex-col items-center gap-8">
                            {NAV_LINKS.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.07 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-3xl font-serif text-foreground hover:text-primary transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <a
                                    href={orderLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full text-sm uppercase tracking-widest font-semibold mt-4"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <ShoppingBag size={18} />
                                    Order Now
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
