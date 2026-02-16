
import type { Metadata } from 'next';
import { Inter, Poppins, Roboto } from 'next/font/google';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { FirebaseClientProvider } from '@/firebase';
import { AuthProvider } from '@/context/auth-provider';
import { SplashScreenProvider } from '@/context/splash-screen-provider';
import { LanguageProvider } from '@/context/language-context';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'InvoiceCraft | Professional US Invoicing & Billing Software',
    template: '%s | InvoiceCraft'
  },
  description: 'The premier invoicing toolkit for US freelancers and agencies. Automate billing, manage estimates, and get paid faster with professional, compliant templates.',
  keywords: ['US Invoicing Software', 'Freelancer Billing Tool', 'Professional Invoice Generator', 'Agency Financial Management', 'US Tax Compliant Invoices', 'Stripe Billing Integration'],
  authors: [{ name: 'InvoiceCraft Team' }],
  creator: 'InvoiceCraft',
  publisher: 'InvoiceCraft',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://invoicecraft.com',
    siteName: 'InvoiceCraft',
    title: 'InvoiceCraft | Professional US Invoicing & Billing',
    description: 'Transform your business workflow with the ultimate US-targeted invoicing solution.',
    images: [
      {
        url: 'https://invoicecraft.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InvoiceCraft Professional Billing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvoiceCraft | Professional US Invoicing',
    description: 'Automate your billing and look professional with InvoiceCraft.',
    images: ['https://invoicecraft.com/twitter-image.png'],
    creator: '@invoicecraft',
  },
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
          'min-h-screen font-body antialiased',
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
              <LanguageProvider>
                <SplashScreenProvider>
                  <div className="app-main-container relative flex min-h-dvh flex-col bg-background">
                    <Header />
                    <main className="flex-1">
                      {children}
                    </main>
                    <Footer />
                  </div>
                  <Toaster />
                  <div id="print-container" className="hidden print:block"></div>
                </SplashScreenProvider>
              </LanguageProvider>
            </ThemeProvider>
          </AuthProvider>
        </FirebaseClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
