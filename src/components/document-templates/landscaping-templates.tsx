
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

const LandscapingDetails: React.FC<{ document: Estimate, t: any }> = ({ document, t }) => {
    if (!document.landscaping) return null;
    const { landscaping } = document;
    const hasDetails = Object.values(landscaping).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.landscapingSpecifics || 'Landscaping Specifics'}</p>
            </section>
        );
    }
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.landscapingSpecifics || 'Landscaping Specifics'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {landscaping.serviceType && <p className="col-span-full"><span className="font-semibold text-gray-600">{(t.service || 'Service')}:</span> {landscaping.serviceType}</p>}
                {landscaping.propertySize && <p><span className="font-semibold text-gray-600">{(t.propertySize || 'Property Size')}:</span> {landscaping.propertySize}</p>}
                {landscaping.yardCondition && <p><span className="font-semibold text-gray-600">{(t.yardCondition || 'Yard Condition')}:</span> {landscaping.yardCondition}</p>}
                {landscaping.grassHeight && <p><span className="font-semibold text-gray-600">{(t.grassHeight || 'Grass Height')}:</span> {landscaping.grassHeight}</p>}
                {landscaping.treeCount && <p><span className="font-semibold text-gray-600">{(t.treeCount || 'Tree Count')}:</span> {landscaping.treeCount}</p>}
                {landscaping.fenceLengthNeeded && <p><span className="font-semibold text-gray-600">{(t.fenceLength || 'Fence Length')}:</span> {landscaping.fenceLengthNeeded}</p>}
            </div>
        </section>
    );
};


