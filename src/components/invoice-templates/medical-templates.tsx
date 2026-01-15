
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
    const docTitle = (t.invoice || 'Medical Invoice');

    return (
        <div className={`p-10 font-sans relative ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-5" style={{backgroundImage: `url("https://storage.googleapis.com/studio-hosting-assets/invoice-template-previews/medical-watermark.svg")`}}></div>

            <div className="relative z-10">
                <header className="mb-8 flex justify-between items-start">
                    <div>
                        {business.logoUrl ? (
                            <Image src={business.logoUrl} alt="Company Logo" width={100} height={40} className="object-contain mb-4" />
                        ) : (
                            <h1 className="text-3xl font-bold">{business.name}</h1>
                        )}
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
                        <p className="font-bold">{business.name}</p>
                        <p className="text-xs whitespace-pre-line">{business.address}</p>
                        <p className="text-xs">{business.phone} | {business.email}</p>
                        {business.website && <p className="text-xs">{business.website}</p>}
                        {business.licenseNumber && <p className="text-xs">Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p className="text-xs">Tax ID: {business.taxId}</p>}
                    </div>
                </section>

                <section className="grid grid-cols-4 gap-4 text-xs text-center mb-8 p-3 bg-gray-100 rounded-md">
                    <div><p className="font-bold text-gray-500">{(t.invoiceNo || 'INVOICE NUMBER').toUpperCase()}</p><p className="mt-1">{invoice.invoiceNumber}</p></div>
                    <div><p className="font-bold text-gray-500">{(t.date || 'DATE').toUpperCase()}</p><p className="mt-1">{safeFormat(invoice.invoiceDate, 'dd/MM/yy')}</p></div>
                    <div><p className="font-bold text-gray-500">{(t.dueDate || 'INVOICE DUE DATE').toUpperCase()}</p><p className="mt-1">{safeFormat(invoice.dueDate, 'dd/MM/yy')}</p></div>
                    <div><p className="font-bold text-gray-500">{(t.price || 'PRICE').toUpperCase()}</p><p className="mt-1 font-bold">{currencySymbol}{total.toFixed(2)}</p></div>
                    {invoice.poNumber && <div className="col-span-full mt-2 text-left"><p><span className="font-bold">PO Number: </span>{invoice.poNumber}</p></div>}
                </section>
                
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
                     <div className="flex justify-end mt-4">
                       <SignatureDisplay signature={business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
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
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <div className="text-xs text-gray-500">
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                    <p className="font-semibold">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold text-gray-500">Ship To:</span><br/>{client.shippingAddress}</p>}
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{t.invoiceNo || 'Invoice #'}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{t.dueDate || 'Due Date'}:</span> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-1/4">{(t.serviceDate || 'DATE') }</th>
                            <th className="py-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="py-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 align-top">{safeFormat(invoice.medical?.visitDate, 'MM/dd/yyyy')}</td>
                                <td className="py-2 align-top"><p className="font-semibold whitespace-pre-line">{item.name}</p>{item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}</td>
                                <td className="py-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <div className="w-1/3 text-sm space-y-1">
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between">{t.discount || 'Discount'}: <span className="text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between">{t.shipping || 'Other Fees'}: <span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.adjustments || 'Adjustments'}:</span><span>{currencySymbol}{(taxAmount > 0 ? taxAmount.toFixed(2) : '0.00')}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold bg-gray-100 p-2 mt-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold text-gray-500 mb-2">{t.termsAndConditions || 'Terms & Conditions'}</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label={"Owner Signature"} />
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
        <div className={`flex ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
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
                    <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-2/3">{t.service || 'Service'}</th><th className="p-2 font-bold w-1/6 text-center">{t.quantity || 'Qty'}</th><th className="p-2 font-bold text-right">{t.charge || 'Charge'}</th></tr></thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
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
                 <div className="flex justify-between mt-8">
                    <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                </div>
            </footer>
            )}
        </div>
    );
};

    
```
- src/components/templates/invoice-template.tsx:
```tsx

'use client';

import React, { useMemo } from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { type Invoice } from '@/lib/types'; // Make sure this path is correct
import { format, isValid } from 'date-fns';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.ttf' },
    { src: 'https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmEU9fBBc9.ttf', fontWeight: 'bold' },
  ],
});

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2emQ.ttf' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2emQ.ttf', fontWeight: 'bold' },
  ]
})

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#fff',
    color: '#333'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  companyDetails: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#999',
  },
  section: {
    marginBottom: 20,
  },
  billTo: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f3f3f3',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 5,
  },
  tableColHeader: {
    fontWeight: 'bold',
  },
  col_item: {
    width: '40%',
  },
  col_qty: {
    width: '15%',
    textAlign: 'center',
  },
  col_price: {
    width: '20%',
    textAlign: 'right',
  },
  col_total: {
    width: '25%',
    textAlign: 'right',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  summaryBox: {
    width: '40%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: 'contain'
  },
});

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  PKR: '₨'
};

const safeFormat = (date: Date | string | number | undefined, formatString: string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return isValid(d) ? format(d, formatString) : "Invalid Date";
}

interface PDFInvoiceTemplateProps {
  invoice: Invoice;
}

