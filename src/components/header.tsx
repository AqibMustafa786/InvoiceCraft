
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, ChevronDown, FileText, Gem, Home, Shield, FilePlus, Tag, Book, X as XIcon } from 'lucide-react';
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
]

const generalToolsLinks = [
    { href: "/create-invoice", label: "Create Invoice", description: "Generate professional invoices for your clients.", icon: <FilePlus /> },
    { href: "/create-estimate", label: "Create Estimate", description: "Provide detailed cost estimates for projects.", icon: <FilePlus /> },
    { href: "/create-quote", label: "Create Quote", description: "Offer fixed-price quotations for your services.", icon: <FilePlus /> },
    { href: "/create-insurance", label: "Create Insurance", description: "Generate insurance documents and certificates.", icon: <Shield /> },
]

function NavLink({ href, label, isActive }: { href: string, label: string, isActive: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "relative block px-3 py-2 transition text-sm font-medium",
                isActive ? "text-primary" : "text-foreground hover:text-primary"
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
        <header className="sticky top-4 z-50 my-4 mx-4 border rounded-full border-border bg-background/95 backdrop-blur-sm px-4">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
                    </Link>
                </div>
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
                                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="flex-grow my-2 px-6">
                                <nav className="grid gap-2 text-lg font-medium">
                                    {[...mainNavLinks, ...generalToolsLinks.map(l => ({href: l.href, label: l.label}))].map(link => (
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
                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
                    </Link>
                </div>


                {/* Desktop: Centered Navigation */}
                <nav className="hidden md:flex flex-1 items-center justify-center space-x-1">
                    {mainNavLinks.map(link => (
                        <NavLink key={link.href} href={link.href} label={link.label} isActive={pathname === link.href} />
                    ))}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="px-3 py-2 flex items-center gap-1 text-sm font-medium focus-visible:ring-0"
                        >
                          Tools
                          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-80 p-4">
                        <div className="grid grid-cols-1 gap-2">
                          {generalToolsLinks.map(link => (
                            <Link href={link.href} key={link.href}>
                              <div className="flex items-start gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50">
                                <div className="p-2 bg-primary/10 text-primary rounded-md">
                                  {React.cloneElement(link.icon, {className: 'h-5 w-5'})}
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-sm text-foreground">{link.label}</p>
                                  <p className="text-xs text-muted-foreground">{link.description}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </nav>

                <div className="flex flex-1 md:flex-initial items-center justify-end gap-2">
                     <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => setOpen(true)}>
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                    </Button>
                    <ModeToggle />
                    <div className="hidden md:block">
                        <AuthNav />
                    </div>
                     <CommandDialog open={open} onOpenChange={setOpen}>
                        <DialogTitle className="sr-only">Search</DialogTitle>
                        <CommandInput placeholder="Type a command or search..." />
                        <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                         <CommandGroup heading="Links">
                            {mainNavLinks.map((link) => (
                                <CommandItem
                                key={link.href}
                                value={link.label}
                                onSelect={() => {
                                    runCommand(() => router.push(link.href))
                                }}
                                >
                                {React.cloneElement(link.icon, {className: 'mr-2 h-4 w-4'})}
                                <span>{link.label}</span>
                                </CommandItem>
                            ))}
                            {generalToolsLinks.map((link) => (
                                <CommandItem
                                key={link.href}
                                value={link.label}
                                onSelect={() => {
                                    runCommand(() => router.push(link.href))
                                }}
                                >
                                {React.cloneElement(link.icon, {className: 'mr-2 h-4 w-4'})}
                                <span>{link.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        </CommandList>
                    </CommandDialog>
                </div>
            </div>
        </header>
    );
}
