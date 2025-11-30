import Link from 'next/link';
import { Twitter, Github, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container grid grid-cols-1 gap-12 px-4 py-12 mx-auto md:grid-cols-5 md:px-6">
        
        {/* Branding Section */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
          </Link>
          <p className="max-w-sm text-muted-foreground">
            Smart, simple, and professional invoicing for modern freelancers and businesses.
          </p>
           <div className="flex gap-3 mt-4">
            <Link href="#" aria-label="Twitter" rel="noopener noreferrer" target="_blank" className="transition-colors text-muted-foreground hover:text-foreground">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="GitHub" rel="noopener noreferrer" target="_blank" className="transition-colors text-muted-foreground hover:text-foreground">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="LinkedIn" rel="noopener noreferrer" target="_blank" className="transition-colors text-muted-foreground hover:text-foreground">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="Instagram" rel="noopener noreferrer" target="_blank" className="transition-colors text-muted-foreground hover:text-foreground">
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Product</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/features" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Features</Link>
              <Link href="/create" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Templates</Link>
              <Link href="/pricing" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Pricing</Link>
              <Link href="/faq" className="text-sm transition-colors text-muted-foreground hover:text-foreground">FAQs</Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Company</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/about" className="text-sm transition-colors text-muted-foreground hover:text-foreground">About us</Link>
              <Link href="/contact" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Contact us</Link>
              <Link href="/blog" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Blogs</Link>
              <Link href="/press" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Press</Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/security" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Security</Link>
              <Link href="/privacy" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Privacy policy</Link>
              <Link href="/terms" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Terms & conditions</Link>
              <Link href="/cookies" className="text-sm transition-colors text-muted-foreground hover:text-foreground">Cookies</Link>
            </nav>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 py-6 mx-auto sm:flex-row md:px-6">
            <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} InvoiceCraft. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