export const PDFInvoiceTemplate: React.FC<PDFInvoiceTemplateProps> = ({ invoice }) => {
  
  const currencySymbol = useMemo(() => currencySymbols[invoice.currency] || '$', [invoice.currency]);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companyDetails}>
            {invoice.business.logoUrl ? 
              <Image style={styles.logo} src={invoice.business.logoUrl} /> : 
              <Text style={styles.companyName}>{invoice.business.name}</Text>
            }
            <Text>{invoice.business.address}</Text>
            <Text>{invoice.business.email}</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text>Invoice #: {invoice.invoiceNumber}</Text>
            <Text>Date: {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</Text>
            <Text>Due Date: {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.billTo}>Bill To:</Text>
          <Text>{invoice.client.name}</Text>
          <Text>{invoice.client.address}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableColHeader, styles.col_item]}>Item</Text>
            <Text style={[styles.tableColHeader, styles.col_qty]}>Quantity</Text>
            <Text style={[styles.tableColHeader, styles.col_price]}>Price</Text>
            <Text style={[styles.tableColHeader, styles.col_total]}>Total</Text>
          </View>
          {invoice.lineItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col_item}>{item.name}</Text>
              <Text style={styles.col_qty}>{item.quantity}</Text>
              <Text style={styles.col_price}>{currencySymbol}{item.unitPrice.toFixed(2)}</Text>
              <Text style={styles.col_total}>{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text>Subtotal:</Text>
              <Text>{currencySymbol}{invoice.summary.subtotal.toFixed(2)}</Text>
            </View>
            {invoice.summary.taxAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text>Tax ({invoice.summary.taxPercentage}%):</Text>
                <Text>{currencySymbol}{invoice.summary.taxAmount.toFixed(2)}</Text>
              </View>
            )}
            {invoice.summary.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text>Discount:</Text>
                <Text>-{currencySymbol}{invoice.summary.discount.toFixed(2)}</Text>
              </View>
            )}
             {invoice.summary.shippingCost > 0 && (
              <View style={styles.summaryRow}>
                <Text>Shipping:</Text>
                <Text>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, { fontWeight: 'bold', borderTop: '1px solid #ccc', paddingTop: 5, marginTop: 5 }]}>
              <Text>Total:</Text>
              <Text>{currencySymbol}{invoice.summary.grandTotal.toFixed(2)}</Text>
            </View>
             {invoice.amountPaid && invoice.amountPaid > 0 && (
              <View style={styles.summaryRow}>
                <Text>Amount Paid:</Text>
                <Text>-{currencySymbol}{invoice.amountPaid.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text>Balance Due:</Text>
              <Text>{currencySymbol}{(invoice.summary.grandTotal - (invoice.amountPaid || 0)).toFixed(2)}</Text>
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
};
```
- vercel/path0/src/lib/types.ts:
```ts

'use client';

import { z } from 'zod';

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface LineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  rate?: number; // Keep for invoice compatibility
  taxable?: boolean;
}

export type DocumentStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'accepted' | 'rejected' | 'expired' | 'active' | 'cancelled' | 'unpaid' | 'partially-paid';

export type InvoiceCategory = 
  | "General Services"
  | "Construction"
  | "Plumbing"
  | "Electrical Services"
  | "HVAC Services"
  | "Roofing"
  | "Landscaping & Lawn Care"
  | "Cleaning Services"
  | "Freelance / Agency"
  | "Consulting"
  | "Legal Services"
  | "Medical / Healthcare"
  | "Auto Repair"
  | "E-commerce / Online Store"
  | "Retail / Wholesale"
  | "Photography"
  | "Real Estate / Property Management"
  | "Transportation / Trucking"
  | "IT Services / Tech Support"
  | "Rental / Property";

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email:string;
  website: string;
  licenseNumber: string;
  logoUrl?: string;
  taxId?: string; // New field for EIN/Tax ID
  ownerSignature?: {
    image: string;
    signedAt: any; // Firestore Timestamp
    signerName: string;
  }
}

export interface ClientInfo {
  clientId?: string; // Unique identifier for the client
  name: string;
  companyName?: string;
  address: string;
  phone: string;
  email: string;
  projectLocation?: string;
  shippingAddress?: string;
}

export interface Client {
  id: string;
  companyId: string;
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  address: string;
  shippingAddress?: string;
  website?: string;
  taxId?: string;
  notes?: string;
  avatarUrl?: string;
  createdAt: any;
  updatedAt: any;
  auditLog?: AuditLogEntry[];
}


export interface EstimateSummary {
    subtotal: number;
    taxPercentage: number;
    taxAmount: number;
    discount: number; // For simplicity, we'll use a fixed amount as discussed in implementation
    grandTotal: number;
    shippingCost: number;
}

export interface ConstructionInfo {
  jobSiteAddress: string;
  permitNumber: string;
  laborRate: number | null;
  equipmentRentalFees: number | null;
  wasteDisposalFee: number | null;
  projectStartDate: Date | null;
  projectEndDate: Date | null;
}

export interface RoofingInfo {
  roofType: string;
  squareFootage: number | null;
  pitch: string;
  tearOffRequired: boolean;
  underlaymentType: string;
  dumpsterFee: number | null;
}

export interface PlumbingInfo {
    serviceType: string;
    pipeMaterial: string;
    fixtureName: string;
    emergencyFee: number | null;
}

export interface ElectricalInfo {
    serviceType: string;
    voltage: string;
    fixtureDevice: string;
    permitCost: number | null;
}

export interface HVACInfo {
    unitType: string;
    modelNumber: string;
    refrigerantType: string;
    maintenanceFee: number | null;
}

