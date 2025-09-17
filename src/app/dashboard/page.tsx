import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilePlus2, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const invoices = [
        { id: 'INV-001', client: 'Client Company', amount: '$105.00', status: 'Paid', date: '2024-07-20' },
        { id: 'INV-002', client: 'Another Corp', amount: '$350.50', status: 'Pending', date: '2024-07-22' },
        { id: 'INV-003', client: 'Tech Solutions', amount: '$1200.00', status: 'Draft', date: '2024-07-25' },
    ];

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your invoices here.</p>
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
                    <CardTitle>My Invoices</CardTitle>
                    <CardDescription>This is a placeholder list of your invoices.</CardDescription>
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
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.client}</TableCell>
                                    <TableCell>{invoice.amount}</TableCell>
                                    <TableCell>{invoice.status}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
