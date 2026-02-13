'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import type { Estimate, LineItem, Quote, AuditLogEntry, Client } from '@/lib/types';
import { DocumentForm } from '@/components/document-form';
import { ClientDocumentPreview } from '@/components/document-preview';
import { Button } from '@/components/ui/button';
import { Printer, FilePlus, LayoutDashboard, Edit, Share2, Mail, Loader2, MoreVertical, Brush, X } from 'lucide-react';
import { addDays, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { useUserAuth } from '@/context/auth-provider';
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
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '@/components/ui/skeleton';
import { toNumberSafe, toDateSafe } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { checkUsageLimit } from '@/lib/limits';
import { UpgradeModal } from '@/components/upgrade-modal';
import { getCollectionPath } from '@/lib/data-helper';

const ESTIMATES_COLLECTION = 'estimates';
const CLIENTS_COLLECTION = 'clients';

const getInitialLineItem = (): LineItem => ({ id: crypto.randomUUID(), name: '', description: '', quantity: 1, unitPrice: 0, taxable: false });

const normalizeAuditLog = (auditLog: any): AuditLogEntry[] => {
  if (!auditLog) return [];
  const entries = Array.isArray(auditLog) ? auditLog : Object.values(auditLog);
  return entries.map(entry => ({
    ...entry,
    timestamp: toDateSafe(entry.timestamp)
  }));
};

const diff = (original: any, updated: any): string[] => {
  const changes: string[] = [];
  if (!original || !updated) return changes;

  const formatKey = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

  const isDate = (value: any) => value instanceof Date || (value && typeof value.toDate === 'function');

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'empty';
    if (isDate(value)) return toDateSafe(value)!.toLocaleDateString();
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) return '[details]';
    if (typeof value === 'boolean') return value ? 'checked' : 'unchecked';
    const strValue = String(value);
    return `"${strValue.substring(0, 30)}${strValue.length > 30 ? '...' : ''}"`;
  };

  const compareValues = (key: string, originalValue: any, updatedValue: any, prefix = '') => {
    let originalComp = JSON.stringify(originalValue);
    let updatedComp = JSON.stringify(updatedValue);

    if (isDate(originalValue) || isDate(updatedValue)) {
      originalComp = originalValue ? toDateSafe(originalValue)?.toISOString() ?? 'null' : 'null';
      updatedComp = updatedValue ? toDateSafe(updatedValue)?.toISOString() ?? 'null' : 'null';
    }

    if (originalComp !== updatedComp) {
      const keyName = formatKey(key);
      changes.push(`${prefix}${keyName} changed from ${formatValue(originalValue)} to ${formatValue(updatedValue)}`);
    }
  };

  const allTopLevelKeys = new Set([...Object.keys(original), ...Object.keys(updated)]);
  allTopLevelKeys.forEach(key => {
    if (['id', 'auditLog', 'updatedAt', 'createdAt', 'lineItems', 'userId', 'companyId', 'isPublic', 'documentType'].includes(key)) return;

    const originalValue = original[key];
    const updatedValue = updated[key];

    if (updatedValue && typeof updatedValue === 'object' && !Array.isArray(updatedValue) && !isDate(updatedValue)) {
      const subKeys = new Set([...Object.keys(originalValue || {}), ...Object.keys(updatedValue)]);
      subKeys.forEach(subKey => {
        if (typeof updatedValue[subKey] !== 'object' || isDate(updatedValue[subKey]) || Array.isArray(updatedValue[subKey])) {
          compareValues(subKey, originalValue?.[subKey], updatedValue?.[subKey], `${formatKey(key)} > `);
        }
      });
    } else {
      compareValues(key, originalValue, updatedValue);
    }
  });

  const originalItems = original.lineItems || [];
  const updatedItems = updated.lineItems || [];
  if (JSON.stringify(originalItems) !== JSON.stringify(updatedItems)) {
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

  lineItems: [{ ...getInitialLineItem(), name: 'Website Development', description: 'Sample Service (e.g., Website Development)', unitPrice: 0 }],

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
    roofType: 'Shingle',
    squareFootage: null,
    pitch: 'Medium (5/12 – 7/12)',
    tearOffRequired: false,
    underlaymentType: 'Synthetic Underlayment',
    dumpsterFee: null,
  },
  hvac: {
    unitType: 'AC',
    modelNumber: '',
    refrigerantType: '',
    maintenanceFee: null,
  },
  plumbing: {
    serviceType: 'Leak Repair',
    pipeMaterial: 'Copper',
    fixtureName: '',
    emergencyFee: null,
  },
  electrical: {
    serviceType: 'Install',
    voltage: '120V',
    fixtureDevice: '',
    permitCost: null,
  },
  landscaping: {
    serviceType: 'Lawn Mowing',
    lawnSquareFootage: null,
    equipmentFee: null,
    disposalFee: null,
  },
  cleaning: {
    cleaningType: 'Standard',
    numberOfRooms: null,
    squareFootage: null,
    suppliesFee: null,
    recurringSchedule: 'One-time',
  },
  autoRepair: {
    vehicleMake: '',
    vehicleModel: '',
    year: null,
    licensePlate: '',
    vin: '',
    odometer: null,
    laborHours: null,
    laborRate: null,
    diagnosticFee: null,
    shopSupplyFee: null,
    towingFee: null,
    parts: [],
  },
  construction: {
    jobSiteAddress: '',
    permitNumber: '',
    laborRate: null,
    equipmentRentalFees: null,
    wasteDisposalFee: null,
    projectStartDate: null,
    projectEndDate: null,
  },
  itFreelance: {
    projectName: '',
    hourlyRate: null,
    fixedRate: null,
    hoursLogged: null,
    milestoneDescription: '',
  },
});


