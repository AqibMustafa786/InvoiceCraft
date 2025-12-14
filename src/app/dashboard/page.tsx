
'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Invoice, Estimate, DocumentStatus, Quote } from '@/lib/types';
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
import { FilePlus2, Edit, Trash2, Filter, X, MoreHorizontal, FileText, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { format, isWithinInterval, isValid } from 'date-fns';
import { FilterSheet, type DashboardFilters } from '@/components/dashboard/filter-sheet';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useAuth } from '@/context/auth-provider';
import { collection, doc, setDoc, query, Timestamp, where } from 'firebase/firestore';
import { deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const INVOICES_COLLECTION = 'invoices';
const ESTIMATES_COLLECTION = 'estimates';
const QUOTES_COLLECTION = 'quotes';

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

export default function DashboardPage() {
    const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; collection: string } | null>(null);
    const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const { toast } = useToast();
    const { firestore } = useFirebase();
    const { user, userProfile, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const userPlan = userProfile?.plan || 'free';
    const companyId = userProfile?.companyId;
    const isBusinessPlan = userPlan === 'business';

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


    const { data: invoices, isLoading: isLoadingInvoices, error: invoicesError } = useCollection<Invoice>(invoicesQuery);
    const { data: estimates, isLoading: isLoadingEstimates, error: estimatesError } = useCollection<Estimate>(estimatesQuery);
    const { data: quotes, isLoading: isLoadingQuotes, error: quotesError } = useCollection<Quote>(quotesQuery);
    
    const canCreateInvoice = isBusinessPlan || (invoices?.length || 0) < 5;
    const canCreateEstimate = isBusinessPlan || (estimates?.length || 0) < 3;


    const handleCreateInvoice = () => {
        if (canCreateInvoice) {
            router.push('/create-invoice');
        } else {
            toast({
                title: "Free Plan Limit Reached",
                description: "Upgrade to the Business Plan to create unlimited invoices.",
                variant: "destructive"
            });
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
            return;
        }
        
        const { business, client, lineItems, summary, projectTitle, currency, language, estimateNumber, referenceNumber } = estimate;

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
        if (value.toDate && typeof value.toDate === 'function') {
            return value.toDate();
        }
        const d = new Date(value);
        return isValid(d) ? d : null;
    };

    const combinedDocuments = useMemo(() => {
        if (!user) return [];
        const allDocs: DocumentType[] = [...(invoices || []), ...(estimates || []), ...(quotes || [])];
        
        const safeParsedDocs = allDocs.map(doc => {
            const newDoc = { ...doc };
            
            if (newDoc.documentType === 'invoice') {
                newDoc.invoiceDate = toDateSafe((newDoc as Invoice).invoiceDate) as Date;
                newDoc.dueDate = toDateSafe((newDoc as Invoice).dueDate) as Date;
            } else if (newDoc.documentType === 'estimate' || newDoc.documentType === 'quote') {
                (newDoc as Estimate | Quote).estimateDate = toDateSafe((newDoc as Estimate | Quote).estimateDate) as Date;
                (newDoc as Estimate | Quote).validUntilDate = toDateSafe((newDoc as Estimate | Quote).validUntilDate) as Date;
            }
            newDoc.createdAt = toDateSafe(newDoc.createdAt);
            newDoc.updatedAt = toDateSafe(newDoc.updatedAt);
            return newDoc;
        });

        return safeParsedDocs
            .filter(doc => {
                const total = calculateTotal(doc);
                let date: Date | null = null;
                let clientName = '';
                if (doc.documentType === 'invoice') {
                  date = (doc as Invoice).invoiceDate;
                  clientName = (doc as Invoice).client.name;
                } else if (doc.documentType === 'estimate' || doc.documentType === 'quote') {
                  date = (doc as Estimate | Quote).estimateDate;
                  clientName = (doc as Estimate | Quote).client.name;
                }
                
                if (!date || !isValid(date)) return true; // Keep docs with invalid dates for now to avoid hiding them on error

                const clientNameMatch = filters.clientName ? (clientName || '').toLowerCase().includes(filters.clientName.toLowerCase()) : true;
                const statusMatch = filters.status ? doc.status === filters.status : true;
                const amountMinMatch = filters.amountMin !== null ? total >= filters.amountMin : true;
                const amountMaxMatch = filters.amountMax !== null ? total <= filters.amountMax : true;
                const dateFrom = filters.dateFrom ? new Date(filters.dateFrom.setHours(0, 0, 0, 0)) : null;
                const dateTo = filters.dateTo ? new Date(filters.dateTo.setHours(23, 59, 59, 999)) : null;
                const dateMatch = (dateFrom && dateTo) ? isWithinInterval(date, { start: dateFrom, end: dateTo })
                                : dateFrom ? date >= dateFrom
                                : dateTo ? date <= dateTo
                                : true;
                return clientNameMatch && statusMatch && amountMinMatch && amountMaxMatch && dateMatch;
            })
            .sort((a, b) => {
                const dateA = a.updatedAt || a.createdAt;
                const dateB = b.updatedAt || b.createdAt;
                if (!dateA || !isValid(dateA)) return 1;
                if (!dateB || !isValid(dateB)) return -1;
                return dateB.getTime() - dateA.getTime();
            });
    }, [invoices, estimates, quotes, filters, calculateTotal, user]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.clientName) count++;
        if (filters.status) count++;
        if (filters.amountMin !== null) count++;
        if (filters.amountMax !== null) count++;
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

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                 <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
                    <div>
                        <Skeleton className="h-9 w-64 mb-2" />
                        <Skeleton className="h-5 w-80" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-36" />
                        <Skeleton className="h-10 w-36" />
                        <Skeleton className="h-10 w-36" />
                    </div>
                </div>
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-5 w-72" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <Skeleton className="h-10 w-28" />
                        </div>
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

                <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
                        <p className="text-muted-foreground">Manage your invoices, estimates, and quotes here.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleCreateInvoice}>
                            <FilePlus2 className="mr-2 h-4 w-4" />
                            New Invoice
                        </Button>
                         <Button onClick={handleCreateEstimate} variant="outline">
                            <FilePlus2 className="mr-2 h-4 w-4" />
                            New Estimate
                        </Button>
                         <Button onClick={handleCreateQuote} variant="outline">
                            <FilePlus2 className="mr-2 h-4 w-4" />
                            New Quote
                        </Button>
                    </div>
                </div>
                
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>My Documents</CardTitle>
                        <CardDescription>A list of your saved documents from Firestore.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
                            <Button variant="outline" onClick={() => setIsFilterSheetOpen(true)}>
                               <Filter className="mr-2 h-4 w-4" />
                               Filter
                               {activeFilterCount > 0 && (
                                   <Badge variant="secondary" className="ml-2 rounded-full h-5 w-5 p-0 flex items-center justify-center">{activeFilterCount}</Badge>
                               )}
                            </Button>
                        </div>

                        {activeFilterCount > 0 && (
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                <span className="text-sm font-medium">Active filters:</span>
                                {filters.clientName && <Badge variant="outline">Client: {filters.clientName}</Badge>}
                                {filters.status && <Badge variant="outline">Status: {filters.status}</Badge>}
                                {filters.amountMin !== null && <Badge variant="outline">Min Amount: ${filters.amountMin}</Badge>}
                                {filters.amountMax !== null && <Badge variant="outline">Max Amount: ${filters.amountMax}</Badge>}
                                {filters.dateFrom && <Badge variant="outline">From: {format(filters.dateFrom, 'MMM d, yyyy')}</Badge>}
                                {filters.dateTo && <Badge variant="outline">To: {format(filters.dateTo, 'MMM d, yyyy')}</Badge>}
                                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetFilters}>
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Clear all filters</span>
                                </Button>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Number</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Updated</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center h-24">
                                                Loading documents...
                                            </TableCell>
                                        </TableRow>
                                    ) : (invoicesError || estimatesError || quotesError) ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center h-24 text-destructive">
                                               Error loading documents. Please check your connection and security rules.
                                            </TableCell>
                                        </TableRow>
                                    ) : combinedDocuments.length > 0 ? combinedDocuments.map((doc) => {
                                        const isInvoice = doc.documentType === 'invoice';
                                        const isEstimate = doc.documentType === 'estimate';
                                        const isQuote = doc.documentType === 'quote';

                                        const docNumber = isInvoice ? (doc as Invoice).invoiceNumber : (doc as Estimate | Quote).estimateNumber;
                                        const clientName = isInvoice ? (doc as Invoice).client.name : (doc as Estimate | Quote).client.name;
                                        
                                        let docCollection: string;
                                        let editUrl: string;
                                        
                                        if(isInvoice) {
                                            docCollection = INVOICES_COLLECTION;
                                            editUrl = `/create-invoice?draftId=${doc.id}`;
                                        } else if (isEstimate) {
                                            docCollection = ESTIMATES_COLLECTION;
                                            editUrl = `/create-estimate?draftId=${doc.id}`;
                                        } else {
                                            docCollection = QUOTES_COLLECTION;
                                            editUrl = `/create-quote?draftId=${doc.id}`;
                                        }

                                        return (
                                        <TableRow key={doc.id}>
                                            <TableCell><Badge variant={isInvoice ? 'secondary' : (isEstimate ? 'default' : 'outline')}>{doc.documentType}</Badge></TableCell>
                                            <TableCell className="font-medium">{docNumber}</TableCell>
                                            <TableCell>{clientName}</TableCell>
                                            <TableCell>{currencySymbols[doc.currency] || '$'}{calculateTotal(doc).toFixed(2)}</TableCell>
                                            <TableCell>
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="capitalize w-28 justify-start">
                                                            <Badge variant={getStatusVariant(doc.status)} className="w-full justify-center">{doc.status}</Badge>
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
                                            <TableCell>{doc.updatedAt ? format(doc.updatedAt, 'yyyy-MM-dd HH:mm') : 'N/A'}</TableCell>
                                            <TableCell>{doc.createdAt ? format(doc.createdAt, 'yyyy-MM-dd') : 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
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
                                                        {(isEstimate || isQuote) && (
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
                                        </TableRow>
                                        )
                                    }) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center h-24">
                                                No documents found. Create one!
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

    