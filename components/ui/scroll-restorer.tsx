'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollRestorer — saves your exact scroll position before leaving a page
 * and restores it instantly when you hit the back button.
 */
export default function ScrollRestorer() {
    const pathname = usePathname();
    const isFirstRender = useRef(true);
    const lastPathname = useRef<string | null>(null);

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
                    `scroll:${lastPathname.current}`,
                    String(Math.round(window.scrollY))
                );
            }
        };
        window.addEventListener('scroll', saveScroll, { passive: true });
        return () => window.removeEventListener('scroll', saveScroll);
    }, []);

    // On pathname change: save old position, restore new position
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            lastPathname.current = pathname;
            const saved = sessionStorage.getItem(`scroll:${pathname}`);
            if (saved) {
                const y = parseInt(saved, 10);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: y, behavior: 'instant' });
                    });
                });
            }
            return;
        }

        if (lastPathname.current && lastPathname.current !== pathname) {
            sessionStorage.setItem(
                `scroll:${lastPathname.current}`,
                String(Math.round(window.scrollY))
            );
        }

        lastPathname.current = pathname;

        const saved = sessionStorage.getItem(`scroll:${pathname}`);
        if (saved) {
            const y = parseInt(saved, 10);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.scrollTo({ top: y, behavior: 'instant' });
                });
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [pathname]);

    return null;
}
