
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AuthNav } from './auth-nav'; 
import { useAuth } from '@/context/auth-provider';
import { Input } from './ui/input';

const navLinks = [
    { href: "/features", label: "Features" },
    { href: "/create-invoice", label: "Create Invoice" },
    { href: "/create-estimate", label: "Create Estimate" },
    { href: "/create-quote", label: "Create Quote" },
    { href: "/create-insurance", label: "Create Insurance" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
]

function NavLink({ href, label, isActive }: { href: string, label: string, isActive: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "relative block px-3 py-2 transition",
                isActive ? "text-primary" : "hover:text-accent"
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

export function Header({ filters, onFiltersChange }: { filters?: any, onFiltersChange?: (filters: any) => void }) {
    const pathname = usePathname();
    const { user } = useAuth();
    const isDashboard = pathname === '/dashboard';

    return (
        <header className="sticky top-0 z-50 w-full">
            <div className="container my-4 flex h-16 items-center rounded-2xl border border-border/40 bg-background/80 shadow-lg backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
                <Link href="/" className="mr-6 flex items-center gap-2">
                     <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
                </Link>

                <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
                    {navLinks.map(link => (
                        <NavLink key={link.href} href={link.href} label={link.label} isActive={pathname === link.href} />
                    ))}
                </nav>

                <div className="flex flex-1 items-center justify-end gap-2">
                    {isDashboard && onFiltersChange && (
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search clients..." 
                                className="pl-10 w-48"
                                value={filters.clientName}
                                onChange={(e) => onFiltersChange({ ...filters, clientName: e.target.value })}
                            />
                        </div>
                    )}
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
                    <SheetContent side="left" className="flex w-full flex-col sm:max-w-sm">
                        <SheetHeader>
                            <SheetTitle>
                                <Link href="/" className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
                                </Link>
                            </SheetTitle>
                        </SheetHeader>
                        {isDashboard && onFiltersChange && (
                            <div className="relative mt-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search clients..."
                                    className="pl-10"
                                    value={filters.clientName}
                                    onChange={(e) => onFiltersChange({ ...filters, clientName: e.target.value })}
                                />
                            </div>
                        )}
                        <nav className="flex-grow grid gap-4 text-lg font-medium mt-8">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "block py-2 transition",
                                        pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground hover:text-accent"
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
