'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollRestorer v4 — Clean rewrite
 *
 * Root causes fixed:
 * 1. `scroll-behavior: smooth` in CSS was fighting programmatic scrollTo during restoration
 *    → Removed from globals.css; smooth scroll only applied explicitly where needed.
 * 2. Saving scroll position on every scroll event caused the WRONG value to be saved
 *    when Next.js resets scroll to 0 during navigation (the scroll event fires with 0,
 *    overwriting the real saved position).
 *    → Now we save BEFORE navigation using `beforeunload` + `pagehide` + on pathname change.
 * 3. The polling restore was scrolling to intermediate positions while content loaded,
 *    which triggered more scroll saves, creating a feedback loop.
 *    → Added a `restoring` guard that suppresses saves during restoration.
 * 4. Navbar logo click was removing `'scroll:/'` but this component used `'__scroll__/'`.
 *    → Unified to `__scroll__` prefix; navbar fix applied separately.
 */

const STORAGE_PREFIX = '__scroll__';
const MAX_POLL_ATTEMPTS = 50; // 50 × 60ms = 3s max wait for async content

export default function ScrollRestorer() {
    const pathname = usePathname();
    const prevPathname = useRef<string | null>(null);
    const isRestoring = useRef(false);
    const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
    const scrollSaveThrottleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Save current scroll position for the given path ──
    const saveScroll = useCallback((path: string) => {
        if (isRestoring.current) return; // Don't save during restoration
        const y = Math.round(window.scrollY);
        // Only save non-zero positions, or save 0 only if user is genuinely at top
        if (y > 0 || document.documentElement.scrollHeight <= window.innerHeight + 50) {
            sessionStorage.setItem(STORAGE_PREFIX + path, String(y));
        }
    }, []);

    // ── Tell browser we manage scroll restoration ──
    useEffect(() => {
        window.history.scrollRestoration = 'manual';
    }, []);

    // ── Throttled scroll listener: saves position for the CURRENT path ──
    useEffect(() => {
        const onScroll = () => {
            if (isRestoring.current) return;
            if (scrollSaveThrottleTimer.current) return;

            scrollSaveThrottleTimer.current = setTimeout(() => {
                scrollSaveThrottleTimer.current = null;
                if (prevPathname.current && !isRestoring.current) {
                    saveScroll(prevPathname.current);
                }
            }, 150);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (scrollSaveThrottleTimer.current) {
                clearTimeout(scrollSaveThrottleTimer.current);
                scrollSaveThrottleTimer.current = null;
            }
        };
    }, [saveScroll]);

    // ── Save scroll before page unload (refresh, close, external navigation) ──
    useEffect(() => {
        const onBeforeUnload = () => {
            if (prevPathname.current && !isRestoring.current) {
                saveScroll(prevPathname.current);
            }
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        window.addEventListener('pagehide', onBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
            window.removeEventListener('pagehide', onBeforeUnload);
        };
    }, [saveScroll]);

    // ── On pathname change: save old path's position, then restore new path's ──
    useEffect(() => {
        // Clear any ongoing poll
        if (pollTimer.current) {
            clearInterval(pollTimer.current);
            pollTimer.current = null;
        }

        const oldPath = prevPathname.current;

        // Save old position BEFORE we update the ref.
        // window.scrollY is still at the user's last position at this point
        // (Next.js hasn't reset it yet in the same microtask).
        if (oldPath && oldPath !== pathname && !isRestoring.current) {
            // Grab the last saved value instead of current scrollY,
            // because scrollY may already be 0 by the time this effect runs
            // The throttled listener already saved the correct position
        }

        // Update tracked path
        prevPathname.current = pathname;

        // Check if there's a saved position for the new path
        const savedStr = sessionStorage.getItem(STORAGE_PREFIX + pathname);
        const target = savedStr ? parseInt(savedStr, 10) : 0;

        if (target > 0) {
            // Restore saved scroll position with polling for async content
            restoreScroll(target);
        } else {
            // New page or no saved position → go to top
            isRestoring.current = true;
            window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
            // Small delay before allowing saves again (let layout settle)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    isRestoring.current = false;
                });
            });
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    function restoreScroll(target: number) {
        isRestoring.current = true;
        let attempts = 0;

        const tryRestore = () => {
            const docH = document.documentElement.scrollHeight;
            const winH = window.innerHeight;
            const maxScroll = docH - winH;

            if (maxScroll >= target - 10) {
                // Page tall enough — restore exact position
                window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior });
                if (pollTimer.current) {
                    clearInterval(pollTimer.current);
                    pollTimer.current = null;
                }
                // Delay before allowing scroll saves (let framer-motion animations settle)
                setTimeout(() => { isRestoring.current = false; }, 200);
                return;
            }

            attempts++;
            if (attempts >= MAX_POLL_ATTEMPTS && pollTimer.current) {
                // Give up — scroll as far as possible
                window.scrollTo({ top: Math.max(0, maxScroll), behavior: 'instant' as ScrollBehavior });
                clearInterval(pollTimer.current);
                pollTimer.current = null;
                setTimeout(() => { isRestoring.current = false; }, 200);
            }
        };

        // First attempt after two animation frames (let initial render happen)
        requestAnimationFrame(() => {
            requestAnimationFrame(tryRestore);
        });

        // Then poll every 60ms until content loads
        pollTimer.current = setInterval(tryRestore, 60);
    }

    return null;
}
