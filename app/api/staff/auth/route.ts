import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
    getStaffAccounts,
    saveStaffAccounts,
    verifyPassword,
    createStaffToken,
    verifyStaffToken,
    hashPassword,
    DEFAULT_PERMISSIONS,
    STORE_STAFF_PERMISSIONS,
    StaffAccount,
} from '@/lib/staff-auth';
import { logStaffActivity } from '@/lib/staff-activity';

export const dynamic = 'force-dynamic';

async function ensureDefaultStaff() {
    let accounts = await getStaffAccounts();
    let changed = false;

    // 1. Atanu (Boutique Director)
    const atanuIdx = accounts.findIndex(a => a.username.toLowerCase() === 'atanu');
    if (atanuIdx === -1) {
        const atanuAccount: StaffAccount = {
            id: 'staff-atanu',
            username: 'atanu',
            name: 'Atanu',
            passwordHash: hashPassword('atanu123'),
            role: 'director',
            storeId: 'director',
            isActive: true,
            permissions: DEFAULT_PERMISSIONS,
            createdAt: new Date().toISOString(),
        };
        accounts = [atanuAccount, ...accounts];
        changed = true;
    } else {
        if (accounts[atanuIdx].name !== 'Atanu' || accounts[atanuIdx].storeId !== 'director') {
            accounts[atanuIdx].name = 'Atanu';
            accounts[atanuIdx].storeId = 'director';
            accounts[atanuIdx].role = 'director';
            accounts[atanuIdx].permissions = {
                ...accounts[atanuIdx].permissions,
                canAssignOrders: true,
                canDownloadLabels: true,
                canViewAllStores: true,
                canManageStaff: true,
            };
            changed = true;
        }
    }

    // 2. Tollygunge Store (Password: ecorose@tolly)
    const tlgIdx = accounts.findIndex(a => a.username.toLowerCase() === 'tollygunge');
    const newTlgHash = hashPassword('ecorose@tolly');
    if (tlgIdx === -1) {
        const tlgAccount: StaffAccount = {
            id: 'staff-tollygunge-store',
            username: 'tollygunge',
            name: 'Tollygunge Store',
            passwordHash: newTlgHash,
            role: 'staff',
            storeId: 'tollygunge',
            isActive: true,
            permissions: STORE_STAFF_PERMISSIONS,
            createdAt: new Date().toISOString(),
        };
        accounts = [...accounts, tlgAccount];
        changed = true;
    } else {
        if (!verifyPassword('ecorose@tolly', accounts[tlgIdx].passwordHash)) {
            accounts[tlgIdx].passwordHash = newTlgHash;
            changed = true;
        }
    }

    // 3. Alipore Store (Password: ecorose@alipur)
    const alpIdx = accounts.findIndex(a => a.username.toLowerCase() === 'alipore');
    const newAlpHash = hashPassword('ecorose@alipur');
    if (alpIdx === -1) {
        const aliporeAccount: StaffAccount = {
            id: 'staff-alipore-store',
            username: 'alipore',
            name: 'Alipore Store',
            passwordHash: newAlpHash,
            role: 'staff',
            storeId: 'alipore',
            isActive: true,
            permissions: STORE_STAFF_PERMISSIONS,
            createdAt: new Date().toISOString(),
        };
        accounts = [...accounts, aliporeAccount];
        changed = true;
    } else {
        if (!verifyPassword('ecorose@alipur', accounts[alpIdx].passwordHash)) {
            accounts[alpIdx].passwordHash = newAlpHash;
            changed = true;
        }
    }

    if (changed) await saveStaffAccounts(accounts);
    return accounts;
}

// ── GET: Check session ──
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('staff_token')?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const session = verifyStaffToken(token);
        if (!session) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        // Verify account is still active in DB
        const accounts = await getStaffAccounts();
        const account = accounts.find(a => a.id === session.id);
        if (!account || !account.isActive) {
            return NextResponse.json({ authenticated: false, error: 'Account inactive or deleted' }, { status: 401 });
        }

        return NextResponse.json({
            authenticated: true,
            staff: {
                id: account.id,
                username: account.username,
                name: account.name,
                role: account.role,
                storeId: (account as any).storeId || 'director',
                permissions: account.permissions,
            },
        });
    } catch (err: any) {
        return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
    }
}

// ── POST: Login ──
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const cleanUsername = String(username).trim().toLowerCase();
        const accounts = await ensureDefaultStaff();
        const account = accounts.find(a =>
            a.username.toLowerCase() === cleanUsername ||
            (cleanUsername === 'atanujana' && a.username.toLowerCase() === 'atanu') ||
            (cleanUsername === 'atanu' && a.username.toLowerCase() === 'atanujana')
        );

        if (!account) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        if (!account.isActive) {
            return NextResponse.json({ error: 'This staff account has been deactivated. Please contact your manager.' }, { status: 403 });
        }

        const isValid = verifyPassword(password, account.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        // Update last login
        account.lastLoginAt = new Date().toISOString();
        await saveStaffAccounts(accounts);

        // Create token
        const token = createStaffToken(account);

        // Record activity
        await logStaffActivity({
            staffId: account.id,
            staffName: account.name,
            action: 'Staff Logged In',
            details: `Logged in successfully from staff portal.`,
        });

        const response = NextResponse.json({
            success: true,
            staff: {
                id: account.id,
                username: account.username,
                name: account.name,
                role: account.role,
                storeId: (account as any).storeId || 'director',
                permissions: account.permissions,
            },
        });

        // Set HTTP-only secure cookie for staff authentication
        response.cookies.set({
            name: 'staff_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
    } catch (err: any) {
        console.error('Login error:', err);
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}

// ── DELETE: Logout ──
export async function DELETE() {
    const cookieStore = await cookies();
    const token = cookieStore.get('staff_token')?.value;
    if (token) {
        const session = verifyStaffToken(token);
        if (session) {
            await logStaffActivity({
                staffId: session.id,
                staffName: session.name,
                action: 'Staff Logged Out',
                details: `Logged out from staff portal.`,
            });
        }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
        name: 'staff_token',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
    return response;
}
