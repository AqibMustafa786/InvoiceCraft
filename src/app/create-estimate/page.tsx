
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Estimate, LineItem, Quote } from '@/lib/types';
import { DocumentForm } from '@/components/document-form';
import { ClientDocumentPreview } from '@/components/document-preview';
import { Button } from '@/components/ui/button';
import { Printer, FilePlus, LayoutDashboard, Edit, Share2, Mail, Loader2 } from 'lucide-react';
import { addDays, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { sendDocumentByEmail } from '@/ai/flows/send-document-flow';
import { DocumentTemplateSelector } from '@/components/document-template-selector';

const ESTIMATES_COLLECTION = 'estimates';

const getInitialLineItem = (): LineItem => ({ id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0, taxable: true });

const getInitialEstimate = (): Omit<Estimate, 'userId'> => ({
  id: '', // Will be set in useEffect
  estimateNumber: '', // Will be set in useEffect
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
    taxId: '',
  },

  client: {
    name: 'Client Name',
    companyName: 'Client Company',
    address: '456 Oak Ave, Someplace, USA 54321',
    phone: '+1 (987) 654-3210',
    email: 'client@example.com',
    projectLocation: '',
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
  category: 'Generic',
  language: 'en',
  currency: 'USD',
  isPublic: false,
  fontFamily: 'Inter',
  fontSize: 14,
  backgroundColor: '#FFFFFF',
  textColor: '#374151',

  homeRemodeling: {
    projectType: 'Kitchen Remodel',
    propertyType: 'House',
    squareFootage: null,
    roomsIncluded: 'Kitchen, Dining Area',
    materialGrade: 'Standard',
    demolitionRequired: true,
    permitRequired: false,
    specialInstructions: '',
    expectedStartDate: null,
    expectedCompletionDate: null,
  },
  roofing: {
    roofMaterial: 'Shingle',
    roofSize: null,
    roofPitch: '4/12',
    layersToRemove: 1,
    underlaymentType: 'Synthetic',
    flashingReplacement: true,
    ventilationSystem: 'Ridge Vents',
    gutterRepairNeeded: false,
    roofAge: 15,
    inspectionRequired: true,
  },
  hvac: {
    serviceType: 'Install',
    systemType: 'AC',
    unitSize: null,
    seerRating: '',
    furnaceType: 'Gas',
    ductworkRequired: false,
    thermostatType: 'Programmable',
    existingSystemCondition: '',
    refrigerantType: '',
  },
  plumbing: {
    serviceType: 'Leak Repair',
    fixtureType: 'Sink',
    pipeMaterial: 'Copper',
    floorLevel: '',
    emergencyService: false,
    waterPressureIssue: false,
    leakLocation: '',
    estimatedRepairTime: '',
  },
  electrical: {
    serviceType: 'Install',
    wiringType: 'Copper',
    panelUpgradeNeeded: false,
    panelSize: '200A',
    outletsFixturesCount: null,
    roomsInvolved: '',
    evChargerNeeded: false,
    inspectionRequired: false,
  },
  landscaping: {
    serviceType: 'Lawn Mowing',
    propertySize: '',
    grassHeight: '',
    treeCount: null,
    fenceLengthNeeded: '',
    yardCondition: 'Good',
  },
  cleaning: {
    cleaningType: 'Standard',
    homeSize: null,
    bedrooms: null,
    bathrooms: null,
    kitchenSize: 'Medium',
    hasPets: false,
    addOns: [],
    frequency: 'One-time',
  },
  autoRepair: {
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: null,
    vin: '',
    mileage: null,
    issueDescription: '',
    partsRequired: '',
    diagnosticType: 'Basic',
  },
  construction: {
    projectType: 'New Home',
    squareFootage: null,
    lotSize: '',
    buildingType: '',
    permitRequired: false,
    architectDrawingsProvided: false,
    soilCondition: '',
    materialPreference: '',
    inspectionRequired: false,
  },
  itFreelance: {
    projectType: 'Website',
    scopeOfWork: '',
    pagesScreensCount: null,
    designStyle: '',
    featuresNeeded: '',
    integrations: '',
    revisionsIncluded: null,
    deliveryTimeline: '',
  },
});


function PrintableDocument({ doc, accentColor, backgroundColor, textColor }: { doc: Estimate | Quote, accentColor: string, backgroundColor: string, textColor: string }) {
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
        <ClientDocumentPreview document={doc} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} id="estimate-preview-print" isPrint={true} />,
        printRoot
    );
}


