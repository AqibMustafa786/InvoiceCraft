'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';
import { CategorySpecificDetails } from './category-specific-details';

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

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8">
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-500 pt-1 border-t-2 border-gray-700 w-[150px]">{label}</p>
        </div>
    )
}

export const MedicalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.medical) return null;
    const { medical } = invoice;
    const hasDetails = Object.values(medical).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.patientInformation || 'Patient Information'}</p>
            </section>
        );
    }

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.patientInformation || 'Patient Information'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {medical.patientName && <p><span className="font-semibold text-gray-600">{t.patientName || 'Patient'}:</span> {medical.patientName}</p>}
                {medical.patientId && <p><span className="font-semibold text-gray-600">{t.patientId || 'Patient ID'}:</span> {medical.patientId}</p>}
                {medical.visitDate && <p><span className="font-semibold text-gray-600">{t.visitDate || 'Visit Date'}:</span> {safeFormat(medical.visitDate, 'MM/dd/yyyy')}</p>}
                {medical.physicianName && <p><span className="font-semibold text-gray-600">{t.physician || 'Physician'}:</span> {medical.physicianName}</p>}
                {medical.serviceType && <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {medical.serviceType}</p>}
                {medical.cptCode && <p><span className="font-semibold text-gray-600">{t.cptCode || 'CPT'}:</span> {medical.cptCode}</p>}
                {medical.icdCode && <p><span className="font-semibold text-gray-600">{t.icdCode || 'ICD-10'}:</span> {medical.icdCode}</p>}
                {medical.copayAmount && <p><span className="font-semibold text-gray-600">{t.copay || 'Copay'}:</span> ${medical.copayAmount.toFixed(2)}</p>}
                {medical.labFee && <p><span className="font-semibold text-gray-600">{t.labFee || 'Lab Fee'}:</span> ${medical.labFee.toFixed(2)}</p>}
                {medical.medicationCharges && <p><span className="font-semibold text-gray-600">{t.medication || 'Medication'}:</span> ${medical.medicationCharges.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Caduceus (Based on user-provided image)
export const MedicalTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 font-sans relative ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-5" style={{backgroundImage: `url("https://storage.googleapis.com/studio-hosting-assets/invoice-template-previews/medical-watermark.svg")`}}></div>

            <div className="relative z-10">
                <header className="mb-8">
                    <div className="w-full h-2 mb-8" style={{backgroundColor: accentColor}}></div>
                     <div className="flex justify-between items-start">
                        <div>
                           {business.logoUrl ? (
                                <Image src={business.logoUrl} alt="Company Logo" width={100} height={40} className="object-contain mb-4" />
                            ) : (
                                <h1 className="text-3xl font-bold">{business.name}</h1>
                            )}
                        </div>
                        <div className="text-right">
                           <p className="font-bold">{business.name}</p>
                           <p className="text-xs whitespace-pre-line">{business.address}</p>
                           <p className="text-xs">{business.phone} | {business.email}</p>
                           {business.website && <p className="text-xs">{business.website}</p>}
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div>
                        <p className="font-bold">{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                        <p className="whitespace-pre-line">{client.address}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    </div>
                    <div className="text-right">
                    </div>
                </section>

                <section className="grid grid-cols-4 gap-4 text-xs text-center mb-8 p-3 bg-gray-100 rounded-md">
                    <div><p className="font-bold text-gray-500">{(t.invoiceNo || 'INVOICE NUMBER').toUpperCase()}</p><p className="mt-1">{invoice.invoiceNumber}</p></div>
                    <div><p className="font-bold text-gray-500">{(t.date || 'DATE').toUpperCase()}</p><p className="mt-1">{safeFormat(invoice.invoiceDate, 'dd/MM/yy')}</p></div>
                    <div><p className="font-bold text-gray-500">{(t.dueDate || 'INVOICE DUE DATE').toUpperCase()}</p><p className="mt-1">{safeFormat(invoice.dueDate, 'dd/MM/yy')}</p></div>
                    <div><p className="font-bold text-gray-500">{(t.price || 'PRICE').toUpperCase()}</p><p className="mt-1 font-bold">{currencySymbol}{total.toFixed(2)}</p></div>
                    {invoice.poNumber && <div className="col-span-full mt-2 text-left"><p><span className="font-bold">PO Number: </span>{invoice.poNumber}</p></div>}
                </section>
                
                <CategorySpecificDetails invoice={invoice} t={t} />

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead style={{backgroundColor: accentColor}} className="text-white">
                            <tr>
                                <th className="p-2 font-bold w-1/2">{(t.item || 'ITEM').toUpperCase()}</th>
                                <th className="p-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                                <th className="p-2 font-bold text-right">{(t.price || 'PRICE').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2 text-xs font-semibold whitespace-pre-line">{item.name}</td>
                                    <td className="p-2 text-xs text-gray-600 whitespace-pre-line">{item.description}</td>
                                    <td className="p-2 text-right text-xs">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>

                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-between items-start">
                        <div className="w-1/3 text-xs p-4 bg-gray-50 rounded-md">
                            <p className="font-bold" style={{color: accentColor}}>{t.notes || 'Notes'}</p>
                            <p className="mt-1 whitespace-pre-line">{invoice.paymentInstructions}</p>
                        </div>
                        <div className="w-1/3 text-right text-xs space-y-2">
                             <p className="grid grid-cols-2"><span className="font-bold">{(t.subtotal || 'SUBTOTAL').toUpperCase()}</span> <span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                             {discountAmount > 0 && <p className="grid grid-cols-2"><span className="font-bold text-red-600">{(t.discount || 'DISCOUNT').toUpperCase()}</span> <span className="text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                             {invoice.summary.shippingCost > 0 && <p className="grid grid-cols-2"><span className="font-bold">{(t.shipping || 'SHIPPING').toUpperCase()}</span> <span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                             <p className="grid grid-cols-2"><span className="font-bold">{(t.taxRate || 'TAX RATE').toUpperCase()}</span> <span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                             <p className="grid grid-cols-2 mt-2 pt-2 border-t-2 font-bold text-lg" style={{borderColor: accentColor}}><span style={{color: accentColor}}>{(t.total || 'TOTAL').toUpperCase()}</span> <span>{currencySymbol}{total.toFixed(2)}</span></p>
                             {(invoice.amountPaid || 0) > 0 && <p className="grid grid-cols-2 text-green-600 font-bold"><span>Amount Paid:</span> <span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="grid grid-cols-2 font-bold"><span>Balance Due:</span> <span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                    <div className="flex justify-between mt-8">
                        {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />}
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
}

// Template 2: Vitality - Redesigned
export const MedicalTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');
    return (
        <div className={`p-10 font-sans bg-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-10 pb-5 border-b" style={{borderColor: accentColor}}>
                <div className="w-2/3">
                    <h1 className="text-4xl font-bold mb-1" style={{color: accentColor}}>{business.name}</h1>
                    <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                    <p className="text-xs text-gray-500">{business.phone} | {business.email}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-semibold text-gray-600">{docTitle.toUpperCase()}</h2>
                    <p className="text-sm">#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
                <div>
                    <p className="font-bold text-gray-500 mb-1">{t.billedTo || 'Billed To'}</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="text-gray-600">{client.address}</p>
                </div>
                <div className="text-right">
                    <p><strong className="text-gray-500">{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p>
                    <p><strong className="text-gray-500">{t.dueDate || 'Due Date'}:</strong> {safeFormat(invoice.dueDate, 'MMMM dd, yyyy')}</p>
                </div>
            </section>
            <CategorySpecificDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr style={{backgroundColor: accentColor, color: 'white'}} className="rounded-t-lg">
                            <th className="p-3 font-semibold w-1/5 rounded-tl-lg">{t.serviceDate || 'Service Date'}</th>
                            <th className="p-3 font-semibold w-2/5">{t.procedure || 'Procedure'}</th>
                            <th className="p-3 font-semibold w-2/5">{t.description || 'Details'}</th>
                            <th className="p-3 font-semibold text-right rounded-tr-lg">{t.charge || 'Charge'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3 align-top">{safeFormat(invoice.medical?.visitDate, 'MM/dd/yyyy')}</td>
                                <td className="p-3 align-top font-medium whitespace-pre-line">{item.name}</td>
                                <td className="p-3 align-top text-xs text-gray-600 whitespace-pre-line">{item.description}</td>
                                <td className="p-3 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-2/5">
                        <div className="flex justify-between py-1 border-b"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                        {discountAmount > 0 && <div className="flex justify-between py-1 border-b text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                        {invoice.summary.shippingCost > 0 && <div className="flex justify-between py-1 border-b"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                        <div className="flex justify-between py-1 border-b"><span>{t.adjustments || 'Adjustments'}:</span><span>{currencySymbol}{(taxAmount > 0 ? taxAmount.toFixed(2) : '0.00')}</span></div>
                        <div className="flex justify-between font-bold py-2"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                        {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between py-1 font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                        <div className="flex justify-between font-bold p-2 mt-2 rounded-md" style={{backgroundColor: `${accentColor}20`, color: accentColor}}><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};
// Template 3: Clinic
export const MedicalTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.statement || 'STATEMENT').toUpperCase();

    return (
        <div className={`flex ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <div className="w-1/4 p-8 text-white" style={{backgroundColor: accentColor}}>
                <h1 className="text-3xl font-bold">{docTitle}</h1>
                <div className="mt-10 text-xs space-y-4">
                    <div><p className="opacity-70">{t.statementDate || 'Statement Date'}</p><p>{safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p></div>
                    <div><p className="opacity-70">{t.accountNo || 'Account #'}</p><p>{invoice.medical?.patientId || invoice.invoiceNumber}</p></div>
                </div>
            </div>
            <div className="w-3/4 p-10">
                <header className="text-right mb-10"><h2 className="text-2xl font-bold">{business.name}</h2><p className="text-xs">{business.address}</p></header>
                <section className="mb-10 text-sm"><p className="font-bold">{t.to || 'To'}:</p><p>{client.name}</p></section>
                <CategorySpecificDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">{t.description || 'Description'}</th><th className="p-2 font-bold text-right">{t.amount || 'Amount'}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-xl font-bold"><p><span>{t.total || 'Total'}: </span><span>{currencySymbol}{total.toFixed(2)}</span></p></div>
                    {(invoice.amountPaid || 0) > 0 && <div className="flex justify-end text-xl font-bold text-green-600"><p><span>{t.amountPaid || 'Paid'}: </span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p></div>}
                    <div className="flex justify-end text-xl font-bold mt-2 bg-gray-100 p-2">
                       <p><span>{t.balanceDue || 'Balance Due'}: </span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};

// Template 4: Wellness
export const MedicalTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', borderTop: `10px solid ${accentColor}`, backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-center mb-8">
                <div><h1 className="text-2xl font-bold">{business.name}</h1><p className="text-xs">{business.address}</p></div>
                <h2 className="text-3xl font-light text-gray-500">{docTitle.toUpperCase()}</h2>
            </header>
            <section className="text-sm mb-8">
                <p><strong>{t.patient || 'Patient'}:</strong> {client.name}</p>
                <p><strong>{t.invoiceNo || 'Invoice #'}:</strong> {invoice.invoiceNumber}</p>
                <p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                <p><strong>{t.dueDate || 'Due Date'}:</strong> {safeFormat(invoice.dueDate, 'MMMM d, yyyy')}</p>
            </section>
            <CategorySpecificDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b"><th className="pb-2 font-bold w-4/5">{t.procedure || 'Procedure'}</th><th className="pb-2 font-bold text-right">{t.fee || 'Fee'}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-right">
                    <div className="w-1/3 text-sm">
                        <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>{t.adjustments || 'Adjustments'}</span><span>{currencySymbol}{(taxAmount > 0 ? taxAmount.toFixed(2) : '0.00')}</span></p>
                        <p className="flex justify-between font-bold mt-2"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold bg-gray-100 p-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
                 <div className="text-xs mt-8">
                    <p className="font-bold">{t.paymentInstructions || 'Payment Instructions'}:</p>
                    <p className="text-muted-foreground whitespace-pre-line">{invoice.paymentInstructions}</p>
                </div>
            </footer>
            )}
        </div>
    );
};

// Template 5: Remedy
export const MedicalTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');
    return (
        <div className={`p-8 font-serif ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="text-center mb-10">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <p className="text-xs">{business.address} | {business.phone}</p>
            </header>
            <h2 className="text-center text-xl font-semibold mb-8">{t.statementOfAccount || 'STATEMENT OF ACCOUNT'}</h2>
            <section className="text-xs mb-8">
                <p><strong>{t.patient || 'Patient'}:</strong> {client.name}</p>
                <p><strong>{t.accountNo || 'Account #'}:</strong> {invoice.medical?.patientId || 'N/A'}</p>
                <p><strong>{t.invoiceNo || 'Invoice #'}:</strong> {invoice.invoiceNumber}</p>
                <p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                <p><strong>{t.dueDate || 'Due Date'}:</strong> {safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p>
                {invoice.poNumber && <p><strong>PO #:</strong> {invoice.poNumber}</p>}
            </section>
            <CategorySpecificDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-2/3">{t.service || 'Service'}</th><th className="p-2 font-bold text-right">{t.charge || 'Charge'}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/2">
                        <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-xl mt-2" style={{color: accentColor}}><span>{t.pleaseRemit || 'Please Remit'}: </span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold bg-gray-100 p-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
                 <div className="text-xs mt-8">
                    <p className="font-bold">{t.paymentInstructions || 'Payment Instructions'}:</p>
                    <p className="text-muted-foreground whitespace-pre-line">{invoice.paymentInstructions}</p>
                 </div>
            </footer>
            )}
        </div>
    );
};
