'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ThemeProvider() {
    const [themeCSS, setThemeCSS] = useState('');

    useEffect(() => {
        const applyTheme = (value: string) => {
            try {
                const parsed = JSON.parse(value);
                let css = ':root {\n';
                if (parsed.primary) css += `  --color-primary: ${parsed.primary};\n`;
                if (parsed.primaryDark) css += `  --color-primary-dark: ${parsed.primaryDark};\n`;
                if (parsed.background) css += `  --color-background: ${parsed.background};\n`;
                if (parsed.foreground) css += `  --color-foreground: ${parsed.foreground};\n`;
                css += '}\n';
                setThemeCSS(css);
            } catch {
                // Ignore parse errors
            }
        };

        // 1. Fetch initial theme immediately
        const fetchTheme = async () => {
            try {
                // using a timestamp to bypass any Next.js client-side fetch cache
                const timestamp = Date.now();
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('value')
                    .eq('key', 'theme_colors')
                    .lte('created_at', new Date(timestamp).toISOString()) // just to force a unique query param for cache busting
                    .single();

                if (error) {
                    console.error('ThemeProvider fetch error:', error);
                }

                if (data?.value) {
                    applyTheme(data.value);
                }
            } catch (err) {
                console.error('ThemeProvider catch error:', err);
            }
        };
        fetchTheme();

        // 2. Subscribe to realtime updates
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

    if (!themeCSS) return null;

    return <style dangerouslySetInnerHTML={{ __html: themeCSS }} />;
}
