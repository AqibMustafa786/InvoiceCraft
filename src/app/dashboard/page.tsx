'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Invoice, InvoiceStatus } from '@/lib/types';
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
import { FilePlus2, Edit, Trash2, Filter, X, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { format, isWithinInterval } from 'date-fns';
import { FilterSheet, type DashboardFilters } from '@/components/dashboard/filter-sheet';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const DRAFTS_STORAGE_KEY = 'invoiceDrafts';

const initialFilters: DashboardFilters = {
    clientName: '',
    status: null,
    amountMin: null,
    amountMax: null,
    dateFrom: null,
    dateTo: null,
};

const STATUS_OPTIONS: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue'];

export default function DashboardPage() {
    const [drafts, setDrafts] = useState<Invoice[]>([]);
    const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
    const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fromJSON = (key: string, value: any) => {
            if (key === 'invoiceDate' || key === 'dueDate') {
                return value ? new Date(value) : value;
            }
            return value;
        };

        const savedData = localStorage.getItem(DRAFTS_STORAGE_KEY);
        if (savedData) {
            try {
                const parsedData: Invoice[] = JSON.parse(savedData, fromJSON);
                const draftsWithStatus = parsedData.map(d => ({...d, status: d.status || 'draft'}));
                setDrafts(draftsWithStatus);
            } catch (error) {
                console.error("Failed to parse invoice drafts from localStorage", error);
            }
        }
    }, []);

    const saveDraftsToStorage = (updatedDrafts: Invoice[]) => {
        try {
            localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updatedDrafts, (key, value) => {
                if (key === 'invoiceDate' || key === 'dueDate') {
                    return value ? new Date(value).toISOString() : value;
                }
                return value;
            }));
        } catch (error) {
            console.error("Failed to save invoice data to localStorage", error);
             toast({
                title: "Error",
                description: "There was an error saving your changes.",
                variant: "destructive",
            });
        }
    };


    const calculateTotal = useCallback((invoice: Invoice): number => {
        const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
        const taxAmount = (subtotal * invoice.tax) / 100;
        const discountAmount = (subtotal * invoice.discount) / 100;
        return subtotal + taxAmount - discountAmount;
    }, []);

    const handleDelete = (invoiceId: string) => {
        const updatedDrafts = drafts.filter(draft => draft.id !== invoiceId);
        setDrafts(updatedDrafts);
        saveDraftsToStorage(updatedDrafts);
        setDeleteCandidateId(null);
    };

    const handleStatusChange = (invoiceId: string, newStatus: InvoiceStatus) => {
        const updatedDrafts = drafts.map(draft => 
            draft.id === invoiceId ? { ...draft, status: newStatus } : draft
        );
        setDrafts(updatedDrafts);
        saveDraftsToStorage(updatedDrafts);
        toast({
            title: "Status Updated",
            description: `Invoice status changed to "${newStatus}".`,
        });
    };

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);

    const filteredAndSortedDrafts = useMemo(() => {
        return drafts
            .filter(draft => {
                const total = calculateTotal(draft);
                const clientNameMatch = filters.clientName ? draft.clientName.toLowerCase().includes(filters.clientName.toLowerCase()) : true;
                const statusMatch = filters.status ? draft.status === filters.status : true;
                const amountMinMatch = filters.amountMin !== null ? total >= filters.amountMin : true;
                const amountMaxMatch = filters.amountMax !== null ? total <= filters.amountMax : true;
                const dateMatch = (filters.dateFrom && filters.dateTo) ? isWithinInterval(draft.invoiceDate, { start: filters.dateFrom, end: filters.dateTo })
                                : filters.dateFrom ? draft.invoiceDate >= filters.dateFrom
                                : filters.dateTo ? draft.invoiceDate <= filters.dateTo
                                : true;
                return clientNameMatch && statusMatch && amountMinMatch && amountMaxMatch && dateMatch;
            })
            .sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()); // Default sort by newest
    }, [drafts, filters, calculateTotal]);

    const activeFilterCount = useMemo(() => {
        return Object.values(filters).filter(v => v !== null && v !== '').length;
    }, [filters]);

    const getStatusVariant = (status: InvoiceStatus) => {
        switch (status) {
            case 'paid': return 'success';
            case 'sent': return 'secondary';
            case 'overdue': return 'destructive';
            case 'draft':
            default: return 'outline';
        }
    };
    
    return (
        <div className="container mx-auto p-4 md:p-8">
            <FilterSheet
                open={isFilterSheetOpen}
                onOpenChange={setIsFilterSheetOpen}
                filters={filters}
                onFiltersChange={setFilters}
                onReset={resetFilters}
            />

            <AlertDialog open={deleteCandidateId !== null} onOpenChange={(open) => !open && setDeleteCandidateId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your invoice draft.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteCandidateId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(deleteCandidateId!)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your invoice drafts here.</p>
                </div>
                <Button asChild>
                    <Link href="/">
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        New Invoice
                    </Link>
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>My Drafts</CardTitle>
                    <CardDescription>A list of your saved invoice drafts.</CardDescription>
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
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedDrafts.length > 0 ? filteredAndSortedDrafts.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                        <TableCell>{invoice.clientName}</TableCell>
                                        <TableCell>${calculateTotal(invoice).toFixed(2)}</TableCell>
                                        <TableCell>
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="capitalize w-28 justify-start">
                                                        <Badge variant={getStatusVariant(invoice.status)} className="w-full justify-center">{invoice.status}</Badge>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    {STATUS_OPTIONS.map(status => (
                                                        <DropdownMenuItem
                                                            key={status}
                                                            disabled={invoice.status === status}
                                                            onClick={() => handleStatusChange(invoice.id, status)}
                                                            className="capitalize"
                                                        >
                                                            {status}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell>{format(invoice.invoiceDate, 'yyyy-MM-dd')}</TableCell>
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
                                                        <Link href={`/?draftId=${invoice.id}`} className="cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setDeleteCandidateId(invoice.id)} className="text-destructive cursor-pointer">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            No drafts match your filters.
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
