

'use client';

import { useMemo } from 'react';
import type { Invoice, Estimate, DocumentStatus, Quote, InsuranceDocument } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, FileWarning, Files, CheckCircle, FileQuestion, Users, Percent, AreaChart, Package, FileText, XCircle, Shield } from "lucide-react";
import { X } from 'lucide-react';


type DocumentType = Invoice | Estimate | Quote | InsuranceDocument;

const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    PKR: '₨',
};


interface DashboardStatsGridProps {
    documents: DocumentType[];
    docType: 'invoice' | 'estimate' | 'quote' | 'insurance';
    onKpiClick: (title: string, data: DocumentType[]) => void;
}

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ documents, docType, onKpiClick }) => {
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
            
            const totalValue = nonDraftDocs.reduce((acc, doc) => acc + (doc.summary?.grandTotal || 0), 0);
            const acceptedValue = acceptedDocs.reduce((acc, doc) => acc + (doc.summary?.grandTotal || 0), 0);
            
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
        return `${currencySymbols[currency] || '$'}${amount.toFixed(2)}`;
    };

    if (docType === 'invoice') {
        const s = stats as any;
        return (
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 mb-4">
                <Card as="button" onClick={() => onKpiClick('Total Revenue', s.paidInvoices)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Total Revenue</CardTitle><DollarSign className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.totalRevenue)}</div><p className="text-xs text-muted-foreground">{s.paidCount} paid invoices</p></CardContent></Card>
                <Card as="button" onClick={() => onKpiClick('Pending Invoices', s.outstandingInvoices)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Pending</CardTitle><Clock className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.outstanding)}</div></CardContent></Card>
                <Card as="button" onClick={() => onKpiClick('Overdue Invoices', s.overdueInvoices)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Overdue</CardTitle><FileWarning className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.overdue)}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Total Invoiced</CardTitle><Files className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.totalInvoiced)}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Avg. Invoice Value</CardTitle><AreaChart className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.avgInvoiceValue)}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Unique Clients</CardTitle><Users className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.uniqueClients}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Most Used Category</CardTitle><Package className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-lg font-bold">{s.mostUsedCategory || 'N/A'}</div></CardContent></Card>
                <Card as="button" onClick={() => onKpiClick('Draft Invoices', s.draftInvoices)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Drafts</CardTitle><FileText className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.drafts}</div></CardContent></Card>
            </div>
        );
    } else if (docType === 'insurance') {
        const s = stats as any;
        return (
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 mb-4">
                 <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Total Policies</CardTitle><Shield className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.totalPolicies}</div></CardContent></Card>
                 <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Active Policies</CardTitle><CheckCircle className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.activePolicies}</div></CardContent></Card>
                 <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Expired Policies</CardTitle><FileWarning className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.expiredPolicies}</div></CardContent></Card>
                 <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Draft Policies</CardTitle><FileText className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.draftPolicies}</div></CardContent></Card>
                 <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Insured Clients</CardTitle><Users className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.insuredClients}</div></CardContent></Card>
                 <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Top Policy Type</CardTitle><Package className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-lg font-bold">{s.mostUsedPolicyType}</div></CardContent></Card>
            </div>
        )
    }
    else {
        const s = stats as any;
        const docTypeCap = docType.charAt(0).toUpperCase() + docType.slice(1);
        return (
             <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 mb-4">
                <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Total {docTypeCap}s</CardTitle><Files className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.totalCount}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Accepted</CardTitle><CheckCircle className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.acceptedCount}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Rejected</CardTitle><XCircle className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.rejectedCount}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Pending Approval</CardTitle><Clock className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.pendingCount}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Total Estimated Value</CardTitle><DollarSign className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.totalValue)}</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Conversion Rate</CardTitle><Percent className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.conversionRate.toFixed(1)}%</div></CardContent></Card>
                <Card className="bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Avg. {docTypeCap} Value</CardTitle><AreaChart className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{formatCurrency(s.avgValue)}</div></CardContent></Card>
                <Card as="button" onClick={() => onKpiClick(`Draft ${docTypeCap}s`, s.draftDocs)} className="text-left w-full bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"><CardTitle className="text-xs font-medium">Drafts</CardTitle><FileText className="h-3 w-3 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{s.draftCount}</div></CardContent></Card>
            </div>
        );
    }
}
