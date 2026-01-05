
import type { Metadata } from 'next';
import { Inter, Poppins, Roboto } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { FirebaseClientProvider } from '@/firebase';
import { AuthProvider } from '@/context/auth-provider';
import { SplashScreenProvider } from '@/context/splash-screen-provider';
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    variable: '--font-roboto',
});


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
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          inter.variable,
          poppins.variable,
          roboto.variable
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
                <div className="app-main-container relative flex min-h-dvh flex-col">
                  <Header />
                  <main className="flex-1">
                      {children}
                  </main>
                  <Footer />
                </div>
                <Toaster />
                <div id="print-container" className="hidden print:block"></div>
              </SplashScreenProvider>
            </ThemeProvider>
          </AuthProvider>
        </FirebaseClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
