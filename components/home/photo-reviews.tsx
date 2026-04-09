'use client';

import Image from 'next/image';

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

// Blur placeholder
const BLUR =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIBAAAQMEAwEAAAAAAAAAAAAAAQIDBAUREiFRYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwozNNiuqitq0rSiP2ghAA2+NQAAAAASUVORK5CYII=';

function PhotoCard({ src, index }: { src: string; index: number }) {
    return (
        <div className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] group">
            <div className="relative rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500 aspect-[3/4] bg-[#faf7f2]">
                <Image
                    src={src}
                    alt={`Customer photo review ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 200px, (max-width: 1024px) 220px, 240px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL={BLUR}
                    priority={index < 4}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                {/* Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] text-white/90 uppercase tracking-widest font-medium">
                        ⭐ Verified Review
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function PhotoReviews() {
    // Duplicate for seamless infinite scroll
    const marqueeItems = [...PHOTO_REVIEWS, ...PHOTO_REVIEWS];

    return (
        <section className="pb-20 lg:pb-28 bg-blush overflow-hidden">
            {/* Marquee Track — scrolls opposite direction to videos, no gap */}
            <div className="relative">
                {/* Left fade */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-blush to-transparent z-10 pointer-events-none" />
                {/* Right fade */}
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-blush to-transparent z-10 pointer-events-none" />

                <div className="marquee-track-reverse flex gap-5 py-2 hover:[animation-play-state:paused]">
                    {marqueeItems.map((src, idx) => (
                        <PhotoCard key={idx} src={src} index={idx % PHOTO_REVIEWS.length} />
                    ))}
                </div>
            </div>
        </section>
    );
}
