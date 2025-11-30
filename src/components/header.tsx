'use client';

import Link from 'next/link';
import { Sun, Moon, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex items-center h-16">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
        </Link>
        <nav className="items-center flex-1 hidden gap-6 text-sm md:flex">
           <Link
            href="/about"
            className="font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            About Me
          </Link>
           <Link
            href="/#features"
            className="font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            Features
          </Link>
           <Link
            href="/pricing"
            className="font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            Pricing
          </Link>
           <Link
            href="/contact"
            className="font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center justify-end flex-1 gap-2">
          <Link href="/create">
            <Button className="hidden sm:flex text-white transition-transform shadow-lg bg-gradient-to-r from-primary to-accent hover:scale-105">
              Get Started
            </Button>
          </Link>
          <Button variant="ghost" size="icon" aria-label="Toggle Theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              <Sun className="w-5 h-5 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-5 h-5 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
