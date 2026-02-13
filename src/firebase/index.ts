


import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

let firebaseApp: FirebaseApp;
export let auth: ReturnType<typeof getAuth>;
export let firestore: ReturnType<typeof getFirestore>;

function initializeFirebase() {
  if (!getApps().length) {
    if (process.env.NODE_ENV === "production") {
      try {
        firebaseApp = initializeApp();
      } catch (e) {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
        firebaseApp = initializeApp(firebaseConfig);
      }
    } else {
      // Force config in dev to avoid issues
      firebaseApp = initializeApp(firebaseConfig);
    }
  } else {
    firebaseApp = getApp();
  }
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);
}

// Initialize on first import
initializeFirebase();

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getFirebase() {
  // This function now simply returns the already initialized services.
  return { firebaseApp, auth, firestore };
}


export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

