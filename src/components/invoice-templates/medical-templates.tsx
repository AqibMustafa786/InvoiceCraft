
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

const MedicalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.medical) return null;
    const { medical } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.patientInformation || 'Patient Information')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.patientName || 'Patient')}:</span> {medical.patientName}</p>
                <p><span className="font-semibold text-gray-600">{(t.patientId || 'Patient ID')}:</span> {medical.patientId}</p>
                <p><span className="font-semibold text-gray-600">{(t.visitDate || 'Visit Date')}:</span> {safeFormat(medical.visitDate, 'MM/dd/yyyy')}</p>
                <p><span className="font-semibold text-gray-600">{(t.physician || 'Physician')}:</span> {medical.physicianName}</p>
                <p><span className="font-semibold text-gray-600">{(t.serviceType || 'Service Type')}:</span> {medical.serviceType}</p>
                <p><span className="font-semibold text-gray-600">{(t.cptCode || 'CPT')}:</span> {medical.cptCode}</p>
                <p><span className="font-semibold text-gray-600">{(t.icdCode || 'ICD-10')}:</span> {medical.icdCode}</p>
                {medical.copayAmount && <p><span className="font-semibold text-gray-600">{(t.copay || 'Copay')}:</span> ${medical.copayAmount.toFixed(2)}</p>}
                {medical.labFee && <p><span className="font-semibold text-gray-600">{(t.labFee || 'Lab Fee')}:</span> ${medical.labFee.toFixed(2)}</p>}
                {medical.medicationCharges && <p><span className="font-semibold text-gray-600">{(t.medication || 'Medication')}:</span> ${medical.medicationCharges.toFixed(2)}</p>}
            </div>
        </section>
    );
};

export const MedicalTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-center mb-8 pb-4 border-b" style={{borderColor: accentColor}}>
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={80} className="object-contain" />}
                    <h1 className="text-2xl font-bold mt-2">{business.name}</h1>
                    <p className="text-xs text-gray-600">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                    <p>#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                <div><p className="font-bold text-gray-500 mb-1">{(t.billedTo || 'Billed To')}</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="text-right"><p className="font-bold text-gray-500">{(t.invoiceDate || 'Date')}: {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p></div>
            </section>
            <MedicalDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr style={{backgroundColor: accentColor, color: 'white'}}><th className="p-2 font-bold w-3/5">{(t.service || 'Service')}</th><th className="p-2 font-bold text-right">{(t.amount || 'Amount')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-right text-sm">
                    <div className="w-2/5">
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.totalCharges || 'Total Charges')}:</span><span>{currencySymbol}{props.total.toFixed(2)}</span></p>
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.amountPaid || 'Amount Paid')}:</span><span>- {currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-gray-800"><span>{(t.patientResponsibility || 'Patient Responsibility')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
}


export const MedicalTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-serif bg-gray-50 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-sm text-gray-500">{(t.medicalBillingStatement || 'Medical Billing Statement')}</p>
            </header>
            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div><p className="font-bold">{(t.patient || 'Patient')}:</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="text-right"><p><strong>{(t.invoice || 'Invoice')} #:</strong> {invoice.invoiceNumber}</p><p><strong>{(t.date || 'Date')}:</strong> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
            </section>
            <MedicalDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs bg-white">
                    <thead><tr className="bg-gray-200"><th className="p-2 font-semibold w-2/5">{(t.serviceDate || 'Service Date')}</th><th className="p-2 font-semibold w-3/5">{(t.procedure || 'Procedure')}</th><th className="p-2 font-semibold text-right">{(t.charge || 'Charge')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{safeFormat(invoice.medical?.visitDate, 'MM/dd/yyyy')}</td><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/3">
                        <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between border-b pb-1"><span>{(t.adjustments || 'Adjustments')}:</span><span>{currencySymbol}{(-taxAmount).toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold mt-2"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
}

export const MedicalTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`flex ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="w-1/4 p-8 text-white" style={{backgroundColor: accentColor || '#1E40AF'}}>
                <h1 className="text-3xl font-bold">{(t.statement || 'STATEMENT').toUpperCase()}</h1>
                <div className="mt-10 text-xs space-y-4">
                    <div><p className="opacity-70">{(t.statementDate || 'Statement Date')}</p><p>{safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p></div>
                    <div><p className="opacity-70">{(t.accountNo || 'Account #')}</p><p>{invoice.medical?.patientId || invoice.invoiceNumber}</p></div>
                </div>
            </div>
            <div className="w-3/4 p-10">
                <header className="text-right mb-10"><h2 className="text-2xl font-bold">{business.name}</h2><p className="text-xs">{business.address}</p></header>
                <section className="mb-10 text-sm"><p className="font-bold">{(t.to || 'To')}:</p><p>{client.name}</p></section>
                <MedicalDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">{(t.description || 'Description')}</th><th className="p-2 font-bold text-right">{(t.amount || 'Amount')}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-xl font-bold"><p><span>{(t.total || 'Total')}: </span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p></div>
                </footer>
                )}
            </div>
        </div>
    );
};

export const MedicalTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', borderTop: `10px solid ${accentColor}`, backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-center mb-8">
                <div><h1 className="text-2xl font-bold">{business.name}</h1><p className="text-xs">{business.address}</p></div>
                <h2 className="text-3xl font-light text-gray-500">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
            </header>
            <section className="text-sm mb-8"><p><strong>{(t.patient || 'Patient')}:</strong> {client.name}</p></section>
            <MedicalDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b"><th className="pb-2 font-bold w-4/5">{(t.procedure || 'Procedure')}</th><th className="pb-2 font-bold text-right">{(t.fee || 'Fee')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-right">
                    <div className="w-1/3 text-sm">
                        <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>{(t.adjustments || 'Adjustments')}</span><span>{currencySymbol}{taxAmount > 0 ? taxAmount.toFixed(2) : '0.00'}</span></p>
                        <p className="flex justify-between font-bold mt-2"><span>{(t.balanceDue || 'Balance Due')}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};

export const MedicalTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-8 font-serif ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="text-center mb-10">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <p className="text-xs">{business.address} | {business.phone}</p>
            </header>
            <h2 className="text-center text-xl font-semibold mb-8">{(t.statementOfAccount || 'STATEMENT OF ACCOUNT')}</h2>
            <section className="text-sm mb-8"><p><strong>{(t.patient || 'Patient')}:</strong> {client.name}</p><p><strong>{(t.accountNo || 'Account #')}:</strong> {invoice.medical?.patientId || 'N/A'}</p></section>
            <MedicalDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-2/3">{(t.service || 'Service')}</th><th className="p-2 font-bold text-right">{(t.charge || 'Charge')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/2">
                        <p className="flex justify-between font-bold text-xl" style={{color: props.accentColor}}><span>{(t.pleaseRemit || 'Please Remit')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};
