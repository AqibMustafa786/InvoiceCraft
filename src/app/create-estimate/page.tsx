
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { Estimate, LineItem, Quote, AuditLogEntry, Client } from '@/lib/types';
import { DocumentForm } from '@/components/document-form';
import { ClientDocumentPreview } from '@/components/document-preview';
import { Button } from '@/components/ui/button';
import { Printer, FilePlus, LayoutDashboard, Edit, Share2, Mail, Loader2, MoreVertical, Brush } from 'lucide-react';
import { addDays, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { useAuth } from '@/context/auth-provider';
import { doc, serverTimestamp, Timestamp, collection, addDoc, getDoc, setDoc, getDocs, query, where, CollectionReference } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { sendDocumentByEmail } from '@/app/actions';
import { DocumentTemplateSelector } from '@/components/document-template-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { toNumberSafe, toDateSafe } from '@/lib/utils';

const ESTIMATES_COLLECTION = 'estimates';
const CLIENTS_COLLECTION = 'clients';

const getInitialLineItem = (): LineItem => ({ id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0, taxable: false });

const normalizeAuditLog = (auditLog: any): AuditLogEntry[] => {
  if (Array.isArray(auditLog)) return auditLog;
  if (auditLog && typeof auditLog === 'object') {
    return Object.values(auditLog);
  }
  return [];
};

const diff = (original: any, updated: any): string[] => {
    const changes: string[] = [];
    if (!original || !updated) return changes;

    const allKeys = new Set([...Object.keys(original), ...Object.keys(updated)]);
    const formatKey = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    const isDate = (value: any) => value instanceof Date || (value && typeof value.toDate === 'function');

    allKeys.forEach(key => {
        if (key === 'auditLog' || key === 'updatedAt' || key === 'createdAt' || key === 'lineItems') return;

        let originalValue = original[key];
        let updatedValue = updated[key];

        if (key === 'logoUrl') {
            if (originalValue !== updatedValue) {
                changes.push(updatedValue ? 'Business logo was updated' : 'Business logo was removed');
            }
            return;
        }

        if (isDate(originalValue)) originalValue = toDateSafe(originalValue);
        if (isDate(updatedValue)) updatedValue = toDateSafe(updatedValue);
        
        let originalComp = (originalValue instanceof Date) ? originalValue.toISOString() : JSON.stringify(originalValue);
        let updatedComp = (updatedValue instanceof Date) ? updatedValue.toISOString() : JSON.stringify(updatedValue);

        if (originalComp !== updatedComp) {
            if (typeof updatedValue === 'object' && updatedValue !== null && !Array.isArray(updatedValue) && !(updatedValue instanceof Date)) {
                 changes.push(`Updated ${formatKey(key)}`);
            } else {
                 changes.push(`${formatKey(key)} was changed`);
            }
        }
    });

     // Line item changes
    const originalItems = original.lineItems || [];
    const updatedItems = updated.lineItems || [];
    if(JSON.stringify(originalItems) !== JSON.stringify(updatedItems)) {
        changes.push('Line items were updated');
    }

    return changes;
};

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
    clientId: '',
    name: 'Client Name',
    companyName: 'Client Company',
    address: '456 Oak Ave, Someplace, USA 54321',
    phone: '+1 (987) 654-3210',
    email: 'client@example.com',
    projectLocation: '',
  },
  
  lineItems: [{ ...getInitialLineItem(), name: 'Sample Service (e.g., Website Development)', unitPrice: 0 }],

  summary: {
    subtotal: 0,
    taxPercentage: 8.25,
    taxAmount: 0,
    discount: 0,
    grandTotal: 0,
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
  auditLog: [],

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
  const { user, userProfile, isLoading: isAuthLoading } = useAuth();
  const [document, setDocument] = useState<Estimate | Quote | null>(null);
  const [originalDocument, setOriginalDocument] = useState<Estimate | Quote | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#374151');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();
  
  const { firestore } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const draftId = searchParams.get('draftId');
  const prefillClientId = searchParams.get('clientId');
  const companyId = userProfile?.companyId;

  const docRef = useMemoFirebase(() => {
    if (!draftId || !firestore || !companyId) return null;
    return doc(firestore, 'companies', companyId, ESTIMATES_COLLECTION, draftId);
  }, [draftId, firestore, companyId]);

  const clientRef = useMemoFirebase(() => {
    if (!prefillClientId || !firestore || !companyId) return null;
    return doc(firestore, 'companies', companyId, CLIENTS_COLLECTION, prefillClientId);
  }, [prefillClientId, firestore, companyId]);

  const { data: remoteDraft, isLoading: isDraftLoading } = useDoc<Estimate>(docRef);
  const { data: prefillClient, isLoading: isClientLoading } = useDoc<Client>(clientRef);

  const computeSummary = useCallback((est: Estimate | Quote): Estimate | Quote => {
    const subtotal = est.lineItems.reduce((acc, item) => acc + (toNumberSafe(item.quantity)) * (toNumberSafe(item.unitPrice)), 0);
    const taxableTotal = est.lineItems.filter(i => i.taxable !== false).reduce((s, i) => s + ((toNumberSafe(i.quantity)) * (toNumberSafe(i.unitPrice))), 0);
    const taxPercentage = toNumberSafe(est.summary.taxPercentage);
    const taxAmount = taxableTotal * (taxPercentage / 100);
    const discountAmount = toNumberSafe(est.summary.discount);
    const shippingCost = toNumberSafe(est.summary.shippingCost);
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

  const processedDocument = useMemo(() => {
    if (!document) return null;
    return computeSummary(document);
  }, [document, computeSummary]);

  useEffect(() => {
    if (isAuthLoading || (draftId && isDraftLoading) || (prefillClientId && isClientLoading)) return;
    if (!user || !userProfile) {
        router.push('/login');
        return;
    }

    let initialDocument: Estimate;
    const companyId = userProfile.companyId;

    const processData = (data: any): any => {
        const processed: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];
                if (value && typeof value === 'object' && value.toDate) { // Firestore Timestamp check
                    processed[key] = toDateSafe(value);
                } else if (value && typeof value === 'object' && !Array.isArray(value)) {
                    processed[key] = processData(value); // Recurse for nested objects
                } else {
                    processed[key] = value;
                }
            }
        }
        return processed;
    };


    if (draftId && remoteDraft) {
       const baseEstimate = getInitialEstimate();
       const loadedDraft = processData(remoteDraft);
       
        initialDocument = {
         ...baseEstimate,
         ...loadedDraft,
         id: draftId,
         userId: user.uid,
         companyId: companyId || '',
         business: { ...baseEstimate.business, ...loadedDraft.business },
         client: { ...baseEstimate.client, ...loadedDraft.client },
         summary: { ...baseEstimate.summary, ...loadedDraft.summary },
         homeRemodeling: { ...baseEstimate.homeRemodeling, ...(loadedDraft.homeRemodeling || {}) },
         roofing: { ...baseEstimate.roofing, ...(loadedDraft.roofing || {}) },
         hvac: { ...baseEstimate.hvac, ...(loadedDraft.hvac || {}) },
         plumbing: { ...baseEstimate.plumbing, ...(loadedDraft.plumbing || {}) },
         electrical: { ...baseEstimate.electrical, ...(loadedDraft.electrical || {}) },
         landscaping: { ...baseEstimate.landscaping, ...(loadedDraft.landscaping || {}) },
         cleaning: { ...baseEstimate.cleaning, ...(loadedDraft.cleaning || {}) },
         autoRepair: { ...baseEstimate.autoRepair, ...(loadedDraft.autoRepair || {}) },
         construction: { ...baseEstimate.construction, ...(loadedDraft.construction || {}) },
         itFreelance: { ...baseEstimate.itFreelance, ...(loadedDraft.itFreelance || {}) },
       };

    } else {
        const newDocId = firestore ? doc(collection(firestore, 'companies', 'temp', ESTIMATES_COLLECTION)).id : crypto.randomUUID();
        const newAuditLogEntry: AuditLogEntry = {
            id: crypto.randomUUID(),
            action: 'created',
            timestamp: new Date(),
            user: { name: user.displayName || user.email, email: user.email },
            version: 1,
        };
        initialDocument = {
            ...getInitialEstimate(),
            id: newDocId, // temporary random ID
            estimateNumber: `EST-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            userId: user.uid,
            companyId: companyId || '',
            auditLog: [newAuditLogEntry]
        };

        if (prefillClient) {
          initialDocument.client = {
            clientId: prefillClient.id,
            name: prefillClient.name,
            companyName: prefillClient.companyName,
            address: prefillClient.address,
            phone: prefillClient.phone || '',
            email: prefillClient.email,
            projectLocation: '',
          };
        } else if (prefillClientId) {
          initialDocument.client = {
            clientId: prefillClientId,
            name: searchParams.get('clientName') || '',
            address: searchParams.get('clientAddress') || '',
            email: searchParams.get('clientEmail') || '',
            phone: searchParams.get('clientPhone') || '',
            companyName: '',
            projectLocation: '',
          }
        }
    }
    
    setDocument(initialDocument);
    setOriginalDocument(JSON.parse(JSON.stringify(initialDocument)));

  }, [draftId, remoteDraft, isDraftLoading, prefillClientId, prefillClient, isClientLoading, user, userProfile, isAuthLoading, companyId, firestore, router, searchParams]);


  useEffect(() => {
     if (typeof window !== 'undefined' && window.document) {
        const computedColor = getComputedStyle(window.document.documentElement).getPropertyValue('--primary').trim();
        if (computedColor) {
           setAccentColor(`hsl(${computedColor})`);
        }
    }
  }, []);

  const generateNewId = (doc: Estimate | Quote): string => {
    const clientName = doc.client.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const estimateNumber = doc.estimateNumber || 'new';
    return `${clientName}-${estimateNumber}`;
  }

  const handlePrint = () => {
    window.print();
  };
  
    const handleSaveDraft = () => {
    if (!document || !firestore || !user || !userProfile?.companyId || !originalDocument) {
         toast({
          title: "Cannot Save Draft",
          description: "You must be logged in to save a draft.",
          variant: "destructive",
        });
        return;
    }

    const companyId = userProfile.companyId;
    const isNew = !searchParams.get('draftId');
    const newId = isNew ? generateNewId(document) : document.id;

    const changes = diff(originalDocument, document);
    const existingLog = normalizeAuditLog(document.auditLog);
    
    let updatedAuditLog: AuditLogEntry[] = [...existingLog];

    if (changes.length > 0) {
        const newVersion = (existingLog[existingLog.length - 1]?.version || 0) + 1;
        const newAuditLogEntry: AuditLogEntry = {
            id: crypto.randomUUID(),
            action: 'updated',
            timestamp: new Date(),
            user: { name: user.displayName || user.email, email: user.email },
            version: newVersion,
            changes: changes,
        };
        updatedAuditLog.push(newAuditLogEntry);
    }
    

    const safeTimestamp = (value: any): Timestamp | null => {
        if (!value) return null;
        if (value instanceof Timestamp) return value;
        const d = value.toDate ? value.toDate() : new Date(value);
        return isValid(d) ? Timestamp.fromDate(d) : null;
    };

    const draftToSave: any = {
      ...document,
      id: newId,
      userId: user.uid, 
      companyId: companyId,
      client: {
        ...document.client,
        clientId: document.client.clientId, // Ensure clientId is saved
      },
      updatedAt: Timestamp.now(),
      auditLog: updatedAuditLog.map(log => ({ ...log, timestamp: safeTimestamp(log.timestamp) })),
      estimateDate: safeTimestamp(document.estimateDate),
      validUntilDate: safeTimestamp(document.validUntilDate),
      createdAt: safeTimestamp(document.createdAt) || Timestamp.now(),
    };

    if (document.homeRemodeling) {
      draftToSave.homeRemodeling = { ...document.homeRemodeling };
      const start = safeTimestamp(document.homeRemodeling.expectedStartDate);
      if(start) draftToSave.homeRemodeling.expectedStartDate = start;
      const end = safeTimestamp(document.homeRemodeling.expectedCompletionDate);
      if(end) draftToSave.homeRemodeling.expectedCompletionDate = end;
    }
    
    const finalDocRef = doc(firestore, 'companies', companyId, ESTIMATES_COLLECTION, newId);
    setDocumentNonBlocking(finalDocRef, draftToSave, { merge: true });

    toast({
      title: "Estimate Draft Saved",
      description: "Your estimate draft has been saved online.",
    });

    const updatedDocState = { ...document, id: newId, auditLog: updatedAuditLog };
    setDocument(updatedDocState);
    setOriginalDocument(JSON.parse(JSON.stringify(updatedDocState)));

    if (isNew) {
      router.push(`/create-estimate?draftId=${newId}`, { scroll: false });
    }
  };


  const handleNew = () => {
    if(!user || !companyId) return;
    const newDocId = firestore ? doc(collection(firestore, 'companies', companyId, ESTIMATES_COLLECTION)).id : crypto.randomUUID();
    const newAuditLogEntry: AuditLogEntry = {
        id: crypto.randomUUID(),
        action: 'created',
        timestamp: new Date(),
        user: { name: user.displayName || user.email, email: user.email },
        version: 1,
    };
    const newDoc: Estimate = { 
        ...getInitialEstimate(), 
        id: newDocId, 
        estimateNumber: `EST-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        userId: user.uid, 
        companyId: companyId,
        auditLog: [newAuditLogEntry]
    };
    setDocument(newDoc);
    setOriginalDocument(JSON.parse(JSON.stringify(newDoc)));
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

  if (!processedDocument) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
            <div className="lg:col-span-1 space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="hidden lg:block lg:col-span-1">
                <Skeleton className="h-[800px] w-full" />
            </div>
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
                        {isSendingEmail ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" />) : ( <Mail className="mr-2 h-4 w-4" /> )}
                         Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare} disabled={!document}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="space-y-6">
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
            <div className="lg:col-span-1 order-1 lg:order-2">
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
                                  onSelectTemplate={(template) => setDocument(prev => prev ? ({...prev, template}) : null)}
                                  documentType="estimate"
                                  category={document.category}
                              />
                          </div>
                      </SheetContent>
                  </Sheet>
                  <div>
                    <h2 className="text-2xl font-bold font-headline mb-4">Live Preview</h2>
                    <ClientDocumentPreview document={processedDocument} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />
                  </div>
              </div>
            </div>
        </div>
      </div>
      {processedDocument && <PrintableDocument doc={processedDocument} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />}
    </>
  );
}
