'use client';

import React from 'react';

interface IconProps {
    className?: string;
    isSelected?: boolean;
}

// 1. Birthday: Tiered celebration cake with candle flames
export function BirthdayIcon({ className = 'w-4 h-4', isSelected = false }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
            <path d="M4 21h16" />
            <path d="M2 21h20" />
            <path d="M7 8v3" />
            <path d="M12 8v3" />
            <path d="M17 8v3" />
            {/* Candle flame droplets */}
            <circle cx="7" cy="4.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="12" cy="4.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="17" cy="4.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
    );
}

// 2. Anniversary: Intertwined luxury rings with diamond sparkle
export function AnniversaryIcon({ className = 'w-4 h-4', isSelected = false }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="9" cy="14" r="5" />
            <circle cx="15" cy="14" r="5" />
            {/* Diamond top accent */}
            <path d="M12 4 L14 7 H10 Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
            <path d="M12 2 L12 3.5" strokeWidth="1.8" />
        </svg>
    );
}

// 3. Romance & Love: Luxury heart with delicate inner glow
export function RomanceIcon({ className = 'w-4 h-4', isSelected = false }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path
                d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                fill="currentColor"
                fillOpacity={isSelected ? '0.35' : '0.2'}
            />
            <path d="M12 7.5 C13 6 15 6 16 7" strokeWidth="1.3" opacity="0.6" />
        </svg>
    );
}

// 4. Wedding / Engagement: Sparkling faceted diamond ring & arch
export function WeddingIcon({ className = 'w-4 h-4', isSelected = false }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M6 4h12l4 6-10 11L2 10z" fill="currentColor" fillOpacity={isSelected ? '0.3' : '0.15'} />
            <path d="M11 4 8 10l4 11 4-11-3-6" />
            <path d="M2 10h20" />
        </svg>
    );
}

// 5. Congratulations: Party celebration popper with bursting confetti
export function CongratulationsIcon({ className = 'w-4 h-4', isSelected = false }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5.8 11.3 2 22l10.7-3.79" />
            <path d="m21 15-3.08-3.08a2 2 0 0 0-2.83 0L7.5 19.5" fill="currentColor" fillOpacity={isSelected ? '0.35' : '0.2'} />
            <circle cx="17" cy="4" r="1" fill="currentColor" stroke="none" />
            <circle cx="21" cy="9" r="1" fill="currentColor" stroke="none" />
            <circle cx="11" cy="6" r="1" fill="currentColor" stroke="none" />
            <path d="m14 8 2 2" />
            <path d="m17 4 1 2" />
        </svg>
    );
}

// 6. Get Well Soon: Healing sun & blooming botanical leaf
export function GetWellIcon({ className = 'w-4 h-4', isSelected = false }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
            <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity={isSelected ? '0.35' : '0.2'} />
        </svg>
    );
}

// 7. Thank You: Hand holding heart / gratitude gesture
export function ThankYouIcon({ className = 'w-4 h-4', isSelected = false }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M12 16.5v4.5" />
            <path d="M8 18.5h8" />
        </svg>
    );
}

// 8. Housewarming: Cozy home with roof, door and chimney
export function HousewarmingIcon({ className = 'w-4 h-4', isSelected = false }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity={isSelected ? '0.3' : '0.15'} />
            <polyline points="9 22 9 12 15 12 15 22" />
            <path d="M18 6.5V3h-2.5v1.5" />
        </svg>
    );
}

// 9. Just Because / Surprise: Ribbon-wrapped luxury gift box
export function SurpriseIcon({ className = 'w-4 h-4', isSelected = false }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="3" y="8" width="18" height="13" rx="2" fill="currentColor" fillOpacity={isSelected ? '0.3' : '0.15'} />
            <path d="M12 8v13" />
            <path d="M3 13h18" />
            <path d="M12 8c-1.5 0-3-1.5-3-3s1.5-2 3 0c1.5-2 3-1.5 3 0s-1.5 3-3 3z" />
        </svg>
    );
}

// Map helper function
export function getOccasionIcon(id: string, isSelected: boolean = false) {
    switch (id) {
        case 'birthday':
            return <BirthdayIcon isSelected={isSelected} />;
        case 'anniversary':
            return <AnniversaryIcon isSelected={isSelected} />;
        case 'romance':
            return <RomanceIcon isSelected={isSelected} />;
        case 'wedding':
            return <WeddingIcon isSelected={isSelected} />;
        case 'congratulations':
            return <CongratulationsIcon isSelected={isSelected} />;
        case 'get-well':
            return <GetWellIcon isSelected={isSelected} />;
        case 'thank-you':
            return <ThankYouIcon isSelected={isSelected} />;
        case 'housewarming':
            return <HousewarmingIcon isSelected={isSelected} />;
        case 'just-because':
        default:
            return <SurpriseIcon isSelected={isSelected} />;
    }
}
