
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;
let firestoreDb: ReturnType<typeof getFirestore>;

function initializeAdminApp() {
    if (getApps().length > 0) {
        adminApp = getApps()[0];
        firestoreDb = getFirestore(adminApp);
        return { db: firestoreDb, adminApp };
    }

    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }

    try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        adminApp = initializeApp({
            credential: cert(serviceAccount),
        });
        firestoreDb = getFirestore(adminApp);
    } catch (e: any) {
        console.error("Failed to parse Firebase service account key or initialize app:", e.message);
        throw new Error("Firebase Admin SDK initialization failed.");
    }
    
    return { db: firestoreDb, adminApp };
}

export { initializeAdminApp };
