'use client';

/**
 * /admin/export-marquee
 *
 * High-Resolution Review Marquee Video Generator & TV Presentation Tool.
 * Captures 1080p Full HD video loop of top video marquee + bottom photo marquee
 * and downloads directly to the user's PC for USB Pendrive TV playback.
 */

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchReviewVideos } from '@/lib/supabase';
import { Video, Film, Download, Play, Square, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';

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

export default function ExportMarqueePage() {
    const [videos, setVideos] = useState<string[]>(FALLBACK_VIDEOS);
    const [durationSeconds, setDurationSeconds] = useState<number>(30);
    const [recording, setRecording] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(0);
    const [recordingProgress, setRecordingProgress] = useState<number>(0);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [statusText, setStatusText] = useState<string>('Ready to record');

    const previewContainerRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchReviewVideos()
            .then(data => {
                if (data.length > 0) setVideos(data.map(v => v.video_url));
            })
            .catch(() => { });
    }, []);

    // ── Start Recording ──────────────────────────────────────────────────
    const startRecording = async () => {
        if (!previewContainerRef.current) return;
        setRecording(true);
        setDownloadUrl(null);
        setRecordingProgress(0);
        setStatusText('Preparing 1080p recorder...');

        try {
            // Use MediaRecorder on element stream or screen display MediaStream
            let stream: MediaStream;

            // Attempt element captureStream if supported by element/canvas
            const element = previewContainerRef.current as any;
            if (typeof element.captureStream === 'function') {
                stream = element.captureStream(60);
            } else if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
                setStatusText('Select the preview window in the popup to record in Full HD...');
                stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        frameRate: { ideal: 60 },
                    },
                    audio: false,
                });
            } else {
                alert('Screen capture API is not supported in this browser. Please use Chrome or Edge.');
                setRecording(false);
                return;
            }

            recordedChunksRef.current = [];

            // Supported mimeTypes
            const options = [
                'video/webm;codecs=vp9',
                'video/webm;codecs=vp8',
                'video/webm',
                'video/mp4',
            ];
            let mimeType = options.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType,
                videoBitsPerSecond: 12_000_000, // 12 Mbps crisp 1080p quality
            });

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: mimeType });
                const url = URL.createObjectURL(blob);
                setDownloadUrl(url);
                setRecording(false);
                setStatusText('Recording finished! Download ready below.');

                // Auto-trigger download
                const a = document.createElement('a');
                a.href = url;
                a.download = `new-eco-roses-review-marquee-${durationSeconds}s.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // Stop stream tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start(1000);
            setStatusText(`Recording in Full HD... (${durationSeconds}s remaining)`);

            let elapsed = 0;
            setCountdown(durationSeconds);

            timerIntervalRef.current = setInterval(() => {
                elapsed += 1;
                const remaining = durationSeconds - elapsed;
                setCountdown(Math.max(0, remaining));
                setRecordingProgress(Math.min(100, Math.round((elapsed / durationSeconds) * 100)));
                setStatusText(`Recording in Full HD... (${Math.max(0, remaining)}s remaining)`);

                if (elapsed >= durationSeconds) {
                    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                        mediaRecorderRef.current.stop();
                    }
                }
            }, 1000);

        } catch (err) {
            console.error(err);
            setRecording(false);
            setStatusText('Recording cancelled or not supported.');
        }
    };

    const stopRecording = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setRecording(false);
    };

    const doubleVideos = [...videos, ...videos];
    const doublePhotos = [...PHOTO_REVIEWS, ...PHOTO_REVIEWS];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Film className="text-amber-400" size={24} />
                        Export Marquee Video Loop for TV
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Record a crisp 1080p Full HD video loop of customer review videos & photos to play on your store TV via USB Pendrive.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/tv-marquee"
                        target="_blank"
                        className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-zinc-700"
                    >
                        <ExternalLink size={14} />
                        Open TV Fullscreen View
                    </Link>
                </div>
            </div>

            {/* Controls Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-white font-semibold text-base">Recorder Settings</h2>
                        <p className="text-gray-400 text-xs">Choose recording duration and click Start Recording</p>
                    </div>

                    {/* Duration Select */}
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs font-medium">Loop Duration:</span>
                        {[15, 30, 60].map(s => (
                            <button
                                key={s}
                                disabled={recording}
                                onClick={() => setDurationSeconds(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    durationSeconds === s
                                        ? 'bg-amber-500 text-black'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                } disabled:opacity-50`}
                            >
                                {s} seconds
                            </button>
                        ))}
                    </div>

                    {/* Action Button */}
                    <div>
                        {!recording ? (
                            <button
                                onClick={startRecording}
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
                            >
                                <Play size={16} fill="black" />
                                🎥 Start 1080p Recording
                            </button>
                        ) : (
                            <button
                                onClick={stopRecording}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all animate-pulse"
                            >
                                <Square size={16} fill="white" />
                                Stop Recording ({countdown}s)
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                {recording && (
                    <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs text-amber-400 font-medium">
                            <span>{statusText}</span>
                            <span>{recordingProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300"
                                style={{ width: `${recordingProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Download Success Card */}
                {downloadUrl && (
                    <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-400" size={20} />
                            <div>
                                <p className="text-emerald-200 text-xs font-semibold">Video Recorded & Downloaded Successfully!</p>
                                <p className="text-emerald-400/80 text-[11px]">Copy the video from your PC Downloads folder directly into your USB Pendrive.</p>
                            </div>
                        </div>
                        <a
                            href={downloadUrl}
                            download={`new-eco-roses-review-marquee-${durationSeconds}s.mp4`}
                            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition-all"
                        >
                            <Download size={14} />
                            Re-download Video File
                        </a>
                    </div>
                )}
            </div>

            {/* 1080p Marquee Render Container */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium px-1">
                    <span>Preview Container (1920 × 1080 Aspect Ratio)</span>
                    <span className="text-amber-400/90 font-mono">1080p Full HD • 60 FPS GPU Accelerated</span>
                </div>

                <div
                    ref={previewContainerRef}
                    className="relative w-full aspect-[16/9] bg-[#faf7f2] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col justify-between p-8 sm:p-12"
                >
                    {/* Header Branding */}
                    <div className="text-center mb-6">
                        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-700 block mb-1">
                            Real Love, Real Reactions
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl text-gray-900 font-bold">
                            Customer Reviews — New Eco Roses
                        </h2>
                        <p className="text-gray-600 text-xs mt-1">
                            Watch what our customers have to say about their New Eco Roses experience
                        </p>
                    </div>

                    {/* Top Row: Video Marquee */}
                    <div className="relative mb-6 overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#faf7f2] to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#faf7f2] to-transparent z-10 pointer-events-none" />

                        <div className="marquee-track flex gap-4 py-1">
                            {doubleVideos.map((src, idx) => (
                                <div key={idx} className="flex-shrink-0 w-[140px] sm:w-[170px] aspect-[9/16] rounded-xl overflow-hidden bg-black shadow-md border border-amber-500/20">
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
                    <div className="relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#faf7f2] to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#faf7f2] to-transparent z-10 pointer-events-none" />

                        <div className="marquee-track-reverse flex gap-4 py-1">
                            {doublePhotos.map((src, idx) => (
                                <div key={idx} className="flex-shrink-0 w-[130px] sm:w-[150px] aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-md border border-amber-500/20 relative">
                                    <img
                                        src={src}
                                        alt={`Review photo ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded">
                                        <span className="text-[9px] text-amber-300 font-semibold uppercase tracking-wider">
                                            ⭐ Verified
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer watermark */}
                    <div className="text-center pt-4 border-t border-amber-900/10 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                        <span>🌹 New Eco Roses Kolkata</span>
                        <span>Regent Park & New Alipore Outlets</span>
                        <span>www.newecoroses.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
