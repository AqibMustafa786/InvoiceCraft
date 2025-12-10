
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

export const LegalTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
     return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="p-10 text-white flex justify-between" style={{backgroundColor: '#1a202c'}}>
                <div>
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                    <p>#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <div className="p-10">
                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div><p className="font-bold">{(t.billedTo || 'Billed To')}</p><p>{client.name}<br/>{client.address}</p></div>
                    <div className="text-right"><p><strong>{(t.date || 'Date')}:</strong> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p></div>
                </section>
                <LegalDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="border-b-2"><th className="pb-2 font-bold">{(t.service || 'SERVICE')}</th><th className="pb-2 font-bold text-right">{(t.total || 'TOTAL')}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-right text-sm">
                        <div className="w-1/3">
                            <p className="flex justify-between font-bold text-xl"><span>{(t.totalDue || 'Total Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
                )}
            </div>
        </div>
     )
};

export const LegalTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans bg-gray-50 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="bg-white p-8 shadow-lg">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500">{(t.legalServices || 'Legal Services')}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-light text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                        <p className="text-xs"># {invoice.invoiceNumber}</p>
                    </div>
                </header>
                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div><p className="font-bold">{(t.client || 'Client')}</p><p>{client.name}<br/>{client.address}</p></div>
                    <div className="text-right"><p><strong>{(t.date || 'Date')}:</strong> {safeFormat(invoice.invoiceDate, 'dd-MMM-yyyy')}</p></div>
                </section>
                <LegalDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">{(t.serviceDescription || 'Service Description')}</th><th className="p-2 font-bold text-right">{(t.fee || 'Fee')}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-sm">
                        <div className="w-2/5">
                            <p className="flex justify-between py-1"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between py-1 border-b"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-lg mt-2 pt-2"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};
export const LegalTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-serif bg-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-sm">{(t.attorneysAtLaw || 'Attorneys at Law')}</p>
            </header>
            <div className="w-full h-px bg-gray-300 mb-8"></div>
            <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
                <div><p className="font-bold">{(t.statementOfAccountFor || 'Statement of Account For')}:</p><p>{client.name}</p></div>
                <div className="text-right"><p><strong>{(t.invoice || 'INVOICE')} #:</strong> {invoice.invoiceNumber}</p><p><strong>{(t.date || 'DATE')}:</strong> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p></div>
            </section>
            <LegalDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b-2 border-t-2"><th className="py-2 w-3/5">{(t.professionalServicesRendered || 'Professional Services Rendered')}</th><th className="py-2 text-right">{(t.amount || 'Amount')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/3">
                        <p className="flex justify-between py-1"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};
export const LegalTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`flex ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="w-1/4 p-8 text-white" style={{backgroundColor: accentColor}}><h1 className="text-3xl font-bold">{business.name}</h1></div>
            <div className="w-3/4 p-10">
                <header className="text-right mb-10"><h2 className="text-4xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h2></header>
                <section className="text-sm mb-10">
                    <p className="font-bold">{(t.client || 'Client')}: {client.name}</p>
                    <p><strong>{(t.invoiceNo || 'Invoice #')}:</strong> {invoice.invoiceNumber} | <strong>{(t.date || 'Date')}:</strong> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                </section>
                <LegalDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">{(t.description || 'Description')}</th><th className="p-2 font-bold text-right">{(t.total || 'Total')}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="text-right text-2xl font-bold">{(t.totalDue || 'Total Due')}: {currencySymbol}{balanceDue.toFixed(2)}</div>
                </footer>
                )}
            </div>
        </div>
    )
};
