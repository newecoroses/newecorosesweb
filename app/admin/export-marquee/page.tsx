'use client';

/**
 * /admin/export-marquee  — v4
 *
 * KEY FIXES:
 * 1. Videos decoded at ACTUAL draw size (192×340) → hardware-accelerated, smooth frames
 * 2. Only 7 decoder instances (modulo indexing) → no GPU overload
 * 3. requestVideoFrameCallback where available → frame-perfect canvas sync
 * 4. Seamless infinite loop via tile-from-offset math
 * 5. Premium dark-gold cinematic canvas frame (no emojis, SVG-style elements)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { fetchReviewVideos } from '@/lib/supabase';
import { Film, Download, Play, Square, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';

/* ── Assets ─────────────────────────────────────────────────────────────── */
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

/* ── Canvas geometry ─────────────────────────────────────────────────────── */
const CW   = 1920;
const CH   = 1080;
const FPS  = 60;

// Video cards — portrait 9:16
const V_W  = 192;
const V_H  = Math.round(V_W * 16 / 9);   // 341 px
const V_G  = 20;

// Photo cards — 3:4 (Centered vertically on 1080p canvas)
const P_W  = 460;
const P_H  = Math.round(P_W * 4 / 3);    // 613 px
const P_G  = 32;
const PY   = Math.round((CH - P_H) / 2); // 234 px

// Marquee speeds (px / frame at 60 fps) — slow enough to read
const V_SPD = 0.5;
const P_SPD = 0.38;