export interface LandscapingInfo {
    lawnSquareFootage: number | null;
    serviceType: string;
    equipmentFee: number | null;
    disposalFee: number | null;
}

export interface CleaningInfo {
    cleaningType: string;
    numberOfRooms: number | null;
    squareFootage: number | null;
    suppliesFee: number | null;
    recurringSchedule: string;
}

export interface ConsultingInfo {
  consultationType: string;
  sessionHours: number | null;
  retainerFee: number | null;
}

export interface LegalInfo {
  caseName: string;
  caseNumber: string;
  serviceType: string;
  hourlyRate: number | null;
  hoursWorked: number | null;
  retainerAmount: number | null;
  courtFilingFees: number | null;
  travelTime: number | null;
  additionalDisbursements: string | null;
}

export interface MedicalInfo {
  patientName: string;
  patientId: string;
  serviceType: string;
  cptCode: string;
  icdCode: string;
  visitDate: Date | null;
  physicianName: string;
  copayAmount: number | null;
  labFee: number | null;
  medicationCharges: number | null;
}

export interface AutoRepairInfo {
    vehicleMake: string;
    vehicleModel: string;
    year: number | null;
    licensePlate: string;
    vin: string;
    odometer: number | null;
    laborHours: number | null;
    laborRate: number | null;
    diagnosticFee: number | null;
    shopSupplyFee: number | null;
    towingFee: number | null;
    parts: { name: string; partNumber: string; cost: number; }[];
}

export interface EcommerceInfo {
  orderNumber: string;
  sku: string;
  productCategory: string;
  weight: number | null;
  quantity: number | null;
  shippingCost: number | null;
  shippingCarrier: string;
  trackingId: string;
  salesTax: number | null;
  packagingFee: number | null;
}

export interface RetailInfo {
  sku: string;
  productName: string;
  productCategory: string;
  unitOfMeasure: string;
  batchNumber: string;
  stockQuantity: number | null;
  wholesalePrice: number | null;
  shippingPalletCost: number | null;
}

export interface PhotographyInfo {
  eventType: string;
  shootDate: Date | null;
  hoursOfCoverage: number | null;
  packageSelected: string;
  editedPhotosCount: number | null;
  rawFilesCost: number | null;
  travelFee?: number;
  equipmentRentalFee?: number;
}

export interface RealEstateInfo {
  propertyAddress: string;
  unitNumber: string;
  leaseTerm: string;
  tenantName: string;
  monthlyRent: number | null;
  cleaningFee: number | null;
  maintenanceFee: number | null;
  lateFee: number | null;
  hoaCharges: number | null;
  utilityCharges: number | null;
}

export interface TransportationInfo {
  pickupLocation: string;
  dropoffLocation: string;
  milesDriven: number | null;
  ratePerMile: number | null;
  weight: number | null;
  loadType: string;
  fuelSurcharge: number | null;
  tollCharges: number | null;
  detentionFee: number | null;
}

export interface ITServiceInfo {
  serviceType: string;
  hourlyRate: number | null;
  hardwareReplacementCost: number | null;
  monthlyMaintenanceFee: number | null;
  deviceType: string;
  serialNumber: string;
  hoursWorked: number | null;
}

export interface RentalInfo {
  rentalItemName: string;
  rentalStartDate: Date | null;
  rentalEndDate: Date | null;
  dailyRate: number | null;
  hourlyRate: number | null;
  numberOfDays: number | null;
  numberOfHours: number | null;
  securityDeposit: number | null;
  damageCharges: number | null;
  deliveryFee: number | null;
  pickupFee: number | null;
}


export interface ITFreelanceInfo {
  projectName: string;
  hourlyRate: number | null;
  fixedRate: number | null;
  hoursLogged: number | null;
  milestoneDescription: string;
}

export interface AuditLogEntry {
  id: string;
  action: 'created' | 'updated' | 'viewed' | 'signed' | 'declined' | 'sent';
  timestamp: any;
  user: any;
  version: number;
  changes?: string[];
}

export interface Invoice {
  id: string; 
  userId: string;
  companyId: string;
  clientId?: string;
  business: BusinessInfo;
  client: ClientInfo;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  lineItems: LineItem[];
  summary: EstimateSummary;
  paymentInstructions: string;
  status: DocumentStatus;
  currency: string;
  language: string;
  template: string;
  documentType: 'invoice';
  category: InvoiceCategory;
  fontFamily?: string;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  createdAt?: any;
  updatedAt?: any;
  amountPaid?: number;
  poNumber: string;
  auditLog: AuditLogEntry[];
  customFields?: CustomField[];

  // Category specific data
  construction?: ConstructionInfo;
  plumbing?: PlumbingInfo;
  electrical?: ElectricalInfo;
  hvac?: HVACInfo;
  roofing?: RoofingInfo;
  landscaping?: LandscapingInfo;
  cleaning?: CleaningInfo;
  freelance?: ITFreelanceInfo;
  consulting?: ConsultingInfo;
  legal?: LegalInfo;
  medical?: MedicalInfo;
  autoRepair?: AutoRepairInfo;
  ecommerce?: EcommerceInfo;
  rental?: RentalInfo;
  retail?: RetailInfo;
  photography?: PhotographyInfo;
  realEstate?: RealEstateInfo;
  transportation?: TransportationInfo;
  itServices?: ITServiceInfo;
}

