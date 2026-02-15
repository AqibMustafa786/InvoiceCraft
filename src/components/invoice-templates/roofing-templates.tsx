
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

export const RoofingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.roofing) return null;
    const { roofing } = invoice;
    const hasDetails = Object.values(roofing).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.roofingSpecifications || 'Roofing Specifications'}</p>
            </section>
        );
    }

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.roofingSpecifications || 'Roofing Specifications'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1">
                {roofing.roofType && <p><span className="text-gray-500">{(t.roofMaterial || 'Roof Material')}:</span> <span className="font-semibold">{roofing.roofType}</span></p>}
                {roofing.squareFootage && <p><span className="text-gray-500">{(t.roofSizeSqFt || 'Roof Size (sq ft)')}:</span> <span className="font-semibold">{roofing.squareFootage}</span></p>}
                {roofing.pitch && <p><span className="text-gray-500">{(t.roofPitch || 'Roof Pitch')}:</span> <span className="font-semibold">{roofing.pitch}</span></p>}
                {roofing.tearOffRequired && <p><span className="text-gray-500">{(t.layersToRemove || 'Layers to Remove')}:</span> <span className="font-semibold">{roofing.tearOffRequired ? 'Yes' : 'No'}</span></p>}
                {roofing.underlaymentType && <p><span className="text-gray-500">{(t.underlayment || 'Underlayment')}:</span> <span className="font-semibold">{roofing.underlaymentType}</span></p>}
                {roofing.dumpsterFee && <p><span className="text-gray-500">{(t.disposalFee || 'Disposal Fee')}:</span> <span className="font-semibold">${roofing.dumpsterFee.toFixed(2)}</span></p>}
            </div>
        </section>
    );
};


// Template 1: Gable (Now fully dynamic)
export const RoofingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}pt`, minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
                    <div className="text-xs space-y-0.5" style={{ color: textColor || '#6B7280' }}>
                        <p className="whitespace-pre-line">{business.address}</p>
                        {business.phone && <p>{business.phone}</p>}
                        {business.email && <p>{business.email}</p>}
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>{t.license || 'Lic #'}: {business.licenseNumber}</p>}
                        {business.taxId && <p>{t.taxId || 'Tax ID'}: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-8 text-sm">
                <div>
                    <p className="font-bold">{((t.billTo as string) || 'BILLED TO').toUpperCase()}</p>
                    <p className="font-bold mt-1" style={{ color: accentColor }}>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line mt-1">{client.address}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br />{client.shippingAddress}</p>}
                    {client.phone && <p>{client.phone}</p>}
                    {client.email && <p>{client.email}</p>}
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{t.invoiceNo || 'Invoice #'}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{(t.date || 'Date')}:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold">{(t.dueDate || 'Due Date')}:</span> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>

            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-sm">
                    <thead className="border-b" style={{ borderColor: accentColor }}>
                        <tr>
                            <th className="p-2 pb-1 font-bold w-1/2">{(t.description || 'DESCRIPTION')}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.quantity || 'QTY')}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.price || 'PRICE')}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.total || 'TOTAL')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="p-2 align-top">
                                    <p className="font-medium whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line" style={{ wordBreak: 'break-all' }}>{item.description}</p>}
                                </td>
                                <td className="p-2 align-top text-right">{item.quantity}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <div className="w-2/5 text-sm">
                            <div className="flex justify-between py-1"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                            {discountAmount > 0 && <div className="flex justify-between py-1 text-red-600"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                            {invoice.summary.shippingCost > 0 && <div className="flex justify-between py-1"><span>{(t.shipping || 'Shipping/Extra')}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between py-1"><span>{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%):</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold py-2 mt-2 border-t-2 border-gray-800" style={{ color: accentColor }}><span className="text-lg">{(t.total || 'Total')}:</span><span className="text-lg">{currencySymbol}{total.toFixed(2)}</span></div>
                            {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between py-1 text-green-600"><span>{(t.amountPaid || 'Amount Paid')}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                            <div className="flex justify-between font-bold text-lg mt-1 p-2 bg-gray-100"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div className="mt-8 text-xs">
                        <p className="font-bold mb-1">{(t.termsAndConditions || 'Terms & Conditions')}</p>
                        <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{invoice.paymentInstructions}</p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <SignatureDisplay signature={business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Light and Professional
export const RoofingTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <div className="text-xs text-gray-500">
                        <p>{business.address}</p>
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
                    <p className="font-bold text-gray-500">{t.customer || 'Customer'}:</p>
                    <p className="font-semibold">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p>{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br />{client.shippingAddress}</p>}
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

// Template 3: Blue-tinted Grid
export const RoofingTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="object-contain" />}
                    <h1 className="text-4xl font-extrabold mt-2" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                    <p className="text-xs">{business.phone} | {business.email}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs p-4 bg-white rounded-lg shadow-sm">
                <div><p className="font-bold text-gray-500">{t.client || 'Client'}:</p><p className="whitespace-pre-line">{client.name}<br />{client.companyName && <>{client.companyName}<br /></>}{client.address}</p></div>
                <div><p className="font-bold text-gray-500">{t.shipTo || 'Ship To'}:</p><p>{client.shippingAddress || client.address}</p></div>
                <div className="text-right"><p className="font-bold text-gray-500">{t.reference || 'Reference'}:</p><p># {invoice.invoiceNumber}<br />{t.date || 'Date'}: {safeFormat(invoice.invoiceDate, 'dd-MMM-yyyy')}<br />Due: {safeFormat(invoice.dueDate, 'dd-MMM-yyyy')}<br />{invoice.poNumber && `PO: ${invoice.poNumber}`}</p></div>
            </section>

            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow bg-white p-4 rounded-lg shadow-sm mt-4">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: `${accentColor}1A` }} className="border-b-2" style={{ borderColor: accentColor }}><th className="py-2 px-2 font-bold w-[50%]">{t.itemDescription || 'Item Description'}</th><th className="py-2 px-2 font-bold text-center">{t.quantity || 'Qty'}</th><th className="py-2 px-2 font-bold text-right">{t.price || 'Price'}</th><th className="py-2 px-2 font-bold text-right">{t.total || 'Total'}</th></tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 px-2 align-top"><p className="font-semibold whitespace-pre-line">{item.name}</p>{item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}</td>
                                <td className="py-2 px-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 px-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 px-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-6 flex justify-between items-end">
                    <div className="w-1/2 text-xs">
                        <p className="font-bold text-gray-500 mb-2">{t.termsAndConditions || 'Terms & Conditions'}</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                        <div className="flex gap-16 mt-8">
                            <SignatureDisplay signature={business.ownerSignature} label={"Owner Signature"} />
                        </div>
                    </div>
                    <div className="w-2/5 text-sm space-y-1">
                        <p className="flex justify-between p-1"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between p-1">{t.discount || 'Discount'}: <span className="text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between p-1">{t.shipping || 'Shipping/Extra'}: <span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between p-1"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-gray-300"><span>{t.totalInvoice || 'Total Invoice'}</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold p-1 text-green-600"><span>{t.amountPaid || 'Amount Paid'}</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold bg-gray-200 p-2 mt-1"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

export const RoofingTemplate4: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
export const RoofingTemplate5: React.FC<PageProps> = (props) => <RoofingTemplate2 {...props} />;

