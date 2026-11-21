'use client';

import React from 'react';

export default function AnimatedDeliveryScooter({
    className = 'w-6 h-4.5',
    color = '#15803d',
    boxColor = '#16a34a',
    speedColor = '#22c55e',
    animateFromBehind = false,
}: {
    className?: string;
    color?: string;
    boxColor?: string;
    speedColor?: string;
    animateFromBehind?: boolean;
}) {
    return (
        <span 
            className={`inline-flex items-center justify-center flex-shrink-0 select-none ${className} ${animateFromBehind ? 'scooty-drive-l2r' : ''}`}
            aria-label="Delivery Scooter"
        >
            <svg
                viewBox="0 0 38 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full overflow-visible"
            >
                <style>{`
                    @keyframes scooter-bob {
                        0%, 100% { transform: translateY(0); }
                        25% { transform: translateY(-0.8px) rotate(-0.5deg); }
                        75% { transform: translateY(0.5px) rotate(0.5deg); }
                    }
                    @keyframes scooter-dash-1 {
                        0% { opacity: 0; transform: translateX(3px); }
                        40% { opacity: 0.9; }
                        100% { opacity: 0; transform: translateX(-4px); }
                    }
                    @keyframes scooter-dash-2 {
                        0% { opacity: 0; transform: translateX(2px); }
                        50% { opacity: 0.8; }
                        100% { opacity: 0; transform: translateX(-5px); }
                    }
                    @keyframes wheel-rotate {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    /* Smooth drive-in strictly from left to right (no zooming) */
                    @keyframes scooty-drive-left-to-right {
                        0% {
                            transform: translateX(-38px);
                            opacity: 0;
                        }
                        20% {
                            opacity: 1;
                        }
                        70% {
                            transform: translateX(3px);
                        }
                        85% {
                            transform: translateX(-1px);
                        }
                        100% {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    .scooty-drive-l2r {
                        animation: scooty-drive-left-to-right 1.4s ease-out forwards;
                    }
                    .group:hover .scooty-drive-l2r {
                        animation: scooty-drive-left-to-right 1.2s ease-out forwards;
                    }
                    .scooter-frame-drive {
                        animation: scooter-bob 0.8s infinite ease-in-out;
                        transform-origin: 19px 18px;
                    }
                    .scooter-wind-1 {
                        animation: scooter-dash-1 0.7s infinite ease-in;
                    }
                    .scooter-wind-2 {
                        animation: scooter-dash-2 0.75s infinite ease-in 0.2s;
                    }
                    .scooter-wind-3 {
                        animation: scooter-dash-1 0.65s infinite ease-in 0.35s;
                    }
                    .scooter-wheel-rear {
                        animation: wheel-rotate 0.6s infinite linear;
                        transform-origin: 12px 18.5px;
                    }
                    .scooter-wheel-front {
                        animation: wheel-rotate 0.6s infinite linear;
                        transform-origin: 29px 18.5px;
                    }
                `}</style>

                {/* Speed / Wind lines behind */}
                <path d="M1 8 H5" stroke={speedColor} strokeWidth="1.6" strokeLinecap="round" className="scooter-wind-1" />
                <path d="M3 13 H8" stroke={speedColor} strokeWidth="1.6" strokeLinecap="round" className="scooter-wind-2" />
                <path d="M0 17 H4" stroke={speedColor} strokeWidth="1.4" strokeLinecap="round" className="scooter-wind-3" />

                {/* Driving frame group */}
                <g className="scooter-frame-drive">
                    {/* Delivery Carrier Box (Rear) */}
                    <rect x="7" y="4.5" width="8.5" height="8.5" rx="1.5" fill={boxColor} stroke="#14532d" strokeWidth="0.75" />
                    <line x1="7" y1="7.5" x2="15.5" y2="7.5" stroke="#bbf7d0" strokeWidth="0.75" />
                    {/* Center floral/lock dot on delivery box */}
                    <circle cx="11.25" cy="9.5" r="1" fill="#ffffff" />
                    <circle cx="11.25" cy="9.5" r="0.4" fill={boxColor} />

                    {/* Carrier rack mount */}
                    <line x1="10.5" y1="13" x2="10.5" y2="16.5" stroke="#1c1917" strokeWidth="1.4" strokeLinecap="round" />

                    {/* Scooter Chassis / Step-through Frame */}
                    <path
                        d="M12 15.5 L16.5 13.5 H21 L25 7.5 H27.5"
                        stroke={color}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Seat */}
                    <path d="M12 12.5 C12 11.5 16.5 11.5 16.5 12.5 Z" fill="#1c1917" />
                    <line x1="12" y1="12.7" x2="16.5" y2="12.7" stroke="#44403c" strokeWidth="0.8" strokeLinecap="round" />

                    {/* Handlebar & Visor */}
                    <path d="M25 6.5 L28.5 6.5" stroke="#1c1917" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M27.5 7.5 L29.5 10" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />

                    {/* Front steering fork */}
                    <line x1="26" y1="8.5" x2="29" y2="17.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />

                    {/* Footboard */}
                    <line x1="17.5" y1="17" x2="23" y2="17" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

                    {/* Rear Wheel */}
                    <g className="scooter-wheel-rear">
                        <circle cx="12" cy="18.5" r="3.6" fill="#1c1917" stroke={color} strokeWidth="0.9" />
                        <circle cx="12" cy="18.5" r="1.6" fill="#f8fafc" />
                        <circle cx="12" cy="18.5" r="0.6" fill="#1c1917" />
                        <line x1="12" y1="15.5" x2="12" y2="21.5" stroke="#94a3b8" strokeWidth="0.5" />
                        <line x1="9" y1="18.5" x2="15" y2="18.5" stroke="#94a3b8" strokeWidth="0.5" />
                    </g>

                    {/* Front Wheel */}
                    <g className="scooter-wheel-front">
                        <circle cx="29" cy="18.5" r="3.6" fill="#1c1917" stroke={color} strokeWidth="0.9" />
                        <circle cx="29" cy="18.5" r="1.6" fill="#f8fafc" />
                        <circle cx="29" cy="18.5" r="0.6" fill="#1c1917" />
                        <line x1="29" y1="15.5" x2="29" y2="21.5" stroke="#94a3b8" strokeWidth="0.5" />
                        <line x1="26" y1="18.5" x2="32" y2="18.5" stroke="#94a3b8" strokeWidth="0.5" />
                    </g>
                </g>
            </svg>
        </span>
    );
}

