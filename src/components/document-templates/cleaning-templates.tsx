
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
        <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-600 mt-1">({signature.signerName})</p>
        </div>
    )
}

export const CleaningDetails: React.FC<{ document: Estimate; textColor: string; t: any; }> = ({ document, textColor, t }) => {
    if (!document.cleaning) return null;
    const { cleaning } = document;
    return (
        <section className="my-4 text-xs" style={{ color: textColor }}>
            <p className="font-bold border-b" >{(t.cleaningSpecifics || 'Cleaning Specifics')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2">
                <p><span className="font-semibold">{t.type || 'Type'}:</span> {cleaning.cleaningType}</p>
                <p><span className="font-semibold">{t.frequency || 'Frequency'}:</span> {cleaning.frequency}</p>
                {cleaning.homeSize && <p><span className="font-semibold">{t.homeSize || 'Home Size'}:</span> {cleaning.homeSize} sq ft</p>}
                {cleaning.bedrooms && <p><span className="font-semibold">{t.bedrooms || 'Bedrooms'}:</span> {cleaning.bedrooms}</p>}
                {cleaning.bathrooms && <p><span className="font-semibold">{t.bathrooms || 'Bathrooms'}:</span> {cleaning.bathrooms}</p>}
                <p><span className="font-semibold">{t.kitchenSize || 'Kitchen Size'}:</span> {cleaning.kitchenSize}</p>
                <p><span className="font-semibold">{t.hasPets || 'Has Pets'}:</span> {cleaning.hasPets ? 'Yes' : 'No'}</p>
                {cleaning.addOns && cleaning.addOns.length > 0 && <p className="col-span-full"><span className="font-semibold">{t.addOns || 'Add-ons'}:</span> {cleaning.addOns.join(', ')}</p>}
            </div>
        </section>
    );
};


// Template 1: Sparkle
export const CleaningTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`bg-white font-sans text-gray-800 flex flex-col relative ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: `10pt`, minHeight: '1056px' }}>
            <div className="absolute top-0 left-0 right-0 h-48" style={{ backgroundColor: style.color, clipPath: 'ellipse(100% 70% at 50% 0%)' }}></div>
            <div className="p-10 relative z-10 flex-grow flex flex-col" style={{ color: textColor }}>
                <header className="flex justify-between items-start mb-8 text-white">
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs whitespace-pre-line">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold">{docTitle}</h2>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-4 mb-8 text-xs p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                    <div>
                        <p className="font-bold text-base mb-2">{t.companyInformation || 'Company Information'}</p>
                        <p><span className="font-bold w-24 inline-block">{t.companyName || 'Company Name'}:</span> {business.name}</p>
                        <p><span className="font-bold w-24 inline-block">{t.address || 'Address'}:</span> <span className="whitespace-pre-line">{business.address}</span></p>
                        <p><span className="font-bold w-24 inline-block">{t.phone || 'Phone'}:</span> {business.phone}</p>
                        <p><span className="font-bold w-24 inline-block">{t.email || 'Email'}:</span> {business.email}</p>
                    </div>
                    <div>
                        <p className="font-bold text-base mb-2">{t.customerInformation || 'Customer Information'}</p>
                        <p><span className="font-bold w-24 inline-block">{t.customerName || 'Customer Name'}:</span> {client.name}</p>
                        <p><span className="font-bold w-24 inline-block">{t.address || 'Address'}:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                        <p><span className="font-bold w-24 inline-block">{t.phone || 'Phone'}:</span> {client.phone}</p>
                        <p><span className="font-bold w-24 inline-block">{t.email || 'Email'}:</span> {client.email}</p>
                    </div>
                </section>

                <CleaningDetails document={document} textColor={textColor || '#374151'} t={t} />

                <main className="flex-grow">
                    <table className="w-full text-left text-xs">
                        <thead style={{ backgroundColor: style.color }} className="text-white">
                            <tr>
                                <th className="p-2 font-bold w-12">{t.no || 'No'}</th>
                                <th className="p-2 font-bold w-3/5">{t.serviceDescription || 'Service Description'}</th>
                                <th className="p-2 font-bold text-center">{t.quantity || 'Quantity'}</th>
                                <th className="p-2 font-bold text-right">{t.unitPrice || 'Unit Price'}</th>
                                <th className="p-2 font-bold text-right">{t.total || 'Total'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map((item, index) => (
                                <tr key={item.id} className="border-b bg-gray-50/50">
                                    <td className="p-2 text-center">{index + 1}</td>
                                    <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
                                    <td className="p-2 align-top text-center">{item.quantity}</td>
                                    <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>

                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8">
                        <div className="flex justify-end mb-8">
                            <table className="w-2/5 text-sm">
                                <tbody>
                                    <tr><td className="p-2 text-right">{(t.subtotal || 'Subtotal')}</td><td className="p-2 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                    {summary.discount > 0 && <tr><td className="p-2 text-right text-red-500">{(t.discount || 'Discount')}</td><td className="p-2 text-right text-red-500">-{currencySymbol}{summary.discount.toFixed(2)}</td></tr>}
                                    {summary.shippingCost > 0 && <tr><td className="p-2 text-right">{(t.shipping || 'Shipping')}</td><td className="p-2 text-right">{currencySymbol}{summary.shippingCost.toFixed(2)}</td></tr>}
                                    <tr><td className="p-2 text-right">{(t.tax || 'Tax')} ({summary.taxPercentage}%)</td><td className="p-2 text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                    <tr className="border-t-2" style={{ borderColor: style.color }}><td className="p-2 text-right font-bold">{(t.total || 'Total')}</td><td className="p-2 text-right font-bold">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="grid grid-cols-2 gap-8 items-end text-xs">
                            <div>
                                <p className="font-bold text-base mb-2">{(t.termsAndConditions || 'Terms and Conditions')}:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li className="whitespace-pre-line">{document.termsAndConditions.replace(/estimate/gi, docTypeTerm)}</li>
                                </ul>
                            </div>
                            <div className="text-center">
                                {document.clientSignature ? <Image src={document.clientSignature.image} alt="signature" width={150} height={75} className="mx-auto" /> : <div className="w-48 h-12 border-b border-gray-400 mx-auto"></div>}
                                <p className="mt-2 text-sm font-semibold">{t.customerSignature || 'Customer Signature'}</p>
                                <p className="text-xs">{client.name}</p>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 2: Fresh & Modern
export const CleaningTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#10B981'; // Green
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', color: textColor }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2 border-gray-100">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain mb-2" />}
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500">{(t.client || 'Client')}:</p>
                    <p className="font-semibold">{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div>
                    <p className="font-bold text-gray-500">{(t.project || 'Project')}:</p>
                    <p className="font-semibold">{document.projectTitle}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{(document.documentType === 'quote' ? t.quoteNo : t.estimateNo) || 'Number #'}:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">{(t.date || 'Date')}:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                </div>
            </section>

            <CleaningDetails document={document} textColor={textColor || '#374151'} t={t} />

            <main className="flex-grow mt-4">
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
                                <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
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
                            <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between text-red-500"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between"><span>{(t.shipping || 'Shipping')}</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Pristine
export const CleaningTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Quote') : (t.estimate || 'Estimate');
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`p-10 font-sans bg-white text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', color: textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold" style={{ color: style.color }}>{docTitle.toUpperCase()}</h2>
                    <p>#{document.estimateNumber}</p>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                <div>
                    <p className="font-bold">{t.billTo || 'Billed To'}:</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{t.date || 'Date'}:</span> {safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
                    <p><span className="font-bold">{t.validUntil || 'Valid Until'}:</span> {safeFormat(document.validUntilDate, 'MM/dd/yyyy')}</p>
                </div>
            </section>
            <CleaningDetails document={document} textColor={textColor || '#374151'} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 font-bold w-3/5">{t.serviceDescription || 'Service Description'}</th>
                            <th className="p-2 font-bold text-right">{t.amount || 'Amount'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8 text-right">
                    <div className="inline-block w-2/5 text-sm">
                        <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        {summary.discount > 0 && <p className="flex justify-between text-red-500"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                        {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};
// Template 4: Efficient
export const CleaningTemplate4 = CleaningTemplate1;

// Template 5: Sparkle Plus
export const CleaningTemplate5 = CleaningTemplate2;
