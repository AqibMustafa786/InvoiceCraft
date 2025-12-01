
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Quote, LineItem } from '@/lib/types';
import { QuoteForm } from '@/components/quote-form';
import { QuotePreview } from '@/components/quote-preview';
import { Button } from '@/components/ui/button';
import { Printer, FilePlus, LayoutDashboard, Edit } from 'lucide-react';
import { addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { QuoteTemplateSelector } from '@/components/quote-template-selector';
import Link from 'next/link';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { doc, collection } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';

const QUOTES_COLLECTION = 'quotes';

const getInitialLineItem = (): LineItem => ({ id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0 });

const getInitialQuote = (): Omit<Quote, 'userId'> => ({
  id: crypto.randomUUID(),
  quoteNumber: `QUO-${new Date().getFullYear()}-001`,
  quoteDate: new Date(),
  validUntilDate: addDays(new Date(), 30),
  status: 'draft',
  
  business: {
    name: 'Your Company',
    address: '123 Main St, Anytown, USA 12345',
    phone: '+1 (123) 456-7890',
    email: 'contact@yourcompany.com',
    website: 'www.yourcompany.com',
    licenseNumber: 'LICENSE-12345',
  },

  client: {
    name: 'Client Name',
    companyName: 'Client Company',
    address: '456 Oak Ave, Someplace, USA 54321',
    phone: '+1 (987) 654-3210',
    email: 'client@example.com',
  },
  
  lineItems: [{ ...getInitialLineItem(), name: 'Sample Service (e.g., Website Development)', unitPrice: 1500 }],

  summary: {
    subtotal: 1500,
    taxPercentage: 0,
    taxAmount: 0,
    discount: 0,
    grandTotal: 1500,
    shippingCost: 0,
  },

  projectTitle: 'New Project',
  referenceNumber: 'REF-001',
  
  termsAndConditions: 'This quote is valid for 30 days. Prices are subject to change thereafter. Payment Terms: 50% upfront, 50% on completion.',
  
  template: 'default',
  documentType: 'quote',
  language: 'en',
  currency: 'USD',
});


function PrintableQuote({ quote, accentColor }: { quote: Quote, accentColor: string }) {
    const [printRoot, setPrintRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const root = document.getElementById('print-container');
        setPrintRoot(root);
    }, []);

    if (!printRoot) {
        return null;
    }

    return createPortal(
        <QuotePreview quote={quote} accentColor={accentColor} id="quote-preview-print" isPrint={true} />,
        printRoot
    );
}


export default function CreateQuotePage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const { toast } = useToast();
  const { firestore, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();

  const draftId = searchParams.get('draftId');
  const docRef = useMemoFirebase(() => draftId && firestore ? doc(firestore, QUOTES_COLLECTION, draftId) : null, [draftId, firestore]);
  const { data: remoteDraft, isLoading: isDraftLoading } = useDoc<Quote>(docRef);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
        router.push('/login');
        return;
    }

    const initialQuote = {...getInitialQuote(), userId: user.uid};

    if (draftId) {
        if (remoteDraft) {
            const fromJSON = (key: string, value: any) => {
                if (['quoteDate', 'validUntilDate'].includes(key) && value) {
                    return value.toDate ? value.toDate() : new Date(value);
                }
                return value;
            };
            const loadedDraft = JSON.parse(JSON.stringify(remoteDraft), fromJSON);
            setQuote({ ...initialQuote, ...loadedDraft });
        }
    } else {
        setQuote(initialQuote);
    }
    
    if (typeof window !== 'undefined' && document) {
        const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        if (computedColor) {
           setAccentColor(`hsl(${computedColor})`);
        }
    }
  }, [draftId, remoteDraft, user, isUserLoading, router]);

  const handlePrint = () => {
    window.print();
  };
  
  const handleSaveDraft = () => {
    if (!quote || !firestore) return;

    const draftToSave = {
      ...quote,
      quoteDate: quote.quoteDate,
      validUntilDate: quote.validUntilDate,
    };
    
    const docRef = doc(firestore, QUOTES_COLLECTION, quote.id);
    setDocumentNonBlocking(docRef, draftToSave, { merge: true });

    toast({
      title: "Quote Draft Saved",
      description: "Your quote draft has been saved online.",
    });
    router.push(`/create-quote?draftId=${quote.id}`);
  };

  const handleNew = () => {
    if (!user) return;
    const newQuote = {...getInitialQuote(), userId: user.uid};
    newQuote.quoteNumber = `Q-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setQuote(newQuote);
    if (typeof window !== 'undefined' && document) {
        const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        if (computedColor) {
            setAccentColor(`hsl(${computedColor})`);
        }
    }
     router.push('/create-quote');
    toast({
        title: "New Quote",
        description: "A new blank quote has been created.",
      });
  };
  
  useEffect(() => {
    if (quote) {
      const subtotal = quote.lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
      const taxAmount = (subtotal * quote.summary.taxPercentage) / 100;
      const discountAmount = quote.summary.discount; // Can be percentage or fixed amount
      const grandTotal = subtotal + taxAmount - discountAmount + quote.summary.shippingCost;

      setQuote(prev => {
        if (!prev) return null;
        if (prev.summary.subtotal !== subtotal ||
            prev.summary.taxAmount !== taxAmount ||
            prev.summary.grandTotal !== grandTotal) {
          return {
            ...prev,
            summary: {
              ...prev.summary,
              subtotal,
              taxAmount,
              grandTotal
            }
          };
        }
        return prev;
      });
    }
  }, [quote?.lineItems, quote?.summary.taxPercentage, quote?.summary.discount, quote?.summary.shippingCost]);


  if (!quote || (draftId && isDraftLoading)) {
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
               <Button onClick={handleSaveDraft}>
                <Edit className="mr-2 h-5 w-5" />
                Save Draft
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
                <QuotePreview quote={quote} accentColor={accentColor} />
            </div>
          </div>
        </div>
      </div>
      <PrintableQuote quote={quote} accentColor={accentColor} />
    </>
  );
}
