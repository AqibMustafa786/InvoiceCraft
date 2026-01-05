
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-provider';
import { signOut } from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User as UserIcon, LogOut, LayoutDashboard, CreditCard } from 'lucide-react';

interface AuthNavProps {
    isMobile?: boolean;
}

export function AuthNav({ isMobile = false }: AuthNavProps) {
    const [isClient, setIsClient] = useState(false);
    const { user, userProfile } = useAuth();
    const { auth } = useFirebase();
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
        }
        router.push('/login');
    };

    if (!isClient) {
        // Return a placeholder to prevent layout shift during server render
        return <div className="h-10 w-40" />; 
    }

    if (user) {
        // --- MOBILE-SPECIFIC VIEW ---
        if (isMobile) {
            return (
                 <div className="flex w-full flex-col gap-2">
                    <Button asChild variant="outline" className="justify-start">
                        <Link href="/dashboard" className="flex items-center gap-2">
                           <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </Link>
                    </Button>
                    {userProfile?.plan === 'business' && (
                        <Button asChild variant="outline" className="justify-start">
                            <Link href="/billing" className="flex items-center gap-2">
                               <CreditCard className="h-4 w-4" /> Billing
                            </Link>
                        </Button>
                    )}
                    <Button onClick={handleLogout} variant="destructive" className="justify-start">
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                </div>
            );
        }

        // --- DESKTOP-SPECIFIC VIEW ---
        return (
             <div className="flex items-center gap-2">
                <Button asChild variant={'ghost'} className="px-4">
                    <Link href="/dashboard">Dashboard</Link>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                                <AvatarFallback>
                                    <UserIcon className="h-6 w-6" />
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        {userProfile?.plan === 'business' && (
                             <DropdownMenuItem asChild>
                                <Link href="/billing">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Billing</span>
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }
    
    // --- Logged-out user view ---
    return (
        <div className={`flex items-center gap-2 ${isMobile ? 'w-full flex-col' : ''}`}>
             <Button asChild variant={'ghost'} className={`px-4 ${isMobile ? 'w-full' : ''}`}>
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild className={`transition-transform hover:scale-105 ${isMobile ? 'w-full' : ''}`}>
                <Link href="/signup">Get Started</Link>
            </Button>
        </div>
    );
}
