
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
import { User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';

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
        // Return a placeholder to prevent layout shift during server render
        return <div className="h-10 w-24" />; 
    }

    if (user) {
        // --- MOBILE-SPECIFIC VIEW ---
        // This renders a simple button layout inside the mobile sheet.
        if (isMobile) {
            return (
                 <div className="flex flex-col gap-4">
                    <Button asChild variant="outline">
                        <Link href="/dashboard" className="flex items-center gap-2">
                           <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </Link>
                    </Button>
                    <Button onClick={handleLogout} variant="destructive">
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                </div>
            );
        }

        // --- DESKTOP-SPECIFIC VIEW ---
        // This renders the DropdownMenu and is hidden on mobile screens.
        // It will not be mounted inside the Sheet, preventing the conflict.
        return (
            <div className="hidden md:block">
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
    // Renders login/signup buttons, adapted for mobile or desktop.
    return (
        <div className={`flex items-center gap-2 ${isMobile ? 'flex-col' : 'hidden md:flex'}`}>
             <Button asChild variant={isMobile ? 'outline' : 'ghost'}>
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="text-white transition-transform shadow-lg bg-gradient-to-r from-primary to-accent hover:scale-105">
                <Link href="/signup">Get Started</Link>
            </Button>
        </div>
    );
}
