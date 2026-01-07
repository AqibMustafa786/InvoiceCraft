
'use client';

import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { usePathname } from "next/navigation";
import { Greeting } from "@/components/dashboard/greeting";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  if (isMobile) {
    return (
      <div className="px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-4">
          <Greeting />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
               <SidebarNav isSidebarOpen={true} />
            </SheetContent>
          </Sheet>
        </div>
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-8">
      <Greeting />
        <div className="flex gap-x-8 mt-2">
            <motion.aside
              layout
              variants={sidebarVariants}
              animate={isSidebarOpen ? 'open' : 'closed'}
              className="relative shrink-0"
            >
                <SidebarNav isSidebarOpen={isSidebarOpen} />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute top-0 -right-4 rounded-full bg-background shadow-md border-border h-8 w-8 z-10"
                >
                    {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </Button>
            </motion.aside>
            <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
    </div>
  );
}
