

'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Quote, LineItem } from '@/lib/types';
import { DocumentForm } from '@/components/document-form';
import { ClientDocumentPreview } from '@/components/document-preview';
import { Button } from '@/components/ui/button';
import { Printer, FilePlus, LayoutDashboard, Edit, Share2, Mail, Loader2, MoreVertical } from 'lucide-react';
import { addDays, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { sendDocumentByEmail } from '@/ai/flows/send-document-flow';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const QUOTES_COLLECTION = 'quotes';

const getInitialLineItem = (): LineItem => ({ id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0, taxable: false });

const getInitialQuote = (): Omit<Quote, 'userId'> => ({
  id: crypto.randomUUID(),
  estimateNumber: `QTE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
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
  
  termsAndConditions: 'This quote is valid for 30 days. Prices are subject to change thereafter. Payment Terms: 50% upfront, 50% on completion.',
  
  template: 'default',
  documentType: 'quote',
  category: 'Generic',
  language: 'en',
  currency: 'USD',
  fontFamily: 'Inter',
  fontSize: 14,
});


function PrintableDocument({ doc, accentColor }: { doc: Quote, accentColor: string }) {
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
        <ClientDocumentPreview document={doc} accentColor={accentColor} id="quote-preview-print" isPrint={true} />,
        printRoot
    );
}


export default function CreateQuotePage() {
  const [document, setDocument] = useState<Quote | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();
  const { firestore, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();

  const draftId = searchParams.get('draftId');
  const docRef = useMemoFirebase(() => draftId && firestore ? doc(firestore, QUOTES_COLLECTION, draftId) : null, [draftId, firestore]);
  const { data: remoteDraft, isLoading: isDraftLoading } = useDoc<Quote>(docRef);

  const computeSummary = useCallback((est: Quote): Quote => {
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
    if (isUserLoading || (draftId && isDraftLoading)) return;
    if (!user) {
        router.push('/login');
        return;
    }

    let initialQuote: Quote;

    if (draftId && remoteDraft) {
         const fromJSON = (key: string, value: any) => {
            if (['estimateDate', 'validUntilDate', 'createdAt', 'updatedAt'].includes(key) && value) {
                return value.toDate ? value.toDate() : (isValid(new Date(value)) ? new Date(value) : null);
            }
            return value;
        };
        const loadedDraft = JSON.parse(JSON.stringify(remoteDraft), fromJSON);
        initialQuote = { ...getInitialQuote(), ...loadedDraft, userId: user.uid };
    } else {
        initialQuote = {...getInitialQuote(), userId: user.uid};
    }

    setDocument(initialQuote);
    
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
    if (!document || !firestore || !user) return;

    const normalizeDate = (val: any): Timestamp | null => {
        if (!val) return null;
        if (val instanceof Timestamp) return val;
        const d = val.toDate ? val.toDate() : new Date(val);
        return isValid(d) ? Timestamp.fromDate(d) : null;
    };
    
    const draftToSave: any = {
      ...document,
      userId: user.uid,
      updatedAt: serverTimestamp(),
    };

    const estimateDate = normalizeDate(document.estimateDate);
    if (estimateDate) draftToSave.estimateDate = estimateDate;
    
    const validUntilDate = normalizeDate(document.validUntilDate);
    if (validUntilDate) draftToSave.validUntilDate = validUntilDate;

    if (!document.createdAt) {
      draftToSave.createdAt = serverTimestamp();
    }
    
    const docRef = doc(firestore, QUOTES_COLLECTION, document.id);
    setDocumentNonBlocking(docRef, draftToSave, { merge: true });

    toast({
      title: "Quote Draft Saved",
      description: "Your quote draft has been saved online.",
    });
    if (!searchParams.get('draftId')) {
      router.push(`/create-quote?draftId=${document.id}`, { scroll: false });
    }
  };

  const handleNew = () => {
    if (!user) return;
    const newQuote = {...getInitialQuote(), userId: user.uid};
    setDocument(newQuote);
    if (typeof window !== 'undefined' && window.document) {
        const computedColor = getComputedStyle(window.document.documentElement).getPropertyValue('--primary').trim();
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

    const handleShare = () => {
      if (!document) return;
      handleSaveDraft();
      const url = `${window.location.origin}/quote/${document.id}`;
      navigator.clipboard.writeText(url);
      toast({
          title: "Link Copied!",
          description: "The shareable link has been copied to your clipboard.",
      });
  };
  
    const handleEmail = async () => {
    if (!document) return;
    if (!document.client.email) {
      toast({ title: "Client Email Missing", description: "Please enter the client's email address first.", variant: 'destructive' });
      return;
    }
    
    setIsSendingEmail(true);
    try {
      handleSaveDraft();
      const result = await sendDocumentByEmail({ docId: document.id, docType: 'quote' });
      
      if (result.success) {
        toast({
          title: "Email Sent",
          description: "The quote has been successfully sent to the client.",
        });
      } else {
        throw new Error(result.message || 'An unknown error occurred.');
      }
    } catch (error: any) {
      console.error("Failed to send email:", error);
      toast({
        title: "Email Failed",
        description: error.message || "Could not send the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };
  
  useEffect(() => {
    if (document) {
        const newQuote = computeSummary(document);
         if (JSON.stringify(newQuote.summary) !== JSON.stringify(document.summary)) {
            setDocument(newQuote);
        }
    }
  }, [document, computeSummary]);


  if (!document || (draftId && isDraftLoading) || isUserLoading) {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline">Loading...</h1>
        </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 md:px-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-headline">Create Quote</h1>
            <p className="text-muted-foreground">Fill out the form to generate your professional quote.</p>
          </div>
          {/* Actions Buttons */}
          <div className="flex w-full md:w-auto items-center gap-2">
            <Button onClick={handleSaveDraft} className="w-full md:w-auto">
                <Edit className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button onClick={handlePrint} variant="outline" className="w-full md:w-auto">
                <Printer className="mr-2 h-4 w-4" /> Save as PDF
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
                    <DropdownMenuItem onClick={handleEmail} disabled={isSendingEmail}>
                        {isSendingEmail ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" />) : ( <Mail className="mr-2 h-4 w-4" /> )}
                         Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold font-headline mb-4 text-center lg:text-left">Fill in Details</h2>
                <DocumentForm 
                  document={document} 
                  setDocument={setDocument as React.Dispatch<React.SetStateAction<Quote>>}
                  accentColor={accentColor}
                  setAccentColor={() => {}}
                  backgroundColor="#FFFFFF"
                  setBackgroundColor={() => {}}
                  textColor="#374151"
                  setTextColor={() => {}}
                  toast={toast}
                  documentType="quote"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="sticky top-24">
                <h2 className="text-2xl font-bold font-headline mb-6">Live Preview</h2>
                <ClientDocumentPreview document={document} accentColor={accentColor} />
            </div>
          </div>
        </div>
      </div>
      {document && <PrintableDocument doc={document} accentColor={accentColor} />}
    </>
  );
}
    

    
