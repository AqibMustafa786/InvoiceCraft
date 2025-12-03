
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-provider';
import { signOut } from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { useEffect, useState } from 'react';

interface AuthNavProps {
    isMobile?: boolean;
}

export function AuthNav({ isMobile = false }: AuthNavProps) {
    const [isClient, setIsClient] = useState(false);
    const { user } = useAuth();
    const { auth } = useFirebase();
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    if (!isClient) {
        return null; // Don't render on the server
    }

    if (isMobile) {
        return (
             <>
                {user ? (
                    <>
                        <Button asChild variant="outline">
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                        <Button onClick={handleLogout}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Button asChild variant="outline">
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </>
                )}
            </>
        )
    }

    return (
        <div className='hidden sm:flex items-center gap-2'>
            {user ? (
                <>
                        <Button asChild variant="ghost">
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button onClick={handleLogout} variant="outline">Logout</Button>
                </>
            ) : (
                <>
                    <Button asChild variant="ghost">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="text-white transition-transform shadow-lg bg-gradient-to-r from-primary to-accent hover:scale-105">
                        <Link href="/signup">Get Started</Link>
                    </Button>
                </>
            )}
        </div>
    );
}
