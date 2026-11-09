import crypto from 'crypto';
import { supabaseAdmin } from './supabase-admin';

export interface StaffActivityItem {
    id: string;
    staffId: string;
    staffName: string;
    action: string;
    productId?: string;
    productName?: string;
    details: string;
    timestamp: string;
}

const SETTINGS_KEY = 'staff_activity_logs';
const MAX_LOGS = 1000;

export async function getStaffActivityLogs(limit = 100): Promise<StaffActivityItem[]> {
    try {
        const { data, error }: any = await (supabaseAdmin as any)
            .from('site_settings')
            .select('value')
            .eq('key', SETTINGS_KEY)
            .single();

        if (error || !data?.value) {
            return [];
        }

        const logs = JSON.parse(data.value);
        if (!Array.isArray(logs)) return [];
        return logs.slice(0, limit);
    } catch (err) {
        console.error('Error fetching staff activity logs:', err);
        return [];
    }
}

export async function logStaffActivity(entry: {
    staffId: string;
    staffName: string;
    action: string;
    productId?: string;
    productName?: string;
    details: string;
}): Promise<boolean> {
    try {
        const existing = await getStaffActivityLogs(MAX_LOGS);
        const newLog: StaffActivityItem = {
            id: crypto.randomUUID ? crypto.randomUUID() : `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            staffId: entry.staffId,
            staffName: entry.staffName,
            action: entry.action,
            productId: entry.productId,
            productName: entry.productName,
            details: entry.details,
            timestamp: new Date().toISOString(),
        };

        const updated = [newLog, ...existing].slice(0, MAX_LOGS);

        const { error }: any = await (supabaseAdmin as any)
            .from('site_settings')
            .upsert({
                key: SETTINGS_KEY,
                value: JSON.stringify(updated),
                label: 'Staff Activity Logs',
                type: 'json',
                updated_at: new Date().toISOString(),
            }, { onConflict: 'key' });

        if (error) {
            console.error('Error recording staff activity:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Exception recording staff activity:', err);
        return false;
    }
}
