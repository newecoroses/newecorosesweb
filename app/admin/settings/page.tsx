'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, DBSiteSetting } from '@/lib/supabase';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<DBSiteSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [values, setValues] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');

    const fetch = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('site_settings').select('*').order('label');
        setSettings(data ?? []);
        const vals: Record<string, string> = {};
        (data ?? []).forEach(s => { vals[s.key] = s.value ?? ''; });
        setValues(vals);
        setLoading(false);
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const handleSaveAll = async () => {
        setSaving(true);
        const updates = settings.map(s => supabase.from('site_settings').update({ value: values[s.key], updated_at: new Date().toISOString() }).eq('key', s.key));
        await Promise.all(updates);
        setSuccess('All settings saved!');
        setTimeout(() => setSuccess(''), 3000);
        setSaving(false);
    };

    const groupedSettings = settings.reduce<Record<string, DBSiteSetting[]>>((acc, s) => {
        const group = s.key.startsWith('show_') ? 'Visibility Toggles' :
            s.key.startsWith('whatsapp') || s.key === 'store_address' ? 'Contact & Business' :
                s.key.startsWith('meta') ? 'SEO' : 'General';
        if (!acc[group]) acc[group] = [];
        acc[group].push(s);
        return acc;
    }, {});

    const SettingInput = ({ s }: { s: DBSiteSetting }) => {
        if (s.type === 'boolean') {
            const isOn = values[s.key] === 'true';
            return (
                <div className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
                    <div>
                        <p className="text-white text-sm font-medium">{s.label}</p>
                        <p className="text-gray-500 text-xs font-mono mt-0.5">{s.key}</p>
                    </div>
                    <button
                        onClick={() => setValues(v => ({ ...v, [s.key]: isOn ? 'false' : 'true' }))}
                        className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${isOn ? 'bg-green-500' : 'bg-gray-700'}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isOn ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            );
        }
        return (
            <div className="py-4 border-b border-gray-800 last:border-0">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-white text-sm font-medium">{s.label}</label>
                    <span className="text-gray-600 text-xs font-mono">{s.key}</span>
                </div>
                {s.type === 'url' || s.type === 'text' ? (
                    <input
                        value={values[s.key] ?? ''}
                        onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors"
                    />
                ) : (
                    <input
                        type="number"
                        value={values[s.key] ?? ''}
                        onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors"
                    />
                )}
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Site Settings</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Control every text, toggle, and config on your website</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetch} className="p-2.5 bg-gray-800 text-gray-400 hover:text-white rounded-xl border border-gray-700 transition-colors">
                        <RefreshCw size={16} />
                    </button>
                    <button onClick={handleSaveAll} disabled={saving}
                        className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                        {saving ? <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> : <Save size={16} />}
                        {saving ? 'Saving...' : 'Save All'}
                    </button>
                </div>
            </div>

            {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
                    <AlertCircle size={14} /> {success}
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-gray-900 border border-gray-800 rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedSettings).map(([group, groupSettings]) => (
                        <div key={group} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <h2 className="text-zinc-100 text-xs uppercase tracking-widest font-bold mb-4">{group}</h2>
                            {groupSettings.map(s => <SettingInput key={s.key} s={s} />)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
