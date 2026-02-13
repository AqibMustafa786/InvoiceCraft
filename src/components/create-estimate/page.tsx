

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { Estimate, LineItem, Quote } from '@/lib/types';
import { DocumentForm } from '@/components/document-form';
import { ClientDocumentPreview } from '@/components/document-preview';
import { Button } from '@/components/ui/button';
import { Printer, FilePlus, LayoutDashboard, Edit, Share2, Mail, Loader2, MoreVertical, Brush } from 'lucide-react';
import { addDays, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { useUserAuth } from '@/context/auth-provider';
import { doc, serverTimestamp, Timestamp, collection, addDoc, getDoc, setDoc, getDocs, query, where, CollectionReference } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { sendDocumentByEmail } from '@/ai/flows/send-document-flow';
import { DocumentTemplateSelector } from '@/components/document-template-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';

const ESTIMATES_COLLECTION = 'estimates';

const getInitialLineItem = (): LineItem => ({ id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0, taxable: false });

const getInitialEstimate = (): Omit<Estimate, 'userId' | 'companyId'> => ({
  id: '',
  estimateNumber: '',
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

  termsAndConditions: 'This {docType} is valid for 30 days. Prices are subject to change thereafter. Payment Terms: 50% upfront, 50% on completion.',

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
    roofMaterial: 'Asphalt Shingle',
    shingleBrand: 'GAF',
    roofSize: null,
    layersToRemove: '1 layer',
    roofPitch: 'Medium (5/12 – 7/12)',
    underlaymentType: 'Synthetic Underlayment',
    flashingDetails: '',
    ventilationSystem: '',
    gutterRepairNeeded: false,
    warranty: '',
    estimatedTimeline: '',
    inspectionRequired: 'No',
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
  const { user, userProfile } = useUserAuth();
  const [document, setDocument] = useState<Estimate | Quote | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#374151');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const { firestore } = useFirebase();
  const router = useRouter();

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
    // Initialize with a default document client-side to ensure the form is always visible
    const newDocId = firestore ? doc(collection(firestore, 'companies', 'temp', ESTIMATES_COLLECTION)).id : crypto.randomUUID();
    const initialDoc: Estimate = {
      ...getInitialEstimate(),
      id: newDocId,
      userId: user?.uid || '',
      companyId: userProfile?.companyId || '',
    };
    setDocument(initialDoc);
  }, [user, userProfile, firestore]);

  useEffect(() => {
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

  const handleSaveDraft = () => {
    if (!document || !firestore || !user || !userProfile?.companyId) {
      toast({
        title: "Cannot Save Draft",
        description: "You must be logged in to save a draft.",
        variant: "destructive",
      });
      return;
    }

    const companyId = userProfile.companyId;

    const normalizeDate = (val: any): Timestamp | null => {
      if (!val) return null;
      if (val instanceof Timestamp) return val;
      const d = val.toDate ? val.toDate() : new Date(val);
      return isValid(d) ? Timestamp.fromDate(d) : null;
    };

    const draftToSave: any = {
      ...document,
      userId: user.uid,
      companyId: companyId,
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
      if (start) draftToSave.homeRemodeling.expectedStartDate = start;
      const end = normalizeDate(document.homeRemodeling.expectedCompletionDate);
      if (end) draftToSave.homeRemodeling.expectedCompletionDate = end;
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

    const finalDocRef = doc(firestore, 'companies', companyId, ESTIMATES_COLLECTION, document.id);
    setDocumentNonBlocking(finalDocRef, draftToSave, { merge: true });

    toast({
      title: "Estimate Draft Saved",
      description: "Your estimate draft has been saved online.",
    });
  };

  const handleNew = () => {
    const newDocId = firestore ? doc(collection(firestore, 'companies', 'temp', ESTIMATES_COLLECTION)).id : crypto.randomUUID();
    const newDoc: Estimate = {
      ...getInitialEstimate(),
      id: newDocId,
      userId: user?.uid || '',
      companyId: userProfile?.companyId || '',
    };
    setDocument(newDoc);
    router.push('/create-estimate', { scroll: false });
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

  return (
    <>
      <div className="container mx-auto p-4 md:px-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-headline">Create Estimate</h1>
            <p className="text-muted-foreground">Fill out the form to generate your professional estimate.</p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
            <Button onClick={handleSaveDraft} className="w-full md:w-auto" disabled={!document}>
              <Edit className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button onClick={handlePrint} variant="outline" className="w-full md:w-auto" disabled={!document}>
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
                <DropdownMenuItem onClick={handleEmail} disabled={isSendingEmail || !document}>
                  {isSendingEmail ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<Mail className="mr-2 h-4 w-4" />)}
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare} disabled={!document}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {!document ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-[800px] w-full" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold font-headline mb-4 text-center lg:text-left">Fill in Details</h2>
                  <DocumentForm
                    document={document}
                    setDocument={setDocument}
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
              <div className="sticky top-24 space-y-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Brush className="mr-2 h-4 w-4" />
                      Change Template
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Select a Template</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <DocumentTemplateSelector
                        selectedTemplate={document.template}
                        onSelectTemplate={(template) => setDocument(prev => prev ? ({ ...prev, template }) : null)}
                        documentType="estimate"
                        category={document.category}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
                <div>
                  <h2 className="text-2xl font-bold font-headline mb-4">Live Preview</h2>
                  <ClientDocumentPreview document={document} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {document && <PrintableDocument doc={document} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />}
    </>
  );
}

