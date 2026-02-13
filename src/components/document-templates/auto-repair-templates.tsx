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

export const AutoRepairDetails: React.FC<{ document: Estimate; textColor: string; t: any; }> = ({ document, textColor, t }) => {
    if (!document.autoRepair) return null;
    const { autoRepair } = document;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold border-b" style={{ color: textColor }}>{t.vehicleInformation || 'Vehicle Information'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2" style={{ color: textColor }}>
                <p><span className="font-semibold">{t.vehicle || 'Vehicle'}:</span> {autoRepair.vehicleMake} {autoRepair.vehicleModel} ({autoRepair.vehicleYear})</p>
                {autoRepair.mileage && <p><span className="font-semibold">{t.mileage || 'Mileage'}:</span> {autoRepair.mileage.toLocaleString()}</p>}
                <p className="col-span-full"><span className="font-semibold">VIN:</span> {autoRepair.vin}</p>
                <p className="col-span-full"><span className="font-semibold">{t.issue || 'Issue'}:</span> {autoRepair.issueDescription}</p>
                <p className="col-span-full"><span className="font-semibold">{t.partsRequired || 'Parts Required'}:</span> {autoRepair.partsRequired}</p>
                <p><span className="font-semibold">{t.diagnostic || 'Diagnostic'}:</span> {autoRepair.diagnosticType}</p>
            </div>
        </section>
    );
};


