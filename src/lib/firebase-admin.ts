
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const missingVars = [];
        if (!process.env.FIREBASE_PROJECT_ID) missingVars.push('FIREBASE_PROJECT_ID');
        if (!process.env.FIREBASE_CLIENT_EMAIL) missingVars.push('FIREBASE_CLIENT_EMAIL');
        if (!process.env.FIREBASE_PRIVATE_KEY) missingVars.push('FIREBASE_PRIVATE_KEY');

        if (missingVars.length > 0) {
            console.error(`Creating Firebase Admin instance failed. MISSING VARIABLES: ${missingVars.join(', ')}`);
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    } catch (error: any) {
        if (error.code === 'app/already-exists') {
            // Ignore if already initialized
        } else {
            console.error('Firebase admin initialization error', error);
        }
    }
}

// Export safe instances that might be null
export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminFirestore = admin.apps.length ? admin.firestore() : null;
