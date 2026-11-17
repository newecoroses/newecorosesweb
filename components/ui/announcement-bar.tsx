'use client';

import { useState, useEffect } from 'react';
import { fetchAnnouncements } from '@/lib/supabase';

/* ─── Premium Luxury Vector SVGs (Exact match to luxury e-commerce standards) ─── */

function SparklePair({ className = "w-3.5 h-3.5" }: { className?: string }) {
    return (
        <div className="inline-flex items-center gap-0.5 shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <svg className="w-2 h-2 fill-current" viewBox="0 0 24 24">
                <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
            </svg>
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
            </svg>
        </div>
    );
}

function GiftBoxSvg({ className = "w-3 h-3" }: { className?: string }) {
    return (
        <svg className={`${className} shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="8" width="18" height="13" rx="1.5" />
            <path d="M12 8v13" />
            <path d="M3 12h18" />
            <path d="M12 8c-2.4-3.2-5.4-2.2-4.4.4.9 2.4 4.4 2 4.4 2z" />
            <path d="M12 8c2.4-3.2 5.4-2.2 4.4.4-.9 2.4-4.4 2-4.4 2z" />
        </svg>
    );
}

function DeliveryTruckSvg({ className = "w-3.5 h-3.5" }: { className?: string }) {
    return (
        <svg className={`${className} shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="14" height="13" rx="1.5" />
            <path d="M15 8h4.5l2.5 3.5v5.5H15V8z" />
            <circle cx="5.5" cy="18.5" r="2.2" />
            <circle cx="18" cy="18.5" r="2.2" />
        </svg>
    );
}

function FlowerRoseSvg({ className = "w-3 h-3" }: { className?: string }) {
    return (
        <svg className={`${className} shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 7.5a4 4 0 1 1 4 4M12 7.5A4 4 0 1 0 8 11.5M12 7.5V12m4 0a4 4 0 1 1-4 4M16 11.5H12m0 4a4 4 0 1 1-4-4M12 15.5V12m-4 0H12" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
    );
}

function MessageCardSvg({ className = "w-3 h-3" }: { className?: string }) {
    return (
        <svg className={`${className} shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
}

function ShieldCheckSvg({ className = "w-3 h-3" }: { className?: string }) {
    return (
        <svg className={`${className} shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

type SvgType = 'gift' | 'truck' | 'sparkle' | 'rose' | 'card' | 'shield';

interface MarqueeItem {
    type: SvgType;
    text: string;
    highlight?: string;
}

const DEFAULT_MARQUEE: MarqueeItem[] = [
    { type: 'gift', text: 'FLAT 15% OFF ON PREMIUM GIFT HAMPERS', highlight: '15% OFF' },
    { type: 'truck', text: 'SAME DAY DELIVERY IN KOLKATA' },
    { type: 'sparkle', text: 'FRESH HANDCRAFTED BOUQUETS DAILY' },
    { type: 'card', text: 'COMPLIMENTARY MESSAGE CARD INCLUDED' },
    { type: 'rose', text: 'LUXURY PACKAGING AT NO EXTRA COST' },
    { type: 'shield', text: '100% FRESHNESS & ON-TIME GUARANTEE' },
];

function renderSvgIcon(type: SvgType) {
    switch (type) {
        case 'gift': return <GiftBoxSvg className="w-3.5 h-3.5" />;
        case 'truck': return <DeliveryTruckSvg className="w-3.5 h-3.5" />;
        case 'sparkle': return <SparklePair />;
        case 'rose': return <FlowerRoseSvg className="w-3.5 h-3.5" />;
        case 'card': return <MessageCardSvg className="w-3.5 h-3.5" />;
        case 'shield': return <ShieldCheckSvg className="w-3.5 h-3.5" />;
        default: return <SparklePair />;
    }
}

export default function AnnouncementBar() {
    const [items, setItems] = useState<MarqueeItem[]>(DEFAULT_MARQUEE);

    useEffect(() => {
        fetchAnnouncements().then(data => {
            if (data.length > 0) {
                const types: SvgType[] = ['gift', 'truck', 'sparkle', 'rose', 'card', 'shield'];
                setItems(data.map((a, idx) => ({
                    type: types[idx % types.length],
                    text: a.text,
                    highlight: a.text.includes('%') ? a.text.match(/\d+%/)?.[0] : undefined
                })));
            }
        }).catch(() => {});
    }, []);

    // 4 repetitions ensures a perfectly seamless continuous loop across all wide screens
    const loopItems = [...items, ...items, ...items, ...items];

    return (
        <div 
            className="relative overflow-hidden h-[27px] sm:h-[29px] flex items-center border-b border-[#a89216]/50 z-[51] select-none text-white shadow-xs"
            style={{ backgroundColor: '#bfa81f' }}
        >
            <style jsx>{`
                @keyframes nerMarqueeScroll {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
                .ner-marquee-scroller {
                    display: flex;
                    align-items: center;
                    width: max-content;
                    animation: nerMarqueeScroll 45s linear infinite;
                    will-change: transform;
                }
                .ner-marquee-scroller:hover {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Subtle luxury edge vignette */}
            <div className="absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-20" />
            <div className="absolute inset-y-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-black/20 via-black/5 to-transparent pointer-events-none z-20" />

            {/* Silky-smooth Hardware-Accelerated Marquee Scroller */}
            <div className="w-full overflow-hidden relative z-10 flex items-center">
                <div className="ner-marquee-scroller">
                    {loopItems.map((item, i) => (
                        <div key={i} className="flex items-center shrink-0">
                            {/* Premium Vector SVG Icon */}
                            <span className="mr-2 flex items-center justify-center">
                                {renderSvgIcon(item.type)}
                            </span>

                            {/* Luxury Typography */}
                            <span className="text-[10px] sm:text-[10.5px] font-extrabold tracking-[0.16em] uppercase text-white shrink-0 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.35)]">
                                {item.highlight && item.text.includes(item.highlight) ? (
                                    <>
                                        {item.text.split(item.highlight)[0]}
                                        <span className="text-[#fff9c4] underline decoration-[#fff9c4]/40 underline-offset-2">
                                            {item.highlight}
                                        </span>
                                        {item.text.split(item.highlight)[1]}
                                    </>
                                ) : (
                                    item.text
                                )}
                            </span>

                            {/* Clean Divider Line */}
                            <span className="mx-4 sm:mx-6 text-white/35 font-light text-[11px] select-none shrink-0">
                                |
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
