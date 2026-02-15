
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

export const HvacDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.hvac) return null;
    const { hvac } = invoice;
    const hasDetails = Object.values(hvac).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.hvacSpecifications || 'HVAC Specifications'}</p>
            </section>
        );
    }

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.hvacSpecifications || 'HVAC Specifications'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {hvac.unitType && <p><span className="font-semibold text-gray-600">{t.unitType || 'Unit Type'}:</span> {hvac.unitType}</p>}
                {hvac.modelNumber && <p><span className="font-semibold text-gray-600">{t.modelNo || 'Model #'}:</span> {hvac.modelNumber}</p>}
                {hvac.refrigerantType && <p><span className="font-semibold text-gray-600">{t.refrigerant || 'Refrigerant'}:</span> {hvac.refrigerantType}</p>}
                {hvac.maintenanceFee && <p><span className="font-semibold text-gray-600">{t.maintenanceFee || 'Maintenance Fee'}:</span> ${hvac.maintenanceFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};


// Base Template inspired by user image
export const HVACTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-8 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: `9pt`, minHeight: '1056px', color: textColor, backgroundColor: props.backgroundColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div className="flex items-center gap-4">
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={50} height={50} className="object-contain" />}
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs whitespace-pre-line">{business.address}</p>
                        <p className="text-xs">{business.email} | {business.phone}</p>
                        {business.website && <p className="text-xs">{business.website}</p>}
                        {business.licenseNumber && <p className="text-xs">Lic #: {business.licenseNumber}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-700">{docTitle}</h2>
                    <p className="text-xs">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 my-6 text-xs border-b pb-6">
                <div>
                    <p className="font-bold text-gray-500 mb-1">{t.clientInformation || 'CLIENT INFORMATION'}</p>
                    <p className="font-semibold">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold text-gray-500">Ship To:</span><br />{client.shippingAddress}</p>}
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                    {invoice.poNumber && <p className="mt-2"><span className="font-bold text-gray-500">PO Number:</span><br />{invoice.poNumber}</p>}
                    <p className="font-bold text-gray-500 mt-2 mb-1">{t.dateIssued || 'Date Issued'}</p>
                    <p>{safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p className="font-bold text-gray-500 mt-2 mb-1">{t.dueDate || 'Due Date'}</p>
                    <p>{safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                </div>
            </section>

            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: `${accentColor}20` }}>
                            <th className="p-2 font-bold w-3/5">{t.description || 'DESCRIPTION'}</th>
                            <th className="p-2 font-bold text-center">{t.quantity || 'QUANTITY'}</th>
                            <th className="p-2 font-bold text-right">{t.unitCost || 'UNIT COST'}</th>
                            <th className="p-2 font-bold text-right">{t.subtotal || 'SUB-TOTAL'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="p-2 align-top">
                                    <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                </td>
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-6 flex justify-between items-end">
                    <div className="w-1/2 text-xs">
                        <p className="font-bold mb-1" style={{ color: accentColor }}>{t.termsAndConditions || 'TERMS & CONDITION'}:</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                        <div className="flex gap-16 mt-8">
                            <SignatureDisplay signature={business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                        </div>
                    </div>
                    <div className="w-2/5">
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between p-1"><span>{t.subtotal || 'Sub-total'}:</span><span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                            {discountAmount > 0 && <div className="flex justify-between p-1"><span>{t.discount || 'Discount'}:</span><span className="font-medium text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                            {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-1"><span>{t.shipping || 'Shipping'}:</span><span className="font-medium">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between p-1"><span>{t.tax || 'Tax'} ({invoice.summary.taxPercentage}%):</span><span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between p-2 mt-1 border-t-2 border-gray-400 font-bold" style={{ color: accentColor }}><span className="text-base">{t.totalCost || 'TOTAL COST'}:</span><span className="text-base">{currencySymbol}{total.toFixed(2)}</span></div>
                            {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between p-1 font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                            <div className="flex justify-between p-1 mt-1 bg-gray-100 font-bold"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 2: Coolant
export const HVACTemplate2: React.FC<PageProps> = (props) => {
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
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500">{t.client || 'Client'}:</p>
                    <p className="font-semibold">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone} | {client.email}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{t.invoiceNo || 'Invoice #'}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{t.date || 'Date'}:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold">{t.dueDate || 'Due Date'}:</span> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>

            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="py-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
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
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between">{t.shipping || 'Shipping/Extra'}: <span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
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

// Template 3: Clean & Grid-based
export const HVACTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = 'Invoice';

    return (
        <div className={`p-10 font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Roboto, sans-serif', fontSize: `9pt`, minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-4xl font-light tracking-wide">{business.name}</h1>
                    <div className="text-xs whitespace-pre-line mt-1">
                        <p>{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{docTitle.toUpperCase()}</h2>
                    <p className="text-xs text-gray-500">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="mb-8 p-4 border rounded-md grid grid-cols-3 gap-4 text-xs">
                <div><p className="font-bold">{(t.from || 'From')}:</p><p className="font-bold whitespace-pre-line">{business.name}<br />{business.address}</p></div>
                <div><p className="font-bold">{(t.to || 'To')}:</p><p className="whitespace-pre-line">{client.name}<br />{client.companyName && <>{client.companyName}<br /></>}{client.address}<br />{client.phone}<br />{client.email}</p></div>
                <div><p className="font-bold">{(t.details || 'Details')}:</p><p>{t.date || 'Date'}: {safeFormat(invoice.invoiceDate, 'MM-dd-yyyy')}<br />Due: {safeFormat(invoice.dueDate, 'MM-dd-yyyy')}<br />{invoice.poNumber && `PO: ${invoice.poNumber}`}</p></div>
            </section>

            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 font-bold w-1/2">{(t.serviceDescription || 'SERVICE DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'QUANTITY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 align-top">
                                    <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                </td>
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8 flex justify-between items-start">
                    <div className="w-1/2 text-xs" style={{ color: textColor }}>
                        <p className="font-bold mb-1">{(t.terms || 'TERMS')}</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                        {business.ownerSignature && (
                            <div className="mt-8">
                                <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                            </div>
                        )}
                    </div>
                    <div className="w-1/3 text-right text-sm">
                        <p className="py-1 flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="py-1 flex justify-between text-red-500"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="py-1 flex justify-between"><span>{(t.shipping || 'Shipping')}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="py-1 flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="py-2 mt-2 flex justify-between border-t-2 border-black font-bold text-base"><span>{(t.total || 'TOTAL')}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="py-1 flex justify-between font-bold text-green-600"><span>Amount Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="py-2 mt-1 flex justify-between bg-gray-200 font-bold text-base"><span>{(t.balanceDue || 'BALANCE DUE')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

export const HVACTemplate4: React.FC<PageProps> = (props) => <HVACTemplate1 {...props} />;
export const HVACTemplate5: React.FC<PageProps> = (props) => <HVACTemplate2 {...props} />;
