'use client';

/**
 * /tv-marquee — Fullscreen TV Presentation Mode
 *
 * Clean 4K / 1080p Fullscreen Marquee view with no header, footer, or UI chrome.
 * Designed for continuous auto-looping playback on Store TVs, Monitors, or HDMI displays.
 */

import { useState, useEffect } from 'react';
import { fetchReviewVideos } from '@/lib/supabase';

const FALLBACK_VIDEOS = [
    '/review%20videos/review1.mp4',
    '/review%20videos/review2.mp4',
    '/review%20videos/review3.mp4',
    '/review%20videos/review4.mp4',
    '/review%20videos/review5.mp4',
    '/review%20videos/review6.mp4',
    '/review%20videos/review7.mp4',
];

const PHOTO_REVIEWS = [
    '/images/photo-reviews/photo-review-1.jpeg',
    '/images/photo-reviews/photo-review-2.jpeg',
    '/images/photo-reviews/photo-review-3.jpeg',
    '/images/photo-reviews/photo-review-4.jpeg',
    '/images/photo-reviews/photo-review-5.jpeg',
    '/images/photo-reviews/photo-review-6.jpeg',
    '/images/photo-reviews/photo-review-7.jpeg',
    '/images/photo-reviews/photo-review-8.jpeg',
    '/images/photo-reviews/photo-review-9.jpeg',
];

export default function TvMarqueePage() {
    const [videos, setVideos] = useState<string[]>(FALLBACK_VIDEOS);

    useEffect(() => {
        fetchReviewVideos()
            .then(data => {
                if (data.length > 0) setVideos(data.map(v => v.video_url));
            })
            .catch(() => { });
    }, []);

    const doubleVideos = [...videos, ...videos];
    const doublePhotos = [...PHOTO_REVIEWS, ...PHOTO_REVIEWS];

    return (
        <div className="w-screen h-screen bg-[#060709] text-white flex flex-col justify-between p-6 sm:p-10 overflow-hidden select-none relative">
            {/* Top Royal Gold Ambient Spotlight Glow */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-amber-900/5 to-transparent" />

            {/* Corner Gold Filigree Accents */}
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-500/40 pointer-events-none flex items-start justify-start p-1">
                <span className="text-[8px] text-amber-400">◆</span>
            </div>
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-500/40 pointer-events-none flex items-start justify-end p-1">
                <span className="text-[8px] text-amber-400">◆</span>
            </div>
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-amber-500/40 pointer-events-none flex items-end justify-start p-1">
                <span className="text-[8px] text-amber-400">◆</span>
            </div>
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-500/40 pointer-events-none flex items-end justify-end p-1">
                <span className="text-[8px] text-amber-400">◆</span>
            </div>

            {/* Header Branding */}
            <div className="text-center relative z-10 pt-2">
                <span className="text-xs sm:text-sm uppercase tracking-[0.35em] font-medium text-amber-300/90 block mb-1.5">
                    ✦   EST. 2026   ·   LUXURY FLORAL & GIFTING BOUTIQUE   ✦
                </span>
                <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent drop-shadow-md">
                    NEW ECO ROSES
                </h1>
                
                {/* Gold Rule & Center Diamond Crest */}
                <div className="relative my-2 flex items-center justify-center">
                    <div className="w-64 sm:w-96 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    <span className="absolute text-[11px] text-amber-300 bg-[#060709] px-2">◆</span>
                </div>

                <p className="text-amber-200/80 text-xs sm:text-sm uppercase tracking-[0.25em] font-serif font-light">
                    REAL LOVE, REAL REACTIONS   ·   CUSTOMER REVIEWS & STORIES
                </p>
            </div>

            {/* Top Row: Video Marquee */}
            <div className="relative overflow-hidden py-3">
                <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#060709] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#060709] to-transparent z-10 pointer-events-none" />

                <div className="marquee-track flex gap-6">
                    {doubleVideos.map((src, idx) => (
                        <div key={idx} className="flex-shrink-0 w-[190px] sm:w-[230px] aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl border-2 border-amber-400/40 relative group">
                            <video
                                src={src}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-400/30">
                                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                                    ★ VERIFIED VIDEO
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Row: Photo Marquee */}
            <div className="relative overflow-hidden py-3">
                <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#060709] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#060709] to-transparent z-10 pointer-events-none" />

                <div className="marquee-track-reverse flex gap-6">
                    {doublePhotos.map((src, idx) => (
                        <div key={idx} className="flex-shrink-0 w-[170px] sm:w-[200px] aspect-[3/4] rounded-2xl overflow-hidden bg-black shadow-xl border border-amber-400/30 relative">
                            <img
                                src={src}
                                alt={`Review photo ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-400/30">
                                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                                    ★ VERIFIED PHOTO
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Branding */}
            <div className="relative z-10 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs sm:text-sm text-amber-200/80 font-serif tracking-widest uppercase">
                <span>🌹 NEW ECO ROSES · KOLKATA</span>
                <span>REGENT PARK   ✦   NEW ALIPORE OUTLETS</span>
                <span>WWW.NEWECOROSES.COM</span>
            </div>
        </div>
    );
}
