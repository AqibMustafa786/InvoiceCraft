
'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Users, FileQuestion, FilePlus, Home, Tag, Gem, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useFirebase } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Greeting } from "./greeting";

const dashboardNavItems = [
    { href: "/dashboard", tab: "invoices", label: "Invoices", icon: FileText },
    { href: "/dashboard", tab: "estimates", label: "Estimates", icon: FileQuestion },
    { href: "/dashboard", tab: "quotes", label: "Quotes", icon: FilePlus },
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
                <Greeting />
                <div className="space-y-4 py-4">
                    <div className="px-3 py-2">
                         <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
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
                                      className={cn("w-full justify-start", isActive && "text-primary")}
                                    >
                                      <Link href={`${item.href}?tab=${item.tab}`}>
                                         <item.icon className="mr-2 h-4 w-4" />
                                         {item.label}
                                      </Link>
                                   </Button>
                                )
                            })}
                         </div>
                    </div>
                     <div className="px-3 py-2">
                         <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
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
                                      className={cn("w-full justify-start", isActive && "text-primary")}
                                    >
                                      <Link href={item.href}>
                                         <item.icon className="mr-2 h-4 w-4" />
                                         {item.label}
                                      </Link>
                                   </Button>
                                )
                            })}
                         </div>
                    </div>
                </div>
            </ScrollArea>
             <div className="mt-auto border-t p-4 space-y-2">
                 {user && (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                            <AvatarFallback>
                                {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-xs">
                            <p className="font-bold">{user.displayName || user.email}</p>
                            <p className="text-muted-foreground">{userProfile?.plan === 'business' ? 'Business Plan' : 'Free Plan'}</p>
                        </div>
                    </div>
                 )}
                 {userProfile?.plan === 'business' && (
                     <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/billing">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Manage Billing
                        </Link>
                    </Button>
                 )}
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
