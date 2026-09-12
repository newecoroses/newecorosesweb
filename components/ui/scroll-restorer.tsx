'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollRestorer() {
    const pathname = usePathname();
    const isFirstRender = useRef<boolean>(true);
    const lastPathname = useRef<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

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

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            lastPathname.current = pathname;
            const saved = sessionStorage.getItem('scroll:' + pathname);
            if (saved) {
                const y = parseInt(saved, 10);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
                    });
                });
            }
            return;
        }

        if (lastPathname.current && lastPathname.current !== pathname) {
            sessionStorage.setItem(
                'scroll:' + lastPathname.current,
                String(Math.round(window.scrollY))
            );
        }

        lastPathname.current = pathname;

        const saved = sessionStorage.getItem('scroll:' + pathname);
        if (saved) {
            const y = parseInt(saved, 10);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
                });
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        }
    }, [pathname]);

    return null;
}