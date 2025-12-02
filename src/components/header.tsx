'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { signOut } from 'firebase/auth';
import { useFirebase } from '@/firebase';

const navLinks = [
    { href: "/features", label: "Features" },
    { href: "/create-invoice", label: "Create Invoice" },
    { href: "/create-estimate", label: "Create Estimate" },
    { href: "/create-quote", label: "Create Quote" },
    { href: "/create-insurance", label: "Create Insurance" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
]

function NavLink({ href, label }: { href: string, label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "transition-colors hover:text-foreground/80",
                isActive ? "text-foreground font-semibold" : "text-foreground/60"
            )}
        >
            {label}
        </Link>
    );
}

export function Header() {
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

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <Link href="/" className="mr-6 flex items-center gap-2">
                     <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    {navLinks.map(link => (
                        <NavLink key={link.href} href={link.href} label={link.label} />
                    ))}
                </nav>

                <div className="flex flex-1 items-center justify-end gap-2">
                    <ModeToggle />
                     {isClient && (
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
                    )}
                </div>
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden ml-4">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        {isClient && (
                            <nav className="grid gap-6 text-lg font-medium mt-8">
                                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
                                </Link>
                                {navLinks.map(link => (
                                    <NavLink key={link.href} href={link.href} label={link.label} />
                                ))}
                                <div className='flex flex-col gap-4 mt-4'>
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
                                </div>
                            </nav>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
