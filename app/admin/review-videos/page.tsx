'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, DBReviewVideo } from '@/lib/supabase';
import { Plus, Trash2, Edit2, Save, X, Video } from 'lucide-react';

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg"><div className="p-6">{children}</div></div>
            <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
    );
}

const DEFAULT = { video_url: '', title: '', is_visible: true, sort_order: 0 };

export default function AdminReviewVideosPage() {
    const [items, setItems] = useState<DBReviewVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<DBReviewVideo | null>(null);
    const [form, setForm] = useState(DEFAULT);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const fetch = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('review_videos').select('*').order('sort_order');
        setItems(data ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const openAdd = () => { setEditing(null); setForm(DEFAULT); setError(''); setModalOpen(true); };
    const openEdit = (i: DBReviewVideo) => {
        setEditing(i); setError('');
        setForm({ video_url: i.video_url, title: i.title ?? '', is_visible: i.is_visible, sort_order: i.sort_order });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.video_url.trim()) { setError('Video URL is required'); return; }
        setSaving(true); setError('');
        const { error: err } = editing
            ? await supabase.from('review_videos').update(form).eq('id', editing.id)
            : await supabase.from('review_videos').insert(form);
        if (err) { setError(err.message); }
        else { setSuccess(editing ? 'Updated!' : 'Added!'); setModalOpen(false); fetch(); setTimeout(() => setSuccess(''), 3000); }
        setSaving(false);
    };

    const handleDelete = async (id: string) => { await supabase.from('review_videos').delete().eq('id', id); fetch(); setDeleteId(null); };
    const toggleVisible = async (i: DBReviewVideo) => { await supabase.from('review_videos').update({ is_visible: !i.is_visible }).eq('id', i.id); fetch(); };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <Video size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Review Videos</h1>
                        <p className="text-gray-400 text-sm mt-0.5">{items.length} videos in the scrolling section</p>
                    </div>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                    <Plus size={16} /> Add Video
                </button>
            </div>

            {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">{success}</div>}

            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 mb-6">
                <p className="text-zinc-300/80 text-xs">
                    <strong>Video URL formats:</strong> Use local paths like <code className="bg-zinc-800/80 px-1 rounded">/review%20videos/review1.mp4</code> for videos in the <code className="bg-zinc-800/80 px-1 rounded">public/review videos/</code> folder, or a full HTTPS URL for external videos.
                </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="p-5 space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />)}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12">
                        <Video size={32} className="text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500">No review videos yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {items.map((item, idx) => (
                            <div key={item.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-800/30 transition-colors ${!item.is_visible ? 'opacity-50' : ''}`}>
                                <span className="text-gray-600 text-xs w-5 text-center">{idx + 1}</span>

                                {/* Preview */}
                                {item.video_url && (
                                    <div className="w-12 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                                        <video src={item.video_url} className="w-full h-full object-cover" muted preload="metadata" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                                                <div className="w-0 h-0 border-t-2 border-b-2 border-l-4 border-transparent border-l-white ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    {item.title && <p className="text-white text-sm font-medium">{item.title}</p>}
                                    <p className="text-gray-500 text-xs font-mono truncate">{item.video_url}</p>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => toggleVisible(item)} className={`w-10 h-5 rounded-full transition-colors relative ${item.is_visible ? 'bg-green-500' : 'bg-gray-700'}`}>
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.is_visible ? 'left-[22px]' : 'left-0.5'}`} />
                                    </button>
                                    <button onClick={() => openEdit(item)} className="text-gray-500 hover:text-zinc-100 p-1.5 hover:bg-zinc-200/10 rounded-lg transition-colors"><Edit2 size={14} /></button>
                                    <button onClick={() => setDeleteId(item.id)} className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-white text-lg font-bold">{editing ? 'Edit Video' : 'Add Review Video'}</h2>
                    <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white p-1"><X size={18} /></button>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3 mb-4">{error}</div>}
                <div className="space-y-4">
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Video URL or Path *</label>
                        <input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
                            placeholder="/review%20videos/review1.mp4"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors font-mono placeholder:text-gray-600 placeholder:font-sans" />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Title (optional)</label>
                        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="Customer Review 1"
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-gray-600" />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">Sort Order</label>
                            <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
                        </div>
                        <div className="flex items-end pb-2.5">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.is_visible} onChange={e => setForm(f => ({ ...f, is_visible: e.target.checked }))} className="w-4 h-4 accent-zinc-400" />
                                <span className="text-gray-300 text-sm">Visible</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mt-5">
                    <button onClick={() => setModalOpen(false)} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-sm hover:bg-gray-700">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 bg-zinc-100 hover:bg-white text-zinc-900 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                        {saving ? <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> : <Save size={14} />}
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </Modal>

            <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
                <div className="text-center">
                    <Trash2 size={24} className="text-red-400 mx-auto mb-3" />
                    <h3 className="text-white text-lg font-bold mb-4">Delete Video?</h3>
                    <div className="flex gap-3">
                        <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-xl text-sm hover:bg-gray-700">Cancel</button>
                        <button onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 rounded-xl text-sm">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
