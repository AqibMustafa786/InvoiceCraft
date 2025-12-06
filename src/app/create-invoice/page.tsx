

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Invoice, LineItem, ConstructionInfo, PlumbingInfo, ElectricalInfo, HVACInfo, RoofingInfo, LandscapingInfo, CleaningInfo, ITFreelanceInfo, ConsultingInfo, LegalInfo, MedicalInfo, AutoRepairInfo, EcommerceInfo, RentalInfo, RetailInfo, PhotographyInfo, RealEstateInfo, TransportationInfo, ITServiceInfo } from '@/lib/types';
import { InvoiceForm } from '@/components/invoice-form';
import { ClientInvoicePreview } from '@/components/invoice-preview';
import { Button } from '@/components/ui/button';
import { Printer, Edit, FilePlus, LayoutDashboard, MoreVertical, Brush } from 'lucide-react';
import { addDays, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useDoc } from '@/firebase/firestore/use-doc';
import { TemplateSelector } from '@/components/template-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const INVOICES_COLLECTION = 'invoices';

const getInitialLineItem = (): LineItem => ({ id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0, taxable: true });

const getInitialInvoice = (): Omit<Invoice, 'userId'> => ({
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
    caseNumber: '',
    caseType: '',
    retainerBalance: null,
    billingAttorney: '',
  },
  medical: {
    patientName: '',
    patientId: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    diagnosisCode: '',
    procedureCode: '',
    coPay: null,
  },
  autoRepair: {
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: null,
    vin: '',
    diagnosticFee: null,
    mileage: null,
  },
  ecommerce: {
    orderNumber: '',
    shippingMethod: '',
    trackingNumber: '',
  },
  rental: {
    propertyAddress: '',
    tenantName: '',
    rentPeriod: '',
    lateFee: null,
  },
  retail: {
    sku: '',
    productCategory: '',
    shippingFee: null,
  },
  photography: {
    eventType: '',
    hoursOfCoverage: null,
    editingFee: null,
    travelFee: null,
  },
  realEstate: {
    propertyAddress: '',
    leaseTerm: '',
    maintenanceCosts: null,
    managementFee: null,
  },
  transportation: {
    pickupLocation: '',
    deliveryLocation: '',
    distanceMiles: null,
    weightLoad: '',
    fuelSurcharge: null,
  },
  itServices: {
    serviceType: '',
    hardwareReplacementCost: null,
    monthlyMaintenanceFee: null,
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
  const [accentColor, setAccentColor] = useState<string>('hsl(var(--primary))');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [textColor, setTextColor] = useState<string>('#374151');
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firestore, user, isUserLoading } = useFirebase();

  const draftId = searchParams.get('draftId');
  const docRef = useMemoFirebase(() => draftId && firestore ? doc(firestore, INVOICES_COLLECTION, draftId) : null, [draftId, firestore]);
  const { data: remoteDraft, isLoading: isDraftLoading } = useDoc<Invoice>(docRef);

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

  useEffect(() => {
    if (isUserLoading || (draftId && isDraftLoading)) return;
    if (!user) {
        router.push('/login');
        return;
    }

    let initialInvoice: Invoice;

    if (draftId && remoteDraft) {
       const baseInvoice = getInitialInvoice();
       const fromJSON = (key: string, value: any) => {
           if (['invoiceDate', 'dueDate', 'createdAt', 'updatedAt', 'projectStartDate', 'projectEndDate'].includes(key) && value) {
               return value.toDate ? value.toDate() : (isValid(new Date(value)) ? new Date(value) : null);
           }
           return value;
       };
       const loadedDraft = JSON.parse(JSON.stringify(remoteDraft), fromJSON);
       
       initialInvoice = {
         ...baseInvoice,
         ...loadedDraft,
         userId: user.uid,
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
        const newInvoice = getInitialInvoice();
        newInvoice.id = crypto.randomUUID();
        newInvoice.invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        initialInvoice = {...newInvoice, userId: user.uid};
    }
    
    setInvoice(initialInvoice);
    setBackgroundColor(initialInvoice.backgroundColor || '#FFFFFF');
    setTextColor(initialInvoice.textColor || '#374151');
    
    if (typeof window !== 'undefined' && window.document) {
        const computedColor = getComputedStyle(window.document.documentElement).getPropertyValue('--primary').trim();
        if (computedColor) {
           setAccentColor(`hsl(${computedColor})`);
        }
    }
  }, [draftId, remoteDraft, isDraftLoading, user, isUserLoading, router]);

  useEffect(() => {
    if (invoice) {
        const newInvoice = computeSummary(invoice);
         if (JSON.stringify(newInvoice.summary) !== JSON.stringify(invoice.summary)) {
            setInvoice(newInvoice);
        }
    }
  }, [invoice, computeSummary]);


  const handlePrint = () => {
    window.print();
  };

  const handleSaveDraft = () => {
    if (!invoice || !firestore || !user) return;

    const normalizeDate = (val: any): Timestamp | null => {
        if (!val) return null;
        if (val instanceof Timestamp) return val;
        const d = val.toDate ? val.toDate() : new Date(val);
        return isValid(d) ? Timestamp.fromDate(d) : null;
    };

    const draftToSave: any = {
      ...invoice,
      userId: user.uid,
      updatedAt: serverTimestamp(),
    };
    
    const dateFields = ['invoiceDate', 'dueDate'];
    dateFields.forEach(field => {
        const dateVal = (invoice as any)[field];
        if (dateVal) {
            draftToSave[field] = normalizeDate(dateVal);
        }
    });

    if (invoice.construction) {
        draftToSave.construction = { ...invoice.construction };
        const start = normalizeDate(invoice.construction.projectStartDate);
        if(start) draftToSave.construction.projectStartDate = start;
        const end = normalizeDate(invoice.construction.projectEndDate);
        if(end) draftToSave.construction.projectEndDate = end;
    }

    if (!invoice.createdAt) {
      draftToSave.createdAt = serverTimestamp();
    }
    
    const docRef = doc(firestore, INVOICES_COLLECTION, invoice.id);
    setDocumentNonBlocking(docRef, draftToSave, { merge: true });

    toast({
      title: "Draft Saved",
      description: "Your invoice draft has been saved online.",
    });
    if (!searchParams.get('draftId')) {
      router.push(`/create-invoice?draftId=${invoice.id}`, { scroll: false });
    }
  };
  
  const handleNew = () => {
    if(!user) return;
    const newInvoice = {...getInitialInvoice(), userId: user.uid};
    newInvoice.id = crypto.randomUUID();
    newInvoice.invoiceNumber = `INV-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setInvoice(newInvoice);
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

  if (!invoice || (draftId && isDraftLoading) || isUserLoading) {
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
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 xl:gap-12">
          <div className="lg:col-span-3">
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
                            <TemplateSelector 
                                selectedTemplate={invoice.template}
                                onSelectTemplate={(template) => setInvoice(prev => prev ? ({...prev, template}) : null)}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
                <div>
                  <h2 className="text-2xl font-bold font-headline mb-4">Live Preview</h2>
                  <ClientInvoicePreview invoice={invoice} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />
                </div>
            </div>
          </div>
        </div>
      </div>
      {invoice && <PrintableInvoice doc={invoice} accentColor={accentColor} backgroundColor={backgroundColor} textColor={textColor} />}
    </>
  );
}
    


