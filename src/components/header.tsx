import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-headline">InvoiceCraft</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm flex-1">
           <Link
            href="/#features"
            className="text-muted-foreground transition-colors hover:text-foreground font-medium"
          >
            Features
          </Link>
           <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground font-medium"
          >
            Pricing
          </Link>
           <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground font-medium"
          >
            Blog
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