export interface SignatureInfo {
    image: string;
    signedAt: any; // Firestore Timestamp
    signerName: string;
    signerIP?: string; // Optional, can be captured server-side
}

export type EstimateCategory = 
  | "Generic"
  | "Home Remodeling / Renovation"
  | "Roofing Estimate"
  | "HVAC (Air Conditioning / Heating)"
  | "Plumbing Estimate"
  | "Electrical Estimate"
  | "Landscaping Estimate"
  | "Cleaning Estimate"
  | "Auto Repair Estimate"
  | "Construction Estimate"
  | "IT / Freelance Estimate";

export interface HomeRemodelingInfo {
  projectType: string;
  propertyType: string;
  squareFootage: number | null;
  roomsIncluded: string;
  materialGrade: 'Basic' | 'Standard' | 'Premium';
  demolitionRequired: boolean;
  permitRequired: boolean;
  specialInstructions: string;
  expectedStartDate: Date | null;
  expectedCompletionDate: Date | null;
}

export interface Estimate {
  id: string;
  userId: string;
  companyId: string;
  clientId?: string;
  estimateNumber: string;
  estimateDate: Date;
  validUntilDate: Date;
  status: DocumentStatus;
  
  business: BusinessInfo;
  client: ClientInfo;
  lineItems: LineItem[];
  summary: EstimateSummary;
  
  projectTitle: string;
  referenceNumber: string;
  
  termsAndConditions: string;
  
  template: string;
  category: EstimateCategory;
  documentType: 'estimate' | 'quote';
  language: string;
  currency: string;
  isPublic: boolean;
  
  clientSignature?: SignatureInfo;
  auditLog: AuditLogEntry[];
  customFields?: CustomField[];

  fontFamily?: string;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  createdAt?: any;
  updatedAt?: any;

  // Category specific data
  homeRemodeling?: HomeRemodelingInfo;
  roofing?: RoofingInfo;
  hvac?: HVACInfo;
  plumbing?: PlumbingInfo;
  electrical?: ElectricalInfo;
  landscaping?: LandscapingInfo;
  cleaning?: CleaningInfo;
  autoRepair?: AutoRepairInfo;
  construction?: ConstructionInfo;
  itFreelance?: ITFreelanceInfo;
}

export type Quote = Estimate & { documentType: 'quote' };


export interface PolicyHolderInfo {
  clientId?: string;
  name: string;
  companyName?: string;
  address: string;
  phone: string;
  email: string;
  identificationNumber?: string; // CNIC, Passport, etc.
}

export type InsuranceCategory = 'Health' | 'Vehicle' | 'Property' | 'Life' | 'Business' | 'Travel' | 'Other';

export interface HealthInsuranceInfo {
  insuredPersonName: string;
  dateOfBirth: Date | null;
  gender: 'Male' | 'Female' | 'Other';
}

export interface VehicleInsuranceInfo {
  vehicleMake: string;
  model: string;
  registrationNumber: string;
  engineNumber: string;
  chassisNumber: string;
}

export interface PropertyInsuranceInfo {
  propertyAddress: string;
  propertyType: 'Residential' | 'Commercial';
  estimatedValue: number | null;
}

export interface Attachment {
    name: string;
    url: string;
    type: 'id_proof' | 'property_doc' | 'medical_report' | 'other';
}

export interface InsuranceDocument {
  id: string;
  userId: string;
  companyId: string;
  logoUrl?: string;
  business: BusinessInfo;
  
  policyHolder: PolicyHolderInfo;
  
  policyId: string;
  claimNumber: string;
  dateOfLoss: string;
  typeOfClaim: string;
  
  insuranceCompany: {
    name: string;
    address: string;
    phone: string;
    email: string;
    agentName: string;
    agentLicenseNumber: string;
  }

  policyNumber: string;
  documentDate: Date;
  
  items: LineItem[];
  tax: number;
  discount: number;
  shippingCost: number;

  termsAndConditions: string;
  internalNotes?: string;

  currency: string;
  language: string;
  template: string;
  createdAt: any;
  updatedAt: any;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;

  // Insured Entity Details
  insuranceCategory: InsuranceCategory;
  insuredItemDescription: string;
  coveragePurpose: string;
  coverageAmount: number;
  deductibleAmount: number;
  coverageScope: string;
  includedRisks: string;
  excludedRisks: string;

  health?: HealthInsuranceInfo;
  vehicle?: VehicleInsuranceInfo;
  property?: PropertyInsuranceInfo;

  // New Policy Information
  policyType: 'Comprehensive' | 'Third-Party' | 'Basic' | 'Premium';
  policyStartDate: Date;
  policyEndDate: Date;
  renewalOption: boolean;
  status: DocumentStatus;

  // Premium & Payment
  paymentFrequency: 'Monthly' | 'Quarterly' | 'Yearly' | 'One-time';
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Online';
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';

  attachments?: Attachment[];
  auditLog: AuditLogEntry[];
}


// Stripe Checkout Types
export const StripeCheckoutInputSchema = z.object({
  userId: z.string(),
  userEmail: z.string().email(),
  companyId: z.string(),
  plan: z.enum(['monthly', 'yearly']),
});
export type StripeCheckoutInput = z.infer<typeof StripeCheckoutInputSchema>;

export const StripeCheckoutOutputSchema = z.object({
  sessionId: z.string().optional(),
  url: z.string().url().optional(),
  error: z.string().optional(),
});
export type StripeCheckoutOutput = z.infer<typeof StripeCheckoutOutputSchema>;

