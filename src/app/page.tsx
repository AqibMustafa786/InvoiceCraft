import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1">
        <section className="relative w-full py-20 overflow-hidden text-center md:py-32 lg:py-40">
          <div className="container px-4 mx-auto md:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl font-headline">
                <span>Hi, I’m </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  InvoiceCraft
                </span>
                <span className="inline-block ml-4 origin-bottom-right animate-wave">👋</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                The ultimate tool for freelancers and small businesses to create, manage, and track professional invoices online.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row">
                <Button asChild size="lg" className="w-full text-lg transition-transform shadow-lg bg-gradient-to-r from-primary to-accent text-primary-foreground hover:scale-105 sm:w-auto">
                  <Link href="/create">Create Invoice</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full text-lg bg-transparent sm:w-auto">
                  <Link href="/features">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
