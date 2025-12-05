
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AuthNav } from './auth-nav'; 
import { useAuth } from '@/context/auth-provider';

const navLinks = [
    { href: "/features", label: "Features" },
    { href: "/create-invoice", label: "Create Invoice" },
    { href: "/create-estimate", label: "Create Estimate" },
    { href: "/create-quote", label: "Create Quote" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
]

function NavLink({ href, label, isActive }: { href: string, label: string, isActive: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "relative block px-3 py-2 transition",
                isActive ? "text-primary" : "hover:text-primary/80"
            )}
        >
            {label}
            {isActive && (
                <motion.span
                    className="absolute inset-x-1 -bottom-0.5 h-0.5 bg-gradient-to-r from-primary to-accent"
                    layoutId="underline"
                />
            )}
        </Link>
    );
}

export function Header() {
    const pathname = usePathname();
    const { user } = useAuth();
    const isAdmin = user?.email === 'aqib2k1@gmail.com';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <Link href="/" className="mr-6 flex items-center gap-2">
                     <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
                    {navLinks.slice(0, 5).map(link => (
                        <NavLink key={link.href} href={link.href} label={link.label} isActive={pathname === link.href} />
                    ))}
                     {isAdmin && <NavLink href="/admin" label="Admin" isActive={pathname === '/admin'} />}
                </nav>

                <div className="flex flex-1 items-center justify-end gap-2">
                    <ModeToggle />
                    {/* Renders the desktop version of AuthNav */}
                    <AuthNav /> 
                </div>
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden ml-4">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col">
                        <SheetHeader>
                            <SheetTitle>
                                <Link href="/" className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
                                </Link>
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex-grow grid gap-4 text-lg font-medium mt-8">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "block py-2 transition",
                                        pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                         <div className='mt-auto border-t pt-6'>
                            <AuthNav isMobile={true} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
