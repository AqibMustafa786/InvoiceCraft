

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { InsuranceDocument, LineItem } from '@/lib/types';
import { InsuranceForm } from '@/components/insurance-form';
import { InsurancePreview } from '@/components/insurance-preview';
import { Button } from '@/components/ui/button';
import { Printer, FilePlus, LayoutDashboard, Brush, MoreVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InsuranceTemplateSelector } from '@/components/insurance-template-selector';
import Link from 'next/link';
import { serverTimestamp } from 'firebase/firestore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { addDays } from 'date-fns';

const getInitialLineItem = () => ({ id: crypto.randomUUID(), name: 'Premium', quantity: 1, rate: 1200, unitPrice: 1200 });

const getInitialInsuranceDoc = (): InsuranceDocument => ({
  id: crypto.randomUUID(),
  logoUrl: '',
  business: {
    name: 'Your Company',
    address: '123 Main St, Anytown, USA',
    phone: '+1 (123) 456-7890',
    email: 'contact@yourcompany.com',
    website: 'www.yourcompany.com',
    licenseNumber: 'LIC-12345',
    taxId: 'XX-XXXXXXX',
  },
  
  policyHolder: {
    name: 'John Doe',
    companyName: 'Doe Industries',
    address: '456 Oak Ave, Someplace, USA',
    phone: '555-555-5555',
    email: 'john.doe@example.com',
    identificationNumber: 'ID-98765'
  },
  
  policyId: `POL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
  claimNumber: 'CLM-67890',
  dateOfLoss: new Date().toISOString().split('T')[0],
  typeOfClaim: 'Property Damage',
  
  insuranceCompany: {
    name: 'Example Insurance Co.',
    address: '789 Insurance Plaza, Big City, USA',
    phone: '555-0101',
    email: 'claims@exampleinsurance.com',
    agentName: 'Jane Smith',
    agentLicenseNumber: 'AGENT-54321',
  },

  policyNumber: `DOC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
  documentDate: new Date(),
  
  items: [getInitialLineItem()],
  tax: 5,
  discount: 0,
  shippingCost: 0,
  
  notes: 'This policy is subject to the terms, conditions, and exclusions as specified in the full policy document. This document serves as a summary and does not override the master policy agreement. All claims are subject to verification and investigation. This policy is governed by the laws of the specified jurisdiction.',
  
  currency: 'USD',
  language: 'en',
  template: 'usa-claim-default',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  textColor: '#374151',
  backgroundColor: '#FFFFFF',

  // Insured Entity Details
  insuranceCategory: 'Vehicle',
  insuredItemDescription: 'A 2023 sedan involved in a minor collision.',
  coveragePurpose: 'Repair of damages as per policy terms.',
  coverageAmount: 10000,
  deductibleAmount: 500,
  coverageScope: '- Collision with other vehicles\n- Fire and theft\n- Natural disasters (flood, earthquake)',
  includedRisks: '- Collision with other vehicles\n- Fire and theft\n- Natural disasters (flood, earthquake)',
  excludedRisks: '- Wear and tear\n- Mechanical breakdown\n- Intentional damage',

  health: {
    insuredPersonName: '',
    dateOfBirth: null,
    gender: 'Other',
  },
  vehicle: {
    vehicleMake: '',
    model: '',
    registrationNumber: '',
    engineNumber: '',
    chassisNumber: '',
  },
  property: {
    propertyAddress: '',
    propertyType: 'Residential',
    estimatedValue: null,
  },

  // New Policy Information
  policyType: 'Comprehensive',
  policyStartDate: new Date(),
  policyEndDate: addDays(new Date(), 365),
  renewalOption: true,
  status: 'draft',
  paymentFrequency: 'Monthly',
  paymentMethod: 'Online',
  paymentStatus: 'Unpaid',
});


function PrintableInsuranceDoc({ doc, accentColor }: { doc: InsuranceDocument, accentColor: string }) {
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
        <InsurancePreview doc={doc} accentColor={accentColor} id="insurance-preview-print" isPrint={true} />,
        printRoot
    );
}


export default function CreateInsurancePage() {
  const [doc, setDoc] = useState<InsuranceDocument | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const { toast } = useToast();

  useEffect(() => {
    // Initialize state on the client to avoid hydration mismatch
    setDoc(getInitialInsuranceDoc());

    if (typeof window !== 'undefined' && window.document) {
        const computedColor = getComputedStyle(window.document.documentElement).getPropertyValue('--primary').trim();
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
    newDoc.policyNumber = `DOC-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setDoc(newDoc);
    if (typeof window !== 'undefined' && window.document) {
        const computedColor = getComputedStyle(window.document.documentElement).getPropertyValue('--primary').trim();
        if (computedColor) {
            setAccentColor(`hsl(${computedColor})`);
        }
    }
    toast({
        title: "New Document",
        description: "A new blank insurance document has been created.",
      });
  };

  if (!doc) {
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
            <h1 className="text-3xl font-bold font-headline">Create Insurance Document</h1>
            <p className="text-muted-foreground">Select a template and fill out the form to generate your claim document.</p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
              <Button onClick={handlePrint} variant="outline" className="w-full md:w-auto">
                <Printer className="mr-2 h-4 w-4" />
                Save as PDF
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleNew}>
                        <FilePlus className="mr-2 h-4 w-4" /> New
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 xl:gap-12">
          <div className="lg:col-span-3">
             <div className="space-y-6">
                <h2 className="text-2xl font-bold font-headline mb-4 text-center lg:text-left">Fill in Details</h2>
                <InsuranceForm 
                  document={doc} 
                  setDocument={setDoc} 
                  accentColor={accentColor}
                  setAccentColor={setAccentColor}
                  toast={toast}
                />
              </div>
          </div>
          <div className="lg:col-span-2">
             <div className="sticky top-24 space-y-4">
                <Sheet>
                      <SheetTrigger asChild>
                          <Button variant="outline" className="w-full">
                              <Brush className="mr-2 h-4 w-4" />
                              Change Template
                          </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:max-w-sm overflow-y-auto">
                          <SheetHeader>
                              <SheetTitle>Select a Template</SheetTitle>
                          </SheetHeader>
                          <div className="py-4">
                              <InsuranceTemplateSelector 
                                  selectedTemplate={doc.template}
                                  onSelectTemplate={(template) => setDoc(prev => prev ? ({...prev, template}) : null)}
                              />
                          </div>
                      </SheetContent>
                </Sheet>
                <div>
                  <h2 className="text-2xl font-bold font-headline mb-4">Live Preview</h2>
                  <InsurancePreview doc={doc} accentColor={accentColor} />
                </div>
            </div>
          </div>
        </div>
      </div>
      <PrintableInsuranceDoc doc={doc} accentColor={accentColor} />
    </>
  );
}
