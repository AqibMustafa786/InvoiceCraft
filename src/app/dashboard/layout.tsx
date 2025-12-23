
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

  return (
    <div className="px-4 md:px-8">
      <Greeting />
        <div className="flex gap-x-8 mt-2">
            <motion.aside
              variants={sidebarVariants}
              animate={isSidebarOpen ? 'open' : 'closed'}
              className="relative"
            >
                <SidebarNav isSidebarOpen={isSidebarOpen} />
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="rounded-full bg-secondary hover:bg-secondary/80"
                    >
                        {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                    </Button>
                </div>
            </motion.aside>
            <main className="flex-1">{children}</main>
        </div>
    </div>
  );
}
