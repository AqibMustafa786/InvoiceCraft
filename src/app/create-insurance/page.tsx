'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import type { InsuranceDocument, LineItem, AuditLogEntry, Client } from '@/lib/types';
import { InsuranceForm } from '@/components/insurance-form';
import { InsurancePreview } from '@/components/insurance-preview';
import { Button } from '@/components/ui/button';
import { Printer, FilePlus, LayoutDashboard, Brush, MoreVertical, Edit, History, Loader2, Copy, Archive, ShieldCheck, Share2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InsuranceTemplateSelector } from '@/components/insurance-template-selector';
import Link from 'next/link';
import { serverTimestamp, doc, collection, Timestamp } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { addDays, isValid } from 'date-fns';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { useUserAuth } from '@/context/auth-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { checkUsageLimit } from '@/lib/limits';
import { UpgradeModal } from '@/components/upgrade-modal';
import { getCollectionPath } from '@/lib/data-helper';
import { hasAccess } from '@/lib/permissions';
import { Skeleton } from '@/components/ui/skeleton';
import { HistoryModal } from '@/components/dashboard/history-modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

const INSURANCE_COLLECTION = 'insurance';
const CLIENTS_COLLECTION = 'clients';

const getInitialLineItem = (): LineItem => ({ id: crypto.randomUUID(), name: 'Premium', quantity: 1, rate: 1200, unitPrice: 1200 });

const normalizeAuditLog = (auditLog: any): AuditLogEntry[] => {
  if (Array.isArray(auditLog)) return auditLog;
  if (auditLog && typeof auditLog === 'object') {
    return Object.values(auditLog);
  }
  return [];
};

const toDateSafe = (value: any): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value.toDate && typeof value.toDate === 'function') {
    return value.toDate();
  }
  const d = new Date(value);
  return isValid(d) ? d : null;
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
    if (['id', 'auditLog', 'updatedAt', 'createdAt', 'items', 'userId', 'companyId'].includes(key)) return;

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

  const originalItems = original.items || [];
  const updatedItems = updated.items || [];
  if (JSON.stringify(originalItems) !== JSON.stringify(updatedItems)) {
    changes.push('Line items were updated');
  }

  return changes;
};

const getInitialInsuranceDoc = (): Omit<InsuranceDocument, 'userId' | 'companyId'> => ({
  id: '',
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

  termsAndConditions: 'This policy is subject to the terms, conditions, and exclusions as specified in the full policy document. This document serves as a summary and does not override the master policy agreement. All claims are subject to verification and investigation. This policy is governed by the laws of the specified jurisdiction.',
  internalNotes: '',

  currency: 'USD',
  language: 'en',
  template: 'usa-claim-default',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  textColor: '#374151',
  backgroundColor: '#FFFFFF',
  fontFamily: 'Inter',

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
  attachments: [],
  auditLog: [],
});


function PrintableInsuranceDoc({ doc, accentColor }: { doc: InsuranceDocument, accentColor: string }) {
  const serializedData = useMemo(() => JSON.stringify(doc), [doc]);

  useEffect(() => {
    const container = document.getElementById('print-container');
    if (container) {
      ReactDOM.render(
        <InsurancePreview
          doc={JSON.parse(serializedData)}
          accentColor={accentColor}
          backgroundColor={doc.backgroundColor || '#FFFFFF'}
          textColor={doc.textColor || '#374151'}
          id="insurance-preview-print"
          isPrint={true}
        />,
        container
      );
    }
  }, [serializedData, doc, accentColor]); // Dependency on serialized data ensures re-render on any change

  return null; // This component does not render anything itself
}



