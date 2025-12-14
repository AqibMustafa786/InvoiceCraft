
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { FirebaseClientProvider } from '@/firebase';
import { AuthProvider } from '@/context/auth-provider';
import { SplashScreenProvider } from '@/context/splash-screen-provider';

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <FirebaseClientProvider>
          <AuthProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
              <SplashScreenProvider>
                <div className="app-main-container relative flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <Toaster />
                <div id="print-container" className="hidden print:block"></div>
              </SplashScreenProvider>
            </ThemeProvider>
          </AuthProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
