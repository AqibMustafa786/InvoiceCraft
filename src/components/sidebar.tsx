"use client";

import {
    Home,
    FileText,
    Palette,
    DollarSign,
    Newspaper,
    Info,
    Mail,
    Users,
    Settings,
    LogIn,
    UserPlus,
    LayoutDashboard
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';

const menuItems = [
    { href: "/", icon: Home, label: "Home", tooltip: "Home" },
    { href: "/create", icon: FileText, label: "Templates", tooltip: "Templates" },
    { href: "/pricing", icon: DollarSign, label: "Pricing", tooltip: "Pricing" },
    { href: "/blog", icon: Newspaper, label: "Blogs", tooltip: "Blogs" },
    { href: "/about", icon: Info, label: "About Us", tooltip: "About Us" },
    { href: "/contact", icon: Mail, label: "Contact Us", tooltip: "Contact Us" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", tooltip: "Dashboard" }
];

const authItems = [
     { href: "/login", icon: LogIn, label: "Login", tooltip: "Login" },
     { href: "/signup", icon: UserPlus, label: "Sign Up", tooltip: "Sign Up" }
]

export function AppSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();
    
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                 <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">InvoiceCraft</span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                tooltip={item.tooltip}
                            >
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                 <SidebarMenu>
                    {authItems.map((item) => (
                         <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                tooltip={item.tooltip}
                            >
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Settings" asChild>
                            <button>
                                <Settings />
                                <span>Settings</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
