import { User } from 'firebase/auth';
import { collection, query, where, getDocs, Timestamp, getFirestore, getCountFromServer } from 'firebase/firestore';
import { getFirebase } from '@/firebase';

export const LIMITS = {
    invoices: 5,
    estimates: 5,
    quotes: 5,
    insurance: 5,
    clients: 3,
};

/**
 * Checks if a user has reached their usage limit for a given collection.
 * For documents (invoices, etc.), it checks MONTHLY creation.
 * For entities (clients), it checks TOTAL count.
 * Only applies to 'free' plan users (business assumed unlimited).
 * 
 * @param userId The user's UID
 * @param collectionName The name of the collection (e.g., 'invoices', 'clients')
 * @returns {Promise<boolean>} True if allowed, False if limit reached.
 */
export async function checkUsageLimit(userId: string, collectionName: keyof typeof LIMITS): Promise<boolean> {
    const { firestore } = getFirebase();
    if (!firestore) return false;

    // 1. Handle Total Count Limits (Clients)
    if (collectionName === 'clients') {
        const coll = collection(firestore, `users/${userId}/${collectionName}`);
        const snapshot = await getCountFromServer(coll);
        const count = snapshot.data().count;
        console.log(`[Limit Check] User: ${userId}, Collection: ${collectionName} (Total), Count: ${count}/${LIMITS[collectionName]}`);
        return count < LIMITS[collectionName];
    }

    // 2. Handle Monthly Count Limits (Docs)
    // Get start of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Query for documents created by this user in this collection this month
    const q = query(
        collection(firestore, `users/${userId}/${collectionName}`),
        where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
        where('createdAt', '<=', Timestamp.fromDate(endOfMonth))
    );

    // Use getCountFromServer for efficiency
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;

    console.log(`[Limit Check] User: ${userId}, Collection: ${collectionName} (Monthly), Count: ${count}/${LIMITS[collectionName]}`);

    return count < LIMITS[collectionName];
}
