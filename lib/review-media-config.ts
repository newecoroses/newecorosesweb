// ============================================================
//  Review Media Lifecycle Config — New Eco Roses
//
//  This is the SINGLE SOURCE OF TRUTH for the review marquee
//  media state. Edit values here, redeploy — done.
//
//  No localStorage. No per-user state. No randomness.
//  Every visitor computes the same result from the same inputs.
// ============================================================

// ------------------------------------------------------------
//  MODE
//
//  "active"    All media plays and renders normally.
//
//  "degrading" Media is progressively replaced with placeholders
//              on a global schedule defined by DEGRADATION_START_TIME
//              and the stage constants below. Every visitor sees
//              the same state at the same wall-clock moment.
//
//  "disabled"  All media is replaced with placeholders immediately.
//              Marquee animation continues unchanged.
//
//  Switching back to "active" from any mode instantly restores
//  all media on next deploy — no cleanup required anywhere.
// ------------------------------------------------------------
export const MEDIA_MODE: 'active' | 'degrading' | 'disabled' = 'active';

// ------------------------------------------------------------
//  DEGRADATION SCHEDULE
//
//  Used only when MEDIA_MODE === "degrading".
//
//  DEGRADATION_START_TIME
//    Unix timestamp (ms) of when degradation began.
//    All clients compute elapsed time as:
//        Date.now() - DEGRADATION_START_TIME
//
//  HOW TO SET AT DEPLOY TIME
//  ─────────────────────────
//  Run in terminal or browser console:
//      node -e "console.log(Date.now())"
//  Paste the result below, then set MEDIA_MODE to "degrading".
//
//  Leave at 0 when MEDIA_MODE is "active" or "disabled".
// ------------------------------------------------------------
export const DEGRADATION_START_TIME = 1780928764331; // 2026-06-08T14:26 UTC — degradation start

// ------------------------------------------------------------
//  STAGE CONSTANTS
//
//  Stage 0 fires immediately when degrading mode is deployed.
//  Each subsequent stage fires every STAGE_INTERVAL_MS after that.
//
//  Derivation:
//    elapsed = Date.now() - DEGRADATION_START_TIME
//    stage   = Math.max(0, Math.floor(elapsed / STAGE_INTERVAL_MS))
//    removed = Math.min(INITIAL_REMOVAL_COUNT + stage * STAGE_STEP_SIZE, totalItems)
//
//  Example with defaults (30 min intervals, step 3, initial 2):
//    Stage 0  (  0 min) →  2 items removed
//    Stage 1  ( 30 min) →  5 items removed
//    Stage 2  ( 60 min) →  8 items removed
//    Stage 3  ( 90 min) → 11 items removed
//    …until all items are replaced
// ------------------------------------------------------------
export const STAGE_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
export const STAGE_STEP_SIZE = 3;                 // items added per stage
export const INITIAL_REMOVAL_COUNT = 2;           // items removed in stage 0

// ------------------------------------------------------------
//  PLACEHOLDER APPEARANCE
//  Adjust without touching any component file.
// ------------------------------------------------------------

/** Background fill of placeholder cards */
export const PLACEHOLDER_BG = '#f0ece7';

/** Icon + label colour on placeholder cards */
export const PLACEHOLDER_FG = '#c9a247';
