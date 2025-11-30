import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download, FileText, Palette, Languages, LayoutDashboard, Zap, Badge } from 'lucide-react';


const features = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Instant Invoice Creation",
    description: "Generate professional invoices in seconds with a simple, intuitive form.",
    isPro: false,
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "Live Preview & PDF Export",
    description: "See your invoice update in real-time and download it as a print-ready PDF.",
    isPro: false,
  },
  {
    icon: <Languages className="w-8 h-8 text-primary" />,
    title: "Multi-Language Support",
    description: "Create invoices in multiple languages, including Spanish, French, and German.",
    isPro: false,
  },
  {
    icon: <Palette className="w-8 h-8 text-primary" />,
    title: "Custom Branding",
    description: "Add your company logo and choose a custom accent color for a branded look.",
    isPro: true,
  },
  {
    icon: <LayoutDashboard className="w-8 h-8 text-primary" />,
    title: "Dashboard & Drafts",
    description: "Save your invoices as drafts and manage them all from a powerful dashboard.",
    isPro: true,
  },
];


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
                  <Link href="/#features">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 bg-background/50 md:py-32">
          <div className="container px-4 mx-auto md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold md:text-5xl font-headline">Features Designed for You</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to streamline your billing process, look professional, and get paid faster.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="relative p-8 overflow-hidden text-center transition-transform duration-300 transform bg-card/50 backdrop-blur-lg border-border/30 border rounded-xl shadow-lg hover:-translate-y-2">
                  {feature.isPro && (
                    <Badge className="absolute px-3 py-1 text-sm font-semibold tracking-wider rounded-full top-4 right-4 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                      PRO
                    </Badge>
                  )}
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-2xl font-bold font-headline">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
             <div className="mt-16 text-center">
                <Button asChild size="lg">
                    <Link href="/pricing">View All Plans & Features</Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
