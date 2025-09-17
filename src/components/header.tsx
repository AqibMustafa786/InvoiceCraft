import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg border-white/20">
      <div className="container flex items-center h-16">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <FileText className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold font-headline">InvoiceCraft</span>
        </Link>
        <nav className="flex items-center flex-1 gap-6 text-sm">
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/create">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
