'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, Share2 } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementBar from '@/components/ui/announcement-bar';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import MegaMenu from '@/components/ui/mega-menu';
import { fetchWhatsappSettings } from '@/lib/supabase';

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/#categories', label: 'Collections' },
    { href: '/#about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

const SOCIALS_HREF = '/socials';

const FALLBACK_ORDER_LINK = 'https://wa.me/919936911611?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order.';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [orderLink, setOrderLink] = useState(FALLBACK_ORDER_LINK);
    const pathname = usePathname();
    const isScrolled = hasScrolled;
    const navRef = useRef<HTMLElement>(null);

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

    // Calculate mega menu position from nav bottom
    useEffect(() => {
        const updatePosition = () => {
            if (navRef.current) {
                const rect = navRef.current.getBoundingClientRect();
                document.documentElement.style.setProperty(
                    '--mega-menu-top',
                    `${rect.bottom}px`
                );
            }
        };
        updatePosition();
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
        };
    }, []);

    return (
        <>
            <header className="fixed w-full z-50 top-0 left-0 flex flex-col">
                <AnnouncementBar />
                <nav
                    ref={navRef}
                    className={`w-full transition-all duration-500 ${isScrolled
                        ? 'glass py-2 shadow-soft'
                        : 'bg-white/80 backdrop-blur-md py-3'
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        {/* Top row — Logo + Nav Links + CTA */}
                        <div className="flex justify-between items-center">
                            {/* Logo */}
                            <Link href="/" className="group flex items-center" aria-label="New Eco Roses – Home">
                                <Image
                                    src="/favicon_io/android-chrome-512x512.png"
                                    alt="New Eco Roses Logo"
                                    width={44}
                                    height={44}
                                    priority
                                    className="rounded-full transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
                                />
                                <span className="ml-2.5 font-serif text-lg sm:text-xl lg:text-[1.35rem] font-bold tracking-[0.06em] text-foreground group-hover:text-primary transition-colors duration-300">
                                    New Eco Roses
                                </span>
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
                                {/* Socials Button */}
                                <Link
                                    href={SOCIALS_HREF}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.75rem] uppercase tracking-[0.18em] font-semibold border border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-md hover:shadow-primary/20"
                                >
                                    <Share2 size={13} />
                                    Socials
                                </Link>
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

                        {/* Desktop Mega Menu Category Bar */}
                        <div className="hidden lg:block mt-2 pt-2 border-t border-[#ede4d6]/40 pb-1">
                            <MegaMenu />
                        </div>
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
                        className="fixed inset-0 z-[60] bg-white flex flex-col lg:hidden overflow-y-auto"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 z-[70] text-foreground p-2"
                            aria-label="Close menu"
                        >
                            <X size={28} />
                        </button>

                        <div className="flex flex-col items-center pt-24 pb-10 px-6">
                            {/* Standard nav links */}
                            <div className="flex flex-col items-center gap-6 mb-4">
                                {NAV_LINKS.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + i * 0.07 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="text-2xl font-serif text-foreground hover:text-primary transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                                {/* Socials */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + NAV_LINKS.length * 0.07 }}
                                >
                                    <Link
                                        href={SOCIALS_HREF}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 text-2xl font-serif text-primary hover:text-primary/80 transition-colors"
                                    >
                                        <Share2 size={22} />
                                        Socials
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Mobile Mega Menu — Accordion */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 }}
                                className="w-full max-w-sm"
                            >
                                <MegaMenu
                                    isMobile={true}
                                    onMobileClose={() => setIsOpen(false)}
                                />
                            </motion.div>

                            {/* Order Now CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="mt-8"
                            >
                                <a
                                    href={orderLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full text-sm uppercase tracking-widest font-semibold"
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