// Product view Free Delivery button with less round corners (rounded-md),
// clean typography aligned with the discount box, and the animated scooty driving in cleanly from left to right without overlapping the text
export function FreeDeliveryPillButton({
    onClick,
    className = '',
    showScooter = true,
}: {
    onClick?: () => void;
    className?: string;
    showScooter?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#16a34a]/[0.08] hover:bg-[#16a34a]/[0.14] border border-[#16a34a]/30 text-[#16a34a] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-2xs select-none active:scale-95 flex-shrink-0 leading-normal group overflow-hidden ${className}`}
            title="Check same-day delivery pincode"
            aria-label="Free Delivery"
        >
            {/* Opaque text container so the scooty never overlaps the text before or while emerging */}
            <span className="relative z-10 bg-[#16a34a]/[0.08] group-hover:bg-[#16a34a]/[0.14] transition-colors pr-0.5 whitespace-nowrap">
                FREE DELIVERY
            </span>
            {showScooter && (
                <div className="relative z-0 flex-shrink-0 flex items-center justify-center">
                    <AnimatedDeliveryScooter
                        className="w-5.5 h-3.8 text-[#16a34a]"
                        color="#16a34a"
                        boxColor="#15803d"
                        animateFromBehind={true}
                    />
                </div>
            )}
        </button>
    );
}

export function FreeDeliveryBadge({
    text = 'FREE DELIVERY',
    className = '',
}: {
    text?: string;
    className?: string;
}) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#16a34a]/[0.08] border border-[#16a34a]/30 text-[#16a34a] font-bold text-xs uppercase tracking-wider shadow-2xs leading-normal ${className}`}
        >
            {text}
        </span>
    );
}
