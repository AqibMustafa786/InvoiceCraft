
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Twitter, Github, Linkedin, Instagram, Mail, ShieldCheck, CreditCard, Zap, CheckCircle2, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative border-t border-border/40 bg-[#020202] text-white pt-24 pb-12 overflow-hidden"
    >
      {/* Premium Background Mesh */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="container px-4 mx-auto md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-4xl font-black tracking-tighter text-white group-hover:text-primary transition-colors">
                Invoice<span className="text-primary group-hover:text-white">Craft</span>
              </span>
            </Link>
            <p className="max-w-md text-gray-400 text-lg leading-relaxed">
              Empowering the modern American workforce.
              The most advanced invoicing engine for freelancers, agencies, and top-tier contractors across the USA.
            </p>

            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-primary/80">Stay Ahead of the Game</p>
              <div className="flex gap-2 max-w-md">
                <Input
                  placeholder="Enter your business email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-full h-12 px-6 focus:ring-primary focus:border-primary transition-all"
                />
                <Button className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold transition-transform hover:scale-105">
                  Join Beta
                </Button>
              </div>
              <p className="text-[10px] text-gray-500">Join 500+ US founders receiving bi-weekly billing optimizations.</p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Solutions</h3>
                <nav className="flex flex-col space-y-4">
                  <Link href="/features" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Smart Billing
                  </Link>
                  <Link href="/templates" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                    <Palette className="w-3 h-3" /> Design Gallery
                  </Link>
                  <Link href="/pricing" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                    <CreditCard className="w-3 h-3" /> Pricing Plans
                  </Link>
                </nav>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Company</h3>
                <nav className="flex flex-col space-y-4">
                  <Link href="/about" className="text-sm text-gray-400 hover:text-primary transition-colors">Our Mission</Link>
                  <Link href="/blog" className="text-sm text-gray-400 hover:text-primary transition-colors">Growth Blog</Link>
                  <Link href="/contact" className="text-sm text-gray-400 hover:text-primary transition-colors">Direct Support</Link>
                  <Link href="/press" className="text-sm text-gray-400 hover:text-primary transition-colors">Press Kit</Link>
                </nav>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Compliance</h3>
                <nav className="flex flex-col space-y-4">
                  <Link href="/privacy" className="text-sm text-gray-400 hover:text-primary transition-colors">Privacy Shield</Link>
                  <Link href="/terms" className="text-sm text-gray-400 hover:text-primary transition-colors">Service Terms</Link>
                  <Link href="/security" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500/50" /> Secure Data
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="py-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-8">
          <div className="flex items-center gap-6 saturate-0 opacity-40 hover:saturate-100 hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest">Built for USA</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest">PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest">Bank-Level Security</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-primary">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-primary">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-primary">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Final Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
          <p>© {new Date().getFullYear()} InvoiceCraft HQ. All Rights Reserved. PROUDLY BUILT IN THE USA.</p>
          <div className="flex items-center gap-6">
            <Link href="/help" className="hover:text-white transition-colors">Help</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
