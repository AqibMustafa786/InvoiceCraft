'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { InsuranceDocument } from '@/lib/types';
import { InsuranceForm } from '@/components/insurance-form';
import { InsurancePreview } from '@/components/insurance-preview';
import { Button } from '@/components/ui/button';
import { Printer, FilePlus, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InsuranceTemplateSelector } from '@/components/insurance-template-selector';
import Link from 'next/link';

const getInitialLineItem = () => ({ id: crypto.randomUUID(), name: '', quantity: 1, rate: 0 });

const getInitialInsuranceDoc = (): InsuranceDocument => ({
  id: crypto.randomUUID(),
  companyName: 'Your Company',
  companyPhone: '+1 (123) 456-7890',
  companyAddress: '123 Main St, Anytown, USA',
  
  insuredName: 'John Doe',
  policyId: 'POL-12345',
  insuredAddress: '456 Oak Ave, Someplace, USA',
  insuredPhone: '',
  insuredEmail: '',

  claimNumber: 'CLM-67890',
  dateOfLoss: new Date().toISOString().split('T')[0],
  typeOfClaim: 'Property Damage',
  incidentDescription: 'Brief description of the incident.',

  documentNumber: 'DOC-001',
  documentDate: new Date(),
  
  items: [{ ...getInitialLineItem(), name: 'Sample Service', rate: 100 }],
  tax: 0,
  discount: 0,
  shippingCost: 0,
  
  notes: 'Thank you for your cooperation.',
  
  currency: 'USD',
  language: 'en',
  template: 'usa-claim-default',
});


function PrintableInsuranceDoc({ document, logoUrl, accentColor }: { document: InsuranceDocument, logoUrl: string | null, accentColor: string }) {
    const [printRoot, setPrintRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const root = document.getElementById('print-container');
        setPrintRoot(root);
    }, []);

    if (!printRoot) {
        return null;
    }

    return createPortal(
        <InsurancePreview document={document} logoUrl={logoUrl} accentColor={accentColor} id="insurance-preview-print" isPrint={true} />,
        printRoot
    );
}


export default function CreateInsurancePage() {
  const [document, setDocument] = useState<InsuranceDocument | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const { toast } = useToast();

  useEffect(() => {
    // Initialize state on the client to avoid hydration mismatch
    setDocument(getInitialInsuranceDoc());
  }, []);

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    const newDoc = getInitialInsuranceDoc();
    newDoc.documentNumber = `DOC-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setDocument(newDoc);
    setLogoUrl(null);
    if (typeof window !== 'undefined') {
        const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        if (computedColor) {
            setAccentColor(`hsl(${computedColor})`);
        }
    }
    toast({
        title: "New Document",
        description: "A new blank insurance document has been created.",
      });
  };

  if (!document) {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline">Loading...</h1>
        </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 md:p-8 app-main-container">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-headline">Create Insurance Document</h1>
            <p className="text-muted-foreground">Select a template and fill out the form to generate your claim document.</p>
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
          <div className="lg:col-span-3">
             <div className="my-8 md:my-12">
                <h2 className="text-2xl font-bold font-headline mb-6 text-center">Select a Template</h2>
                 <InsuranceTemplateSelector 
                  selectedTemplate={document.template}
                  onSelectTemplate={(template) => setDocument(prev => prev ? ({...prev, template}) : null)}
                />
              </div>
            <h2 className="text-2xl font-bold font-headline mb-4 text-center lg:text-left">Fill in Details</h2>
            <InsuranceForm 
              document={document} 
              setDocument={setDocument as React.Dispatch<React.SetStateAction<InsuranceDocument>>} 
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
              toast={toast}
            />
          </div>
          <div className="lg:col-span-2">
             <h2 className="text-2xl font-bold font-headline mb-4">Live Preview</h2>
             <div className="sticky top-24">
                <InsurancePreview document={document} logoUrl={logoUrl} accentColor={accentColor} />
             </div>
          </div>
        </div>
      </div>
      <PrintableInsuranceDoc document={document} logoUrl={logoUrl} accentColor={accentColor} />
    </>
  );
}
