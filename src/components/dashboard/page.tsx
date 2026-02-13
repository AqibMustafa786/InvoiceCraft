
'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Invoice, Estimate, DocumentStatus, Quote, AuditLogEntry, Client, InsuranceDocument } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { FilePlus2, Edit, Trash2, Filter, X, MoreHorizontal, FileText, Share2, DollarSign, Clock, FileWarning, Files, CheckCircle, FileQuestion, Users, Percent, AreaChart, Package, History, Shield, XCircle } from "lucide-react";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, isWithinInterval } from 'date-fns';
import { FilterSheet, type DashboardFilters } from '@/components/dashboard/filter-sheet';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUserAuth } from '@/context/auth-provider';
import { collection, doc, setDoc, query, Timestamp, where } from 'firebase/firestore';
import { deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { KpiDetailsModal } from '@/components/dashboard/kpi-details-modal';
import { HistoryModal } from '@/components/dashboard/history-modal';
import { ClientFormDialog } from '@/components/dashboard/client-form-dialog';
import { toDateSafe, toNumberSafe } from '@/lib/utils';

const INVOICES_COLLECTION = 'invoices';
const ESTIMATES_COLLECTION = 'estimates';
const QUOTES_COLLECTION = 'quotes';
const CLIENTS_COLLECTION = 'clients';
const INSURANCE_COLLECTION = 'insurance';

const initialFilters: DashboardFilters = {
    clientName: '',
    status: null,
    amountMin: null,
    amountMax: null,
    dateFrom: null,
    dateTo: null,
};

const STATUS_OPTIONS: DocumentStatus[] = ['draft', 'sent', 'paid', 'overdue', 'accepted', 'rejected', 'expired', 'active', 'cancelled'];

const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    PKR: '₨',
};

type DocumentType = Invoice | Estimate | Quote | InsuranceDocument;

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
    docType: 'invoice' | 'estimate' | 'quote' | 'insurance';
    onKpiClick: (title: string, data: DocumentType[]) => void;
}

