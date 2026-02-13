

'use client';

import { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import type { Invoice, LineItem, AuditLogEntry, Client } from '@/lib/types';
import { InvoiceForm } from '@/components/invoice-form';
import { ClientInvoicePreview } from '@/components/invoice-preview';
import { Button } from '@/components/ui/button';
import { Printer, Edit, FilePlus, LayoutDashboard, MoreVertical, Brush } from 'lucide-react';
import { addDays, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { doc, serverTimestamp, Timestamp, collection, getDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useDoc } from '@/firebase/firestore/use-doc';
import { DocumentTemplateSelector } from '@/components/document-template-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useUserAuth } from '@/context/auth-provider';
import { motion } from 'framer-motion';
import { toNumberSafe, toDateSafe } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const INVOICES_COLLECTION = 'invoices';
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
  if (JSON.stringify(originalItems) !== JSON.stringify(updatedItems)) {
    changes.push('Line items were updated');
  }

  return changes;
};

const getInitialInvoice = (): Omit<Invoice, 'userId' | 'companyId'> => ({
  id: '',
  invoiceNumber: '',
  invoiceDate: new Date(),
  dueDate: addDays(new Date(), 30),
  status: 'draft',

  business: {
    name: 'Your Company',
    address: '123 Main St, Anytown, USA 12345',
    phone: '+1 (123) 456-7890',
    email: 'contact@yourcompany.com',
    website: 'www.yourcompany.com',
    licenseNumber: '',
    logoUrl: '',
    taxId: '',
  },

  client: {
    clientId: '',
    name: 'Client Name',
    address: '456 Oak Ave, Someplace, USA 54321',
    phone: '+1 (987) 654-3210',
    email: 'client@example.com',
    shippingAddress: ''
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

  paymentInstructions: 'Thank you for your business. Please make payment to the account specified below.',

  template: 'default',
  documentType: 'invoice',
  category: 'General Services',
  language: 'en',
  currency: 'USD',
  fontFamily: 'Inter',
  fontSize: 10,
  backgroundColor: '#FFFFFF',
  textColor: '#374151',
  amountPaid: 0,
  poNumber: '',
  auditLog: [],

  construction: {
    jobSiteAddress: '',
    permitNumber: '',
    laborRate: null,
    equipmentRentalFees: null,
    wasteDisposalFee: null,
    projectStartDate: null,
    projectEndDate: null,
  },
  plumbing: {
    serviceType: 'Repair',
    pipeMaterial: 'PVC',
    fixtureName: '',
    emergencyFee: null,
  },
  electrical: {
    serviceType: 'Wiring',
    voltage: '120V',
    fixtureDevice: '',
    permitCost: null,
  },
  hvac: {
    unitType: 'AC',
    modelNumber: '',
    refrigerantType: '',
    maintenanceFee: null,
  },
  roofing: {
    roofType: 'Shingle',
    squareFootage: null,
    pitch: '',
    tearOffRequired: false,
    underlaymentType: '',
    dumpsterFee: null,
  },
  landscaping: {
    lawnSquareFootage: null,
    serviceType: 'Mowing',
    equipmentFee: null,
    disposalFee: null,
  },
  cleaning: {
    cleaningType: 'Home',
    numberOfRooms: null,
    squareFootage: null,
    suppliesFee: null,
    recurringSchedule: 'One-time',
  },
  freelance: {
    projectName: '',
    hourlyRate: null,
    fixedRate: null,
    hoursLogged: null,
    milestoneDescription: '',
  },
  consulting: {
    consultationType: '',
    sessionHours: null,
    retainerFee: null,
  },
  legal: {
    caseName: '',
    caseNumber: '',
    serviceType: 'Consultation',
    hourlyRate: null,
    hoursWorked: null,
    retainerAmount: null,
    courtFilingFees: null,
    travelTime: null,
    additionalDisbursements: null,
  },
  medical: {
    patientName: '',
    patientId: '',
    serviceType: 'Consultation',
    cptCode: '',
    icdCode: '',
    visitDate: null,
    physicianName: '',
    copayAmount: null,
    labFee: null,
    medicationCharges: null,
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
  ecommerce: {
    orderNumber: '',
    sku: '',
    productCategory: '',
    weight: null,
    quantity: null,
    shippingCost: null,
    shippingCarrier: '',
    trackingId: '',
    salesTax: null,
    packagingFee: null,
  },
  rental: {
    rentalItemName: '',
    rentalStartDate: null,
    rentalEndDate: null,
    dailyRate: null,
    hourlyRate: null,
    numberOfDays: null,
    numberOfHours: null,
    securityDeposit: null,
    damageCharges: null,
    deliveryFee: null,
    pickupFee: null,
  },
  retail: {
    sku: '',
    productName: '',
    productCategory: '',
    unitOfMeasure: '',
    batchNumber: '',
    stockQuantity: null,
    wholesalePrice: null,
    shippingPalletCost: null,
  },
  photography: {
    eventType: 'Portrait',
    shootDate: null,
    hoursOfCoverage: null,
    packageSelected: '',
    editedPhotosCount: null,
    rawFilesCost: null,
  },
  realEstate: {
    propertyAddress: '',
    unitNumber: '',
    leaseTerm: '',
    tenantName: '',
    monthlyRent: null,
    cleaningFee: null,
    maintenanceFee: null,
    lateFee: null,
    hoaCharges: null,
    utilityCharges: null,
  },
  transportation: {
    pickupLocation: '',
    dropoffLocation: '',
    milesDriven: null,
    ratePerMile: null,
    weight: null,
    loadType: '',
    fuelSurcharge: null,
    tollCharges: null,
    detentionFee: null,
  },
  itServices: {
    serviceType: 'Support',
    hourlyRate: null,
    hardwareReplacementCost: null,
    monthlyMaintenanceFee: null,
    deviceType: '',
    serialNumber: '',
    hoursWorked: null,
  },
});


function PrintableInvoice({ invoice }: { invoice: Invoice }) {
  const serializedData = useMemo(() => JSON.stringify(invoice), [invoice]);

  useEffect(() => {
    const container = document.getElementById('print-container');
    if (container) {
      ReactDOM.render(
        <ClientInvoicePreview
          invoice={JSON.parse(serializedData)}
          accentColor={invoice.accentColor || 'hsl(var(--primary))'}
          backgroundColor={invoice.backgroundColor || '#FFFFFF'}
          textColor={invoice.textColor || '#374151'}
          id="invoice-preview-print"
          isPrint={true}
        />,
        container
      );
    }
  }, [serializedData, invoice]); // Dependency on serialized data ensures re-render on any change

  return null; // This component does not render anything itself
}

export default function CreateInvoicePage() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [originalInvoice, setOriginalInvoice] = useState<Invoice | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#374151');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firestore } = useFirebase();
  const { user, userProfile, isLoading: isAuthLoading } = useUserAuth();

  const draftId = searchParams.get('draftId');
  const prefillClientId = searchParams.get('clientId');
  const companyId = userProfile?.companyId;

  const docRef = useMemoFirebase(() => {
    if (!draftId || !firestore || !companyId) return null;
    return doc(firestore, 'companies', companyId, INVOICES_COLLECTION, draftId);
  }, [draftId, firestore, companyId]);

  const clientRef = useMemoFirebase(() => {
    if (!prefillClientId || !firestore || !companyId) return null;
    return doc(firestore, 'companies', companyId, CLIENTS_COLLECTION, prefillClientId);
  }, [prefillClientId, firestore, companyId]);

  const companyDocRef = useMemoFirebase(() => {
    if (!firestore || !companyId) return null;
    return doc(firestore, 'companies', companyId);
  }, [firestore, companyId]);

  const { data: remoteDraft, isLoading: isDraftLoading } = useDoc<Invoice>(docRef);
  const { data: prefillClient, isLoading: isClientLoading } = useDoc<Client>(clientRef);
  const { data: companyData, isLoading: isCompanyLoading } = useDoc(companyDocRef);

  const processedInvoice = useMemo(() => {
    if (!invoice) return null;

    const subtotal = invoice.lineItems.reduce((acc, item) => acc + (toNumberSafe(item.quantity)) * (toNumberSafe(item.unitPrice)), 0);
    const taxableTotal = invoice.lineItems.filter(i => i.taxable !== false).reduce((s, i) => s + ((toNumberSafe(i.quantity)) * (toNumberSafe(i.unitPrice))), 0);
    const taxPercentage = toNumberSafe(invoice.summary.taxPercentage);
    const taxAmount = taxableTotal * (taxPercentage / 100);
    const discountAmount = toNumberSafe(invoice.summary.discount);
    const shippingCost = toNumberSafe(invoice.summary.shippingCost);
    const grandTotal = subtotal + taxAmount - discountAmount + shippingCost;

    return {
      ...invoice,
      summary: {
        ...invoice.summary,
        subtotal,
        taxAmount,
        grandTotal,
      }
    };
  }, [invoice]);

  useEffect(() => {
    if (isAuthLoading || (draftId && isDraftLoading) || (prefillClientId && isClientLoading) || isCompanyLoading) return;
    if (!user || !userProfile) {
      router.push('/login');
      return;
    }
    const companyId = userProfile.companyId;
    let initialInvoice: Invoice;

    const processData = (data: any): any => {
      if (!data) return null;
      const processed: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            if (value.toDate) { // Is it a Firestore Timestamp?
              processed[key] = value.toDate();
            } else {
              processed[key] = processData(value); // Recurse for nested objects
            }
          } else {
            processed[key] = value;
          }
        }
      }
      return processed;
    };

    if (draftId && remoteDraft) {
      const baseInvoice = getInitialInvoice();
      const loadedDraft = processData(remoteDraft);

      initialInvoice = {
        ...baseInvoice,
        ...loadedDraft,
        id: draftId,
        userId: user.uid,
        companyId: companyId || '',
        business: { ...baseInvoice.business, ...loadedDraft.business },
        client: { ...baseInvoice.client, ...loadedDraft.client },
        summary: { ...baseInvoice.summary, ...loadedDraft.summary },
        construction: { ...baseInvoice.construction, ...(loadedDraft.construction || {}) },
        plumbing: { ...baseInvoice.plumbing, ...(loadedDraft.plumbing || {}) },
        electrical: { ...baseInvoice.electrical, ...(loadedDraft.electrical || {}) },
        hvac: { ...baseInvoice.hvac, ...(loadedDraft.hvac || {}) },
        roofing: { ...baseInvoice.roofing, ...(loadedDraft.roofing || {}) },
        landscaping: { ...baseInvoice.landscaping, ...(loadedDraft.landscaping || {}) },
        cleaning: { ...baseInvoice.cleaning, ...(loadedDraft.cleaning || {}) },
        freelance: { ...baseInvoice.freelance, ...(loadedDraft.freelance || {}) },
        consulting: { ...baseInvoice.consulting, ...(loadedDraft.consulting || {}) },
        legal: { ...baseInvoice.legal, ...(loadedDraft.legal || {}) },
        medical: { ...baseInvoice.medical, ...(loadedDraft.medical || {}) },
        autoRepair: { ...baseInvoice.autoRepair, ...(loadedDraft.autoRepair || {}) },
        ecommerce: { ...baseInvoice.ecommerce, ...(loadedDraft.ecommerce || {}) },
        rental: { ...baseInvoice.rental, ...(loadedDraft.rental || {}) },
        retail: { ...baseInvoice.retail, ...(loadedDraft.retail || {}) },
        photography: { ...baseInvoice.photography, ...(loadedDraft.photography || {}) },
        realEstate: { ...baseInvoice.realEstate, ...(loadedDraft.realEstate || {}) },
        transportation: { ...baseInvoice.transportation, ...(loadedDraft.transportation || {}) },
        itServices: { ...baseInvoice.itServices, ...(loadedDraft.itServices || {}) },
      };

    } else {
      const newDocId = firestore ? doc(collection(firestore, 'companies', 'temp', INVOICES_COLLECTION)).id : crypto.randomUUID();
      const newAuditLogEntry: AuditLogEntry = {
        id: crypto.randomUUID(),
        action: 'created',
        timestamp: new Date(),
        user: { name: user.displayName || user.email, email: user.email },
        version: 1,
      };

      const baseInvoice = getInitialInvoice();

      initialInvoice = {
        ...baseInvoice,
        business: {
          ...baseInvoice.business,
          name: companyData?.name || 'Your Company',
          address: companyData?.address || '123 Main St, Anytown, USA 12345',
          phone: companyData?.phone || '+1 (123) 456-7890',
          email: companyData?.email || user.email || 'contact@yourcompany.com',
          website: companyData?.website || 'www.yourcompany.com',
          logoUrl: companyData?.logoUrl || '',
        },
        id: newDocId,
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        userId: user.uid,
        companyId: companyId || '',
        auditLog: [newAuditLogEntry]
      };

      if (prefillClient) {
        initialInvoice.client = {
          clientId: prefillClient.id,
          name: prefillClient.name,
          companyName: prefillClient.companyName,
          address: prefillClient.address,
          phone: prefillClient.phone || '',
          email: prefillClient.email,
          shippingAddress: prefillClient.shippingAddress,
        };
      } else if (prefillClientId) {
        initialInvoice.client = {
          clientId: prefillClientId,
          name: searchParams.get('clientName') || '',
          address: searchParams.get('clientAddress') || '',
          email: searchParams.get('clientEmail') || '',
          phone: searchParams.get('clientPhone') || '',
          companyName: '',
          shippingAddress: '',
        }
      }
    }

    setInvoice(initialInvoice);
    setOriginalInvoice(JSON.parse(JSON.stringify(initialInvoice))); // Deep copy
    setBackgroundColor(initialInvoice.backgroundColor || '#FFFFFF');
    setTextColor(initialInvoice.textColor || '#374151');

    if (typeof window !== 'undefined' && window.document) {
      const computedColor = getComputedStyle(window.document.documentElement).getPropertyValue('--primary').trim();
      if (computedColor) {
        setAccentColor(`hsl(${computedColor})`);
      }
    }
  }, [draftId, remoteDraft, isDraftLoading, prefillClientId, prefillClient, isClientLoading, user, userProfile, isAuthLoading, companyId, router, firestore, companyData, isCompanyLoading, searchParams]);


  const generateNewId = (doc: Invoice): string => {
    const clientName = doc.client.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const invoiceNumber = doc.invoiceNumber || 'new';
    return `${clientName}-${invoiceNumber}`;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDraft = async () => {
    if (!invoice || !firestore || !user || !companyId || !originalInvoice) return;

    const isNew = !searchParams.get('draftId');
    const newId = isNew ? generateNewId(invoice) : invoice.id;

    const changes = diff(originalInvoice, invoice);
    const existingLog = normalizeAuditLog(invoice.auditLog);

    let updatedAuditLog: AuditLogEntry[] = [...existingLog];

    if (changes.length > 0) {
      const newVersion = (existingLog[existingLog.length - 1]?.version || 0) + 1;
      const newAuditLogEntry: AuditLogEntry = {
        id: crypto.randomUUID(),
        action: isNew ? 'created' : 'updated',
        timestamp: new Date(),
        user: { name: user.displayName || user.email, email: user.email },
        version: newVersion,
        changes: changes
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
      ...invoice,
      id: newId,
      userId: user.uid,
      companyId: companyId,
      client: {
        ...invoice.client,
        clientId: invoice.client.clientId, // Ensure clientId is saved
      },
      updatedAt: Timestamp.now(),
      auditLog: updatedAuditLog.map(log => ({ ...log, timestamp: safeTimestamp(log.timestamp) })),
      invoiceDate: safeTimestamp(invoice.invoiceDate),
      dueDate: safeTimestamp(invoice.dueDate),
      createdAt: safeTimestamp(invoice.createdAt) || Timestamp.now(),
    };

    const dateCategories = ['construction', 'medical', 'photography', 'rental'];
    dateCategories.forEach(cat => {
      if ((invoice as any)[cat]) {
        draftToSave[cat] = { ...(invoice as any)[cat] };
        Object.keys(draftToSave[cat]).forEach(key => {
          if (key.toLowerCase().includes('date')) {
            const dateVal = draftToSave[cat][key];
            draftToSave[cat][key] = safeTimestamp(dateVal);
          }
        });
      }
    });

    const docRef = doc(firestore, 'companies', companyId, INVOICES_COLLECTION, newId);
    await setDocumentNonBlocking(docRef, draftToSave, { merge: true });

    toast({
      title: "Draft Saved",
      description: "Your invoice draft has been saved online.",
    });

    const updatedInvoiceState = { ...invoice, id: newId, auditLog: updatedAuditLog };
    setInvoice(updatedInvoiceState);
    setOriginalInvoice(JSON.parse(JSON.stringify(updatedInvoiceState)));

    if (isNew) {
      router.push(`/create-invoice?draftId=${newId}`, { scroll: false });
    }
  };

  const handleNew = () => {
    if (!user || !companyId) return;
    const newDocId = firestore ? doc(collection(firestore, 'companies', companyId, INVOICES_COLLECTION)).id : crypto.randomUUID();
    const newAuditLogEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      action: 'created',
      timestamp: new Date(),
      user: { name: user.displayName || user.email, email: user.email },
      version: 1,
    };
    const baseInvoice = getInitialInvoice();
    const newInvoice: Invoice = {
      ...baseInvoice,
      business: {
        ...baseInvoice.business,
        name: companyData?.name || 'Your Company',
        address: companyData?.address || '123 Main St, Anytown, USA 12345',
        phone: companyData?.phone || '+1 (123) 456-7890',
        email: companyData?.email || user.email || 'contact@yourcompany.com',
        website: companyData?.website || 'www.yourcompany.com',
        logoUrl: companyData?.logoUrl || '',
      },
      id: newDocId,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      userId: user.uid,
      companyId: companyId,
      auditLog: [newAuditLogEntry]
    };
    setInvoice(newInvoice);
    setOriginalInvoice(JSON.parse(JSON.stringify(newInvoice)));
    if (typeof window !== 'undefined' && window.document) {
      const computedColor = getComputedStyle(window.document.documentElement).getPropertyValue('--primary').trim();
      if (computedColor) {
        setAccentColor(`hsl(${computedColor})`);
      }
    }
    router.push('/create-invoice');
    toast({
      title: "New Invoice",
      description: "A new blank invoice has been created.",
    });
  };

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: "Image too large",
          description: "Please upload an image smaller than 4MB.",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const { url } = await response.json();
        setInvoice(prev => {
          if (!prev) return null;
          return {
            ...prev,
            business: {
              ...prev.business,
              logoUrl: url
            }
          }
        });
        toast({
          title: "Logo Uploaded",
          description: "Your logo has been successfully uploaded.",
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload Failed",
          description: "Could not upload the logo. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };


  if (!invoice || (draftId && isDraftLoading) || isAuthLoading || isCompanyLoading) {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-[800px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-xl font-bold font-headline">Create Invoice</h1>
            <p className="text-sm text-muted-foreground">Select a template, then fill out the form to generate your invoice.</p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button size="sm" onClick={handleSaveDraft} className="w-full md:w-auto">
                <Edit className="mr-2 h-4 w-4" /> Save Draft
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button size="sm" onClick={handlePrint} variant="outline" className="w-full md:w-auto">
                <Printer className="mr-2 h-4 w-4" /> Save as PDF
              </Button>
            </motion.div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="icon" className="shrink-0 h-9 w-9">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </motion.div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 order-2 lg:order-1"
          >
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-headline mb-4 text-center lg:text-left">Fill in Details</h2>
              <InvoiceForm
                invoice={invoice}
                setInvoice={setInvoice as any}
                accentColor={accentColor}
                setAccentColor={setAccentColor}
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                textColor={textColor}
                setTextColor={setTextColor}
                toast={toast}
                onLogoUpload={handleLogoUpload}
                isUploading={isUploading}
              />
            </div>
          </motion.div>
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
                      selectedTemplate={invoice.template}
                      onSelectTemplate={(template) => setInvoice(prev => prev ? ({ ...prev, template }) : null)}
                      documentType="invoice"
                      category={invoice.category}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <div>
                <h2 className="text-xl font-bold font-headline mb-4">Live Preview</h2>
                <motion.div
                  key={JSON.stringify(processedInvoice)}
                  initial={{ opacity: 0.8, scale: 0.995 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ClientInvoicePreview invoice={processedInvoice!} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {processedInvoice && <PrintableInvoice invoice={processedInvoice} />}
    </>
  );
}
