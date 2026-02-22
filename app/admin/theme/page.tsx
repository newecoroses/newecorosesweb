'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, AlertCircle, Palette } from 'lucide-react';

const PRESET_THEMES = [
    { name: 'Classic Black', primary: '#000000', primaryDark: '#333333', background: '#ffffff', foreground: '#000000' },
    { name: 'Forest Green', primary: '#32745c', primaryDark: '#235240', background: '#ffffff', foreground: '#000000' },
    { name: 'Burgundy', primary: '#800020', primaryDark: '#5e0017', background: '#ffffff', foreground: '#000000' },
    { name: 'Ruby Red', primary: '#9b111e', primaryDark: '#750d17', background: '#ffffff', foreground: '#000000' },
    { name: 'Dark Red', primary: '#8b0000', primaryDark: '#660000', background: '#ffffff', foreground: '#000000' },
    { name: 'Midnight Blue', primary: '#0A2540', primaryDark: '#051424', background: '#ffffff', foreground: '#000000' },
];

export default function ThemeSettingsPage() {
    const [colors, setColors] = useState({
        primary: '#000000',
        primaryDark: '#333333',
        background: '#ffffff',
        foreground: '#000000',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const { data } = await supabase.from('site_settings').select('value').eq('key', 'theme_colors').single();
            if (data?.value) {
                try {
                    const parsed = JSON.parse(data.value);
                    setColors({
                        primary: parsed.primary || '#000000',
                        primaryDark: parsed.primaryDark || '#333333',
                        background: parsed.background || '#ffffff',
                        foreground: parsed.foreground || '#000000',
                    });
                } catch (e) {
                    console.error('Failed to parse theme colors');
                }
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError('');

        // Convert to JSON
        const colorData = JSON.stringify(colors);

        try {
            // First check if it exists
            const { data: existing, error: fetchError } = await supabase
                .from('site_settings')
                .select('id')
                .eq('key', 'theme_colors')
                .maybeSingle();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw new Error(fetchError.message);
            }

            let saveError;

            if (existing) {
                // Update existing
                const { error: updateError } = await supabase
                    .from('site_settings')
                    .update({ value: colorData })
                    .eq('key', 'theme_colors');
                saveError = updateError;
            } else {
                // Try direct insert, bypassing checking constraints (sometimes RLS blocks new rows if not set right)
                const { error: insertError } = await supabase
                    .from('site_settings')
                    .insert([{
                        key: 'theme_colors',
                        value: colorData,
                        label: 'Theme Colors',
                        type: 'text'
                    }]);

                // If it fails with constraint/RLS, try updating just in case
                if (insertError) {
                    if (insertError.code === '23505') { // unique violation
                        const { error: fallbackUpdateError } = await supabase
                            .from('site_settings')
                            .update({ value: colorData })
                            .eq('key', 'theme_colors');
                        saveError = fallbackUpdateError;
                    } else {
                        saveError = insertError;
                    }
                }
            }

            if (saveError) {
                setError('Failed to save. You may need to run the SQL script to update database policies: ' + saveError.message);
            } else {
                setSuccess('Theme updated successfully! Refresh the website to see the changes.');
                document.documentElement.style.setProperty('--color-primary', colors.primary);
                document.documentElement.style.setProperty('--color-primary-dark', colors.primaryDark);
                setTimeout(() => setSuccess(''), 4000);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }

        setSaving(false);
    };

    const applyPreset = (preset: typeof PRESET_THEMES[0]) => {
        setColors({
            primary: preset.primary,
            primaryDark: preset.primaryDark,
            background: preset.background,
            foreground: preset.foreground,
        });
    };

    if (loading) {
        return <div className="animate-pulse flex gap-4"><div className="w-full h-32 bg-gray-800 rounded-xl" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Palette className="text-yellow-500" />
                        Website Theme & Colors
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Change the look and feel of your website.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                    {saving ? <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Theme'}
                </button>
            </div>

            {/* Alerts */}
            {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
                    <AlertCircle size={16} /> {success}
                </div>
            )}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* Presets */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
                <h2 className="text-white font-medium mb-4 text-lg">Quick Presets</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {PRESET_THEMES.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => applyPreset(preset)}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${colors.primary === preset.primary
                                ? 'border-yellow-500 bg-yellow-500/5'
                                : 'border-gray-800 bg-gray-950 hover:border-gray-700 hover:bg-gray-800'
                                }`}
                        >
                            <div className="w-full h-12 rounded-lg shadow-inner flex overflow-hidden">
                                <div className="flex-1" style={{ backgroundColor: preset.primary }} />
                                <div className="w-1/3" style={{ backgroundColor: preset.primaryDark }} />
                            </div>
                            <span className="text-sm font-medium text-gray-200">{preset.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Hex Codes */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-white font-medium mb-1 text-lg">Custom Hex Codes</h2>
                <p className="text-gray-500 text-sm mb-6">Fine-tune the individual colors used across the website.</p>

                <div className="space-y-6">
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">
                            Primary Color (Buttons, Marquee, Links)
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                value={colors.primary}
                                onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                                className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <input
                                type="text"
                                value={colors.primary}
                                onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                                className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition-colors uppercase font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">
                            Primary Dark Color (Hover States)
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                value={colors.primaryDark}
                                onChange={(e) => setColors({ ...colors, primaryDark: e.target.value })}
                                className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                            />
                            <input
                                type="text"
                                value={colors.primaryDark}
                                onChange={(e) => setColors({ ...colors, primaryDark: e.target.value })}
                                className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition-colors uppercase font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-800">
                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">
                                Background Color
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={colors.background}
                                    onChange={(e) => setColors({ ...colors, background: e.target.value })}
                                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                                />
                                <input
                                    type="text"
                                    value={colors.background}
                                    onChange={(e) => setColors({ ...colors, background: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm uppercase font-mono"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">
                                Text Color
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={colors.foreground}
                                    onChange={(e) => setColors({ ...colors, foreground: e.target.value })}
                                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                                />
                                <input
                                    type="text"
                                    value={colors.foreground}
                                    onChange={(e) => setColors({ ...colors, foreground: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm uppercase font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
