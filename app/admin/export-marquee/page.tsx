'use client';

/**
 * /admin/export-marquee
 *
 * Records a 1080p video directly from an offscreen <canvas> — no screen-share
 * dialog. Videos are kept off-screen (not display:none) so the browser
 * continues decoding frames, giving smooth playback in the canvas.
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

const CW = 1920;
const CH = 1080;
const FPS = 60;
const VIDEO_SPEED = 1.6;   // px per frame forward
const PHOTO_SPEED = 1.2;   // px per frame reverse

// ── Premium colour palette ────────────────────────────────────────────────
const BG_DARK   = '#090b08';
const GOLD_1    = '#c9a84c';
const GOLD_2    = '#e8c96b';
const GOLD_3    = '#f5e0a0';
const ROSE_MID  = '#7b2434';
const WHITE_90  = 'rgba(255,255,255,0.90)';
const WHITE_50  = 'rgba(255,255,255,0.50)';
const WHITE_15  = 'rgba(255,255,255,0.15)';
const WHITE_06  = 'rgba(255,255,255,0.06)';

export default function ExportMarqueePage() {
    const [videos, setVideos]             = useState<string[]>(FALLBACK_VIDEOS);
    const [durationSeconds, setDuration]  = useState<number>(30);
    const [recording, setRecording]       = useState<boolean>(false);
    const [countdown, setCountdown]       = useState<number>(0);
    const [progress, setProgress]         = useState<number>(0);
    const [downloadUrl, setDownloadUrl]   = useState<string | null>(null);
    const [statusText, setStatusText]     = useState<string>('Ready to record');
    const [assetsReady, setAssetsReady]   = useState<boolean>(false);

    const canvasRef      = useRef<HTMLCanvasElement>(null);
    const rafRef         = useRef<number>(0);
    const mrRef          = useRef<MediaRecorder | null>(null);
    const chunksRef      = useRef<Blob[]>([]);
    const timerRef       = useRef<NodeJS.Timeout | null>(null);
    const videoElemsRef  = useRef<HTMLVideoElement[]>([]);
    const photoElemsRef  = useRef<HTMLImageElement[]>([]);
    const xFwdRef        = useRef<number>(0);
    const xRevRef        = useRef<number>(0);

    // Pre-load assets on mount
    useEffect(() => {
        fetchReviewVideos()
            .then(d => { if (d.length > 0) setVideos(d.map(v => v.video_url)); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const doubleVids = [...videos, ...videos];

        // ─ Video elements: positioned off-screen (NOT display:none)
        // so the browser keeps decoding every frame.
        const vids: HTMLVideoElement[] = doubleVids.map(src => {
            const v = document.createElement('video');
            v.src = src;
            v.muted        = true;
            v.loop         = true;
            v.playsInline  = true;
            v.preload      = 'auto';
            // Off-screen but visible to the decode pipeline
            Object.assign(v.style, {
                position:      'fixed',
                left:          '-9999px',
                top:           '0',
                width:         '160px',
                height:        '284px',
                pointerEvents: 'none',
                opacity:       '0',
                zIndex:        '-1',
            });
            document.body.appendChild(v);
            v.play().catch(() => {});
            return v;
        });
        videoElemsRef.current = vids;

        // ─ Photo images
        const doublePhotos = [...PHOTO_REVIEWS, ...PHOTO_REVIEWS];
        const imgs: HTMLImageElement[] = doublePhotos.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });
        photoElemsRef.current = imgs;

        Promise.all(imgs.map(img =>
            new Promise(res => {
                if (img.complete) res(null);
                else { img.onload = res; img.onerror = res; }
            })
        )).then(() => setAssetsReady(true));

        return () => {
            vids.forEach(v => { v.pause(); document.body.removeChild(v); });
        };
    }, [videos]);

    // ── Draw one frame onto the 1920×1080 canvas ─────────────────────────
    const drawFrame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const vids = videoElemsRef.current;
        const imgs = photoElemsRef.current;

        // ── BACKGROUND ──────────────────────────────────────────────────
        ctx.fillStyle = BG_DARK;
        ctx.fillRect(0, 0, CW, CH);

        // Subtle radial glow behind title
        const glow = ctx.createRadialGradient(CW / 2, 200, 0, CW / 2, 200, 700);
        glow.addColorStop(0, 'rgba(201,168,76,0.10)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, CW, 480);

        // Top gold line
        const topLine = ctx.createLinearGradient(0, 0, CW, 0);
        topLine.addColorStop(0,   'transparent');
        topLine.addColorStop(0.2, GOLD_1);
        topLine.addColorStop(0.5, GOLD_3);
        topLine.addColorStop(0.8, GOLD_1);
        topLine.addColorStop(1,   'transparent');
        ctx.fillStyle = topLine;
        ctx.fillRect(0, 0, CW, 2);

        // Bottom gold line
        ctx.fillStyle = topLine;
        ctx.fillRect(0, CH - 2, CW, 2);

        // ── HEADER ──────────────────────────────────────────────────────
        // Eyebrow
        ctx.textAlign = 'center';
        ctx.fillStyle = GOLD_1;
        ctx.font      = `600 26px "Georgia", serif`;
        ctx.globalAlpha = 0.75;
        ctx.fillText('★  REAL EXPERIENCES  •  REAL LOVE  ★', CW / 2, 80);
        ctx.globalAlpha = 1;

        // Brand name — large elegant serif
        ctx.font      = `bold 96px "Georgia", serif`;
        ctx.fillStyle = WHITE_90;
        ctx.fillText('New Eco Roses', CW / 2, 185);

        // Gold underline beneath brand name
        const underlineW = 560;
        const underlineX = (CW - underlineW) / 2;
        const uGrad = ctx.createLinearGradient(underlineX, 0, underlineX + underlineW, 0);
        uGrad.addColorStop(0,   'transparent');
        uGrad.addColorStop(0.5, GOLD_2);
        uGrad.addColorStop(1,   'transparent');
        ctx.fillStyle = uGrad;
        ctx.fillRect(underlineX, 200, underlineW, 2);

        // Subtitle
        ctx.font      = `300 32px "Georgia", serif`;
        ctx.fillStyle = WHITE_50;
        ctx.fillText('Customer Reviews & Stories', CW / 2, 252);

        // ── VIDEO MARQUEE ────────────────────────────────────────────────
        const VW = 216;                           // video card width
        const VH = Math.round(VW * (16 / 9));    // ≈ 384 — portrait 9:16
        const VGAP = 18;
        const VY = 286;

        const totalVW = vids.length * (VW + VGAP);
        xFwdRef.current = (xFwdRef.current + VIDEO_SPEED) % totalVW;

        // Section label
        ctx.textAlign = 'left';
        ctx.fillStyle = GOLD_1;
        ctx.globalAlpha = 0.6;
        ctx.font = `500 18px sans-serif`;
        ctx.fillText('VIDEO REVIEWS', 60, VY - 12);
        ctx.globalAlpha = 1;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, VY, CW, VH);
        ctx.clip();

        for (let i = 0; i < vids.length + 2; i++) {
            const idx = i % vids.length;
            const x   = i * (VW + VGAP) - xFwdRef.current;
            if (x + VW < -60 || x > CW + 60) continue;

            // Card background
            ctx.save();
            roundRect(ctx, x, VY, VW, VH, 16);
            ctx.fillStyle = '#1a1a1a';
            ctx.fill();
            ctx.clip();

            // Draw video frame (only if decoded)
            const vid = vids[idx];
            if (vid && vid.readyState >= 2) {
                try { ctx.drawImage(vid, x, VY, VW, VH); } catch {}
            }

            ctx.restore();

            // Gold border glow
            ctx.save();
            roundRect(ctx, x, VY, VW, VH, 16);
            ctx.strokeStyle = 'rgba(201,168,76,0.35)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }

        // Left & right fade masks
        drawFadeMask(ctx, 0, VY, 120, VH, 'right');
        drawFadeMask(ctx, CW - 120, VY, 120, VH, 'left');
        ctx.restore();

        // ── DIVIDER + SECTION LABEL ──────────────────────────────────────
        const DIV_Y = VY + VH + 18;
        const divGrad = ctx.createLinearGradient(60, 0, CW - 60, 0);
        divGrad.addColorStop(0,   'transparent');
        divGrad.addColorStop(0.1, WHITE_15);
        divGrad.addColorStop(0.5, WHITE_15);
        divGrad.addColorStop(1,   'transparent');
        ctx.fillStyle = divGrad;
        ctx.fillRect(60, DIV_Y, CW - 120, 1);

        // ── PHOTO MARQUEE ────────────────────────────────────────────────
        const PW = 190;
        const PH = Math.round(PW * (4 / 3));     // ≈ 253
        const PGAP = 18;
        const PY = DIV_Y + 12;

        const totalPW = imgs.length * (PW + PGAP);
        xRevRef.current = (xRevRef.current + PHOTO_SPEED) % totalPW;
        const revX = totalPW - xRevRef.current;

        // Section label (right-aligned)
        ctx.textAlign = 'right';
        ctx.fillStyle = GOLD_1;
        ctx.globalAlpha = 0.6;
        ctx.font = `500 18px sans-serif`;
        ctx.fillText('PHOTO REVIEWS', CW - 60, PY - 12);
        ctx.globalAlpha = 1;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, PY, CW, PH);
        ctx.clip();

        for (let i = 0; i < imgs.length + 2; i++) {
            const idx = i % imgs.length;
            const x   = i * (PW + PGAP) - (revX % totalPW);
            if (x + PW < -60 || x > CW + 60) continue;

            ctx.save();
            roundRect(ctx, x, PY, PW, PH, 14);
            ctx.fillStyle = '#111';
            ctx.fill();
            ctx.clip();

            try { ctx.drawImage(imgs[idx], x, PY, PW, PH); } catch {}

            // Gradient overlay at bottom of photo
            const photoGrad = ctx.createLinearGradient(0, PY + PH - 60, 0, PY + PH);
            photoGrad.addColorStop(0, 'transparent');
            photoGrad.addColorStop(1, 'rgba(0,0,0,0.65)');
            ctx.fillStyle = photoGrad;
            ctx.fillRect(x, PY, PW, PH);

            ctx.restore();

            // Verified badge
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.70)';
            roundRect(ctx, x + 8, PY + PH - 28, 80, 22, 6);
            ctx.fill();
            ctx.fillStyle = GOLD_2;
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('★ Verified', x + 14, PY + PH - 12);
            ctx.restore();

            // Border
            ctx.save();
            roundRect(ctx, x, PY, PW, PH, 14);
            ctx.strokeStyle = 'rgba(201,168,76,0.22)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
        }

        drawFadeMask(ctx, 0, PY, 120, PH, 'right');
        drawFadeMask(ctx, CW - 120, PY, 120, PH, 'left');
        ctx.restore();

        // ── FOOTER BAR ──────────────────────────────────────────────────
        const FY = PY + PH + 16;

        // Footer divider
        ctx.fillStyle = divGrad;
        ctx.fillRect(60, FY, CW - 120, 1);

        ctx.textAlign = 'left';
        ctx.fillStyle = GOLD_1;
        ctx.globalAlpha = 0.55;
        ctx.font = '22px "Georgia", serif';
        ctx.fillText('🌹  New Eco Roses  •  Kolkata', 60, FY + 34);

        ctx.textAlign = 'center';
        ctx.fillText('Regent Park  &  New Alipore Outlets', CW / 2, FY + 34);

        ctx.textAlign = 'right';
        ctx.fillText('www.newecoroses.com', CW - 60, FY + 34);
        ctx.globalAlpha = 1;

        // Bottom gold line (animated pulse via alpha)
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 800);
        const botLine = ctx.createLinearGradient(0, 0, CW, 0);
        botLine.addColorStop(0,   'transparent');
        botLine.addColorStop(0.3, `rgba(201,168,76,${0.3 + pulse * 0.3})`);
        botLine.addColorStop(0.7, `rgba(245,224,160,${0.4 + pulse * 0.4})`);
        botLine.addColorStop(1,   'transparent');
        ctx.fillStyle = botLine;
        ctx.fillRect(0, CH - 3, CW, 3);

        rafRef.current = requestAnimationFrame(drawFrame);
    }, []);

    useEffect(() => {
        if (!assetsReady) return;
        rafRef.current = requestAnimationFrame(drawFrame);
        return () => cancelAnimationFrame(rafRef.current);
    }, [assetsReady, drawFrame]);

    // ── Record from canvas stream — zero dialog ───────────────────────────
    const startRecording = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setRecording(true);
        setDownloadUrl(null);
        setProgress(0);
        setStatusText('Starting...');
        chunksRef.current = [];

        const stream   = canvas.captureStream(FPS);
        const mimeOpts = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
        const mime     = mimeOpts.find(t => MediaRecorder.isTypeSupported(t)) || 'video/webm';

        const mr = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 14_000_000 });
        mrRef.current = mr;

        mr.ondataavailable = e => { if (e.data?.size > 0) chunksRef.current.push(e.data); };

        mr.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: mime });
            const url  = URL.createObjectURL(blob);
            setDownloadUrl(url);
            setRecording(false);
            setStatusText('Done! File auto-downloaded.');
            const a = document.createElement('a');
            a.href = url;
            a.download = `new-eco-roses-marquee-${durationSeconds}s.webm`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
        };

        mr.start(500);
        setStatusText(`Recording 1080p · ${durationSeconds}s`);
        setCountdown(durationSeconds);

        let elapsed = 0;
        timerRef.current = setInterval(() => {
            elapsed++;
            const left = durationSeconds - elapsed;
            setCountdown(Math.max(0, left));
            setProgress(Math.min(100, Math.round((elapsed / durationSeconds) * 100)));
            setStatusText(`Recording 1080p canvas · ${Math.max(0, left)}s remaining`);
            if (elapsed >= durationSeconds) {
                clearInterval(timerRef.current!);
                if (mrRef.current?.state !== 'inactive') mrRef.current?.stop();
            }
        }, 1000);
    };

    const stopRecording = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (mrRef.current?.state !== 'inactive') mrRef.current?.stop();
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
                        Records directly from the canvas at 1080p — no screen-share dialog. Copy the downloaded .webm to a USB drive for TV playback.
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
                        <h2 className="text-white font-semibold text-base">Recorder</h2>
                        <p className={`text-xs ${assetsReady ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                            {assetsReady ? '● Assets loaded — ready to record' : '● Loading video & image assets...'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs font-medium">Duration:</span>
                        {[15, 30, 60].map(s => (
                            <button key={s} disabled={recording} onClick={() => setDuration(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${durationSeconds === s ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                                {s}s
                            </button>
                        ))}
                    </div>

                    <div>
                        {!recording ? (
                            <button onClick={startRecording} disabled={!assetsReady}
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                                <Play size={16} fill="black" />
                                Start Recording
                            </button>
                        ) : (
                            <button onClick={stopRecording}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all animate-pulse">
                                <Square size={16} fill="white" />
                                Stop ({countdown}s)
                            </button>
                        )}
                    </div>
                </div>

                {recording && (
                    <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs text-amber-400 font-medium">
                            <span>{statusText}</span><span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}

                {downloadUrl && (
                    <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-400" size={20} />
                            <div>
                                <p className="text-emerald-200 text-xs font-semibold">Recorded & auto-downloaded!</p>
                                <p className="text-emerald-400/80 text-[11px]">Copy the .webm from your Downloads folder to the USB Pendrive for TV playback.</p>
                            </div>
                        </div>
                        <a href={downloadUrl} download={`new-eco-roses-marquee-${durationSeconds}s.webm`}
                            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition-all">
                            <Download size={14} />Re-download
                        </a>
                    </div>
                )}
            </div>

            {/* Canvas Preview */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                    <span className="font-medium">Live Canvas Preview — 1920 × 1080</span>
                    <span className="text-amber-400/80 font-mono">Direct Canvas Capture · {FPS} FPS · 14 Mbps</span>
                </div>

                {!assetsReady && (
                    <div className="w-full aspect-[16/9] bg-[#090b08] rounded-2xl border border-gray-800 flex items-center justify-center">
                        <p className="text-amber-400/60 text-sm animate-pulse font-light tracking-widest uppercase">Loading assets...</p>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    width={CW}
                    height={CH}
                    className={`w-full rounded-2xl border border-gray-800 shadow-2xl ${assetsReady ? 'block' : 'hidden'}`}
                />
            </div>
        </div>
    );
}

// ── Canvas helpers ────────────────────────────────────────────────────────
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

function drawFadeMask(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    dir: 'left' | 'right'
) {
    const g = ctx.createLinearGradient(
        dir === 'right' ? x : x + w, 0,
        dir === 'right' ? x + w : x, 0
    );
    g.addColorStop(0, '#090b08');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
}