// Template 1: Green Thumb
export const LandscapingTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', minHeight: '1056px' }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: style.color }}>
                <div>
                     {business.logoUrl && (
                        <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain"/>
                    )}
                     <h2 className="text-3xl font-bold mt-2" style={{ color: style.color }}>{business.name}</h2>
                     <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h1 className="text-2xl font-bold">{docTitle}</h1>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-8 text-sm">
                 <div className="text-xs space-y-1">
                    <p className="grid grid-cols-[100px_1fr]"><span className="font-bold">{(t.customerName || 'Customer Name')}:</span> <span>{client.name}</span></p>
                    <p className="grid grid-cols-[100px_1fr]"><span className="font-bold">{(t.address || 'Address')}:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                    <p className="grid grid-cols-[100px_1fr]"><span className="font-bold">{(t.phone || 'Phone')}:</span> <span>{client.phone}</span></p>
                    <p className="grid grid-cols-[100px_1fr]"><span className="font-bold">{(t.email || 'E-mail')}:</span> <span>{client.email}</span></p>
                </div>
                <div className="text-xs space-y-1 text-right">
                    <p><span className="font-bold">{(t.estimateNo || 'Estimate Number')}:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">{(t.estimateDate || 'Estimate Date')}:</span> {safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
                </div>
            </section>

             <LandscapingDetails document={document} t={t}/>
            
            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead style={{ backgroundColor: style.color }} className="text-white">
                        <tr>
                            <th className="p-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.totalCost || 'TOTAL COST').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b bg-gray-50/50">
                                <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right font-bold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <div className="w-2/5 text-sm">
                             <table className="w-full">
                                <tbody>
                                    <tr className="border-b"><td className="p-2 font-bold">{(t.subtotal || 'Subtotal')}</td><td className="p-2 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                    {summary.discount > 0 && <tr className="border-b text-red-500"><td className="p-2 font-bold">{(t.discount || 'Discount')}</td><td className="p-2 text-right">-{currencySymbol}{summary.discount.toFixed(2)}</td></tr>}
                                    {summary.shippingCost > 0 && <tr className="border-b"><td className="p-2 font-bold">{(t.shipping || 'Shipping')}</td><td className="p-2 text-right">{currencySymbol}{summary.shippingCost.toFixed(2)}</td></tr>}
                                    <tr className="border-b"><td className="p-2 font-bold">{(t.tax || 'Tax')}</td><td className="p-2 text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                    <tr style={{ backgroundColor: style.color }} className="text-white"><td className="p-2 font-bold text-lg">{(t.totalEstimateCost || 'Total Estimate Cost')}</td><td className="p-2 text-right font-bold text-lg">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                                </tbody>
                             </table>
                        </div>
                    </div>
                    <div className="mt-8 text-xs border p-3">
                         <p className="font-bold mb-1" style={{color: style.color}}>{(t.termsOfService || 'Terms of Services')}</p>
                         <p className="whitespace-pre-line">{document.termsAndConditions.replace(/\{docType\}/gi, docTypeTerm)}</p>
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Modern & Clean
export const LandscapingTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'ESTIMATE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2" style={{ borderColor: style.color }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: style.color }}>{business.name}</h1>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500">{t.client || 'Client'}:</p>
                    <p className="font-semibold">{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{t.estimateNo || 'Estimate #'}:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">{t.date || 'Date'}:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                </div>
            </section>
            
             <LandscapingDetails document={document} t={t}/>

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
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Side Panel Design
export const LandscapingTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'ESTIMATE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <div className="w-1/3 p-8 text-white" style={{ backgroundColor: style.color }}>
                <h1 className="text-3xl font-bold mb-2">{docTitle}</h1>

                <div className="text-sm space-y-6 flex-grow">
                    <div>
                        <p className="font-bold opacity-80 mb-1">{(t.client || 'CLIENT').toUpperCase()}</p>
                        <p className="font-bold text-lg">{client.name}</p>
                        <p>{client.address}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">{(t.details || 'DETAILS').toUpperCase()}</p>
                        <p>#{document.estimateNumber}</p>
                        <p>{(t.date || 'Date')}: {safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                    </div>
                </div>
            </div>
            <div className="w-2/3 p-10 flex flex-col">
                <header className="mb-8 text-right">
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain ml-auto mb-2"/>}
                    <h2 className="text-3xl font-bold">{business.name}</h2>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </header>
                 <LandscapingDetails document={document} t={t}/>
                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b-2 border-gray-300">
                            <tr>
                                <th className="py-2 font-bold w-1/2">{(t.serviceItem || 'SERVICE/ITEM').toUpperCase()}</th>
                                <th className="py-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.price || 'PRICE').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
                                    <td className="py-2 align-top text-center">{item.quantity}</td>
                                    <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="py-2 align-top text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8">
                        <div className="flex justify-end">
                            <div className="w-1/2 text-sm">
                                <div className="flex justify-between p-2 bg-gray-50"><span className="text-gray-600">{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between p-2"><span className="text-gray-600">{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between p-3 font-bold text-base" style={{ backgroundColor: `${style.color}20` }}>
                                    <span>{(t.total || 'Total')}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 4: Elegant Lawn
export const LandscapingTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'Estimate') : (t.estimate || 'Estimate');

    return (
        <div className={`p-10 font-serif bg-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: document.textColor }}>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-sm">{t.landscapingAndGardenDesign || 'Landscaping & Garden Design'}</p>
                 <div className="text-xs mt-1 text-gray-600" style={{color: document.textColor ? `${document.textColor}B3` : undefined}}>
                    <p className="whitespace-pre-line">{business.address}</p>
                    <p>{business.phone} | {business.email}</p>
                    {business.website && <p>{business.website}</p>}
                </div>
            </header>
            <div className="w-full h-px bg-gray-300 mb-8"></div>
            <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
                <div>
                    <p className="font-bold">{t.billedTo || 'Billed To'}:</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                </div>
                <div className="text-right">
                    <p><strong>{docTitle} #:</strong> {document.estimateNumber}</p>
                    <p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
                    <p><strong>{t.validUntil || 'Valid Until'}:</strong> {safeFormat(document.validUntilDate, 'MMMM d, yyyy')}</p>
                </div>
            </section>
            <LandscapingDetails document={document} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b-2 border-t-2">
                            <th className="py-2 w-1/2">{t.service || 'Service'}</th>
                            <th className="py-2 text-center">{t.quantity || 'Qty'}</th>
                            <th className="py-2 text-right">{t.rate || 'Rate'}</th>
                            <th className="py-2 text-right">{t.amount || 'Amount'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="py-2 font-medium whitespace-pre-line">{item.name}</td>
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
                <div className="flex justify-end text-sm">
                    <div className="w-1/3">
                        <p className="flex justify-between py-1"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        {summary.discount > 0 && <p className="flex justify-between py-1 text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                        {summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2"><span>{t.totalDue || 'Total Due'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
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
    );
};

// Template 5: Bold & Green
export const LandscapingTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'Estimate') : (t.estimate || 'Estimate');

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="grid grid-cols-2 gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                 <div className="text-right">
                     <p className="text-3xl font-bold">{docTitle.toUpperCase()}</p>
                     <p className="text-sm">#{document.estimateNumber}</p>
                </div>
            </header>

            <section className="mb-8 p-4 bg-white shadow-sm rounded-md text-xs">
                 <p className="font-bold text-gray-500 mb-2">PROJECT FOR: {client.name}</p>
                 <p className="font-semibold">{document.projectTitle}</p>
                 <p>{client.address}</p>
                 {client.companyName && <p>{client.companyName}</p>}
                 {client.projectLocation && <p>Location: {client.projectLocation}</p>}
            </section>
            
            <LandscapingDetails document={document} t={t}/>

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
                <footer className="mt-auto pt-8 flex justify-between items-end">
                    <div className="text-xs w-1/2">
                        <p className="font-bold">Terms & Conditions:</p>
                        <p className="text-gray-500 whitespace-pre-line">{document.termsAndConditions}</p>
                         <SignatureDisplay signature={document.business.ownerSignature} label="Owner Signature" />
                    </div>
                    <div className="w-1/3 text-sm space-y-1">
                        <p className="flex justify-between p-1"><span>Subtotal</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between p-1"><span>Tax</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between p-2 mt-2 border-t-2 border-black font-bold text-lg"><span>Total</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};
