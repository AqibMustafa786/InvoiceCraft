'use client';

import { useState } from 'react';
import type { Invoice } from '@/lib/types';
import { InvoiceForm } from '@/components/invoice-form';
import { InvoicePreview } from '@/components/invoice-preview';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { addDays } from 'date-fns';

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


export default function Home() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Create Invoice</h1>
          <p className="text-muted-foreground">Fill out the form below to generate your invoice.</p>
        </div>
        <Button onClick={handlePrint} size="lg">
          <Printer className="mr-2 h-5 w-5" />
          Print / Save as PDF
        </Button>
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
