

'use client';

import { useState, useMemo, useCallback, Suspense, useEffect } from 'react';
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
import { FilePlus2, Edit, Trash2, Filter, X, MoreHorizontal, FileText, Share2, DollarSign, Clock, FileWarning, Files, CheckCircle, FileQuestion, Users, Percent, AreaChart, Package, History, Shield, XCircle, Mail, Loader2, UserPlus, Eye, ShieldCheck } from "lucide-react";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, isWithinInterval } from 'date-fns';
import { FilterSheet, type DashboardFilters } from '@/components/dashboard/filter-sheet';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUserAuth } from '@/context/auth-provider';
import { collection, doc, setDoc, getDoc, query, Timestamp, where } from 'firebase/firestore';
import { deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { KpiDetailsModal } from '@/components/dashboard/kpi-details-modal';
import { HistoryModal } from '@/components/dashboard/history-modal';
import { ClientFormDialog } from '@/components/dashboard/client-form-dialog';
import { toDateSafe, toNumberSafe } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sendDocumentByEmail, sendInvitationAction } from '@/app/actions';
import { InviteUserDialog } from '@/components/dashboard/invite-user-dialog';
import { InviteLinkDialog } from '@/components/dashboard/invite-link-dialog';
import { checkUsageLimit } from '@/lib/limits';
import { UpgradeModal } from '@/components/upgrade-modal';
import { hasAccess } from '@/lib/permissions';
import { useLanguage } from '@/context/language-context';

const MotionTableBody = motion(TableBody);
const MotionTableRow = motion(TableRow);


