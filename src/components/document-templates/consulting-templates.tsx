
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
    return isValid(d) ? format(d, formatString) : "Invalid Date";
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

export const ConsultingDetails: React.FC<{ document: Estimate; textColor: string; t: any; }> = ({ document, textColor, t }) => {
    if (!document.consulting) return null;
    const { consulting } = document;
    return (
        <section className="my-4 text-xs" style={{ color: textColor }}>
            <p className="font-bold border-b">{t.consultingDetails || 'Consulting Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2">
                <p><span className="font-semibold">{t.consultationType || 'Type'}:</span> {consulting.consultationType}</p>
                {consulting.sessionHours && <p><span className="font-semibold">{t.sessionHours || 'Hours'}:</span> {consulting.sessionHours}</p>}
                {consulting.retainerFee && <p><span className="font-semibold">{t.retainerFee || 'Retainer'}:</span> ${consulting.retainerFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};


// Template 1: Based on User Image - REBUILT
export const ConsultingTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Quote') : (t.estimate || 'Estimate');
    const accentColor = style.color || '#374151';

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            {/* Header */}
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-2xl font-bold">{business.name || 'Your Company'}</h1>
                    <p className="text-xs text-gray-600 whitespace-pre-line">{business.address || '123 Main St, Anytown, USA 12345'}</p>
                </div>
                {business.logoUrl && (
                    <Image src={business.logoUrl} alt="Company Logo" width={80} height={80} className="object-cover rounded-md" />
                )}
            </header>

            {/* Title */}
            <div className="text-left my-8">
                <h2 className="text-3xl font-bold tracking-wider">{docTitle.toUpperCase()}</h2>
            </div>

            {/* Bill To and Invoice Details */}
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold text-gray-500 mb-1">{t.billTo || 'BILL TO'}</p>
                    <p>{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div className="text-right space-y-1">
                    <p><span className="font-bold">{document.documentType === 'quote' ? t.quoteNo : t.estimateNo || 'Number #'}:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">{t.date || 'DATE'}:</span> {safeFormat(document.estimateDate, 'MM-dd-yyyy')}</p>
                    <p><span className="font-bold">{t.validUntil || 'VALID UNTIL'}:</span> {safeFormat(document.validUntilDate, 'MM-dd-yyyy')}</p>
                </div>
            </section>

            <ConsultingDetails document={document} textColor={textColor || '#374151'} t={t} />

            {/* Items Table */}
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: accentColor, color: 'white' }}>
                            <th className="p-2 font-bold w-[10%]">{t.quantity || 'QTY'}</th>
                            <th className="p-2 font-bold w-[50%]">{t.description || 'DESCRIPTION'}</th>
                            <th className="p-2 font-bold text-right">{t.unitPrice || 'UNIT PRICE'}</th>
                            <th className="p-2 font-bold text-right">{t.amount || 'AMOUNT'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 whitespace-pre-line">{item.name}</td>
                                <td className="p-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    {/* Totals Summary */}
                    <div className="flex justify-end text-sm mb-8">
                        <div className="w-2/5 space-y-2">
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.tax || 'Tax'} ({summary.taxPercentage}%):</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="text-xs">
                        <p className="font-bold">{t.termsAndConditions || 'Terms and Conditions'}</p>
                        <p className="text-gray-600 whitespace-pre-line">{document.termsAndConditions || 'Thank you for your business. Please make payment to the account specified below.'}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                        <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Strategy
export const ConsultingTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <div style={{ backgroundColor: style.color, color: 'white' }} className="p-8 rounded-t-lg">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold">{docTitle}</h2>
                        <p>#{document.estimateNumber}</p>
                    </div>
                </header>
            </div>
            <div className="p-8 bg-white shadow-lg rounded-b-lg border">
                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div><p className="font-bold mb-1">{t.billTo || 'Bill To'}:</p><p>{client.name}<br />{client.address}</p></div>
                    <div className="text-right"><p className="font-bold">{t.date || 'Date'}:</p><p>{safeFormat(document.estimateDate, 'MMM d, yyyy')}</p></div>
                </section>
                <ConsultingDetails document={document} textColor={textColor || '#374151'} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="border-b"><th className="pb-2 font-semibold w-3/5">{t.service || 'Service'}</th><th className="pb-2 font-semibold text-right">{t.amount || 'Amount'}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-8 pt-8 border-t">
                        <div className="flex justify-end text-sm">
                            <div className="w-1/2">
                                <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                                {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                                {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                                <p className="flex justify-between"><span>{t.tax || 'Tax'} ({summary.taxPercentage}%):</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                                <p className="flex justify-between font-bold text-xl mt-4"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                            <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 3: Advisory
export const ConsultingTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-10 font-sans bg-gray-50 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <div className="bg-white p-8 shadow-lg">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={90} height={45} className="object-contain mb-2" />}
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-extrabold text-gray-400">{docTitle}</h2>
                        <p className="text-xs"># {document.estimateNumber}</p>
                    </div>
                </header>
                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div><p className="font-bold text-gray-500 mb-1">{t.billedTo || 'Billed To'}</p><p>{client.name}<br />{client.address}</p></div>
                    <div className="text-right"><p><span className="font-bold text-gray-500">{t.date || 'Date'}: </span>{safeFormat(document.estimateDate, 'dd-MMM-yyyy')}</p></div>
                </section>
                <ConsultingDetails document={document} textColor={textColor || '#374151'} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">{t.serviceDescription || 'Service Description'}</th><th className="p-2 font-bold text-right">{t.fee || 'Fee'}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8">
                        <div className="flex justify-end text-sm">
                            <div className="w-1/3 space-y-1">
                                <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                                {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                                {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                                <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                                <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-gray-300"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                            <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 4: Modern
export const ConsultingTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Quote') : (t.estimate || 'Estimate');

    return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header style={{ backgroundColor: style.color }} className="text-white p-10 flex justify-between items-center">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <h2 className="text-xl">{docTitle} #{document.estimateNumber}</h2>
            </header>
            <div className="p-10">
                <section className="grid grid-cols-2 gap-10 text-sm mb-10">
                    <div>
                        <p className="font-bold mb-1">{t.billedTo || 'Billed To'}</p>
                        <p>{client.name}</p>
                        <p>{client.address}</p>
                    </div>
                    <div className="text-right">
                        <p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
                        <p><strong>{t.validUntil || 'Valid Until'}:</strong> {safeFormat(document.validUntilDate, 'MM/dd/yyyy')}</p>
                    </div>
                </section>
                <ConsultingDetails document={document} textColor={textColor || '#374151'} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-100"><th className="p-3 font-bold w-3/5">{t.serviceProvided || 'Service Provided'}</th><th className="p-3 font-bold text-right">{t.fee || 'Fee'}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-3">{item.name}</td><td className="p-3 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
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
                                <p className="flex justify-between font-bold text-lg mt-2"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                            <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Minimal
export const ConsultingTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Quote') : (t.estimate || 'Estimate');
    return (
        <div className={`p-10 font-mono text-sm ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="mb-10">
                <h1 className="text-xl font-bold">{business.name} // {docTitle.toUpperCase()}</h1>
                <p className="text-xs">{business.address}</p>
            </header>
            <section className="mb-10">
                <p>{t.to || 'To'}: {client.name}</p>
                <p>{t.date || 'Date'}: {safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                <p>Ref: {document.estimateNumber}</p>
            </section>
            <ConsultingDetails document={document} textColor={textColor || '#374151'} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr><th className="pt-2 pb-2 border-t border-b border-dashed w-4/5">{t.description || 'Description'}</th><th className="pt-2 pb-2 border-t border-b border-dashed text-right">{t.cost || 'Cost'}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id}><td className="py-1">{item.name}</td><td className="py-1 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-xs">
                        <div className="w-1/2">
                            <p className="flex justify-between border-t border-dashed pt-2"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t-2 border-black"><span>{t.total || 'Total'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                        <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                    </div>
                </footer>
            )}
        </div>
    );
};

