
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
                <div className="flex justify-end text-right text-sm">
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

export const ConsultingTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div style={{ backgroundColor: accentColor, color: 'white' }} className="p-8 rounded-t-lg">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-sm opacity-80">{(t.consultingServices || 'Consulting Services')}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                        <p>#{invoice.invoiceNumber}</p>
                    </div>
                </header>
            </div>
            <div className="p-8 bg-white shadow-lg rounded-b-lg">
                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div><p className="font-bold mb-1">{(t.billTo || 'Bill To')}:</p><p>{client.name}<br/>{client.address}</p></div>
                    <div className="text-right"><p className="font-bold">{(t.date || 'Date')}:</p><p>{safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p></div>
                </section>
                <ConsultingDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="border-b"><th className="pb-2 font-semibold w-3/5">{(t.service || 'Service')}</th><th className="pb-2 font-semibold text-right">{(t.amount || 'Amount')}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-8 pt-8 border-t">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/2">
                            <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%):</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-xl mt-4"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};

export const ConsultingTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-10">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={90} height={45} className="object-contain mb-2"/>}
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-light text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                    <p># {invoice.invoiceNumber}</p>
                </div>
            </header>
            <section className="bg-gray-50 p-4 rounded grid grid-cols-2 gap-4 text-xs mb-8">
                <div><p className="font-bold">{(t.client || 'Client')}</p><p>{client.name}<br/>{client.address}</p></div>
                <div className="text-right"><p className="font-bold">{(t.date || 'Date')}</p><p>{safeFormat(invoice.invoiceDate, 'dd-MMM-yyyy')}</p></div>
            </section>
            <ConsultingDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr className="border-b"><th className="py-2 font-bold w-4/5">{(t.description || 'Description')}</th><th className="py-2 font-bold text-right">{(t.amount || 'Amount')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-3">{item.name}</td><td className="py-3 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/3">
                        <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>{(t.tax || 'Tax')}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <div className="w-full h-px bg-gray-300 my-2"></div>
                        <p className="flex justify-between font-bold"><span>{(t.total || 'Total')}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};

export const ConsultingTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header style={{ backgroundColor: accentColor }} className="text-white p-10 flex justify-between items-center">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <h2 className="text-xl">{(t.invoice || 'Invoice')} #{invoice.invoiceNumber}</h2>
            </header>
            <div className="p-10">
                <section className="grid grid-cols-2 gap-10 text-sm mb-10">
                    <div>
                        <p className="font-bold mb-1">{(t.billedTo || 'Billed To')}</p>
                        <p>{client.name}</p>
                        <p>{client.address}</p>
                    </div>
                    <div className="text-right">
                        <p><strong>{(t.date || 'Date')}:</strong> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                        <p><strong>{(t.dueDate || 'Due Date')}:</strong> {safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p>
                    </div>
                </section>
                <ConsultingDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-100"><th className="p-3 font-bold w-3/5">{(t.serviceProvided || 'Service Provided')}</th><th className="p-3 font-bold text-right">{(t.fee || 'Fee')}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-3">{item.name}</td><td className="p-3 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-10 pt-10 border-t">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3">
                            <p className="flex justify-between"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-lg mt-2"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};

export const ConsultingTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-mono text-sm ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="mb-10">
                <h1 className="text-xl font-bold">{business.name} // {(t.invoice || 'INVOICE').toUpperCase()}</h1>
                <p className="text-xs">{business.address}</p>
            </header>
            <section className="mb-10">
                <p>{(t.to || 'To')}: {client.name}</p>
                <p>{(t.date || 'Date')}: {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                <p>Ref: {invoice.invoiceNumber}</p>
            </section>
            <ConsultingDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr><th className="pt-2 pb-2 border-t border-b border-dashed w-4/5">{(t.description || 'Description')}</th><th className="pt-2 pb-2 border-t border-b border-dashed text-right">{(t.cost || 'Cost')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id}><td className="py-1">{item.name}</td><td className="py-1 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-xs">
                    <div className="w-1/2">
                        <p className="flex justify-between border-t border-dashed pt-2"><span>{(t.subtotal || 'Subtotal')}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>{(t.tax || 'Tax')}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t-2 border-black"><span>{(t.total || 'Total')}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};
