'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ThemeProvider() {
    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'theme_colors')
                    .single();

                if (error || !data?.value) return;

                const parsed = JSON.parse(data.value);
                const root = document.documentElement;
                if (parsed.primary) root.style.setProperty('--color-primary', parsed.primary);
                if (parsed.primaryDark) root.style.setProperty('--color-primary-dark', parsed.primaryDark);
                if (parsed.background) root.style.setProperty('--color-background', parsed.background);
                if (parsed.foreground) root.style.setProperty('--color-foreground', parsed.foreground);
            } catch {
                // Silently ignore
            }
        };
        fetchTheme();
    }, []);

    return null;
}