```
- vercel/path0/src/lib/utils.ts:
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isValid, toDate } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Safely converts various date-like types to a JavaScript Date object.
 * Handles Firestore Timestamps, strings, numbers, and existing Date objects.
 * Returns null if the input is invalid or cannot be converted.
 * @param value The value to convert to a Date.
 * @returns A Date object or null.
 */
export function toDateSafe(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }
  // Handle Firestore Timestamps
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate();
  }
  // Handle strings or numbers
  try {
    const d = toDate(new Date(value));
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

/**
 * Safely converts a value to a number.
 * Returns 0 if the value is not a valid number.
 * @param value The value to convert.
 * @returns A number.
 */
export function toNumberSafe(value: any): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

```
- vercel/path0/tailwind.config.ts:
```ts
import type {Config} from 'tailwindcss';
import {fontFamily} from 'tailwindcss/defaultTheme';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        body: ['var(--font-inter)', 'sans-serif'],
        headline: ['var(--font-poppins)', 'sans-serif'],
        code: ['monospace'],
        roboto: ['var(--font-roboto)', ...fontFamily.sans],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
         wave: {
          '0%': { transform: 'rotate(0.0deg)' },
          '10%': { transform: 'rotate(14.0deg)' },
          '20%': { transform: 'rotate(-8.0deg)' },
          '30%': { transform: 'rotate(14.0deg)' },
          '40%': { transform: 'rotate(-4.0deg)' },
          '50%': { transform: 'rotate(10.0deg)' },
          '60%': { transform: 'rotate(0.0deg)' },
          '100%': { transform: 'rotate(0.0deg)' },
        },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
         'flip': {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'wave': 'wave 2s linear infinite',
        'marquee': 'marquee 80s linear infinite',
        'flip': 'flip 2s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

```
- vercel/path0/vercel/output/src/ai/genkit.ts:
```ts

'use server';

import { genkit, Ai } from '@genkit-ai/ai';
import { googleAI } from '@genkit-ai/google-genai';
import { genkitNode } from '@genkit-ai/next/node';

export const ai: Ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
    genkitNode(),
  ],
  logSinks: [genkitNode()],
  enableTracing: true,
});

```
- workspace/src/ai/flows/send-document-flow.ts:
```ts


import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { PDFDocument } from '@/components/pdf/document-pdf';
import { renderToBuffer } from '@react-pdf/renderer';
import { sendEmail } from '@/ai/flows/send-email-flow';
import type { Estimate, Quote, Invoice } from '@/lib/types';


export const SendDocumentSchema = z.object({
  docId: z.string(),
  docType: z.enum(['quote', 'estimate', 'invoice']),
});

async function findDocument(docId: string, docType: 'quote' | 'estimate' | 'invoice'): Promise<Quote | Estimate | Invoice | null> {
    const { firestore } = getFirebase();
    const collectionName = docType === 'quote' ? 'quotes' : docType === 'estimate' ? 'estimates' : 'invoices';
    
    const companiesRef = collection(firestore, 'companies');
    const companiesSnapshot = await getDocs(companiesRef);

    for (const companyDoc of companiesSnapshot.docs) {
        const docRef = doc(firestore, 'companies', companyDoc.id, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
             return { id: docSnap.id, ...docSnap.data() } as Quote | Estimate | Invoice;
        }
    }
    
    const collectionGroupRef = collection(firestore, collectionName);
    const q = query(collectionGroupRef, where('id', '==', docId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() } as Quote | Estimate | Invoice;
    }
    
    return null;
}

export const sendDocumentFlow = ai.defineFlow(
  {
    name: 'sendDocumentFlow',
    inputSchema: SendDocumentSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
  },
  async ({ docId, docType }) => {
    try {
      const document = await findDocument(docId, docType);
      
      if (!document) {
        throw new Error(`Document with ID ${docId} not found.`);
      }

      const pdfBuffer = await renderToBuffer(PDFDocument({ data: document }));
      const pdfBase64 = pdfBuffer.toString('base64');
      
      const docTypeTitle = docType.charAt(0).toUpperCase() + docType.slice(1);
      const docNumber = 'estimateNumber' in document ? document.estimateNumber : 'invoiceNumber' in document ? document.invoiceNumber : 'N/A';

      await sendEmail({
        to: document.client.email,
        subject: `Your ${docTypeTitle} from ${document.business.name} (#${docNumber})`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Hello ${document.client.name},</p>
            <p>Please find your ${docTypeTitle.toLowerCase()} from <strong>${document.business.name}</strong> attached to this email.</p>
            <p>You can also view it online by clicking the link below:</p>
            <p style="margin: 20px 0;">
              <a href="https://invoicecraft.app/${docType}/${docId}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                View ${docTypeTitle} Online
              </a>
            </p>
            <p>Thank you!</p>
            <p><em>${document.business.name}</em></p>
          </div>
        `,
        attachments: [
          {
            filename: `${docType}_${docNumber}.pdf`,
            content: pdfBase64,
            encoding: 'base64',
            contentType: 'application/pdf',
          },
        ],
      });

      return { success: true, message: 'Email sent successfully.' };
    } catch (error: any) {
      console.error('Failed to send document email:', error);
      return { success: false, message: error.message || 'An unknown error occurred.' };
    }
  }
);

```
- workspace/src/ai/flows/send-email-flow.ts:
```ts

'use server';
/**
 * @fileOverview A flow for sending emails.
 *
 * This file defines a Genkit flow for sending emails using a generic email
 * sending mechanism, which in this case is Firebase's mail-trigger extension.
 *
 * - sendEmail: A flow that sends an email by writing to a Firestore collection.
 * - SendEmailSchema: The Zod schema for the input of the sendEmail flow.
 */
import { ai } from '@/ai/genkit';
import { getFirebase } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { z } from 'zod';

export const SendEmailSchema = z.object({
  to: z.string(),
  subject: z.string(),
  html: z.string(),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        content: z.string(),
        encoding: z.string(),
        contentType: z.string(),
      })
    )
    .optional(),
});

export async function sendEmail(input: z.infer<typeof SendEmailSchema>) {
  return await sendEmailFlow(input);
}

const sendEmailFlow = ai.defineFlow(
  {
    name: 'sendEmailFlow',
    inputSchema: SendEmailSchema,
    outputSchema: z.any(),
  },
  async (emailData) => {
    const { firestore } = getFirebase();
    if (!firestore) {
      throw new Error('Firestore is not initialized.');
    }
    const mailCollection = collection(firestore, 'mail');
    await addDoc(mailCollection, {
      to: [emailData.to],
      message: {
        subject: emailData.subject,
        html: emailData.html,
      },
      attachments: emailData.attachments,
    });
    return { success: true };
  }
);

```
- workspace/src/ai/flows/send-password-reset-flow.ts:
```ts

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getFirebase } from '@/firebase';

export const sendPasswordResetEmailSchema = z.object({
  email: z.string().email(),
});

export const sendPasswordResetEmailFlow = ai.defineFlow(
  {
    name: 'sendPasswordResetEmailFlow',
    inputSchema: sendPasswordResetEmailSchema,
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
  async ({ email }) => {
    try {
      const { auth } = getFirebase();
      await sendPasswordResetEmail(auth, email);

      return {
        success: true,
        message: 'Password reset email sent successfully.',
      };
    } catch (error) {
      console.error('Password reset error:', error);

      // Security best practice
      return {
        success: true,
        message:
          'If an account with that email exists, a reset link has been sent.',
      };
    }
  }
);

```
- workspace/src/ai/flows/stripe-checkout-flow.ts:
```ts

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import Stripe from 'stripe';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeAdminApp } from '@/firebase/server';
import { StripeCheckoutInputSchema, StripeCheckoutOutputSchema } from '@/lib/types';

// Initialize Stripe with the secret key from environment variables.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const { db } = initializeAdminApp();

async function getOrCreateStripeCustomer(userId: string, email: string, companyId: string): Promise<string> {
  if (!db) {
    throw new Error("Firebase Admin DB is not initialized.");
  }
  
  const companyRef = doc(db, 'companies', companyId);
  const companySnap = await getDoc(companyRef);
  const companyData = companySnap.data();

  if (companyData?.stripeCustomerId) {
    return companyData.stripeCustomerId;
  }
  
  const customer = await stripe.customers.create({
    email: email,
    metadata: {
      firebaseUID: userId,
      firebaseCompanyId: companyId,
    },
  });

  await updateDoc(companyRef, { stripeCustomerId: customer.id });
  
  return customer.id;
}


export const createStripeCheckoutSession = ai.defineFlow(
  {
    name: 'createStripeCheckoutSession',
    inputSchema: StripeCheckoutInputSchema,
    outputSchema: StripeCheckoutOutputSchema,
  },
  async ({ userId, userEmail, companyId, plan }) => {
    try {
        const customerId = await getOrCreateStripeCustomer(userId, userEmail, companyId);

        const priceId = plan === 'monthly' 
            ? process.env.STRIPE_PRICE_MONTHLY
            : process.env.STRIPE_PRICE_YEARLY;

        if (!priceId) {
            throw new Error(`Price ID for ${plan} plan is not configured.`);
        }
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/cancel`,
            subscription_data: {
                metadata: {
                    firebaseCompanyId: companyId,
                }
            }
        });

        return { sessionId: session.id, url: session.url };

    } catch (e: any) {
        console.error("Stripe Checkout Flow Error:", e);
        return { error: e.message };
    }
  }
);

