'use client';

import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import type { Invoice } from '@/lib/types';
import { InvoiceForm } from '@/components/invoice-form';
import { InvoicePreview } from '@/components/invoice-preview';
import { Button } from '@/components/ui/button';
import { Printer, Edit, FilePlus, LayoutDashboard } from 'lucide-react';
import { addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const initialLineItem = { id: crypto.randomUUID(), name: '', quantity: 1, rate: 0 };

const initialInvoice: Invoice = {
  id: crypto.randomUUID(),
  companyName: 'Your Company',
  companyAddress: '123 Main St, Anytown, USA',
  clientName: 'Client Company',
  clientAddress: '456 Oak Ave, Someplace, USA',
  invoiceNumber: 'INV-001',
  invoiceDate: new Date(),
  dueDate: addDays(new Date(), 7),
  items: [{ ...initialLineItem, name: 'Sample Item', rate: 100 }],
  tax: 5,
  discount: 0,
  notes: 'Thank you for your business.',
  status: 'draft',
};

const DRAFTS_STORAGE_KEY = 'invoiceDrafts';

export default function CreateInvoicePage() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const draftId = searchParams.get('draftId');
    if (draftId) {
      loadDraft(draftId);
    }
  }, [searchParams]);

  const loadDraft = (draftId: string) => {
    const fromJSON = (key: string, value: any) => {
      if (key === 'invoiceDate' || key === 'dueDate') {
        return value ? new Date(value) : value;
      }
      return value;
    };

    const savedData = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (savedData) {
      try {
        const drafts: Invoice[] = JSON.parse(savedData, fromJSON);
        const draftToLoad = drafts.find(d => d.id === draftId);
        if (draftToLoad) {
          setInvoice(draftToLoad);
          // Note: Logo URL is not saved with individual drafts in this implementation.
          // You might want to implement a way to save/load logos for drafts if needed.
          setLogoUrl(null); 
          toast({
            title: "Draft Loaded",
            description: `Invoice draft #${draftToLoad.invoiceNumber} has been loaded.`,
          });
        } else {
          toast({
            title: "Draft not found",
            description: "The specified draft could not be found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to parse invoice drafts from localStorage", error);
        toast({
          title: "Error",
          description: "Could not load saved draft data.",
          variant: "destructive",
        });
      }
    }
  }


  const handlePrint = () => {
    const printContainer = document.getElementById('print-container');
    if (printContainer) {
        const root = createRoot(printContainer);
        root.render(
            <InvoicePreview invoice={invoice} logoUrl={logoUrl} id="invoice-preview-print" />
        );
        
        // Allow time for render before printing
        setTimeout(() => {
            window.print();
            root.unmount();
        }, 100);
    }
  };

  const handleSaveDraft = () => {
    try {
      const toJSON = (key: string, value: any) => {
          if (key === 'invoiceDate' || key === 'dueDate') {
              return value ? new Date(value).toISOString() : value;
          }
          return value;
      };
      
      const savedData = localStorage.getItem(DRAFTS_STORAGE_KEY);
      let drafts: Invoice[] = savedData ? JSON.parse(savedData) : [];
      
      const existingDraftIndex = drafts.findIndex(d => d.id === invoice.id);

      if (existingDraftIndex !== -1) {
        drafts[existingDraftIndex] = invoice;
      } else {
        drafts.push(invoice);
      }

      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts, toJSON));
      toast({
        title: "Draft Saved",
        description: "Your invoice draft has been saved.",
      });
    } catch (error) {
      console.error("Failed to save invoice data to localStorage", error);
      toast({
        title: "Error",
        description: "There was an error saving your draft.",
        variant: "destructive",
      });
    }
  };
  
  const handleNew = () => {
    const newInvoiceId = crypto.randomUUID();
    setInvoice({ ...initialInvoice, id: newInvoiceId, status: 'draft', invoiceNumber: `INV-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}` });
    setLogoUrl(null);
    router.push('/create');
    toast({
        title: "New Invoice",
        description: "A new blank invoice has been created.",
      });
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-8 app-main-container">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-headline">Create Invoice</h1>
            <p className="text-muted-foreground">Fill out the form below to generate your invoice.</p>
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
            <InvoiceForm invoice={invoice} setInvoice={setInvoice} setLogoUrl={setLogoUrl} />
          </div>
          <div className="lg:col-span-2">
             <h2 className="text-2xl font-bold font-headline mb-4">Live Preview</h2>
             <div className="sticky top-24">
                <InvoicePreview invoice={invoice} logoUrl={logoUrl} />
             </div>
          </div>
        </div>
      </div>
    </>
  );
}
