'use client';

/**
 * /admin/export-marquee
 *
 * High-Resolution Review Marquee Video Generator & TV Presentation Tool.
 * Records directly from an offscreen <canvas> using captureStream() —
 * no browser screen-share dialog. Downloads 1080p webm automatically.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { fetchReviewVideos } from '@/lib/supabase';
import { Film, Download, Play, Square, ExternalLink, CheckCircle2 } from 'lucide-react';

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

// Canvas dimensions — 1920×1080 Full HD
const CW = 1920;
const CH = 1080;

// Marquee speeds (pixels per frame at 60fps)
const SPEED_FWD = 1.4;
const SPEED_REV = 1.1;

export default function ExportMarqueePage() {
    const [videos, setVideos] = useState<string[]>(FALLBACK_VIDEOS);
    const [durationSeconds, setDurationSeconds] = useState<number>(30);
    const [recording, setRecording] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(0);
    const [recordingProgress, setRecordingProgress] = useState<number>(0);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [statusText, setStatusText] = useState<string>('Ready to record');
    const [assetsReady, setAssetsReady] = useState<boolean>(false);

    // Canvas & animation refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Pre-loaded asset refs
    const videoElemsRef = useRef<HTMLVideoElement[]>([]);
    const photoElemsRef = useRef<HTMLImageElement[]>([]);

    // Marquee scroll offsets
    const xFwdRef = useRef<number>(0);
    const xRevRef = useRef<number>(0);

    useEffect(() => {
        fetchReviewVideos()
            .then(data => { if (data.length > 0) setVideos(data.map(v => v.video_url)); })
            .catch(() => { });
    }, []);

    // Pre-load all videos & images into DOM elements
    useEffect(() => {
        // Load video elements (hidden, muted, looping)
        const vids = [...videos, ...videos].map(src => {
            const v = document.createElement('video');
            v.src = src;
            v.muted = true;
            v.loop = true;
            v.playsInline = true;
            v.crossOrigin = 'anonymous';
            v.style.display = 'none';
            document.body.appendChild(v);
            v.play().catch(() => { });
            return v;
        });
        videoElemsRef.current = vids;

        // Load photo images
        const imgs = [...PHOTO_REVIEWS, ...PHOTO_REVIEWS].map(src => {
            const img = new Image();
            img.src = src;
            img.crossOrigin = 'anonymous';
            return img;
        });
        photoElemsRef.current = imgs;

        // Wait for all images to load
        Promise.all(imgs.map(img => new Promise(res => {
            if (img.complete) res(null);
            else { img.onload = res; img.onerror = res; }
        }))).then(() => setAssetsReady(true));

        return () => {
            vids.forEach(v => { v.pause(); document.body.removeChild(v); });
        };
    }, [videos]);

    // ── Canvas Draw Loop ──────────────────────────────────────────────────
    const drawFrame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const vids = videoElemsRef.current;
        const imgs = photoElemsRef.current;

        // Background
        ctx.fillStyle = '#faf7f2';
        ctx.fillRect(0, 0, CW, CH);

        // ── Header text ──
        ctx.textAlign = 'center';
        ctx.fillStyle = '#92400e'; // amber-800
        ctx.font = 'bold 28px "Georgia", serif';
        ctx.letterSpacing = '6px';
        ctx.fillText('REAL LOVE, REAL REACTIONS', CW / 2, 90);

        ctx.fillStyle = '#111827';
        ctx.font = 'bold 64px "Georgia", serif';
        ctx.letterSpacing = '0px';
        ctx.fillText('Customer Reviews — New Eco Roses', CW / 2, 168);

        ctx.fillStyle = '#6b7280';
        ctx.font = '28px sans-serif';
        ctx.fillText('Watch what our customers have to say about their New Eco Roses experience', CW / 2, 218);

        // ── Video marquee row ──
        const VID_W = 200;
        const VID_H = Math.round(VID_W * (16 / 9)); // 9:16 portrait = 356
        const VID_GAP = 20;
        const VID_Y = 250;
        const VID_ROW_H = VID_H;

        const totalVidW = vids.length * (VID_W + VID_GAP);
        xFwdRef.current = (xFwdRef.current + SPEED_FWD) % totalVidW;

        // Clip to video row
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, VID_Y, CW, VID_ROW_H);
        ctx.clip();

        for (let i = 0; i < vids.length + 2; i++) {
            const vidIdx = i % vids.length;
            const x = (i * (VID_W + VID_GAP)) - xFwdRef.current;
            if (x + VID_W < -50 || x > CW + 50) continue;

            // Rounded rect clip per video
            ctx.save();
            roundRect(ctx, x, VID_Y, VID_W, VID_ROW_H, 14);
            ctx.clip();
            try { ctx.drawImage(vids[vidIdx], x, VID_Y, VID_W, VID_ROW_H); } catch { }
            ctx.restore();

            // Border
            ctx.save();
            roundRect(ctx, x, VID_Y, VID_W, VID_ROW_H, 14);
            ctx.strokeStyle = 'rgba(245,158,11,0.25)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }

        // Left/right fade gradients for video row
        const gL = ctx.createLinearGradient(0, 0, 100, 0);
        gL.addColorStop(0, '#faf7f2');
        gL.addColorStop(1, 'transparent');
        ctx.fillStyle = gL;
        ctx.fillRect(0, VID_Y, 100, VID_ROW_H);

        const gR = ctx.createLinearGradient(CW - 100, 0, CW, 0);
        gR.addColorStop(0, 'transparent');
        gR.addColorStop(1, '#faf7f2');
        ctx.fillStyle = gR;
        ctx.fillRect(CW - 100, VID_Y, 100, VID_ROW_H);

        ctx.restore();

        // ── Photo marquee row (reverse direction) ──
        const PHOTO_W = 180;
        const PHOTO_H = Math.round(PHOTO_W * (4 / 3));
        const PHOTO_GAP = 20;
        const PHOTO_Y = VID_Y + VID_ROW_H + 30;

        const totalPhotoW = imgs.length * (PHOTO_W + PHOTO_GAP);
        xRevRef.current = (xRevRef.current + SPEED_REV) % totalPhotoW;
        // Reverse direction: subtract instead of add
        const revOffset = totalPhotoW - xRevRef.current;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, PHOTO_Y, CW, PHOTO_H);
        ctx.clip();

        for (let i = 0; i < imgs.length + 2; i++) {
            const imgIdx = i % imgs.length;
            const x = (i * (PHOTO_W + PHOTO_GAP)) - revOffset % totalPhotoW;
            if (x + PHOTO_W < -50 || x > CW + 50) continue;

            ctx.save();
            roundRect(ctx, x, PHOTO_Y, PHOTO_W, PHOTO_H, 12);
            ctx.clip();
            try { ctx.drawImage(imgs[imgIdx], x, PHOTO_Y, PHOTO_W, PHOTO_H); } catch { }
            ctx.restore();

            // Verified badge
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fillRect(x + 8, PHOTO_Y + PHOTO_H - 26, 72, 20);
            ctx.fillStyle = '#fcd34d';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('⭐ Verified', x + 12, PHOTO_Y + PHOTO_H - 11);

            ctx.save();
            roundRect(ctx, x, PHOTO_Y, PHOTO_W, PHOTO_H, 12);
            ctx.strokeStyle = 'rgba(245,158,11,0.25)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }

        // Photo row fade gradients
        const pL = ctx.createLinearGradient(0, 0, 100, 0);
        pL.addColorStop(0, '#faf7f2');
        pL.addColorStop(1, 'transparent');
        ctx.fillStyle = pL;
        ctx.fillRect(0, PHOTO_Y, 100, PHOTO_H);

        const pR = ctx.createLinearGradient(CW - 100, 0, CW, 0);
        pR.addColorStop(0, 'transparent');
        pR.addColorStop(1, '#faf7f2');
        ctx.fillStyle = pR;
        ctx.fillRect(CW - 100, PHOTO_Y, 100, PHOTO_H);

        ctx.restore();

        // ── Footer ──
        const FOOTER_Y = CH - 50;
        ctx.fillStyle = 'rgba(217,119,6,0.15)';
        ctx.fillRect(0, FOOTER_Y - 10, CW, 1);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#6b7280';
        ctx.font = '22px sans-serif';
        ctx.fillText('🌹 New Eco Roses Kolkata', 80, FOOTER_Y + 14);

        ctx.textAlign = 'center';
        ctx.fillText('Regent Park & New Alipore Outlets', CW / 2, FOOTER_Y + 14);

        ctx.textAlign = 'right';
        ctx.fillText('www.newecoroses.com', CW - 80, FOOTER_Y + 14);

        rafRef.current = requestAnimationFrame(drawFrame);
    }, []);

    // Start the canvas loop when assets are ready
    useEffect(() => {
        if (!assetsReady) return;
        rafRef.current = requestAnimationFrame(drawFrame);
        return () => cancelAnimationFrame(rafRef.current);
    }, [assetsReady, drawFrame]);

    // ── Start Recording (no dialog!) ──────────────────────────────────────
    const startRecording = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setRecording(true);
        setDownloadUrl(null);
        setRecordingProgress(0);
        setStatusText('Starting canvas recorder...');

        recordedChunksRef.current = [];

        // Capture directly from canvas — zero browser dialog
        const stream = canvas.captureStream(60);

        const mimeOptions = [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm',
        ];
        const mimeType = mimeOptions.find(t => MediaRecorder.isTypeSupported(t)) || 'video/webm';

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: 12_000_000,
        });

        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = e => {
            if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: mimeType });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            setRecording(false);
            setStatusText('Done! Video downloaded to your PC.');

            const a = document.createElement('a');
            a.href = url;
            a.download = `new-eco-roses-marquee-${durationSeconds}s.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        mediaRecorder.start(500);
        setStatusText(`Recording 1080p canvas... (${durationSeconds}s)`);

        let elapsed = 0;
        setCountdown(durationSeconds);

        timerRef.current = setInterval(() => {
            elapsed += 1;
            const remaining = durationSeconds - elapsed;
            setCountdown(Math.max(0, remaining));
            setRecordingProgress(Math.min(100, Math.round((elapsed / durationSeconds) * 100)));
            setStatusText(`Recording 1080p canvas... (${Math.max(0, remaining)}s remaining)`);

            if (elapsed >= durationSeconds) {
                if (timerRef.current) clearInterval(timerRef.current);
                if (mediaRecorderRef.current?.state !== 'inactive') {
                    mediaRecorderRef.current?.stop();
                }
            }
        }, 1000);
    };

    const stopRecording = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop();
        setRecording(false);
    };

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
                        Records directly from the canvas — no screen-share popup. Downloads a crisp 1080p WebM for USB TV playback.
                    </p>
                </div>
                <Link
                    href="/tv-marquee"
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-zinc-700"
                >
                    <ExternalLink size={14} />
                    Open TV Fullscreen View
                </Link>
            </div>

            {/* Controls */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-white font-semibold text-base">Recorder Settings</h2>
                        <p className="text-gray-400 text-xs">
                            {assetsReady
                                ? 'Assets loaded. Choose duration and click Start Recording.'
                                : 'Loading video & image assets...'}
                        </p>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs font-medium">Duration:</span>
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
                                {s}s
                            </button>
                        ))}
                    </div>

                    {/* Action */}
                    <div>
                        {!recording ? (
                            <button
                                onClick={startRecording}
                                disabled={!assetsReady}
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Play size={16} fill="black" />
                                Start Recording
                            </button>
                        ) : (
                            <button
                                onClick={stopRecording}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all animate-pulse"
                            >
                                <Square size={16} fill="white" />
                                Stop ({countdown}s left)
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress */}
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

                {/* Download Success */}
                {downloadUrl && (
                    <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-400" size={20} />
                            <div>
                                <p className="text-emerald-200 text-xs font-semibold">Recorded & downloaded!</p>
                                <p className="text-emerald-400/80 text-[11px]">Copy the .webm file from Downloads to your USB Pendrive.</p>
                            </div>
                        </div>
                        <a
                            href={downloadUrl}
                            download={`new-eco-roses-marquee-${durationSeconds}s.webm`}
                            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition-all"
                        >
                            <Download size={14} />
                            Re-download
                        </a>
                    </div>
                )}
            </div>

            {/* Canvas Preview */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium px-1">
                    <span>Live Canvas Preview (1920 × 1080)</span>
                    <span className="text-amber-400/90 font-mono">1080p Full HD · 60 FPS · Direct Canvas Capture</span>
                </div>

                {!assetsReady && (
                    <div className="w-full aspect-[16/9] bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
                        <p className="text-gray-500 text-sm animate-pulse">Loading assets...</p>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    width={CW}
                    height={CH}
                    className={`w-full aspect-[16/9] rounded-2xl border border-gray-800 shadow-2xl object-contain ${assetsReady ? 'block' : 'hidden'}`}
                    style={{ background: '#faf7f2' }}
                />
            </div>
        </div>
    );
}

// ── Helpers ──────────────────────────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
