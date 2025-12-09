
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, ChevronDown } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AuthNav } from './auth-nav'; 
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { DialogTitle } from './ui/dialog';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mainNavLinks = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
]

const generalToolsLinks = [
    { href: "/create-invoice", label: "Create Invoice" },
    { href: "/create-estimate", label: "Create Estimate" },
    { href: "/create-quote", label: "Create Quote" },
    { href: "/create-insurance", label: "Create Insurance" },
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

export function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

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

    return (
        <header className="sticky top-0 z-50 w-full">
            <div className="container my-4 flex h-16 items-center rounded-2xl border border-border/40 bg-background/80 shadow-lg backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center justify-start">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
                    </Link>
                </div>

                <nav className="hidden md:flex flex-1 items-center justify-center space-x-1 text-sm font-medium">
                    {mainNavLinks.map(link => (
                        <NavLink key={link.href} href={link.href} label={link.label} isActive={pathname === link.href} />
                    ))}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="px-3 py-2 flex items-center gap-1 hover:text-accent focus-visible:ring-0">
                          General
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {generalToolsLinks.map(link => (
                          <DropdownMenuItem key={link.href} asChild>
                            <Link href={link.href}>{link.label}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                </nav>

                <div className="flex flex-1 items-center justify-end gap-2">
                     <Button variant="outline" className="relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64" onClick={() => setOpen(true)}>
                        <Search className="h-4 w-4 mr-2" />
                        <span className="hidden lg:inline-flex">Search...</span>
                        <span className="inline-flex lg:hidden">Search...</span>
                        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </Button>
                    <ModeToggle />
                    <AuthNav />
                     <CommandDialog open={open} onOpenChange={setOpen}>
                        <DialogTitle className="sr-only">Search</DialogTitle>
                        <CommandInput placeholder="Type a command or search..." />
                        <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            <CommandItem>
                            <span>Create Invoice</span>
                            </CommandItem>
                            <CommandItem>
                            <span>Dashboard</span>
                            </CommandItem>
                            <CommandItem>
                            <span>Pricing</span>
                            </CommandItem>
                        </CommandGroup>
                        </CommandList>
                    </CommandDialog>
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
                        <nav className="flex-grow grid gap-4 text-lg font-medium mt-8">
                             {mainNavLinks.map(link => (
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
                             {generalToolsLinks.map(link => (
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
