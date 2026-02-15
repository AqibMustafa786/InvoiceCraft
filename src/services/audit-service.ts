'use server';

import { getFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type AuditActionStatus = 'Success' | 'Failed';

export interface AuditUser {
    uid: string;
    name: string;
    email: string;
}

export interface LogAuditOptions {
    action: string;
    status: AuditActionStatus;
    details?: Record<string, any>;
    user: AuditUser;
    ip?: string;
}

export async function logAuditAction(options: LogAuditOptions) {
    const { firestore } = getFirebase();
    const { action, status, details, user, ip } = options;

    try {
        await addDoc(collection(firestore, 'audit_logs'), {
            action,
            status,
            details: details || {},
            user: {
                uid: user.uid,
                name: user.name,
                email: user.email,
            },
            ip: ip || 'unknown', // In a real app, we'd extract this from headers if running on server
            timestamp: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to log audit action:', error);
        // Be silent about audit errors to not break the user flow
        return { success: false, error };
    }
}
