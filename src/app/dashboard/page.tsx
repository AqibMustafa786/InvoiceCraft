'use client';

import { useState, useEffect } from 'react';
import type { Invoice } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilePlus2, Edit } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';

const DRAFTS_STORAGE_KEY = 'invoiceDrafts';

export default function DashboardPage() {
    const [drafts, setDrafts] = useState<Invoice[]>([]);

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
    
    const calculateTotal = (invoice: Invoice) => {
        const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
        const taxAmount = (subtotal * invoice.tax) / 100;
        const discountAmount = (subtotal * invoice.discount) / 100;
        const total = subtotal + taxAmount - discountAmount;
        return total.toFixed(2);
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
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
                    <CardDescription>This is a list of your saved invoice drafts.</CardDescription>
                </CardHeader>
                <CardContent>
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
                            {drafts.length > 0 ? drafts.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                    <TableCell>{invoice.clientName}</TableCell>
                                    <TableCell>${calculateTotal(invoice)}</TableCell>
                                    <TableCell>Draft</TableCell>
                                    <TableCell>{format(invoice.invoiceDate, 'yyyy-MM-dd')}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/?draftId=${invoice.id}`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        No drafts found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
