
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

const ConsultingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.consulting) return null;
    const { consulting } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.consultingDetails || 'Consulting Details')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.consultationType || 'Type')}:</span> {consulting.consultationType}</p>
                {consulting.sessionHours && <p><span className="font-semibold text-gray-600">{(t.sessionHours || 'Hours')}:</span> {consulting.sessionHours}</p>}
                {consulting.retainerFee && <p><span className="font-semibold text-gray-600">{(t.retainerFee || 'Retainer')}:</span> ${consulting.retainerFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

export const ConsultingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-8 font-serif ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-wider">{business.name}</h1>
                <p className="text-sm text-gray-500">{(t.consultingServices || 'Consulting Services')}</p>
            </header>
            <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                <div><p className="font-bold text-gray-600">{(t.client || 'Client')}</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="text-right"><p className="font-bold text-gray-600">{(t.invoice || 'Invoice')} #{invoice.invoiceNumber}</p><p>{(t.date || 'Date')}: {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p></div>
            </div>
            <ConsultingDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b-2 border-gray-800"><th className="pb-2 font-bold w-3/5">{(t.service || 'Service').toUpperCase()}</th><th className="pb-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-right">
                    <div className="w-2/5">
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{props.subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.tax || 'Tax')}:</span><span>{currencySymbol}{props.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-gray-800"><span>{(t.totalDue || 'Total Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
}

export const ConsultingTemplate2: React.FC<PageProps> = (props) => <ConsultingTemplate1 {...props} />;
export const ConsultingTemplate3: React.FC<PageProps> = (props) => <ConsultingTemplate1 {...props} />;
export const ConsultingTemplate4: React.FC<PageProps> = (props) => <ConsultingTemplate1 {...props} />;
export const ConsultingTemplate5: React.FC<PageProps> = (props) => <ConsultingTemplate1 {...props} />;
