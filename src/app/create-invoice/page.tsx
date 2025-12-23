

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { Invoice, LineItem, AuditLogEntry } from '@/lib/types';
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
import { useAuth } from '@/context/auth-provider';
import { motion } from 'framer-motion';

const INVOICES_COLLECTION = 'invoices';

const getInitialLineItem = (): LineItem => ({ id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0, taxable: false });

const normalizeAuditLog = (auditLog: any): AuditLogEntry[] => {
  if (!auditLog) return [];
  const entries = Array.isArray(auditLog) ? auditLog : Object.values(auditLog);
  return entries.map(entry => ({
      ...entry,
      timestamp: toDateSafe(entry.timestamp)
  }));
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
  
  lineItems: [{ ...getInitialLineItem(), name: 'Sample Service (e.g., Website Development)', unitPrice: 1500 }],

  summary: {
    subtotal: 1500,
    taxPercentage: 8.25,
    taxAmount: 123.75,
    discount: 0,
    grandTotal: 1623.75,
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
    travelFee: null,
    equipmentRentalFee: null,
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


function PrintableInvoice({ doc, accentColor, backgroundColor, textColor }: { doc: Invoice, accentColor: string, backgroundColor: string, textColor: string }) {
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
        <ClientInvoicePreview invoice={doc} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} id="invoice-preview-print" isPrint={true} />,
        printRoot
    );
}

export default function CreateInvoicePage() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [originalInvoice, setOriginalInvoice] = useState<Invoice | null>(null);
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#374151');
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firestore } = useFirebase();
  const { user, userProfile, isLoading: isAuthLoading } = useAuth();

  const draftId = searchParams.get('draftId');
  const companyId = userProfile?.companyId;

  const docRef = useMemoFirebase(() => {
    if (!draftId || !firestore || !companyId) return null;
    return doc(firestore, 'companies', companyId, INVOICES_COLLECTION, draftId);
  }, [draftId, firestore, companyId]);

  const companyDocRef = useMemoFirebase(() => {
    if (!firestore || !companyId) return null;
    return doc(firestore, 'companies', companyId);
  }, [firestore, companyId]);

  const { data: remoteDraft, isLoading: isDraftLoading } = useDoc<Invoice>(docRef);
  const { data: companyData, isLoading: isCompanyLoading } = useDoc(companyDocRef);

  const computeSummary = useCallback((inv: Invoice): Invoice => {
    const subtotal = inv.lineItems.reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
    const taxableTotal = inv.lineItems.filter(i => i.taxable !== false).reduce((s, i) => s + ((Number(i.quantity) || 0) * (Number(i.unitPrice) || 0)), 0);
    const taxPercentage = Number(inv.summary.taxPercentage) || 0;
    const taxAmount = taxableTotal * (taxPercentage / 100);
    const discountAmount = Number(inv.summary.discount) || 0;
    const shippingCost = Number(inv.summary.shippingCost) || 0;
    const grandTotal = subtotal + taxAmount - discountAmount + shippingCost;

    return {
        ...inv,
        summary: {
            ...inv.summary,
            subtotal,
            taxAmount,
            grandTotal,
        }
    };
  }, []);

  const processedInvoice = useMemo(() => {
    if (!invoice) return null;
    return computeSummary(invoice);
  }, [invoice, computeSummary]);

  useEffect(() => {
    if (isAuthLoading || (draftId && isDraftLoading) || isCompanyLoading) return;
    if (!user || !userProfile) {
        router.push('/login');
        return;
    }
    const companyId = userProfile.companyId;
    let initialInvoice: Invoice;

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
  }, [draftId, remoteDraft, isDraftLoading, user, userProfile, isAuthLoading, companyId, router, firestore, companyData, isCompanyLoading]);
  
  const serializedInvoice = useMemo(() => invoice ? JSON.stringify(invoice) : '', [invoice]);


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
        clientId: invoice.clientId, // Ensure clientId is saved
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
    if(!user || !companyId) return;
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

  if (!processedInvoice || (draftId && isDraftLoading) || isAuthLoading || isCompanyLoading) {
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
            <h1 className="text-3xl font-bold font-headline">Create Invoice</h1>
            <p className="text-muted-foreground">Select a template, then fill out the form to generate your invoice.</p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={handleSaveDraft} className="w-full md:w-auto">
                  <Edit className="mr-2 h-4 w-4" /> Save Draft
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={handlePrint} variant="outline" className="w-full md:w-auto">
                  <Printer className="mr-2 h-4 w-4" /> Save as PDF
              </Button>
            </motion.div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="icon" className="shrink-0">
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 xl:gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
             <div className="space-y-6">
                <h2 className="text-2xl font-bold font-headline mb-4 text-center lg:text-left">Fill in Details</h2>
                <InvoiceForm 
                  invoice={invoice} 
                  setInvoice={setInvoice} 
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
                                selectedTemplate={invoice.template}
                                onSelectTemplate={(template) => setInvoice(prev => prev ? ({...prev, template}) : null)}
                                documentType="invoice"
                                category={invoice.category}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
                <div>
                  <h2 className="text-2xl font-bold font-headline mb-4">Live Preview</h2>
                  <motion.div
                    key={serializedInvoice}
                    initial={{ opacity: 0.8, scale: 0.995 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ClientInvoicePreview invoice={processedInvoice} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />
                  </motion.div>
                </div>
            </div>
          </div>
        </div>
      </div>
      {processedInvoice && <PrintableInvoice doc={processedInvoice} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />}
    </>
  );
}
    

    









    

    


