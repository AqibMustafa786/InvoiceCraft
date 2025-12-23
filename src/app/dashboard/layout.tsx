
'use client';

import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { usePathname } from "next/navigation";
import { Greeting } from "@/components/dashboard/greeting";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Don't apply this layout to nested client pages like /dashboard/clients/[clientId]
  if (pathname.startsWith('/dashboard/clients/')) {
    return <main className="px-4 md:px-8">{children}</main>
  }
  
  return (
    <div className="px-4 md:px-8">
      <Greeting />
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-x-8 gap-y-4 mt-2">
            <aside className="md:sticky md:top-4 h-full">
                <SidebarNav />
            </aside>
            <main>{children}</main>
        </div>
    </div>
  );
}
