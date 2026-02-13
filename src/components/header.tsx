'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, ChevronDown, FileText, Gem, Shield, FilePlus, Tag, Book, X as XIcon, DraftingCompass, FileQuestion, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
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
]

const toolsNavLinks = [
    { href: "/create-invoice", label: "Invoice", icon: <FileText className="h-4 w-4" /> },
    { href: "/create-estimate", label: "Estimate", icon: <DraftingCompass className="h-4 w-4" /> },
    { href: "/create-quote", label: "Quote", icon: <FileQuestion className="h-4 w-4" /> },
    { href: "/create-insurance", label: "Insurance", icon: <Shield className="h-4 w-4" /> },
]

function NavLink({ href, label }: { href: string, label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "relative block px-3 py-2 transition text-sm font-medium",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
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
    const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

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

    const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname) || pathname.includes('/c/');
    const isDashboard = pathname.startsWith('/dashboard');
    const isToolPage = pathname.startsWith('/create-');
    const isMinimalHeader = isDashboard || isToolPage;

    // Do not render the header on specific auth pages, dashboard, or tool pages
    if (isAuthPage || isDashboard || isToolPage) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm">
            <CommandDialog open={open} onOpenChange={setOpen}>
                <DialogTitle className="sr-only">Search</DialogTitle>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => runCommand(() => router.push('/create-invoice'))}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Create Invoice</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/create-estimate'))}>
                            <FilePlus className="mr-2 h-4 w-4" />
                            <span>Create Estimate</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Go to Dashboard</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>

            <div className="container flex h-14 items-center">
                {/* Mobile: Hamburger Menu or Back Button */}
                <div className="md:hidden">
                    {isMinimalHeader ? (
                        <Link href="/" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                            Back
                        </Link>
                    ) : (
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 bg-transparent border-none shadow-none w-[300px]">
                                <div className="flex flex-col h-full bg-white/95 dark:bg-background/95 backdrop-blur-xl border-r border-zinc-200 dark:border-border/50 shadow-2xl transition-all duration-300">
                                    <div className="flex items-center h-16 px-6 border-b border-zinc-200 dark:border-border/50">
                                        <Link href="/" className="flex items-center gap-3" onClick={() => setIsSheetOpen(false)}>
                                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
                                                IC
                                            </div>
                                            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-foreground">
                                                InvoiceCraft
                                            </span>
                                        </Link>
                                    </div>
                                    <ScrollArea className="flex-grow py-6">
                                        <nav className="grid gap-1 px-4">
                                            {[...mainNavLinks, ...toolsNavLinks].map(link => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
                                                        pathname === link.href
                                                            ? "bg-primary/10 text-primary font-semibold shadow-sm"
                                                            : "text-zinc-600 dark:text-muted-foreground hover:bg-zinc-100 dark:hover:bg-primary/5 hover:text-primary hover:shadow-sm"
                                                    )}
                                                    onClick={() => setIsSheetOpen(false)}
                                                >
                                                    {React.cloneElement(link.icon as React.ReactElement, { className: cn("h-5 w-5", pathname === link.href ? "text-primary" : "text-zinc-400 dark:text-muted-foreground group-hover:text-primary") })}
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </nav>
                                    </ScrollArea>
                                    <div className='mt-auto border-t border-zinc-200 dark:border-border/50 p-6 bg-zinc-50/50 dark:bg-muted/20'>
                                        <AuthNav isMobile={true} />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}
                </div>
                {/* Mobile: Centered Logo */}
                <div className="flex md:hidden flex-1 justify-center">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                        <span className="text-2xl font-bold text-primary">InvoiceCraft</span>
                    </Link>
                </div>

                {/* Desktop: Logo */}
                <div className="mr-auto hidden md:flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                        <span className="text-2xl font-bold text-primary">InvoiceCraft</span>
                    </Link>
                    {isMinimalHeader && (
                        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors border-l pl-4 border-border ml-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to site
                        </Link>
                    )}
                </div>

                {/* Desktop: Centered Navigation */}
                {!isMinimalHeader && (
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center rounded-full border bg-background/70 px-2 py-1 backdrop-blur-md">
                        {mainNavLinks.map(link => (
                            <NavLink key={link.href} href={link.href} label={link.label} />
                        ))}
                        <div
                            onMouseEnter={() => setIsToolsMenuOpen(true)}
                            onMouseLeave={() => setIsToolsMenuOpen(false)}
                        >
                            <DropdownMenu open={isToolsMenuOpen} onOpenChange={setIsToolsMenuOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative flex items-center gap-1 px-3 py-2 transition text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent data-[state=open]:bg-transparent focus:bg-transparent">
                                        Tools <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {toolsNavLinks.map(link => (
                                        <DropdownMenuItem key={link.href} asChild>
                                            <Link href={link.href} className="flex items-center gap-2">
                                                {link.icon}
                                                {link.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </nav>
                )}

                <div className="flex flex-1 md:flex-initial items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                    </Button>
                    <ModeToggle />
                    <div className="hidden md:block">
                        <AuthNav />
                    </div>
                </div>
            </div>
        </header>
    );
}