```
- workspace/src/ai/genkit.ts:
```ts

'use server';

import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
  logSinks: [],
  enableTracing: true,
});

```
- workspace/src/app/actions.ts:
```ts

'use server';

import { sendPasswordResetEmailFlow } from '@/ai/flows/send-password-reset-flow';
import { sendDocumentFlow } from '@/ai/flows/send-document-flow';
import { z } from 'zod';
import { SendDocumentSchema } from '@/ai/flows/send-document-flow';

export async function sendPasswordReset(email: string) {
  const result = await sendPasswordResetEmailFlow({ email });
  return result;
}

export async function sendDocumentByEmail(input: z.infer<typeof SendDocumentSchema>) {
    return await sendDocumentFlow(input);
}

```
- workspace/src/app/page.tsx:
```tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  FileText, FilePlus, Shield,
  LayoutDashboard, Edit, Bot, Share2, Palette, ArrowRight, XCircle, Clock, AlertCircle, CheckCircle, Search, FileClock
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { StackedCarousel } from '@/components/templates/stacked-carousel';

const AIChatbot = dynamic(() => import('@/components/ai-chatbot').then(mod => mod.AIChatbot), { ssr: false });


const tools = [
  {
    href: '/create-invoice',
    label: 'Invoice',
    icon: <FileText className="h-10 w-10 text-primary" />,
  },
  {
    href: '/create-estimate',
    label: 'Estimate',
    icon: <FilePlus className="h-10 w-10 text-primary" />,
  },
  {
    href: '/create-quote',
    label: 'Quote',
    icon: <FileText className="h-10 w-10 text-primary" />,
  },
  {
    href: '/create-insurance',
    label: 'Insurance',
    icon: <Shield className="h-10 w-10 text-primary" />,
  },
];

