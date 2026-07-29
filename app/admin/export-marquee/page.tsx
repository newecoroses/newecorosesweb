'use client';

/**
 * /admin/export-marquee
 *
 * Fixes:
 *  1. Pre-downloads ALL videos as Blobs first → no network stutter during playback
 *  2. Seamless infinite loop via correct tile-from-offset math → zero black gaps
 *  3. Slower marquee speed so viewers can watch content
 *  4. Full HD canvas capture at 20 Mbps for big-screen quality
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { fetchReviewVideos } from '@/lib/supabase';
import { Film, Download, Play, Square, ExternalLink, CheckCircle2 } from 'lucide-react';

/* ── Asset lists ───────────────────────────────────────────────────────── */
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

/* ── Canvas constants ──────────────────────────────────────────────────── */
const CW = 1920;
const CH = 1080;
const FPS = 60;

// Marquee layout
const VID_W    = 190;                        // video card width (px on canvas)
const VID_H    = Math.round(VID_W * 16 / 9); // portrait 9:16 → 338 px
const VID_GAP  = 22;

const PH_W     = 175;
const PH_H     = Math.round(PH_W * 4 / 3);   // 3:4 → 233 px
const PH_GAP   = 20;

// Very slow so customers can actually read/watch
const VID_SPEED  = 0.55;   // px per frame
const PH_SPEED   = 0.40;

// Premium colour palette
const BG        = '#07090a';
const GOLD_L    = '#c8a84b';
const GOLD_M    = '#e4c76a';
const GOLD_H    = '#f3dfa0';
const W90       = 'rgba(255,255,255,0.90)';
const W45       = 'rgba(255,255,255,0.45)';
const W12       = 'rgba(255,255,255,0.12)';

