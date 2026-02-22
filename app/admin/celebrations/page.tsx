'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, DBCelebration } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg"><div className="p-6">{children}</div></div>
            <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
    );
}

const DEFAULT = { name: '', date_label: '', image_url: '', is_visible: true, sort_order: 0 };

export default function AdminCelebrationsPage() {
    const [items, setItems] = useState<DBCelebration[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<DBCelebration | null>(null);
    const [form, setForm] = useState(DEFAULT);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetch = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('celebrations').select('*').order('sort_order');
        setItems(data ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const openAdd = () => { setEditing(null); setForm(DEFAULT); setError(''); setModalOpen(true); };
    const openEdit = (i: DBCelebration) => {
        setEditing(i); setError('');
        setForm({ name: i.name, date_label: i.date_label ?? '', image_url: i.image_url ?? '', is_visible: i.is_visible, sort_order: i.sort_order });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) { setError('Name is required'); return; }
        setSaving(true); setError('');
        const { error: err } = editing
            ? await supabase.from('celebrations').update(form).eq('id', editing.id)
            : await supabase.from('celebrations').insert(form);
        if (err) { setError(err.message); }
        else { setSuccess(editing ? 'Updated!' : 'Added!'); setModalOpen(false); fetch(); setTimeout(() => setSuccess(''), 3000); }
        setSaving(false);
    };

    const handleDelete = async (id: string) => { await supabase.from('celebrations').delete().eq('id', id); fetch(); setDeleteId(null); };
    const toggleVisible = async (i: DBCelebration) => { await supabase.from('celebrations').update({ is_visible: !i.is_visible }).eq('id', i.id); fetch(); };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Celebrations Calendar</h1>
                    <p className="text-gray-400 text-sm mt-0.5">{items.length} celebrations</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                    <Plus size={16} /> Add Celebration
                </button>
            </div>

            {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">{success}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-48 bg-gray-900 border border-gray-800 rounded-2xl animate-pulse" />)
                ) : items.map(item => (
                    <div key={item.id} className={`bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden ${!item.is_visible ? 'opacity-50' : ''}`}>
                        {item.image_url && (
                            <div className="relative h-32">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                            </div>
                        )}
                        <div className="p-4">
                            {item.date_label && <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">{item.date_label}</p>}
                            <p className="text-white font-semibold">{item.name}</p>
                            <div className="flex items-center justify-between mt-3">
                                <button onClick={() => toggleVisible(item)} className={`w-10 h-5 rounded-full transition-colors relative ${item.is_visible ? 'bg-green-500' : 'bg-gray-700'}`}>
                                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.is_visible ? 'left-[22px]' : 'left-0.5'}`} />
                                </button>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(item)} className="text-gray-500 hover:text-yellow-400 p-1.5 hover:bg-yellow-400/10 rounded-lg transition-colors"><Edit2 size={14} /></button>
                                    <button onClick={() => setDeleteId(item.id)} className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-white text-lg font-bold">{editing ? 'Edit Celebration' : 'Add Celebration'}</h2>
                    <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white p-1"><X size={18} /></button>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3 mb-4">{error}</div>}
                <div className="space-y-4">
                    {[
                        { label: 'Name *', field: 'name', placeholder: 'Holi' },
                        { label: 'Date Label', field: 'date_label', placeholder: '4TH MAR' },
                        { label: 'Image URL / Path', field: 'image_url', placeholder: '/images/celebrations/holi.webp' },
                    ].map(({ label, field, placeholder }) => (
                        <div key={field}>
                            <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">{label}</label>
                            <input value={(form as Record<string, unknown>)[field] as string}
                                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                                placeholder={placeholder}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-gray-600" />
                        </div>
                    ))}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Sort Order</label>
                            <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500 transition-colors" />
                        </div>
                        <div className="flex items-end pb-2.5">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.is_visible} onChange={e => setForm(f => ({ ...f, is_visible: e.target.checked }))} className="w-4 h-4 accent-yellow-500" />
                                <span className="text-gray-300 text-sm">Visible</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mt-5">
                    <button onClick={() => setModalOpen(false)} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                        {saving ? <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> : <Save size={14} />}
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </Modal>

            <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
                <div className="text-center">
                    <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-400" /></div>
                    <h3 className="text-white text-lg font-bold mb-2">Delete Celebration?</h3>
                    <p className="text-gray-400 text-sm mb-6">This cannot be undone.</p>
                    <div className="flex gap-3">
                        <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-sm hover:bg-gray-700">Cancel</button>
                        <button onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 rounded-xl text-sm">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
