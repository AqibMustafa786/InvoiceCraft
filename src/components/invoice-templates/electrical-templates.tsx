
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

export const ElectricalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.electrical) return null;
    const { electrical } = invoice;
    const hasDetails = Object.values(electrical).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.electricalServiceDetails || 'Electrical Service Details'}</p>
            </section>
        );
    }

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.electricalServiceDetails || 'Electrical Service Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {electrical.serviceType && <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {electrical.serviceType}</p>}
                {electrical.voltage && <p><span className="font-semibold text-gray-600">{t.voltage || 'Voltage'}:</span> {electrical.voltage}</p>}
                {electrical.fixtureDevice && <p><span className="font-semibold text-gray-600">{t.fixtureDevice || 'Fixture/Device'}:</span> {electrical.fixtureDevice}</p>}
                {electrical.permitCost && <p><span className="font-semibold text-gray-600">{t.permitCost || 'Permit Cost'}:</span> ${electrical.permitCost.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Direct Interpretation
export const ElectricalTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', minHeight: '1056px', color: textColor, backgroundColor: props.backgroundColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <div className="text-xs space-y-0.5 mt-1">
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone}</p>
                        <p>{business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold" style={{ color: accentColor }}>{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-8 text-xs">
                <div>
                    <p className="font-bold" style={{color: accentColor}}>{t.billTo || 'Bill To'}</p>
                    <p className="font-semibold">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                </div>
                <div className="text-right space-y-1">
                    <p><span className="font-bold" style={{color: accentColor}}>{t.invoiceNo || 'Invoice #'}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold" style={{color: accentColor}}>{t.dateIssued || 'Date Issued'}:</span> {safeFormat(invoice.invoiceDate, 'dd-MM-yyyy')}</p>
                    <p><span className="font-bold" style={{color: accentColor}}>{t.dueDate || 'Due Date'}:</span> {safeFormat(invoice.dueDate, 'dd-MM-yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold" style={{color: accentColor}}>PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t}/>

            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead style={{ backgroundColor: accentColor, color: 'white' }}>
                        <tr>
                            <th className="p-2 font-bold w-[10%] text-center">{t.quantity || 'QTY'}</th>
                            <th className="p-2 font-bold w-[50%]">{t.description || 'Description'}</th>
                            <th className="p-2 font-bold text-right">{t.unitPrice || 'Unit Price'}</th>
                            <th className="p-2 font-bold text-right">{t.amount || 'Amount'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top">
                                    <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                </td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-6">
                    <div className="flex justify-end">
                        <div className="w-2/5 text-sm space-y-1">
                             <div className="flex justify-between p-1"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                             {discountAmount > 0 && <div className="flex justify-between p-1 text-red-500"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                             {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-1"><span>{t.shipping || 'Shipping/Extra'}</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                             {taxAmount > 0 && <div className="flex justify-between p-1"><span>{t.tax || 'Tax'} ({invoice.summary.taxPercentage}%)</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>}
                            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2" style={{borderColor: accentColor}}><span>{t.total || 'Total'} ({currencySymbol})</span><span style={{color: accentColor}}>{currencySymbol}{total.toFixed(2)}</span></div>
                             {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                             <div className="flex justify-between p-1 mt-1 bg-gray-100 font-bold"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div className="text-xs mt-8">
                        <p className="font-bold" style={{color: accentColor}}>{t.termsAndConditions || 'Terms and Conditions'}</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Header Centered
export const ElectricalTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', color: textColor, backgroundColor: props.backgroundColor }}>
            <header className="text-center mb-8">
                {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={80} className="object-contain mx-auto mb-2"/>}
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-xs">{business.address} • {business.phone} • {business.email}</p>
                {business.website && <p className="text-xs">{business.website}</p>}
                {business.licenseNumber && <p className="text-xs">Lic #: {business.licenseNumber}</p>}
                {business.taxId && <p className="text-xs">Tax ID: {business.taxId}</p>}
                <div className="mt-4">
                    <h2 className="text-3xl font-bold" style={{ color: accentColor }}>{docTitle.toUpperCase()}</h2>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs">
                <div>
                    <p className="font-bold">{t.billTo || 'Bill To'}:</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                </div>
                <div className="text-center">
                    <p className="font-bold">{t.invoiceNo || 'Invoice #'}:</p>
                    <p>{invoice.invoiceNumber}</p>
                    {invoice.poNumber && <p className="font-bold mt-2">PO #:</p>}
                    {invoice.poNumber && <p>{invoice.poNumber}</p>}
                </div>
                <div className="text-right">
                    <p className="font-bold">{t.date || 'Date'}:</p>
                    <p>{safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                    <p className="font-bold mt-2">{t.dueDate || 'Due Date'}:</p>
                    <p>{safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p>
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b-2" style={{borderColor: accentColor}}>
                            <th className="py-2 font-bold w-[60%]">{t.description || 'DESCRIPTION'}</th>
                            <th className="py-2 font-bold text-center">{t.quantity || 'QTY'}</th>
                            <th className="py-2 font-bold text-right">{t.rate || 'RATE'}</th>
                            <th className="py-2 font-bold text-right">{t.total || 'TOTAL'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 align-top">
                                    <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                </td>
                                <td className="py-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8 flex justify-between items-end">
                    <div className="w-1/2 text-xs">
                        <p className="font-bold mb-1">{t.termsAndConditions || 'Terms'}:</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                         <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                    </div>
                    <div className="w-1/3 text-sm">
                        <p className="flex justify-between py-1"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between py-1 text-red-500"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{t.shipping || 'Shipping/Extra'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between py-1"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2 border-black"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold bg-gray-100 p-2 mt-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Minimalist
export const ElectricalTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = 'Invoice';

    return (
        <div className={`p-12 bg-white font-['Garamond',_serif] text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{minHeight: '1056px', color: textColor, backgroundColor: props.backgroundColor }}>
            <header className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-light tracking-wider">{business.name}</h1>
                    <div className="text-xs mt-1">
                        <p>{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light tracking-wider">{docTitle.toUpperCase()}</h2>
                </div>
            </header>

            <section className="flex justify-between mb-10 text-xs">
                 <div>
                    <p className="font-bold mb-1">{t.preparedFor || 'Prepared For'}:</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                </div>
                 <div className="text-right">
                    <p><span className="font-bold">{t.invoiceNo || 'Invoice #'}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{t.date || 'Date'}:</span> {safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p>
                    <p><span className="font-bold">{t.dueDate || 'Due Date'}:</span> {safeFormat(invoice.dueDate, 'MMM dd, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t}/>

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-semibold w-1/2 border-b-2 border-gray-300">{(t.item || 'ITEM').toUpperCase()}</th>
                            <th className="p-2 font-semibold text-center border-b-2 border-gray-300">{(t.quantity || 'QUANTITY').toUpperCase()}</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">{(t.price || 'PRICE').toUpperCase()}</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">{(t.amount || 'AMOUNT').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="p-2 border-b border-gray-200">
                                    <p className="font-medium whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                </td>
                                <td className="p-2 border-b border-gray-200 text-center">{item.quantity}</td>
                                <td className="p-2 border-b border-gray-200 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 border-b border-gray-200 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <table className="w-1/3 text-xs">
                             <tbody>
                                <tr><td className="py-1 text-gray-500">{t.subtotal || 'Subtotal'}</td><td className="text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                {discountAmount > 0 && <tr><td className="py-1 text-gray-500">{t.discount || 'Discount'}</td><td className="text-right text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</td></tr>}
                                {invoice.summary.shippingCost > 0 && <tr><td className="py-1 text-gray-500">{t.shipping || 'Shipping/Extra'}</td><td className="text-right">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</td></tr>}
                                <tr><td className="py-1 text-gray-500">{t.salesTax || 'Sales Tax'}</td><td className="text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">{t.total || 'TOTAL'}</td><td className="pt-2 text-right">{currencySymbol}{total.toFixed(2)}</td></tr>
                                {(invoice.amountPaid || 0) > 0 && <tr className="font-bold text-green-600"><td>{t.amountPaid || 'Amount Paid'}</td><td className="text-right">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td></tr>}
                                <tr className="font-bold bg-gray-100"><td className="p-1">{t.balanceDue || 'Balance Due'}</td><td className="p-1 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">{t.termsAndConditions || 'Terms & Conditions'}:</p>
                        <p className="text-gray-500 whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Side Accent
export const ElectricalTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = 'Invoice';

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <div className="w-10" style={{ backgroundColor: accentColor }}></div>
            <div className="p-10 flex-grow flex flex-col">
                <header className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <div className="text-xs whitespace-pre-line mt-1">
                            <p>{business.address}</p>
                            <p>{business.phone} | {business.email}</p>
                            {business.website && <p>{business.website}</p>}
                            {business.licenseNumber && <p>Lic: {business.licenseNumber}</p>}
                            {business.taxId && <p>Tax ID: {business.taxId}</p>}
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-400">{docTitle.toUpperCase()}</h2>
                        <p className="text-xs">{invoice.invoiceNumber}</p>
                    </div>
                </header>
                 <section className="grid grid-cols-2 gap-4 mb-8 text-xs">
                    <div>
                        <p className="font-bold">{t.client || 'CLIENT'}:</p>
                        <p>{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p>{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    </div>
                    <div className="text-right">
                        <p className="font-bold">{t.date || 'DATE'}:</p>
                        <p>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                        <p className="font-bold mt-2">{t.dueDate || 'DUE DATE'}:</p>
                        <p>{safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                        {invoice.poNumber && <p className="font-bold mt-2">PO #:</p>}
                        {invoice.poNumber && <p>{invoice.poNumber}</p>}
                    </div>
                </section>

                <CategorySpecificDetails invoice={invoice} t={t}/>

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-2 font-bold w-3/5">{t.service || 'SERVICE'}</th>
                                <th className="p-2 font-bold text-center">{t.quantity || 'QTY'}</th>
                                <th className="p-2 font-bold text-right">{t.rate || 'RATE'}</th>
                                <th className="p-2 font-bold text-right">{t.total || 'TOTAL'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="p-2 align-top">
                                        <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                        {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                    </td>
                                    <td className="p-2 align-top text-center">{item.quantity}</td>
                                    <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-2 align-top text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8">
                        <div className="flex justify-end">
                            <div className="w-2/5 text-sm space-y-2">
                                <div className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                                {discountAmount > 0 && <div className="flex justify-between text-red-500"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                                {invoice.summary.shippingCost > 0 && <div className="flex justify-between"><span>{t.shipping || 'Shipping/Extra'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                                <div className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                                {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                                <div className="flex justify-between font-bold bg-gray-100 p-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                            </div>
                        </div>
                        <div className="text-xs mt-8">
                            <p className="font-bold">{t.termsAndConditions || 'Terms & Conditions'}:</p>
                            <p className="text-gray-500 whitespace-pre-line">{invoice.paymentInstructions}</p>
                        </div>
                         <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Grid Layout
export const ElectricalTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = 'Invoice';

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto',_sans-serif] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="grid grid-cols-2 gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold">{business.name}</h1>
                    <div className="text-xs mt-1">
                        <p>{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                 <div className="text-right">
                     <p className="text-3xl font-bold">{docTitle.toUpperCase()}</p>
                     <p className="text-sm">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="mb-8 p-4 bg-white shadow-sm rounded-md text-xs">
                 <p className="font-bold text-gray-500 mb-2">BILLED TO: {client.name}</p>
                 <p className="font-semibold">{client.address}</p>
                 {client.companyName && <p>{client.companyName}</p>}
                 <p>{client.phone} | {client.email}</p>
                 {client.shippingAddress && <p className="mt-2"><span className="font-bold text-gray-500">SHIP TO:</span> {client.shippingAddress}</p>}
            </section>
            
            <section className="mb-4 text-xs grid grid-cols-3 gap-2">
                <p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                <p><strong>Due Date:</strong> {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                {invoice.poNumber && <p><strong>PO #:</strong> {invoice.poNumber}</p>}
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow bg-white p-4 rounded-md shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-[60%]">Description of Work</th>
                            <th className="py-2 font-bold text-center">Qty</th>
                            <th className="py-2 font-bold text-right">Cost</th>
                            <th className="py-2 font-bold text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 align-top">
                                    <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                </td>
                                <td className="py-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8 flex justify-between items-end">
                    <div className="text-xs w-1/2">
                        <p className="font-bold">Terms & Conditions:</p>
                        <p className="text-gray-500 whitespace-pre-line">{invoice.paymentInstructions}</p>
                         <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                    </div>
                    <div className="w-1/3 text-sm space-y-1">
                        <p className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between"><span>Discount</span><span className="text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>Shipping/Extra</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between p-2 mt-2 border-t-2 border-black font-bold text-lg"><span>Total</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between p-2 text-green-600 font-bold"><span>Amount Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between bg-gray-200 p-2 font-bold text-lg"><span>Balance Due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

export const ElectricalTemplate6: React.FC<PageProps> = (props) => <ElectricalTemplate1 {...props} />;
export const ElectricalTemplate7: React.FC<PageProps> = (props) => <ElectricalTemplate2 {...props} />;
export const ElectricalTemplate8: React.FC<PageProps> = (props) => <ElectricalTemplate3 {...props} />;
export const ElectricalTemplate9: React.FC<PageProps> = (props) => <ElectricalTemplate4 {...props} />;
export const ElectricalTemplate10: React.FC<PageProps> = (props) => <ElectricalTemplate5 {...props} />;

    

    

