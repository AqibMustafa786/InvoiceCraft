
'use client';

import { User } from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    collectionGroup,
    query,
    where,
    getDocs,
    writeBatch
} from 'firebase/firestore';
import { getFirebase } from '@/firebase';

/**
 * Creates a user profile and company in Firestore if they don't already exist.
 * This function handles the "Business Admin = Owner" logic and initializes
 * necessary subcollections for the company.
 * @param user The Firebase User object.
 * @param displayName The name to use for the user and their company.
 */
export const bootstrapUser = async (user: User, displayName?: string | null) => {
    if (!user) {
        console.error("Bootstrap failed: User object is null.");
        return;
    }

    // Get firestore instance inside the function
    const { firestore } = getFirebase();

    try {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        // If user profile exists AND is already linked to a company, do nothing.
        if (userSnap.exists() && userData?.companyId) {
            return;
        }

        console.log("Bootstrapping/Checking user:", user.email, userSnap.exists() ? "(Existing)" : "(New)");
        const name = displayName || user.displayName || userData?.name || user.email?.split('@')[0] || 'New User';
        const emailLower = user.email?.toLowerCase();

        // CHECK FOR PENDING INVITATIONS
        try {
            console.log("[Bootstrap] Checking for invitations for:", user.email);
            const emailLower = user.email?.toLowerCase();
            let invitedDoc = null;

            // STRATEGY 1: Direct lookup if companyId is in URL or sessionStorage (Most reliable)
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                const companyIdHint = params.get('companyId') || sessionStorage.getItem('companyIdHint');
                if (companyIdHint) {
                    console.log("[Bootstrap] Using companyId hint:", companyIdHint);
                    const hintUserId = `invited_${emailLower?.replace(/[^a-zA-Z0-9]/g, '')}`;
                    const hintRef = doc(firestore, 'companies', companyIdHint, 'users', hintUserId);
                    const hintSnap = await getDoc(hintRef);
                    if (hintSnap.exists() && hintSnap.data().status === 'pending_invitation') {
                        invitedDoc = hintSnap;
                        console.log("[Bootstrap] Direct invite lookup successful!");
                    }
                }
            }

            // STRATEGY 2: Fallback to collectionGroup if direct lookup failed
            if (!invitedDoc && emailLower) {
                console.log("[Bootstrap] Falling back to collectionGroup search...");
                const q = query(
                    collectionGroup(firestore, 'users'),
                    where('email', '==', emailLower)
                );
                const querySnapshot = await getDocs(q);
                invitedDoc = querySnapshot.docs.find(d => d.data().status === 'pending_invitation');
            }

            if (invitedDoc) {
                // FOUND PENDING INVITATION
                const invitedData = invitedDoc.data();
                const invitedRef = invitedDoc.ref;
                const companyId = invitedRef.parent.parent?.id;

                if (companyId) {
                    console.log(`[Bootstrap] Linking to existing company: ${companyId}`);

                    const batch = writeBatch(firestore);

                    // 1. Create root user profile linked to this company
                    batch.set(userRef, {
                        uid: user.uid,
                        email: user.email,
                        name: name,
                        companyId: companyId,
                        role: invitedData.role || 'employee', // Normalize role
                        permissions: invitedData.permissions || [], // Critical: Include permissions!
                        plan: 'free',
                        planExpires: null,
                        createdAt: serverTimestamp(),
                    });

                    // 2. Remove pending invite doc
                    batch.delete(invitedRef);

                    // 3. Create real user doc in company
                    const newCompanyUserRef = doc(firestore, 'companies', companyId, 'users', user.uid);
                    batch.set(newCompanyUserRef, {
                        ...invitedData,
                        uid: user.uid,
                        name: name, // User might have used a different name on signup
                        status: 'active',
                        joinedAt: serverTimestamp(),
                    });

                    await batch.commit();
                    console.log("[Bootstrap] Successfully joined company.");
                    return;
                }
            }
        } catch (inviteError) {
            console.warn("[Bootstrap] Invite check failed (continuing to fresh signup):", inviteError);
        }

        // --- STANDARD NEW USER FLOW (No Invite Found OR Invite Check Failed) ---

        // CRITICAL FIX: If the user already exists in Firestore, DO NOT overwrite their profile.
        // This was previously causing manual changes (like plan/role) to be reverted.
        if (userSnap.exists()) {
            console.log(`[Bootstrap] User ${user.uid} already exists and no invite found. Skipping initialization.`);
            return;
        }

        // Default to FREE plan for completely NEW users.
        // Business users will be prompted to "Create Company" later via Onboarding.

        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            name: name,
            companyId: null,
            role: 'free_user',
            plan: 'free',
            planExpires: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        console.log(`[Bootstrap] Created free user profile: ${user.uid}`);

    } catch (error) {
        console.error("Error during user bootstrapping:", error);
    }
};
