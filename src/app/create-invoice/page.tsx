
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Invoice, LineItem } from '@/lib/types';
import { InvoiceForm } from '@/components/invoice-form';
import { InvoicePreview } from '@/components/invoice-preview';
import { Button } from '@/components/ui/button';
import { Printer, Edit, FilePlus, LayoutDashboard } from 'lucide-react';
import { addDays, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useDoc } from '@/firebase/firestore/use-doc';

const INVOICES_COLLECTION = 'invoices';

const getInitialLineItem = (): LineItem => ({ id: crypto.randomUUID(), name: '', quantity: 1, rate: 0, unitPrice: 0 });

const getInitialInvoice = (): Omit<Invoice, 'userId'> => ({
  id: crypto.randomUUID(),
  companyName: 'Your Company',
  companyPhone: '+1 (123) 456-7890',
  companyAddress: '123 Main St, Anytown, USA',
  clientName: 'Client Company',
  clientAddress: '456 Oak Ave, Someplace, USA',
  clientEmail: '',
  shippingAddress: '',
  invoiceNumber: 'INV-001',
  poNumber: '',
  invoiceDate: new Date(),
  dueDate: addDays(new Date(), 7),
  trackingNumber: '',
  items: [{ ...getInitialLineItem(), name: 'Sample Item', rate: 100 }],
  tax: 5,
  discount: 0,
  shippingCost: 0,
  amountPaid: 0,
  paymentInstructions: 'Thank you for your business.',
  status: 'draft',
  currency: 'USD',
  language: 'en',
  template: 'default',
  documentType: 'invoice',
});

function PrintableInvoice({ doc, logoUrl, accentColor }: { doc: Invoice, logoUrl: string | null, accentColor: string }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const printRoot = document.getElementById('print-container');
    if (!printRoot) {
        return null;
    }

    return createPortal(
        <InvoicePreview invoice={doc} logoUrl={logoUrl} accentColor={accentColor} id="invoice-preview-print" isPrint={true} />,
        printRoot
    );
}


export default function CreateInvoicePage() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firestore, user, isUserLoading } = useFirebase();

  const draftId = searchParams.get('draftId');
  const docRef = useMemoFirebase(() => draftId && firestore ? doc(firestore, INVOICES_COLLECTION, draftId) : null, [draftId, firestore]);
  const { data: remoteDraft, isLoading: isDraftLoading } = useDoc<Invoice>(docRef);

  useEffect(() => {
    if (isUserLoading || (draftId && isDraftLoading)) return;
    if (!user) {
        router.push('/login');
        return;
    }

    let initialInvoice: Invoice;

    if (draftId && remoteDraft) {
        const fromJSON = (key: string, value: any) => {
           if (['invoiceDate', 'dueDate', 'createdAt', 'updatedAt'].includes(key) && value) {
               return value.toDate ? value.toDate() : (isValid(new Date(value)) ? new Date(value) : null);
           }
           return value;
       };
       const loadedDraft = JSON.parse(JSON.stringify(remoteDraft), fromJSON);
       initialInvoice = { ...getInitialInvoice(), ...loadedDraft, userId: user.uid };
    } else {
        initialInvoice = { ...getInitialInvoice(), userId: user.uid };
    }
    
    setInvoice(initialInvoice);
    setLogoUrl(null);
    
    if (typeof window !== 'undefined' && window.document) {
        const computedColor = getComputedStyle(window.document.documentElement).getPropertyValue('--primary').trim();
        if (computedColor) {
           setAccentColor(`hsl(${computedColor})`);
        }
    }
  }, [draftId, remoteDraft, isDraftLoading, user, isUserLoading, router]);


  const handlePrint = () => {
    window.print();
  };

  const handleSaveDraft = () => {
    if (!invoice || !firestore || !user) return;

    const normalizeDate = (val: any): Timestamp | null => {
        if (!val) return null;
        if (val instanceof Timestamp) return val;
        const d = val.toDate ? val.toDate() : new Date(val);
        return isValid(d) ? Timestamp.fromDate(d) : null;
    };

    const draftToSave: any = {
      ...invoice,
      userId: user.uid,
      updatedAt: serverTimestamp(),
    };

    const invoiceDate = normalizeDate(invoice.invoiceDate);
    if (invoiceDate) draftToSave.invoiceDate = invoiceDate;
    
    const dueDate = normalizeDate(invoice.dueDate);
    if (dueDate) draftToSave.dueDate = dueDate;

    if (!invoice.createdAt) {
      draftToSave.createdAt = serverTimestamp();
    }
    
    const docRef = doc(firestore, INVOICES_COLLECTION, invoice.id);
    setDocumentNonBlocking(docRef, draftToSave, { merge: true });

    toast({
      title: "Draft Saved",
      description: "Your invoice draft has been saved online.",
    });
    if (!searchParams.get('draftId')) {
      router.push(`/create-invoice?draftId=${invoice.id}`, { scroll: false });
    }
  };
  
  const handleNew = () => {
    if(!user) return;
    const newInvoice = {...getInitialInvoice(), userId: user.uid};
    newInvoice.invoiceNumber = `INV-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setInvoice(newInvoice);
    setLogoUrl(null);
    if (typeof window !== 'undefined' && window.document) {
        const computedColor = getComputedStyle(window.document.documentElement).getPropertyValue('--primary').trim();
        if (computedColor) {
            setAccentColor(`hsl(${computedColor})`);
        }
    }
    router.push('/create-invoice');
    toast({
        title: "New Invoice",
        description: "A new blank invoice has been created.",
      });
  };

  if (!invoice || (draftId && isDraftLoading) || isUserLoading) {
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
            <h1 className="text-3xl font-bold font-headline">Create Invoice</h1>
            <p className="text-muted-foreground">Select a template, then fill out the form to generate your invoice.</p>
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
          <div className="lg:col-span-3">
             <div className="mb-12">
                <h2 className="text-2xl font-bold font-headline mb-6 text-center">Select a Template</h2>
                <TemplateSelector 
                  selectedTemplate={invoice.template}
                  onSelectTemplate={(template) => setInvoice(prev => prev ? ({...prev, template}) : null)}
                />
              </div>
            <h2 className="text-2xl font-bold font-headline mb-4 text-center lg:text-left">Fill in Details</h2>
            <InvoiceForm 
              invoice={invoice} 
              setInvoice={setInvoice} 
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
              toast={toast}
            />
          </div>
          <div className="lg:col-span-2">
             <div className="sticky top-24">
                <h2 className="text-2xl font-bold font-headline mb-6">Live Preview</h2>
                <InvoicePreview invoice={invoice} logoUrl={logoUrl} accentColor={accentColor} />
            </div>
          </div>
        </div>
      </div>
      <PrintableInvoice doc={invoice} logoUrl={logoUrl} accentColor={accentColor} />
    </>
  );
}