// Template 1: Direct Interpretation
export const AutoRepairTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#FBBF24'; // Default to a gold/yellow
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '9pt', minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="p-10 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold" style={{ color: accentColor }}>{docTitle}</h2>
                </div>
            </header>
            <div className="px-10 pb-10 flex-grow flex flex-col" style={{ color: textColor }}>
                <section className="grid grid-cols-2 gap-4 mb-6 text-xs pb-4 border-b border-gray-200">
                    <div>
                        <p className="p-1 text-sm font-bold rounded" style={{ backgroundColor: `${accentColor}40` }}>{t.customerInformation || 'Customer Information'}</p>
                        <p className="mt-2"><span className="font-bold w-20 inline-block">{t.name || 'Name'}:</span> {client.name}</p>
                        <p><span className="font-bold w-20 inline-block">{t.address || 'Address'}:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                        <p><span className="font-bold w-20 inline-block">{t.phone || 'Phone'}:</span> {client.phone}</p>
                        <p><span className="font-bold w-20 inline-block">{t.email || 'Email'}:</span> {client.email}</p>
                    </div>
                    <div>
                        <p className="p-1 text-sm font-bold rounded" style={{ backgroundColor: `${accentColor}40` }}>{t.estimateDetails || 'Details'}</p>
                        <p className="mt-2"><span className="font-bold w-20 inline-block">{(document.documentType === 'quote' ? t.quoteNo : t.estimateNo) || 'Number #'}:</span> {document.estimateNumber}</p>
                        <p><span className="font-bold w-20 inline-block">{t.date || 'Date'}:</span> {safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
                    </div>
                </section>

                <AutoRepairDetails document={document} textColor={textColor || '#374151'} t={t} />

                <main className="flex-grow">
                    <p className="p-1 mb-2 text-sm font-bold rounded" style={{ backgroundColor: `${accentColor}40` }}>{t.repairDetails || 'Repair Details'}</p>
                    <table className="w-full text-left text-xs">
                        <thead className="border-y border-gray-400">
                            <tr>
                                <th className="p-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                                <th className="p-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                                <th className="p-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th>
                                <th className="p-2 font-bold text-right">{(t.totalPrice || 'TOTAL PRICE').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-200">
                                    <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
                                    <td className="p-2 align-top text-center">{item.quantity}</td>
                                    <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        {pageIndex === totalPages - 1 && (
                            <tfoot>
                                <tr><td colSpan={3} className="p-2 text-right">{t.subtotal || 'Subtotal'}</td><td className="p-2 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                {summary.discount > 0 && <tr><td colSpan={3} className="p-2 text-right">{t.discount || 'Discount'}</td><td className="p-2 text-right text-red-600">-{currencySymbol}{summary.discount.toFixed(2)}</td></tr>}
                                {summary.shippingCost > 0 && <tr><td colSpan={3} className="p-2 text-right">{t.shipping || 'Shipping/Extra'}</td><td className="p-2 text-right">{currencySymbol}{summary.shippingCost.toFixed(2)}</td></tr>}
                                <tr><td colSpan={3} className="p-2 text-right">{t.tax || 'Tax'} ({summary.taxPercentage}%)</td><td className="p-2 text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                <tr>
                                    <td colSpan={3} className="p-2 pt-2 text-right font-bold text-base">{(t.total || 'Total')}</td>
                                    <td className="p-2 pt-2 text-right font-bold text-base">{currencySymbol}{summary.grandTotal.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </main>

                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8 text-xs">
                        <section className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <p className="font-bold mb-2">{(t.paymentInformation || 'Payment Information')}</p>
                                <p>{t.paymentDetailsOnInvoice || 'Details available upon request or on final invoice.'}</p>
                            </div>
                            <div>
                                <p className="font-bold mb-2">{(t.additionalNotes || 'Additional Notes')}</p>
                                <p className="whitespace-pre-line">{document.termsAndConditions.replace(/estimate/gi, docTypeTerm)}</p>
                            </div>
                        </section>
                        <div className="flex justify-between items-end border p-4 rounded-md">
                            <div>
                                <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                            </div>
                            <div className="text-center">
                                <SignatureDisplay signature={document.clientSignature} label={t.customerSignature || "Customer Signature"} />
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 2: Modern Dark
export const AutoRepairTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`bg-gray-800 text-white font-sans flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Roboto, sans-serif', fontSize: '9.5pt', minHeight: '1056px', color: textColor, backgroundColor: document.backgroundColor }}>
            <header className="p-10 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs text-gray-300">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold tracking-wider">{docTitle}</h2>
                </div>
            </header>
            <div className="p-10 pt-0 flex-grow flex flex-col">
                <section className="mb-6 pb-4 border-b border-gray-600 grid grid-cols-2 gap-8 text-xs">
                    <div>
                        <p className="font-bold text-gray-400 mb-1">{(t.customer || 'CUSTOMER').toUpperCase()}</p>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-gray-300">{client.address}</p>
                    </div>
                    <div className="text-right">
                        <p><span className="font-bold text-gray-400">{(document.documentType === 'quote' ? t.quoteNo : t.estimateNo) || 'Number #'}: </span>{document.estimateNumber}</p>
                        <p><span className="font-bold text-gray-400">{(t.date || 'DATE').toUpperCase()}: </span>{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                    </div>
                </section>

                <AutoRepairDetails document={document} textColor={textColor || '#FFFFFF'} t={t} />

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-300">
                            <tr>
                                <th className="py-2 font-semibold w-1/2">{(t.service || 'SERVICE').toUpperCase()}</th>
                                <th className="py-2 font-semibold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                                <th className="py-2 font-semibold text-right">{(t.unitCost || 'UNIT COST').toUpperCase()}</th>
                                <th className="py-2 font-semibold text-right">{(t.subtotal || 'SUBTOTAL').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-700">
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
                        <div className="flex justify-end mb-6">
                            <div className="w-2/5 text-sm space-y-2">
                                <div className="flex justify-between"><span className="text-gray-400">{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                                {summary.discount > 0 && <div className="flex justify-between"><span className="text-gray-400">{t.discount || 'Discount'}:</span><span className="text-red-400">-{currencySymbol}{summary.discount.toFixed(2)}</span></div>}
                                {summary.shippingCost > 0 && <div className="flex justify-between"><span className="text-gray-400">{t.shipping || 'Shipping'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></div>}
                                <div className="flex justify-between"><span className="text-gray-400">{(t.taxesAndFees || 'Taxes &amp; Fees')}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2 border-gray-500" style={{ color: style.color || '#FBBF24' }}><span>{(document.documentType === 'quote' ? t.quoteTotal : t.estimateTotal) || 'TOTAL'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-end text-xs">
                            <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                            <SignatureDisplay signature={document.clientSignature} label={t.customerSignature || "Customer Signature"} />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};


// Template 3: Minimalist & Clean
export const AutoRepairTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Quote') : (t.estimate || 'Estimate');
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`p-12 bg-white font-['Garamond',_serif] text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', color: textColor, backgroundColor: document.backgroundColor }}>
            <header className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-light tracking-wider">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light tracking-wider">{docTitle}</h2>
                </div>
            </header>

            <section className="flex justify-between mb-10 text-xs">
                <div>
                    <p className="font-bold mb-1">{(t.preparedFor || 'Prepared For')}</p>
                    <p>{client.name}</p><p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{(document.documentType === 'quote' ? t.quoteNo : t.estimateNo) || 'Number #'}:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">{(t.date || 'Date')}:</span> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p>
                </div>
            </section>

            <AutoRepairDetails document={document} textColor={textColor || '#374151'} t={t} />

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
                                <td className="p-2 border-b border-gray-200 whitespace-pre-line">{item.name}</td>
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
                                <tr><td className="py-1">{(t.subtotal || 'Subtotal')}</td><td className="text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                {summary.discount > 0 && <tr><td className="py-1">{t.discount || 'Discount'}</td><td className="text-right text-red-600">-{currencySymbol}{summary.discount.toFixed(2)}</td></tr>}
                                {summary.shippingCost > 0 && <tr><td className="py-1">{t.shipping || 'Shipping'}</td><td className="text-right">{currencySymbol}{summary.shippingCost.toFixed(2)}</td></tr>}
                                <tr><td className="py-1">{(t.tax || 'Tax')}</td><td className="text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">{(t.total || 'TOTAL').toUpperCase()}</td><td className="pt-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                        <SignatureDisplay signature={document.clientSignature} label={t.customerSignature || "Customer Signature"} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Corporate Blue Accents
export const AutoRepairTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#3B82F6';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', color: textColor, backgroundColor: document.backgroundColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold" style={{ color: accentColor }}>{docTitle}</h2>
                </div>
            </header>

            <section className="my-8 grid grid-cols-2 gap-4 text-xs">
                <div><p><span className="font-bold">{(t.to || 'TO').toUpperCase()}: </span>{client.name}</p><p>{client.address}</p></div>
                <div className="text-right"><p><span className="font-bold">{(document.documentType === 'quote' ? t.quoteNo : t.estimateNo) || 'Number #'}: </span>{document.estimateNumber}</p><p><span className="font-bold">{(t.date || 'DATE').toUpperCase()}: </span>{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p></div>
            </section>

            <AutoRepairDetails document={document} textColor={textColor || '#374151'} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 font-bold w-[60%]">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.price || 'PRICE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
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
                    <div className="flex justify-end">
                        <table className="w-1/3 text-sm">
                            <tbody>
                                <tr><td className="py-1">{(t.subtotal || 'Subtotal')}</td><td className="py-1 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                {summary.discount > 0 && <tr><td className="py-1">{t.discount || 'Discount'}</td><td className="py-1 text-right text-red-600">-{currencySymbol}{summary.discount.toFixed(2)}</td></tr>}
                                {summary.shippingCost > 0 && <tr><td className="py-1">{t.shipping || 'Shipping'}</td><td className="py-1 text-right">{currencySymbol}{summary.shippingCost.toFixed(2)}</td></tr>}
                                {summary.taxAmount > 0 && <tr><td className="py-1">{(t.tax || 'Taxes')}</td><td className="py-1 text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>}
                                <tr className="font-bold text-base border-t-2 border-black"><td className="py-2">{(t.total || 'Total')}</td><td className="py-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                        <SignatureDisplay signature={document.clientSignature} label={t.customerSignature || "Customer Signature"} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 5: Grid Layout
export const AutoRepairTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Quote').toUpperCase() : (t.estimate || 'Estimate').toUpperCase();
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto',_sans-serif] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', color: textColor, backgroundColor: document.backgroundColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={100} height={40} className="object-contain" /> : <h1 className="text-3xl font-bold">{business.name}</h1>}
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h1 className="text-2xl font-extrabold" style={{ color: style.color }}>{docTitle}</h1>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-8 text-xs p-4 bg-white rounded-lg shadow-sm">
                <div><p className="font-bold text-gray-500">{(t.from || 'From').toUpperCase()}:</p><p className="font-semibold">{business.name}</p><p>{business.address}</p></div>
                <div><p className="font-bold text-gray-500">{(t.to || 'To').toUpperCase()}:</p><p className="font-semibold">{client.name}</p><p>{client.address}</p></div>
                <div><p className="font-bold text-gray-500">{(document.documentType === 'quote' ? t.quoteNo : t.estimateNo) || 'Number #'}:</p><p>{document.estimateNumber}</p></div>
                <div><p className="font-bold text-gray-500">{(t.dateIssued || 'DATE ISSUED').toUpperCase()}:</p><p>{safeFormat(document.estimateDate, 'MMM d, yyyy')}</p></div>
            </section>

            <AutoRepairDetails document={document} textColor={textColor || '#374151'} t={t} />

            <main className="flex-grow bg-white p-4 rounded-lg shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-3/5">{(t.descriptionOfWork || 'DESCRIPTION OF WORK').toUpperCase()}</th>
                            <th className="py-2 font-bold text-center">{(t.hoursQty || 'HOURS/QTY').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.cost || 'COST').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="py-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-6 flex justify-end">
                    <div className="w-1/3 text-sm space-y-1">
                        <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        {summary.discount > 0 && <p className="flex justify-between"><span>{t.discount || 'Discount'}</span><span className="text-red-600">-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                        {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>{(t.tax || 'Tax')}</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>{(document.documentType === 'quote' ? t.quoteTotal : t.estimateTotal) || 'Total Estimate'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

