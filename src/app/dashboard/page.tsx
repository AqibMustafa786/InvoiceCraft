
'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Invoice, Estimate, DocumentStatus, Quote, AuditLogEntry, Client } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilePlus2, Edit, Trash2, Filter, X, MoreHorizontal, FileText, Share2, DollarSign, Clock, FileWarning, Files, CheckCircle, FileQuestion, Users, Percent, AreaChart, Package, History, Shield } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, isValid, isWithinInterval } from 'date-fns';
import { FilterSheet, type DashboardFilters } from '@/components/dashboard/filter-sheet';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useAuth } from '@/context/auth-provider';
import { collection, doc, setDoc, query, Timestamp, where } from 'firebase/firestore';
import { deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Greeting } from '@/components/dashboard/greeting';
import { KpiDetailsModal } from '@/components/dashboard/kpi-details-modal';
import { HistoryModal } from '@/components/dashboard/history-modal';

const INVOICES_COLLECTION = 'invoices';
const ESTIMATES_COLLECTION = 'estimates';
const QUOTES_COLLECTION = 'quotes';
const CLIENTS_COLLECTION = 'clients';

const initialFilters: DashboardFilters = {
    clientName: '',
    status: null,
    amountMin: null,
    amountMax: null,
    dateFrom: null,
    dateTo: null,
};

const STATUS_OPTIONS: DocumentStatus[] = ['draft', 'sent', 'paid', 'overdue', 'accepted', 'rejected', 'expired'];

const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    PKR: '₨',
};

type DocumentType = Invoice | Estimate | Quote;

const pageVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, duration: 0.3 } },
};

const tableContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const tableRowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

interface DashboardStatsGridProps {
    documents: DocumentType[];
    docType: 'invoice' | 'estimate' | 'quote';
    onKpiClick: (title: string, data: DocumentType[]) => void;
}