const homePageFeatures = [
    {
        icon: <Edit className="h-8 w-8 text-primary" />,
        name: 'Live Preview',
        description: 'See your changes in real-time as you build your document, ensuring a perfect result.',
    },
    {
        icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
        name: 'Cloud Dashboard',
        description: 'Securely access and manage all your documents from anywhere.',
    },
    {
        icon: <Share2 className="h-8 w-8 text-primary" />,
        name: 'Share & Collaborate',
        description: 'Email documents directly to clients or share public links for online viewing and acceptance.',
    },
    {
        icon: <Palette className="h-8 w-8 text-primary" />,
        name: 'Deep Customization',
        description: 'Personalize documents with your logo, brand colors, and professional templates.',
    },
    {
        icon: <Bot className="h-8 w-8 text-primary" />,
        name: 'AI-Powered Workflow',
        description: 'Leverage Genkit AI for intelligent features like automated PDF generation for emails.',
    }
];

const problems = [
  { text: "Manual, repetitive invoicing takes hours", icon: <Clock className="h-5 w-5 text-destructive" /> },
  { text: "Inconsistent and unprofessional document branding", icon: <AlertCircle className="h-5 w-5 text-destructive" /> },
  { text: "No central place to track document history", icon: <Search className="h-5 w-5 text-destructive" /> },
  { text: "Client confusion from unclear line items", icon: <XCircle className="h-5 w-5 text-destructive" /> },
];

const solutions = [
  { text: "Automated creation with reusable templates", icon: <CheckCircle className="h-5 w-5 text-primary" /> },
  { text: "Deep customization for professional branding", icon: <CheckCircle className="h-5 w-5 text-primary" /> },
  { text: "A full, versioned audit trail for every document", icon: <FileClock className="h-5 w-5 text-primary" /> },
  { text: "Clear, itemized billing for faster payments", icon: <CheckCircle className="h-5 w-5 text-primary" /> },
];

const testimonials = [
  {
    quote: "InvoiceCraft has revolutionized how I handle my billing. I'm saving hours every week and getting paid faster than ever.",
    name: 'Jane Doe',
    role: 'Freelance Designer',
    avatar: 'https://picsum.photos/seed/woman1/100/100'
  },
  {
    quote: "The templates are stunning and so easy to customize. My clients always comment on how professional my invoices look.",
    name: 'John Smith',
    role: 'Small Business Owner',
    avatar: 'https://picsum.photos/seed/man1/100/100'
  },
  {
    quote: "I love the dashboard feature. Seeing all my documents in one place and tracking their status is a game-changer for my freelance business.",
    name: 'Emily White',
    role: 'Finance Manager',
    avatar: 'https://picsum.photos/seed/woman2/100/100'
  },
   {
    quote: "The best invoicing tool I've used. Simple, fast, and the AI features are surprisingly helpful.",
    name: 'Michael Brown',
    role: 'Tech Consultant',
    avatar: 'https://picsum.photos/seed/man2/100/100'
  },
  {
    quote: "As a contractor, I need to create estimates on the go. InvoiceCraft's mobile interface is fantastic for that.",
    name: 'David Wilson',
    role: 'General Contractor',
    avatar: 'https://picsum.photos/seed/man3/100/100'
  },
  {
    quote: "The ability to create professional insurance documents has been a huge plus for my agency.",
    name: 'Sarah Johnson',
    role: 'Insurance Agent',
    avatar: 'https://picsum.photos/seed/woman3/100/100'
  },
];