/* ═══════════════════════════════════════════════════════════════════════ */
export default function ExportMarqueePage() {
    const [videoUrls, setVideoUrls] = useState<string[]>(FALLBACK_VIDEOS);

    // Loading phases
    const [loadStage, setLoadStage]   = useState<'idle' | 'downloading' | 'ready'>('idle');
    const [loadPct,   setLoadPct]     = useState<number>(0);
    const [loadMsg,   setLoadMsg]     = useState<string>('');

    // Recording
    const [recording, setRecording]   = useState<boolean>(false);
    const [countdown, setCountdown]   = useState<number>(0);
    const [progress,  setProgress]    = useState<number>(0);
    const [statusText,setStatusText]  = useState<string>('Ready');
    const [downloadUrl,setDownloadUrl]= useState<string | null>(null);
    const [duration,  setDuration]    = useState<number>(30);

    // Refs
    const canvasRef    = useRef<HTMLCanvasElement>(null);
    const rafRef       = useRef<number>(0);
    const mrRef        = useRef<MediaRecorder | null>(null);
    const chunksRef    = useRef<Blob[]>([]);
    const timerRef     = useRef<NodeJS.Timeout | null>(null);
    const videoEls     = useRef<HTMLVideoElement[]>([]);
    const photoImgs    = useRef<HTMLImageElement[]>([]);
    const blobUrls     = useRef<string[]>([]);  // to revoke on unmount
    const xVid         = useRef<number>(0);
    const xPh          = useRef<number>(0);

    // Fetch Supabase list
    useEffect(() => {
        fetchReviewVideos()
            .then(d => { if (d.length > 0) setVideoUrls(d.map(v => v.video_url)); })
            .catch(() => {});
    }, []);

    // ── Phase 1: Pre-download videos as Blobs ────────────────────────────
    const loadAssets = useCallback(async () => {
        setLoadStage('downloading');
        setLoadPct(0);

        const allVids = videoUrls;
        const newBlobUrls: string[] = [];

        // Download each video sequentially with progress
        for (let i = 0; i < allVids.length; i++) {
            setLoadMsg(`Downloading video ${i + 1} of ${allVids.length}...`);
            try {
                const resp = await fetch(allVids[i]);
                const blob = await resp.blob();
                const url  = URL.createObjectURL(blob);
                newBlobUrls.push(url);
                blobUrls.current.push(url);
            } catch {
                // fallback: use original URL if fetch fails
                newBlobUrls.push(allVids[i]);
            }
            setLoadPct(Math.round(((i + 1) / allVids.length) * 70));
        }

        setLoadMsg('Creating video elements...');

        // ── Phase 2: Create video elements (off-screen, not display:none) ──
        // Clean up any previous
        videoEls.current.forEach(v => { v.pause(); document.body.removeChild(v); });
        videoEls.current = [];

        const vidEls: HTMLVideoElement[] = newBlobUrls.map(blobSrc => {
            const v = document.createElement('video');
            v.src          = blobSrc;
            v.muted        = true;
            v.loop         = true;
            v.playsInline  = true;
            v.preload      = 'auto';
            // Off-screen but active (NOT display:none — browsers stop decoding that)
            Object.assign(v.style, {
                position:      'fixed',
                left:          '-9999px',
                top:           '0',
                width:         '1px',
                height:        '1px',
                opacity:       '0',
                pointerEvents: 'none',
            });
            document.body.appendChild(v);
            return v;
        });

        // Wait for all videos to be ready to play (readyState >= 3)
        await Promise.all(vidEls.map(v =>
            new Promise<void>(res => {
                if (v.readyState >= 3) { v.play().catch(() => {}); res(); return; }
                const onReady = () => { v.play().catch(() => {}); res(); };
                v.addEventListener('canplay', onReady, { once: true });
                v.addEventListener('error',   onReady, { once: true });
                v.load();
            })
        ));
        videoEls.current = vidEls;
        setLoadPct(85);

        // ── Phase 3: Load photo images ──────────────────────────────────
        setLoadMsg('Loading photos...');
        const imgs: HTMLImageElement[] = PHOTO_REVIEWS.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });
        await Promise.all(imgs.map(img =>
            new Promise<void>(res => {
                if (img.complete) { res(); return; }
                img.onload  = () => res();
                img.onerror = () => res();
            })
        ));
        photoImgs.current = imgs;
        setLoadPct(100);
        setLoadMsg('');
        setLoadStage('ready');
    }, [videoUrls]);

    // ── Draw one canvas frame ────────────────────────────────────────────
    const drawFrame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const vids = videoEls.current;
        const imgs = photoImgs.current;

        /* ── BACKGROUND ─────────────────────────────────────────────── */
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, CW, CH);

        // Radial glow at top-centre
        const glow = ctx.createRadialGradient(CW / 2, 180, 0, CW / 2, 180, 800);
        glow.addColorStop(0, 'rgba(180,130,40,0.12)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, CW, 500);

        /* ── TOP GOLD LINE ──────────────────────────────────────────── */
        const hLine = ctx.createLinearGradient(0, 0, CW, 0);
        hLine.addColorStop(0,   'transparent');
        hLine.addColorStop(0.15, GOLD_L);
        hLine.addColorStop(0.5,  GOLD_H);
        hLine.addColorStop(0.85, GOLD_L);
        hLine.addColorStop(1,   'transparent');
        ctx.fillStyle = hLine;
        ctx.fillRect(0, 0, CW, 2);

        /* ── HEADER ─────────────────────────────────────────────────── */
        // Eyebrow
        ctx.textAlign   = 'center';
        ctx.fillStyle   = GOLD_L;
        ctx.font        = '500 24px "Georgia", serif';
        ctx.globalAlpha = 0.70;
        ctx.fillText('★   REAL EXPERIENCES  ·  REAL LOVE   ★', CW / 2, 72);
        ctx.globalAlpha = 1;

        // Brand name
        ctx.font      = 'bold 88px "Georgia", serif';
        ctx.fillStyle = W90;
        ctx.fillText('New Eco Roses', CW / 2, 168);

        // Gold underline
        const uw = 520; const ux = (CW - uw) / 2;
        const ul = ctx.createLinearGradient(ux, 0, ux + uw, 0);
        ul.addColorStop(0, 'transparent'); ul.addColorStop(0.5, GOLD_M); ul.addColorStop(1, 'transparent');
        ctx.fillStyle = ul;
        ctx.fillRect(ux, 184, uw, 2);

        // Sub-heading
        ctx.font      = '300 30px "Georgia", serif';
        ctx.fillStyle = W45;
        ctx.fillText('Customer Reviews & Stories', CW / 2, 228);

        /* ── VIDEO MARQUEE ──────────────────────────────────────────── */
        const VY = 256;
        const totalVW = vids.length * (VID_W + VID_GAP);

        xVid.current += VID_SPEED;
        if (xVid.current >= totalVW) xVid.current -= totalVW;

        drawSeamlessRow(ctx, vids, VY, VID_W, VID_H, VID_GAP, totalVW, xVid.current, drawVideoCard);

        /* ── DIVIDER ────────────────────────────────────────────────── */
        const DIV_Y = VY + VID_H + 20;
        const dg = ctx.createLinearGradient(80, 0, CW - 80, 0);
        dg.addColorStop(0, 'transparent'); dg.addColorStop(0.5, W12); dg.addColorStop(1, 'transparent');
        ctx.fillStyle = dg;
        ctx.fillRect(80, DIV_Y, CW - 160, 1);

        /* ── PHOTO MARQUEE (reverse) ────────────────────────────────── */
        const PY = DIV_Y + 14;
        const totalPW = imgs.length * (PH_W + PH_GAP);

        xPh.current += PH_SPEED;
        if (xPh.current >= totalPW) xPh.current -= totalPW;
        // Reverse: mirror the offset
        const revOffset = (totalPW - xPh.current) % totalPW;

        drawSeamlessRow(ctx, imgs, PY, PH_W, PH_H, PH_GAP, totalPW, revOffset, drawPhotoCard);

        /* ── FOOTER ─────────────────────────────────────────────────── */
        const FY = PY + PH_H + 14;
        ctx.fillStyle = dg;
        ctx.fillRect(80, FY, CW - 160, 1);

        ctx.globalAlpha = 0.55;
        ctx.font        = '22px "Georgia", serif';
        ctx.fillStyle   = GOLD_L;
        ctx.textAlign   = 'left';
        ctx.fillText('🌹  New Eco Roses  ·  Kolkata', 80, FY + 32);
        ctx.textAlign = 'center';
        ctx.fillText('Regent Park  &  New Alipore Outlets', CW / 2, FY + 32);
        ctx.textAlign = 'right';
        ctx.fillText('www.newecoroses.com', CW - 80, FY + 32);
        ctx.globalAlpha = 1;

        /* ── BOTTOM GOLD LINE (pulsing) ─────────────────────────────── */
        const p = 0.5 + 0.5 * Math.sin(Date.now() / 900);
        const bLine = ctx.createLinearGradient(0, 0, CW, 0);
        bLine.addColorStop(0,   'transparent');
        bLine.addColorStop(0.3, `rgba(200,168,75,${0.25 + p * 0.35})`);
        bLine.addColorStop(0.7, `rgba(243,223,160,${0.35 + p * 0.45})`);
        bLine.addColorStop(1,   'transparent');
        ctx.fillStyle = bLine;
        ctx.fillRect(0, CH - 3, CW, 3);

        rafRef.current = requestAnimationFrame(drawFrame);
    }, []);

    // Start animation when ready
    useEffect(() => {
        if (loadStage !== 'ready') return;
        rafRef.current = requestAnimationFrame(drawFrame);
        return () => cancelAnimationFrame(rafRef.current);
    }, [loadStage, drawFrame]);

    // Cleanup blobs on unmount
    useEffect(() => {
        return () => {
            blobUrls.current.forEach(u => URL.revokeObjectURL(u));
            videoEls.current.forEach(v => { v.pause(); document.body.removeChild(v); });
        };
    }, []);

    /* ── Record from canvas — no dialog ─────────────────────────────── */
    const startRecording = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setRecording(true);
        setDownloadUrl(null);
        setProgress(0);
        setStatusText('Recording...');
        chunksRef.current = [];

        const stream  = canvas.captureStream(FPS);
        const mimes   = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
        const mime    = mimes.find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm';

        const mr = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 20_000_000 });
        mrRef.current = mr;

        mr.ondataavailable = e => { if (e.data?.size > 0) chunksRef.current.push(e.data); };
        mr.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: mime });
            const url  = URL.createObjectURL(blob);
            setDownloadUrl(url);
            setRecording(false);
            setStatusText('Done! Auto-downloaded.');
            const a = document.createElement('a');
            a.href = url; a.download = `new-eco-roses-marquee-${duration}s.webm`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
        };

        mr.start(500);
        setCountdown(duration);
        let elapsed = 0;
        timerRef.current = setInterval(() => {
            elapsed++;
            const left = duration - elapsed;
            setCountdown(Math.max(0, left));
            setProgress(Math.min(100, Math.round((elapsed / duration) * 100)));
            setStatusText(`Recording · ${Math.max(0, left)}s remaining`);
            if (elapsed >= duration) {
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

    /* ── Render ─────────────────────────────────────────────────────── */
    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Film className="text-amber-400" size={24} />
                        Export Marquee Video for TV
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Pre-downloads all videos as blobs first for smooth stutter-free playback. Records at 20 Mbps Full HD from canvas — no popup.
                    </p>
                </div>
                <Link href="/tv-marquee" target="_blank"
                    className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-zinc-700">
                    <ExternalLink size={14} /> Open TV Fullscreen View
                </Link>
            </div>

            {/* Controls */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
                {/* Step 1 — Load assets */}
                {loadStage === 'idle' && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-white font-semibold text-sm">Step 1 — Load All Assets</p>
                            <p className="text-gray-400 text-xs mt-0.5">Downloads all {videoUrls.length} videos + {PHOTO_REVIEWS.length} photos into memory for stutter-free playback.</p>
                        </div>
                        <button onClick={loadAssets}
                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-[1.02]">
                            <Download size={16} />
                            Load & Prepare Assets
                        </button>
                    </div>
                )}

                {loadStage === 'downloading' && (
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-amber-400 animate-pulse">{loadMsg}</span>
                            <span className="text-white">{loadPct}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300 rounded-full"
                                style={{ width: `${loadPct}%` }} />
                        </div>
                        <p className="text-gray-500 text-xs">Please wait — large video files may take a minute on slower connections.</p>
                    </div>
                )}

                {loadStage === 'ready' && (
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-emerald-400" size={16} />
                                <p className="text-white font-semibold text-sm">Assets Ready — Step 2: Record</p>
                            </div>
                            <p className="text-gray-400 text-xs">All videos loaded in memory. Marquee is live. Choose duration and record.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-xs">Duration:</span>
                            {[15, 30, 60].map(s => (
                                <button key={s} disabled={recording} onClick={() => setDuration(s)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${duration === s ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                                    {s}s
                                </button>
                            ))}
                        </div>
                        <div>
                            {!recording ? (
                                <button onClick={startRecording}
                                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-[1.02]">
                                    <Play size={16} fill="black" />
                                    Start {duration}s Recording
                                </button>
                            ) : (
                                <button onClick={stopRecording}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all animate-pulse">
                                    <Square size={16} fill="white" />
                                    Stop ({countdown}s)
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Progress bar */}
                {recording && (
                    <div className="space-y-1.5 border-t border-gray-800 pt-4">
                        <div className="flex justify-between text-xs text-amber-400 font-medium">
                            <span>{statusText}</span><span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300"
                                style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}

                {/* Download success */}
                {downloadUrl && (
                    <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-400" size={20} />
                            <div>
                                <p className="text-emerald-200 text-xs font-semibold">Recorded & auto-downloaded!</p>
                                <p className="text-emerald-400/70 text-[11px]">Copy the .webm from Downloads to your USB Pendrive for TV playback.</p>
                            </div>
                        </div>
                        <a href={downloadUrl} download={`new-eco-roses-marquee-${duration}s.webm`}
                            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition-all">
                            <Download size={14} /> Re-download
                        </a>
                    </div>
                )}
            </div>

            {/* Canvas */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                    <span className="font-medium">Live Canvas — 1920 × 1080</span>
                    <span className="text-amber-400/80 font-mono">20 Mbps · {FPS} FPS · VP9</span>
                </div>

                {loadStage !== 'ready' && (
                    <div className="w-full aspect-[16/9] bg-[#07090a] rounded-2xl border border-gray-800 flex flex-col items-center justify-center gap-3">
                        <Film size={36} className="text-amber-900/60" />
                        <p className="text-gray-600 text-sm tracking-widest uppercase font-light">
                            {loadStage === 'idle' ? 'Load assets to preview' : 'Preparing...'}
                        </p>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    width={CW}
                    height={CH}
                    className={`w-full rounded-2xl border border-gray-800 shadow-2xl ${loadStage === 'ready' ? 'block' : 'hidden'}`}
                />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════
   Seamless infinite-loop row renderer.
   Uses "tile from offset" math — ZERO black gaps, perfect loop.
   offset increases forever; we take mod totalW to keep values bounded.
════════════════════════════════════════════════════════════════════════ */
function drawSeamlessRow(
    ctx:      CanvasRenderingContext2D,
    items:    (HTMLVideoElement | HTMLImageElement)[],
    y:        number,
    iW:       number,
    iH:       number,
    gap:      number,
    totalW:   number,
    offset:   number,
    drawItem: (ctx: CanvasRenderingContext2D, item: HTMLVideoElement | HTMLImageElement, x: number, y: number, w: number, h: number) => void,
) {
    if (items.length === 0) return;
    const stride = iW + gap;

    // Which item is at the leftmost visible slot?
    const normOffset = offset % totalW;
    const firstIdx   = Math.floor(normOffset / stride);
    const startX     = -(normOffset % stride);   // ≤ 0, the partial overhang

    // How many items do we need to fill CW?
    const count = Math.ceil((CW - startX) / stride) + 1;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y, CW, iH);
    ctx.clip();

    for (let i = 0; i < count; i++) {
        const idx = (firstIdx + i) % items.length;
        const x   = startX + i * stride;
        if (x > CW) break;
        drawItem(ctx, items[idx], x, y, iW, iH);
    }

    // Fade edges
    fadeMask(ctx, 0,        y, 110, iH, BG, 'transparent');
    fadeMask(ctx, CW - 110, y, 110, iH, 'transparent', BG);

    ctx.restore();
}

function drawVideoCard(
    ctx: CanvasRenderingContext2D,
    item: HTMLVideoElement | HTMLImageElement,
    x: number, y: number, w: number, h: number,
) {
    const vid = item as HTMLVideoElement;
    ctx.save();
    roundRect(ctx, x, y, w, h, 14); ctx.fillStyle = '#141414'; ctx.fill(); ctx.clip();
    if (vid.readyState >= 2) {
        try { ctx.drawImage(vid, x, y, w, h); } catch {}
    }
    ctx.restore();
    // Gold border
    ctx.save();
    roundRect(ctx, x, y, w, h, 14);
    ctx.strokeStyle = 'rgba(200,168,75,0.30)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
}

function drawPhotoCard(
    ctx: CanvasRenderingContext2D,
    item: HTMLVideoElement | HTMLImageElement,
    x: number, y: number, w: number, h: number,
) {
    const img = item as HTMLImageElement;
    ctx.save();
    roundRect(ctx, x, y, w, h, 12); ctx.fillStyle = '#111'; ctx.fill(); ctx.clip();
    try { ctx.drawImage(img, x, y, w, h); } catch {}
    // Bottom gradient overlay
    const og = ctx.createLinearGradient(0, y + h - 55, 0, y + h);
    og.addColorStop(0, 'transparent'); og.addColorStop(1, 'rgba(0,0,0,0.70)');
    ctx.fillStyle = og; ctx.fillRect(x, y, w, h);
    ctx.restore();
    // Verified badge
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    roundRect(ctx, x + 8, y + h - 28, 78, 22, 5); ctx.fill();
    ctx.fillStyle = GOLD_M; ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left'; ctx.fillText('★ Verified', x + 13, y + h - 12);
    ctx.restore();
    // Border
    ctx.save();
    roundRect(ctx, x, y, w, h, 12);
    ctx.strokeStyle = 'rgba(200,168,75,0.22)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
}

/* ── Utility helpers ──────────────────────────────────────────────────── */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x,     y + h, x,     y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function fadeMask(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    c0: string, c1: string,
) {
    const g = ctx.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, c0); g.addColorStop(1, c1);
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
}
