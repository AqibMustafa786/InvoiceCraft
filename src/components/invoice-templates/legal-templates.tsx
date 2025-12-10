
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

const LegalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.legal) return null;
    const { legal } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.caseDetails || 'Case Details')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.caseName || 'Case Name')}:</span> {legal.caseName}</p>
                <p><span className="font-semibold text-gray-600">{(t.caseNumber || 'Case #')}:</span> {legal.caseNumber}</p>
                <p><span className="font-semibold text-gray-600">{(t.serviceType || 'Service Type')}:</span> {legal.serviceType}</p>
                {legal.hourlyRate && <p><span className="font-semibold text-gray-600">{(t.hourlyRate || 'Rate')}:</span> ${legal.hourlyRate.toFixed(2)}/hr</p>}
                {legal.hoursWorked && <p><span className="font-semibold text-gray-600">{(t.hoursWorked || 'Hours')}:</span> {legal.hoursWorked}</p>}
                {legal.retainerAmount && <p><span className="font-semibold text-gray-600">{(t.retainer || 'Retainer')}:</span> ${legal.retainerAmount.toFixed(2)}</p>}
                {legal.courtFilingFees && <p><span className="font-semibold text-gray-600">{(t.filingFees || 'Filing Fees')}:</span> ${legal.courtFilingFees.toFixed(2)}</p>}
                {legal.travelTime && <p><span className="font-semibold text-gray-600">{(t.travelTime || 'Travel (hrs)')}:</span> {legal.travelTime}</p>}
                {legal.additionalDisbursements && <p className="col-span-full"><span className="font-semibold text-gray-600">{(t.disbursements || 'Disbursements')}:</span> {legal.additionalDisbursements}</p>}
            </div>
        </section>
    );
};

export const LegalTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 font-serif ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="text-center mb-10 border-b-4 pb-4" style={{borderColor: accentColor}}>
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <p className="text-sm">{(t.attorneysAtLaw || 'Attorneys at Law')}</p>
                <p className="text-xs text-gray-600">{business.address}</p>
            </header>
            <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
                <div>
                    <p className="font-bold">{(t.to || 'TO')}:</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><strong>{(t.invoice || 'INVOICE')} #:</strong> {invoice.invoiceNumber}</p>
                    <p><strong>{(t.date || 'DATE')}:</strong> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                </div>
            </section>
            <LegalDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr style={{backgroundColor: accentColor, color: 'white'}}><th className="p-2 font-bold w-3/5">{(t.description || 'DESCRIPTION').toUpperCase()}</th><th className="p-2 font-bold text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}<br/><span className="text-xs text-gray-500">({item.quantity} hrs @ {currencySymbol}{item.unitPrice}/hr)</span></td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-right text-sm">
                    <div className="w-2/5">
                        <p className="flex justify-between py-1"><span>{(t.totalForServices || 'Total for Services')}:</span><span>{currencySymbol}{props.subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between py-1"><span>{(t.otherCharges || 'Other Charges & Tax')}:</span><span>{currencySymbol}{props.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-gray-800"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
}

export const LegalTemplate2: React.FC<PageProps> = (props) => <LegalTemplate1 {...props} />;
export const LegalTemplate3: React.FC<PageProps> = (props) => <LegalTemplate1 {...props} />;
export const LegalTemplate4: React.FC<PageProps> = (props) => <LegalTemplate1 {...props} />;
export const LegalTemplate5: React.FC<PageProps> = (props) => <LegalTemplate1 {...props} />;