const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ documents, docType, onKpiClick }) => {
    const stats = useMemo(() => {
        const uniqueClients = new Set(documents.map(d => d.client.name)).size;
        
        const categoryCounts = documents.reduce((acc, doc) => {
            if (doc.category) {
                acc[doc.category] = (acc[doc.category] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const mostUsedCategory = Object.entries(categoryCounts).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0])[0];


        if (docType === 'invoice') {
            const paidInvoices = documents.filter(d => d.status === 'paid') as Invoice[];
            const outstandingInvoices = documents.filter(d => d.status === 'sent') as Invoice[];
            const overdueInvoices = documents.filter(d => d.status === 'overdue') as Invoice[];
            const draftInvoices = documents.filter(d => d.status === 'draft') as Invoice[];
            const nonDraftInvoices = documents.filter(d => d.status !== 'draft') as Invoice[];

            const totalRevenue = paidInvoices.reduce((acc, doc) => acc + (doc.summary?.grandTotal || 0), 0);
            const outstanding = outstandingInvoices.reduce((acc, doc) => acc + (doc.summary?.grandTotal || 0), 0);
            const overdue = overdueInvoices.reduce((acc, doc) => acc + (doc.summary?.grandTotal || 0), 0);
            const totalInvoiced = nonDraftInvoices.reduce((acc, doc) => acc + (doc.summary?.grandTotal || 0), 0);
            const avgInvoiceValue = nonDraftInvoices.length > 0 ? totalInvoiced / nonDraftInvoices.length : 0;
            
            return {
                totalRevenue, outstanding, overdue, totalInvoiced, avgInvoiceValue, uniqueClients, mostUsedCategory,
                paidInvoices, outstandingInvoices, overdueInvoices, draftInvoices,
                drafts: draftInvoices.length,
                paidCount: paidInvoices.length,
            };
        } else {
            const acceptedDocs = documents.filter(d => d.status === 'accepted');
            const draftDocs = documents.filter(d => d.status === 'draft');
            const nonDraftDocs = documents.filter(d => d.status !== 'draft');
            
            const totalValue = nonDraftDocs.reduce((acc, doc) => acc + (doc.summary?.grandTotal || 0), 0);
            const acceptedValue = acceptedDocs.reduce((acc, doc) => acc + (doc.summary?.grandTotal || 0), 0);
            
            const conversionRateValue = totalValue > 0 ? (acceptedValue / totalValue) * 100 : 0;
            const conversionRateCount = nonDraftDocs.length > 0 ? (acceptedDocs.length / nonDraftDocs.length) * 100 : 0;
            const avgValue = nonDraftDocs.length > 0 ? totalValue / nonDraftDocs.length : 0;

            return {
                totalValue, acceptedValue, conversionRateValue, conversionRateCount, avgValue, uniqueClients, mostUsedCategory,
                acceptedDocs, draftDocs,
                acceptedCount: acceptedDocs.length,
                pendingCount: documents.filter(d => d.status === 'sent').length,
                draftCount: draftDocs.length,
            };
        }
    }, [documents, docType]);

    const formatCurrency = (amount: number) => {
        const currency = documents[0]?.currency || 'USD';
        return `${currencySymbols[currency] || '$'}${amount.toFixed(2)}`;
    };

    if (docType === 'invoice') {
        const s = stats as any;
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card as="button" onClick={() => onKpiClick('Total Revenue', s.paidInvoices)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(s.totalRevenue)}</div><p className="text-xs text-muted-foreground">{s.paidCount} paid invoices</p></CardContent></Card>
                <Card as="button" onClick={() => onKpiClick('Pending Invoices', s.outstandingInvoices)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(s.outstanding)}</div></CardContent></Card>
                <Card as="button" onClick={() => onKpiClick('Overdue Invoices', s.overdueInvoices)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Overdue</CardTitle><FileWarning className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(s.overdue)}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Invoiced</CardTitle><Files className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(s.totalInvoiced)}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Avg. Invoice Value</CardTitle><AreaChart className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(s.avgInvoiceValue)}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Unique Clients</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{s.uniqueClients}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Most Used Category</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-lg font-bold">{s.mostUsedCategory || 'N/A'}</div></CardContent></Card>
                <Card as="button" onClick={() => onKpiClick('Draft Invoices', s.draftInvoices)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Drafts</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{s.drafts}</div></CardContent></Card>
            </div>
        );
    } else {
        const s = stats as any;
        const docTypeCap = docType.charAt(0).toUpperCase() + docType.slice(1);
        return (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total {docTypeCap} Value</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(s.totalValue)}</div></CardContent></Card>
                <Card as="button" onClick={() => onKpiClick(`Accepted ${docTypeCap}s`, s.acceptedDocs)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Accepted Value</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(s.acceptedValue)}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Conversion Rate (Value)</CardTitle><Percent className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{s.conversionRateValue.toFixed(1)}%</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Avg. {docTypeCap} Value</CardTitle><AreaChart className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(s.avgValue)}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Conversion Rate (Count)</CardTitle><Percent className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{s.conversionRateCount.toFixed(1)}%</div></CardContent></Card>
                <Card as="button" onClick={() => onKpiClick(`Accepted ${docTypeCap}s`, s.acceptedDocs)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Accepted</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{s.acceptedCount}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Most Used Category</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-lg font-bold">{s.mostUsedCategory || 'N/A'}</div></CardContent></Card>
                <Card as="button" onClick={() => onKpiClick(`Draft ${docTypeCap}s`, s.draftDocs)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Drafts</CardTitle><FileText className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{s.draftCount}</div></CardContent></Card>
            </div>
        );
    }
}


