'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight, Sparkles, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdiFinderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Exact Finder Icon matching design image with pink sparkle star & wobble motion
export function ExactFinderIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <div className="relative inline-flex items-center justify-center flex-shrink-0 animate-gift-wobble">
            <svg className={className} viewBox="0 0 32 32" fill="none">
                {/* Gift Box Base */}
                <rect x="6" y="14" width="20" height="13" rx="2" stroke="#111111" strokeWidth="2.2" strokeLinejoin="round" fill="none" />
                {/* Gift Box Lid */}
                <rect x="4" y="9" width="24" height="5" rx="1.5" stroke="#111111" strokeWidth="2.2" strokeLinejoin="round" fill="white" />
                {/* Vertical Ribbon */}
                <path d="M16 9V27" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />
                {/* Ribbon Bow Left Loop */}
                <path d="M16 9C14 4.5 9 5 11.5 8.5C13.5 11 16 9 16 9Z" stroke="#111111" strokeWidth="2" strokeLinejoin="round" fill="#111111" />
                {/* Ribbon Bow Right Loop */}
                <path d="M16 9C18 4.5 23 5 20.5 8.5C18.5 11 16 9 16 9Z" stroke="#111111" strokeWidth="2" strokeLinejoin="round" fill="#111111" />
            </svg>
            {/* Glowing 4-Point Pink Sparkle Star Overlapping Bottom Right of Box */}
            <div className="absolute -bottom-1 -right-1 z-10 animate-pulse">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none">
                    <path d="M10 0C10 5.52285 5.52285 10 0 10C5.52285 10 10 14.4771 10 20C10 14.4771 14.4771 10 20 10C14.4771 10 10 5.52285 10 0Z" fill="url(#sparkle-grad)" />
                    <defs>
                        <linearGradient id="sparkle-grad" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#ff7ba3" />
                            <stop offset="1" stopColor="#ffb3c6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}

// ── Clean Vector Illustration Badges ──
function RoseVectorIcon() {
    return (
        <div className="w-11 h-11 rounded-2xl bg-[#fff0f3] border border-[#ffccd5] flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <path d="M16 4C12 4 9 7 9 11C9 15.5 16 20 16 20C16 20 23 15.5 23 11C23 7 20 4 16 4Z" fill="#ff4d6d" stroke="#c9184a" strokeWidth="1.8" />
                <path d="M16 8C14 8 12.5 9.5 12.5 11.5C12.5 13.5 16 16 16 16C16 16 19.5 13.5 19.5 11.5C19.5 9.5 18 8 16 8Z" fill="#ff758f" />
                <path d="M16 20V28" stroke="#38b000" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M16 23C13 22 11 25 16 26Z" fill="#70e000" stroke="#38b000" strokeWidth="1.2" />
            </svg>
        </div>
    );
}

function CakeVectorIcon() {
    return (
        <div className="w-11 h-11 rounded-2xl bg-[#fff8f0] border border-[#ffdfbd] flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="16" width="20" height="11" rx="2" fill="#ffb703" stroke="#fb8500" strokeWidth="1.8" />
                <path d="M6 16C6 14 8 14 9 16C10 18 12 18 13 16C14 14 16 14 17 16C18 18 20 18 21 16C22 14 24 14 26 16V19H6V16Z" fill="#ffffff" stroke="#fb8500" strokeWidth="1.2" />
                <rect x="15" y="9" width="2" height="7" fill="#ff4d6d" />
                <path d="M16 4C15 6 14.5 7.5 16 8.5C17.5 7.5 17 6 16 4Z" fill="#ffea00" />
            </svg>
        </div>
    );
}

function RingVectorIcon() {
    return (
        <div className="w-11 h-11 rounded-2xl bg-[#faf0ff] border border-[#e5b8ff] flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <path d="M16 27L6.5 17.5C4 15 4 11 6.5 8.5C9 6 13 6 15.5 8.5L16 9L16.5 8.5C19 6 23 6 25.5 8.5C28 11 28 15 25.5 17.5L16 27Z" fill="#ff4d6d" stroke="#c9184a" strokeWidth="1.8" />
                <path d="M12 10C10.5 10 9.5 11 9.5 12.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        </div>
    );
}

