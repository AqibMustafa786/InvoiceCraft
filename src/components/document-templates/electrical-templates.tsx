
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
}

const currencySymbols: { [key: string]: string } = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: '₨' };

const safeFormat = (date: Date | string | number | undefined | null, formatString: string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

const ElectricalDetails: React.FC<{ document: Estimate; textColor: string; }> = ({ document, textColor }) => {
    if (!document.electrical) return null;
    const { electrical } = document;
    return (
        <section className="my-4 text-xs" style={{color: textColor}}>
            <p className="font-bold border-b">Electrical Specifics</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2">
                <p><span className="font-semibold">Service:</span> {electrical.serviceType}</p>
                <p><span className="font-semibold">Wiring:</span> {electrical.wiringType}</p>
                <p><span className="font-semibold">Panel Upgrade:</span> {electrical.panelUpgradeNeeded ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold">Panel Size:</span> {electrical.panelSize}</p>
                {electrical.outletsFixturesCount && <p><span className="font-semibold">Outlets/Fixtures:</span> {electrical.outletsFixturesCount}</p>}
                <p><span className="font-semibold">EV Charger:</span> {electrical.evChargerNeeded ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold">Inspection:</span> {electrical.inspectionRequired ? 'Yes' : 'No'}</p>
                <p className="col-span-full"><span className="font-semibold">Rooms:</span> {electrical.roomsInvolved}</p>
            </div>
        </section>
    );
};


// Template 1: Direct Interpretation
export const ElectricalTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#1E40AF'; // Default to a navy blue
    const docTitle = document.documentType === 'quote' ? 'QUOTE' : 'ESTIMATE';

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', minHeight: '1056px', color: textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold" style={{ color: accentColor }}>{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm" style={{ color: accentColor }}>{category}</p>}
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-8 text-xs">
                <div>
                    <p className="font-bold" style={{color: accentColor}}>Bill To</p>
                    <p className="font-semibold">{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div className="text-right space-y-1">
                    <p><span className="font-bold" style={{color: accentColor}}>Estimate #</span> {document.estimateNumber}</p>
                    <p><span className="font-bold" style={{color: accentColor}}>Estimate date</span> {safeFormat(document.estimateDate, 'dd-MM-yyyy')}</p>
                    <p><span className="font-bold" style={{color: accentColor}}>Due date</span> {safeFormat(document.validUntilDate, 'dd-MM-yyyy')}</p>
                </div>
            </section>
            
            <ElectricalDetails document={document} textColor={textColor || '#374151'}/>

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
                             <div className="flex justify-between p-1"><span>Subtotal</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                             {summary.taxAmount > 0 && <div className="flex justify-between p-1"><span>Sales Tax ({summary.taxPercentage}%)</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>}
                            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2" style={{borderColor: accentColor}}><span>Total ({currency})</span><span style={{color: accentColor}}>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div className="text-xs mt-8">
                        <p className="font-bold" style={{color: accentColor}}>Terms and Conditions</p>
                        <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                     <div className="flex justify-end mt-12">
                        <div className="w-48 text-center">
                            <div className="w-full h-px bg-gray-400"></div>
                            <p className="text-xs mt-1">Customer Signature</p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Header Centered
export const ElectricalTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#0B57D0';
    const docTitle = document.documentType === 'quote' ? 'ESTIMATE' : 'ESTIMATE';

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', color: textColor }}>
            <header className="text-center mb-8">
                {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={80} className="object-contain mx-auto mb-2"/>}
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-xs">{business.address} • {business.phone}</p>
                <div className="mt-4">
                    <h2 className="text-3xl font-bold" style={{ color: accentColor }}>{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm" style={{ color: accentColor }}>{category}</p>}
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs">
                <div><p className="font-bold">Bill To:</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="text-center"><p className="font-bold">Estimate No:</p><p>{document.estimateNumber}</p></div>
                <div className="text-right"><p className="font-bold">Date:</p><p>{safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p></div>
            </section>
            
            <ElectricalDetails document={document} textColor={textColor || '#374151'}/>

            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b-2" style={{borderColor: accentColor}}>
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
                        <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                    <div className="w-1/3 text-sm">
                        <p className="flex justify-between py-1"><span>Subtotal:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between py-1"><span>Tax:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2 border-black"><span>Total:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Minimalist
export const ElectricalTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'Estimate' : 'Estimate';

    return (
        <div className={`p-12 bg-white font-['Garamond',_serif] text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{minHeight: '1056px', color: textColor }}>
            <header className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-light tracking-wider">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light tracking-wider">{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm mt-1">{category}</p>}
                </div>
            </header>

            <section className="flex justify-between mb-10 text-xs">
                 <div>
                    <p className="font-bold mb-1">Prepared For</p>
                    <p>{client.name}</p><p>{client.address}</p>
                </div>
                 <div className="text-right">
                    <p><span className="font-bold">Estimate #</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">Date:</span> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p>
                </div>
            </section>
            
            <ElectricalDetails document={document} textColor={textColor || '#374151'}/>

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
                                <tr><td className="py-1">Subtotal</td><td className="text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                <tr><td className="py-1">Tax</td><td className="text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">Total</td><td className="pt-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Side Accent
export const ElectricalTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'ESTIMATE' : 'ESTIMATE';

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <div className="w-10" style={{ backgroundColor: style.color }}></div>
            <div className="p-10 flex-grow flex flex-col" style={{color: textColor}}>
                <header className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-400">{docTitle}</h2>
                        {category !== 'Generic' && <p className="text-xs text-gray-400">{category}</p>}
                    </div>
                </header>
                 <section className="grid grid-cols-2 gap-4 mb-8 text-xs">
                    <div><p className="font-bold">CLIENT:</p><p>{client.name}, {client.address}</p></div>
                    <div className="text-right"><p className="font-bold">DATE:</p><p>{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p></div>
                </section>

                <ElectricalDetails document={document} textColor={textColor || '#374151'}/>

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
                                <div className="flex justify-between"><span>Tax:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>Total:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Grid Layout
export const ElectricalTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'ESTIMATE' : 'ESTIMATE';

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto',_sans-serif] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{minHeight: '1056px', color: textColor}}>
            <header className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold">{business.name}</h1>
                  <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h1 className="text-2xl font-extrabold" style={{color: style.color}}>{docTitle}</h1>
                    {category !== 'Generic' && <p className="text-sm" style={{color: style.color}}>{category}</p>}
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-8 text-xs p-4 bg-white rounded-lg shadow-sm">
                <div><p className="font-bold text-gray-500">From:</p><p className="font-semibold">{business.name}</p><p>{business.address}</p></div>
                <div><p className="font-bold text-gray-500">To:</p><p className="font-semibold">{client.name}</p><p>{client.address}</p></div>
                <div><p className="font-bold text-gray-500">Estimate No:</p><p>{document.estimateNumber}</p></div>
                <div><p className="font-bold text-gray-500">Date Issued:</p><p>{safeFormat(document.estimateDate, 'MMM d, yyyy')}</p></div>
            </section>
            
            <ElectricalDetails document={document} textColor={textColor || '#374151'}/>

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
                <footer className="mt-auto pt-6 flex justify-end">
                    <div className="w-1/3 text-sm space-y-1">
                        <p className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>Tax</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>Total Estimate</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

    