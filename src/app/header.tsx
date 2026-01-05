
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, ChevronDown, FileText, Gem, Home, Shield, FilePlus, Tag, Book, X as XIcon, Database } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AuthNav } from './auth-nav'; 
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { DialogTitle } from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from './ui/scroll-area';

const mainNavLinks = [
    { href: "/features", label: "Features", icon: <Gem /> },
    { href: "/pricing", label: "Pricing", icon: <Tag /> },
    { href: "/templates", label: "Templates", icon: <Book /> },
    { href: "/#", label: "Resources", icon: <Book /> },
    { href: "/#", label: "Docs", icon: <FileText /> },
]

function NavLink({ href, label, isActive }: { href: string, label: string, isActive: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "relative block px-3 py-2 transition text-sm font-medium",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-primary-foreground"
            )}
        >
            {label}
        </Link>
    );
}

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    // Do not render the header on dashboard pages or specific auth pages
    if (pathname.startsWith('/dashboard')) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
            <div className="container flex h-16 items-center">
                {/* Mobile: Hamburger Menu */}
                 <div className="md:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex w-full flex-col p-0 sm:max-w-xs">
                            <SheetHeader className="p-6 pb-4">
                                <SheetTitle>
                                     <Link href="/" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                                        <Database className="h-6 w-6" />
                                        <span className="text-xl font-bold">evervault</span>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="flex-grow my-2 px-6">
                                <nav className="grid gap-2 text-lg font-medium">
                                    {[...mainNavLinks].map(link => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                "block py-2 transition-colors",
                                                pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
                                            )}
                                            onClick={() => setIsSheetOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                            </ScrollArea>
                            <div className='mt-auto border-t p-6'>
                                <AuthNav isMobile={true} />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                {/* Mobile: Centered Logo */}
                <div className="flex md:hidden flex-1 justify-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Database className="h-6 w-6" />
                        <span className="text-xl font-bold">evervault</span>
                    </Link>
                </div>
                {/* Desktop: Logo */}
                <div className="mr-auto hidden md:flex">
                     <Link href="/" className="flex items-center gap-2">
                        <Database className="h-6 w-6" />
                        <span className="text-xl font-bold">evervault</span>
                    </Link>
                </div>


                {/* Desktop: Centered Navigation */}
                <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center rounded-full border bg-zinc-800/30 px-2 py-1 backdrop-blur-sm">
                    {mainNavLinks.map(link => (
                        <NavLink key={link.href} href={link.href} label={link.label} isActive={pathname === link.href} />
                    ))}
                </nav>

                <div className="flex flex-1 md:flex-initial items-center justify-end gap-4">
                    <div className="hidden md:block">
                        <AuthNav />
                    </div>
                </div>
            </div>
        </header>
    );
}
