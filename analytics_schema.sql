-- ============================================================
-- Analytics Schema — New Eco Roses
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- ── 1. Raw Events Table ────────────────────────────────────
-- Every pageview and enquiry click is stored here.
-- Kept lean: only the fields needed for aggregation.
CREATE TABLE IF NOT EXISTS analytics_events (
    id           bigserial     PRIMARY KEY,
    event_type   text          NOT NULL CHECK (event_type IN ('pageview', 'enquiry')),
    page_url     text,
    product_id   uuid,
    product_name text,
    session_id   text,
    device_type  text          CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
    browser      text,
    referrer     text,
    hour         smallint      CHECK (hour >= 0 AND hour <= 23),
    created_at   timestamptz   DEFAULT now() NOT NULL
);

-- Indexes for the most common query patterns
CREATE INDEX IF NOT EXISTS idx_ae_created_at   ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ae_event_type   ON analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_ae_product_id   ON analytics_events (product_id) WHERE product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ae_hour         ON analytics_events (hour);
CREATE INDEX IF NOT EXISTS idx_ae_session      ON analytics_events (session_id) WHERE session_id IS NOT NULL;

-- ── 2. Pre-Aggregated Daily Stats ─────────────────────────
-- Dashboard reads from this table — never raw COUNT(*) on events.
-- Updated atomically each time an event is inserted.
CREATE TABLE IF NOT EXISTS analytics_daily (
    day        date    PRIMARY KEY,
    pageviews  integer DEFAULT 0 NOT NULL,
    enquiries  integer DEFAULT 0 NOT NULL,
    updated_at timestamptz DEFAULT now()
);

-- ── 3. Per-Product Aggregates ──────────────────────────────
-- One row per product. Updated on each enquiry/pageview event.
CREATE TABLE IF NOT EXISTS analytics_product_stats (
    product_id       uuid        PRIMARY KEY,
    product_name     text,
    total_views      integer     DEFAULT 0 NOT NULL,
    total_enquiries  integer     DEFAULT 0 NOT NULL,
    last_enquiry_at  timestamptz,
    updated_at       timestamptz DEFAULT now()
);

-- ── 4. Realtime Active Sessions ────────────────────────────
-- One row per active browser session (tab).
-- Rows older than 5 minutes are ignored by the query.
-- No periodic cleanup needed — stale rows are just filtered out.
CREATE TABLE IF NOT EXISTS analytics_realtime (
    session_id  text        PRIMARY KEY,
    page_url    text,
    last_seen   timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ar_last_seen ON analytics_realtime (last_seen DESC);

-- ── 5. Row Level Security ──────────────────────────────────
-- analytics_events: allow anonymous inserts (tracking from public site)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_anon_insert" ON analytics_events;
CREATE POLICY "allow_anon_insert" ON analytics_events
    FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "allow_service_select" ON analytics_events;
CREATE POLICY "allow_service_select" ON analytics_events
    FOR SELECT TO service_role USING (true);

-- analytics_daily: service role only
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_service_all" ON analytics_daily;
CREATE POLICY "allow_service_all" ON analytics_daily
    FOR ALL TO service_role USING (true);

-- analytics_product_stats: service role only
ALTER TABLE analytics_product_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_service_all" ON analytics_product_stats;
CREATE POLICY "allow_service_all" ON analytics_product_stats
    FOR ALL TO service_role USING (true);

-- analytics_realtime: allow anon insert + update (heartbeat), service select
ALTER TABLE analytics_realtime ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_anon_upsert" ON analytics_realtime;
CREATE POLICY "allow_anon_upsert" ON analytics_realtime
    FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "allow_service_all" ON analytics_realtime;
CREATE POLICY "allow_service_all" ON analytics_realtime
    FOR ALL TO service_role USING (true);

-- ── Done ───────────────────────────────────────────────────
-- All tables created. Run this script once in Supabase SQL Editor.

-- ── 6. RPC Helper Functions ────────────────────────────────
-- These allow atomic increments from the API without read-then-write races.

-- Upsert daily aggregates — increments pageviews and/or enquiries for a date
CREATE OR REPLACE FUNCTION upsert_analytics_daily(
    p_date      date,
    p_pageviews integer DEFAULT 0,
    p_enquiries integer DEFAULT 0
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO analytics_daily (day, pageviews, enquiries, updated_at)
    VALUES (p_date, p_pageviews, p_enquiries, now())
    ON CONFLICT (day) DO UPDATE SET
        pageviews  = analytics_daily.pageviews  + EXCLUDED.pageviews,
        enquiries  = analytics_daily.enquiries  + EXCLUDED.enquiries,
        updated_at = now();
END;
$$;

-- Upsert product stat for an enquiry click
CREATE OR REPLACE FUNCTION upsert_product_stat_enquiry(
    p_product_id   uuid,
    p_product_name text DEFAULT ''
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO analytics_product_stats (product_id, product_name, total_views, total_enquiries, last_enquiry_at, updated_at)
    VALUES (p_product_id, p_product_name, 0, 1, now(), now())
    ON CONFLICT (product_id) DO UPDATE SET
        total_enquiries = analytics_product_stats.total_enquiries + 1,
        product_name    = CASE WHEN p_product_name <> '' THEN p_product_name ELSE analytics_product_stats.product_name END,
        last_enquiry_at = now(),
        updated_at      = now();
END;
$$;

-- Upsert product stat for a product page view
CREATE OR REPLACE FUNCTION upsert_product_stat_view(
    p_product_id   uuid,
    p_product_name text DEFAULT ''
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO analytics_product_stats (product_id, product_name, total_views, total_enquiries, updated_at)
    VALUES (p_product_id, p_product_name, 1, 0, now())
    ON CONFLICT (product_id) DO UPDATE SET
        total_views  = analytics_product_stats.total_views + 1,
        product_name = CASE WHEN p_product_name <> '' THEN p_product_name ELSE analytics_product_stats.product_name END,
        updated_at   = now();
END;
$$;

-- Grant execute permissions to service role
GRANT EXECUTE ON FUNCTION upsert_analytics_daily TO service_role;
GRANT EXECUTE ON FUNCTION upsert_product_stat_enquiry TO service_role;
GRANT EXECUTE ON FUNCTION upsert_product_stat_view TO service_role;
