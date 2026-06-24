'use client';

/**
 * AnalyticsTracker — invisible client component
 *
 * Placed once in app/layout.tsx. Responsibilities:
 * 1. Track page views on every route change (via pathname)
 * 2. Send a realtime heartbeat every 30s so the admin can see active visitors
 *
 * Performance guarantees:
 * - Renders nothing to the DOM
 * - All network calls use sendBeacon or fetch with keepalive
 * - useEffect only — never runs on server
 * - No state that could trigger re-renders of parent tree
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, getOrCreateSessionId } from '@/lib/analytics';

const HEARTBEAT_INTERVAL_MS = 30_000; // 30 seconds

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Track page views ───────────────────────────────────────────────────
    useEffect(() => {
        // Small timeout so the page has time to render before we fire the beacon
        const timer = setTimeout(() => {
            trackPageView();
        }, 500);
        return () => clearTimeout(timer);
    }, [pathname]); // Re-fires on every route change

    // ── Realtime heartbeat ─────────────────────────────────────────────────
    useEffect(() => {
        const sendHeartbeat = () => {
            const sessionId = getOrCreateSessionId();
            // Use fetch with keepalive so it survives tab closes
            fetch('/api/admin/analytics/realtime', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, page_url: window.location.href }),
                keepalive: true,
            }).catch(() => {}); // Never throw
        };

        // Initial heartbeat
        sendHeartbeat();

        // Recurring heartbeat
        heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

        return () => {
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        };
    }, []); // Only mount once

    // Renders nothing
    return null;
}
