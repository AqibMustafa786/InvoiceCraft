
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { bootstrapUser } from '@/firebase/auth-helpers';

import { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean; // This will now represent the combined loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes = ['/dashboard', '/create-invoice', '/create-estimate', '/create-quote', '/create-insurance', '/billing'];
const publicAuthRoutes = ['/login', '/signup', '/forgot-password'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, firestore } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Single loading state
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    if (!auth || !firestore) {
      // Services not available (e.g. missing API keys)
      // client-provider.tsx should handle the UI, but we must prevent crash here.
      setIsLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      // Clean up previous profile listener
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        // Bootstrap user on first login or if data is missing
        await bootstrapUser(firebaseUser);

        const userDocRef = doc(firestore, 'users', firebaseUser.uid);

        // Listen for real-time profile changes
        unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile({ ...docSnap.data(), uid: docSnap.id } as UserProfile);
          } else {
            console.warn("User profile not found in Firestore for UID:", firebaseUser.uid);
            setUserProfile(null);
          }
          setIsLoading(false);
        }, (error) => {
          console.error("Error listening to user profile:", error);
          setUserProfile(null);
          setIsLoading(false);
        });
      } else {
        // User is not logged in
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [auth, firestore]);

  useEffect(() => {
    // This effect handles redirection logic based on the final loading state
    if (isLoading) return;

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isPublicAuthRoute = publicAuthRoutes.includes(pathname);

    if (!user && isProtectedRoute) {
      router.push('/login');
    }

    if (user && isPublicAuthRoute) {
      router.push('/');
    }
  }, [user, isLoading, pathname, router]);

  // If loading, show a skeleton screen on the relevant pages.
  // Otherwise, allow children to render. The redirection effect above will handle unauthorized access.
  if (isLoading && protectedRoutes.some(route => pathname.startsWith(route))) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-16 w-full" />
          <div className="flex-grow p-4">
            <Skeleton className="h-12 w-1/3 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const useUserAuth = useAuth;
