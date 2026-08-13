'use client';

import { useRef, useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/section-header';
import { fetchReviewVideos } from '@/lib/supabase';
import { useMediaLifecycle } from '@/lib/review-media-state';
import { PLACEHOLDER_BG, PLACEHOLDER_FG } from '@/lib/review-media-config';

const FALLBACK_VIDEOS = [
    '/review%20videos/review1.mp4',
    '/review%20videos/review2.mp4',
    '/review%20videos/review3.mp4',
    '/review%20videos/review4.mp4',
    '/review%20videos/review5.mp4',
    '/review%20videos/review6.mp4',
    '/review%20videos/review7.mp4',
];

// ─── Placeholder ─────────────────────────────────────────────────────────────
//
// Identical outer dimensions to VideoCard — zero layout shift.
// No <video> element is rendered; no IntersectionObserver fires;
// no network request for media is made.

function VideoPlaceholder() {
    return (
        <div className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px]">
            <div
                className="relative rounded-2xl overflow-hidden shadow-card aspect-[9/16] flex flex-col items-center justify-center gap-4"
                style={{ backgroundColor: PLACEHOLDER_BG }}
            >
                {/* Camera icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={PLACEHOLDER_FG}
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-12 h-12 opacity-55"
                    aria-hidden="true"
                >
                    <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.9L15 14" />
                    <rect x="3" y="8" width="12" height="8" rx="2" />
                </svg>
                <span
                    className="text-[10px] uppercase tracking-widest font-medium text-center px-6 opacity-65"
                    style={{ color: PLACEHOLDER_FG }}
                >
                    Customer Review
                </span>
            </div>
        </div>
    );
}

// ─── Active Video Card ────────────────────────────────────────────────────────
//
// IntersectionObserver plays/pauses the video based on viewport visibility.
// This component is NEVER rendered for removed slots — so the observer
// never attaches and the video element never exists in the DOM.

function VideoCard({ src }: { src: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] group">
            <div className="relative rounded-2xl overflow-hidden bg-charcoal shadow-card hover:shadow-luxury transition-shadow duration-500 aspect-[9/16]">
                <video
                    ref={videoRef}
                    src={src}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                />
                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                {/* Play indicator — visible on hover */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white/80 text-[10px] uppercase tracking-widest font-medium">
                        Customer Review
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function ReviewVideos() {
    const [videos, setVideos] = useState<string[]>(FALLBACK_VIDEOS);
    const { removedCount } = useMediaLifecycle();

    useEffect(() => {
        fetchReviewVideos()
            .then(data => {
                if (data.length > 0) setVideos(data.map(v => v.video_url));
            })
            .catch(() => { /* keep fallback */ });
    }, []);

    // Clamp so Infinity (disabled) maps cleanly to "all items".
    const effectiveRemoved = Math.min(removedCount, videos.length);

    // Duplicate for seamless infinite scroll.
    const marqueeItems = [...videos, ...videos];

    return (
        <section className="py-20 lg:py-28 bg-blush overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
                <SectionHeader
                    label="Real Love, Real Reactions"
                    title="Customer Reviews"
                    subtitle="Watch what our customers have to say about their New Eco Roses experience."
                />
            </div>

            {/* Marquee track */}
            <div className="relative w-full max-w-full overflow-hidden">
                {/* Edge fades */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-blush to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-blush to-transparent z-10 pointer-events-none" />

                <div className="marquee-track flex gap-5 py-2 hover:[animation-play-state:paused]">
                    {marqueeItems.map((src, idx) => {
                        // Resolve duplicated idx → original array idx so both
                        // copies of the marquee remove slots in perfect sync.
                        const originalIndex = idx % videos.length;
                        const isRemoved = originalIndex < effectiveRemoved;

                        // When isRemoved, VideoPlaceholder is rendered instead —
                        // no <video> element exists, no IntersectionObserver fires,
                        // no autoplay can occur.
                        return isRemoved ? (
                            <VideoPlaceholder key={idx} />
                        ) : (
                            <VideoCard key={idx} src={src} />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
