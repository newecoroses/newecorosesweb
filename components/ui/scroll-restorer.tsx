'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollRestorer v2 — saves scroll position per page and restores it on back navigation.
 *
 * The key fix over v1: after navigating back, the page content loads async (products
 * from Supabase). We watch the page height with ResizeObserver and keep re-applying
 * the target scroll until either:
 *   a) we reach within 5px of the target, or
 *   b) 3 seconds have passed (timeout safety)
 */
export default function ScrollRestorer() {
    const pathname = usePathname();
    const isFirstRender = useRef<boolean>(true);
    const lastPathname = useRef<string | null>(null);
    const targetScrollY = useRef<number | null>(null);
    const observerRef = useRef<ResizeObserver | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Tell the browser we handle scroll — not it
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // Continuously save scroll position while on current page
    useEffect(() => {
        const saveScroll = () => {
            if (lastPathname.current) {
                sessionStorage.setItem(
                    'scroll:' + lastPathname.current,
                    String(Math.round(window.scrollY))
                );
            }
        };
        window.addEventListener('scroll', saveScroll, { passive: true });
        return () => window.removeEventListener('scroll', saveScroll);
    }, []);

    // Helper: keep scrolling to targetScrollY until the page is tall enough
    function applyScrollUntilReady(y: number) {
        // Clean up any existing observer/timer
        if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; }
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }

        targetScrollY.current = y;

        const tryScroll = () => {
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const reachable = Math.min(y, Math.max(0, maxScroll));
            window.scrollTo({ top: reachable, behavior: 'instant' as ScrollBehavior });

            // If we couldn't reach the full target, keep watching for layout growth
            if (reachable < y - 5) {
                return false; // not done yet
            }
            return true; // reached target
        };

        // Try immediately
        if (tryScroll()) return;

        // Watch for page height changes (async content loading) and re-apply
        const observer = new ResizeObserver(() => {
            if (tryScroll()) {
                observer.disconnect();
                observerRef.current = null;
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }
        });
        observer.observe(document.body);
        observerRef.current = observer;

        // Safety: give up after 3 seconds
        timeoutRef.current = setTimeout(() => {
            observer.disconnect();
            observerRef.current = null;
            targetScrollY.current = null;
        }, 3000);
    }

    // On pathname change: save old scroll, restore new position
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            lastPathname.current = pathname;
            const saved = sessionStorage.getItem('scroll:' + pathname);
            if (saved) {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        applyScrollUntilReady(parseInt(saved, 10));
                    });
                });
            }
            return;
        }

        // Save old page scroll before leaving
        if (lastPathname.current && lastPathname.current !== pathname) {
            sessionStorage.setItem(
                'scroll:' + lastPathname.current,
                String(Math.round(window.scrollY))
            );
        }

        lastPathname.current = pathname;

        const saved = sessionStorage.getItem('scroll:' + pathname);
        if (saved) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    applyScrollUntilReady(parseInt(saved, 10));
                });
            });
        } else {
            // New page — scroll to top
            window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        }

        return () => {
            if (observerRef.current) { observerRef.current.disconnect(); }
            if (timeoutRef.current) { clearTimeout(timeoutRef.current); }
        };
    }, [pathname]);

    return null;
}