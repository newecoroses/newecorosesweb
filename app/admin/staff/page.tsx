'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    UserCheck, Plus, Search, Edit2, Trash2, Shield, Lock, Eye, EyeOff,
    Check, X, AlertCircle, RefreshCw, Key, CheckCircle2, Clock
} from 'lucide-react';
import { StaffPermissions } from '@/lib/staff-auth';

interface StaffUser {
    id: string;
    username: string;
    name: string;
    role: 'staff' | 'supervisor';
    isActive: boolean;
    permissions: StaffPermissions;
    createdAt: string;
    lastLoginAt?: string;
}

interface ActivityLog {
    id: string;
    staffId: string;
    staffName: string;
    action: string;
    productId?: string;
    productName?: string;
    details: string;
    timestamp: string;
}

const DEFAULT_PERMISSIONS: StaffPermissions = {
    canEditPrices: true,
    canEditDetails: true,
    canEditImages: true,
    canEditVisibility: true,
    canEditStock: true,
    canManageCategories: true,
    canManageHomepage: true,
};

const PERMISSION_LABELS: Record<keyof StaffPermissions, string> = {
    canEditPrices: 'Edit Product Prices',
    canEditDetails: 'Edit Names & Descriptions',
    canEditImages: 'Upload & Edit Images',
    canEditVisibility: 'Publish / Hide Products',
    canEditStock: 'Manage Stock & Availability',
    canManageCategories: 'Manage Categories',
    canManageHomepage: 'Manage Homepage & Featured',
};

