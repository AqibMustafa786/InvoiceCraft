import { User } from 'firebase/auth';
import { UserProfile } from './types';

/**
 * Determines the correct Firestore path for a given collection based on the user's plan.
 * 
 * Logic:
 * - If Plan is 'Business' AND user has a companyId: Use `companies/{companyId}/{collectionName}`.
 * - Otherwise (Free plan, or Business with no company yet): Use `users/{uid}/{collectionName}`.
 * 
 * @param user The user profile object (from AuthContext or Firestore)
 * @param collectionName The name of the collection (e.g., 'invoices', 'clients')
 * @returns The full Firestore path string.
 */
export const getCollectionPath = (user: UserProfile | null | undefined, collectionName: string): string | null => {
    if (!user || !user.uid) return null;

    // If user has a companyId, they should use the shared company path.
    // This applies to both Business Owners and Invited Employees.
    if (user.companyId) {
        return `companies/${user.companyId}/${collectionName}`;
    }

    // FREE PLAN / PERSONAL FLOW
    // Default to user's own subcollection
    return `users/${user.uid}/${collectionName}`;
};
