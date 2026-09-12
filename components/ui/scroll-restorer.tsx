'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollRestorer v3
 *
 * Key insight: when pathname changes in Next.js App Router, window.scrollY
 * is already 0 by the time the useEffect fires — so we must NEVER save
 * scroll inside the pathname useEffect (it would overwrite the real value with 0).
 *
 * Instead we rely 100% on the passive scroll listener which correctly captures
 * the position BEFORE navigation.
 *
 * Restoration: after navigating back, content loads async (Supabase), so
 * we poll every 80ms to re-apply the target until the page is tall enough.
 */
export default function ScrollRestorer() {
    const pathname = usePathname();
    const lastPathname = useRef<string | null>(null);
    const isFirstMount = useRef<boolean>(true);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Tell browser we handle scroll
    useEffect(() => {
        window.history.scrollRestoration = 'manual';
    }, []);

    // Save scroll on every scroll event — keyed by the CURRENT path in ref
    useEffect(() => {
        const save = () => {
            if (lastPathname.current) {
                sessionStorage.setItem('__scroll__' + lastPathname.current, String(Math.round(window.scrollY)));
            }
        };
        window.addEventListener('scroll', save, { passive: true });
        return () => window.removeEventListener('scroll', save);
    }, []);

    // When pathname changes: restore saved position (do NOT re-save old page here)
    useEffect(() => {
        // Stop any ongoing poll
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }

        // Update tracked path AFTER cleanup
        lastPathname.current = pathname;

        if (isFirstMount.current) {
            isFirstMount.current = false;
            // On fresh page load restore saved position if any
            const saved = sessionStorage.getItem('__scroll__' + pathname);
            if (saved) startRestore(parseInt(saved, 10));
            return;
        }

        const saved = sessionStorage.getItem('__scroll__' + pathname);
        if (saved) {
            startRestore(parseInt(saved, 10));
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    function startRestore(target: number) {
        let attempts = 0;
        const MAX = 40; // 40 * 80ms = 3.2 seconds max

        const tryScroll = () => {
            const docH = document.documentElement.scrollHeight;
            const winH = window.innerHeight;
            const maxScroll = docH - winH;

            if (maxScroll >= target - 5) {
                // Page is tall enough — scroll and stop
                window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior });
                if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
                return;
            }
            // Page still too short — scroll to current max and keep waiting
            window.scrollTo({ top: Math.max(0, maxScroll), behavior: 'instant' as ScrollBehavior });
            attempts++;
            if (attempts >= MAX && pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
            }
        };

        // First attempt immediately
        requestAnimationFrame(() => { requestAnimationFrame(tryScroll); });
        // Then poll every 80ms while content loads
        pollRef.current = setInterval(tryScroll, 80);
    }

    return null;
}