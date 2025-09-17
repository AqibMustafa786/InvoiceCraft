import Link from 'next/link';
import { Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
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
            href="/blog"
            className="font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            Blog
          </Link>
           <Link
            href="/contact"
            className="font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center justify-end flex-1 gap-4">
          <Button asChild className="text-white transition-transform shadow-lg bg-gradient-to-r from-primary to-accent hover:scale-105">
            <Link href="/create">Get Started</Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Toggle Theme">
              <Sun className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
