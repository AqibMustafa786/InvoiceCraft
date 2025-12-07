
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, getDoc } from 'firebase/firestore';

interface UserProfile {
  companyId: string;
  plan: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes = ['/dashboard', '/create-invoice', '/create-estimate', '/create-quote', '/create-insurance', '/billing'];
const publicAuthRoutes = ['/login', '/signup', '/forgot-password'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, firestore } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user && firestore) {
        // User is logged in, fetch their profile
        const userDocRef = doc(firestore, 'users', user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            // Handle case where user exists in Auth but not Firestore
            setUserProfile(null);
            console.warn("User profile not found in Firestore for UID:", user.uid);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        // User is logged out
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  useEffect(() => {
    if (isLoading) return;

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isPublicAuthRoute = publicAuthRoutes.includes(pathname);

    if (!user && isProtectedRoute) {
      router.push('/login');
    }

    if (user && isPublicAuthRoute) {
      router.push('/dashboard');
    }
  }, [user, isLoading, pathname, router]);

  // The initial loading state should cover auth and profile fetch
  if (isLoading) {
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
