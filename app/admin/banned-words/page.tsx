'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, DBBannedWord } from '@/lib/supabase';
import { Plus, Trash2, Shield, AlertCircle } from 'lucide-react';

export default function AdminBannedWordsPage() {
    const [items, setItems] = useState<DBBannedWord[]>([]);
    const [loading, setLoading] = useState(true);
    const [newWord, setNewWord] = useState('');
    const [adding, setAdding] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const fetch = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('banned_words').select('*').order('created_at', { ascending: false });
        setItems(data ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const handleAdd = async () => {
        if (!newWord.trim()) { setError('Enter a word'); return; }
        setAdding(true); setError('');
        const { error: err } = await supabase.from('banned_words').insert({ word: newWord.toLowerCase().trim(), is_active: true });
        if (err) { setError(err.message); }
        else { setSuccess('Word added!'); setNewWord(''); fetch(); setTimeout(() => setSuccess(''), 3000); }
        setAdding(false);
    };

    const handleDelete = async (id: string) => {
        await supabase.from('banned_words').delete().eq('id', id);
        fetch();
    };

    const toggleActive = async (item: DBBannedWord) => {
        await supabase.from('banned_words').update({ is_active: !item.is_active }).eq('id', item.id);
        fetch();
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                    <Shield size={20} className="text-red-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Banned Words</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Filter inappropriate terms from search and enquiries</p>
                </div>
            </div>

            {/* Add Word */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
                <h2 className="text-white font-semibold mb-4 text-sm">Add Banned Word</h2>
                {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl px-4 py-2 mb-3">{success}</div>}
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-2 mb-3">{error}</div>}
                <div className="flex gap-3">
                    <input
                        value={newWord}
                        onChange={e => setNewWord(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAdd()}
                        placeholder="Type a word to ban..."
                        className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-gray-600"
                    />
                    <button onClick={handleAdd} disabled={adding}
                        className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                        {adding ? <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> : <Plus size={16} />}
                        Add
                    </button>
                </div>
                <p className="text-gray-600 text-xs mt-2">Words are stored in lowercase. Press Enter to add.</p>
            </div>

            {/* List */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-800">
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">{items.length} words in list</p>
                </div>
                {loading ? (
                    <div className="p-5 space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-800 rounded-xl animate-pulse" />)}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12">
                        <Shield size={32} className="text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500">No banned words yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {items.map(item => (
                            <div key={item.id} className={`flex items-center justify-between px-5 py-3 hover:bg-gray-800/30 transition-colors ${!item.is_active ? 'opacity-50' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm text-white bg-gray-800 px-3 py-1 rounded-lg">{item.word}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? 'bg-red-500/10 text-red-400' : 'bg-gray-700 text-gray-500'}`}>
                                        {item.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleActive(item)} className={`w-10 h-5 rounded-full transition-colors relative ${item.is_active ? 'bg-red-500' : 'bg-gray-700'}`}>
                                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.is_active ? 'left-[22px]' : 'left-0.5'}`} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded-lg transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-zinc-100 text-zinc-900/10 border border-zinc-100/20 rounded-2xl p-4 mt-6">
                <div className="flex gap-2">
                    <AlertCircle size={16} className="text-zinc-100 flex-shrink-0 mt-0.5" />
                    <p className="text-zinc-300/80 text-xs">
                        Banned words are checked against product names, descriptions, and search queries. Inactive words are stored but not enforced.
                    </p>
                </div>
            </div>
        </div>
    );
}
