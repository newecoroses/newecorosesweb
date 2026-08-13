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
    const doublePhotos = [...PHOTO_REVIEWS, ...PHOTO_REVIEWS, ...PHOTO_REVIEWS, ...PHOTO_REVIEWS];

    return (
        <div className="w-screen h-screen bg-[#08090b] flex items-center justify-center overflow-hidden select-none relative">
            {/* Pure Photo Marquee */}
            <div className="relative w-full overflow-hidden py-10">
                <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-56 bg-gradient-to-r from-[#08090b] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-56 bg-gradient-to-l from-[#08090b] to-transparent z-10 pointer-events-none" />

                <div className="marquee-track flex gap-8">
                    {doublePhotos.map((src, idx) => (
                        <div key={idx} className="flex-shrink-0 w-[300px] sm:w-[420px] md:w-[460px] aspect-[3/4] rounded-3xl overflow-hidden bg-[#111113] shadow-2xl relative">
                            <img
                                src={src}
                                alt={`Review photo ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
