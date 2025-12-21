
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Users, FileQuestion, FilePlus } from "lucide-react";

const navItems = [
    { href: "/dashboard?tab=invoices", label: "Invoices", icon: FileText },
    { href: "/dashboard?tab=estimates", label: "Estimates", icon: FileQuestion },
    { href: "/dashboard?tab=quotes", label: "Quotes", icon: FilePlus },
    { href: "/dashboard?tab=clients", label: "Clients", icon: Users },
]

export function SidebarNav() {
    const pathname = usePathname();

    return (
        <div className="h-full">
            <ScrollArea className="h-full pr-6">
                <div className="space-y-4 py-4">
                    <div className="px-3 py-2">
                         <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                             Dashboard
                         </h2>
                         <div className="space-y-1">
                            {navItems.map((item) => (
                               <Button 
                                  key={item.href}
                                  asChild
                                  variant={pathname.includes(item.href) ? "secondary" : "ghost"} 
                                  className="w-full justify-start"
                                >
                                  <Link href={item.href}>
                                     <item.icon className="mr-2 h-4 w-4" />
                                     {item.label}
                                  </Link>
                               </Button>
                            ))}
                         </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