export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [[page, direction], setPage] = useState([0, 0]);
  const { theme } = useTheme();
  
  const testimonialsPerPage = 3;
  const numPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };
  
  const nextTestimonials = () => {
    paginate(1);
  };

  const prevTestimonials = () => {
    paginate(-1);
  };
  
  const testimonialIndex = ((page % numPages) + numPages) % numPages;

  const variants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? -180 : 180,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        rotateY: { duration: 0.5 },
        opacity: { duration: 0.2, delay: 0.15 },
        scale: { duration: 0.5 }
      }
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? -180 : 180,
      opacity: 0,
      scale: 0.8,
      transition: {
        rotateY: { duration: 0.5 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.5 }
      }
    })
  };


  useEffect(() => {
    setMounted(true);
  }, []);

  const heroImageSrc = '/home/invocie.png';
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <section className="relative w-full py-20 overflow-hidden md:py-24 lg:py-32">
           <div
            aria-hidden="true"
            className="absolute inset-0 z-0"
          >
            <svg className="absolute -right-40 top-0 w-[150%] h-[150%] sm:w-full sm:h-full" viewBox="0 0 1440 892" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
              <path d="M1440 892V0H0V892H1440Z" className="fill-background"></path>
              <path d="M1665 829C1665 829 1320.5 1013 1075.5 829C830.5 645 915 214.5 649.5 214.5C384 214.5 319 481 107.5 481C-104 481 -178.5 233 -178.5 233" className="stroke-primary/10" strokeWidth="2"></path>
              <path d="M1665 754C1665 754 1320.5 938 1075.5 754C830.5 570 864.967 167.319 630.5 162.5C396.033 157.681 319 481 107.5 481C-104 481 -178.5 233 -178.5 233" className="stroke-primary/20" strokeWidth="2"></path>
            </svg>
          </div>
          <div className="container px-4 mx-auto md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div 
                className="max-w-xl text-center lg:text-left mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <motion.p 
                  className="mb-2 text-sm font-bold tracking-wider uppercase text-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome to InvoiceCraft
                </motion.p>
                <motion.h1 
                  className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl font-headline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Let's Control Your Business With{' '}
                  <span className="relative inline-block">
                    InvoiceCraft
                     <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 240 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 8C52.0019 3.66667 157.005 -2.00001 238 4" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </span>
                </motion.h1>
                <motion.p 
                  className="mt-6 text-base text-muted-foreground md:text-lg"
                   initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  We develop beautiful and functional documents for desktop, tablet,
                  and mobile.
                </motion.p>
                <motion.div 
                  className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row lg:justify-start"
                   initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild size="lg" className="w-full sm:w-auto">
                          <Link href="/dashboard">Get Started</Link>
                      </Button>
                   </motion.div>
                </motion.div>
              </motion.div>
              <div className="relative w-full h-80 lg:h-auto lg:aspect-[4/3]">
                <Image
                    src={heroImageSrc}
                    alt="Illustration of a person working on a laptop"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    className="object-contain"
                    data-ai-hint="workspace illustration"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-primary/5 rounded-3xl">
            <div className="container px-4 mx-auto md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline">A Tool for Every Need</h2>
                    <p className="mt-4 text-muted-foreground">Whether you're billing a client, estimating a project, or quoting a price, we have you covered.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {tools.map((tool) => (
                        <Link href={tool.href} key={tool.href} className="group">
                            <motion.div whileHover={{ y: -8, scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
                                <div className="bg-card/50 backdrop-blur-sm shadow-lg group-hover:shadow-primary/20 transition-all duration-300 rounded-xl p-6 flex flex-col items-center text-center gap-4 h-full">
                                    {React.cloneElement(tool.icon, { className: "h-10 w-10 text-primary" })}
                                    <p className="font-semibold text-lg">{tool.label}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
        
        <section className="py-20 md:py-28 text-foreground">
             <div className="container px-4 mx-auto md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        className="max-w-md"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-headline">Features That Power Your Business</h2>
                        <p className="mt-4 text-muted-foreground">
                            InvoiceCraft is packed with powerful, intuitive features designed to save you time, make you look professional, and help you get paid faster.
                        </p>
                        <Button asChild size="lg" className="mt-8">
                            <Link href="/features">
                                Explore All Features <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {homePageFeatures.map((feature, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <div className="border bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all duration-300 h-full p-6 flex flex-col rounded-xl">
                                    {React.cloneElement(feature.icon, { className: "h-8 w-8 text-primary" })}
                                    <h3 className="text-xl font-semibold mt-4 mb-2">{feature.name}</h3>
                                    <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>

        <section className="py-20 md:py-28">
            <div className="container px-4 mx-auto md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline">Tired of Invoicing Headaches? We've Got the Solution.</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Problems Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className="h-full bg-destructive/5 border-destructive/20 border shadow-lg p-8 rounded-xl">
                            <h3 className="text-2xl font-bold font-headline mb-6 text-destructive/30">The Problems</h3>
                            <ul className="space-y-4">
                                {problems.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        {item.icon}
                                        <span className="text-muted-foreground pt-0.5">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6">
                                <Badge variant="destructive" className="bg-destructive/10 text-destructive-foreground hover:bg-destructive/20">Before InvoiceCraft</Badge>
                            </div>
                        </div>
                    </motion.div>

                    {/* Solutions Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className="h-full bg-primary/5 border-primary/20 border shadow-lg p-8 rounded-xl">
                            <h3 className="text-2xl font-bold font-headline mb-6 text-primary">The Solutions</h3>
                            <ul className="space-y-4">
                                {solutions.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        {item.icon}
                                        <span className="text-muted-foreground pt-0.5">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6">
                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">With InvoiceCraft</Badge>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>

        <section className="relative overflow-hidden bg-background py-20 md:py-28 text-foreground">
          <div className="absolute inset-0 z-0 opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.2"/>
                      </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10"></div>
          
          <div className="container relative z-20 px-4 mx-auto md:px-6">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="max-w-lg">
                    <p className="text-sm font-bold tracking-wider uppercase text-primary">Discipline Will Take You Places</p>
                    <h2 className="text-4xl md:text-5xl font-bold font-headline mt-2">Design Smarter, <br/>Not Harder.</h2>
                    <p className="mt-4 text-muted-foreground">Stop wrestling with generic templates. InvoiceCraft gives you the power to create beautiful, branded documents that reflect the quality of your work. Impress clients and get paid faster.</p>
                     <div className="mt-8 flex gap-4">
                        <Button size="lg" asChild>
                            <Link href="/templates">Browse Templates</Link>
                        </Button>
                         <Button size="lg" variant="outline">
                            Learn More
                        </Button>
                    </div>
                </div>
                 <StackedCarousel />
             </div>
          </div>
        </section>

        <AIChatbot />
      </main>
    </div>
  );
}

```