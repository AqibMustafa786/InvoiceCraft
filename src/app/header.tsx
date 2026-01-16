'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, ChevronDown, FileText, Gem, Shield, FilePlus, Tag, Book, X as XIcon, DraftingCompass, FileQuestion, LayoutDashboard } from 'lucide-react';
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
    if (pathname.startsWith('/dashboard') || ['/login', '/signup', '/forgot-password'].includes(pathname)) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
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
                                     <Link href="/" className="flex items-center gap-2 text-2xl font-bold" onClick={() => setIsSheetOpen(false)}>
                                        <span className="text-2xl font-bold text-primary">InvoiceCraft</span>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="flex-grow my-2 px-6">
                                <nav className="grid gap-2 text-lg font-medium">
                                    {[...mainNavLinks, ...toolsNavLinks].map(link => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                "flex items-center gap-3 py-2 transition-colors",
                                                pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
                                            )}
                                            onClick={() => setIsSheetOpen(false)}
                                        >
                                            {React.cloneElement(link.icon, { className: "h-5 w-5" })} {link.label}
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
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                        <span className="text-2xl font-bold text-primary">InvoiceCraft</span>
                    </Link>
                </div>

                {/* Desktop: Logo */}
                <div className="mr-auto hidden md:flex">
                     <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                       <span className="text-2xl font-bold text-primary">InvoiceCraft</span>
                    </Link>
                </div>

                {/* Desktop: Centered Navigation */}
                <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center rounded-full border bg-background/70 px-2 py-1 backdrop-blur-md">
                    {mainNavLinks.map(link => (
                        <NavLink key={link.href} href={link.href} label={link.label} />
                    ))}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" className="relative flex items-center gap-1 px-3 py-2 transition text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-primary">
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
                </nav>

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
