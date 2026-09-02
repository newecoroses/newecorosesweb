'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, ShoppingCart, Share2, Gift, Sparkles, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementBar from '@/components/ui/announcement-bar';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import MegaMenu from '@/components/ui/mega-menu';
import AdiFinderModal from '@/components/ui/adi-finder-modal';
import DeliveryLocationModal from '@/components/ui/delivery-location-modal';
import { fetchWhatsappSettings } from '@/lib/supabase';
import { useCart } from '@/lib/cart-context';

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
    const [isFinderOpen, setIsFinderOpen] = useState(false);
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [deliveryLoc, setDeliveryLoc] = useState('');
    const [orderLink, setOrderLink] = useState(FALLBACK_ORDER_LINK);
    const pathname = usePathname();
    const isScrolled = hasScrolled;
    const navRef = useRef<HTMLElement>(null);
    const { itemCount, openDrawer } = useCart();

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

    useEffect(() => {
        const saved = localStorage.getItem('newecoroses_delivery_loc');
        if (saved) setDeliveryLoc(saved);
    }, []);


    // iOS-safe scroll lock when mobile menu is open
    // Using scrollY save+restore instead of overflow:hidden (which breaks iOS momentum scroll)
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflowY = 'scroll';
        } else {
            const top = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflowY = '';
            if (top) window.scrollTo(0, parseInt(top || '0', 10) * -1);
        }
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflowY = '';
        };
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
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Top row — Logo + Where to deliver + Nav Links + CTA */}
                        <div className="flex justify-between items-center gap-4 lg:gap-6">
                            {/* Left Section: Logo + Vertical Divider + Where to deliver? Button */}
                            <div className="flex items-center flex-shrink-0 mr-4 lg:mr-8 xl:mr-12">
                                <Link href="/" className="group flex items-center flex-shrink-0" aria-label="New Eco Roses – Home">
                                    <Image
                                        src="/favicon_io/android-chrome-512x512.png"
                                        alt="New Eco Roses Logo"
                                        width={42}
                                        height={42}
                                        priority
                                        className="rounded-full transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
                                    />
                                    <span className="ml-2.5 font-serif text-lg sm:text-xl lg:text-[1.3rem] font-bold tracking-[0.05em] text-foreground group-hover:text-primary transition-colors duration-300 whitespace-nowrap">
                                        New Eco Roses
                                    </span>
                                </Link>

                                {/* Clean Vertical Divider Line (Matches Image 2 100%) */}
                                <div className="h-7 w-[1.5px] bg-[#e0e0e0] mx-3.5 sm:mx-5 hidden sm:block flex-shrink-0" />

                                {/* Where to deliver? Header Button (Matches Image 2 100%) */}
                                <button
                                    type="button"
                                    onClick={() => setIsDeliveryModalOpen(true)}
                                    className="hidden sm:flex items-center gap-2.5 group text-left py-1 hover:opacity-90 transition-all cursor-pointer select-none flex-shrink-0"
                                >
                                    {/* Vibrant High-Res India Flag SVG */}
                                    <div className="w-6.5 h-4 rounded-[2px] overflow-hidden shadow-xs border border-black/10 flex-shrink-0 relative">
                                        <svg className="w-full h-full" viewBox="0 0 36 24" fill="none">
                                            <rect width="36" height="8" fill="#FF9933" />
                                            <rect y="8" width="36" height="8" fill="#FFFFFF" />
                                            <rect y="16" width="36" height="8" fill="#138808" />
                                            <circle cx="18" cy="12" r="3" fill="none" stroke="#000080" strokeWidth="0.8" />
                                            <circle cx="18" cy="12" r="0.6" fill="#000080" />
                                        </svg>
                                    </div>

                                    {/* Text Stack */}
                                    <div className="flex flex-col text-left justify-center whitespace-nowrap">
                                        <span className="font-sans font-medium text-[#2a2420] text-xs sm:text-[13px] leading-tight whitespace-nowrap">
                                            Where to deliver?
                                        </span>
                                        <span className="text-xs sm:text-[12px] font-semibold flex items-center gap-1 leading-tight mt-0.5 whitespace-nowrap">
                                            {deliveryLoc ? (
                                                <span className="text-[#138808] font-bold truncate max-w-[130px]">{deliveryLoc}</span>
                                            ) : (
                                                <span className="text-[#ff5252] font-bold">Location missing</span>
                                            )}
                                            <ChevronDown size={13} className={deliveryLoc ? "text-[#138808] stroke-[2.2]" : "text-[#ff5252] stroke-[2.2]"} />
                                        </span>
                                    </div>
                                </button>
                            </div>

                            {/* Desktop Menu */}
                            <div className="hidden lg:flex items-center gap-5 xl:gap-7 flex-shrink-0">
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
                                {/* Cart Icon */}
                                <button
                                    onClick={openDrawer}
                                    className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-muted hover:text-foreground cursor-pointer"
                                    aria-label="Open cart"
                                >
                                    <ShoppingCart size={20} />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                            {itemCount > 9 ? '9+' : itemCount}
                                        </span>
                                    )}
                                </button>
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

                            {/* Mobile Header Buttons — Where to deliver + Cart + Menu */}
                            <div className="flex items-center gap-1 sm:gap-2 lg:hidden flex-shrink-0">
                                {/* Where to deliver? — compact, no border/bg, just flag + text */}
                                <button
                                    type="button"
                                    onClick={() => setIsDeliveryModalOpen(true)}
                                    className="flex items-center gap-1.5 text-left cursor-pointer select-none flex-shrink-0"
                                >
                                    {/* India Flag SVG */}
                                    <div className="w-5 h-3 rounded-[2px] overflow-hidden border border-black/10 flex-shrink-0">
                                        <svg className="w-full h-full" viewBox="0 0 36 24" fill="none">
                                            <rect width="36" height="8" fill="#FF9933" />
                                            <rect y="8" width="36" height="8" fill="#FFFFFF" />
                                            <rect y="16" width="36" height="8" fill="#138808" />
                                            <circle cx="18" cy="12" r="3" fill="none" stroke="#000080" strokeWidth="0.8" />
                                            <circle cx="18" cy="12" r="0.6" fill="#000080" />
                                        </svg>
                                    </div>
                                    {/* Text Stack */}
                                    <div className="flex flex-col text-left justify-center whitespace-nowrap hidden xs:flex">
                                        <span className="font-sans font-medium text-[#2a2420] text-[9px] leading-tight">
                                            Where to deliver?
                                        </span>
                                        <span className="text-[9px] font-semibold flex items-center gap-0.5 leading-tight">
                                            {deliveryLoc ? (
                                                <span className="text-[#138808] font-bold truncate max-w-[70px]">{deliveryLoc}</span>
                                            ) : (
                                                <span className="text-[#ff5252] font-bold">Missing</span>
                                            )}
                                            <ChevronDown size={9} className={deliveryLoc ? "text-[#138808]" : "text-[#ff5252]"} />
                                        </span>
                                    </div>
                                </button>

                                {/* Cart */}
                                <button
                                    onClick={openDrawer}
                                    className="relative p-1.5 text-foreground cursor-pointer flex-shrink-0"
                                    aria-label="Open cart"
                                >
                                    <ShoppingCart size={22} />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                            {itemCount > 9 ? '9+' : itemCount}
                                        </span>
                                    )}
                                </button>

                                {/* Hamburger Menu */}
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="p-1.5 text-foreground focus:outline-none cursor-pointer flex-shrink-0"
                                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                                >
                                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>

                        {/* Desktop Mega Menu Category Bar */}
                        <div className="hidden lg:block border-t border-border/40 mt-3 pt-3">
                            <MegaMenu />
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu — Full Screen Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 top-[110px] z-40 bg-background/98 backdrop-blur-xl lg:hidden overflow-y-auto"
                    >
                        <div className="flex flex-col items-center justify-start pt-8 pb-20 px-6 space-y-6">
                            {/* Standard nav links */}
                            {NAV_LINKS.map((link, idx) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="font-serif text-2xl font-semibold text-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            {/* Socials Link */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: NAV_LINKS.length * 0.08 }}
                            >
                                <Link
                                    href={SOCIALS_HREF}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold border border-primary/30 text-primary"
                                >
                                    <Share2 size={15} />
                                    Socials
                                </Link>
                            </motion.div>

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

            {/* Adi AI Finder Modal */}
            <AdiFinderModal
                isOpen={isFinderOpen}
                onClose={() => setIsFinderOpen(false)}
            />

            {/* Where to deliver? Location Modal */}
            <DeliveryLocationModal
                isOpen={isDeliveryModalOpen}
                onClose={() => setIsDeliveryModalOpen(false)}
                onLocationSet={(locationName, isAvailable) => {
                    setDeliveryLoc(locationName);
                }}
            />
        </>
    );
}
