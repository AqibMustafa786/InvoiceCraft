
import { ArrowLeft, ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[45vw_1fr]">
      <main className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
           <Link href="/" className="text-3xl font-bold text-foreground mb-8 block">InvoiceCraft</Link>
          {children}
        </div>
      </main>
      <aside className="hidden lg:flex items-center justify-center p-12 bg-primary/10 relative">
         <div className="w-full max-w-md space-y-8">
            <div className="relative bg-primary text-primary-foreground p-8 rounded-2xl shadow-2xl overflow-hidden">
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                >
                    <svg className="absolute bottom-0 right-0 w-1/2 h-1/2 text-primary-foreground/10" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 100 C40 100, 60 100, 100 100 L100 0 C60 0, 40 0, 0 0 Z" transform="rotate(0 50 50)"/>
                        <path d="M50 50 m-40 0 a40 40 0 1 0 80 0 a40 40 0 1 0 -80 0" opacity="0.3"/>
                        <path d="M100 50 A50 50, 0, 0, 1, 50 100 L50 50 Z" opacity="0.2"/>
                    </svg>
                </div>
                 <div className="absolute top-0 right-0 h-24 w-24 bg-background/80" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
                
                <div className="relative space-y-6">
                    <h2 className="text-3xl font-bold font-headline">What our Users Say.</h2>
                    <blockquote className="space-y-4">
                        <p className="text-lg leading-relaxed text-primary-foreground/80">"InvoiceCraft has revolutionized how I handle my billing. I'm saving hours every week and getting paid faster than ever."</p>
                        <footer>
                            <p className="font-semibold">Jane Doe</p>
                            <p className="text-sm text-primary-foreground/70">Freelance Designer</p>
                        </footer>
                    </blockquote>
                    <div className="flex gap-2">
                        <button className="h-10 w-10 bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                         <button className="h-10 w-10 bg-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
             <div className="relative bg-background p-8 rounded-2xl shadow-2xl mt-8 flex flex-col sm:flex-row gap-6 items-center">
                 <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-lg">Focus on Your Work, Not Your Paperwork</h3>
                    <p className="text-sm text-muted-foreground mt-1">Join thousands of freelancers and small businesses streamlining their billing.</p>
                </div>
                <div className="flex -space-x-2">
                    <div className="h-10 w-10 rounded-full bg-muted border-2 border-background"></div>
                    <div className="h-10 w-10 rounded-full bg-muted border-2 border-background"></div>
                    <div className="h-10 w-10 rounded-full bg-muted border-2 border-background"></div>
                </div>
                <div className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                    <span className="text-2xl">+</span>
                </div>
             </div>
         </div>
      </aside>
    </div>
  )
}
