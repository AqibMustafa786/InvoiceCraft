
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Twitter, Github, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname) || pathname.includes('/c/');
  const isDashboard = pathname.startsWith('/dashboard');
  const isToolPage = pathname.startsWith('/create-');
  const showFooter = !isAuthPage && !isDashboard && !isToolPage;

  if (!showFooter) {
    return null;
  }

  return (
    <footer className="border-t border-border/40 bg-transparent">
      <div className="container grid grid-cols-1 gap-12 px-4 py-12 mx-auto md:grid-cols-5 md:px-6">

        {/* Branding Section */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
          </Link>
          <p className="max-w-sm text-muted-foreground">
            Smart, simple, and professional invoicing for modern freelancers and businesses.
          </p>
          <div className="flex gap-3 mt-4">
            <Link href="#" aria-label="Twitter" rel="noopener noreferrer" target="_blank" className="transition-colors text-muted-foreground hover:text-primary">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="GitHub" rel="noopener noreferrer" target="_blank" className="transition-colors text-muted-foreground hover:text-primary">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="LinkedIn" rel="noopener noreferrer" target="_blank" className="transition-colors text-muted-foreground hover:text-primary">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="Instagram" rel="noopener noreferrer" target="_blank" className="transition-colors text-muted-foreground hover:text-primary">
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 gap-8 text-sm md:col-span-3 sm:grid-cols-3">
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wider uppercase text-foreground">Product</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="/features" className="transition-colors text-muted-foreground hover:text-primary">Features</Link>
              <Link href="/pricing" className="transition-colors text-muted-foreground hover:text-primary">Pricing</Link>
              <Link href="/templates" className="transition-colors text-muted-foreground hover:text-primary">Templates</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wider uppercase text-foreground">Company</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="/about" className="transition-colors text-muted-foreground hover:text-primary">About Us</Link>
              <Link href="/blog" className="transition-colors text-muted-foreground hover:text-primary">Blog</Link>
              <Link href="/careers" className="transition-colors text-muted-foreground hover:text-primary">Careers</Link>
              <Link href="/press" className="transition-colors text-muted-foreground hover:text-primary">Press</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wider uppercase text-foreground">Legal</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="/terms" className="transition-colors text-muted-foreground hover:text-primary">Terms of Service</Link>
              <Link href="/privacy" className="transition-colors text-muted-foreground hover:text-primary">Privacy Policy</Link>
              <Link href="/security" className="transition-colors text-muted-foreground hover:text-primary">Security</Link>
              <Link href="/cookies" className="transition-colors text-muted-foreground hover:text-primary">Cookie Policy</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container flex flex-col-reverse sm:flex-row items-center justify-between gap-4 px-4 py-6 mx-auto">
        <p className="text-sm text-center sm:text-left text-muted-foreground">
          © {new Date().getFullYear()} InvoiceCraft. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/help" className="transition-colors text-muted-foreground hover:text-primary">Help Center</Link>
          <Link href="/contact" className="transition-colors text-muted-foreground hover:text-primary">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
