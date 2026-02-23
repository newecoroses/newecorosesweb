'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, DBTestimonial } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Save, X, Star } from 'lucide-react';

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg"><div className="p-6">{children}</div></div>
            <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
    );
}

const DEFAULT = { customer_name: '', review_text: '', rating: 5, is_visible: true, sort_order: 0 };

export default function AdminTestimonialsPage() {
    const [items, setItems] = useState<DBTestimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<DBTestimonial | null>(null);
    const [form, setForm] = useState(DEFAULT);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetch = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('testimonials').select('*').order('sort_order');
        setItems(data ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const openAdd = () => { setEditing(null); setForm(DEFAULT); setError(''); setModalOpen(true); };
    const openEdit = (i: DBTestimonial) => {
        setEditing(i); setError('');
        setForm({ customer_name: i.customer_name, review_text: i.review_text, rating: i.rating, is_visible: i.is_visible, sort_order: i.sort_order });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.customer_name.trim() || !form.review_text.trim()) { setError('Name and review are required'); return; }
        setSaving(true); setError('');
        const { error: err } = editing
            ? await supabase.from('testimonials').update(form).eq('id', editing.id)
            : await supabase.from('testimonials').insert(form);
        if (err) { setError(err.message); }
        else { setSuccess(editing ? 'Updated!' : 'Added!'); setModalOpen(false); fetch(); setTimeout(() => setSuccess(''), 3000); }
        setSaving(false);
    };

    const handleDelete = async (id: string) => { await supabase.from('testimonials').delete().eq('id', id); fetch(); setDeleteId(null); };
    const toggleVisible = async (i: DBTestimonial) => { await supabase.from('testimonials').update({ is_visible: !i.is_visible }).eq('id', i.id); fetch(); };

    const Stars = ({ rating }: { rating: number }) => (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className={i < rating ? 'text-zinc-100 fill-zinc-300' : 'text-gray-600'} />
            ))}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Testimonials</h1>
                    <p className="text-gray-400 text-sm mt-0.5">{items.length} reviews</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                    <Plus size={16} /> Add Review
                </button>
            </div>

            {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">{success}</div>}

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-800">
                            {['Customer', 'Review', 'Rating', 'Visible', 'Actions'].map(h => (
                                <th key={h} className="text-left text-gray-500 text-xs uppercase tracking-wider font-medium px-5 py-4">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b border-gray-800/50">
                                    <td colSpan={5} className="px-5 py-4"><div className="h-4 bg-gray-800 rounded animate-pulse" /></td>
                                </tr>
                            ))
                        ) : items.map(item => (
                            <tr key={item.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${!item.is_visible ? 'opacity-50' : ''}`}>
                                <td className="px-5 py-4 text-white font-medium whitespace-nowrap">{item.customer_name}</td>
                                <td className="px-5 py-4 text-gray-400 max-w-xs">
                                    <p className="line-clamp-2 text-xs">{item.review_text}</p>
                                </td>
                                <td className="px-5 py-4"><Stars rating={item.rating} /></td>
                                <td className="px-5 py-4">
                                    <button onClick={() => toggleVisible(item)} className={`w-10 h-5 rounded-full transition-colors relative ${item.is_visible ? 'bg-green-500' : 'bg-gray-700'}`}>
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.is_visible ? 'left-[22px]' : 'left-0.5'}`} />
                                    </button>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(item)} className="text-gray-500 hover:text-zinc-100 p-1.5 hover:bg-zinc-200/10 rounded-lg transition-colors"><Edit2 size={15} /></button>
                                        <button onClick={() => setDeleteId(item.id)} className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-white text-lg font-bold">{editing ? 'Edit Review' : 'Add Review'}</h2>
                    <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white p-1"><X size={18} /></button>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3 mb-4">{error}</div>}
                <div className="space-y-4">
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Customer Name *</label>
                        <input value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Review Text *</label>
                        <textarea value={form.review_text} onChange={e => setForm(f => ({ ...f, review_text: e.target.value }))} rows={3}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors resize-none" />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Rating (1-5)</label>
                            <input type="number" min={1} max={5} step={0.5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseFloat(e.target.value) }))}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
                        </div>
                        <div className="flex-1">
                            <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Sort Order</label>
                            <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.is_visible} onChange={e => setForm(f => ({ ...f, is_visible: e.target.checked }))} className="w-4 h-4 accent-zinc-400" />
                        <span className="text-gray-300 text-sm">Visible on website</span>
                    </label>
                </div>
                <div className="flex gap-3 mt-5">
                    <button onClick={() => setModalOpen(false)} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 bg-zinc-100 hover:bg-white text-zinc-900 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                        {saving ? <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> : <Save size={14} />}
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </Modal>

            <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
                <div className="text-center">
                    <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-400" /></div>
                    <h3 className="text-white text-lg font-bold mb-2">Delete Review?</h3>
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
