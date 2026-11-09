import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import {
    getStaffAccounts,
    saveStaffAccounts,
    hashPassword,
    StaffAccount,
    DEFAULT_PERMISSIONS,
} from '@/lib/staff-auth';
import { getStaffActivityLogs } from '@/lib/staff-activity';

export const dynamic = 'force-dynamic';

async function checkAdminAuth() {
    const cookieStore = await cookies();
    return cookieStore.get('admin_auth')?.value === 'true';
}

export async function GET() {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
        }

        const accounts = await getStaffAccounts();
        const safeAccounts = accounts.map(({ passwordHash, ...rest }) => rest);
        const logs = await getStaffActivityLogs(50);

        return NextResponse.json({
            accounts: safeAccounts,
            logs,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
        }

        const body = await request.json();
        const { username, name, password, role, permissions } = body;

        if (!username || !name || !password) {
            return NextResponse.json({ error: 'Username, name and password are required' }, { status: 400 });
        }

        const cleanUsername = String(username).trim().toLowerCase();
        const accounts = await getStaffAccounts();

        if (accounts.some(a => a.username.toLowerCase() === cleanUsername)) {
            return NextResponse.json({ error: 'A staff member with this username already exists.' }, { status: 409 });
        }

        const newAccount: StaffAccount = {
            id: `staff-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
            username: cleanUsername,
            name: String(name).trim(),
            passwordHash: hashPassword(password),
            role: role === 'supervisor' ? 'supervisor' : 'staff',
            isActive: true,
            permissions: {
                ...DEFAULT_PERMISSIONS,
                ...(permissions || {}),
            },
            createdAt: new Date().toISOString(),
        };

        const updated = [...accounts, newAccount];
        const ok = await saveStaffAccounts(updated);

        if (!ok) {
            return NextResponse.json({ error: 'Failed to save staff account' }, { status: 500 });
        }

        const { passwordHash, ...safe } = newAccount;
        return NextResponse.json({ success: true, account: safe });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, role, isActive, permissions, newPassword } = body;

        if (!id) {
            return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
        }

        const accounts = await getStaffAccounts();
        const idx = accounts.findIndex(a => a.id === id);

        if (idx === -1) {
            return NextResponse.json({ error: 'Staff account not found' }, { status: 404 });
        }

        const existing = accounts[idx];
        const updated: StaffAccount = {
            ...existing,
            name: name !== undefined ? String(name).trim() : existing.name,
            role: role !== undefined ? role : existing.role,
            isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
            permissions: permissions !== undefined ? { ...existing.permissions, ...permissions } : existing.permissions,
            passwordHash: newPassword ? hashPassword(newPassword) : existing.passwordHash,
        };

        accounts[idx] = updated;
        const ok = await saveStaffAccounts(accounts);

        if (!ok) {
            return NextResponse.json({ error: 'Failed to update staff account' }, { status: 500 });
        }

        const { passwordHash, ...safe } = updated;
        return NextResponse.json({ success: true, account: safe });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
        }

        const accounts = await getStaffAccounts();
        const filtered = accounts.filter(a => a.id !== id);

        const ok = await saveStaffAccounts(filtered);
        if (!ok) {
            return NextResponse.json({ error: 'Failed to delete staff account' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
