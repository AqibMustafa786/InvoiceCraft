'use client';

import { usePathname } from "next/navigation";
import { Greeting } from "@/components/dashboard/greeting";
import { AIChatWidget } from "@/components/ai-chat-widget";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { useUserAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { ArrowLeft, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ModeToggle } from "@/components/mode-toggle";
import { UserProfileNav } from "@/components/dashboard/user-profile-nav";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageProvider } from "@/context/language-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userProfile, isLoading } = useUserAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isLoading && userProfile?.plan === 'Business' && !userProfile.companyId) {
      if (pathname !== '/dashboard/onboarding') {
        router.push('/dashboard/onboarding');
      }
    }
  }, [userProfile, isLoading, pathname, router]);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  // Don't apply this layout to nested client pages like /dashboard/clients/[clientId]
  if (pathname.startsWith('/dashboard/clients/') || pathname.startsWith('/dashboard/analytics')) {
    return <main>{children}</main>
  }

  const sidebarVariants = {
    open: { width: '220px', x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: '56px', x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <LanguageProvider>
      <div className="flex min-h-screen bg-background overflow-hidden h-screen">
        {/* Sidebar for Desktop */}
        {!isMobile && (
          <motion.aside
            layout
            variants={sidebarVariants}
            animate={isSidebarOpen ? 'open' : 'closed'}
            className="relative shrink-0 border-r bg-background/95 backdrop-blur z-20"
          >
            <div className="h-full flex flex-col">
              <SidebarNav isSidebarOpen={isSidebarOpen} />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute -right-3 top-20 h-6 w-6 rounded-full shadow-md z-30 bg-background border"
            >
              {isSidebarOpen ? <PanelLeftClose className="h-3 w-3" /> : <PanelLeftOpen className="h-3 w-3" />}
            </Button>
          </motion.aside>
        )}

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Top Minimal Navigation */}
          <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
            <div className="h-16 px-4 md:px-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Trigger */}
                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-transparent border-none shadow-none w-[280px]">
                      <div className="h-full w-full">
                        <SidebarNav isSidebarOpen={true} />
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
                <Greeting />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to site
                  </Link>
                </Button>
                <ModeToggle />
                <UserProfileNav />
              </div>
            </div>
          </header>

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>

        <AIChatWidget />
      </div>
    </LanguageProvider>
  );
}
