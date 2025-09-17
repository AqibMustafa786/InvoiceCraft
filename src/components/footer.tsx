import Link from 'next/link';
import { FileText, Twitter, Github, Linkedin, Instagram } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-secondary border-t text-secondary-foreground">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 py-12 px-4 md:px-6">
        
        {/* Branding Section */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline text-foreground">InvoiceCraft</span>
          </Link>
          <p className="text-muted-foreground max-w-sm">
            Smart, simple, and professional invoicing for modern freelancers and businesses.
          </p>
           <div className="flex gap-3 mt-4">
            <Link href="#" aria-label="Twitter" rel="noopener noreferrer" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="GitHub" rel="noopener noreferrer" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="LinkedIn" rel="noopener noreferrer" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Instagram" rel="noopener noreferrer" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/#features" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Features</Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Pricing</Link>
              <Link href="/create" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Create Invoice</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/about" className="text-muted-foreground hover:text-foreground text-sm transition-colors">About Us</Link>
              <Link href="/blog" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Blog</Link>
              <Link href="/careers" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Careers</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/help" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Help Center</Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Contact Us</Link>
              <Link href="/faq" className="text-muted-foreground hover:text-foreground text-sm transition-colors">FAQs</Link>
            </nav>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto py-6 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
                &copy; {new Date().getFullYear()} InvoiceCraft. All rights reserved.
            </p>
            <div className="flex gap-4">
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Terms of Service</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