/* ── Palette ─────────────────────────────────────────────────────────────── */
const BG     = '#08090b';
const GOLD_D = '#b8922e';
const GOLD_M = '#d4ab50';
const GOLD_L = '#eece80';
const GOLD_H = '#f7e8b8';
const W95    = 'rgba(255,255,255,0.95)';
const W55    = 'rgba(255,255,255,0.55)';
const W18    = 'rgba(255,255,255,0.18)';
const W08    = 'rgba(255,255,255,0.08)';

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function ExportMarqueePage() {
    const [videoUrls, setVideoUrls]   = useState<string[]>(FALLBACK_VIDEOS);
    const [stage, setStage]           = useState<'idle'|'loading'|'ready'>('idle');
    const [loadPct, setLoadPct]       = useState(0);
    const [loadMsg, setLoadMsg]       = useState('');
    const [recording, setRecording]   = useState(false);
    const [countdown, setCountdown]   = useState(0);
    const [progress, setProgress]     = useState(0);
    const [statusText, setStatusText] = useState('Ready');
    const [downloadUrl, setDownloadUrl] = useState<string|null>(null);
    const [duration, setDuration]     = useState(30);

    const canvasRef   = useRef<HTMLCanvasElement>(null);
    const rafRef      = useRef<number>(0);
    const mrRef       = useRef<MediaRecorder|null>(null);
    const chunksRef   = useRef<Blob[]>([]);
    const timerRef    = useRef<NodeJS.Timeout|null>(null);
    const vidEls      = useRef<HTMLVideoElement[]>([]);
    const photoImgs   = useRef<HTMLImageElement[]>([]);
    const blobRefs    = useRef<string[]>([]);
    const xVid        = useRef(0);
    const xPh         = useRef(0);

    useEffect(() => {
        fetchReviewVideos()
            .then(d => { if (d.length > 0) setVideoUrls(d.map(v => v.video_url)); })
            .catch(() => {});
    }, []);

    /* ── Load all assets ──────────────────────────────────────────────── */
    const loadAssets = useCallback(async () => {
        setStage('loading');
        setLoadPct(0);

        /* 1 ▸ Download each video as a Blob */
        const blobs: string[] = [];
        for (let i = 0; i < videoUrls.length; i++) {
            setLoadMsg(`Downloading video ${i + 1} / ${videoUrls.length}`);
            try {
                const r    = await fetch(videoUrls[i]);
                const blob = await r.blob();
                const url  = URL.createObjectURL(blob);
                blobs.push(url);
                blobRefs.current.push(url);
            } catch {
                blobs.push(videoUrls[i]);   // fallback to network URL
            }
            setLoadPct(Math.round(((i + 1) / videoUrls.length) * 65));
        }

        /* 2 ▸ Create exactly N video elements — sized at ACTUAL draw dimensions
               so the GPU hardware-decodes at the right resolution */
        vidEls.current.forEach(v => { v.pause(); try { document.body.removeChild(v); } catch {} });
        vidEls.current = [];

        setLoadMsg('Initialising video decoders...');
        const els: HTMLVideoElement[] = blobs.map(src => {
            const v        = document.createElement('video');
            v.src          = src;
            v.muted        = true;
            v.loop         = true;
            v.playsInline  = true;
            v.preload      = 'auto';
            /* Off-screen at ACTUAL draw size so HW decoder works at correct resolution */
            Object.assign(v.style, {
                position:      'fixed',
                left:          '-9999px',
                top:           '0px',
                width:         `${V_W}px`,
                height:        `${V_H}px`,
                opacity:       '0',
                pointerEvents: 'none',
                zIndex:        '-999',
            });
            document.body.appendChild(v);
            return v;
        });

        /* Wait until every video can play */
        await Promise.all(els.map(v => new Promise<void>(res => {
            const go = () => { v.play().catch(() => {}); res(); };
            if (v.readyState >= 3) { go(); return; }
            v.addEventListener('canplaythrough', go, { once: true });
            v.addEventListener('error',          go, { once: true });
            v.load();
        })));

        /* Small pause so decoders can produce first real frames */
        await new Promise(res => setTimeout(res, 600));

        vidEls.current = els;
        setLoadPct(85);

        /* 3 ▸ Load photo images */
        setLoadMsg('Loading review photos...');
        const imgs: HTMLImageElement[] = PHOTO_REVIEWS.map(src => {
            const img = new Image(); img.src = src; return img;
        });
        await Promise.all(imgs.map(img => new Promise<void>(res => {
            if (img.complete) { res(); return; }
            img.onload = () => res(); img.onerror = () => res();
        })));
        photoImgs.current = imgs;
        setLoadPct(100);
        setLoadMsg('');
        setStage('ready');
    }, [videoUrls]);

    /* ── Canvas draw loop ─────────────────────────────────────────────── */
    const drawFrame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const vids = vidEls.current;
        const imgs = photoImgs.current;
        if (!vids.length || !imgs.length) {
            rafRef.current = requestAnimationFrame(drawFrame);
            return;
        }

        const totalVW = vids.length * (V_W + V_G);
        const totalPW = imgs.length * (P_W + P_G);

        xVid.current = (xVid.current + V_SPD) % totalVW;
        /* ── Background ─────────────────────────────────────────────── */
        ctx.fillStyle = '#08090b';
        ctx.fillRect(0, 0, CW, CH);

        /* ── Pure Photo Marquee Strip (Centered Vertically) ──────────── */
        const revOffset = (totalPW - xPh.current) % totalPW;
        drawSeamlessStrip(ctx, imgs, PY, P_W, P_H, P_G, totalPW, revOffset,
            (c, item, x, y, w, h) => {
                const img = item as HTMLImageElement;
                c.save();
                roundRect(c, x, y, w, h, 20);
                c.fillStyle = '#111113';
                c.fill();
                c.clip();
                try { c.drawImage(img, x, y, w, h); } catch {}
                c.restore();
            }
        );

        rafRef.current = requestAnimationFrame(drawFrame);
    }, []);

    useEffect(() => {
        if (stage !== 'ready') return;
        rafRef.current = requestAnimationFrame(drawFrame);
        return () => cancelAnimationFrame(rafRef.current);
    }, [stage, drawFrame]);

    // Cleanup on unmount
    useEffect(() => () => {
        cancelAnimationFrame(rafRef.current);
        blobRefs.current.forEach(u => URL.revokeObjectURL(u));
        vidEls.current.forEach(v => { v.pause(); try { document.body.removeChild(v); } catch {} });
    }, []);

    /* ── Recording ───────────────────────────────────────────────────── */
    const startRecording = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setRecording(true); setDownloadUrl(null); setProgress(0);
        chunksRef.current = [];
        const stream  = canvas.captureStream(FPS);
        const mimes   = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
        const mime    = mimes.find(m => MediaRecorder.isTypeSupported(m)) ?? 'video/webm';
        const mr = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 20_000_000 });
        mrRef.current = mr;
        mr.ondataavailable = e => { if (e.data?.size > 0) chunksRef.current.push(e.data); };
        mr.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: mime });
            const url  = URL.createObjectURL(blob);
            setDownloadUrl(url); setRecording(false); setStatusText('Done! Auto-downloaded.');
            const a = document.createElement('a');
            a.href = url; a.download = `new-eco-roses-marquee-${duration}s.webm`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
        };
        mr.start(500);
        setCountdown(duration); setStatusText(`Recording · ${duration}s`);
        let el = 0;
        timerRef.current = setInterval(() => {
            el++;
            const left = duration - el;
            setCountdown(Math.max(0, left));
            setProgress(Math.min(100, Math.round((el / duration) * 100)));
            setStatusText(`Recording · ${Math.max(0, left)}s remaining`);
            if (el >= duration) { clearInterval(timerRef.current!); mrRef.current?.stop(); }
        }, 1000);
    };

    const stopRecording = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (mrRef.current?.state !== 'inactive') mrRef.current?.stop();
        setRecording(false);
    };

    /* ── UI ──────────────────────────────────────────────────────────── */
    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Film className="text-amber-400" size={24} />
                        Export Marquee — TV Loop
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Load assets first (blobs pre-downloaded for smooth playback), then record directly from canvas at 20 Mbps Full HD.
                    </p>
                </div>
                <Link href="/tv-marquee" target="_blank"
                    className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-zinc-700">
                    <ExternalLink size={14} /> Open TV Fullscreen View
                </Link>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
                {/* Stage: IDLE */}
                {stage === 'idle' && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-white font-semibold">Step 1 — Load Assets into Memory</p>
                            <p className="text-gray-400 text-xs mt-0.5">
                                Downloads all {videoUrls.length} videos + {PHOTO_REVIEWS.length} photos as local blobs — guarantees zero-stutter playback.
                            </p>
                        </div>
                        <button onClick={loadAssets}
                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-[1.02]">
                            <Download size={16} /> Load & Prepare
                        </button>
                    </div>
                )}

                {/* Stage: LOADING */}
                {stage === 'loading' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
                            <Loader2 size={16} className="animate-spin" />
                            <span>{loadMsg}</span>
                            <span className="ml-auto text-white font-bold">{loadPct}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-600 to-amber-300 h-full transition-all duration-500 rounded-full"
                                style={{ width: `${loadPct}%` }} />
                        </div>
                        <p className="text-gray-600 text-xs">Large video files may take 30–60 seconds on slower connections.</p>
                    </div>
                )}

                {/* Stage: READY */}
                {stage === 'ready' && (
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={18} />
                            <div>
                                <p className="text-white font-semibold text-sm">Assets Loaded — Ready to Record</p>
                                <p className="text-gray-400 text-xs">Canvas is live. Choose duration and hit Start.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs">Duration:</span>
                            {[15, 30, 60].map(s => (
                                <button key={s} disabled={recording} onClick={() => setDuration(s)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${duration === s ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                                    {s}s
                                </button>
                            ))}
                        </div>
                        {!recording ? (
                            <button onClick={startRecording}
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-[1.02]">
                                <Play size={16} fill="black" /> Start Recording
                            </button>
                        ) : (
                            <button onClick={stopRecording}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all animate-pulse">
                                <Square size={16} fill="white" /> Stop ({countdown}s)
                            </button>
                        )}
                    </div>
                )}

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

                {downloadUrl && (
                    <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-400" size={20} />
                            <div>
                                <p className="text-emerald-200 text-xs font-semibold">Recorded & auto-downloaded!</p>
                                <p className="text-emerald-400/70 text-[11px]">Copy the .webm from Downloads to your USB Pendrive for TV.</p>
                            </div>
                        </div>
                        <a href={downloadUrl} download={`new-eco-roses-marquee-${duration}s.webm`}
                            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition-all">
                            <Download size={14} /> Re-download
                        </a>
                    </div>
                )}
            </div>

            {/* Canvas preview */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                    <span>Live Canvas Preview — 1920 × 1080</span>
                    <span className="font-mono text-amber-500/70">20 Mbps · 60 fps · VP9</span>
                </div>
                {stage !== 'ready' && (
                    <div className="w-full aspect-[16/9] bg-[#08090b] rounded-2xl border border-gray-800 flex items-center justify-center">
                        <p className="text-gray-700 text-sm tracking-widest uppercase font-light">
                            {stage === 'idle' ? 'Load assets to preview' : 'Preparing canvas...'}
                        </p>
                    </div>
                )}
                <canvas ref={canvasRef} width={CW} height={CH}
                    className={`w-full rounded-2xl border border-gray-800/60 shadow-2xl ${stage === 'ready' ? 'block' : 'hidden'}`} />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   Seamless infinite marquee — tile-from-offset, guaranteed no gaps
═══════════════════════════════════════════════════════════════════ */
function drawSeamlessStrip(
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
    if (!items.length) return;
    const stride     = iW + gap;
    const normOffset = ((offset % totalW) + totalW) % totalW;
    const firstIdx   = Math.floor(normOffset / stride);
    const startX     = -(normOffset % stride);
    const count      = Math.ceil((CW - startX) / stride) + 2;

    ctx.save();
    ctx.beginPath(); ctx.rect(0, y, CW, iH); ctx.clip();

    for (let i = 0; i < count; i++) {
        const idx = (firstIdx + i) % items.length;
        const x   = startX + i * stride;
        if (x > CW + iW) break;
        drawItem(ctx, items[idx], x, y, iW, iH);
    }

    // Fade masks using exact BG colour
    const fW = 100;
    const fL = ctx.createLinearGradient(0, 0, fW, 0);
    fL.addColorStop(0, BG); fL.addColorStop(1, 'transparent');
    ctx.fillStyle = fL; ctx.fillRect(0, y, fW, iH);

    const fR = ctx.createLinearGradient(CW - fW, 0, CW, 0);
    fR.addColorStop(0, 'transparent'); fR.addColorStop(1, BG);
    ctx.fillStyle = fR; ctx.fillRect(CW - fW, y, fW, iH);

    ctx.restore();
}

/* ═══════════════════════════════════════════════════════════════
   Premium canvas drawing helpers — no emojis, SVG-style elements
═══════════════════════════════════════════════════════════════ */
function drawGoldLine(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
    const g = ctx.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0,    'transparent');
    g.addColorStop(0.1,  GOLD_D);
    g.addColorStop(0.5,  GOLD_H);
    g.addColorStop(0.9,  GOLD_D);
    g.addColorStop(1,    'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, 2);
}

function drawMidDivider(ctx: CanvasRenderingContext2D, y: number) {
    const g = ctx.createLinearGradient(80, 0, CW - 80, 0);
    g.addColorStop(0,   'transparent');
    g.addColorStop(0.1,  W18);
    g.addColorStop(0.5,  W18);
    g.addColorStop(1,   'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(80, y, CW - 160, 1);
}

function drawSectionLabel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string,
    rightAlign = false,
) {
    ctx.save();
    ctx.textAlign  = rightAlign ? 'right' : 'left';
    ctx.font       = '500 15px sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillStyle  = GOLD_D;
    ctx.globalAlpha = 0.55;
    ctx.fillText(label, x, y);
    ctx.globalAlpha = 1;
    ctx.letterSpacing = '0px';
    ctx.restore();
}

function drawCornerOrnament(
    ctx:    CanvasRenderingContext2D,
    x:      number,
    y:      number,
    flipX:  boolean,
    flipY:  boolean,
) {
    const L = 40;  // arm length
    const sx = flipX ? -1 : 1;
    const sy = flipY ? -1 : 1;
    ctx.save();
    ctx.strokeStyle = GOLD_D;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    // Horizontal arm
    ctx.moveTo(x, y);
    ctx.lineTo(x + sx * L, y);
    // Vertical arm
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + sy * L);
    ctx.stroke();
    // Small diamond at corner
    const D = 3;
    ctx.beginPath();
    ctx.moveTo(x,     y - D);
    ctx.lineTo(x + D, y    );
    ctx.lineTo(x,     y + D);
    ctx.lineTo(x - D, y    );
    ctx.closePath();
    ctx.fillStyle = GOLD_M;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
