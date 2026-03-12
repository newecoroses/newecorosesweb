'use client';

import { useRef, useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/section-header';
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
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                {/* Play indicator */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white/80 text-[10px] uppercase tracking-widest font-medium">Customer Review</span>
                </div>
            </div>
        </div>
    );
}

export default function ReviewVideos() {
    const [videos, setVideos] = useState<string[]>(FALLBACK_VIDEOS);

    useEffect(() => {
        fetchReviewVideos().then(data => {
            if (data.length > 0) {
                setVideos(data.map(v => v.video_url));
            }
        }).catch(() => { /* use fallback */ });
    }, []);

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

            {/* Marquee Track */}
            <div className="relative">
                {/* Left fade */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-blush to-transparent z-10 pointer-events-none" />
                {/* Right fade */}
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-blush to-transparent z-10 pointer-events-none" />

                <div className="marquee-track flex gap-5 py-2 hover:[animation-play-state:paused]">
                    {marqueeItems.map((src, idx) => (
                        <VideoCard key={idx} src={src} />
                    ))}
                </div>
            </div>
        </section>
    );
}