const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ documents, docType, onKpiClick }) => {
    const stats = useMemo(() => {
        const uniqueClients = new Set(documents.map(d => (d as any).client?.name || (d as any).policyHolder?.name)).size;

        const categoryCounts = documents.reduce((acc, doc) => {
            if ((doc as any).category) {
                acc[(doc as any).category] = (acc[(doc as any).category] || 0) + 1;
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

            const totalRevenue = paidInvoices.reduce((acc, doc) => acc + (toNumberSafe(doc.summary?.grandTotal)), 0);
            const outstanding = outstandingInvoices.reduce((acc, doc) => acc + (toNumberSafe(doc.summary?.grandTotal)), 0);
            const overdue = overdueInvoices.reduce((acc, doc) => acc + (toNumberSafe(doc.summary?.grandTotal)), 0);
            const totalInvoiced = nonDraftInvoices.reduce((acc, doc) => acc + (toNumberSafe(doc.summary?.grandTotal)), 0);
            const avgInvoiceValue = nonDraftInvoices.length > 0 ? totalInvoiced / nonDraftInvoices.length : 0;

            return {
                totalRevenue, outstanding, overdue, totalInvoiced, avgInvoiceValue, uniqueClients, mostUsedCategory,
                paidInvoices, outstandingInvoices, overdueInvoices, draftInvoices,
                drafts: draftInvoices.length,
                paidCount: paidInvoices.length,
            };
        } else if (docType === 'insurance') {
            const activePolicies = documents.filter(d => d.status === 'active');
            const expiredPolicies = documents.filter(d => d.status === 'expired');
            const draftPolicies = documents.filter(d => d.status === 'draft');
            const policyTypes = documents.reduce((acc, doc) => {
                const policyType = (doc as InsuranceDocument).policyType;
                if (policyType) {
                    acc[policyType] = (acc[policyType] || 0) + 1;
                }
                return acc;
            }, {} as Record<string, number>);
            const mostUsedPolicyType = Object.keys(policyTypes).length > 0 ? Object.entries(policyTypes).reduce((a, b) => b[1] > a[1] ? b : a)[0] : 'N/A';

            return {
                totalPolicies: documents.length,
                activePolicies: activePolicies.length,
                expiredPolicies: expiredPolicies.length,
                draftPolicies: draftPolicies.length,
                insuredClients: uniqueClients,
                mostUsedPolicyType,
            }
        }
        else {
            const acceptedDocs = documents.filter(d => d.status === 'accepted') as (Estimate | Quote)[];
            const rejectedDocs = documents.filter(d => d.status === 'rejected') as (Estimate | Quote)[];
            const pendingDocs = documents.filter(d => d.status === 'sent') as (Estimate | Quote)[];
            const draftDocs = documents.filter(d => d.status === 'draft') as (Estimate | Quote)[];
            const nonDraftDocs = documents.filter(d => d.status !== 'draft') as (Estimate | Quote)[];

            const totalValue = nonDraftDocs.reduce((acc, doc) => acc + (toNumberSafe(doc.summary?.grandTotal)), 0);
            const acceptedValue = acceptedDocs.reduce((acc, doc) => acc + (toNumberSafe(doc.summary?.grandTotal)), 0);

            const conversionRate = nonDraftDocs.length > 0 ? (acceptedDocs.length / nonDraftDocs.length) * 100 : 0;
            const avgValue = nonDraftDocs.length > 0 ? totalValue / nonDraftDocs.length : 0;

            return {
                totalValue, acceptedValue, conversionRate, avgValue, uniqueClients, mostUsedCategory,
                totalCount: documents.length,
                acceptedCount: acceptedDocs.length,
                rejectedCount: rejectedDocs.length,
                pendingCount: pendingDocs.length,
                draftCount: draftDocs.length,
            };
        }
    }, [documents, docType]);

    const formatCurrency = (amount: number) => {
        const currency = (documents[0] as any)?.currency || 'USD';
        return `${currencySymbols[currency] || '$'}${toNumberSafe(amount).toFixed(2)}`;
    };

    if (docType === 'invoice') {
        const s = stats as any;
        return (
            <motion.div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 mb-4" variants={pageVariants}>
                <motion.div variants={pageVariants}><Card as="button" onClick={() => onKpiClick('Total Revenue', s.paidInvoices)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Total Revenue</CardTitle><DollarSign className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.totalRevenue)}</div><p className="text-xs text-muted-foreground">{s.paidCount} paid invoices</p></CardContent></Card></motion.div>
                <motion.div variants={pageVariants}><Card as="button" onClick={() => onKpiClick('Pending Invoices', s.outstandingInvoices)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Pending</CardTitle><Clock className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.outstanding)}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants}><Card as="button" onClick={() => onKpiClick('Overdue Invoices', s.overdueInvoices)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Overdue</CardTitle><FileWarning className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.overdue)}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants}><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Total Invoiced</CardTitle><Files className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.totalInvoiced)}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants} className="col-span-2 sm:col-span-1"><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Avg. Invoice Value</CardTitle><AreaChart className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.avgInvoiceValue)}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants} className="col-span-2 sm:col-span-1"><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Unique Clients</CardTitle><Users className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.uniqueClients}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants} className="col-span-2 md:col-span-1"><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Most Used Category</CardTitle><Package className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-lg font-bold">{s.mostUsedCategory || 'N/A'}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants} className="col-span-2 md:col-span-1"><Card as="button" onClick={() => onKpiClick('Draft Invoices', s.draftInvoices)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Drafts</CardTitle><FileText className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.drafts}</div></CardContent></Card></motion.div>
            </motion.div>
        );
    } else if (docType === 'insurance') {
        const s = stats as any;
        return (
            <motion.div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 mb-4" variants={pageVariants}>
                <motion.div variants={pageVariants}><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Total Policies</CardTitle><Shield className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.totalPolicies}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants}><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Active Policies</CardTitle><CheckCircle className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.activePolicies}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants}><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Expired Policies</CardTitle><FileWarning className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.expiredPolicies}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants}><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Draft Policies</CardTitle><FileText className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.draftPolicies}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants} className="col-span-2 sm:col-span-1"><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Insured Clients</CardTitle><Users className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.insuredClients}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants} className="col-span-2 sm:col-span-1"><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Top Policy Type</CardTitle><Package className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-lg font-bold">{s.mostUsedPolicyType}</div></CardContent></Card></motion.div>
            </motion.div>
        )
    }
    else {
        const s = stats as any;
        const docTypeCap = docType.charAt(0).toUpperCase() + docType.slice(1);
        return (
            <motion.div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 mb-4" variants={pageVariants}>
                <motion.div variants={pageVariants}><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Total {docTypeCap}s</CardTitle><Files className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.totalCount}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants}><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Accepted</CardTitle><CheckCircle className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.acceptedCount}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants}><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Rejected</CardTitle><XCircle className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.rejectedCount}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants}><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Pending Approval</CardTitle><Clock className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.pendingCount}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants} className="col-span-2 sm:col-span-1"><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Total Estimated Value</CardTitle><DollarSign className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.totalValue)}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants} className="col-span-2 sm:col-span-1"><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Conversion Rate</CardTitle><Percent className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.conversionRate.toFixed(1)}%</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants} className="col-span-2 md:col-span-1"><Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Avg. {docTypeCap} Value</CardTitle><AreaChart className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.avgValue)}</div></CardContent></Card></motion.div>
                <motion.div variants={pageVariants} className="col-span-2 md:col-span-1"><Card as="button" onClick={() => onKpiClick(`Draft ${docTypeCap}s`, s.draftDocs)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Drafts</CardTitle><FileText className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.draftCount}</div></CardContent></Card></motion.div>
            </motion.div>
        );
    }
}


