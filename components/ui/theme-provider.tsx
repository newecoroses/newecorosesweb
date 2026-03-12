'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const THEME_CACHE_KEY = 'ner_theme_colors';

function applyTheme(parsed: Record<string, string>) {
    const root = document.documentElement;
    if (parsed.primary) root.style.setProperty('--color-primary', parsed.primary);
    if (parsed.primaryDark) root.style.setProperty('--color-primary-dark', parsed.primaryDark);
    if (parsed.background) root.style.setProperty('--color-background', parsed.background);
    if (parsed.foreground) root.style.setProperty('--color-foreground', parsed.foreground);
}

export default function ThemeProvider() {
    useEffect(() => {
        const fetchTheme = async () => {
            try {
                // 1. Apply cached theme instantly (no flash)
                const cached = localStorage.getItem(THEME_CACHE_KEY);
                if (cached) {
                    const parsedCache = JSON.parse(cached);
                    applyTheme(parsedCache);
                }

                // 2. Fetch latest from Supabase in background
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'theme_colors')
                    .single();

                if (error || !data?.value) return;

                const parsed = JSON.parse(data.value);

                // 3. Update cache and apply if changed
                localStorage.setItem(THEME_CACHE_KEY, data.value);
                applyTheme(parsed);
            } catch {
                // Silently ignore
            }
        };
        fetchTheme();
    }, []);

    return null;
}
