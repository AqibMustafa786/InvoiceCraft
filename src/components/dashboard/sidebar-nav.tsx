

'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Users, FileQuestion, FilePlus, Home, Tag, Gem, CreditCard, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useFirebase } from "@/firebase";

const dashboardNavItems = [
    { href: "/dashboard", tab: "invoices", label: "Invoices", icon: FileText },
    { href: "/dashboard", tab: "estimates", label: "Estimates", icon: FileQuestion },
    { href: "/dashboard", tab: "quotes", label: "Quotes", icon: FilePlus },
    { href: "/dashboard", tab: "insurance", label: "Insurance", icon: Shield },
    { href: "/dashboard", tab: "clients", label: "Clients", icon: Users },
];

const mainNavLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/features", label: "Features", icon: Gem },
    { href: "/pricing", label: "Pricing", icon: Tag },
];

export function SidebarNav() {
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

    return (
        <div className="flex flex-col h-full bg-card rounded-lg border">
            <ScrollArea className="flex-grow">
                <div className="space-y-1 py-4">
                    <div className="px-3 py-2">
                         <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">
                             Dashboard
                         </h2>
                         <div className="space-y-1">
                            {dashboardNavItems.map((item) => {
                                const isActive = pathname === item.href && activeTab === item.tab;
                                return (
                                   <Button 
                                      key={item.href + item.tab}
                                      asChild
                                      variant={isActive ? "secondary" : "ghost"} 
                                      className={cn("w-full justify-start text-xs h-8", isActive && "text-primary")}
                                    >
                                      <Link href={`${item.href}?tab=${item.tab}`}>
                                         <item.icon className="mr-2 h-3.5 w-3.5" />
                                         {item.label}
                                      </Link>
                                   </Button>
                                )
                            })}
                         </div>
                    </div>
                     <div className="px-3 py-2">
                         <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">
                             Pages
                         </h2>
                         <div className="space-y-1">
                            {mainNavLinks.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                   <Button 
                                      key={item.href}
                                      asChild
                                      variant={isActive ? "secondary" : "ghost"} 
                                      className={cn("w-full justify-start text-xs h-8", isActive && "text-primary")}
                                    >
                                      <Link href={item.href}>
                                         <item.icon className="mr-2 h-3.5 w-3.5" />
                                         {item.label}
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
