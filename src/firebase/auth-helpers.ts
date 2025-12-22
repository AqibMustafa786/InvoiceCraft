
'use client';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  UserCredential,
  User
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config';

// Initialize Firebase app if it hasn't been already
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);


/**
 * Creates a user profile and company in Firestore if they don't already exist.
 * This is used for both social sign-ups and email/password sign-ups.
 * @param user The Firebase User object.
 * @param displayName The name to use for the user and their company.
 */
export const createProfileAndCompany = async (user: User, displayName?: string | null) => {
    if (!user) throw new Error("User object is null.");
    
    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // If user profile already exists, do nothing.
    if (userSnap.exists()) {
        return;
    }
    
    const name = displayName || user.displayName || user.email?.split('@')[0] || 'New User';
    
    const companyId = `COMP_${user.uid.substring(0, 8).toUpperCase()}`;

    // Create user profile in the global users collection
    await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: name,
        companyId: companyId,
        role: 'admin',
        plan: 'free',
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
    await setDoc(doc(firestore, `companies/${companyId}/users`, user.uid), {
         uid: user.uid,
         email: user.email,
         name: name,
         role: 'admin',
         createdAt: serverTimestamp(),
    });
};


const socialLogin = async (provider: GoogleAuthProvider | GithubAuthProvider | FacebookAuthProvider): Promise<UserCredential> => {
    try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        
        // Check if it's a new user and create their profile/company if needed
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
             await createProfileAndCompany(user);
        }
        
        return userCredential;
    } catch (error) {
        console.error("Social login error:", error);
        throw error;
    }
};

export const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return socialLogin(provider);
};

export const handleGithubSignIn = () => {
    const provider = new GithubAuthProvider();
    return socialLogin(provider);
};

export const handleFacebookSignIn = () => {
    const provider = new FacebookAuthProvider();
    return socialLogin(provider);
};
