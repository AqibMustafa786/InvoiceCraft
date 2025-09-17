import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tight">
                Create Professional Invoices in Seconds
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground">
                InvoiceCraft is the simplest way to create, manage, and send beautiful invoices to your clients. Get started for free and streamline your billing today.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/create">Get Started - It's Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Why You'll Love InvoiceCraft</h2>
              <p className="mt-4 text-muted-foreground">
                We've built a feature-rich platform to make your invoicing process seamless and professional.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                    <Zap className="h-8 w-8" />
                  </div>
                  <CardTitle>Effortless Creation</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Generate beautiful, professional invoices with our intuitive live editor. See your changes in real-time.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <CardTitle>Manage with Ease</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Keep track of all your invoice drafts in a powerful, filterable dashboard. Never lose an invoice again.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center">
                   <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                    <ShieldCheck className="h-8 w-8" />
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
           <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Get Started?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Stop wrestling with spreadsheets and word processors. Join thousands of freelancers and small businesses who trust InvoiceCraft.
              </p>
              <div className="mt-8">
                <Button asChild size="lg">
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
