
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;
let firestoreDb: ReturnType<typeof getFirestore> | null = null;

function initializeAdminApp() {
    if (getApps().length > 0) {
        if (!adminApp) {
          adminApp = getApps()[0];
          firestoreDb = getFirestore(adminApp);
        }
        return { db: firestoreDb, adminApp };
    }

    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
        console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK features will be disabled.');
        return { db: null, adminApp: null };
    }

    try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        adminApp = initializeApp({
            credential: cert(serviceAccount),
        });
        firestoreDb = getFirestore(adminApp);
    } catch (e: any) {
        console.error("Failed to parse Firebase service account key or initialize app:", e.message);
        return { db: null, adminApp: null };
    }
    
    return { db: firestoreDb, adminApp };
}

export { initializeAdminApp };

    