function HouseVectorIcon() {
    return (
        <div className="w-11 h-11 rounded-2xl bg-[#f0f7ed] border border-[#b7e4c7] flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <path d="M4 14L16 4L28 14" stroke="#d90429" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="7" y="13" width="18" height="14" rx="2" fill="#ffffff" stroke="#2b2d42" strokeWidth="1.8" />
                <rect x="13" y="19" width="6" height="8" fill="#d90429" rx="1" />
                <rect x="9" y="16" width="4" height="4" fill="#8d99ae" rx="1" />
                <rect x="19" y="16" width="4" height="4" fill="#8d99ae" rx="1" />
            </svg>
        </div>
    );
}

function LightningVectorIcon() {
    return (
        <div className="w-11 h-11 rounded-2xl bg-[#fffbeb] border border-[#fde047] flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <path d="M2 10H18V23H2V10Z" fill="#38b000" stroke="#1b4332" strokeWidth="1.8" rx="1" />
                <path d="M18 14H24L28 18V23H18V14Z" fill="#70e000" stroke="#1b4332" strokeWidth="1.8" />
                <circle cx="7" cy="24" r="2.8" fill="#212529" stroke="#ffffff" strokeWidth="1.2" />
                <circle cx="23" cy="24" r="2.8" fill="#212529" stroke="#ffffff" strokeWidth="1.2" />
                <path d="M12 5L7 12H12L10 17L17 9H12Z" fill="#ffea00" stroke="#d97706" strokeWidth="1" />
            </svg>
        </div>
    );
}

function GiftHamperVectorIcon() {
    return (
        <div className="w-11 h-11 rounded-2xl bg-[#fff0f5] border border-[#ffb3d9] flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <rect x="5" y="13" width="22" height="14" rx="2" fill="#ff758f" stroke="#c9184a" strokeWidth="1.8" />
                <rect x="3" y="9" width="26" height="5" rx="1.5" fill="#ff4d6d" stroke="#c9184a" strokeWidth="1.8" />
                <rect x="14" y="9" width="4" height="18" fill="#ffea00" />
                <path d="M16 9C13 4 8 5 11 9Z" fill="#ffea00" />
                <path d="M16 9C19 4 24 5 21 9Z" fill="#ffea00" />
            </svg>
        </div>
    );
}

function PlantVectorIcon() {
    return (
        <div className="w-11 h-11 rounded-2xl bg-[#f0faf1] border border-[#95d5b2] flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <path d="M16 24V11" stroke="#2b2d42" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 13C10 13 7 7 7 7C7 7 12 7 16 13Z" fill="#38b000" stroke="#1b4332" strokeWidth="1.5" />
                <path d="M16 17C22 17 25 11 25 11C25 11 20 11 16 17Z" fill="#70e000" stroke="#1b4332" strokeWidth="1.5" />
                <path d="M11 24H21L19.5 28H12.5L11 24Z" fill="#a0522d" stroke="#5c2c16" strokeWidth="1.5" />
            </svg>
        </div>
    );
}

function CrownVectorIcon() {
    return (
        <div className="w-11 h-11 rounded-2xl bg-[#fffdf0] border border-[#facc15] flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <path d="M4 24L6 10L12 17L16 6L20 17L26 10L28 24H4Z" fill="#ffb703" stroke="#fb8500" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="6" cy="8" r="2" fill="#d90429" />
                <circle cx="16" cy="4" r="2.5" fill="#0284c7" />
                <circle cx="26" cy="8" r="2" fill="#d90429" />
                <rect x="4" y="22" width="24" height="3" fill="#ffea00" rx="1" />
            </svg>
        </div>
    );
}

