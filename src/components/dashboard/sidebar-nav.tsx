
'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Users, FileQuestion, FilePlus, Home, Tag, Gem, CreditCard, LogOut, Shield, AreaChart } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useFirebase } from "@/firebase";
import { motion, AnimatePresence } from 'framer-motion';

const dashboardNavItems = [
    { href: "/dashboard", tab: "invoices", label: "Invoices", icon: FileText },
    { href: "/dashboard", tab: "estimates", label: "Estimates", icon: FileQuestion },
    { href: "/dashboard", tab: "quotes", label: "Quotes", icon: FilePlus },
    { href: "/dashboard", tab: "insurance", label: "Insurance", icon: Shield },
    { href: "/dashboard", tab: "clients", label: "Clients", icon: Users },
    { href: "/dashboard/analytics", tab: "analytics", label: "Analytics", icon: AreaChart },
];

const mainNavLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/features", label: "Features", icon: Gem },
    { href: "/pricing", label: "Pricing", icon: Tag },
];

interface SidebarNavProps {
    isSidebarOpen: boolean;
}

export function SidebarNav({ isSidebarOpen }: SidebarNavProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'invoices';
    
    const { user, userProfile } = useAuth();
    const { auth } = useFirebase();
    const router = useRouter();

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
        }
        router.push('/login');
    };

    const linkVariants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: -10 },
    };

    return (
        <div className="flex flex-col h-full bg-card rounded-lg border pb-16"> {/* Added padding-bottom */}
            <ScrollArea className="flex-grow">
                <div className="space-y-1 py-4">
                    <div className="px-3 py-2">
                         <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.h2
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-2 px-4 text-xs font-semibold tracking-tight"
                                >
                                    Dashboard
                                </motion.h2>
                            )}
                         </AnimatePresence>
                         <div className="space-y-1">
                            {dashboardNavItems.map((item) => {
                                const isActive = item.href === '/dashboard'
                                    ? pathname === item.href && activeTab === item.tab
                                    : pathname === item.href;
                                return (
                                   <Button 
                                      key={item.href + item.tab}
                                      asChild
                                      variant={isActive ? "secondary" : "ghost"} 
                                      className={cn("w-full justify-start text-xs h-8", isActive && "text-primary", !isSidebarOpen && "justify-center")}
                                    >
                                      <Link href={item.tab ? `${item.href}?tab=${item.tab}`: item.href} title={item.label}>
                                         <item.icon className={cn("h-3.5 w-3.5", isSidebarOpen && "mr-2")} />
                                         <AnimatePresence>
                                            {isSidebarOpen && (
                                                <motion.span variants={linkVariants} initial="closed" animate="open" exit="closed">
                                                    {item.label}
                                                </motion.span>
                                            )}
                                         </AnimatePresence>
                                      </Link>
                                   </Button>
                                )
                            })}
                         </div>
                    </div>
                     <div className="px-3 py-2">
                         <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.h2
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-2 px-4 text-xs font-semibold tracking-tight"
                                >
                                    Pages
                                </motion.h2>
                            )}
                         </AnimatePresence>
                         <div className="space-y-1">
                            {mainNavLinks.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                   <Button 
                                      key={item.href}
                                      asChild
                                      variant={isActive ? "secondary" : "ghost"} 
                                      className={cn("w-full justify-start text-xs h-8", isActive && "text-primary", !isSidebarOpen && "justify-center")}
                                    >
                                      <Link href={item.href} title={item.label}>
                                         <item.icon className={cn("h-3.5 w-3.5", isSidebarOpen && "mr-2")} />
                                         <AnimatePresence>
                                             {isSidebarOpen && (
                                                <motion.span variants={linkVariants} initial="closed" animate="open" exit="closed">
                                                    {item.label}
                                                </motion.span>
                                            )}
                                         </AnimatePresence>
                                      </Link>
                                   </Button>
                                )
                            })}
                         </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