const INVOICES_COLLECTION = 'invoices';
const ESTIMATES_COLLECTION = 'estimates';
const QUOTES_COLLECTION = 'quotes';
const CLIENTS_COLLECTION = 'clients';
const USERS_COLLECTION = 'users';
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

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
    onClick?: () => void;
    delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, subtext, trend, onClick, delay = 0 }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay } }
        }}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        onClick={onClick}
        className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} group`}
    >
        <div className="absolute inset-0 bg-card/40 backdrop-blur-xl border border-gray-200 dark:border-primary/10 shadow-md group-hover:shadow-primary/20 transition-all duration-500" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/20 rounded-xl text-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-5 w-5" />
                </div>
                {trend && (
                    <Badge variant="outline" className={`bg-background/80 backdrop-blur-sm border-0 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {trend === 'up' ? '↑' : '↓'}
                    </Badge>
                )}
            </div>

            <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
                <div className="text-2xl font-bold font-headline tracking-tight text-foreground">{value}</div>
                {subtext && <p className="text-xs text-muted-foreground mt-1 font-medium">{subtext}</p>}
            </div>
        </div>
    </motion.div>
);

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

        const getDocTotal = (doc: any): number => {
            if ('summary' in doc && doc.summary) {
                const grandTotal = toNumberSafe(doc.summary.grandTotal);
                if (grandTotal > 0) return grandTotal;

                const lineItems = doc.lineItems || [];
                const subtotal = lineItems.reduce((acc: number, item: any) => acc + (toNumberSafe(item.quantity)) * (toNumberSafe(item.unitPrice)), 0);
                const taxableTotal = lineItems.filter((i: any) => i.taxable !== false).reduce((s: number, i: any) => s + ((toNumberSafe(i.quantity)) * (toNumberSafe(i.unitPrice))), 0);
                const taxPercentage = toNumberSafe(doc.summary.taxPercentage);
                const taxAmount = taxableTotal * (taxPercentage / 100);
                const discountAmount = toNumberSafe(doc.summary.discount);
                const shippingCost = toNumberSafe(doc.summary.shippingCost);
                return subtotal + taxAmount - discountAmount + shippingCost;
            }
            if ('items' in doc) {
                return doc.items.reduce((acc: number, item: any) => acc + (toNumberSafe(item.quantity)) * (toNumberSafe(item.rate)), 0);
            }
            return 0;
        };


        if (docType === 'invoice') {
            const paidInvoices = documents.filter(d => d.status === 'paid') as Invoice[];
            const outstandingInvoices = documents.filter(d => d.status === 'sent') as Invoice[];
            const overdueInvoices = documents.filter(d => d.status === 'overdue') as Invoice[];
            const draftInvoices = documents.filter(d => d.status === 'draft') as Invoice[];
            const nonDraftInvoices = documents.filter(d => d.status !== 'draft') as Invoice[];

            const totalRevenue = paidInvoices.reduce((acc, doc) => acc + getDocTotal(doc), 0);
            const outstanding = outstandingInvoices.reduce((acc, doc) => acc + getDocTotal(doc), 0);
            const overdue = overdueInvoices.reduce((acc, doc) => acc + getDocTotal(doc), 0);
            const totalInvoiced = nonDraftInvoices.reduce((acc, doc) => acc + getDocTotal(doc), 0);
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

            const totalValue = nonDraftDocs.reduce((acc, doc) => acc + getDocTotal(doc), 0);
            const acceptedValue = acceptedDocs.reduce((acc, doc) => acc + getDocTotal(doc), 0);

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
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Revenue" value={formatCurrency(s.totalRevenue)} icon={DollarSign} subtext={`${s.paidCount} paid invoices`} onClick={() => onKpiClick('Total Revenue', s.paidInvoices)} delay={0.1} />
                <StatCard title="Pending" value={formatCurrency(s.outstanding)} icon={Clock} subtext={`${s.outstandingInvoices.length} pending`} onClick={() => onKpiClick('Pending Invoices', s.outstandingInvoices)} delay={0.2} />
                <StatCard title="Overdue" value={formatCurrency(s.overdue)} icon={FileWarning} subtext={`${s.overdueInvoices.length} overdue`} onClick={() => onKpiClick('Overdue Invoices', s.overdueInvoices)} delay={0.3} trend="down" />
                <StatCard title="Total Invoiced" value={formatCurrency(s.totalInvoiced)} icon={Files} subtext={`${s.totalInvoiced} total`} delay={0.4} />
                <StatCard title="Avg. Value" value={formatCurrency(s.avgInvoiceValue)} icon={AreaChart} delay={0.5} />
                <StatCard title="Unique Clients" value={s.uniqueClients} icon={Users} delay={0.6} />
                <StatCard title="Top Category" value={s.mostUsedCategory || 'N/A'} icon={Package} delay={0.7} />
                <StatCard title="Drafts" value={s.drafts} icon={FileText} onClick={() => onKpiClick('Draft Invoices', s.draftInvoices)} delay={0.8} />
            </div>
        );
    } else if (docType === 'insurance') {
        const s = stats as any;
        return (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Policies" value={s.totalPolicies} icon={Shield} delay={0.1} />
                <StatCard title="Active" value={s.activePolicies} icon={CheckCircle} delay={0.2} trend="up" />
                <StatCard title="Expired" value={s.expiredPolicies} icon={FileWarning} delay={0.3} trend="down" />
                <StatCard title="Drafts" value={s.draftPolicies} icon={FileText} delay={0.4} />
                <StatCard title="Insured Clients" value={s.insuredClients} icon={Users} delay={0.5} />
                <StatCard title="Top Policy" value={s.mostUsedPolicyType} icon={Package} delay={0.6} />
            </div>
        )
    }
    else {
        const s = stats as any;
        const docTypeCap = docType.charAt(0).toUpperCase() + docType.slice(1);
        return (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title={`Total ${docTypeCap}s`} value={s.totalCount} icon={Files} delay={0.1} />
                <StatCard title="Accepted" value={s.acceptedCount} icon={CheckCircle} delay={0.2} trend="up" />
                <StatCard title="Rejected" value={s.rejectedCount} icon={XCircle} delay={0.3} trend="down" />
                <StatCard title="Pending" value={s.pendingCount} icon={Clock} delay={0.4} />
                <StatCard title="Est. Value" value={formatCurrency(s.totalValue)} icon={DollarSign} delay={0.5} />
                <StatCard title="Conversion" value={`${s.conversionRate.toFixed(1)}%`} icon={Percent} delay={0.6} />
                <StatCard title="Avg. Value" value={formatCurrency(s.avgValue)} icon={AreaChart} delay={0.7} />
                <StatCard title="Drafts" value={s.draftCount} icon={FileText} onClick={() => onKpiClick(`Draft ${docTypeCap}s`, s.draftDocs)} delay={0.8} />
            </div>
        );
    }
}

interface ClientStatsGridProps {
    clients: Client[];
    invoices: Invoice[];
}