const QUICK_PROMPTS = [
    {
        iconComponent: <RoseVectorIcon />,
        text: 'Fresh Flower Bouquet for someone special',
        url: '/shop?cat=bouquets',
    },
    {
        iconComponent: <CakeVectorIcon />,
        text: 'Need a Birthday Gift & Cake today',
        url: '/shop?celebration=birthday',
    },
    {
        iconComponent: <RingVectorIcon />,
        text: 'Anniversary Specials & Luxury Roses',
        url: '/shop?celebration=anniversary',
    },
    {
        iconComponent: <HouseVectorIcon />,
        text: 'Need a Housewarming gift',
        url: '/shop?celebration=housewarming',
    },
    {
        iconComponent: <LightningVectorIcon />,
        text: 'I need same day delivery now',
        url: '/shop?search=same+day+delivery',
    },
    {
        iconComponent: <GiftHamperVectorIcon />,
        text: 'Personalized Gift Hampers & Chocolates',
        url: '/shop?search=hamper+chocolate',
    },
    {
        iconComponent: <PlantVectorIcon />,
        text: 'Looking for fresh green plants',
        url: '/shop?cat=plants',
    },
    {
        iconComponent: <CrownVectorIcon />,
        text: 'Show me premium gifts above ₹2,500',
        url: '/shop?min_price=2500',
    },
];

