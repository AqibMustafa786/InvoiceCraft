'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Quote } from '@/lib/types';
import { QuoteForm } from '@/components/quote-form';
import { QuotePreview } from '@/components/quote-preview';
import { Button } from '@/components/ui/button';
import { Printer, FilePlus, LayoutDashboard } from 'lucide-react';
import { addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { QuoteTemplateSelector } from '@/components/quote-template-selector';
import Link from 'next/link';

const getInitialLineItem = () => ({ id: crypto.randomUUID(), name: '', quantity: 1, rate: 0 });

const getInitialQuote = (): Quote => ({
  id: crypto.randomUUID(),
  companyName: 'Your Company',
  companyPhone: '+1 (123) 456-7890',
  companyAddress: '123 Main St, Anytown, USA',
  clientName: 'Client Company',
  clientAddress: '456 Oak Ave, Someplace, USA',
  clientEmail: '',
  quoteNumber: 'Q-001',
  quoteDate: new Date(),
  validUntilDate: addDays(new Date(), 30),
  items: [{ ...getInitialLineItem(), name: 'Sample Service (e.g., Website Development)', rate: 1500 }],
  tax: 0,
  discount: 0,
  shippingCost: 0,
  notes: 'This quote is valid for 30 days. Prices are subject to change thereafter.',
  currency: 'USD',
  language: 'en',
  template: 'default',
});


function PrintableQuote({ quote, logoUrl, accentColor }: { quote: Quote, logoUrl: string | null, accentColor: string }) {
    const [printRoot, setPrintRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const root = document.getElementById('print-container');
        setPrintRoot(root);
    }, []);

    if (!printRoot) {
        return null;
    }

    return createPortal(
        <QuotePreview quote={quote} logoUrl={logoUrl} accentColor={accentColor} id="quote-preview-print" isPrint={true} />,
        printRoot
    );
}


export default function CreateQuotePage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const { toast } = useToast();

  useEffect(() => {
    // Initialize state on the client to avoid hydration mismatch
    setQuote(getInitialQuote());
    if (typeof window !== 'undefined' && document) {
        const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        if (computedColor) {
           setAccentColor(`hsl(${computedColor})`);
        }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };
  
  const handleNew = () => {
    const newQuote = getInitialQuote();
    newQuote.quoteNumber = `Q-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setQuote(newQuote);
    setLogoUrl(null);
    if (typeof window !== 'undefined' && document) {
        const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        if (computedColor) {
            setAccentColor(`hsl(${computedColor})`);
        }
    }
    toast({
        title: "New Quote",
        description: "A new blank quote has been created.",
      });
  };

  if (!quote) {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline">Loading...</h1>
        </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-headline">Create Quote</h1>
            <p className="text-muted-foreground">Select a template and fill out the form to generate your professional quote.</p>
          </div>
          <div className="flex flex-wrap gap-2">
              <Button onClick={handleNew} variant="outline">
                  <FilePlus className="mr-2 h-5 w-5" />
                  New
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-5 w-5" />
                Save as PDF
              </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 xl:gap-12">
          <div className="lg:col-span-3 lg:pr-12 lg:border-r lg:border-border/30">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold font-headline mb-6 text-center">Select a Template</h2>
                 <QuoteTemplateSelector 
                  selectedTemplate={quote.template}
                  onSelectTemplate={(template) => setQuote(prev => prev ? ({...prev, template}) : null)}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-headline mb-4 text-center lg:text-left">Fill in Details</h2>
                <QuoteForm 
                  quote={quote} 
                  setQuote={setQuote as React.Dispatch<React.SetStateAction<Quote>>} 
                  logoUrl={logoUrl}
                  setLogoUrl={setLogoUrl}
                  accentColor={accentColor}
                  setAccentColor={setAccentColor}
                  toast={toast}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 lg:pl-12">
            <div className="sticky top-24">
                <h2 className="text-2xl font-bold font-headline mb-6">Live Preview</h2>
                <QuotePreview quote={quote} logoUrl={logoUrl} accentColor={accentColor} />
            </div>
          </div>
        </div>
      </div>
      <PrintableQuote quote={quote} logoUrl={logoUrl} accentColor={accentColor} />
    </>
  );
}
