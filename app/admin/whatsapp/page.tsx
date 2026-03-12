'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, DBWhatsappSettings } from '@/lib/supabase';
import { Save, MessageSquare, AlertCircle, ExternalLink } from 'lucide-react';

export default function AdminWhatsAppPage() {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<DBWhatsappSettings | null>(null);
    const [form, setForm] = useState({ phone_number: '', default_message: '', is_float_visible: true });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const fetch = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('whatsapp_settings').select('*').limit(1).single();
        if (data) {
            setSettings(data);
            setForm({ phone_number: data.phone_number, default_message: data.default_message ?? '', is_float_visible: data.is_float_visible });
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const handleSave = async () => {
        if (!form.phone_number.trim()) { setError('Phone number is required'); return; }
        setSaving(true); setError('');
        const payload = { ...form, updated_at: new Date().toISOString() };
        const { error: err } = settings
            ? await supabase.from('whatsapp_settings').update(payload).eq('id', settings.id)
            : await supabase.from('whatsapp_settings').insert(payload);
        if (err) { setError(err.message); }
        else { setSuccess('WhatsApp settings saved!'); fetch(); setTimeout(() => setSuccess(''), 3000); }
        setSaving(false);
    };

    const whatsappPreviewUrl = `https://wa.me/${form.phone_number}?text=${encodeURIComponent(form.default_message)}`;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <MessageSquare size={20} className="text-green-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">WhatsApp Settings</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Control the WhatsApp button and default message</p>
                </div>
            </div>

            {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">{success}</div>}
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
                {loading ? (
                    <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-gray-800 rounded-xl animate-pulse" />)}</div>
                ) : (
                    <>
                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">
                                Phone Number (with country code, no + or spaces)
                            </label>
                            <input
                                value={form.phone_number}
                                onChange={e => setForm(f => ({ ...f, phone_number: e.target.value.replace(/\D/g, '') }))}
                                placeholder="919936911611"
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-gray-600"
                            />
                            <p className="text-gray-600 text-xs mt-1">Example: 919936911611 (91 = India code)</p>
                        </div>

                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">Default Message</label>
                            <textarea
                                value={form.default_message}
                                onChange={e => setForm(f => ({ ...f, default_message: e.target.value }))}
                                rows={3}
                                placeholder="Hello! I'm interested in placing an order..."
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors resize-none placeholder:text-gray-600"
                            />
                        </div>

                        <div className="flex items-center justify-between py-4 border-t border-gray-800">
                            <div>
                                <p className="text-white text-sm font-medium">Show Floating WhatsApp Button</p>
                                <p className="text-gray-500 text-xs mt-0.5">The circular button that floats on every page</p>
                            </div>
                            <button
                                onClick={() => setForm(f => ({ ...f, is_float_visible: !f.is_float_visible }))}
                                className={`w-12 h-6 rounded-full transition-colors relative ${form.is_float_visible ? 'bg-green-500' : 'bg-gray-700'}`}>
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.is_float_visible ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        {form.phone_number && (
                            <div className="bg-gray-800 rounded-xl p-4">
                                <p className="text-gray-400 text-xs mb-2 font-medium">Preview Link</p>
                                <a href={whatsappPreviewUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-green-400 text-xs hover:text-green-300 transition-colors break-all">
                                    <ExternalLink size={12} className="flex-shrink-0" />
                                    {whatsappPreviewUrl.substring(0, 80)}...
                                </a>
                            </div>
                        )}

                        <button onClick={handleSave} disabled={saving}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50">
                            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                            {saving ? 'Saving...' : 'Save WhatsApp Settings'}
                        </button>
                    </>
                )}
            </div>

            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 mt-4">
                <div className="flex gap-2">
                    <AlertCircle size={16} className="text-zinc-100 flex-shrink-0 mt-0.5" />
                    <p className="text-zinc-300/80 text-xs">
                        After saving, your frontend must read WhatsApp settings from Supabase. Update the WhatsApp float component and nav to use the number from this table.
                    </p>
                </div>
            </div>
        </div>
    );
}
