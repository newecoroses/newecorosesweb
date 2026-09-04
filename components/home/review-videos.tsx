'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Volume2, VolumeX, Share2, Play, Pause, X, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { fetchReviewVideos, DBProduct } from '@/lib/supabase';
import { PRODUCTS } from '@/lib/products';
import { useMediaLifecycle } from '@/lib/review-media-state';
import { PLACEHOLDER_BG, PLACEHOLDER_FG } from '@/lib/review-media-config';

interface StoryItem {
    id: string;
    videoUrl: string;
    products: {
        name: string;
        price?: number;
        slug: string;
        image: string;
    }[];
}

const DEFAULT_STORIES: StoryItem[] = [
    {
        id: '1',
        videoUrl: '/review%20videos/review1.mp4',
        products: [
            { name: 'Crimson Elegance Bouquet', price: 1299, slug: 'crimson-elegance-bouquet', image: '/images/products/crimson-elegance-bouquet.webp' },
            { name: 'Personalized Photo Mug', price: 299, slug: 'personalized-mug-and-roses', image: '/images/products/personalized-mug-and-roses.webp' },
            { name: 'Heart Shape Rose Box', price: 1499, slug: 'heart-shape-rose-box', image: '/images/products/heart-shape-rose-box.webp' }
        ]
    },
    {
        id: '2',
        videoUrl: '/review%20videos/review2.mp4',
        products: [
            { name: 'Sunny Sunflower Bouquet', price: 1049, slug: '2-sunflower-babys-breath-big-bouquet', image: '/images/products/2-sunflower-babys-breath-big-bouquet.jpeg' },
            { name: 'Golden Yellow Rose Bouquet', price: 1199, slug: 'golden-yellow-rose-bouquet', image: '/images/products/golden-yellow-rose-bouquet.webp' },
            { name: 'Sunflower & Baby Breath Delight', price: 1249, slug: 'sunflower-bouquet', image: '/images/products/sunflower-bouquet.jpeg' }
        ]
    },
    {
        id: '3',
        videoUrl: '/review%20videos/review3.mp4',
        products: [
            { name: 'Chips & Chocolate Celebration Hamper', price: 1499, slug: 'chips-chocolate-hamper', image: '/images/products/chips-chocolate-hamper-1.jpg' },
            { name: 'Ferrero Rocher Luxury Hamper', price: 1699, slug: 'ferrero-rocher-hamper', image: '/images/products/ferrero-rocher-hamper.jpeg' },
            { name: 'Dairy Milk Silk Sweet Hamper', price: 999, slug: 'dairy-milk-chocolate-hamper', image: '/images/products/dairy-milk-chocolate-hamper.jpeg' }
        ]
    },
    {
        id: '4',
        videoUrl: '/review%20videos/review4.mp4',
        products: [
            { name: 'Royal Orchid & Lily Symphony', price: 2499, slug: 'royal-orchid-lily-bouquet', image: '/images/products/royal-orchid-lily-bouquet.webp' },
            { name: 'White Lily Elegance Bouquet', price: 1899, slug: 'white-lily-elegance-bouquet', image: '/images/products/white-lily-elegance-bouquet-1.jpg' },
            { name: 'Purple Elegance Lily Bouquet', price: 1799, slug: 'purple-elegance-lily-bouquet', image: '/images/products/purple-elegance-lily-bouquet.webp' }
        ]
    },
    {
        id: '5',
        videoUrl: '/review%20videos/review5.mp4',
        products: [
            { name: 'Blush & Ivory Celebration Bouquet', price: 1399, slug: 'blush-ivory-celebration-bouquet', image: '/images/products/blush-ivory-celebration-bouquet.webp' },
            { name: 'Pink Rose Garden Bouquet', price: 1199, slug: 'pink-rose-garden-bouquet', image: '/images/products/pink-rose-garden-bouquet.webp' },
            { name: 'Pink Lily Blossom Bouquet', price: 1599, slug: 'pink-lily-blossom-bouquet', image: '/images/products/pink-lily-blossom-bouquet.webp' }
        ]
    },
    {
        id: '6',
        videoUrl: '/review%20videos/review6.mp4',
        products: [
            { name: 'Black Velvet Rose Bouquet', price: 1699, slug: 'black-velvet-rose-bouquet', image: '/images/products/black-velvet-rose-bouquet.webp' },
            { name: 'Black & Crimson Luxe Bouquet', price: 1799, slug: 'black-crimson-rose-luxe-bouquet', image: '/images/products/black-crimson-rose-luxe-bouquet.webp' },
            { name: 'Crimson Rose Luxe Bouquet', price: 1499, slug: 'crimson-rose-luxe-bouquet', image: '/images/products/crimson-rose-luxe-bouquet.webp' }
        ]
    },
    {
        id: '7',
        videoUrl: '/review%20videos/review7.mp4',
        products: [
            { name: 'Blue Balloon Floral Celebration Bouquet', price: 1549, slug: 'blue-balloon-floral-celebration-bouquet', image: '/images/products/blue-balloon-floral-celebration-bouquet.webp' },
            { name: 'Pink Balloon Sweet Celebration', price: 1499, slug: 'pink-balloon-sweet-celebration-bouquet', image: '/images/products/pink-balloon-sweet-celebration-bouquet.webp' },
            { name: 'Sunshine Balloon Floral Bouquet', price: 1399, slug: 'sunshine-balloon-floral-celebration-bouquet', image: '/images/products/sunshine-balloon-floral-celebration-bouquet.webp' }
        ]
    }
];

