'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ThemeProvider() {
    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const { data } = await supabase.from('site_settings').select('value').eq('key', 'theme_colors').single();
                if (data?.value) {
                    const parsed = JSON.parse(data.value);
                    if (parsed.primary) document.documentElement.style.setProperty('--color-primary', parsed.primary);
                    if (parsed.primaryDark) document.documentElement.style.setProperty('--color-primary-dark', parsed.primaryDark);
                    if (parsed.background) document.documentElement.style.setProperty('--color-background', parsed.background);
                    if (parsed.foreground) document.documentElement.style.setProperty('--color-foreground', parsed.foreground);
                }
            } catch {
                // Silently ignore if no theme is set or parse fails
            }
        };
        fetchTheme();
    }, []);

    return null;
}
