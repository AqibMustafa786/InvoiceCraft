'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Settings,
    Palette,
    Bell,
    Shield,
    Users,
    Plug,
    CreditCard,
    Database,
    FileClock,
    LayoutDashboard,
    Globe
} from "lucide-react";
import { canViewSettingsTab } from "@/lib/permissions";
import { useUserAuth } from "@/context/auth-provider";

interface SettingsNavProps {
    className?: string;
}

export function SettingsNav({ className }: SettingsNavProps) {
    const pathname = usePathname();
    const { userProfile } = useUserAuth();
    const userRole = userProfile?.role || 'viewer';

    const navItems = [
        {
            title: "General",
            href: "/dashboard/settings/general",
            icon: Settings,
            permission: "general",
        },
        {
            title: "Appearance",
            href: "/dashboard/settings/appearance",
            icon: Palette,
            permission: "appearance",
        },
        {
            title: "Notifications",
            href: "/dashboard/settings/notifications",
            icon: Bell,
            permission: "notifications",
        },
        {
            title: "Security",
            href: "/dashboard/settings/security",
            icon: Shield,
            permission: "security",
        },
        {
            title: "Employees & Roles",
            href: "/dashboard/settings/users",
            icon: Users,
            permission: "users",
        },
        {
            title: "Integrations",
            href: "/dashboard/settings/integrations",
            icon: Plug,
            permission: "integrations",
        },
        {
            title: "Billing",
            href: "/dashboard/settings/billing",
            icon: CreditCard,
            permission: "billing",
        },
        {
            title: "Data Management",
            href: "/dashboard/settings/data",
            icon: Database,
            permission: "data",
        },
        {
            title: "Audit Logs",
            href: "/dashboard/settings/audit",
            icon: FileClock,
            permission: "audit",
        },
        {
            title: "Login Portal",
            href: "/dashboard/settings/portal",
            icon: Globe,
            permission: "portal",
        },
    ];

    return (
        <nav className={cn("flex flex-col space-y-1", className)}>
            <div className="px-4 py-2 mb-2">
                <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your workspace</p>
            </div>
            {navItems.map((item) => {
                // Pass userProfile (which contains role and plan) to check permissions
                if (!canViewSettingsTab(userProfile || { role: userRole }, item.permission)) {
                    return null;
                }

                const isActive = pathname === item.href;

                return (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start",
                                isActive && "bg-secondary text-primary"
                            )}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.title}
                        </Button>
                    </Link>
                );
            })}
        </nav>
    );
}
