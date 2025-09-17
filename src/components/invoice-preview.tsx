'use client';

import type { Invoice } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { format } from 'date-fns';

interface InvoicePreviewProps {
  invoice: Invoice;
  logoUrl: string | null;
}

export function InvoicePreview({ invoice, logoUrl }: InvoicePreviewProps) {
  const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  const taxAmount = (subtotal * invoice.tax) / 100;
  const discountAmount = (subtotal * invoice.discount) / 100;
  const total = subtotal + taxAmount - discountAmount;

  return (
    <div id="invoice-preview" className="w-full shadow-lg rounded-xl overflow-hidden print:shadow-none print:rounded-none">
        <Card>
        <CardContent className="p-8 md:p-10 bg-white text-gray-800">
            <header className="flex justify-between items-start mb-10">
            <div>
                {logoUrl ? (
                <Image src={logoUrl} alt={`${invoice.companyName} Logo`} width={120} height={40} className="object-contain" data-ai-hint="logo" />
                ) : (
                <h1 className="text-3xl font-bold font-headline text-primary">{invoice.companyName}</h1>
                )}
                <p className="text-muted-foreground text-sm mt-2 whitespace-pre-line">{invoice.companyAddress}</p>
            </div>
            <div className="text-right">
                <h2 className="text-3xl font-bold text-gray-400 uppercase tracking-wider">Invoice</h2>
                <p className="text-muted-foreground mt-1">{invoice.invoiceNumber}</p>
            </div>
            </header>

            <section className="flex justify-between mb-10">
            <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500">BILL TO</p>
                <p className="font-bold">{invoice.clientName}</p>
                <p className="text-muted-foreground text-sm whitespace-pre-line">{invoice.clientAddress}</p>
            </div>
            <div className="text-right space-y-1">
                <p className="text-sm font-semibold text-gray-500">Invoice Date</p>
                <p>{format(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                <p className="text-sm font-semibold text-gray-500 mt-2">Due Date</p>
                <p>{format(invoice.dueDate, 'MMMM d, yyyy')}</p>
            </div>
            </section>

            <section>
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                <tr>
                    <th className="p-3 text-sm font-semibold w-1/2">Item</th>
                    <th className="p-3 text-sm font-semibold text-center">Qty</th>
                    <th className="p-3 text-sm font-semibold text-right">Rate</th>
                    <th className="p-3 text-sm font-semibold text-right">Subtotal</th>
                </tr>
                </thead>
                <tbody>
                {invoice.items.map(item => (
                    <tr key={item.id} className="border-b">
                    <td className="p-3">{item.name || <span className="text-gray-400">Item description</span>}</td>
                    <td className="p-3 text-center tabular-nums">{item.quantity}</td>
                    <td className="p-3 text-right tabular-nums">${item.rate.toFixed(2)}</td>
                    <td className="p-3 text-right tabular-nums font-medium">${(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </section>

            <section className="flex justify-end mt-8">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({invoice.tax}%)</span>
                <span className="font-medium tabular-nums">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount ({invoice.discount}%)</span>
                <span className="font-medium text-destructive tabular-nums">-${discountAmount.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span className="text-primary tabular-nums">${total.toFixed(2)}</span>
                </div>
            </div>
            </section>

            {invoice.notes && (
                <footer className="mt-10">
                    <p className="text-sm font-semibold text-gray-500">Notes</p>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{invoice.notes}</p>
                </footer>
            )}
        </CardContent>
        </Card>
    </div>
  );
}
