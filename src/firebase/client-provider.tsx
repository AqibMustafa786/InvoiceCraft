
'use client';

import React, { type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { getFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = React.useMemo(() => {
    // Get the singleton instances of Firebase services.
    return getFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Check if Firebase was initialized successfully
  if (!firebaseServices.firebaseApp) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="max-w-md space-y-4 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-red-600">Configuration Error</h2>
          <p className="text-gray-600">
            Firebase has not been initialized correctly. This usually means environment variables are missing.
          </p>
          <div className="rounded bg-gray-100 p-4 text-left text-sm text-gray-800">
            <p className="font-semibold">Required Environment Variables:</p>
            <ul className="mt-2 list-disc pl-5">
              <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
              <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
              <li>...and others</li>
            </ul>
          </div>
          <p className="text-xs text-gray-500">
            Please check your local .env file or Vercel project settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