function VideoPlaceholder() {
    return (
        <div className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px]">
            <div
                className="relative rounded-2xl overflow-hidden shadow-card aspect-[9/16] flex flex-col items-center justify-center gap-4"
                style={{ backgroundColor: PLACEHOLDER_BG }}
            >
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

function StoryCard({
    story,
    onOpenModal
}: {
    story: StoryItem;
    onOpenModal: (story: StoryItem) => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                    setIsPlaying(true);
                } else {
                    video.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play().catch(() => {});
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'New Eco Roses Customer Story',
                    url: window.location.href,
                });
            } catch {
                // user cancelled or unsupported
            }
        }
    };

    return (
        <div
            onClick={() => onOpenModal(story)}
            className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] group cursor-pointer"
        >
            <div className="relative rounded-2xl overflow-hidden bg-black shadow-card hover:shadow-2xl transition-all duration-300 aspect-[9/16]">
                <video
                    ref={videoRef}
                    src={story.videoUrl}
                    muted={isMuted}
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                />

                {/* Top Control Buttons Bar */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-auto">
                    {/* Expand / Maximize Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenModal(story);
                        }}
                        className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xs"
                        title="View Fullscreen Story"
                    >
                        <Maximize2 size={13} />
                    </button>

                    <div className="flex items-center gap-2">
                        {/* Mute / Unmute Button */}
                        <button
                            onClick={toggleMute}
                            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xs"
                            title={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        </button>

                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xs"
                            title="Share"
                        >
                            <Share2 size={13} />
                        </button>
                    </div>
                </div>

                {/* Center Play/Pause Overlay indicator on click */}
                <div
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center z-10"
                >
                    {!isPlaying && (
                        <div className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md shadow-lg">
                            <Play size={22} className="translate-x-0.5" />
                        </div>
                    )}
                </div>

                {/* Bottom In-Video Product Card (Reference Style) */}
                {story.products.length > 0 && (
                    <div className="absolute bottom-3 inset-x-3 z-20 pointer-events-auto">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
                            {story.products.slice(0, 2).map((prod, pIdx) => (
                                <Link
                                    key={pIdx}
                                    href={`/product/${prod.slug}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 bg-white/95 hover:bg-white text-[#1c1917] p-1.5 rounded-xl shadow-md backdrop-blur-md flex-1 min-w-0 transition-all border border-white/60 hover:scale-[1.02]"
                                >
                                    <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                        <Image
                                            src={prod.image}
                                            alt={prod.name}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1 pr-1">
                                        <span className="text-[10px] font-semibold text-[#1c1917] line-clamp-1 leading-tight">
                                            {prod.name}
                                        </span>
                                        {prod.price && (
                                            <span className="text-[10px] font-bold text-[#1e40af] mt-0.5">
                                                ₹{prod.price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Full Screen Story Modal ──────────────────────────────────────────────────

function StoryModal({
    story,
    onClose,
    onNext,
    onPrev
}: {
    story: StoryItem;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}) {
    const modalVideoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        const video = modalVideoRef.current;
        if (video) {
            video.currentTime = 0;
            video.play().catch(() => {});
            setIsPlaying(true);
        }
    }, [story]);

    // Keyboard navigation (ESC, Left, Right)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev]);

    const togglePlay = () => {
        const video = modalVideoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play().catch(() => {});
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        const video = modalVideoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'New Eco Roses Joyful Story',
                    url: window.location.href,
                });
            } catch {}
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center z-50 transition-all"
                title="Close"
            >
                <X size={20} />
            </button>

            {/* Left Nav Arrow */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
                className="hidden md:flex absolute left-6 w-12 h-12 rounded-full bg-white/20 hover:bg-white/35 text-white items-center justify-center z-50 transition-all"
                title="Previous Story"
            >
                <ChevronLeft size={24} />
            </button>

            {/* Right Nav Arrow */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
                className="hidden md:flex absolute right-6 w-12 h-12 rounded-full bg-white/20 hover:bg-white/35 text-white items-center justify-center z-50 transition-all"
                title="Next Story"
            >
                <ChevronRight size={24} />
            </button>

            {/* Modal Dialog Content */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-w-4xl w-full max-h-[90vh] md:max-h-[640px]"
            >
                {/* Video Area (Left) */}
                <div className="relative w-full md:w-[360px] lg:w-[400px] aspect-[9/16] md:aspect-auto bg-black flex-shrink-0">
                    <video
                        ref={modalVideoRef}
                        src={story.videoUrl}
                        muted={isMuted}
                        loop
                        playsInline
                        autoPlay
                        className="w-full h-full object-cover"
                    />

                    {/* Top Overlay Controls */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-end gap-2 z-20">
                        <button
                            onClick={toggleMute}
                            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xs"
                            title={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        </button>
                        <button
                            onClick={handleShare}
                            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xs"
                            title="Share"
                        >
                            <Share2 size={13} />
                        </button>
                    </div>

                    {/* Play/Pause center overlay toggle */}
                    <div
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                    >
                        {!isPlaying && (
                            <div className="w-14 h-14 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md shadow-2xl">
                                <Play size={28} className="translate-x-0.5" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Product List Panel (Right) */}
                <div className="flex-1 flex flex-col bg-white p-5 sm:p-6 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                        <ShoppingBag size={18} className="text-[#1e40af]" />
                        <h3 className="font-bold text-[#1c1917] text-base">Featured In This Story</h3>
                    </div>

                    <div className="space-y-3 flex-1">
                        {story.products.map((prod, idx) => (
                            <Link
                                key={idx}
                                href={`/product/${prod.slug}`}
                                onClick={onClose}
                                className="flex items-center gap-3 p-2.5 rounded-2xl border border-gray-100 hover:border-[#1e40af]/30 hover:bg-blue-50/40 transition-all duration-300 group"
                            >
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                    <Image
                                        src={prod.image}
                                        alt={prod.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                        sizes="64px"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs sm:text-sm font-semibold text-[#1c1917] group-hover:text-[#1e40af] line-clamp-1 transition-colors">
                                        {prod.name}
                                    </h4>
                                    {prod.price && (
                                        <p className="text-xs sm:text-sm font-bold text-[#1e40af] mt-0.5">
                                            ₹{prod.price.toLocaleString()}
                                        </p>
                                    )}
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1e40af] mt-1">
                                        View Product <ChevronRight size={10} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Main ReviewVideos Section ────────────────────────────────────────────────

export default function ReviewVideos() {
    const [stories, setStories] = useState<StoryItem[]>(DEFAULT_STORIES);
    const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
    const { removedCount } = useMediaLifecycle();

    useEffect(() => {
        fetchReviewVideos()
            .then(data => {
                if (data.length > 0) {
                    const mapped: StoryItem[] = data.map((v, i) => {
                        const fallback = DEFAULT_STORIES[i % DEFAULT_STORIES.length];
                        return {
                            id: v.id || String(i),
                            videoUrl: v.video_url,
                            products: fallback.products
                        };
                    });
                    setStories(mapped);
                }
            })
            .catch(() => { /* keep defaults */ });
    }, []);

    const effectiveRemoved = Math.min(removedCount, stories.length);
    const marqueeItems = [...stories, ...stories];

    const currentIdx = activeStory ? stories.findIndex(s => s.id === activeStory.id) : -1;

    const handleNextStory = () => {
        if (currentIdx === -1) return;
        const nextIdx = (currentIdx + 1) % stories.length;
        setActiveStory(stories[nextIdx]);
    };

    const handlePrevStory = () => {
        if (currentIdx === -1) return;
        const prevIdx = (currentIdx - 1 + stories.length) % stories.length;
        setActiveStory(stories[prevIdx]);
    };

    return (
        <section className="py-10 sm:py-14 md:py-16 bg-[#faf7f2] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1c1917] tracking-tight">
                        Joyful Gifting Stories
                    </h2>
                    <span className="text-xs sm:text-sm text-[#78716c] font-normal">
                        Real customer moments & reviews
                    </span>
                </div>
            </div>

            {/* Infinite Horizontal Carousel */}
            <div className="relative w-full max-w-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-28 bg-gradient-to-r from-[#faf7f2] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-28 bg-gradient-to-l from-[#faf7f2] to-transparent z-10 pointer-events-none" />

                <div className="marquee-track flex gap-4 sm:gap-5 py-2 hover:[animation-play-state:paused]">
                    {marqueeItems.map((story, idx) => {
                        const originalIndex = idx % stories.length;
                        const isRemoved = originalIndex < effectiveRemoved;

                        return isRemoved ? (
                            <VideoPlaceholder key={idx} />
                        ) : (
                            <StoryCard
                                key={idx}
                                story={story}
                                onOpenModal={(s) => setActiveStory(s)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Fullscreen Video Story Lightbox Modal */}
            <AnimatePresence>
                {activeStory && (
                    <StoryModal
                        story={activeStory}
                        onClose={() => setActiveStory(null)}
                        onNext={handleNextStory}
                        onPrev={handlePrevStory}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