const ClientStatsGrid: React.FC<ClientStatsGridProps> = ({ clients, invoices }) => {
    const stats = useMemo(() => {
        const totalClients = clients.length;
        const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + (toNumberSafe(i.summary.grandTotal)), 0);

        const clientRevenue: Record<string, number> = {};
        invoices.filter(i => i.status === 'paid').forEach(invoice => {
            const clientId = (invoice.client as any).clientId || invoice.client.name;
            clientRevenue[clientId] = (clientRevenue[clientId] || 0) + (toNumberSafe(invoice.summary.grandTotal));
        });

        const activeClients = Object.keys(clientRevenue).length;
        const avgRevenue = activeClients > 0 ? totalRevenue / activeClients : 0;

        return { totalClients, totalRevenue, activeClients, avgRevenue };
    }, [clients, invoices]);

    const currency = invoices?.[0]?.currency || 'USD';
    const symbol = currencySymbols[currency] || '$';

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard title="Total Clients" value={stats.totalClients} icon={Users} delay={0.1} />
            <StatCard title="Revenue" value={`${symbol}${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} delay={0.2} />
            <StatCard title="Active" value={stats.activeClients} icon={CheckCircle} delay={0.3} trend="up" />
            <StatCard title="Avg. Revenue" value={`${symbol}${stats.avgRevenue.toFixed(2)}`} icon={AreaChart} delay={0.4} />
        </div>
    );
};


function DashboardPageContent() {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'dashboard';
    const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; collection: string } | null>(null);
    const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
    const [isInviteUserDialogOpen, setIsInviteUserDialogOpen] = useState(false);
    const [isInviteLinkDialogOpen, setIsInviteLinkDialogOpen] = useState(false);
    const [inviteLinkData, setInviteLinkData] = useState<{ email: string, name: string } | null>(null);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [modalState, setModalState] = useState<{ isOpen: boolean; title: string; data: DocumentType[] }>({ isOpen: false, title: '', data: [] });
    const [historyModalState, setHistoryModalState] = useState<{ isOpen: boolean, auditLog: AuditLogEntry[] }>({ isOpen: false, auditLog: [] });
    const [isSendingEmail, setIsSendingEmail] = useState<string | null>(null);
    const [upgradeModalState, setUpgradeModalState] = useState<{ isOpen: boolean, featureName: string }>({ isOpen: false, featureName: '' });
    const [portalSlug, setPortalSlug] = useState<string | null>(null);
    const { toast } = useToast();
    const { firestore } = useFirebase();
    const { user, userProfile, isLoading: isAuthLoading } = useUserAuth();
    const { t } = useLanguage();
    const router = useRouter();

    const companyId = userProfile?.companyId;

    // Redirection logic for unauthorized tabs
    useEffect(() => {
        if (isAuthLoading || !userProfile) return;

        const tabPermissions: Record<string, string> = {
            'dashboard': 'view:dashboard',
            'invoices': 'view:invoices',
            'estimates': 'view:estimates',
            'quotes': 'view:quotes',
            'insurance': 'view:insurance',
            'analytics': 'view:analytics',
            'users': 'view:employees',
            'clients': 'view:clients'
        };
        const title = {
            'dashboard': t('dashboard.overview'),
            'invoices': t('sidebar.invoices'),
            'estimates': t('sidebar.estimates'),
            'quotes': t('sidebar.quotes'),
            'insurance': t('sidebar.insurance'),
            'analytics': t('sidebar.analytics'),
            'users': t('sidebar.employees'),
            'clients': t('sidebar.clients')
        }[activeTab] || t('sidebar.dashboard');
        const requiredPermission = tabPermissions[activeTab];
        if (requiredPermission && !hasAccess(userProfile, requiredPermission)) {
            // Find first available tab
            const firstAvailable = Object.keys(tabPermissions).find(tab => hasAccess(userProfile, tabPermissions[tab]));
            if (firstAvailable) {
                router.push(`/dashboard?tab=${firstAvailable}`);
            } else {
                router.push('/'); // Should not happen usually
            }
        }
    }, [activeTab, userProfile, isAuthLoading, router]);

    const clientsQuery = useMemoFirebase(() => {
        if (!firestore || !companyId) return null;
        return query(collection(firestore, 'companies', companyId, CLIENTS_COLLECTION));
    }, [firestore, companyId]);

    const usersQuery = useMemoFirebase(() => {
        if (!firestore || !companyId) return null;
        return query(collection(firestore, 'companies', companyId, USERS_COLLECTION));
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

    // Fetch portal slug for invitations
    useEffect(() => {
        const fetchPortalSlug = async () => {
            if (firestore && companyId) {
                try {
                    const snap = await getDoc(doc(firestore, 'companies', companyId));
                    if (snap.exists()) {
                        const data = snap.data();
                        if (data?.portalSettings?.enabled && data?.portalSettings?.slug) {
                            setPortalSlug(data.portalSettings.slug);
                        } else {
                            setPortalSlug(null);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching portal slug:", error);
                }
            }
        };
        fetchPortalSlug();
    }, [firestore, companyId]);


    const { data: clients, isLoading: isLoadingClients, refetch: refetchClients } = useCollection<Client>(clientsQuery);
    const { data: users, isLoading: isLoadingUsers, refetch: refetchUsers } = useCollection<any>(usersQuery);
    const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesQuery);
    const { data: estimates, isLoading: isLoadingEstimates } = useCollection<Estimate>(estimatesQuery);
    const { data: quotes, isLoading: isLoadingQuotes } = useCollection<Quote>(quotesQuery);
    const { data: insuranceDocs, isLoading: isLoadingInsurance } = useCollection<InsuranceDocument>(insuranceQuery);

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        if (hasAccess(userProfile, 'manage:employees')) return users;
        return users.filter(u => u.uid === userProfile?.uid);
    }, [users, userProfile]);

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

    const handleCreateInvoice = () => router.push('/create-invoice');
    const handleCreateEstimate = () => router.push('/create-estimate');
    const handleCreateQuote = () => router.push('/create-quote');

    const handleAddClient = async () => {
        if (userProfile?.plan === 'free') {
            const canCreate = await checkUsageLimit(user.uid, 'clients');
            if (!canCreate) {
                setUpgradeModalState({ isOpen: true, featureName: 'Clients' });
                return;
            }
        }
        setEditingClient(null);
        setIsClientDialogOpen(true);
    };

    const handleInviteUser = () => {
        // Employees are a paid feature (0 allowed on free plan)
        if (userProfile?.plan === 'free') {
            setUpgradeModalState({ isOpen: true, featureName: 'Team Members' });
            return;
        }
        setEditingUser(null);
        setIsInviteUserDialogOpen(true);
    };

    const handleEditUser = (user: any) => {
        setEditingUser(user);
        setIsInviteUserDialogOpen(true);
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
            const grandTotal = toNumberSafe((doc as Invoice | Estimate | Quote).summary.grandTotal);
            if (grandTotal > 0) return grandTotal;

            // Fallback for cases where grandTotal wasn't saved correctly
            const lineItems = (doc as Invoice | Estimate | Quote).lineItems || [];
            const subtotal = lineItems.reduce((acc, item) => acc + (toNumberSafe(item.quantity)) * (toNumberSafe(item.unitPrice)), 0);
            const taxableTotal = lineItems.filter(i => i.taxable !== false).reduce((s, i) => s + ((toNumberSafe(i.quantity)) * (toNumberSafe(i.unitPrice))), 0);
            const taxPercentage = toNumberSafe((doc as Invoice | Estimate | Quote).summary.taxPercentage);
            const taxAmount = taxableTotal * (taxPercentage / 100);
            const discountAmount = toNumberSafe((doc as Invoice | Estimate | Quote).summary.discount);
            const shippingCost = toNumberSafe((doc as Invoice | Estimate | Quote).summary.shippingCost);
            return subtotal + taxAmount - discountAmount + shippingCost;
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
        const url = `${window.location.origin}/${docType}/${docId}`;
        navigator.clipboard.writeText(url);
        toast({
            title: "Link Copied!",
            description: "The shareable link has been copied to your clipboard.",
        });
    };

    const handleEmail = async (docId: string, docType: 'invoice' | 'estimate' | 'quote') => {
        setIsSendingEmail(docId);
        try {
            const result = await sendDocumentByEmail({ docId, docType: docType as 'estimate' | 'quote' });
            if (result.success) {
                toast({
                    title: "Email Sent!",
                    description: `The ${docType} has been sent to the client.`,
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error: any) {
            toast({
                title: "Email Failed",
                description: error.message || `Could not send the ${docType}.`,
                variant: "destructive",
            });
        } finally {
            setIsSendingEmail(null);
        }
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

    const clientRevenues = useMemo(() => {
        if (!clients || !invoices) return {};
        const revenues: Record<string, number> = {};
        const paidInvoices = invoices.filter(inv => inv.status === 'paid');
        clients.forEach(client => {
            const clientInvoices = paidInvoices.filter(inv => inv.client.clientId === client.id);
            revenues[client.id] = clientInvoices.reduce((acc, inv) => acc + (toNumberSafe(inv.summary.grandTotal)), 0);
        });
        return revenues;
    }, [clients, invoices]);

    const validClients = useMemo(() => {
        if (!clients) return [];
        return clients.filter(c => c.name && !(c as any)._init);
    }, [clients]);

    const filteredClients = useMemo(() => {
        if (!validClients) return [];
        if (!filters.clientName) return validClients;
        return validClients.filter(client =>
            client.name.toLowerCase().includes(filters.clientName.toLowerCase()) ||
            (client.companyName && client.companyName.toLowerCase().includes(filters.clientName.toLowerCase()))
        );
    }, [validClients, filters.clientName]);


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

    const isLoading = isAuthLoading || isLoadingInvoices || isLoadingEstimates || isLoadingQuotes || isLoadingInsurance || isLoadingUsers;

    const renderDashboardOverview = () => {
        const employees = users; // Assuming 'users' are employees
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-card/50 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-primary/50 transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('dashboard.totalInvoices')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold font-headline">{invoices?.length || 0}</span>
                                <FileText className="h-8 w-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-primary/50 transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('dashboard.totalInvoices')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold font-headline">{invoices?.length || 0}</span>
                                <FileText className="h-8 w-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-primary/50 transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('dashboard.activeQuotes')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold font-headline">{quotes?.filter(q => q.status === 'sent').length || 0}</span>
                                <FilePlus2 className="h-8 w-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-primary/50 transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('dashboard.totalClients')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold font-headline">{clients?.length || 0}</span>
                                <Users className="h-8 w-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-primary/50 transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('dashboard.staffMembers')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold font-headline">{employees?.length || 0}</span>
                                <ShieldCheck className="h-8 w-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-card/50 backdrop-blur-sm border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">{t('dashboard.recentActivity')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px] pr-4">
                                <div className="space-y-4">
                                    {[...invoices || [], ...estimates || [], ...quotes || [], ...insuranceDocs || []]
                                        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                                        .slice(0, 20)
                                        .map((doc: any, i) => {
                                            const docType = doc.documentType || (doc.policyNumber ? 'insurance' : 'invoice');
                                            let viewUrl = '';
                                            if (docType === 'invoice') viewUrl = `/create-invoice?draftId=${doc.id}`;
                                            else if (docType === 'estimate') viewUrl = `/create-estimate?draftId=${doc.id}`;
                                            else if (docType === 'quote') viewUrl = `/create-quote?draftId=${doc.id}`;
                                            else viewUrl = `/create-insurance?draftId=${doc.id}`;

                                            return (
                                                <Link href={viewUrl} key={i} className="block group/item">
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 transition-all duration-200 hover:bg-white/10 hover:border-primary/20 hover:scale-[1.02] cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/item:bg-primary/20 transition-colors">
                                                                {docType === 'invoice' ? <FileText className="h-4 w-4" /> :
                                                                    docType === 'insurance' ? <ShieldCheck className="h-4 w-4" /> :
                                                                        <FilePlus2 className="h-4 w-4" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold group-hover/item:text-primary transition-colors">{doc.customerName || doc.client?.name || doc.policyHolder?.name || 'New Document'}</p>
                                                                <p className="text-[10px] text-muted-foreground uppercase">{docType} • {doc.status}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-sm font-bold font-headline">${(calculateTotal(doc) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 backdrop-blur-sm border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold">{t('dashboard.quickActions')}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-20 flex flex-col gap-2 rounded-2xl hover:bg-primary/5 hover:border-primary/30" onClick={handleCreateInvoice}>
                                <FilePlus2 className="h-5 w-5 text-primary" />
                                <span className="text-xs">{t('dashboard.newInvoice')}</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2 rounded-2xl hover:bg-primary/5 hover:border-primary/30" onClick={handleCreateEstimate}>
                                <FileQuestion className="h-5 w-5 text-primary" />
                                <span className="text-xs">{t('dashboard.newEstimate')}</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2 rounded-2xl hover:bg-primary/5 hover:border-primary/30" onClick={handleAddClient}>
                                <UserPlus className="h-5 w-5 text-primary" />
                                <span className="text-xs">{t('dashboard.addClient')}</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2 rounded-2xl hover:bg-primary/5 hover:border-primary/30" onClick={() => router.push('/dashboard/analytics')}>
                                <AreaChart className="h-5 w-5 text-primary" />
                                <span className="text-xs">{t('dashboard.viewReports')}</span>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    };

    const renderDocumentsTable = (docs: DocumentType[], docType: 'invoice' | 'estimate' | 'quote' | 'insurance') => (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-primary/5">
            <Table>
                <TableHeader className="bg-primary/5">
                    <TableRow className="hover:bg-transparent border-white/5">
                        <TableHead className="text-xs font-semibold text-primary hidden sm:table-cell py-4">{t('dashboard.docNumber')}</TableHead>
                        <TableHead className="text-xs font-semibold text-primary py-4">{t('dashboard.client')}</TableHead>
                        <TableHead className="text-xs font-semibold text-primary hidden md:table-cell py-4">{t('dashboard.amount')}</TableHead>
                        <TableHead className="text-xs font-semibold text-primary py-4">{t('dashboard.status')}</TableHead>
                        <TableHead className="text-center text-xs font-semibold text-primary hidden lg:table-cell py-4">{t('dashboard.history')}</TableHead>
                        <TableHead className="text-right text-xs font-semibold text-primary py-4 pr-6">{t('dashboard.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <MotionTableBody
                    variants={tableContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
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
                            <MotionTableRow
                                key={doc.id}
                                variants={tableRowVariants}
                                className="group transition-colors hover:bg-primary/5 data-[state=selected]:bg-muted border-white/5"
                            >
                                <TableCell className="font-medium text-xs hidden sm:table-cell py-4">{docNumber}</TableCell>
                                <TableCell className="text-xs py-4 font-medium">{clientName}</TableCell>
                                <TableCell className="text-xs hidden md:table-cell py-4 font-headline">{currencySymbols[(doc as any).currency] || '$'}{calculateTotal(doc).toFixed(2)}</TableCell>
                                <TableCell className="py-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="capitalize w-auto px-3 justify-start rounded-full h-6 text-[10px] border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary transition-colors">
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${doc.status === 'paid' || doc.status === 'accepted' || doc.status === 'active' ? 'bg-green-500' :
                                                    doc.status === 'overdue' || doc.status === 'rejected' || doc.status === 'expired' ? 'bg-red-500' :
                                                        doc.status === 'sent' ? 'bg-blue-500' : 'bg-gray-400'
                                                    }`} />
                                                {doc.status}
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
                                <TableCell className="text-center hidden lg:table-cell py-4">
                                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => handleHistoryClick((doc as any).auditLog)}>
                                        <History className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                                <TableCell className="text-right py-4 pr-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">More actions</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem asChild>
                                                <Link href={editUrl} className="cursor-pointer">
                                                    <Edit className="mr-2 h-3.5 w-3.5" />
                                                    <span className="text-xs">Edit Document</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            {(docType === 'invoice' || docType === 'estimate' || docType === 'quote') && (
                                                <DropdownMenuItem onClick={() => handleEmail(doc.id, docType)} disabled={isSendingEmail === doc.id} className="cursor-pointer">
                                                    {isSendingEmail === doc.id ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Mail className="mr-2 h-3.5 w-3.5" />}
                                                    <span className="text-xs">Send via Email</span>
                                                </DropdownMenuItem>
                                            )}
                                            {(docType === 'estimate' || docType === 'quote') && (
                                                <>
                                                    <DropdownMenuItem onClick={() => handleShare(doc.id, doc.documentType as 'estimate' | 'quote')} className="cursor-pointer">
                                                        <Share2 className="mr-2 h-3.5 w-3.5" />
                                                        <span className="text-xs">Share Public Link</span>
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
                                                    <span className="text-xs">Share COI Link</span>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem onClick={() => setDeleteCandidate({ id: doc.id, collection: docCollection })} className="text-destructive cursor-pointer group/delete">
                                                <Trash2 className="mr-2 h-3.5 w-3.5 group-hover/delete:text-destructive" />
                                                <span className="text-xs group-hover/delete:text-destructive">Delete Permanently</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </MotionTableRow>
                        )
                    }) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-32 text-muted-foreground bg-white/5">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <FileQuestion className="h-8 w-8 opacity-50" />
                                    <span>No documents found. Create one to get started.</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </MotionTableBody>
            </Table>
        </div>
    );

    const renderClientsTable = () => {
        const currency = invoices?.[0]?.currency || 'USD';
        const symbol = currencySymbols[currency] || '$';

        return (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-primary/5">
                <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-bold font-headline">{t('dashboard.clients')}</h3>
                        <p className="text-sm text-muted-foreground">{t('dashboard.clientsDesc')}</p>
                    </div>
                    <div className="flex gap-2">
                        {hasAccess(userProfile, 'create:records') && (
                            <Button size="sm" className='rounded-full shadow-lg hover:shadow-primary/20 transition-all' onClick={handleAddClient} variant="default"><UserPlus className="mr-2 h-4 w-4" />{t('dashboard.addClient')}</Button>
                        )}
                    </div>
                </div>
                <Table>
                    <TableHeader className="bg-primary/5">
                        <TableRow className="hover:bg-transparent border-white/5">
                            <TableHead className="text-xs font-semibold text-primary py-4 pl-6">{t('dashboard.name')}</TableHead>
                            <TableHead className="text-xs font-semibold text-primary hidden sm:table-cell py-4">{t('dashboard.company')}</TableHead>
                            <TableHead className="text-xs font-semibold text-primary hidden sm:table-cell py-4">{t('dashboard.email')}</TableHead>
                            <TableHead className="text-xs font-semibold text-primary hidden md:table-cell py-4">{t('dashboard.totalRevenue')}</TableHead>
                            <TableHead className="text-right text-xs font-semibold text-primary py-4 pr-6">{t('dashboard.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <MotionTableBody
                        variants={tableContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {isLoadingClients ? (
                            <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">Loading clients...</TableCell></TableRow>
                        ) : filteredClients && filteredClients.length > 0 ? filteredClients.map((client) => (
                            <MotionTableRow
                                key={client.id}
                                variants={tableRowVariants}
                                className="group transition-colors hover:bg-primary/5 border-white/5"
                            >
                                <TableCell className="font-medium text-xs pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 border border-white/10 shadow-sm">
                                            <AvatarImage src={client.avatarUrl || ''} alt={client.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary">{client.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{client.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs hidden sm:table-cell py-4 text-muted-foreground">{client.companyName || '-'}</TableCell>
                                <TableCell className="text-xs hidden sm:table-cell py-4 text-muted-foreground">{client.email}</TableCell>
                                <TableCell className="text-xs hidden md:table-cell py-4 font-headline font-medium">{symbol}{(clientRevenues[client.id] || 0).toFixed(2)}</TableCell>
                                <TableCell className="text-right py-4 pr-6">
                                    <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/clients/${client.id}`)} className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">View Details</Button>
                                </TableCell>
                            </MotionTableRow>
                        )) : (
                            <TableRow><TableCell colSpan={5} className="text-center h-32 text-muted-foreground bg-white/5">No clients found.</TableCell></TableRow>
                        )}
                    </MotionTableBody>
                </Table>
            </div>
        )
    };

    const renderUsersTable = () => (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-primary/5">
            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold font-headline">{t('dashboard.employeeDirectory')}</h3>
                    <p className="text-sm text-muted-foreground">{t('dashboard.employeeDesc')}</p>
                </div>
                {hasAccess(userProfile, 'manage:employees') && (
                    <Button size="sm" className='rounded-full shadow-lg hover:shadow-primary/20 transition-all' onClick={handleInviteUser}><UserPlus className="mr-2 h-4 w-4" />{t('dashboard.inviteEmployee')}</Button>
                )}
            </div>
            <Table>
                <TableHeader className="bg-primary/5">
                    <TableRow className="hover:bg-transparent border-white/5">
                        <TableHead className="text-xs font-semibold text-primary py-4 pl-6">{t('dashboard.name')}</TableHead>
                        <TableHead className="text-xs font-semibold text-primary hidden md:table-cell py-4">{t('dashboard.position')}</TableHead>
                        <TableHead className="text-xs font-semibold text-primary hidden sm:table-cell py-4">{t('dashboard.email')}</TableHead>
                        <TableHead className="text-xs font-semibold text-primary hidden lg:table-cell py-4">{t('dashboard.phone')}</TableHead>
                        <TableHead className="text-xs font-semibold text-primary hidden lg:table-cell py-4">{t('dashboard.designation')}</TableHead>
                        <TableHead className="text-xs font-semibold text-primary py-4">{t('dashboard.role')}</TableHead>
                        <TableHead className="text-xs font-semibold text-primary hidden md:table-cell py-4">{t('dashboard.status')}</TableHead>
                        <TableHead className="text-right text-xs font-semibold text-primary py-4 pr-6">{t('dashboard.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <MotionTableBody
                    variants={tableContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {isLoadingUsers ? (
                        <TableRow><TableCell colSpan={8} className="text-center h-24 text-muted-foreground">Loading users...</TableCell></TableRow>
                    ) : filteredUsers && filteredUsers.length > 0 ? filteredUsers.map((user) => (
                        <MotionTableRow key={user.uid} variants={tableRowVariants} className="group transition-colors hover:bg-primary/5 border-white/5">
                            <TableCell className="font-medium text-xs pl-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 border border-white/10 shadow-sm">
                                        <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
                                        <AvatarFallback className="bg-primary/10 text-primary">{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{user.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-xs hidden md:table-cell py-4 text-muted-foreground">{user.position || '-'}</TableCell>
                            <TableCell className="text-xs hidden sm:table-cell py-4 text-muted-foreground">{user.email}</TableCell>
                            <TableCell className="text-xs hidden lg:table-cell py-4 text-muted-foreground">{user.phone || '-'}</TableCell>
                            <TableCell className="text-xs hidden lg:table-cell py-4 text-muted-foreground">{user.designation || '-'}</TableCell>
                            <TableCell className="text-xs capitalize py-4"><Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">{user.role}</Badge></TableCell>
                            <TableCell className="text-xs hidden md:table-cell capitalize py-4"><Badge variant={user.status === 'active' ? 'success' : 'secondary'} className="rounded-full px-2">{user.status}</Badge></TableCell>
                            <TableCell className="text-right py-4 pr-6">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">More actions</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/dashboard/employees/${user.uid}`} className="cursor-pointer">
                                                <Eye className="mr-2 h-3.5 w-3.5" />
                                                <span className="text-xs">View Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        {hasAccess(userProfile, 'manage:employees') && user.status === 'pending_invitation' && (
                                            <>
                                                <DropdownMenuItem onClick={() => {
                                                    setInviteLinkData({ email: user.email, name: user.name });
                                                    setIsInviteLinkDialogOpen(true);
                                                }} className="cursor-pointer">
                                                    <Share2 className="mr-2 h-3.5 w-3.5" />
                                                    <span className="text-xs">Copy Invite Link</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    setInviteLinkData({ email: user.email, name: user.name });
                                                    setIsInviteLinkDialogOpen(true);
                                                }} className="cursor-pointer">
                                                    <Mail className="mr-2 h-3.5 w-3.5" />
                                                    <span className="text-xs">Resend Invitation</span>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {hasAccess(userProfile, 'manage:employees') && (
                                            <>
                                                <DropdownMenuItem onClick={() => handleEditUser(user)} className="cursor-pointer">
                                                    <Edit className="mr-2 h-3.5 w-3.5" />
                                                    <span className="text-xs">Edit Employee</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setDeleteCandidate({ id: user.uid, collection: USERS_COLLECTION })} className="text-destructive cursor-pointer group/delete">
                                                    <Trash2 className="mr-2 h-3.5 w-3.5 group-hover/delete:text-destructive" />
                                                    <span className="text-xs group-hover/delete:text-destructive">Remove Employee</span>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </MotionTableRow>
                    )) : (
                        <TableRow><TableCell colSpan={8} className="text-center h-32 text-muted-foreground bg-white/5">No team members found.</TableCell></TableRow>
                    )}
                </MotionTableBody>
            </Table>
        </div>
    );

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                    <div>
                        <Skeleton className="h-8 w-48" />
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

    const title = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

    return (
        <div className="relative min-h-[calc(100vh-4rem)]">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none -z-10" />
            <div className="absolute top-0 right-0 p-8 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 opacity-50 animate-pulse" />

            <UpgradeModal
                isOpen={upgradeModalState.isOpen}
                onClose={() => setUpgradeModalState(prev => ({ ...prev, isOpen: false }))}
                featureName={upgradeModalState.featureName}
            />
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
                onSave={() => refetchClients()}
            />
            <InviteUserDialog
                open={isInviteUserDialogOpen}
                onOpenChange={setIsInviteUserDialogOpen}
                user={editingUser}
                onUserInvited={() => {
                    refetchUsers();
                }}
            />
            {inviteLinkData && (
                <InviteLinkDialog
                    open={isInviteLinkDialogOpen}
                    onOpenChange={setIsInviteLinkDialogOpen}
                    email={inviteLinkData.email}
                    name={inviteLinkData.name}
                    companyName={userProfile?.companyName || 'Your Company'}
                    companyId={companyId || ''}
                    portalSlug={portalSlug}
                />
            )}
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
                                    <h1 className="text-2xl font-bold font-headline tracking-tight">{title}</h1>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(), 'EEEE, MMMM do, yyyy')}
                                    </p>
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
                                    {activeTab === 'clients' ? null : (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" className='rounded-full'><FilePlus2 className="mr-2 h-4 w-4" /> New Document</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {hasAccess(userProfile, 'create:invoice') && (
                                                    <DropdownMenuItem onClick={handleCreateInvoice}><FileText className="mr-2 h-4 w-4" /> New Invoice</DropdownMenuItem>
                                                )}
                                                {hasAccess(userProfile, 'create:estimate') && (
                                                    <DropdownMenuItem onClick={handleCreateEstimate}><FileQuestion className="mr-2 h-4 w-4" /> New Estimate</DropdownMenuItem>
                                                )}
                                                {hasAccess(userProfile, 'create:quote') && (
                                                    <DropdownMenuItem onClick={handleCreateQuote}><FileText className="mr-2 h-4 w-4" /> New Quote</DropdownMenuItem>
                                                )}
                                                {hasAccess(userProfile, 'create:insurance') && (
                                                    <DropdownMenuItem onClick={() => router.push('/create-insurance')}><Shield className="mr-2 h-4 w-4" /> New Insurance Doc</DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        {activeTab !== 'clients' && activeTab !== 'users' && (
                            <CardContent>
                                {activeTab === 'invoices' && <DashboardStatsGrid documents={filteredInvoices} docType="invoice" onKpiClick={handleKpiClick} />}
                                {activeTab === 'estimates' && <DashboardStatsGrid documents={filteredEstimates} docType="estimate" onKpiClick={handleKpiClick} />}
                                {activeTab === 'quotes' && <DashboardStatsGrid documents={filteredQuotes} docType="quote" onKpiClick={handleKpiClick} />}
                                {activeTab === 'insurance' && <DashboardStatsGrid documents={filteredInsurance} docType="insurance" onKpiClick={handleKpiClick} />}
                            </CardContent>
                        )}
                        {activeTab === 'clients' && (
                            <CardContent>
                                <ClientStatsGrid clients={clients || []} invoices={invoices || []} />
                            </CardContent>
                        )}
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
                    {activeTab === 'dashboard' && renderDashboardOverview()}
                    {activeTab === 'invoices' && renderDocumentsTable(filteredInvoices, 'invoice')}
                    {activeTab === 'estimates' && renderDocumentsTable(filteredEstimates, 'estimate')}
                    {activeTab === 'quotes' && renderDocumentsTable(filteredQuotes, 'quote')}
                    {activeTab === 'insurance' && renderDocumentsTable(filteredInsurance, 'insurance')}
                    {activeTab === 'clients' && renderClientsTable()}
                    {activeTab === 'users' && renderUsersTable()}
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardPageContent />
        </Suspense>
    );
}






