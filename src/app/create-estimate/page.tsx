
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Estimate, LineItem } from '@/lib/types';
import { EstimateForm } from '@/components/estimate-form';
import { EstimatePreview } from '@/components/estimate-preview';
import { Button } from '@/components/ui/button';
import { Printer, FilePlus, LayoutDashboard, Edit, Share2 } from 'lucide-react';
import { addDays, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { EstimateTemplateSelector } from '@/components/estimate-template-selector';
import Link from 'next/link';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';

const ESTIMATES_COLLECTION = 'estimates';

const getInitialLineItem = (): LineItem => ({ id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0, taxable: true });

const getInitialEstimate = (): Omit<Estimate, 'userId'> => ({
  id: crypto.randomUUID(),
  estimateNumber: `EST-${new Date().getFullYear()}-001`,
  estimateDate: new Date(),
  validUntilDate: addDays(new Date(), 30),
  status: 'draft',
  
  business: {
    name: 'Your Company',
    address: '123 Main St, Anytown, USA 12345',
    phone: '+1 (123) 456-7890',
    email: 'contact@yourcompany.com',
    website: 'www.yourcompany.com',
    licenseNumber: 'LICENSE-12345',
    logoUrl: '',
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
    taxPercentage: 8.25,
    taxAmount: 123.75,
    discount: 0,
    grandTotal: 1623.75,
    shippingCost: 0,
  },

  projectTitle: 'New Project',
  referenceNumber: 'REF-001',
  
  termsAndConditions: 'This estimate is valid for 30 days. Prices are subject to change thereafter. Payment Terms: 50% upfront, 50% on completion.',
  
  template: 'default',
  documentType: 'estimate',
  language: 'en',
  currency: 'USD',
  fontFamily: 'Inter',
  fontSize: 14,
});


function PrintableEstimate({ estimate, accentColor }: { estimate: Estimate, accentColor: string }) {
    const [printRoot, setPrintRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const root = document.getElementById('print-container');
        setPrintRoot(root);
    }, []);

    if (!printRoot) {
        return null;
    }

    return createPortal(
        <EstimatePreview estimate={estimate} accentColor={accentColor} id="estimate-preview-print" isPrint={true} />,
        printRoot
    );
}


export default function CreateEstimatePage() {
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const { toast } = useToast();
  const { firestore, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();

  const draftId = searchParams.get('draftId');
  const docRef = useMemoFirebase(() => draftId && firestore ? doc(firestore, ESTIMATES_COLLECTION, draftId) : null, [draftId, firestore]);
  const { data: remoteDraft, isLoading: isDraftLoading } = useDoc<Estimate>(docRef);

  const computeSummary = useCallback((est: Estimate): Estimate => {
    const subtotal = est.lineItems.reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
    const taxableTotal = est.lineItems.filter(i => i.taxable !== false).reduce((s, i) => s + ((Number(i.quantity) || 0) * (Number(i.unitPrice) || 0)), 0);
    const taxPercentage = Number(est.summary.taxPercentage) || 0;
    const taxAmount = taxableTotal * (taxPercentage / 100);
    const discountAmount = Number(est.summary.discount) || 0;
    const shippingCost = Number(est.summary.shippingCost) || 0;
    const grandTotal = subtotal + taxAmount - discountAmount + shippingCost;

    return {
        ...est,
        summary: {
            ...est.summary,
            subtotal,
            taxAmount,
            grandTotal,
        }
    };
  }, []);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
        router.push('/login');
        return;
    }

    const initialEstimate = {...getInitialEstimate(), userId: user.uid};

    if (draftId && remoteDraft) {
        const fromJSON = (key: string, value: any) => {
           if (['estimateDate', 'validUntilDate', 'createdAt', 'updatedAt'].includes(key) && value) {
               return value.toDate ? value.toDate() : (isValid(new Date(value)) ? new Date(value) : null);
           }
           return value;
       };
       const loadedDraft = JSON.parse(JSON.stringify(remoteDraft), fromJSON);
       setEstimate({ ...initialEstimate, ...loadedDraft });
    } else {
        setEstimate(initialEstimate);
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
    if (!estimate || !firestore || !user) return;

    const normalizeDate = (val: any): Date => {
        if (!val) return new Date();
        const d = new Date(val);
        return isValid(d) ? d : new Date();
    };
    
    const draftToSave = {
      ...estimate,
      userId: user.uid,
      estimateDate: normalizeDate(estimate.estimateDate),
      validUntilDate: normalizeDate(estimate.validUntilDate),
      updatedAt: serverTimestamp(),
      createdAt: estimate.createdAt ? estimate.createdAt : serverTimestamp(),
    };
    
    const docRef = doc(firestore, ESTIMATES_COLLECTION, estimate.id);
    setDocumentNonBlocking(docRef, draftToSave, { merge: true });

    toast({
      title: "Estimate Draft Saved",
      description: "Your estimate draft has been saved online.",
    });
    router.push(`/create-estimate?draftId=${estimate.id}`);
  };

  const handleNew = () => {
    if (!user) return;
    const newEstimate = {...getInitialEstimate(), userId: user.uid};
    newEstimate.estimateNumber = `EST-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setEstimate(newEstimate);
    if (typeof window !== 'undefined' && document) {
        const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        if (computedColor) {
            setAccentColor(`hsl(${computedColor})`);
        }
    }
     router.push('/create-estimate');
    toast({
        title: "New Estimate",
        description: "A new blank estimate has been created.",
      });
  };

  const handleShare = () => {
      if (!estimate) return;
      const url = `${window.location.origin}/estimate/${estimate.id}`;
      navigator.clipboard.writeText(url);
      toast({
          title: "Link Copied!",
          description: "The shareable link has been copied to your clipboard.",
      });
  };
  
  useEffect(() => {
    if (estimate) {
        const newEstimate = computeSummary(estimate);
         if (JSON.stringify(newEstimate.summary) !== JSON.stringify(estimate.summary)) {
            setEstimate(newEstimate);
        }
    }
  }, [estimate, computeSummary]);


  if (!estimate || (draftId && isDraftLoading) || isUserLoading) {
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
            <h1 className="text-3xl font-bold font-headline">Create Estimate</h1>
            <p className="text-muted-foreground">Select a template and fill out the form to generate your professional estimate.</p>
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
              <Button onClick={handleShare}>
                <Share2 className="mr-2 h-5 w-5" />
                Share
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
                 <EstimateTemplateSelector 
                  selectedTemplate={estimate.template}
                  onSelectTemplate={(template) => setEstimate(prev => prev ? ({...prev, template}) : null)}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-headline mb-4 text-center lg:text-left">Fill in Details</h2>
                <EstimateForm 
                  estimate={estimate} 
                  setEstimate={setEstimate as React.Dispatch<React.SetStateAction<Estimate>>} 
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
                <EstimatePreview estimate={estimate} accentColor={accentColor} />
            </div>
          </div>
        </div>
      </div>
      <PrintableEstimate estimate={estimate} accentColor={accentColor} />
    </>
  );
}

    