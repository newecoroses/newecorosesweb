'use client';

/**
 * useMediaLifecycle — New Eco Roses
 *
 * Returns `removedCount`: how many items (from index 0 of the original,
 * un-duplicated array) the marquee should replace with placeholders.
 *
 * Computation is PURE — a deterministic function of:
 *   MEDIA_MODE            (deployed constant)
 *   DEGRADATION_START_TIME (deployed constant)
 *   Date.now()            (wall-clock, same result for every browser)
 *
 * No localStorage. No sessionStorage. No per-user divergence.
 *
 * ┌─────────────┬────────────────────────────────────────────────┐
 * │ MEDIA_MODE  │ removedCount                                   │
 * ├─────────────┼────────────────────────────────────────────────┤
 * │ "active"    │ 0          — all media live                    │
 * │ "disabled"  │ Infinity   — all media replaced                │
 * │ "degrading" │ grows deterministically via stage formula      │
 * └─────────────┴────────────────────────────────────────────────┘
 *
 * Degradation formula:
 *   elapsed = Date.now() - DEGRADATION_START_TIME
 *   stage   = Math.max(0, Math.floor(elapsed / STAGE_INTERVAL_MS))
 *   count   = INITIAL_REMOVAL_COUNT + stage * STAGE_STEP_SIZE
 */

import { useState, useEffect } from 'react';
import {
    MEDIA_MODE,
    DEGRADATION_START_TIME,
    STAGE_INTERVAL_MS,
    STAGE_STEP_SIZE,
    INITIAL_REMOVAL_COUNT,
} from '@/lib/review-media-config';

// How often the hook re-evaluates to advance stages live.
// 30 s keeps stages responsive without wasting CPU.
const TICK_MS = 30_000;

/**
 * Pure, side-effect-free computation.
 * Accepts elapsed ms; returns how many items should be removed.
 * Clamping to the actual array length is done in each component.
 */
export function computeRemovedCount(elapsedMs: number): number {
    const stage = Math.max(0, Math.floor(elapsedMs / STAGE_INTERVAL_MS));
    return INITIAL_REMOVAL_COUNT + stage * STAGE_STEP_SIZE;
}

export function useMediaLifecycle(): { removedCount: number } {
    const [removedCount, setRemovedCount] = useState<number>(() => {
        // Runs on server and client — no browser APIs used here.
        // Gives SSR the correct initial value with zero hydration flash.
        if (MEDIA_MODE === 'active') return 0;
        if (MEDIA_MODE === 'disabled') return Infinity;
        // "degrading": synchronous compute from deployed config + clock.
        return computeRemovedCount(Date.now() - DEGRADATION_START_TIME);
    });

    useEffect(() => {
        if (MEDIA_MODE === 'active') {
            setRemovedCount(0);
            return; // Static — no interval needed
        }

        if (MEDIA_MODE === 'disabled') {
            setRemovedCount(Infinity);
            return; // Static — no interval needed
        }

        // ── "degrading" ────────────────────────────────────────────────────
        // Poll every TICK_MS so stages advance live without a page reload.
        const recalculate = () =>
            setRemovedCount(
                computeRemovedCount(Date.now() - DEGRADATION_START_TIME)
            );

        recalculate(); // Align immediately on mount (handles SSR mismatch)
        const id = setInterval(recalculate, TICK_MS);
        return () => clearInterval(id);
    }, []);

    return { removedCount };
}

// ---------------------------------------------------------------------------
//  Legacy re-export — keeps any code that still imports useReviewMediaState
//  or the old `degradedCount` name working without changes.
// ---------------------------------------------------------------------------
/** @deprecated Use useMediaLifecycle() instead. */
export function useReviewMediaState(): { degradedCount: number } {
    const { removedCount } = useMediaLifecycle();
    return { degradedCount: removedCount };
}