function PrintableDocument({ doc, accentColor }: { doc: Estimate | Quote, accentColor: string }) {
  const serializedData = useMemo(() => JSON.stringify(doc), [doc]);

  useEffect(() => {
    const container = document.getElementById('print-container');
    if (container) {
      ReactDOM.render(
        <ClientDocumentPreview
          document={JSON.parse(serializedData)}
          accentColor={accentColor}
          backgroundColor={doc.backgroundColor || '#FFFFFF'}
          textColor={doc.textColor || '#374151'}
          id="estimate-preview-print"
          isPrint={true}
        />,
        container
      );
    }
  }, [serializedData, doc, accentColor]);

  return null; // This component does not render anything itself
}

import { hasAccess } from '@/lib/permissions';

export default function CreateEstimatePage() {
  const { user, userProfile, isLoading: isAuthLoading } = useUserAuth();
  const [document, setDocument] = useState<Estimate | Quote | null>(null);
  const [originalDocument, setOriginalDocument] = useState<Estimate | Quote | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#374151');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const { firestore } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();

  const draftId = searchParams.get('draftId');
  const prefillClientId = searchParams.get('clientId');
  const companyId = userProfile?.companyId;

  // Permission check
  useEffect(() => {
    if (isAuthLoading || !userProfile) return;

    if (!hasAccess(userProfile, 'create:estimate')) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to create estimates.",
        variant: "destructive",
      });
      router.push('/dashboard');
    }
  }, [userProfile, isAuthLoading, router, toast]);

  const docRef = useMemoFirebase(() => {
    if (!draftId || !firestore) return null;
    const path = getCollectionPath(userProfile, ESTIMATES_COLLECTION);
    return path ? doc(firestore, path, draftId) : null;
  }, [draftId, firestore, userProfile]);

  const clientRef = useMemoFirebase(() => {
    if (!prefillClientId || !firestore || !companyId) return null;
    return doc(firestore, 'companies', companyId, CLIENTS_COLLECTION, prefillClientId);
  }, [prefillClientId, firestore, companyId]);

  const { data: remoteDraft, isLoading: isDraftLoading } = useDoc<Estimate>(docRef);
  const { data: prefillClient, isLoading: isClientLoading } = useDoc<Client>(clientRef);

  const processedDocument = useMemo(() => {
    if (!document) return null;
    const subtotal = document.lineItems.reduce((acc, item) => acc + (toNumberSafe(item.quantity)) * (toNumberSafe(item.unitPrice)), 0);
    const taxableTotal = document.lineItems.filter(i => i.taxable !== false).reduce((s, i) => s + ((toNumberSafe(i.quantity)) * (toNumberSafe(i.unitPrice))), 0);
    const taxPercentage = toNumberSafe(document.summary.taxPercentage);
    const taxAmount = taxableTotal * (taxPercentage / 100);
    const discountAmount = toNumberSafe(document.summary.discount);
    const shippingCost = toNumberSafe(document.summary.shippingCost);
    const grandTotal = subtotal + taxAmount - discountAmount + shippingCost;

    return {
      ...document,
      summary: { ...document.summary, subtotal, taxAmount, grandTotal }
    };
  }, [document]);

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
    if (initialDocument.accentColor) setAccentColor(initialDocument.accentColor);
    if (initialDocument.backgroundColor) setBackgroundColor(initialDocument.backgroundColor);
    if (initialDocument.textColor) setTextColor(initialDocument.textColor);

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

  const handleSaveDraft = async () => {
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

    // LIMIT CHECK FOR FREE PLAN
    if (isNew && userProfile?.plan === 'free') {
      const canCreate = await checkUsageLimit(user.uid, ESTIMATES_COLLECTION);
      if (!canCreate) {
        setIsUpgradeModalOpen(true);
        return;
      }
    }

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
      ...processedDocument,
      id: newId,
      userId: user.uid,
      companyId: companyId,
      client: {
        ...document.client,
        clientId: document.client.clientId,
      },
      updatedAt: Timestamp.now(),
      auditLog: updatedAuditLog.map(log => ({ ...log, timestamp: safeTimestamp(log.timestamp) })),
      estimateDate: safeTimestamp(document.estimateDate),
      validUntilDate: safeTimestamp(document.validUntilDate),
      createdAt: safeTimestamp(document.createdAt) || Timestamp.now(),
      accentColor: document.accentColor || accentColor,
      backgroundColor: document.backgroundColor || backgroundColor,
      textColor: document.textColor || textColor,
    };

    // Correctly handle optional category data
    if (document.homeRemodeling) {
      draftToSave.homeRemodeling = { ...document.homeRemodeling };
      const start = safeTimestamp(document.homeRemodeling.expectedStartDate);
      if (start) draftToSave.homeRemodeling.expectedStartDate = start;
      const end = safeTimestamp(document.homeRemodeling.expectedCompletionDate);
      if (end) draftToSave.homeRemodeling.expectedCompletionDate = end;
    }

    const path = getCollectionPath(userProfile, ESTIMATES_COLLECTION);
    if (!path) {
      toast({ title: "Error", description: "Could not determine save path.", variant: "destructive" });
      return;
    }
    const finalDocRef = doc(firestore, path, newId);
    await setDocumentNonBlocking(finalDocRef, draftToSave, { merge: true });

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


  const handleNew = async () => {
    if (!user || !companyId || !userProfile) return;

    // LIMIT CHECK FOR FREE PLAN
    if (userProfile.plan === 'free') {
      const canCreate = await checkUsageLimit(user.uid, ESTIMATES_COLLECTION);
      if (!canCreate) {
        setIsUpgradeModalOpen(true);
        return;
      }
    }

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

    setTimeout(async () => {
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
    }, 0);
  };

  if (!processedDocument) {
    return (
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-[800px] w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-[800px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        featureName="Estimates"
      />
      <div className="container mx-auto p-4 md:px-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-xl font-bold font-headline">Create Estimate</h1>
            <p className="text-sm text-muted-foreground">Fill out the form to generate your professional estimate.</p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
            <Button onClick={handleSaveDraft} className="w-full md:w-auto h-9 px-4 text-sm" disabled={!document}>
              <Edit className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button onClick={handlePrint} variant="outline" className="w-full md:w-auto h-9 px-4 text-sm" disabled={!document}>
              <Printer className="mr-2 h-4 w-4" /> Save as PDF
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <Brush className="mr-2 h-4 w-4" /> Change Template
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleNew}>
                  <FilePlus className="mr-2 h-4 w-4" /> New
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

        <div className="flex gap-4">
          <motion.div
            animate={{ width: isSidebarOpen ? '35%' : '50%' }}
            transition={{ duration: 0.3 }}
            className="transition-all"
          >
            <div className="space-y-6">
              <h2 className="text-xl font-semibold tracking-tight mb-4 text-center lg:text-left">Fill in Details</h2>
              <DocumentForm
                document={document!}
                setDocument={setDocument as React.Dispatch<React.SetStateAction<Estimate | Quote>>}
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
          </motion.div>
          <motion.div
            animate={{ width: isSidebarOpen ? '35%' : '50%' }}
            transition={{ duration: 0.3 }}
            className="transition-all"
          >
            <div className="sticky top-24 space-y-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight mb-4">Live Preview</h2>
                <ClientDocumentPreview document={processedDocument} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />
              </div>
            </div>
          </motion.div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '30%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="h-full sticky top-24">
                  <div className="h-full w-full bg-card rounded-xl p-4 overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold tracking-tight">Templates</h2>
                      <Button onClick={() => setIsSidebarOpen(false)} variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-[calc(100vh-12rem)]">
                      <DocumentTemplateSelector
                        selectedTemplate={document!.template}
                        onSelectTemplate={(template) => setDocument(prev => prev ? ({ ...prev, template }) : null)}
                        documentType="estimate"
                        category={document!.category}
                      />
                    </ScrollArea>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {processedDocument && <PrintableDocument doc={processedDocument} accentColor={accentColor} />}
    </>
  );
}
