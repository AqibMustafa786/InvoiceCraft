
'use client';

import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { usePathname } from "next/navigation";
import { Greeting } from "@/components/dashboard/greeting";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Don't apply this layout to nested client pages like /dashboard/clients/[clientId]
  if (pathname.startsWith('/dashboard/clients/')) {
    return <main className="px-4 md:px-8">{children}</main>
  }
  
  const sidebarVariants = {
    open: { width: '220px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: '56px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };
  
  const buttonVariants = {
      open: { left: '220px', x: '-50%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
      closed: { left: '56px', x: '-50%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  }

  return (
    <div className="px-4 md:px-8 relative">
      <Greeting />
        <div className="flex gap-x-8 mt-2 relative">
            <motion.aside
              variants={sidebarVariants}
              animate={isSidebarOpen ? 'open' : 'closed'}
              className="relative"
            >
                <SidebarNav isSidebarOpen={isSidebarOpen} />
            </motion.aside>
             <motion.div
                variants={buttonVariants}
                animate={isSidebarOpen ? 'open' : 'closed'}
                className="absolute top-0 z-10"
              >
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="rounded-full bg-background shadow-md border-border"
                >
                    {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </Button>
            </motion.div>
            <main className="flex-1">{children}</main>
        </div>
    </div>
  );
}
