import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'InvoiceCraft - Professional Invoice Generator',
  description: 'Easily create, manage, and export professional invoices.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <SidebarProvider>
            <AppSidebar />
            <div className="app-main-container relative flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SidebarProvider>
          <Toaster />
          <div id="print-container" className="hidden print:block"></div>
        </ThemeProvider>
      </body>
    </html>
  );
}
