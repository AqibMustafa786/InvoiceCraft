
'use client';

import React from 'react';
import type { Estimate, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';

interface TemplateProps {
    document: Estimate;
    pageItems: LineItem[];
    pageIndex: number;
    totalPages: number;
    style: React.CSSProperties;
    t: any;
}

const currencySymbols: { [key: string]: string } = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: '₨' };

const safeFormat = (date: Date | string | number | undefined | null, formatString: string) => {
    if (!date) return 'N/A';
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

export const TransportationDetails: React.FC<{ document: Estimate, t: any }> = ({ document, t }) => {
    if (!document.transportation) return null;
    const { transportation } = document;
    const hasDetails = Object.values(transportation).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.shipmentDetails || 'Shipment Details'}</p>
            </section>
        );
    }
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.shipmentDetails || 'Shipment Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {transportation.pickupLocation && <p><span className="font-semibold text-gray-600">{t.pickup || 'Pickup'}:</span> {transportation.pickupLocation}</p>}
                {transportation.dropoffLocation && <p><span className="font-semibold text-gray-600">{t.dropoff || 'Dropoff'}:</span> {transportation.dropoffLocation}</p>}
                {transportation.milesDriven && <p><span className="font-semibold text-gray-600">{t.miles || 'Miles'}:</span> {transportation.milesDriven}</p>}
                {transportation.ratePerMile && <p><span className="font-semibold text-gray-600">{t.ratePerMile || 'Rate/Mile'}:</span> ${transportation.ratePerMile.toFixed(2)}</p>}
                {transportation.weight && <p><span className="font-semibold text-gray-600">{t.weight || 'Weight'}:</span> {transportation.weight}</p>}
                {transportation.loadType && <p><span className="font-semibold text-gray-600">{t.loadType || 'Load Type'}:</span> {transportation.loadType}</p>}
                {transportation.fuelSurcharge && <p><span className="font-semibold text-gray-600">{t.fuelSurcharge || 'Fuel Surcharge'}:</span> ${transportation.fuelSurcharge.toFixed(2)}</p>}
                {transportation.tollCharges && <p><span className="font-semibold text-gray-600">{t.tolls || 'Tolls'}:</span> ${transportation.tollCharges.toFixed(2)}</p>}
                {transportation.detentionFee && <p><span className="font-semibold text-gray-600">{t.detention || 'Detention'}:</span> ${transportation.detentionFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

export const TransportationTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? t.quote || 'QUOTE' : t.estimate || 'ESTIMATE';

    return (
        <div className={`p-8 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <div className="text-xs mt-1 text-gray-600" style={{ color: textColor ? `${textColor}B3` : undefined }}>
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                <h2 className="text-4xl font-bold text-gray-400">{docTitle.toUpperCase()}</h2>
            </header>
            <section className="grid grid-cols-3 gap-4 text-xs mb-8">
                <div className="p-2 bg-gray-100">
                    <p className="font-bold">{t.to || 'To'}:</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                </div>
                <div className="p-2 bg-gray-100">
                    <p className="font-bold">{t.shipTo || 'Ship To'}:</p>
                    <p className="whitespace-pre-line">{document.client.shippingAddress || client.address}</p>
                </div>
                <div className="p-2 bg-gray-100 text-right">
                    <p><strong>#:</strong> {document.estimateNumber}</p>
                    <p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                    <p><strong>{t.validUntil || 'Valid Until'}:</strong> {safeFormat(document.validUntilDate, 'yyyy-MM-dd')}</p>
                    {document.referenceNumber && <p><strong>Ref #:</strong> {document.referenceNumber}</p>}
                </div>
            </section>
            <TransportationDetails document={document} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead style={{ backgroundColor: style.color, color: 'white' }}>
                        <tr>
                            <th className="p-2 font-bold w-[40%]">{t.description || 'Description'}</th>
                            <th className="p-2 font-bold text-center w-[15%]">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right w-[20%]">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right w-[25%]">{t.amount || 'Amount'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 align-top">
                                    <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-muted-foreground whitespace-pre-line">{item.description}</p>}
                                </td>
                                <td className="p-2 text-center align-top">{item.quantity}</td>
                                <td className="p-2 text-right align-top">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 text-right align-top">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-between items-start">
                        <div className="w-1/2 text-xs">
                            <p className="font-bold">{t.paymentInstructions || 'Payment Instructions / Notes'}:</p>
                            <p className="whitespace-pre-line text-muted-foreground">{document.termsAndConditions}</p>
                        </div>
                        <div className="w-1/2 flex justify-end text-right text-sm">
                            <div className="w-4/5">
                                <p className="flex justify-between py-1"><span className="text-gray-600">{t.totalCharges || 'Total Charges'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                                {summary.discount > 0 && <p className="flex justify-between py-1 text-red-500"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                                {summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{(t.shipping || 'Other Fees')}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                                <p className="flex justify-between py-1"><span className="text-gray-600">{(t.tax || 'Tax')}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                                <p className="flex justify-between font-bold text-2xl mt-2 pt-2 border-t-2">
                                    <span>{(t.totalDue || 'Total Due').toUpperCase()}:</span>
                                    <span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                        <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || 'Client Signature'} />
                    </div>
                </footer>
            )}
        </div>
    );
}

export const TransportationTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'ESTIMATE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-10 bg-gray-50 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-center mb-8 pb-4 border-b-2">
                <div>
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <div className="text-xs mt-1 text-gray-500">
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                    </div>
                </div>
                <h2 className="text-2xl font-light text-gray-500">{docTitle}</h2>
            </header>
            <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                <div><p><strong>{t.to || 'To'}:</strong> {client.name}</p><p>{client.companyName}</p><p className="whitespace-pre-line">{client.address}</p><p>{client.phone} | {client.email}</p>{document.client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br />{document.client.shippingAddress}</p>}</div>
                <div className="text-right"><p><strong>#:</strong> {document.estimateNumber}</p><p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p><p><strong>{t.validUntil || 'Valid Until'}:</strong> {safeFormat(document.validUntilDate, 'MMM dd, yyyy')}</p></div>
            </section>
            <TransportationDetails document={document} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 w-1/3 font-bold">{(t.item || 'Item').toUpperCase()}</th>
                            <th className="p-2 w-2/3 font-bold">{(t.description || 'Description').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'Qty')}</th>
                            <th className="p-2 font-bold text-right">{(t.unitPrice || 'Unit Price')}</th>
                            <th className="p-2 font-bold text-right">{t.total || 'TOTAL'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 font-semibold whitespace-pre-line">{item.name}</td>
                                <td className="p-2 text-xs text-muted-foreground whitespace-pre-line">{item.description}</td>
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3">
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between border-b pb-1"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold mt-2"><span>{t.total || 'Total'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                        <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || 'Client Signature'} />
                    </div>
                </footer>
            )}
        </div>
    );
};
export const TransportationTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? t.quote || 'QUOTE' : t.estimate || 'ESTIMATE';

    return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <div className="p-10">
                <header className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter">{business.name}</h1>
                        <div className="text-xs mt-2">
                            <p className="whitespace-pre-line">{business.address}</p>
                            <p>{business.phone} | {business.email}</p>
                            {business.website && <p>{business.website}</p>}
                            {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                            {business.taxId && <p>Tax ID: {business.taxId}</p>}
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold">{docTitle.toUpperCase()}</h2>
                        <p className="text-xs text-gray-500">#{document.estimateNumber}</p>
                    </div>
                </header>
                <section className="grid grid-cols-3 gap-4 text-xs mb-8">
                    <div>
                        <p className="font-bold text-gray-500">{t.to || 'To'}:</p>
                        <p>{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                    </div>
                    <div>
                        {client.shippingAddress && (
                            <>
                                <p className="font-bold text-gray-500">{t.shipTo || 'Ship To'}:</p>
                                <p className="whitespace-pre-line">{client.shippingAddress}</p>
                            </>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-500">{t.date || 'Date'}:</p><p>{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                        <p className="font-bold text-gray-500 mt-2">{t.validUntil || 'Valid Until'}:</p><p>{safeFormat(document.validUntilDate, 'yyyy-MM-dd')}</p>
                        {document.referenceNumber && <p className="mt-2"><span className="font-bold text-gray-500">Ref #:</span> {document.referenceNumber}</p>}
                    </div>
                </section>
                <TransportationDetails document={document} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b">
                                <th className="pb-2 font-bold w-1/3">{(t.item || 'Item').toUpperCase()}</th>
                                <th className="pb-2 font-bold w-2/5">{(t.description || 'Description').toUpperCase()}</th>
                                <th className="pb-2 font-bold text-center">{(t.quantity || 'Qty').toUpperCase()}</th>
                                <th className="pb-2 font-bold text-right">{(t.rate || 'Rate').toUpperCase()}</th>
                                <th className="pb-2 font-bold text-right">{(t.amount || 'Amount').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="py-2 font-semibold whitespace-pre-line">{item.name}</td>
                                    <td className="py-2 text-muted-foreground whitespace-pre-line">{item.description}</td>
                                    <td className="py-2 text-center">{item.quantity}</td>
                                    <td className="py-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8">
                        <div className="flex justify-end">
                            <div className="w-1/3 text-sm">
                                <p className="flex justify-between py-1"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                                {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                                {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                                <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                                <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2" style={{ borderColor: style.color }}><span>{t.total || 'TOTAL'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                            </div>
                        </div>
                        <div className="text-xs mt-8">
                            <p className="font-bold">{t.termsAndConditions || 'Terms & Conditions'}:</p>
                            <p className="text-muted-foreground whitespace-pre-line">{document.termsAndConditions}</p>
                        </div>
                        <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                            <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || 'Client Signature'} />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};
export const TransportationTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? t.quote || 'QUOTE' : t.estimate || 'ESTIMATE';

    return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="p-10 text-white flex justify-between items-center" style={{ backgroundColor: style.color }}>
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <div className="text-right"><p className="text-lg">#{document.estimateNumber}</p><p className="text-xs">{safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p></div>
            </header>
            <div className="p-10">
                <section className="grid grid-cols-2 gap-10 text-sm mb-10">
                    <div>
                        <p className="font-bold mb-2" style={{ color: style.color }}>{t.billedTo || 'Billed To'}</p>
                        <p className="font-semibold">{client.name}</p>
                        {client.companyName && <p className="text-muted-foreground">{client.companyName}</p>}
                        <p className="text-muted-foreground whitespace-pre-line">{client.address}</p>
                        <p className="text-muted-foreground">{client.phone}</p>
                        <p className="text-muted-foreground">{client.email}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br />{client.shippingAddress}</p>}
                    </div>
                    <div className="text-right">
                        <p className="font-bold mb-2" style={{ color: style.color }}>{t.billFrom || 'Bill From'}</p>
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone}</p>
                        <p>{business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </section>
                <section className="text-sm mb-8">
                    <p><strong>{t.validUntil || 'Valid Until'}:</strong> {safeFormat(document.validUntilDate, 'MMMM d, yyyy')}</p>
                    {document.referenceNumber && <p><strong>Ref #:</strong> {document.referenceNumber}</p>}
                </section>
                <TransportationDetails document={document} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-100"><th className="p-3 font-bold w-3/5">{t.serviceProvided || 'Service Provided'}</th><th className="p-3 font-bold text-center">{t.quantity || 'Qty'}</th><th className="p-3 font-bold text-right">{t.fee || 'Fee'}</th></tr></thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-3 font-medium whitespace-pre-line">{item.name}</td>
                                    <td className="p-3 text-center">{item.quantity}</td>
                                    <td className="p-3 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-10 pt-10 border-t">
                        <div className="flex justify-end text-sm">
                            <div className="w-1/3">
                                <p className="flex justify-between py-1"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                                {summary.discount > 0 && <p className="flex justify-between py-1 text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                                {summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{t.shipping || 'Shipping'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                                <p className="flex justify-between py-1"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                                <p className="flex justify-between font-bold text-lg mt-2"><span>{t.totalDue || 'Total Due'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                            </div>
                        </div>
                        <div className="text-xs mt-8">
                            <p className="font-bold">{t.termsAndConditions || 'Terms & Conditions'}:</p>
                            <p className="text-muted-foreground whitespace-pre-line">{document.termsAndConditions}</p>
                        </div>
                        <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                            <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || 'Client Signature'} />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};
export const TransportationTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? t.quote || 'Quote' : t.estimate || 'Estimate';
    return (
        <div className={`p-10 font-serif ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#FDFBF7', color: '#5A4A42' }}>
            <header className="text-center mb-10">
                <h1 className="text-2xl font-bold">{business.name}</h1>
                <div className="text-xs mt-1">
                    <p className="whitespace-pre-line">{business.address}</p>
                    <p>{business.phone} | {business.email}</p>
                    {business.website && <p>{business.website}</p>}
                    {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                    {business.taxId && <p>Tax ID: {business.taxId}</p>}
                </div>
            </header>
            <h2 className="text-center text-xl mb-8">{docTitle.toUpperCase()}</h2>
            <section className="text-xs mb-8">
                <p><strong>{t.to || 'To'}:</strong> {client.name}</p>
                {client.companyName && <p>{client.companyName}</p>}
                <p className="whitespace-pre-line">{client.address}</p>
                <p>{client.phone} | {client.email}</p>
                {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br />{client.shippingAddress}</p>}
                <p className="mt-2"><strong>{t.no || 'No'}:</strong> {document.estimateNumber}</p>
                <p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
                <p><strong>{t.validUntil || 'Valid Until'}:</strong> {safeFormat(document.validUntilDate, 'MM/dd/yyyy')}</p>
            </section>
            <TransportationDetails document={document} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr><th className="py-2 border-b-2 w-1/4">{(t.item || 'ITEM').toUpperCase()}</th><th className="py-2 border-b-2 w-2/4">{(t.description || 'DESCRIPTION').toUpperCase()}</th><th className="py-2 border-b-2 text-center">{(t.quantity || 'QTY').toUpperCase()}</th><th className="py-2 border-b-2 text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th><th className="py-2 border-b-2 text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th></tr></thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="py-2 border-b font-medium whitespace-pre-line">{item.name}</td>
                                <td className="py-2 border-b text-xs text-muted-foreground whitespace-pre-line">{item.description}</td>
                                <td className="py-2 border-b text-center">{item.quantity}</td>
                                <td className="py-2 border-b text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 border-b text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3">
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold mt-2 pt-2 border-t"><span>{t.total || 'TOTAL'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                    <div className="text-xs mt-8">
                        <p className="font-bold">{t.paymentInstructions || 'Payment Instructions'}:</p>
                        <p className="text-muted-foreground whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                        <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || 'Client Signature'} />
                    </div>
                </footer>
            )}
        </div>
    );
};
