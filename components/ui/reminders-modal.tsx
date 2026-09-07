'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Plus, Trash2, Gift, Check, Sparkles, Heart, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export interface OccasionReminder {
    id: string;
    title: string;
    recipient: string;
    relationship: string;
    date: string; // YYYY-MM-DD
    notes?: string;
    createdAt: string;
}

const STORAGE_KEY = 'newecoroses_user_reminders';

const RELATIONSHIPS = [
    'Her', 'Him', 'Wife', 'Husband', 'Girlfriend', 'Boyfriend',
    'Mom', 'Dad', 'Friend', 'Sister', 'Brother', 'Colleague', 'Other'
];

const OCCASION_TYPES = [
    'Birthday', 'Anniversary', 'Valentine’s Day', "Mother's Day",
    "Father's Day", 'Graduation', 'Housewarming', 'Special Date'
];

export default function RemindersModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [reminders, setReminders] = useState<OccasionReminder[]>([]);
    const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
    
    // Form state
    const [title, setTitle] = useState('Birthday');
    const [customTitle, setCustomTitle] = useState('');
    const [recipient, setRecipient] = useState('');
    const [relationship, setRelationship] = useState('Wife');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Load from local storage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) setReminders(parsed);
            }
        } catch {
            // ignore
        }
    }, [isOpen]);

    const saveRemindersToStorage = (updated: OccasionReminder[]) => {
        setReminders(updated);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
            // ignore
        }
    };

    const handleAddReminder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !recipient) return;

        const newReminder: OccasionReminder = {
            id: Date.now().toString(),
            title: title === 'Custom' && customTitle.trim() ? customTitle.trim() : title,
            recipient: recipient.trim(),
            relationship,
            date,
            notes: notes.trim() || undefined,
            createdAt: new Date().toISOString(),
        };

        const updated = [newReminder, ...reminders];
        saveRemindersToStorage(updated);
        
        // Reset form
        setRecipient('');
        setDate('');
        setNotes('');
        setCustomTitle('');
        setSavedSuccess(true);
        setTimeout(() => {
            setSavedSuccess(false);
            setActiveTab('list');
        }, 900);
    };

    const handleDelete = (id: string) => {
        const updated = reminders.filter(r => r.id !== id);
        saveRemindersToStorage(updated);
    };

    const getDaysRemaining = (targetDateStr: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [year, month, day] = targetDateStr.split('-').map(Number);
        const thisYearEvent = new Date(today.getFullYear(), month - 1, day);

        if (thisYearEvent.getTime() < today.getTime()) {
            thisYearEvent.setFullYear(today.getFullYear() + 1);
        }

        const diffTime = thisYearEvent.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today! 🎉';
        if (diffDays === 1) return 'Tomorrow! ⏰';
        return `In ${diffDays} days`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal Box */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="relative z-50 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ede4d6] flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-br from-[#faf7f2] via-white to-[#f5f0ea] px-6 py-5 border-b border-[#ede4d6] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shadow-xs border border-primary/20">
                                    <Calendar size={20} className="stroke-[2.2]" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2a2420] tracking-tight">
                                        My Occasion Reminders
                                    </h3>
                                    <p className="text-[11px] sm:text-xs text-[#8a7a5a]">
                                        Never forget birthdays, anniversaries &amp; milestones
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 px-6 pt-3 gap-6 bg-white">
                            <button
                                onClick={() => setActiveTab('list')}
                                className={`pb-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative ${
                                    activeTab === 'list'
                                        ? 'text-primary'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Saved Reminders ({reminders.length})
                                {activeTab === 'list' && (
                                    <motion.div
                                        layoutId="tabUnderline"
                                        className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('add')}
                                className={`pb-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative flex items-center gap-1.5 ${
                                    activeTab === 'add'
                                        ? 'text-primary'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <Plus size={14} />
                                Add Reminder
                                {activeTab === 'add' && (
                                    <motion.div
                                        layoutId="tabUnderline"
                                        className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
                                    />
                                )}
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            {activeTab === 'list' ? (
                                <>
                                    {reminders.length === 0 ? (
                                        <div className="py-10 text-center flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-[#faf7f2] flex items-center justify-center text-primary mb-3 shadow-inner">
                                                <Calendar size={28} className="opacity-70 stroke-[1.5]" />
                                            </div>
                                            <h4 className="font-serif font-bold text-base text-[#2a2420] mb-1">
                                                No reminders saved yet
                                            </h4>
                                            <p className="text-xs text-[#8a7a5a] max-w-xs mb-5">
                                                Add upcoming birthdays or anniversaries so you can always send flowers and gifts on time.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('add')}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary text-white hover:opacity-90 transition-all shadow-sm cursor-pointer"
                                            >
                                                <Plus size={14} /> Add First Reminder
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {reminders.map((rem) => {
                                                const countdown = getDaysRemaining(rem.date);
                                                const isSoon = countdown.includes('Today') || countdown.includes('Tomorrow') || countdown.includes('In 1') || countdown.includes('In 2') || countdown.includes('In 3');
                                                
                                                return (
                                                    <div
                                                        key={rem.id}
                                                        className="p-3.5 sm:p-4 rounded-2xl border border-[#ede4d6] bg-[#faf7f2]/50 hover:bg-[#faf7f2] transition-all flex items-center justify-between gap-3 group"
                                                    >
                                                        <div className="flex items-start gap-3 min-w-0">
                                                            <div className="w-9 h-9 rounded-xl bg-white border border-[#ede4d6] flex flex-col items-center justify-center flex-shrink-0 shadow-xs">
                                                                <span className="text-[9px] uppercase font-bold text-primary leading-none">
                                                                    {new Date(rem.date).toLocaleString('default', { month: 'short' })}
                                                                </span>
                                                                <span className="text-xs font-black text-[#2a2420] leading-none mt-0.5">
                                                                    {new Date(rem.date).getDate()}
                                                                </span>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <h5 className="text-sm font-bold text-[#2a2420] truncate">
                                                                        {rem.recipient}
                                                                    </h5>
                                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                                                                        {rem.relationship}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-[#8a7a5a] truncate mt-0.5">
                                                                    {rem.title}
                                                                    {rem.notes ? ` • "${rem.notes}"` : ''}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full ${
                                                                isSoon 
                                                                    ? 'bg-rose-100 text-rose-700 animate-pulse' 
                                                                    : 'bg-white border border-gray-200 text-gray-700'
                                                            }`}>
                                                                {countdown}
                                                            </span>

                                                            <Link
                                                                href={`/shop?relation=${rem.relationship.toLowerCase()}`}
                                                                onClick={onClose}
                                                                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors shadow-xs"
                                                                title="Find Gifts"
                                                            >
                                                                <Gift size={14} />
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(rem.id)}
                                                                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-colors"
                                                                title="Delete Reminder"
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <form onSubmit={handleAddReminder} className="space-y-4">
                                    {/* Occasion Type */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#2a2420] mb-1.5 uppercase tracking-wider">
                                            Occasion
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {OCCASION_TYPES.map((occ) => (
                                                <button
                                                    key={occ}
                                                    type="button"
                                                    onClick={() => setTitle(occ)}
                                                    className={`py-2 px-2 text-xs rounded-xl font-medium border text-center transition-all ${
                                                        title === occ
                                                            ? 'bg-primary text-white border-primary shadow-xs font-bold'
                                                            : 'bg-white text-[#2a2420] border-gray-200 hover:border-primary/40'
                                                    }`}
                                                >
                                                    {occ}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recipient Name & Relationship */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#2a2420] mb-1 uppercase tracking-wider">
                                                Person&apos;s Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Priya / Mom / Rahul"
                                                value={recipient}
                                                onChange={(e) => setRecipient(e.target.value)}
                                                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary bg-[#faf7f2]/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-[#2a2420] mb-1 uppercase tracking-wider">
                                                Relationship
                                            </label>
                                            <select
                                                value={relationship}
                                                onChange={(e) => setRelationship(e.target.value)}
                                                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary bg-white cursor-pointer"
                                            >
                                                {RELATIONSHIPS.map((rel) => (
                                                    <option key={rel} value={rel}>
                                                        {rel}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#2a2420] mb-1 uppercase tracking-wider">
                                            Occasion Date *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary bg-white"
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-xs font-semibold text-[#2a2420] mb-1 uppercase tracking-wider">
                                            Gift Note / Favorite Flowers (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Loves red roses and chocolate hampers"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary bg-[#faf7f2]/50"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={savedSuccess}
                                            className={`w-full py-3 rounded-xl text-xs sm:text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                                                savedSuccess
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-primary text-white hover:opacity-90 active:scale-[0.99] cursor-pointer'
                                            }`}
                                        >
                                            {savedSuccess ? (
                                                <>
                                                    <Check size={16} /> Saved!
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles size={16} /> Save Reminder
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Footer Info */}
                        <div className="px-6 py-3 bg-[#faf7f2] border-t border-[#ede4d6] flex items-center justify-between text-[11px] text-[#8a7a5a]">
                            <span className="flex items-center gap-1.5">
                                <Heart size={12} className="text-rose-400 fill-rose-400" /> Stored safely on this device
                            </span>
                            <Link
                                href="/shop"
                                onClick={onClose}
                                className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                            >
                                Browse Gifts <ChevronRight size={12} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}