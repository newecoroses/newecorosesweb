'use client';

import Image from 'next/image';
import { useMediaLifecycle } from '@/lib/review-media-state';
import { PLACEHOLDER_BG, PLACEHOLDER_FG } from '@/lib/review-media-config';

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

const BLUR =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIBAAAQMEAwEAAAAAAAAAAAAAAQIDBAUREiFRYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwozNNiuqitq0rSiP2ghAA2+NQAAAAASUVORK5CYII=';

// ─── Placeholder ─────────────────────────────────────────────────────────────
//
// Identical outer dimensions to PhotoCard — zero layout shift.
// No image is loaded, no network request is made.

function PhotoPlaceholder() {
    return (
        <div className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px]">
            <div
                className="relative rounded-2xl overflow-hidden shadow-card aspect-[3/4] flex flex-col items-center justify-center gap-3"
                style={{ backgroundColor: PLACEHOLDER_BG }}
            >
                {/* Rose icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={PLACEHOLDER_FG}
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-10 h-10 opacity-60"
                    aria-hidden="true"
                >
                    <path d="M12 22V12" />
                    <path d="M12 12C12 12 7 9 7 5a5 5 0 0 1 10 0c0 4-5 7-5 7Z" />
                    <path d="M12 12c0 0-2 3-5 3s-3-3-3-3 1-3 4-3 4 3 4 3Z" />
                    <path d="M12 12c0 0 2 3 5 3s3-3 3-3-1-3-4-3-4 3-4 3Z" />
                </svg>
                <span
                    className="text-[10px] uppercase tracking-widest font-medium text-center px-4 opacity-70"
                    style={{ color: PLACEHOLDER_FG }}
                >
                    Photo Review
                </span>
            </div>
        </div>
    );
}

// ─── Active Photo Card ────────────────────────────────────────────────────────

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

// ─── Section ─────────────────────────────────────────────────────────────────

export default function PhotoReviews() {
    const { removedCount } = useMediaLifecycle();

    // Clamp so that Infinity (disabled) maps cleanly to "all items".
    const effectiveRemoved = Math.min(removedCount, PHOTO_REVIEWS.length);

    // Duplicate for seamless infinite scroll — the marquee CSS animates
    // a translateX(-50%) so both copies cycle invisibly.
    const marqueeItems = [...PHOTO_REVIEWS, ...PHOTO_REVIEWS];

    return (
        <section className="pb-20 lg:pb-28 bg-blush overflow-hidden">
            {/* Marquee track — reverse direction vs. videos */}
            <div className="relative w-full max-w-full overflow-hidden">
                {/* Edge fades */}
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-blush to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-blush to-transparent z-10 pointer-events-none" />

                <div className="marquee-track-reverse flex gap-5 py-2 hover:[animation-play-state:paused]">
                    {marqueeItems.map((src, idx) => {
                        // Resolve duplicated idx → original array idx so both
                        // copies of the marquee degrade in perfect sync.
                        const originalIndex = idx % PHOTO_REVIEWS.length;
                        const isRemoved = originalIndex < effectiveRemoved;

                        return isRemoved ? (
                            <PhotoPlaceholder key={idx} />
                        ) : (
                            <PhotoCard key={idx} src={src} index={originalIndex} />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
