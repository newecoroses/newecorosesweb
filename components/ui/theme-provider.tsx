'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ThemeProvider() {
    useEffect(() => {
        const applyTheme = (value: string) => {
            try {
                const parsed = JSON.parse(value);
                if (parsed.primary) document.documentElement.style.setProperty('--color-primary', parsed.primary);
                if (parsed.primaryDark) document.documentElement.style.setProperty('--color-primary-dark', parsed.primaryDark);
                if (parsed.background) document.documentElement.style.setProperty('--color-background', parsed.background);
                if (parsed.foreground) document.documentElement.style.setProperty('--color-foreground', parsed.foreground);
            } catch {
                // Ignore parse errors
            }
        };

        // 1. Fetch initial theme immediately
        const fetchTheme = async () => {
            try {
                const { data } = await supabase.from('site_settings').select('value').eq('key', 'theme_colors').single();
                if (data?.value) {
                    applyTheme(data.value);
                }
            } catch {
                // Silently ignore if no theme is set or fetch fails
            }
        };
        fetchTheme();

        // 2. Subscribe to realtime updates for instant crossover changes
        const channel = supabase.channel('theme-updates')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'site_settings', filter: 'key=eq.theme_colors' },
                (payload) => {
                    if (payload.new && payload.new.value) {
                        applyTheme(payload.new.value);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return null;
}