export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('invoices');
    const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; collection: string } | null>(null);
    const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const [modalState, setModalState] = useState<{ isOpen: boolean; title: string; data: DocumentType[] }>({ isOpen: false, title: '', data: [] });
    const [historyModalState, setHistoryModalState] = useState<{ isOpen: boolean, auditLog: AuditLogEntry[]}>({isOpen: false, auditLog: []});
    const { toast } = useToast();
    const { firestore } = useFirebase();
    const { user, userProfile, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const userPlan = userProfile?.plan || 'free';
    const companyId = userProfile?.companyId;
    const isBusinessPlan = userPlan === 'business';

    const clientsQuery = useMemoFirebase(() => {
        if (!firestore || !companyId) return null;
        return query(collection(firestore, 'companies', companyId, CLIENTS_COLLECTION));
    }, [firestore, companyId]);

    const invoicesQuery = useMemoFirebase(() => {
        if (!firestore || !companyId) return null;
        let q = query(collection(firestore, 'companies', companyId, INVOICES_COLLECTION));
        return q;
    }, [firestore, companyId]);

    const estimatesQuery = useMemoFirebase(() => {
        if (!firestore || !companyId) return null;
        let q = query(collection(firestore, 'companies', companyId, ESTIMATES_COLLECTION));
        return q;
    }, [firestore, companyId]);

    const quotesQuery = useMemoFirebase(() => {
        if (!firestore || !companyId) return null;
        let q = query(collection(firestore, 'companies', companyId, QUOTES_COLLECTION));
        return q;
    }, [firestore, companyId]);


    const { data: clients, isLoading: isLoadingClients } = useCollection<Client>(clientsQuery);
    const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesQuery);
    const { data: estimates, isLoading: isLoadingEstimates } = useCollection<Estimate>(estimatesQuery);
    const { data: quotes, isLoading: isLoadingQuotes } = useCollection<Quote>(quotesQuery);
    
    const canCreateInvoice = isBusinessPlan || (invoices?.length || 0) < 5;
    const canCreateEstimate = isBusinessPlan || (estimates?.length || 0) < 3;

    const handleKpiClick = (title: string, data: DocumentType[]) => {
        setModalState({ isOpen: true, title, data });
    };

    const handleHistoryClick = (auditLog?: AuditLogEntry[]) => {
        const sortedLog = (auditLog || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHistoryModalState({ isOpen: true, auditLog: sortedLog });
    };

    const handleCreateInvoice = () => {
        if (canCreateInvoice) {
            router.push('/create-invoice');
        } else {
            toast({
                title: "Free Plan Limit Reached",
                description: "Upgrade to the Business Plan to create unlimited invoices.",
                variant: "destructive"
            });
            router.push('/pricing');
        }
    };
    
    const handleCreateEstimate = () => {
        if (canCreateEstimate) {
            router.push('/create-estimate');
        } else {
            toast({
                title: "Free Plan Limit Reached",
                description: "Upgrade to the Business Plan to create unlimited estimates.",
                variant: "destructive"
            });
             router.push('/pricing');
        }
    };

    const handleCreateQuote = () => {
        if (isBusinessPlan) {
            router.push('/create-quote');
        } else {
            toast({
                title: "Upgrade Required",
                description: "Creating quotes is a Business Plan feature. Please upgrade your plan.",
                variant: "destructive"
            });
            router.push('/pricing');
        }
    };

    const calculateTotal = useCallback((doc: DocumentType): number => {
        if (doc.documentType === 'invoice') {
            const invoice = doc as Invoice;
            return invoice.summary.grandTotal;
        } else {
            const estimate = doc as Estimate | Quote;
            return estimate.summary.grandTotal;
        }
    }, []);

    const handleDelete = () => {
        if (!deleteCandidate || !firestore || !companyId) return;
        const { id, collection: collectionName } = deleteCandidate;
        const docRef = doc(firestore, 'companies', companyId, collectionName, id);
        deleteDocumentNonBlocking(docRef);
        setDeleteCandidate(null);
        toast({
            title: "Document Deleted",
            description: `The document has been deleted.`,
        });
    };

    const handleStatusChange = (id: string, collectionName: string, newStatus: DocumentStatus) => {
        if (!firestore || !companyId) return;
        const docRef = doc(firestore, 'companies', companyId, collectionName, id);
        updateDocumentNonBlocking(docRef, { status: newStatus });
        toast({
            title: "Status Updated",
            description: `Document status changed to "${newStatus}".`,
        });
    };
    
    const handleConvertToInvoice = async (estimate: Estimate | Quote) => {
        if (!firestore || !user || !companyId) return;
        if (!canCreateInvoice) {
            toast({
                title: "Free Plan Limit Reached",
                description: "You have reached your invoice limit. Please upgrade to convert this document.",
                variant: 'destructive'
            });
            router.push('/pricing');
            return;
        }
        
        const { business, client, lineItems, summary, projectTitle, currency, language, estimateNumber, auditLog } = estimate;

        const newAuditLogEntry: AuditLogEntry = {
            id: crypto.randomUUID(),
            action: 'created',
            timestamp: Timestamp.now(),
            user: { name: user.displayName, email: user.email },
            version: 1,
        };

        const newInvoiceData: Omit<Invoice, 'id'| 'createdAt' | 'updatedAt'> = {
            userId: user.uid,
            companyId: companyId,
            business: business,
            client: { ...client, shippingAddress: client.address },
            invoiceNumber: `INV-${estimateNumber.replace('EST-', '').replace('QTE-', '')}`,
            invoiceDate: new Date(),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            lineItems: lineItems,
            summary: summary,
            status: 'draft',
            documentType: 'invoice',
            category: 'General Services', // Default category for converted invoice
            currency: currency,
            language: language,
            template: 'default',
            amountPaid: 0,
            paymentInstructions: 'Thank you for your business. Please make payment to the details provided below.',
            auditLog: [newAuditLogEntry],
        };
        
        try {
            const newDocRef = doc(collection(firestore, 'companies', companyId, INVOICES_COLLECTION));
            
            await setDoc(doc(firestore, "companies", companyId, "invoices", newDocRef.id), {
                ...newInvoiceData,
                id: newDocRef.id,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });

            toast({
                title: 'Invoice Created',
                description: `Document ${estimateNumber} has been successfully converted to an invoice.`
            });
            router.push(`/create-invoice?draftId=${newDocRef.id}`);
        } catch (error) {
            console.error("Error converting document to invoice:", error);
            toast({
                title: 'Conversion Failed',
                description: 'Could not convert the document to an invoice. Please try again.',
                variant: 'destructive'
            });
        }
    };

    const handleShare = (docId: string, docType: 'estimate' | 'quote') => {
        if (!isBusinessPlan) {
            toast({
                title: "Upgrade to Share",
                description: "Sharing documents via a link is a Business Plan feature.",
                variant: 'destructive'
            });
            return;
        }
        const url = `${window.location.origin}/${docType}/${docId}`;
        navigator.clipboard.writeText(url);
        toast({
            title: "Link Copied!",
            description: "The shareable link has been copied to your clipboard.",
        });
    };

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);

    const toDateSafe = (value: any): Date | null => {
        if (!value) return null;
        if (value instanceof Date) return value;
        if (value.toDate && typeof value.toDate === 'function') {
            return value.toDate();
        }
        const d = new Date(value);
        return isValid(d) ? d : null;
    };
    
    const normalizeAuditLog = (log: any): AuditLogEntry[] => {
        if (!log) return [];
        const entries = Array.isArray(log) ? log : Object.values(log);
        return entries.map(entry => ({
            ...entry,
            timestamp: toDateSafe(entry.timestamp)
        }));
    };

    const allDocuments = useMemo(() => {
        const allDocs: DocumentType[] = [...(invoices || []), ...(estimates || []), ...(quotes || [])];
        
        return allDocs.map(doc => {
            const newDoc: any = { ...doc };
            
            const dateFields: (keyof Invoice | keyof Estimate | keyof Quote)[] = [
                'invoiceDate', 'dueDate', 'estimateDate', 'validUntilDate', 'createdAt', 'updatedAt'
            ];

            dateFields.forEach(field => {
                if (newDoc[field]) {
                    newDoc[field] = toDateSafe(newDoc[field]);
                }
            });

            if (newDoc.auditLog) {
                newDoc.auditLog = normalizeAuditLog(newDoc.auditLog);
            }

            return newDoc as DocumentType;
        }).sort((a, b) => {
            const dateA = a.updatedAt || a.createdAt;
            const dateB = b.updatedAt || b.createdAt;
            if (!dateA || !isValid(dateA)) return 1;
            if (!dateB || !isValid(dateB)) return -1;
            return dateB.getTime() - dateA.getTime();
        });
    }, [invoices, estimates, quotes]);

    const filteredDocuments = useMemo(() => {
        return allDocuments.filter(doc => {
            const total = calculateTotal(doc);
            
            let docDate: Date | null = null;
            let clientName = '';

            if (doc.documentType === 'invoice') {
              const invoiceDoc = doc as Invoice;
              docDate = toDateSafe(invoiceDoc.invoiceDate);
              clientName = invoiceDoc.client.name;
            } else if (doc.documentType === 'estimate' || doc.documentType === 'quote') {
              const estimateDoc = doc as Estimate | Quote;
              docDate = toDateSafe(estimateDoc.estimateDate);
              clientName = estimateDoc.client.name;
            }

            const clientNameMatch = filters.clientName ? clientName.toLowerCase().includes(filters.clientName.toLowerCase()) : true;
            const statusMatch = filters.status ? doc.status === filters.status : true;
            const amountMinMatch = filters.amountMin != null ? total >= filters.amountMin : true;
            const amountMaxMatch = filters.amountMax != null ? total <= filters.amountMax : true;
            
            let dateMatch = true;
            if (docDate) {
              const dateFrom = filters.dateFrom ? new Date(filters.dateFrom.setHours(0,0,0,0)) : null;
              const dateTo = filters.dateTo ? new Date(filters.dateTo.setHours(23,59,59,999)) : null;

              if (dateFrom && dateTo) {
                dateMatch = isWithinInterval(docDate, { start: dateFrom, end: dateTo });
              } else if (dateFrom) {
                dateMatch = docDate >= dateFrom;
              } else if (dateTo) {
                dateMatch = docDate <= dateTo;
              }
            }

            return clientNameMatch && statusMatch && amountMinMatch && amountMaxMatch && dateMatch;
        });
    }, [allDocuments, filters, calculateTotal]);

    const filteredClients = useMemo(() => {
        if (!clients) return [];
        if (!filters.clientName) return clients;
        return clients.filter(client => 
            client.name.toLowerCase().includes(filters.clientName.toLowerCase()) || 
            (client.companyName && client.companyName.toLowerCase().includes(filters.clientName.toLowerCase()))
        );
    }, [clients, filters.clientName]);


    const filteredInvoices = useMemo(() => filteredDocuments.filter(d => d.documentType === 'invoice'), [filteredDocuments]);
    const filteredEstimates = useMemo(() => filteredDocuments.filter(d => d.documentType === 'estimate'), [filteredDocuments]);
    const filteredQuotes = useMemo(() => filteredDocuments.filter(d => d.documentType === 'quote'), [filteredDocuments]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.clientName) count++;
        if (filters.status) count++;
        if (filters.amountMin != null) count++;
        if (filters.amountMax != null) count++;
        if (filters.dateFrom) count++;
        if (filters.dateTo) count++;
        return count;
    }, [filters]);

    const getStatusVariant = (status: DocumentStatus) => {
        switch (status) {
            case 'paid':
            case 'accepted':
                 return 'success';
            case 'sent': return 'secondary';
            case 'overdue':
            case 'rejected':
            case 'expired':
                return 'destructive';
            case 'draft':
            default: return 'outline';
        }
    };
    
    const isLoading = isAuthLoading || isLoadingInvoices || isLoadingEstimates || isLoadingQuotes;

    const renderTable = (docs: DocumentType[], docType: 'invoice' | 'estimate' | 'quote') => (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Number</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">History</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <motion.tbody
                    variants={tableContainerVariants}
                    initial="hidden"
                    animate="visible"
                    as={TableBody}
                >
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                                Loading documents...
                            </TableCell>
                        </TableRow>
                    ) : docs.length > 0 ? docs.map((doc) => {
                        const isInvoice = doc.documentType === 'invoice';
                        const docNumber = isInvoice ? (doc as Invoice).invoiceNumber : (doc as Estimate | Quote).estimateNumber;
                        const clientName = doc.client.name;
                        
                        let docCollection: string;
                        let editUrl: string;
                        
                        if(docType === 'invoice') {
                            docCollection = INVOICES_COLLECTION;
                            editUrl = `/create-invoice?draftId=${doc.id}`;
                        } else if (docType === 'estimate') {
                            docCollection = ESTIMATES_COLLECTION;
                            editUrl = `/create-estimate?draftId=${doc.id}`;
                        } else {
                            docCollection = QUOTES_COLLECTION;
                            editUrl = `/create-quote?draftId=${doc.id}`;
                        }

                        return (
                        <motion.tr
                            key={doc.id}
                            variants={tableRowVariants}
                            className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            as={TableRow}
                        >
                            <TableCell className="font-medium">{docNumber}</TableCell>
                            <TableCell>{clientName}</TableCell>
                            <TableCell>{currencySymbols[doc.currency] || '$'}{calculateTotal(doc).toFixed(2)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="capitalize w-28 justify-start rounded-full">
                                            <Badge variant={getStatusVariant(doc.status)} className="w-full justify-center rounded-full">{doc.status}</Badge>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {STATUS_OPTIONS.map(status => (
                                            <DropdownMenuItem
                                                key={status}
                                                disabled={doc.status === status}
                                                onClick={() => handleStatusChange(doc.id, docCollection, status)}
                                                className="capitalize"
                                            >
                                                {status}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                             <TableCell className="text-center">
                                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleHistoryClick(doc.auditLog)}>
                                    <History className="h-4 w-4" />
                                </Button>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">More actions</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={editUrl} className="cursor-pointer">
                                                <Edit className="mr-2 h-4 w-4" />
                                                <span>Edit</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        {(docType === 'estimate' || docType === 'quote') && (
                                            <>
                                                <DropdownMenuItem onClick={() => handleShare(doc.id, doc.documentType as 'estimate' | 'quote')} className="cursor-pointer">
                                                    <Share2 className="mr-2 h-4 w-4" />
                                                    <span>Share Link</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleConvertToInvoice(doc as Estimate | Quote)} className="cursor-pointer">
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    <span>Convert to Invoice</span>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        <DropdownMenuItem onClick={() => setDeleteCandidate({id: doc.id, collection: docCollection})} className="text-destructive cursor-pointer">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </motion.tr>
                        )
                    }) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                                No documents found.
                            </TableCell>
                        </TableRow>
                    )}
                </motion.tbody>
            </Table>
        </div>
    );

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                 <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
                    <div>
                        <Skeleton className="h-9 w-64 mb-2" />
                        <Skeleton className="h-5 w-80" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-36 rounded-full" />
                        <Skeleton className="h-10 w-36 rounded-full" />
                    </div>
                </div>
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-10 w-full max-w-sm" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <>
            <KpiDetailsModal 
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({...prev, isOpen: false}))}
                title={modalState.title}
                documents={modalState.data}
                currencySymbol={currencySymbols[filteredDocuments[0]?.currency] || '$'}
            />
             <HistoryModal 
                isOpen={historyModalState.isOpen}
                onClose={() => setHistoryModalState({ isOpen: false, auditLog: [] })}
                auditLog={historyModalState.auditLog}
            />
            <div className="container mx-auto p-4 md:p-8">
                <FilterSheet
                    open={isFilterSheetOpen}
                    onOpenChange={setIsFilterSheetOpen}
                    filters={filters}
                    onFiltersChange={setFilters}
                    onReset={resetFilters}
                />

                <AlertDialog open={deleteCandidate !== null} onOpenChange={(open) => !open && setDeleteCandidate(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this document.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteCandidate(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <motion.div 
                    className="mb-8"
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Greeting />
                    <div className="flex justify-between items-center gap-4 flex-wrap">
                        <motion.div variants={pageVariants}>
                            <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
                            <p className="text-muted-foreground">An overview of your financial documents and activities.</p>
                        </motion.div>
                    </div>
                </motion.div>

                 <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                 >
                    <Card className='bg-card/50 backdrop-blur-sm'>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Start creating a new document or add a new client.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                <Button onClick={() => router.push('/dashboard/clients/new')} className="rounded-full">
                                    <Users className="mr-2 h-4 w-4" />
                                    New Client
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                <Button onClick={handleCreateInvoice} variant="outline" className="rounded-full">
                                    <FilePlus2 className="mr-2 h-4 w-4" />
                                    New Invoice
                                </Button>
                            </motion.div>
                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                <Button onClick={handleCreateEstimate} variant="outline" className="rounded-full">
                                    <FilePlus2 className="mr-2 h-4 w-4" />
                                    New Estimate
                                </Button>
                            </motion.div>
                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                <Button onClick={handleCreateQuote} variant="outline" className="rounded-full">
                                    <FileText className="mr-2 h-4 w-4" />
                                    New Quote
                                </Button>
                            </motion.div>
                             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                <Button onClick={() => router.push('/create-insurance')} variant="outline" className="rounded-full">
                                    <Shield className="mr-2 h-4 w-4" />
                                    New Insurance Doc
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <div className="flex justify-between items-end mb-4">
                          <div className="flex items-center gap-2">
                              <Button variant="outline" className='rounded-full' onClick={() => setIsFilterSheetOpen(true)}>
                              <Filter className="mr-2 h-4 w-4" />
                              Filter
                              {activeFilterCount > 0 && (
                                  <Badge variant="secondary" className="ml-2 rounded-full h-5 w-5 p-0 flex items-center justify-center">{activeFilterCount}</Badge>
                              )}
                              </Button>
                              {activeFilterCount > 0 && (
                                  <Button variant="ghost" size="sm" className="rounded-full" onClick={resetFilters}>
                                      <X className="h-4 w-4 mr-1" /> Clear
                                  </Button>
                              )}
                          </div>
                      </div>

                      <TabsContent value="invoices">
                           <Card className='bg-card/50 backdrop-blur-sm'>
                              <CardContent className="pt-6">
                                  <DashboardStatsGrid documents={filteredInvoices} docType="invoice" onKpiClick={handleKpiClick} />
                                  {renderTable(filteredInvoices, 'invoice')}
                              </CardContent>
                           </Card>
                      </TabsContent>
                      <TabsContent value="estimates">
                           <Card className='bg-card/50 backdrop-blur-sm'>
                              <CardContent className="pt-6">
                                   <DashboardStatsGrid documents={filteredEstimates} docType="estimate" onKpiClick={handleKpiClick} />
                                   {renderTable(filteredEstimates, 'estimate')}
                              </CardContent>
                           </Card>
                      </TabsContent>
                      <TabsContent value="quotes">
                           <Card className='bg-card/50 backdrop-blur-sm'>
                              <CardContent className="pt-6">
                                   <DashboardStatsGrid documents={filteredQuotes} docType="quote" onKpiClick={handleKpiClick} />
                                   {renderTable(filteredQuotes, 'quote')}
                              </CardContent>
                           </Card>
                      </TabsContent>
                       <TabsContent value="clients">
                           <Card className='bg-card/50 backdrop-blur-sm'>
                              <CardHeader>
                                  <CardTitle>Clients</CardTitle>
                                  <CardDescription>A list of all your clients. Click a client to view their profile and documents.</CardDescription>
                              </CardHeader>
                              <CardContent>
                                  <Table>
                                      <TableHeader>
                                          <TableRow>
                                              <TableHead>Name</TableHead>
                                              <TableHead>Company</TableHead>
                                              <TableHead>Email</TableHead>
                                              <TableHead className="text-right">Actions</TableHead>
                                          </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                          {filteredClients ? filteredClients.map((client) => (
                                              <TableRow 
                                                  key={client.id} 
                                                  className="cursor-pointer"
                                                  onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                                              >
                                                  <TableCell className="font-medium">{client.name}</TableCell>
                                                  <TableCell>{client.companyName}</TableCell>
                                                  <TableCell>{client.email}</TableCell>
                                                  <TableCell className="text-right">
                                                       <Button variant="ghost" size="sm">View</Button>
                                                  </TableCell>
                                              </TableRow>
                                          )) : (
                                              <TableRow><TableCell colSpan={4} className="text-center h-24">No clients found.</TableCell></TableRow>
                                          )}
                                      </TableBody>
                                  </Table>
                              </CardContent>
                           </Card>
                      </TabsContent>
                  </Tabs>
                </motion.div>
            </div>
        </>
    );
}

