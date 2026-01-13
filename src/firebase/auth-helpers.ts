
'use client';

import { User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebase } from '@/firebase';

/**
 * Creates a user profile and company in Firestore if they don't already exist.
 * This function should be called without `await` to avoid blocking the UI thread.
 * @param user The Firebase User object.
 * @param displayName The name to use for the user and their company.
 */
export const bootstrapUser = (user: User, displayName?: string | null) => {
    if (!user) {
        console.error("Bootstrap failed: User object is null.");
        return;
    }
    
    // Get firestore instance inside the function
    const { firestore } = getFirebase();

    // The entire logic is wrapped in a self-invoking async function
    // to allow the use of `await` internally without making `bootstrapUser` async.
    (async () => {
        try {
            const userRef = doc(firestore, "users", user.uid);
            const userSnap = await getDoc(userRef);

            // If user profile already exists, do nothing.
            if (userSnap.exists()) {
                return;
            }
            
            const name = displayName || user.displayName || user.email?.split('@')[0] || 'New User';
            
            // Generate a simple, unique-enough ID based on the user's UID.
            const companyId = `COMP_${user.uid.substring(0, 8).toUpperCase()}`;

            // Create user profile in the global users collection
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                name: name,
                companyId: companyId,
                role: 'admin', // Default role for new users
                plan: 'free', // Default plan for new users
                planExpires: null,
                createdAt: serverTimestamp(),
            });

            // Create a company document as well
            await setDoc(doc(firestore, "companies", companyId), {
                id: companyId,
                name: `${name}'s Company`,
                ownerId: user.uid,
                createdAt: serverTimestamp(),
            });

            // Create the user's profile within their company's subcollection
            // This is useful for role-based security rules within a company
            await setDoc(doc(firestore, `companies/${companyId}/users`, user.uid), {
                 uid: user.uid,
                 email: user.email,
                 name: name,
                 role: 'admin',
                 createdAt: serverTimestamp(),
            });

        } catch (error) {
            console.error("Error during user bootstrapping:", error);
        }
    })();
};
