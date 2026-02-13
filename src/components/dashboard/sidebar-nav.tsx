
'use client';

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Users, FileQuestion, FilePlus, Home, Tag, Gem, CreditCard, LogOut, Shield, AreaChart, Edit, Settings } from "lucide-react";
import { useUserAuth } from "@/context/auth-provider";
import { signOut } from "firebase/auth";
import { useFirebase, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { hasAccess } from "@/lib/permissions";
import { useLanguage } from "@/context/language-context";

const dashboardNavItems = [
    { href: "/dashboard", tab: "dashboard", label: "Dashboard", icon: Home, permission: 'view:dashboard' },
    { href: "/dashboard?tab=invoices", tab: "invoices", label: "Invoices", icon: FileText, permission: 'view:invoices' },
    { href: "/dashboard?tab=estimates", tab: "estimates", label: "Estimates", icon: FileQuestion, permission: 'view:estimates' },
    { href: "/dashboard?tab=quotes", tab: "quotes", label: "Quotes", icon: FilePlus, permission: 'view:quotes' },
    { href: "/dashboard?tab=insurance", tab: "insurance", label: "Insurance", icon: Shield, permission: 'view:insurance' },
    { href: "/dashboard?tab=clients", tab: "clients", label: "Clients", icon: Users, permission: 'view:clients' },
    { href: "/dashboard?tab=users", tab: "users", label: "Employees", icon: Users, permission: 'view:employees' },
    { href: "/dashboard/analytics", tab: "analytics", label: "Analytics", icon: AreaChart, permission: 'view:analytics' },
    { href: "/dashboard/tasks", tab: "tasks", label: "Tasks", icon: Tag, permission: 'view:dashboard' },
    { href: "/dashboard/settings", tab: "settings", label: "Settings", icon: Settings, permission: 'view:settings' },
];

const mainNavLinks = [
    { href: "/features", label: "Features", icon: Gem },
    { href: "/pricing", label: "Pricing", icon: Tag },
];

interface SidebarNavProps {
    isSidebarOpen: boolean;
}

export function SidebarNav({ isSidebarOpen }: SidebarNavProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get('tab') || 'dashboard';
    const { userProfile } = useUserAuth();
    const { t } = useLanguage();

    const { firestore } = useFirebase();

    const companyRef = useMemoFirebase(() => {
        if (!firestore || !userProfile?.companyId) return null;
        return doc(firestore, 'companies', userProfile.companyId);
    }, [firestore, userProfile?.companyId]);

    const { data: company } = useDoc(companyRef);

    const handleNavClick = (tab: string, href: string) => {
        if (href.startsWith('/dashboard?')) {
            router.push(href, { scroll: false });
        } else {
            router.push(href);
        }
    };

    const linkVariants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: -10 },
    };

    return (
        <div className={cn(
            "flex flex-col h-full bg-background/80 backdrop-blur-xl border-r border-white/10 dark:border-white/5 pb-16 transition-all duration-300 shadow-2xl",
            !isSidebarOpen && "items-center"
        )}>
            {/* Company Branding Section */}
            <div className={cn("flex items-center h-16 px-6 border-b border-white/10 dark:border-white/5", !isSidebarOpen && "justify-center px-2")}>
                {company ? (
                    <>
                        <Avatar className={cn("h-8 w-8 ring-2 ring-primary/20 transition-all", isSidebarOpen && "mr-3")}>
                            <AvatarImage src={company.logoUrl} alt={company.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{company.name?.substring(0, 2).toUpperCase() || "CO"}</AvatarFallback>
                        </Avatar>
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="overflow-hidden whitespace-nowrap"
                                >
                                    <h3 className="text-sm font-bold truncate text-foreground">{company.name}</h3>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Business Plan</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                ) : (
                    <>
                        <div className={cn("h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20", isSidebarOpen && "mr-3")}>
                            IC
                        </div>
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
                                >
                                    InvoiceCraft
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>

            <ScrollArea className="flex-grow py-6">
                <div className="space-y-6 px-3">
                    {/* Dashboard Section */}
                    <div>
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.h2
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-3 px-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70"
                                >
                                    Overview
                                </motion.h2>
                            )}
                        </AnimatePresence>
                        <div className="space-y-1">
                            {dashboardNavItems.filter(item => hasAccess(userProfile, item.permission)).map((item) => {
                                const isActive = pathname === '/dashboard'
                                    ? activeTab === item.tab
                                    : pathname === item.href;
                                return (
                                    <Button
                                        key={item.href}
                                        onClick={() => handleNavClick(item.tab, item.href)}
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start relative overflow-hidden transition-all duration-200 group",
                                            "h-10 rounded-lg hover:bg-primary/5 hover:text-primary",
                                            isActive && "bg-primary/10 text-primary font-semibold hover:bg-primary/15",
                                            !isSidebarOpen && "justify-center px-0 h-10 w-10 mx-auto"
                                        )}
                                        title={!isSidebarOpen ? t(`sidebar.${item.tab}`) : undefined}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            />
                                        )}
                                        <div className="flex items-center w-full z-10">
                                            <item.icon className={cn(
                                                "h-[18px] w-[18px] shrink-0 transition-colors",
                                                isSidebarOpen ? "mr-3 ml-2" : "mx-auto",
                                                isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                            )} />
                                            <AnimatePresence>
                                                {isSidebarOpen && (
                                                    <motion.span
                                                        variants={linkVariants}
                                                        initial="closed"
                                                        animate="open"
                                                        exit="closed"
                                                        className="text-sm"
                                                    >
                                                        {t(`sidebar.${item.tab}`)}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
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
