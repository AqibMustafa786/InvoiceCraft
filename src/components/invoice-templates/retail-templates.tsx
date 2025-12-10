
'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';

interface PageProps {
  invoice: Invoice;
  pageItems: LineItem[];
  pageIndex: number;
  totalPages: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  balanceDue: number;
  t: any;
  currencySymbol: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

const safeFormat = (date: Date | string | number | null | undefined, formatString: string) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

const RetailDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.retail) return null;
    const { retail } = invoice;
    return (
        <section className="my-4 text-xs">
            {/* Can add retail specific details here if needed in the future */}
        </section>
    );
};

export const RetailTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-8 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-center mb-8">
                {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain" /> : <h1 className="text-2xl font-bold">{business.name}</h1>}
                <h2 className="text-4xl font-light tracking-widest">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
            </header>
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div><p className="font-bold">{(t.to || 'TO')}:</p><p>{client.name}<br/>{client.address}</p></div>
                <div className="text-right"><p><strong>#:</strong> {invoice.invoiceNumber}</p><p><strong>{(t.date || 'Date')}:</strong> {safeFormat(invoice.invoiceDate, 'dd/MM/yyyy')}</p></div>
            </section>
            <RetailDetails invoice={invoice} t={t} />
            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead><tr className="border-y-2 border-black"><th className="py-2 w-1/2">{(t.item || 'Item')}</th><th className="py-2 text-center">{(t.qty || 'Qty')}</th><th className="py-2 text-right">{(t.unitPrice || 'Unit Price')}</th><th className="py-2 text-right">{(t.lineTotal || 'Line Total')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id}><td className="py-2">{item.name}</td><td className="py-2 text-center">{item.quantity}</td><td className="py-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/3">
                        <p className="flex justify-between py-1"><span>{(t.subtotal || 'Subtotal')}</span><span>{currencySymbol}{props.subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between py-1"><span>{(t.tax || 'Tax')}</span><span>{currencySymbol}{props.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>{(t.total || 'TOTAL')}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
}

export const RetailTemplate2: React.FC<PageProps> = (props) => <RetailTemplate1 {...props} />;
export const RetailTemplate3: React.FC<PageProps> = (props) => <RetailTemplate1 {...props} />;
export const RetailTemplate4: React.FC<PageProps> = (props) => <RetailTemplate1 {...props} />;
export const RetailTemplate5: React.FC<PageProps> = (props) => <RetailTemplate1 {...props} />;
