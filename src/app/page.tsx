'use client';

import { useState, useEffect } from 'react';
import type { Invoice } from '@/lib/types';
import { InvoiceForm } from '@/components/invoice-form';
import { InvoicePreview } from '@/components/invoice-preview';
import { Button } from '@/components/ui/button';
import { Printer, Save, FilePlus, FolderOpen, Edit } from 'lucide-react';
import { addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const initialLineItem = { id: crypto.randomUUID(), name: '', quantity: 1, rate: 0 };

const initialInvoice: Invoice = {
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
};

const LOCAL_STORAGE_KEY = 'invoiceData';

export default function Home() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Stringify date objects for storage
    const toJSON = (key: string, value: any) => {
        if (key === 'invoiceDate' || key === 'dueDate') {
            return value ? new Date(value).toISOString() : value;
        }
        return value;
    };
    
    // Revive date objects from storage
    const fromJSON = (key: string, value: any) => {
        if (key === 'invoiceDate' || key === 'dueDate') {
            return value ? new Date(value) : value;
        }
        return value;
    };

    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData, fromJSON);
        setInvoice(parsedData.invoice);
        if(parsedData.logoUrl) {
          setLogoUrl(parsedData.logoUrl);
        }
      } catch (error) {
        console.error("Failed to parse invoice data from localStorage", error);
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDraft = () => {
    try {
      // Stringify date objects for storage
      const toJSON = (key: string, value: any) => {
          if (key === 'invoiceDate' || key === 'dueDate') {
              return value ? new Date(value).toISOString() : value;
          }
          return value;
      };
      
      const dataToSave = JSON.stringify({ invoice, logoUrl }, toJSON);
      localStorage.setItem(LOCAL_STORAGE_KEY, dataToSave);
      toast({
        title: "Draft Saved",
        description: "Your invoice draft has been saved locally.",
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

  const handleLoad = () => {
      // Revive date objects from storage
      const fromJSON = (key: string, value: any) => {
        if (key === 'invoiceDate' || key === 'dueDate') {
            return value ? new Date(value) : value;
        }
        return value;
    };

    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData, fromJSON);
        setInvoice(parsedData.invoice);
        if(parsedData.logoUrl) {
          setLogoUrl(parsedData.logoUrl);
        }
        toast({
          title: "Draft Loaded",
          description: "Your saved draft has been loaded.",
        });
      } catch (error) {
        console.error("Failed to parse invoice data from localStorage", error);
        toast({
          title: "Error",
          description: "Could not load saved draft data.",
          variant: "destructive",
        });
      }
    } else {
       toast({
        title: "No Saved Draft",
        description: "There is no saved draft to load.",
      });
    }
  };
  
  const handleNew = () => {
    setInvoice(initialInvoice);
    setLogoUrl(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast({
        title: "New Invoice",
        description: "A new blank invoice has been created.",
      });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
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
            <Button onClick={handleLoad} variant="outline">
                <FolderOpen className="mr-2 h-5 w-5" />
                Load Draft
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
           <div id="invoice-preview" className="sticky top-24">
             <InvoicePreview invoice={invoice} logoUrl={logoUrl} />
           </div>
        </div>
      </div>
    </div>
  );
}
