
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AuthNav } from './auth-nav'; // Import the new client component

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

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <Link href="/" className="mr-6 flex items-center gap-2">
                     <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
                    {navLinks.map(link => (
                        <NavLink key={link.href} href={link.href} label={link.label} isActive={pathname === link.href} />
                    ))}
                </nav>

                <div className="flex flex-1 items-center justify-end gap-2">
                    <ModeToggle />
                    <AuthNav /> 
                </div>
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden ml-4">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium mt-8">
                            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
                            </Link>
                            {navLinks.map(link => (
                                <NavLink key={link.href} href={link.href} label={link.label} isActive={pathname === link.href} />
                            ))}
                            <div className='flex flex-col gap-4 mt-4'>
                                 <AuthNav isMobile={true} />
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