export default function AdminStaffPage() {
    const [staffList, setStaffList] = useState<StaffUser[]>([]);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'accounts' | 'logs'>('accounts');

    // Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);

    // Form state
    const [formUsername, setFormUsername] = useState('');
    const [formName, setFormName] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formRole, setFormRole] = useState<'staff' | 'supervisor'>('staff');
    const [formPermissions, setFormPermissions] = useState<StaffPermissions>(DEFAULT_PERMISSIONS);
    const [formResetPassword, setFormResetPassword] = useState('');

    const [actionLoading, setActionLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const fetchStaffData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/staff');
            if (res.ok) {
                const data = await res.json();
                setStaffList(data.accounts || []);
                setLogs(data.logs || []);
            }
        } catch (err) {
            console.error('Failed to load staff data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStaffData();
    }, [fetchStaffData]);

    const handleCreateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setErrorMessage(null);

        try {
            const res = await fetch('/api/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formUsername,
                    name: formName,
                    password: formPassword,
                    role: formRole,
                    permissions: formPermissions,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setErrorMessage(data.error || 'Failed to create staff account');
                setActionLoading(false);
                return;
            }

            showToast(`Staff member "${formName}" created successfully!`);
            setIsAddOpen(false);
            setFormUsername('');
            setFormName('');
            setFormPassword('');
            setFormPermissions(DEFAULT_PERMISSIONS);
            fetchStaffData();
        } catch (err: any) {
            setErrorMessage(err.message || 'Network error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStaff) return;
        setActionLoading(true);
        setErrorMessage(null);

        try {
            const res = await fetch('/api/admin/staff', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingStaff.id,
                    name: formName,
                    role: formRole,
                    permissions: formPermissions,
                    newPassword: formResetPassword || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setErrorMessage(data.error || 'Failed to update staff account');
                setActionLoading(false);
                return;
            }

            showToast(`Staff member "${formName}" updated successfully!`);
            setIsEditOpen(false);
            setEditingStaff(null);
            setFormResetPassword('');
            fetchStaffData();
        } catch (err: any) {
            setErrorMessage(err.message || 'Network error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleActive = async (user: StaffUser) => {
        try {
            const res = await fetch('/api/admin/staff', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    isActive: !user.isActive,
                }),
            });
            if (res.ok) {
                showToast(`Staff member ${user.isActive ? 'deactivated' : 'activated'}.`);
                fetchStaffData();
            }
        } catch (err) {
            console.error('Toggle status error:', err);
        }
    };

    const handleDeleteStaff = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete staff account for "${name}"?`)) return;
        try {
            const res = await fetch(`/api/admin/staff?id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                showToast(`Staff account "${name}" deleted.`);
                fetchStaffData();
            }
        } catch (err) {
            console.error('Delete staff error:', err);
        }
    };

    const openEditModal = (user: StaffUser) => {
        setEditingStaff(user);
        setFormName(user.name);
        setFormRole(user.role);
        setFormPermissions(user.permissions);
        setFormResetPassword('');
        setErrorMessage(null);
        setIsEditOpen(true);
    };

    const filteredStaff = staffList.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const togglePermission = (key: keyof StaffPermissions) => {
        setFormPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                        <UserCheck className="w-6 h-6 text-emerald-400" />
                        Staff Management Portal
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Manage authorized staff accounts, role-based product permissions, and monitor staff activity.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setFormUsername('');
                            setFormName('');
                            setFormPassword('');
                            setFormRole('staff');
                            setFormPermissions(DEFAULT_PERMISSIONS);
                            setErrorMessage(null);
                            setIsAddOpen(true);
                        }}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-950/40"
                    >
                        <Plus className="w-4 h-4" />
                        Add Staff Member
                    </button>
                </div>
            </div>

            {/* Toast feedback */}
            {toastMessage && (
                <div className="bg-emerald-950/80 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Quick stats & Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                    <div className="text-xs uppercase tracking-wider text-gray-400">Total Accounts</div>
                    <div className="text-2xl font-bold text-white mt-1">{staffList.length}</div>
                    <div className="text-xs text-emerald-400 mt-1">{staffList.filter(s => s.isActive).length} active</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                    <div className="text-xs uppercase tracking-wider text-gray-400">Staff Portal URL</div>
                    <div className="text-sm font-semibold text-emerald-300 mt-1 font-mono">/staff</div>
                    <div className="text-xs text-gray-500 mt-1">Dedicated product portal for staff</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                    <div className="text-xs uppercase tracking-wider text-gray-400">Logged Activities</div>
                    <div className="text-2xl font-bold text-white mt-1">{logs.length}</div>
                    <div className="text-xs text-gray-500 mt-1">Changes recorded with timestamp</div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-800">
                <button
                    onClick={() => setActiveTab('accounts')}
                    className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                        activeTab === 'accounts'
                            ? 'border-emerald-500 text-emerald-400 bg-gray-900/40'
                            : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                >
                    Staff Accounts ({staffList.length})
                </button>
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                        activeTab === 'logs'
                            ? 'border-emerald-500 text-emerald-400 bg-gray-900/40'
                            : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                >
                    Activity Audit Log ({logs.length})
                </button>
            </div>

            {/* TAB 1: ACCOUNTS LIST */}
            {activeTab === 'accounts' && (
                <div className="space-y-4">
                    {/* Search bar */}
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name or username..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-400">
                            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                            Loading staff accounts...
                        </div>
                    ) : filteredStaff.length === 0 ? (
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center text-gray-400">
                            <UserCheck className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                            <p className="text-base font-semibold text-white">No staff accounts found</p>
                            <p className="text-sm text-gray-500 mt-1">Click &ldquo;Add Staff Member&rdquo; to create your first staff login.</p>
                        </div>
                    ) : (
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-300">
                                    <thead className="bg-gray-950 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                                        <tr>
                                            <th className="px-6 py-4">Staff Member</th>
                                            <th className="px-6 py-4">Role & Status</th>
                                            <th className="px-6 py-4">Permissions</th>
                                            <th className="px-6 py-4">Last Login</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/60 font-normal">
                                        {filteredStaff.map(user => {
                                            const permCount = Object.values(user.permissions || {}).filter(Boolean).length;
                                            return (
                                                <tr key={user.id} className="hover:bg-gray-800/40 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-white">{user.name}</div>
                                                        <div className="text-xs text-gray-500 font-mono">@{user.username}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                                                user.role === 'supervisor' ? 'bg-purple-900/60 text-purple-300 border border-purple-700' : 'bg-blue-900/60 text-blue-300 border border-blue-700'
                                                            }`}>
                                                                {user.role}
                                                            </span>
                                                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                                                                user.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                                                            }`}>
                                                                {user.isActive ? 'Active' : 'Deactivated'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-xs text-gray-400">
                                                            <span className="font-semibold text-white">{permCount}</span> of 7 permissions granted
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 mt-1.5 max-w-xs">
                                                            {user.permissions?.canEditPrices && <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">Prices</span>}
                                                            {user.permissions?.canEditDetails && <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">Details</span>}
                                                            {user.permissions?.canEditImages && <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">Images</span>}
                                                            {user.permissions?.canEditVisibility && <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">Visibility</span>}
                                                            {user.permissions?.canEditStock && <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">Stock</span>}
                                                            {user.permissions?.canManageHomepage && <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">Homepage</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-gray-400">
                                                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never logged in'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors inline-flex"
                                                            title="Edit Permissions & Password"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleActive(user)}
                                                            className={`p-1.5 rounded-lg transition-colors inline-flex ${
                                                                user.isActive ? 'bg-amber-950/60 hover:bg-amber-900/80 text-amber-300' : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300'
                                                            }`}
                                                            title={user.isActive ? 'Deactivate account' : 'Activate account'}
                                                        >
                                                            {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteStaff(user.id, user.name)}
                                                            className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-white rounded-lg transition-colors inline-flex"
                                                            title="Delete account"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: AUDIT LOGS */}
            {activeTab === 'logs' && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <div className="text-sm font-semibold text-white flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            Recent Staff Actions
                        </div>
                        <button
                            onClick={fetchStaffData}
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Refresh
                        </button>
                    </div>
                    {logs.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 text-sm">No recorded staff activity yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-gray-950 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                                    <tr>
                                        <th className="px-6 py-3">Timestamp</th>
                                        <th className="px-6 py-3">Staff</th>
                                        <th className="px-6 py-3">Action</th>
                                        <th className="px-6 py-3">Product</th>
                                        <th className="px-6 py-3">Change Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/60 text-xs">
                                    {logs.map(log => (
                                        <tr key={log.id} className="hover:bg-gray-800/30">
                                            <td className="px-6 py-3.5 text-gray-400 whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-3.5 font-semibold text-white whitespace-nowrap">
                                                {log.staffName}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className="px-2 py-0.5 bg-gray-800 text-emerald-300 rounded font-medium">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-gray-200">
                                                {log.productName || '—'}
                                            </td>
                                            <td className="px-6 py-3.5 text-gray-400 max-w-md break-words">
                                                {log.details}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* MODAL: ADD STAFF */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-emerald-400" />
                                Add New Staff Member
                            </h2>
                            <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateStaff} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 font-medium block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rahul Sharma"
                                        value={formName}
                                        onChange={e => setFormName(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-medium block mb-1">Username (Login ID)</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. rahul"
                                        value={formUsername}
                                        onChange={e => setFormUsername(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 font-medium block mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Min 6 characters"
                                        value={formPassword}
                                        onChange={e => setFormPassword(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-medium block mb-1">Role</label>
                                    <select
                                        value={formRole}
                                        onChange={e => setFormRole(e.target.value as any)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="staff">Staff (Standard)</option>
                                        <option value="supervisor">Supervisor</option>
                                    </select>
                                </div>
                            </div>

                            {/* Granular Permissions */}
                            <div className="pt-2">
                                <label className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-2">
                                    Granular Product Permissions
                                </label>
                                <div className="space-y-2 bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                                    {(Object.keys(PERMISSION_LABELS) as (keyof StaffPermissions)[]).map(key => (
                                        <label key={key} className="flex items-center gap-3 cursor-pointer text-sm text-gray-300 hover:text-white select-none">
                                            <input
                                                type="checkbox"
                                                checked={formPermissions[key]}
                                                onChange={() => togglePermission(key)}
                                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-gray-800 border-gray-700"
                                            />
                                            <span>{PERMISSION_LABELS[key]}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all disabled:opacity-50"
                                >
                                    {actionLoading ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: EDIT STAFF */}
            {isEditOpen && editingStaff && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Edit2 className="w-5 h-5 text-emerald-400" />
                                Edit Staff Member: {editingStaff.name}
                            </h2>
                            <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleUpdateStaff} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 font-medium block mb-1">Username (Login ID)</label>
                                <input
                                    type="text"
                                    disabled
                                    value={editingStaff.username}
                                    className="w-full bg-gray-800/50 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 font-medium block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formName}
                                        onChange={e => setFormName(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-medium block mb-1">Role</label>
                                    <select
                                        value={formRole}
                                        onChange={e => setFormRole(e.target.value as any)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="staff">Staff (Standard)</option>
                                        <option value="supervisor">Supervisor</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 font-medium block mb-1 flex items-center gap-1.5">
                                    <Key className="w-3.5 h-3.5 text-amber-400" />
                                    Reset Password (leave empty to keep current)
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter new password if changing"
                                    value={formResetPassword}
                                    onChange={e => setFormResetPassword(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* Granular Permissions */}
                            <div className="pt-2">
                                <label className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-2">
                                    Granular Product Permissions
                                </label>
                                <div className="space-y-2 bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                                    {(Object.keys(PERMISSION_LABELS) as (keyof StaffPermissions)[]).map(key => (
                                        <label key={key} className="flex items-center gap-3 cursor-pointer text-sm text-gray-300 hover:text-white select-none">
                                            <input
                                                type="checkbox"
                                                checked={formPermissions[key]}
                                                onChange={() => togglePermission(key)}
                                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-gray-800 border-gray-700"
                                            />
                                            <span>{PERMISSION_LABELS[key]}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all disabled:opacity-50"
                                >
                                    {actionLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
