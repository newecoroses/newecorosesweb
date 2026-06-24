/**
 * lib/analytics.ts — Lightweight client-side analytics tracker
 *
 * Design principles:
 * - All functions are fire-and-forget (non-blocking)
 * - Uses navigator.sendBeacon so events survive page unloads
 * - Session ID lives in sessionStorage (per-tab, not persistent)
 * - No heavy dependencies — vanilla JS only
 * - Never throws — errors are silently swallowed to protect UX
 */

const TRACK_URL = '/api/analytics/track';

// ── Session Management ─────────────────────────────────────────────────────

/** Returns a stable session ID for this browser tab. Creates one if absent. */
export function getOrCreateSessionId(): string {
    try {
        const key = 'ner_sid';
        let sid = sessionStorage.getItem(key);
        if (!sid) {
            sid = typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            sessionStorage.setItem(key, sid);
        }
        return sid;
    } catch {
        // sessionStorage blocked (private browsing, iframe, etc.)
        return `anon-${Date.now()}`;
    }
}

// ── Device Detection ───────────────────────────────────────────────────────

/** Classifies the current device from the User-Agent string. */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof navigator === 'undefined') return 'desktop';
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
}

/** Returns a short browser name from the User-Agent. */
export function getBrowser(): string {
    if (typeof navigator === 'undefined') return 'unknown';
    const ua = navigator.userAgent;
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
    return 'Other';
}

// ── Event Payload ──────────────────────────────────────────────────────────

interface TrackPayload {
    event_type: 'pageview' | 'enquiry';
    page_url?: string;
    product_id?: string;
    product_name?: string;
    session_id: string;
    device_type: string;
    browser: string;
    referrer?: string;
    hour: number;
}

function buildPayload(
    eventType: 'pageview' | 'enquiry',
    extras: Partial<TrackPayload> = {}
): TrackPayload {
    return {
        event_type: eventType,
        page_url: window.location.href,
        session_id: getOrCreateSessionId(),
        device_type: getDeviceType(),
        browser: getBrowser(),
        referrer: document.referrer || undefined,
        hour: new Date().getHours(),
        ...extras,
    };
}

/** Sends a single event via sendBeacon (non-blocking, survives navigation). */
function send(payload: TrackPayload): void {
    try {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            navigator.sendBeacon(TRACK_URL, blob);
        } else {
            // Fallback for environments without sendBeacon (SSR, old browsers)
            fetch(TRACK_URL, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
                keepalive: true,
            }).catch(() => {});
        }
    } catch {
        // Never propagate — tracking must never break UX
    }
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Track a page view. Call once per route change.
 * Completely non-blocking — uses sendBeacon.
 */
export function trackPageView(productId?: string): void {
    if (typeof window === 'undefined') return;
    send(buildPayload('pageview', { product_id: productId }));
}

/**
 * Track an "Enquire Now" button click.
 * Called on click; link opens normally without waiting for this.
 */
export function trackEnquiry(
    productId: string,
    productName: string,
    pageUrl?: string
): void {
    if (typeof window === 'undefined') return;
    send(buildPayload('enquiry', {
        product_id: productId,
        product_name: productName,
        page_url: pageUrl ?? window.location.href,
    }));
}