export default function CreateInsurancePage() {
  const { user, userProfile, isLoading: isAuthLoading } = useUserAuth();
  const [document, setDocument] = useState<InsuranceDocument | null>(null);
  const [originalDocument, setOriginalDocument] = useState<InsuranceDocument | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#374151');
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [historyModalState, setHistoryModalState] = useState<{ isOpen: boolean, auditLog: AuditLogEntry[] }>({ isOpen: false, auditLog: [] });

  // Permission check
  useEffect(() => {
    if (isAuthLoading || !userProfile) return;

    if (!hasAccess(userProfile, 'create:insurance')) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to create insurance documents.",
        variant: "destructive",
      });
      router.push('/dashboard');
    }
  }, [userProfile, isAuthLoading, router, toast]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const draftId = searchParams.get('draftId');
  const prefillClientId = searchParams.get('clientId');
  const companyId = userProfile?.companyId;

  const docRef = useMemoFirebase(() => {
    if (!draftId || !firestore) return null;
    const path = getCollectionPath(userProfile, INSURANCE_COLLECTION);
    return path ? doc(firestore, path, draftId as string) : null;
  }, [draftId, firestore, userProfile]);

  const clientRef = useMemoFirebase(() => {
    if (!prefillClientId || !firestore || !companyId) return null;
    return doc(firestore, 'companies', companyId, CLIENTS_COLLECTION, prefillClientId);
  }, [prefillClientId, firestore, companyId]);

  const { data: remoteDraft, isLoading: isDraftLoading } = useDoc<InsuranceDocument>(docRef);
  const { data: prefillClient, isLoading: isClientLoading } = useDoc<Client>(clientRef);

  useEffect(() => {
    if (isAuthLoading || (draftId && isDraftLoading) || (prefillClientId && isClientLoading)) return;
    if (!user || !userProfile) {
      router.push('/login');
      return;
    }
    let initialDocument: InsuranceDocument;

    const processData = (data: any): any => {
      const processed: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          if (value && typeof value === 'object' && value.toDate) { // Firestore Timestamp check
            processed[key] = value.toDate();
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
      const baseDoc = getInitialInsuranceDoc();
      const loadedDraft = processData(remoteDraft);
      initialDocument = {
        ...baseDoc,
        ...loadedDraft,
        id: draftId,
        userId: user.uid,
        companyId: userProfile.companyId,
      };
    } else {
      const newDocId = firestore ? doc(collection(firestore, 'companies', 'temp', INSURANCE_COLLECTION)).id : crypto.randomUUID();
      const newAuditLogEntry: AuditLogEntry = {
        id: crypto.randomUUID(),
        action: 'created',
        timestamp: new Date(),
        user: { name: user.displayName || user.email || '', email: user.email || '' },
        version: 1,
      };
      initialDocument = {
        ...getInitialInsuranceDoc(),
        id: newDocId,
        userId: user.uid,
        companyId: userProfile.companyId,
        auditLog: [newAuditLogEntry]
      };

      if (prefillClient) {
        initialDocument.policyHolder = {
          clientId: prefillClient.id,
          name: prefillClient.name,
          companyName: prefillClient.companyName,
          address: prefillClient.address,
          phone: prefillClient.phone || '',
          email: prefillClient.email,
        };
      } else if (prefillClientId) {
        initialDocument.policyHolder = {
          clientId: prefillClientId,
          name: searchParams.get('clientName') || '',
          address: searchParams.get('clientAddress') || '',
          email: searchParams.get('clientEmail') || '',
          phone: searchParams.get('clientPhone') || '',
          companyName: '',
        }
      }
    }

    setDocument(initialDocument);
    setOriginalDocument(JSON.parse(JSON.stringify(initialDocument)));

    if (typeof window !== 'undefined' && window.document) {
      const computedColor = getComputedStyle(window.document.documentElement).getPropertyValue('--primary').trim();
      if (computedColor) {
        setAccentColor(`hsl(${computedColor})`);
      }
    }
  }, [draftId, remoteDraft, isDraftLoading, prefillClientId, prefillClient, isClientLoading, user, userProfile, isAuthLoading, firestore, router, searchParams]);

  const handleHistoryClick = (auditLog?: AuditLogEntry[]) => {
    const sortedLog = (auditLog || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setHistoryModalState({ isOpen: true, auditLog: sortedLog });
  };

  const generateNewId = (doc: InsuranceDocument): string => {
    const clientName = doc.policyHolder.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const policyNumber = doc.policyNumber || 'new';
    return `${clientName}-${policyNumber}`;
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
      const canCreate = await checkUsageLimit(user.uid, INSURANCE_COLLECTION);
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
        user: { name: user.displayName || user.email || '', email: user.email || '' },
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
      policyHolder: {
        ...document.policyHolder,
        clientId: document.policyHolder.clientId,
      },
      updatedAt: Timestamp.now(),
      auditLog: updatedAuditLog.map(log => ({ ...log, timestamp: safeTimestamp(log.timestamp) })),
      documentDate: safeTimestamp(document.documentDate),
      policyStartDate: safeTimestamp(document.policyStartDate),
      policyEndDate: safeTimestamp(document.policyEndDate),
      createdAt: safeTimestamp(document.createdAt) || Timestamp.now(),
    };

    const path = getCollectionPath(userProfile, INSURANCE_COLLECTION);
    if (!path) {
      toast({ title: "Error", description: "Could not determine save path.", variant: "destructive" });
      return;
    }
    const finalDocRef = doc(firestore, path, newId);
    setDocumentNonBlocking(finalDocRef, draftToSave, { merge: true });

    toast({
      title: "Insurance Document Saved",
      description: "Your document has been saved online.",
    });

    const updatedDocState = { ...document, id: newId, auditLog: updatedAuditLog };
    setDocument(updatedDocState);
    setOriginalDocument(JSON.parse(JSON.stringify(updatedDocState)));

    if (isNew) {
      router.push(`/create-insurance?draftId=${newId}`, { scroll: false });
    }
  };

  const handleNew = async () => {
    if (!user || !companyId || !userProfile) return;

    // LIMIT CHECK FOR FREE PLAN
    if (userProfile?.plan === 'free') {
      const canCreate = await checkUsageLimit(user.uid, INSURANCE_COLLECTION);
      if (!canCreate) {
        setIsUpgradeModalOpen(true);
        return;
      }
    }

    const newDocId = firestore ? doc(collection(firestore, 'companies', companyId, INSURANCE_COLLECTION)).id : crypto.randomUUID();
    const newAuditLogEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      action: 'created',
      timestamp: new Date(),
      user: { name: user.displayName || user.email || '', email: user.email || '' },
      version: 1,
    };
    const newDoc: InsuranceDocument = {
      ...getInitialInsuranceDoc(),
      id: newDocId,
      userId: user.uid,
      companyId: companyId,
      auditLog: [newAuditLogEntry]
    };
    setDocument(newDoc);
    setOriginalDocument(JSON.parse(JSON.stringify(newDoc)));
    router.push('/create-insurance', { scroll: false });
  };

  const handleDuplicate = () => {
    if (!document || !user || !companyId) return;
    const newDocId = firestore ? doc(collection(firestore, 'companies', companyId, INSURANCE_COLLECTION)).id : crypto.randomUUID();
    const newAuditLogEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      action: 'created',
      timestamp: new Date(),
      user: { name: user.displayName || user.email || '', email: user.email || '' },
      version: 1,
    };
    const duplicatedDoc: InsuranceDocument = {
      ...document,
      id: newDocId,
      policyNumber: `${document.policyNumber}-COPY`,
      auditLog: [newAuditLogEntry],
    };
    setDocument(duplicatedDoc);
    setOriginalDocument(JSON.parse(JSON.stringify(duplicatedDoc)));
    router.push(`/create-insurance?draftId=${newDocId}`, { scroll: false });
    toast({ title: "Document Duplicated", description: "A new draft has been created from the original." });
  };

  const handleShare = () => {
    if (!document?.id) return;
    handleSaveDraft();
    const url = `${window.location.origin}/insurance/${document.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "COI Link Copied!",
      description: "The shareable Certificate of Insurance link has been copied.",
    });
  };

  const handleStatusChange = (status: 'active' | 'cancelled') => {
    if (!document || !firestore || !companyId) return;
    const docRef = doc(firestore, 'companies', companyId, INSURANCE_COLLECTION, document.id);
    updateDocumentNonBlocking(docRef, { status: status });
    setDocument(prev => prev ? ({ ...prev, status }) : null);
    toast({ title: "Status Updated", description: `Document status changed to "${status}".` });
  };


  if (!document || (draftId && isDraftLoading)) {
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
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-2">
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
        featureName="Insurance Documents"
      />
      <HistoryModal
        isOpen={historyModalState.isOpen}
        onClose={() => setHistoryModalState({ isOpen: false, auditLog: [] })}
        auditLog={historyModalState.auditLog}
      />
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-xl font-bold font-headline">Create Insurance Document</h1>
            <p className="text-muted-foreground">Select a template and fill out the form to generate your claim document.</p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
            <Button onClick={handleSaveDraft} className="w-full md:w-auto h-9 px-4 text-sm">
              <Edit className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button onClick={handlePrint} variant="outline" className="w-full md:w-auto h-9 px-4 text-sm">
              <Printer className="mr-2 h-4 w-4" />
              Save as PDF
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
                <DropdownMenuItem onClick={handleNew}>
                  <FilePlus className="mr-2 h-4 w-4" /> New
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="mr-2 h-4 w-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=insurance">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share COI
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Activate Policy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('cancelled')} className="text-destructive">
                  <Archive className="mr-2 h-4 w-4" /> Archive (Cancel)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleHistoryClick(document.auditLog)}>
                  <History className="mr-2 h-4 w-4" /> History
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
              <InsuranceForm
                document={document}
                setDocument={setDocument as React.Dispatch<React.SetStateAction<InsuranceDocument>>}
                accentColor={accentColor}
                setAccentColor={setAccentColor}
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                textColor={textColor}
                setTextColor={setTextColor}
                toast={toast}
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
                <InsurancePreview doc={document} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />
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
                      <InsuranceTemplateSelector
                        selectedTemplate={document.template}
                        onSelectTemplate={(template) => setDocument(prev => prev ? ({ ...prev, template }) : null)}
                      />
                    </ScrollArea>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {document && <PrintableInsuranceDoc doc={document} accentColor={accentColor} />}
    </>
  );
}
