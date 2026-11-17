'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, MapPin, Heart, User, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AnnouncementBar from '@/components/ui/announcement-bar';
import MegaMenu from '@/components/ui/mega-menu';
import DeliveryLocationModal from '@/components/ui/delivery-location-modal';
import RemindersModal from '@/components/ui/reminders-modal';
import { useCart } from '@/lib/cart-context';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [isRemindersOpen, setIsRemindersOpen] = useState(false);
    const [deliveryLoc, setDeliveryLoc] = useState('');
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const isScrolled = hasScrolled;
    const navRef = useRef<HTMLElement>(null);
    const { itemCount, openDrawer } = useCart();

    useEffect(() => {
        const handleScroll = () => setHasScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('newecoroses_delivery_loc');
        if (saved) setDeliveryLoc(saved);
    }, []);

    // iOS-safe scroll lock when mobile menu is open
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

    // Calculate mega menu dropdown top position from nav bottom
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
    }, [isHomePage]);

    return (
        <>
            <header className="fixed w-full z-50 top-0 left-0 flex flex-col">
                {/* Vertically Slim Marquee Banner — Only on Landing Page */}
                {isHomePage && <AnnouncementBar />}

                {/* Main Single-Row Navbar (Matches Exact Reference Image) */}
                <nav
                    ref={navRef}
                    className={`w-full transition-all duration-200 bg-white border-b border-black/[0.06] ${
                        isScrolled ? 'shadow-sm' : 'shadow-2xs'
                    }`}
                >
                    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
                        <div className="flex items-center justify-between h-[58px] sm:h-[62px] gap-2 lg:gap-3 xl:gap-4">
                            
                            {/* ── 1. LEFT: Logo ── */}
                            <div className="flex items-center flex-shrink-0">
                                <Link
                                    href="/"
                                    className="group flex items-center flex-shrink-0 gap-2 select-none"
                                    aria-label="New Eco Roses – Home"
                                    onClick={(e) => {
                                        sessionStorage.removeItem('scroll:/');
                                        if (pathname === '/') {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    <Image
                                        src="/favicon_io/android-chrome-512x512.png"
                                        alt="New Eco Roses Logo"
                                        width={34}
                                        height={34}
                                        priority
                                        className="rounded-full transition-transform duration-300 group-hover:scale-105 drop-shadow-xs flex-shrink-0"
                                    />
                                    <div className="flex items-center gap-2 self-center">
                                        <span className="font-sans text-[20px] lg:text-[22px] font-extrabold text-[#1c1917] group-hover:text-black transition-colors leading-none tracking-tight -translate-y-[1px] inline-flex items-center">
                                            ner
                                        </span>
                                        <div className="h-5 w-[1.5px] bg-[#1c1917]/25 flex-shrink-0 self-center" />
                                        <div className="flex flex-col justify-center leading-none text-[#1c1917] tracking-[0.16em] uppercase font-extrabold text-[7.5px] lg:text-[8px] self-center">
                                            <span>NEW</span>
                                            <span className="my-[1px]">ECO</span>
                                            <span>ROSES</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* ── 2. CENTER: Category Navigation Menu (Desktop) ── */}
                            <div className="hidden lg:flex items-center justify-center flex-1 mx-1 xl:mx-2 min-w-0">
                                <MegaMenu />
                            </div>

                            {/* ── 3. RIGHT: Deliver To + Wishlist + User + Cart (Matches Reference Image) ── */}
                            <div className="hidden lg:flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 flex-shrink-0">
                                
                                {/* Deliver to / Pincode box (Checkout Page UI Theme) */}
                                <button
                                    type="button"
                                    onClick={() => setIsDeliveryModalOpen(true)}
                                    className="flex items-center gap-2 bg-[#f7f7f7] hover:bg-[#f0f0f0] border border-black/[0.09] hover:border-black/[0.2] rounded-[10px] px-2.5 xl:px-3 h-[38px] transition-all shadow-2xs group cursor-pointer select-none flex-shrink-0"
                                    title="Check / change delivery pincode"
                                >
                                    <div className="w-5 h-5 rounded-[6px] bg-white border border-black/[0.08] flex items-center justify-center flex-shrink-0 text-[#bfa81f] shadow-2xs">
                                        <MapPin size={12} className="stroke-[2.4] text-[#bfa81f]" />
                                    </div>
                                    <div className="flex flex-col text-left justify-center whitespace-nowrap">
                                        <span className="text-[8.5px] xl:text-[9px] font-bold uppercase tracking-[0.1em] text-[#777] leading-none">
                                            DELIVER TO
                                        </span>
                                        <span className="text-[11.5px] xl:text-[12px] font-extrabold text-[#111] flex items-center gap-1 leading-none mt-0.5 whitespace-nowrap">
                                            <span>{deliveryLoc ? deliveryLoc : 'Kolkata, 700001'}</span>
                                            <ChevronDown size={11} className="stroke-[2.4] text-[#bfa81f]" />
                                        </span>
                                    </div>
                                </button>

                                {/* Wishlist / Reminders Heart Icon */}
                                <button
                                    type="button"
                                    onClick={() => setIsRemindersOpen(true)}
                                    className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[#1c1917] hover:text-[#bfa81f] hover:bg-black/[0.04] transition-colors cursor-pointer select-none flex-shrink-0"
                                    title="Occasion Reminders & Wishlist"
                                    aria-label="Reminders and Wishlist"
                                >
                                    <Heart size={19} className="stroke-[1.9]" />
                                </button>

                                {/* User Profile / Account Icon */}
                                <Link
                                    href="/contact"
                                    className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[#1c1917] hover:text-[#bfa81f] hover:bg-black/[0.04] transition-colors cursor-pointer select-none flex-shrink-0"
                                    title="Account & Contact"
                                    aria-label="Account and Contact"
                                >
                                    <User size={19} className="stroke-[1.9]" />
                                </Link>

                                {/* Cart Icon with Gold Badge */}
                                <Link
                                    href="/cart"
                                    className="relative w-[38px] h-[38px] rounded-full flex items-center justify-center text-[#1c1917] hover:text-[#bfa81f] hover:bg-black/[0.04] transition-colors cursor-pointer select-none flex-shrink-0"
                                    aria-label="Shopping Cart"
                                    title="Shopping Cart"
                                >
                                    <ShoppingCart size={20} className="stroke-[1.9]" />
                                    {itemCount > 0 && (
                                        <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-[#bfa81f] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-0.5 shadow-2xs pointer-events-none">
                                            {itemCount > 9 ? '9+' : itemCount}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            {/* ── Mobile Controls (Below LG) ── */}
                            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden flex-shrink-0">
                                {/* Mobile Deliver to / Pincode box */}
                                <button
                                    type="button"
                                    onClick={() => setIsDeliveryModalOpen(true)}
                                    className="flex items-center gap-1.5 bg-[#f7f7f7] border border-black/[0.09] rounded-[9px] px-2.5 h-[34px] text-left cursor-pointer select-none flex-shrink-0"
                                >
                                    <MapPin size={12} className="text-[#bfa81f] stroke-[2.4] flex-shrink-0" />
                                    <span className="text-[10.5px] font-extrabold text-[#111] truncate max-w-[85px]">
                                        {deliveryLoc ? deliveryLoc : 'Kolkata'}
                                    </span>
                                    <ChevronDown size={10} className="stroke-[2.2] text-gray-500" />
                                </button>

                                {/* Mobile Cart */}
                                <Link
                                    href="/cart"
                                    className="relative w-[34px] h-[34px] rounded-full flex items-center justify-center text-[#1c1917] cursor-pointer flex-shrink-0"
                                    aria-label="Shopping Cart"
                                >
                                    <ShoppingCart size={19} className="stroke-[1.9]" />
                                    {itemCount > 0 && (
                                        <span className="absolute top-0 right-0 min-w-[15px] h-[15px] bg-[#bfa81f] text-white text-[8.5px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-2xs pointer-events-none">
                                            {itemCount > 9 ? '9+' : itemCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Hamburger Menu Toggle */}
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-[34px] h-[34px] flex items-center justify-center text-[#1c1917] focus:outline-none cursor-pointer flex-shrink-0"
                                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                                >
                                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                                </button>
                            </div>
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
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 top-[60px] z-40 bg-white/98 backdrop-blur-xl lg:hidden overflow-y-auto"
                    >
                        <div className="flex flex-col items-center justify-start pt-6 pb-20 px-6 space-y-5">
                            {/* Navigation links */}
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="font-sans text-lg font-bold text-[#111] hover:text-[#bfa81f] transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/shop"
                                onClick={() => setIsOpen(false)}
                                className="font-sans text-lg font-bold text-[#111] hover:text-[#bfa81f] transition-colors"
                            >
                                Shop All
                            </Link>
                            <Link
                                href="/track-order"
                                onClick={() => setIsOpen(false)}
                                className="font-sans text-lg font-bold text-[#111] hover:text-[#bfa81f] transition-colors"
                            >
                                Track Order
                            </Link>
                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="font-sans text-lg font-bold text-[#111] hover:text-[#bfa81f] transition-colors"
                            >
                                Contact
                            </Link>

                            {/* Wishlist / Reminders */}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsRemindersOpen(true);
                                }}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold border border-black/15 text-[#111] hover:bg-gray-50 transition-colors"
                            >
                                <Heart size={15} className="stroke-[2]" />
                                Occasion Reminders
                            </button>

                            {/* Mobile Mega Menu Accordion */}
                            <div className="w-full max-w-sm">
                                <MegaMenu
                                    isMobile={true}
                                    onMobileClose={() => setIsOpen(false)}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Where to deliver? Location Modal */}
            <DeliveryLocationModal
                isOpen={isDeliveryModalOpen}
                onClose={() => setIsDeliveryModalOpen(false)}
                onLocationSet={(locationName) => {
                    setDeliveryLoc(locationName);
                }}
            />

            {/* My Reminders Modal */}
            <RemindersModal
                isOpen={isRemindersOpen}
                onClose={() => setIsRemindersOpen(false)}
            />
        </>
    );
}
