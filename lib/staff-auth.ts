import crypto from 'crypto';
import { supabaseAdmin } from './supabase-admin';

export interface StaffPermissions {
    canEditPrices: boolean;
    canEditDetails: boolean;
    canEditImages: boolean;
    canEditVisibility: boolean;
    canEditStock: boolean;
    canManageCategories: boolean;
    canManageHomepage: boolean;
}

export interface StaffAccount {
    id: string;
    username: string; // trimmed lowercase
    name: string;
    passwordHash: string; // salt:hash
    role: 'staff' | 'supervisor';
    isActive: boolean;
    permissions: StaffPermissions;
    createdAt: string;
    lastLoginAt?: string;
}

export interface StaffSessionData {
    id: string;
    username: string;
    name: string;
    role: 'staff' | 'supervisor';
    permissions: StaffPermissions;
    expiresAt: number;
}

const SETTINGS_KEY = 'staff_accounts';
const TOKEN_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'staff_portal_secure_secret_key_2026';

// ── Password hashing with pbkdf2 ──────────────────────────
export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
    try {
        const [salt, originalHash] = storedHash.split(':');
        if (!salt || !originalHash) return false;
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
    } catch {
        return false;
    }
}

// ── Token creation & verification (HMAC signed) ────────────
export function createStaffToken(staff: StaffAccount, expiresInHours = 24): string {
    const session: StaffSessionData = {
        id: staff.id,
        username: staff.username,
        name: staff.name,
        role: staff.role,
        permissions: staff.permissions,
        expiresAt: Date.now() + expiresInHours * 60 * 60 * 1000,
    };
    const payloadStr = Buffer.from(JSON.stringify(session)).toString('base64url');
    const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadStr).digest('base64url');
    return `${payloadStr}.${signature}`;
}

export function verifyStaffToken(token: string): StaffSessionData | null {
    try {
        if (!token) return null;
        const [payloadStr, signature] = token.split('.');
        if (!payloadStr || !signature) return null;

        const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadStr).digest('base64url');
        if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
            return null;
        }

        const session = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8')) as StaffSessionData;
        if (Date.now() > session.expiresAt) {
            return null;
        }
        return session;
    } catch {
        return null;
    }
}

// ── Fetch & Save staff accounts from Supabase site_settings ──
export async function getStaffAccounts(): Promise<StaffAccount[]> {
    try {
        const { data, error }: any = await (supabaseAdmin as any)
            .from('site_settings')
            .select('value')
            .eq('key', SETTINGS_KEY)
            .single();

        if (error || !data?.value) {
            return [];
        }

        const accounts = JSON.parse(data.value);
        return Array.isArray(accounts) ? accounts : [];
    } catch (err) {
        console.error('Error fetching staff accounts:', err);
        return [];
    }
}

export async function saveStaffAccounts(accounts: StaffAccount[]): Promise<boolean> {
    try {
        const { error }: any = await (supabaseAdmin as any)
            .from('site_settings')
            .upsert({
                key: SETTINGS_KEY,
                value: JSON.stringify(accounts),
                label: 'Staff Accounts',
                type: 'json',
                updated_at: new Date().toISOString(),
            }, { onConflict: 'key' });

        if (error) {
            console.error('Error saving staff accounts:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Exception saving staff accounts:', err);
        return false;
    }
}

export const DEFAULT_PERMISSIONS: StaffPermissions = {
    canEditPrices: true,
    canEditDetails: true,
    canEditImages: true,
    canEditVisibility: true,
    canEditStock: true,
    canManageCategories: true,
    canManageHomepage: true,
};
