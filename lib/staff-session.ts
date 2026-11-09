import { cookies } from 'next/headers';
import { verifyStaffToken, getStaffAccounts, StaffSessionData } from './staff-auth';

export async function getStaffSession(): Promise<StaffSessionData | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('staff_token')?.value;
        if (!token) return null;

        const session = verifyStaffToken(token);
        if (!session) return null;

        // Double check active status
        const accounts = await getStaffAccounts();
        const account = accounts.find(a => a.id === session.id);
        if (!account || !account.isActive) {
            return null;
        }

        return {
            id: account.id,
            username: account.username,
            name: account.name,
            role: account.role,
            permissions: account.permissions,
            expiresAt: session.expiresAt,
        };
    } catch {
        return null;
    }
}
