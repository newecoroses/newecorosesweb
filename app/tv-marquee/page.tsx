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
        <div className="w-screen h-screen bg-[#faf7f2] flex flex-col justify-between p-8 sm:p-12 overflow-hidden select-none">
            {/* Header Branding */}
            <div className="text-center">
                <span className="text-sm sm:text-base uppercase tracking-[0.3em] font-semibold text-amber-700 block mb-1">
                    Real Love, Real Reactions
                </span>
                <h1 className="font-serif text-4xl sm:text-6xl text-gray-900 font-bold tracking-tight">
                    Customer Reviews — New Eco Roses
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1 font-light">
                    Watch what our customers have to say about their New Eco Roses experience
                </p>
            </div>

            {/* Top Row: Video Marquee */}
            <div className="relative overflow-hidden py-4">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#faf7f2] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#faf7f2] to-transparent z-10 pointer-events-none" />

                <div className="marquee-track flex gap-6">
                    {doubleVideos.map((src, idx) => (
                        <div key={idx} className="flex-shrink-0 w-[200px] sm:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-xl border border-amber-500/20">
                            <video
                                src={src}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Row: Photo Marquee */}
            <div className="relative overflow-hidden py-4">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#faf7f2] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#faf7f2] to-transparent z-10 pointer-events-none" />

                <div className="marquee-track-reverse flex gap-6">
                    {doublePhotos.map((src, idx) => (
                        <div key={idx} className="flex-shrink-0 w-[180px] sm:w-[210px] aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-xl border border-amber-500/20 relative">
                            <img
                                src={src}
                                alt={`Review photo ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md">
                                <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                                    ⭐ Verified Review
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Branding */}
            <div className="text-center pt-4 border-t border-amber-900/10 flex items-center justify-between text-xs sm:text-sm text-gray-500 font-medium">
                <span>🌹 New Eco Roses Kolkata</span>
                <span>Outlet 1: Regent Park • Outlet 2: New Alipore</span>
                <span>www.newecoroses.com</span>
            </div>
        </div>
    );
}
