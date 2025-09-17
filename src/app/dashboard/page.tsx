'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Invoice } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { FilePlus2, Edit, Trash2, ArrowUpDown, Search } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';

const DRAFTS_STORAGE_KEY = 'invoiceDrafts';

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export default function DashboardPage() {
    const [drafts, setDrafts] = useState<Invoice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('date-desc');
    const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

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
                setDrafts(parsedData);
            } catch (error) {
                console.error("Failed to parse invoice drafts from localStorage", error);
            }
        }
    }, []);

    const calculateTotal = (invoice: Invoice): number => {
        const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
        const taxAmount = (subtotal * invoice.tax) / 100;
        const discountAmount = (subtotal * invoice.discount) / 100;
        return subtotal + taxAmount - discountAmount;
    }

    const handleDelete = (invoiceId: string) => {
        const updatedDrafts = drafts.filter(draft => draft.id !== invoiceId);
        setDrafts(updatedDrafts);
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updatedDrafts, (key, value) => {
            if (key === 'invoiceDate' || key === 'dueDate') {
                return value ? new Date(value).toISOString() : value;
            }
            return value;
        }));
        setDeleteCandidateId(null);
    };

    const filteredAndSortedDrafts = useMemo(() => {
        return drafts
            .filter(draft => draft.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                switch (sortOption) {
                    case 'date-asc':
                        return new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime();
                    case 'date-desc':
                        return new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime();
                    case 'amount-asc':
                        return calculateTotal(a) - calculateTotal(b);
                    case 'amount-desc':
                        return calculateTotal(b) - calculateTotal(a);
                    default:
                        return 0;
                }
            });
    }, [drafts, searchTerm, sortOption]);

    return (
        <div className="container mx-auto p-4 md:p-8">
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
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by client name..."
                                className="pl-8 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <ArrowUpDown className="mr-2 h-4 w-4" />
                                    Sort by
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                                    <DropdownMenuRadioItem value="date-desc">Date: Newest first</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="date-asc">Date: Oldest first</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="amount-desc">Amount: High to low</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="amount-asc">Amount: Low to high</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

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
                                        <TableCell>Draft</TableCell>
                                        <TableCell>{format(invoice.invoiceDate, 'yyyy-MM-dd')}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/?draftId=${invoice.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteCandidateId(invoice.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            {searchTerm ? 'No drafts match your search.' : 'No drafts found.'}
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

    