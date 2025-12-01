'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Invoice, Quote, DocumentStatus } from '@/lib/types';
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
import { format, isWithinInterval } from 'date-fns';
import { FilterSheet, type DashboardFilters } from '@/components/dashboard/filter-sheet';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, doc, addDoc, query, where } from 'firebase/firestore';
import { deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';

const INVOICES_COLLECTION = 'invoices';
const QUOTES_COLLECTION = 'quotes';

const initialFilters: DashboardFilters = {
    clientName: '',
    status: null,
    amountMin: null,
    amountMax: null,
    dateFrom: null,
    dateTo: null,
};

const STATUS_OPTIONS: DocumentStatus[] = ['draft', 'sent', 'paid', 'overdue', 'accepted', 'rejected'];

const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    PKR: '₨',
};

type DocumentType = Invoice | Quote;

export default function DashboardPage() {
    const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; collection: string } | null>(null);
    const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const { toast } = useToast();
    const { firestore, auth, user, isUserLoading } = useFirebase();
    const router = useRouter();

    const invoicesQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, INVOICES_COLLECTION), where("userId", "==", user.uid));
    }, [firestore, user]);

    const quotesQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, QUOTES_COLLECTION), where("userId", "==", user.uid));
    }, [firestore, user]);

    const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesQuery);
    const { data: quotes, isLoading: isLoadingQuotes } = useCollection<Quote>(quotesQuery);

    const calculateTotal = useCallback((doc: DocumentType): number => {
        if (doc.documentType === 'invoice') {
            const invoice = doc as Invoice;
            const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * (item as any).rate, 0);
            const taxAmount = (subtotal * invoice.tax) / 100;
            const discountAmount = (subtotal * invoice.discount) / 100;
            return subtotal + taxAmount - discountAmount + (invoice.shippingCost || 0);
        } else {
            const quote = doc as Quote;
            return quote.summary.grandTotal;
        }
    }, []);

    const handleDelete = () => {
        if (!deleteCandidate || !firestore) return;
        const { id, collection } = deleteCandidate;
        const docRef = doc(firestore, collection, id);
        deleteDocumentNonBlocking(docRef);
        setDeleteCandidate(null);
        toast({
            title: "Document Deleted",
            description: `The ${collection === 'invoices' ? 'invoice' : 'quote'} has been deleted.`,
        });
    };

    const handleStatusChange = (id: string, collection: string, newStatus: DocumentStatus) => {
        if (!firestore) return;
        const docRef = doc(firestore, collection, id);
        updateDocumentNonBlocking(docRef, { status: newStatus });
        toast({
            title: "Status Updated",
            description: `Document status changed to "${newStatus}".`,
        });
    };
    
    const handleConvertToInvoice = async (quote: Quote) => {
        if (!firestore || !user) return;
        
        const { business, client, lineItems, summary, projectTitle, currency, language } = quote;

        const newInvoiceData: Omit<Invoice, 'id' | 'userId'> = {
            companyName: business.name,
            companyPhone: business.phone,
            companyAddress: business.address,
            clientName: client.name,
            clientAddress: client.address,
            clientEmail: client.email,
            invoiceNumber: `INV-${quote.quoteNumber.replace('QUO-', '')}`,
            invoiceDate: new Date(),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            items: lineItems.map(item => ({...item, rate: item.unitPrice})),
            tax: summary.taxPercentage,
            discount: summary.discount, // This might need adjustment if discount is fixed vs percentage
            shippingCost: summary.shippingCost,
            status: 'draft',
            documentType: 'invoice',
            currency: currency,
            language: language,
            template: 'default', // default invoice template
            shippingAddress: client.address, // Default to client address
            poNumber: quote.referenceNumber,
            trackingNumber: '',
            amountPaid: 0,
            paymentInstructions: 'Thank you for your business. Please make payment to the details provided below.',
        };
        
        try {
            const newDocRef = await addDoc(collection(firestore, INVOICES_COLLECTION), {...newInvoiceData, userId: user.uid});
            toast({
                title: 'Invoice Created',
                description: `Quote ${quote.quoteNumber} has been successfully converted to an invoice.`
            });
            router.push(`/create?draftId=${newDocRef.id}`);
        } catch (error) {
            console.error("Error converting quote to invoice:", error);
            toast({
                title: 'Conversion Failed',
                description: 'Could not convert the quote to an invoice. Please try again.',
                variant: 'destructive'
            });
        }
    };

    const handleShare = (docId: string) => {
        const url = `${window.location.origin}/quote/${docId}`;
        navigator.clipboard.writeText(url);
        toast({
            title: "Link Copied!",
            description: "The shareable link has been copied to your clipboard.",
        });
    };

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);

    const combinedDocuments = useMemo(() => {
        if (!user) return [];
        const allDocs: DocumentType[] = [];
        if (invoices) allDocs.push(...invoices);
        if (quotes) allDocs.push(...quotes);
        
        const fromJSON = (key: string, value: any) => {
             if (key === 'invoiceDate' || key === 'dueDate' || key === 'quoteDate' || key === 'validUntilDate') {
                return value?.toDate ? value.toDate() : (value ? new Date(value) : null);
            }
            return value;
        };

        return (JSON.parse(JSON.stringify(allDocs), fromJSON) as DocumentType[])
            .filter(doc => {
                const total = calculateTotal(doc);
                let date;
                if (doc.documentType === 'invoice') {
                  date = (doc as Invoice).invoiceDate;
                } else if (doc.documentType === 'quote') {
                  date = (doc as Quote).quoteDate;
                } else {
                  return false; // Skip if documentType is not defined
                }
                if (!date) return false;

                const clientNameMatch = filters.clientName ? doc.clientName.toLowerCase().includes(filters.clientName.toLowerCase()) : true;
                const statusMatch = filters.status ? doc.status === filters.status : true;
                const amountMinMatch = filters.amountMin !== null ? total >= filters.amountMin : true;
                const amountMaxMatch = filters.amountMax !== null ? total <= filters.amountMax : true;
                const dateMatch = (filters.dateFrom && filters.dateTo) ? isWithinInterval(new Date(date), { start: filters.dateFrom, end: filters.dateTo })
                                : filters.dateFrom ? new Date(date) >= filters.dateFrom
                                : filters.dateTo ? new Date(date) <= filters.dateTo
                                : true;
                return clientNameMatch && statusMatch && amountMinMatch && amountMaxMatch && dateMatch;
            })
            .sort((a, b) => {
                const dateA = a.documentType === 'invoice' ? (a as Invoice).invoiceDate : (a as Quote).quoteDate;
                const dateB = b.documentType === 'invoice' ? (b as Invoice).invoiceDate : (b as Quote).quoteDate;
                if (!dateA || !dateB) return 0;
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            });
    }, [invoices, quotes, filters, calculateTotal, user]);

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
                return 'destructive';
            case 'draft':
            default: return 'outline';
        }
    };
    
    const isLoading = isUserLoading || isLoadingInvoices || isLoadingQuotes;

    if (isUserLoading) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold font-headline">Loading Dashboard...</h1>
            </div>
        )
    }

    return (
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
                    <p className="text-muted-foreground">Manage your invoices and quotes here.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/create">
                            <FilePlus2 className="mr-2 h-4 w-4" />
                            New Invoice
                        </Link>
                    </Button>
                     <Button asChild variant="outline">
                        <Link href="/create-quote">
                            <FilePlus2 className="mr-2 h-4 w-4" />
                            New Quote
                        </Link>
                    </Button>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>My Documents</CardTitle>
                    <CardDescription>A list of your saved invoices and quotes from Firestore.</CardDescription>
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
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24">
                                            Loading documents...
                                        </TableCell>
                                    </TableRow>
                                ) : combinedDocuments.length > 0 ? combinedDocuments.map((doc) => {
                                    const isInvoice = doc.documentType === 'invoice';
                                    const docNumber = isInvoice ? (doc as Invoice).invoiceNumber : (doc as Quote).quoteNumber;
                                    const clientName = isInvoice ? (doc as Invoice).clientName : (doc as Quote).client.name;
                                    let docDate;
                                    if (isInvoice) {
                                      docDate = (doc as Invoice).invoiceDate;
                                    } else {
                                      docDate = (doc as Quote).quoteDate;
                                    }
                                    const docCollection = isInvoice ? INVOICES_COLLECTION : QUOTES_COLLECTION;

                                    return (
                                    <TableRow key={doc.id}>
                                        <TableCell><Badge variant={isInvoice ? 'secondary' : 'outline'}>{doc.documentType}</Badge></TableCell>
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
                                        <TableCell>{docDate ? format(new Date(docDate), 'yyyy-MM-dd') : 'N/A'}</TableCell>
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
                                                        <Link href={`/${isInvoice ? 'create' : 'create-quote'}?draftId=${doc.id}`} className="cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {!isInvoice && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleShare(doc.id)} className="cursor-pointer">
                                                                <Share2 className="mr-2 h-4 w-4" />
                                                                <span>Share Link</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleConvertToInvoice(doc as Quote)} className="cursor-pointer">
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
                                        <TableCell colSpan={7} className="text-center h-24">
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
    );
}
