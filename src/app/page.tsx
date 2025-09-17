import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 overflow-hidden md:py-32 lg:py-40 bg-background/10">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 to-transparent"></div>
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-accent/20 filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/20 filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          <div className="container px-4 mx-auto text-center md:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl font-headline">
                Create Professional Invoices in Seconds
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                InvoiceCraft is the simplest way to create, manage, and send beautiful invoices to your clients. Get started for free and streamline your billing today.
              </p>
              <div className="flex justify-center gap-4 mt-8">
                <Button asChild size="lg" className="transition-transform shadow-lg hover:scale-105">
                  <Link href="/create">Get Started - It's Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-background/50 backdrop-blur-sm">
                  <Link href="/#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-background/30">
          <div className="container px-4 mx-auto md:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold md:text-4xl font-headline">Why You'll Love InvoiceCraft</h2>
              <p className="mt-4 text-muted-foreground">
                We've built a feature-rich platform to make your invoicing process seamless and professional.
              </p>
            </div>
            <div className="grid gap-8 mt-12 md:grid-cols-3">
              <Card className="border shadow-lg bg-background/50 backdrop-blur-lg border-white/20">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-3 mb-4 rounded-full bg-primary/10 text-primary">
                    <Zap className="w-8 h-8" />
                  </div>
                  <CardTitle>Effortless Creation</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Generate beautiful, professional invoices with our intuitive live editor. See your changes in real-time.
                </CardContent>
              </Card>
              <Card className="border shadow-lg bg-background/50 backdrop-blur-lg border-white/20">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-3 mb-4 rounded-full bg-primary/10 text-primary">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <CardTitle>Manage with Ease</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Keep track of all your invoice drafts in a powerful, filterable dashboard. Never lose an invoice again.
                </CardContent>
              </Card>
              <Card className="border shadow-lg bg-background/50 backdrop-blur-lg border-white/20">
                <CardHeader className="flex flex-col items-center text-center">
                   <div className="p-3 mb-4 rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <CardTitle>Secure & Private</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Your data is yours. All drafts are saved securely in your browser's local storage. No sign-up required.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-20 md:py-32">
           <div className="container px-4 mx-auto text-center md:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold md:text-4xl font-headline">Ready to Get Started?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Stop wrestling with spreadsheets and word processors. Join thousands of freelancers and small businesses who trust InvoiceCraft.
              </p>
              <div className="mt-8">
                <Button asChild size="lg" className="transition-transform shadow-lg hover:scale-105">
                  <Link href="/create">Create Your First Invoice</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