export default function CreateEstimatePage() {
  const [document, setDocument] = useState<Estimate | Quote | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#374151');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();
  const { firestore, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentType = 'estimate';

  const draftId = searchParams.get('draftId');
  const docRef = useMemoFirebase(() => draftId && firestore ? doc(firestore, ESTIMATES_COLLECTION, draftId) : null, [draftId, firestore]);
  const { data: remoteDraft, isLoading: isDraftLoading } = useDoc<Estimate>(docRef);

  const computeSummary = useCallback((est: Estimate | Quote): Estimate | Quote => {
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

    let initialEstimate: Estimate | Quote;

    if (draftId && remoteDraft) {
       const baseEstimate = getInitialEstimate();
       const fromJSON = (key: string, value: any) => {
           if (['estimateDate', 'validUntilDate', 'createdAt', 'updatedAt', 'expectedStartDate', 'expectedCompletionDate'].includes(key) && value) {
               return value.toDate ? value.toDate() : (isValid(new Date(value)) ? new Date(value) : null);
           }
           return value;
       };
       const loadedDraft = JSON.parse(JSON.stringify(remoteDraft), fromJSON);
       
       initialEstimate = {
         ...baseEstimate,
         ...loadedDraft,
         userId: user.uid,
         business: { ...baseEstimate.business, ...loadedDraft.business },
         client: { ...baseEstimate.client, ...loadedDraft.client },
         summary: { ...baseEstimate.summary, ...loadedDraft.summary },
         homeRemodeling: { ...baseEstimate.homeRemodeling, ...loadedDraft.homeRemodeling },
         roofing: { ...baseEstimate.roofing, ...loadedDraft.roofing },
         hvac: { ...baseEstimate.hvac, ...loadedDraft.hvac },
         plumbing: { ...baseEstimate.plumbing, ...loadedDraft.plumbing },
         electrical: { ...baseEstimate.electrical, ...loadedDraft.electrical },
         landscaping: { ...baseEstimate.landscaping, ...loadedDraft.landscaping },
         cleaning: { ...baseEstimate.cleaning, ...loadedDraft.cleaning },
         autoRepair: { ...baseEstimate.autoRepair, ...loadedDraft.autoRepair },
         construction: { ...baseEstimate.construction, ...loadedDraft.construction },
         itFreelance: { ...baseEstimate.itFreelance, ...loadedDraft.itFreelance },
       };

    } else {
        const newEstimate = getInitialEstimate();
        newEstimate.id = crypto.randomUUID();
        newEstimate.estimateNumber = `EST-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        initialEstimate = {...newEstimate, userId: user.uid};
    }
    
    setDocument(initialEstimate);
    setBackgroundColor(initialEstimate.backgroundColor || '#FFFFFF');
    setTextColor(initialEstimate.textColor || '#374151');
    
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

    const dateFields = ['estimateDate', 'validUntilDate'];
    dateFields.forEach(field => {
      const dateVal = (document as any)[field];
      if (dateVal) {
        const normalized = normalizeDate(dateVal);
        if (normalized) draftToSave[field] = normalized;
      }
    });

    if (document.homeRemodeling) {
      draftToSave.homeRemodeling = { ...document.homeRemodeling };
      const start = normalizeDate(document.homeRemodeling.expectedStartDate);
      if(start) draftToSave.homeRemodeling.expectedStartDate = start;
      const end = normalizeDate(document.homeRemodeling.expectedCompletionDate);
      if(end) draftToSave.homeRemodeling.expectedCompletionDate = end;
    }
    
    if (document.roofing) {
        draftToSave.roofing = { ...document.roofing };
    }
    
    if (document.hvac) {
        draftToSave.hvac = { ...document.hvac };
    }

    if (document.plumbing) {
        draftToSave.plumbing = { ...document.plumbing };
    }

    if (!document.createdAt) {
      draftToSave.createdAt = serverTimestamp();
    }
    
    const docRef = doc(firestore, ESTIMATES_COLLECTION, document.id);
    setDocumentNonBlocking(docRef, draftToSave, { merge: true });

    toast({
      title: "Estimate Draft Saved",
      description: "Your estimate draft has been saved online.",
    });
    
    if (!searchParams.get('draftId')) {
      router.push(`/create-estimate?draftId=${document.id}`, { scroll: false });
    }
  };

  const handleNew = () => {
    if (!user) return;
    const newEstimate = {...getInitialEstimate(), userId: user.uid};
    newEstimate.id = crypto.randomUUID();
    newEstimate.estimateNumber = `EST-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setDocument(newEstimate);
    setBackgroundColor('#FFFFFF');
    setTextColor('#374151');
    if (typeof window !== 'undefined' && window.document) {
        const computedColor = getComputedStyle(window.document.documentElement).getPropertyValue('--primary').trim();
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
      if (!document) return;
      handleSaveDraft();
      const url = `${window.location.origin}/estimate/${document.id}`;
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
      // First, save the latest version to ensure the emailed PDF is up-to-date.
      handleSaveDraft();

      const result = await sendDocumentByEmail({ docId: document.id, docType: 'estimate' });
      
      if (result.success) {
        toast({
          title: "Email Sent",
          description: "The estimate has been successfully sent to the client.",
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
        const newDocument = computeSummary(document);
         if (JSON.stringify(newDocument.summary) !== JSON.stringify(document.summary)) {
            setDocument(newDocument);
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
            <h1 className="text-3xl font-bold font-headline">Create Estimate</h1>
            <p className="text-muted-foreground">Fill out the form to generate your professional estimate.</p>
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
              <Button onClick={handleEmail} disabled={isSendingEmail}>
                {isSendingEmail ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-5 w-5" />
                )}
                Email
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="space-y-12">
               <div className="mb-12">
                <h2 className="text-2xl font-bold font-headline mb-6 text-center">Select a Template</h2>
                 <DocumentTemplateSelector 
                  selectedTemplate={document.template}
                  onSelectTemplate={(template) => setDocument(prev => prev ? ({...prev, template}) : null)}
                  documentType="estimate"
                  category={document.category}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-headline mb-4 text-center lg:text-left">Fill in Details</h2>
                <DocumentForm 
                  document={document as Estimate} 
                  setDocument={setDocument as React.Dispatch<React.SetStateAction<Estimate>>} 
                  accentColor={accentColor}
                  setAccentColor={setAccentColor}
                  backgroundColor={backgroundColor}
                  setBackgroundColor={setBackgroundColor}
                  textColor={textColor}
                  setTextColor={setTextColor}
                  toast={toast}
                  documentType="estimate"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="sticky top-24">
                <h2 className="text-2xl font-bold font-headline mb-6">Live Preview</h2>
                <ClientDocumentPreview document={document} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />
            </div>
          </div>
        </div>
      </div>
      {document && <PrintableDocument doc={document} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />}
    </>
  );
}
