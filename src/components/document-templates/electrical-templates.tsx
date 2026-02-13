
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

export const ElectricalDetails: React.FC<{ document: Estimate; textColor: string; t: any; }> = ({ document, textColor, t }) => {
    if (!document.electrical) return null;
    const { electrical } = document;
    return (
        <section className="my-4 text-xs" style={{ color: textColor }}>
            <p className="font-bold border-b">{t.electricalSpecifics || 'Electrical Specifics'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2">
                <p><span className="font-semibold">{t.service || 'Service'}:</span> {electrical.serviceType}</p>
                <p><span className="font-semibold">{t.wiring || 'Wiring'}:</span> {electrical.wiringType}</p>
                <p><span className="font-semibold">{t.panelUpgrade || 'Panel Upgrade'}:</span> {electrical.panelUpgradeNeeded ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold">{t.panelSize || 'Panel Size'}:</span> {electrical.panelSize}</p>
                {electrical.outletsFixturesCount && <p><span className="font-semibold">{t.outletsFixtures || 'Outlets/Fixtures'}:</span> {electrical.outletsFixturesCount}</p>}
                <p><span className="font-semibold">{t.evCharger || 'EV Charger'}:</span> {electrical.evChargerNeeded ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold">{t.inspection || 'Inspection'}:</span> {electrical.inspectionRequired ? 'Yes' : 'No'}</p>
                <p className="col-span-full"><span className="font-semibold">{t.rooms || 'Rooms'}:</span> {electrical.roomsInvolved}</p>
            </div>
        </section>
    );
};


// Template 1: Direct Interpretation
export const ElectricalTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#1E40AF'; // Default to a navy blue
    const docTitle = document.documentType === 'quote' ? 'QUOTE' : 'ESTIMATE';
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', minHeight: '1056px', color: textColor, backgroundColor: document.backgroundColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold" style={{ color: accentColor }}>{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-8 text-xs">
                <div>
                    <p className="font-bold" style={{ color: accentColor }}>Bill To</p>
                    <p className="font-semibold">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p className="whitespace-pre-line mt-2">{client.projectLocation}</p>
                </div>
                <div className="text-right space-y-1">
                    <p><span className="font-bold" style={{ color: accentColor }}>{document.documentType === 'quote' ? t.quoteNo : t.estimateNo || 'Number #'}:</span> {document.estimateNumber}</p>
                    {document.referenceNumber && <p><span className="font-bold" style={{ color: accentColor }}>{t.reference || 'Reference #'}:</span> {document.referenceNumber}</p>}
                    <p><span className="font-bold" style={{ color: accentColor }}>{t.dateIssued || 'Date Issued'}:</span> {safeFormat(document.estimateDate, 'dd-MM-yyyy')}</p>
                    <p><span className="font-bold" style={{ color: accentColor }}>{t.validUntil || 'Valid Until'}:</span> {safeFormat(document.validUntilDate, 'dd-MM-yyyy')}</p>
                </div>
            </section>

            <ElectricalDetails document={document} textColor={textColor || '#374151'} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-sm">
                    <thead style={{ backgroundColor: accentColor, color: 'white' }}>
                        <tr>
                            <th className="p-2 font-bold w-[10%] text-center">QTY</th>
                            <th className="p-2 font-bold w-[50%]">Description</th>
                            <th className="p-2 font-bold text-right">Unit Price</th>
                            <th className="p-2 font-bold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
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
                            <div className="flex justify-between p-1"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                            {summary.discount > 0 && <div className="flex justify-between p-1 text-red-500"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></div>}
                            {summary.shippingCost > 0 && <div className="flex justify-between p-1"><span>{t.shipping || 'Shipping/Extra'}</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></div>}
                            {summary.taxAmount > 0 && <div className="flex justify-between p-1"><span>{t.tax || 'Tax'} ({summary.taxPercentage}%)</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>}
                            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2" style={{ borderColor: accentColor }}><span>{t.total || 'Total'} ({currency})</span><span style={{ color: accentColor }}>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div className="text-xs mt-8">
                        <p className="font-bold" style={{ color: accentColor }}>{t.termsAndConditions || 'Terms and Conditions'}</p>
                        <p className="whitespace-pre-line">{document.termsAndConditions.replace('{docType}', docTypeTerm)}</p>
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


// Template 2: Header Centered
export const ElectricalTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#0B57D0';
    const docTitle = document.documentType === 'quote' ? 'ESTIMATE' : 'ESTIMATE';
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', color: textColor, backgroundColor: document.backgroundColor }}>
            <header className="text-center mb-8">
                {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={80} className="object-contain mx-auto mb-2" />}
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-xs">{business.address} • {business.phone}</p>
                <div className="mt-4">
                    <h2 className="text-3xl font-bold" style={{ color: accentColor }}>{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs">
                <div><p className="font-bold">Bill To:</p><p>{client.name}</p>{client.companyName && <p>{client.companyName}</p>}<p>{client.address}</p></div>
                <div className="text-center"><p className="font-bold">{document.documentType === 'quote' ? t.quoteNo : t.estimateNo || 'Number #'}:</p><p>{document.estimateNumber}</p></div>
                <div className="text-right"><p className="font-bold">Date:</p><p>{safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p><p className="font-bold mt-2">Valid Until:</p><p>{safeFormat(document.validUntilDate, 'MM/dd/yyyy')}</p></div>
            </section>

            <ElectricalDetails document={document} textColor={textColor || '#374151'} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b-2" style={{ borderColor: accentColor }}>
                            <th className="py-2 font-bold w-[60%]">DESCRIPTION</th>
                            <th className="py-2 font-bold text-center">QTY</th>
                            <th className="py-2 font-bold text-right">RATE</th>
                            <th className="py-2 font-bold text-right">TOTAL</th>
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
                <footer className="mt-auto pt-8 flex justify-between items-end">
                    <div className="w-1/2 text-xs">
                        <p className="font-bold mb-1">Terms:</p>
                        <p className="whitespace-pre-line">{document.termsAndConditions.replace('{docType}', docTypeTerm)}</p>
                        <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                    </div>
                    <div className="w-1/3 text-sm">
                        <p className="flex justify-between py-1"><span>Subtotal:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        {summary.discount > 0 && <p className="flex justify-between py-1 text-red-500"><span>Discount:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                        {summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>Shipping/Extra:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between py-1"><span>Tax:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2 border-black"><span>Total:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Minimalist
export const ElectricalTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'Estimate' : 'Estimate';
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
                    <p className="font-bold mb-1">Prepared For</p>
                    <p>{client.name}</p>{client.companyName && <p>{client.companyName}</p>}<p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{document.documentType === 'quote' ? t.quoteNo : t.estimateNo || 'Number #'}:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">Date:</span> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p>
                </div>
            </section>

            <ElectricalDetails document={document} textColor={textColor || '#374151'} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-semibold w-1/2 border-b-2 border-gray-300">ITEM</th>
                            <th className="p-2 font-semibold text-center border-b-2 border-gray-300">QUANTITY</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">PRICE</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">AMOUNT</th>
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
                                <tr><td className="py-1 text-gray-500">Subtotal</td><td className="text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                {summary.discount > 0 && <tr><td className="py-1 text-gray-500">Discount</td><td className="text-right text-red-500">-{currencySymbol}{summary.discount.toFixed(2)}</td></tr>}
                                {summary.shippingCost > 0 && <tr><td className="py-1 text-gray-500">Shipping/Extra</td><td className="text-right">{currencySymbol}{summary.shippingCost.toFixed(2)}</td></tr>}
                                <tr><td className="py-1 text-gray-500">Sales Tax</td><td className="text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">TOTAL</td><td className="pt-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="text-xs mt-8">
                        <p className="font-bold">Terms & Conditions:</p>
                        <p className="text-gray-500 whitespace-pre-line">{document.termsAndConditions.replace('{docType}', docTypeTerm)}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                        <SignatureDisplay signature={document.clientSignature} label="Customer Signature" />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Side Accent
export const ElectricalTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'ESTIMATE' : 'ESTIMATE';
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <div className="w-10" style={{ backgroundColor: style.color }}></div>
            <div className="p-10 flex-grow flex flex-col">
                <header className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-400">{docTitle}</h2>
                        <p className="text-xs">{document.estimateNumber}</p>
                    </div>
                </header>
                <section className="grid grid-cols-2 gap-4 mb-8 text-xs">
                    <div><p className="font-bold">CLIENT:</p><p>{client.name}, {client.address}</p></div>
                    <div className="text-right"><p className="font-bold">DATE:</p><p>{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p></div>
                </section>

                <ElectricalDetails document={document} textColor={textColor || '#374151'} t={t} />

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-2 font-bold w-3/5">SERVICE</th>
                                <th className="p-2 font-bold text-center">QTY</th>
                                <th className="p-2 font-bold text-right">RATE</th>
                                <th className="p-2 font-bold text-right">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
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
                                <div className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                                {summary.discount > 0 && <div className="flex justify-between text-red-500"><span>Discount:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></div>}
                                {summary.shippingCost > 0 && <div className="flex justify-between"><span>Shipping/Extra:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></div>}
                                <div className="flex justify-between"><span>Tax:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>Total:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                            </div>
                        </div>
                        <div className="text-xs mt-8">
                            <p className="font-bold">Terms & Conditions:</p>
                            <p className="text-gray-500 whitespace-pre-line">{document.termsAndConditions.replace('{docType}', docTypeTerm)}</p>
                        </div>
                        <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                            <SignatureDisplay signature={document.clientSignature} label="Customer Signature" />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Grid Layout
export const ElectricalTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'ESTIMATE' : 'ESTIMATE';
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto',_sans-serif] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', color: textColor, backgroundColor: document.backgroundColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h1 className="text-2xl font-extrabold" style={{ color: style.color }}>{docTitle}</h1>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-8 text-xs p-4 bg-white rounded-lg shadow-sm">
                <div><p className="font-bold text-gray-500">From:</p><p className="font-semibold">{business.name}</p><p>{business.address}</p></div>
                <div><p className="font-bold text-gray-500">To:</p><p className="font-semibold">{client.name}</p><p>{client.address}</p></div>
                <div><p className="font-bold text-gray-500">{document.documentType === 'quote' ? t.quoteNo : t.estimateNo || 'Number #'}:</p><p>{document.estimateNumber}</p></div>
                <div><p className="font-bold text-gray-500">Date Issued:</p><p>{safeFormat(document.estimateDate, 'MMM d, yyyy')}</p></div>
            </section>

            <ElectricalDetails document={document} textColor={textColor || '#374151'} t={t} />

            <main className="flex-grow bg-white p-4 rounded-lg shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-3/5">DESCRIPTION OF WORK</th>
                            <th className="py-2 font-bold text-center">HOURS/QTY</th>
                            <th className="py-2 font-bold text-right">COST</th>
                            <th className="py-2 font-bold text-right">TOTAL</th>
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
                <footer className="mt-auto pt-6 flex justify-between items-end">
                    <div className="text-xs w-1/2">
                        <p className="font-bold">Terms & Conditions:</p>
                        <p className="text-gray-500 whitespace-pre-line">{document.termsAndConditions.replace('{docType}', docTypeTerm)}</p>
                        <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                    </div>
                    <div className="w-1/3 text-sm space-y-1">
                        <p className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        {summary.discount > 0 && <p className="flex justify-between"><span>Discount</span><span className="text-red-500">-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                        {summary.shippingCost > 0 && <p className="flex justify-between"><span>Shipping/Extra</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>Tax</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>Total Estimate</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};