export default function AdiFinderModal({ isOpen, onClose }: AdiFinderModalProps) {
    const router = useRouter();
    const [customQuery, setCustomQuery] = useState('');

    // iOS-safe scroll lock — prevents background page scrolling when drawer is open
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

    const handleSelectPrompt = (url: string) => {
        onClose();
        router.push(url);
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customQuery.trim()) {
            onClose();
            router.push(`/shop?search=${encodeURIComponent(customQuery.trim())}`);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden select-none">
                    {/* Dark Overlay Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity cursor-pointer"
                    />

                    {/* Right Slide-over Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                        className="relative w-full max-w-md sm:max-w-lg h-full bg-[#faf7f2] shadow-2xl flex flex-col z-10 border-l border-[#e8dcc8]"
                    >
                        {/* White Circular Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-4 left-4 sm:left-[-52px] z-30 w-10 h-10 rounded-full bg-white hover:bg-gray-50 text-gray-800 flex items-center justify-center shadow-lg border border-gray-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X size={20} className="text-gray-700" />
                        </button>

                        {/* Header Section with Cute Cartoon Gift Mascot (Adi) */}
                        <div className="pt-7 pb-4 px-6 text-center bg-gradient-to-b from-white via-white to-[#faf7f2] border-b border-[#ebdcc4]/60 relative flex-shrink-0">
                            {/* Cute Gift Box Mascot */}
                            <div className="w-24 h-24 mx-auto mb-1.5 relative flex items-center justify-center animate-bounce-slow">
                                <svg className="w-22 h-22 drop-shadow-md" viewBox="0 0 100 100" fill="none">
                                    {/* Feet */}
                                    <ellipse cx="34" cy="91" rx="7" ry="4" fill="#2d6a4f" />
                                    <ellipse cx="66" cy="91" rx="7" ry="4" fill="#2d6a4f" />
                                    <path d="M34 82L34 90M66 82L66 90" stroke="#2d6a4f" strokeWidth="4.5" strokeLinecap="round" />

                                    {/* Arms Waving */}
                                    <path d="M20 54C12 46 8 36 12 30" stroke="#2d6a4f" strokeWidth="4.5" strokeLinecap="round" />
                                    <path d="M80 54C88 46 92 36 88 30" stroke="#2d6a4f" strokeWidth="4.5" strokeLinecap="round" />
                                    <circle cx="12" cy="29" r="3.5" fill="#70e000" />
                                    <circle cx="88" cy="29" r="3.5" fill="#70e000" />

                                    {/* Box Body */}
                                    <rect x="20" y="32" width="60" height="52" rx="10" fill="#70e000" stroke="#2d6a4f" strokeWidth="3" />
                                    
                                    {/* Gold Ribbon Vertical */}
                                    <rect x="43" y="32" width="14" height="52" fill="#ffb703" stroke="#fb8500" strokeWidth="1.5" />

                                    {/* Gold Ribbon Horizontal */}
                                    <rect x="20" y="52" width="60" height="13" fill="#ffb703" stroke="#fb8500" strokeWidth="1.5" />

                                    {/* Ribbon Bow on Top */}
                                    <path d="M50 32C40 18 25 24 38 32Z" fill="#ffea00" stroke="#fb8500" strokeWidth="1.5" />
                                    <path d="M50 32C60 18 75 24 62 32Z" fill="#ffea00" stroke="#fb8500" strokeWidth="1.5" />
                                    <circle cx="50" cy="32" r="5" fill="#ffea00" stroke="#fb8500" strokeWidth="1.5" />

                                    {/* Cute Cartoon Eyes */}
                                    <circle cx="36" cy="45" r="4" fill="#212529" />
                                    <circle cx="64" cy="45" r="4" fill="#212529" />
                                    <circle cx="37.5" cy="43.5" r="1.5" fill="white" />
                                    <circle cx="65.5" cy="43.5" r="1.5" fill="white" />

                                    {/* Blush Cheeks */}
                                    <ellipse cx="30" cy="49" rx="3" ry="1.8" fill="#ff758f" opacity="0.8" />
                                    <ellipse cx="70" cy="49" rx="3" ry="1.8" fill="#ff758f" opacity="0.8" />

                                    {/* Smile */}
                                    <path d="M41 48C44 54 56 54 59 48" stroke="#212529" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                </svg>
                            </div>

                            <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-[#2a2420] tracking-tight">
                                Hi, I'm Adi
                            </h3>
                            <p className="text-[#7a6a4f] text-sm md:text-base mt-0.5 font-medium">
                                Tell me who it's for. I'll do the finding.
                            </p>

                            <div className="flex justify-center mt-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#bfaf1a] animate-pulse" />
                            </div>
                        </div>

                        {/* Scrollable Prompts List with Vector Illustration Badges */}
                        <div
                            className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-2.5 no-scrollbar bg-white/60"
                            style={{ overscrollBehavior: 'contain' }}
                        >
                            {QUICK_PROMPTS.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelectPrompt(prompt.url)}
                                    className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-white hover:bg-[#fffdf7] border border-[#e8dec9] hover:border-[#bfaf1a]/80 rounded-2xl transition-all duration-200 group text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3.5 pr-2">
                                        {prompt.iconComponent}
                                        <span className="text-xs sm:text-sm font-semibold text-[#2a2420] group-hover:text-black leading-snug">
                                            {prompt.text}
                                        </span>
                                    </div>
                                    <ArrowRight
                                        size={17}
                                        className="text-[#a8997a] group-hover:text-[#8b7914] group-hover:translate-x-1 transition-all flex-shrink-0"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Custom Search Form & Bottom Action CTA */}
                        <div className="p-4 sm:p-5 bg-gradient-to-t from-white via-white to-[#faf7f2] border-t border-[#ebdcc4]/80 space-y-3 flex-shrink-0">
                            <form onSubmit={handleCustomSubmit} className="relative">
                                <input
                                    type="text"
                                    value={customQuery}
                                    onChange={(e) => setCustomQuery(e.target.value)}
                                    placeholder="Or type requirement... e.g. Rose bouquet for Mom"
                                    className="w-full pl-4 pr-12 py-3 bg-[#faf7f2] border border-[#e2d5c1] focus:border-primary rounded-xl text-xs sm:text-sm text-[#2a2420] placeholder:text-[#a39478] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#5c6e4f] hover:bg-[#4a5a3d] text-white rounded-lg transition-all cursor-pointer"
                                    title="Search with Adi"
                                >
                                    <Search size={15} />
                                </button>
                            </form>

                            {/* Bottom CTA Button with Animated Moving Light Border */}
                            <div className="p-[2px] rounded-2xl animate-moving-border shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        router.push('/shop');
                                    }}
                                    className="w-full bg-[#5c6e4f] hover:bg-[#4a5c3e] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-[14px] flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                                >
                                    <ExactFinderIcon className="w-6 h-6 flex-shrink-0" />
                                    <span>Explore gifts with Adi</span>
                                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse flex-shrink-0" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