export default function DashboardPage() {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'invoices';
    const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; collection: string } | null>(null);
    const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [modalState, setModalState] = useState<{ isOpen: boolean; title: string; data: DocumentType[] }>({ isOpen: false, title: '', data: [] });
    const [historyModalState, setHistoryModalState] = useState<{ isOpen: boolean, auditLog: AuditLogEntry[] }>({ isOpen: false, auditLog: [] });
    const { toast } = useToast();
    const { firestore } = useFirebase();
    const { user, userProfile, isLoading: isAuthLoading } = useUserAuth();
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
        return query(collection(firestore, 'companies', companyId, INVOICES_COLLECTION));
    }, [firestore, companyId]);

    const estimatesQuery = useMemoFirebase(() => {
        if (!firestore || !companyId) return null;
        return query(collection(firestore, 'companies', companyId, ESTIMATES_COLLECTION));
    }, [firestore, companyId]);

    const quotesQuery = useMemoFirebase(() => {
        if (!firestore || !companyId) return null;
        return query(collection(firestore, 'companies', companyId, QUOTES_COLLECTION));
    }, [firestore, companyId]);

    const insuranceQuery = useMemoFirebase(() => {
        if (!firestore || !companyId) return null;
        return query(collection(firestore, 'companies', companyId, INSURANCE_COLLECTION));
    }, [firestore, companyId]);


    const { data: clients, isLoading: isLoadingClients } = useCollection<Client>(clientsQuery);
    const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesQuery);
    const { data: estimates, isLoading: isLoadingEstimates } = useCollection<Estimate>(estimatesQuery);
    const { data: quotes, isLoading: isLoadingQuotes } = useCollection<Quote>(quotesQuery);
    const { data: insuranceDocs, isLoading: isLoadingInsurance } = useCollection<InsuranceDocument>(insuranceQuery);

    const canCreateInvoice = isBusinessPlan || (invoices?.length || 0) < 5;
    const canCreateEstimate = isBusinessPlan || (estimates?.length || 0) < 3;

    const handleKpiClick = (title: string, data: DocumentType[]) => {
        setModalState({ isOpen: true, title, data });
    };

    const handleHistoryClick = (auditLog?: AuditLogEntry[]) => {
        const sortedLog = (auditLog || []).sort((a, b) => {
            const dateA = toDateSafe(a.timestamp);
            const dateB = toDateSafe(b.timestamp);
            if (!dateA || !dateB) return 0;
            return dateB.getTime() - dateA.getTime();
        });
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

    const handleAddClient = () => {
        setEditingClient(null);
        setIsClientDialogOpen(true);
    };

    const handleEditClient = (client: Client) => {
        setEditingClient(client);
        setIsClientDialogOpen(true);
    };

    const handleDeleteClient = (clientId: string) => {
        if (!firestore || !companyId) return;
        const docRef = doc(firestore, 'companies', companyId, CLIENTS_COLLECTION, clientId);
        deleteDocumentNonBlocking(docRef);
        setDeleteCandidate(null);
        toast({
            title: "Client Deleted",
            description: "The client has been successfully deleted.",
        });
    };

    const calculateTotal = useCallback((doc: DocumentType): number => {
        if ('summary' in doc && doc.summary) {
            return (toNumberSafe((doc as Invoice | Estimate | Quote).summary.grandTotal));
        }
        if ('items' in doc) {
            const insuranceDoc = doc as InsuranceDocument;
            const subtotal = insuranceDoc.items.reduce((acc, item) => acc + (toNumberSafe(item.quantity)) * (toNumberSafe(item.rate)), 0);
            return subtotal;
        }
        return 0;
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
                description: "You have reached your invoice limit. Please convert this document.",
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

        const newInvoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
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

    const handleShare = (docId: string, docType: 'estimate' | 'quote' | 'insurance') => {
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

    const allDocuments = useMemo(() => {
        const allDocs: DocumentType[] = [...(invoices || []), ...(estimates || []), ...(quotes || []), ...(insuranceDocs || [])];

        return allDocs.map(doc => {
            const newDoc: any = { ...doc };

            const dateFields = [
                'invoiceDate', 'dueDate', 'estimateDate', 'validUntilDate', 'documentDate', 'createdAt', 'updatedAt'
            ];

            dateFields.forEach(field => {
                if (newDoc[field]) {
                    newDoc[field] = toDateSafe(newDoc[field]);
                }
            });

            if (newDoc.auditLog) {
                const entries = Array.isArray(newDoc.auditLog) ? newDoc.auditLog : Object.values(newDoc.auditLog);
                newDoc.auditLog = entries.map(entry => ({ ...entry, timestamp: toDateSafe((entry as any).timestamp) }));
            }
            if (!newDoc.documentType && 'policyNumber' in newDoc) {
                newDoc.documentType = 'insurance';
            }

            return newDoc as DocumentType;
        }).sort((a, b) => {
            const dateA = toDateSafe((a as any).updatedAt) || toDateSafe((a as any).createdAt);
            const dateB = toDateSafe((b as any).updatedAt) || toDateSafe((b as any).createdAt);
            if (!dateA) return 1;
            if (!dateB) return -1;
            return dateB.getTime() - dateA.getTime();
        });
    }, [invoices, estimates, quotes, insuranceDocs]);

    const filteredDocuments = useMemo(() => {
        return allDocuments.filter(doc => {
            const total = calculateTotal(doc);

            let docDate: Date | null = null;
            let clientName = '';

            if ('invoiceDate' in doc) {
                docDate = toDateSafe((doc as Invoice).invoiceDate);
                clientName = (doc as Invoice).client.name;
            } else if ('estimateDate' in doc) {
                docDate = toDateSafe((doc as Estimate).estimateDate);
                clientName = (doc as Estimate).client.name;
            } else if ('documentDate' in doc) {
                docDate = toDateSafe((doc as InsuranceDocument).documentDate);
                clientName = (doc as InsuranceDocument).policyHolder.name;
            }

            const clientNameMatch = filters.clientName ? clientName.toLowerCase().includes(filters.clientName.toLowerCase()) : true;
            const statusMatch = filters.status ? doc.status === filters.status : true;
            const amountMinMatch = filters.amountMin != null ? total >= filters.amountMin : true;
            const amountMaxMatch = filters.amountMax != null ? total <= filters.amountMax : true;

            let dateMatch = true;
            if (docDate) {
                const dateFrom = filters.dateFrom ? new Date(filters.dateFrom.setHours(0, 0, 0, 0)) : null;
                const dateTo = filters.dateTo ? new Date(filters.dateTo.setHours(23, 59, 59, 999)) : null;

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
    const filteredInsurance = useMemo(() => filteredDocuments.filter(d => d.documentType === 'insurance'), [filteredDocuments]);


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
            case 'active':
                return 'success';
            case 'sent': return 'secondary';
            case 'overdue':
            case 'rejected':
            case 'expired':
            case 'cancelled':
                return 'destructive';
            case 'draft':
            default: return 'outline';
        }
    };

    const isLoading = isAuthLoading || isLoadingInvoices || isLoadingEstimates || isLoadingQuotes || isLoadingInsurance;

    const renderDocumentsTable = (docs: DocumentType[], docType: 'invoice' | 'estimate' | 'quote' | 'insurance') => (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-xs hidden sm:table-cell">Number</TableHead>
                        <TableHead className="text-xs">Client</TableHead>
                        <TableHead className="text-xs hidden md:table-cell">Amount</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-center text-xs hidden lg:table-cell">History</TableHead>
                        <TableHead className="text-right text-xs">Actions</TableHead>
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
                        let docNumber, clientName, docCollection, editUrl;

                        if (doc.documentType === 'invoice') {
                            docNumber = (doc as Invoice).invoiceNumber;
                            clientName = (doc as Invoice).client.name;
                            docCollection = INVOICES_COLLECTION;
                            editUrl = `/create-invoice?draftId=${doc.id}`;
                        } else if (doc.documentType === 'estimate') {
                            docNumber = (doc as Estimate).estimateNumber;
                            clientName = (doc as Estimate).client.name;
                            docCollection = ESTIMATES_COLLECTION;
                            editUrl = `/create-estimate?draftId=${doc.id}`;
                        } else if (doc.documentType === 'quote') {
                            docNumber = (doc as Quote).estimateNumber;
                            clientName = (doc as Quote).client.name;
                            docCollection = QUOTES_COLLECTION;
                            editUrl = `/create-quote?draftId=${doc.id}`;
                        } else { // Insurance
                            docNumber = (doc as InsuranceDocument).policyNumber;
                            clientName = (doc as InsuranceDocument).policyHolder.name;
                            docCollection = INSURANCE_COLLECTION;
                            editUrl = `/create-insurance?draftId=${doc.id}`;
                        }

                        return (
                            <motion.tr
                                key={doc.id}
                                variants={tableRowVariants}
                                className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                as={TableRow}
                            >
                                <TableCell className="font-medium text-xs hidden sm:table-cell">{docNumber}</TableCell>
                                <TableCell className="text-xs">{clientName}</TableCell>
                                <TableCell className="text-xs hidden md:table-cell">{currencySymbols[(doc as any).currency] || '$'}{calculateTotal(doc).toFixed(2)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="capitalize w-24 justify-start rounded-full h-7 text-xs">
                                                <Badge variant={getStatusVariant(doc.status)} className="w-full justify-center rounded-full">{doc.status}</Badge>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            {STATUS_OPTIONS.map(status => (
                                                <DropdownMenuItem
                                                    key={status}
                                                    disabled={doc.status === status}
                                                    onClick={() => handleStatusChange(doc.id, docCollection, status)}
                                                    className="capitalize text-xs"
                                                >
                                                    {status}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="text-center hidden lg:table-cell">
                                    <Button variant="ghost" size="icon" className="rounded-full h-7 w-7" onClick={() => handleHistoryClick((doc as any).auditLog)}>
                                        <History className="h-3.5 w-3.5" />
                                    </Button>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                                                <MoreHorizontal className="h-3.5 w-3.5" />
                                                <span className="sr-only">More actions</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={editUrl} className="cursor-pointer">
                                                    <Edit className="mr-2 h-3.5 w-3.5" />
                                                    <span className="text-xs">Edit</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            {(docType === 'estimate' || docType === 'quote') && (
                                                <>
                                                    <DropdownMenuItem onClick={() => handleShare(doc.id, doc.documentType as 'estimate' | 'quote')} className="cursor-pointer">
                                                        <Share2 className="mr-2 h-3.5 w-3.5" />
                                                        <span className="text-xs">Share Link</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleConvertToInvoice(doc as Estimate | Quote)} className="cursor-pointer">
                                                        <FileText className="mr-2 h-3.5 w-3.5" />
                                                        <span className="text-xs">Convert to Invoice</span>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            {docType === 'insurance' && (
                                                <DropdownMenuItem onClick={() => handleShare(doc.id, 'insurance')} className="cursor-pointer">
                                                    <Share2 className="mr-2 h-3.5 w-3.5" />
                                                    <span className="text-xs">Share COI</span>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem onClick={() => setDeleteCandidate({ id: doc.id, collection: docCollection })} className="text-destructive cursor-pointer">
                                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                <span className="text-xs">Delete</span>
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

    const renderClientsTable = () => (
        <Card className='bg-card/50 backdrop-blur-sm'>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-base">Clients</CardTitle>
                        <CardDescription className="text-xs">A list of all your clients.</CardDescription>
                    </div>
                    <Button size="sm" className='rounded-full' onClick={handleAddClient}><Users className="mr-2 h-4 w-4" />Add Client</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs">Name</TableHead>
                                <TableHead className="text-xs hidden sm:table-cell">Company</TableHead>
                                <TableHead className="text-xs hidden md:table-cell">Email</TableHead>
                                <TableHead className="text-right text-xs">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <motion.tbody
                            variants={tableContainerVariants}
                            initial="hidden"
                            animate="visible"
                            as={TableBody}
                        >
                            {isLoadingClients ? (
                                <TableRow><TableCell colSpan={4} className="text-center h-24">Loading clients...</TableCell></TableRow>
                            ) : filteredClients && filteredClients.length > 0 ? filteredClients.map((client) => (
                                <motion.tr
                                    as={TableRow}
                                    key={client.id}
                                    variants={tableRowVariants}
                                    className="cursor-pointer"
                                    onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                                >
                                    <TableCell className="font-medium text-xs">{client.name}</TableCell>
                                    <TableCell className="text-xs hidden sm:table-cell">{client.companyName}</TableCell>
                                    <TableCell className="text-xs hidden md:table-cell">{client.email}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">View</Button>
                                    </TableCell>
                                </motion.tr>
                            )) : (
                                <TableRow><TableCell colSpan={4} className="text-center h-24">No clients found.</TableCell></TableRow>
                            )}
                        </motion.tbody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                    <div>
                        <Skeleton className="h-8 w-48 mb-1" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-32 rounded-full" />
                        <Skeleton className="h-9 w-32 rounded-full" />
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-9 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
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
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                title={modalState.title}
                documents={modalState.data}
                currencySymbol={currencySymbols[(filteredDocuments[0] as any)?.currency] || '$'}
            />
            <HistoryModal
                isOpen={historyModalState.isOpen}
                onClose={() => setHistoryModalState({ isOpen: false, auditLog: [] })}
                auditLog={historyModalState.auditLog}
            />
            <ClientFormDialog
                open={isClientDialogOpen}
                onOpenChange={setIsClientDialogOpen}
                client={editingClient}
                onSave={() => setIsClientDialogOpen(false)}
            />
            <motion.div className="space-y-4" variants={pageVariants} initial="hidden" animate="visible">
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

                <motion.div variants={pageVariants}>
                    <Card className='bg-card/50 backdrop-blur-sm'>
                        <CardHeader className='pb-4'>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <motion.div variants={pageVariants}>
                                    <h1 className="text-xl font-bold font-headline">Dashboard</h1>
                                    <p className="text-xs text-muted-foreground">An overview of your financial documents and activities.</p>
                                </motion.div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Button variant="outline" size="sm" className='rounded-full flex-1 sm:flex-none' onClick={() => setIsFilterSheetOpen(true)}>
                                        <Filter className="mr-2 h-3.5 w-3.5" />
                                        Filter
                                        {activeFilterCount > 0 && (
                                            <Badge variant="secondary" className="ml-2 rounded-full h-5 w-5 p-0 flex items-center justify-center">{activeFilterCount}</Badge>
                                        )}
                                    </Button>
                                    {activeFilterCount > 0 && (
                                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={resetFilters}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-wrap items-center gap-2 pt-0">

                            <Button size="sm" onClick={handleAddClient} variant="outline" className="rounded-full">
                                <Users className="mr-2 h-3 w-3" />
                                Add Client
                            </Button>
                            <Button size="sm" onClick={handleCreateInvoice} variant="outline" className="rounded-full">
                                <FilePlus2 className="mr-2 h-3 w-3" />
                                New Invoice
                            </Button>
                            <Button size="sm" onClick={handleCreateEstimate} variant="outline" className="rounded-full">
                                <FilePlus2 className="mr-2 h-3 w-3" />
                                New Estimate
                            </Button>
                            <Button size="sm" onClick={handleCreateQuote} variant="outline" className="rounded-full">
                                <FileText className="mr-2 h-3 w-3" />
                                New Quote
                            </Button>
                            <Button size="sm" onClick={() => router.push('/create-insurance')} variant="outline" className="rounded-full">
                                <Shield className="mr-2 h-3 w-3" />
                                New Insurance Doc
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
                    {activeTab === 'invoices' && (
                        <Card className='bg-card/50 backdrop-blur-sm'>
                            <CardHeader><CardTitle className="text-base">Invoices</CardTitle></CardHeader>
                            <CardContent className="pt-0">
                                <DashboardStatsGrid documents={filteredInvoices} docType="invoice" onKpiClick={handleKpiClick} />
                                {renderDocumentsTable(filteredInvoices, 'invoice')}
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === 'estimates' && (
                        <Card className='bg-card/50 backdrop-blur-sm'>
                            <CardHeader><CardTitle className="text-base">Estimates</CardTitle></CardHeader>
                            <CardContent className="pt-0">
                                <DashboardStatsGrid documents={filteredEstimates} docType="estimate" onKpiClick={handleKpiClick} />
                                {renderDocumentsTable(filteredEstimates, 'estimate')}
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === 'quotes' && (
                        <Card className='bg-card/50 backdrop-blur-sm'>
                            <CardHeader><CardTitle className="text-base">Quotes</CardTitle></CardHeader>
                            <CardContent className="pt-0">
                                <DashboardStatsGrid documents={filteredQuotes} docType="quote" onKpiClick={handleKpiClick} />
                                {renderDocumentsTable(filteredQuotes, 'quote')}
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === 'insurance' && (
                        <Card className='bg-card/50 backdrop-blur-sm'>
                            <CardHeader><CardTitle className="text-base">Insurance</CardTitle></CardHeader>
                            <CardContent className="pt-0">
                                <DashboardStatsGrid documents={filteredInsurance} docType="insurance" onKpiClick={handleKpiClick} />
                                {renderDocumentsTable(filteredInsurance, 'insurance')}
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === 'clients' && renderClientsTable()}
                </motion.div>
            </motion.div>
        </>
    );
}
