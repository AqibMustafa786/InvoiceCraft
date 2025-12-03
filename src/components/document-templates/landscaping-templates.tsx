
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

const LandscapingDetails: React.FC<{ document: Estimate }> = ({ document }) => {
    if (!document.landscaping) return null;
    const { landscaping } = document;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">Landscaping Specifics</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p className="col-span-full"><span className="font-semibold text-gray-600">Service:</span> {landscaping.serviceType}</p>
                <p><span className="font-semibold text-gray-600">Property Size:</span> {landscaping.propertySize}</p>
                <p><span className="font-semibold text-gray-600">Yard Condition:</span> {landscaping.yardCondition}</p>
                {landscaping.grassHeight && <p><span className="font-semibold text-gray-600">Grass Height:</span> {landscaping.grassHeight}</p>}
                {landscaping.treeCount && <p><span className="font-semibold text-gray-600">Tree Count:</span> {landscaping.treeCount}</p>}
                {landscaping.fenceLengthNeeded && <p><span className="font-semibold text-gray-600">Fence Length:</span> {landscaping.fenceLengthNeeded}</p>}
            </div>
        </section>
    );
};


// Template 1: Based on user-provided image
export const LandscapingTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'Landscape Quote' : 'Landscape Estimate';

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', minHeight: '1056px' }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: style.color }}>
                <div className="text-right">
                    <h1 className="text-4xl font-bold">{docTitle.split(' ')[1]}</h1>
                    <p className="text-sm">{docTitle.split(' ')[0]}</p>
                </div>
                <div className="text-right">
                    {business.logoUrl ? (
                        <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain ml-auto"/>
                    ) : (
                        <h2 className="text-2xl font-bold" style={{ color: style.color }}>{business.name}</h2>
                    )}
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-8 text-sm">
                 <div className="text-xs space-y-1">
                    <p className="grid grid-cols-[100px_1fr]"><span className="font-bold">Customer Name:</span> <span>{client.name}</span></p>
                    <p className="grid grid-cols-[100px_1fr]"><span className="font-bold">Address:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                    <p className="grid grid-cols-[100px_1fr]"><span className="font-bold">Phone:</span> <span>{client.phone}</span></p>
                    <p className="grid grid-cols-[100px_1fr]"><span className="font-bold">E-mail:</span> <span>{client.email}</span></p>
                </div>
                <div className="text-xs space-y-1 text-right">
                    <p><span className="font-bold">Estimate Number:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">Estimate Date:</span> {safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
                </div>
            </section>

             <LandscapingDetails document={document} />
            
            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: style.color }} className="text-white">
                            <th className="p-2 font-bold w-1/2">DESCRIPTION</th>
                            <th className="p-2 font-bold text-center">QTY</th>
                            <th className="p-2 font-bold text-right">UNIT PRICE</th>
                            <th className="p-2 font-bold text-right">TOTAL COST</th>
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
                                    <tr className="border-b"><td className="p-2 font-bold">Subtotal</td><td className="p-2 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                    <tr className="border-b"><td className="p-2 font-bold">Tax</td><td className="p-2 text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                    <tr style={{ backgroundColor: style.color }} className="text-white"><td className="p-2 font-bold text-lg">Total Estimate Cost</td><td className="p-2 text-right font-bold text-lg">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                                </tbody>
                             </table>
                        </div>
                    </div>
                    <div className="mt-8 text-xs border p-3">
                         <p className="font-bold mb-1" style={{color: style.color}}>Terms of Services</p>
                         <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Modern & Clean
export const LandscapingTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'ESTIMATE' : 'ESTIMATE';

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px' }}>
            <header className="flex justify-between items-center mb-10 pb-4 border-b-2 border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: style.color }}>{business.name}</h1>
                    <p className="text-xs text-gray-500">Landscaping Services</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light text-gray-400">{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm text-gray-400">{category}</p>}
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500">Client:</p>
                    <p className="font-semibold">{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div>
                     <p className="font-bold text-gray-500">Project:</p>
                     <p className="font-semibold">{document.projectTitle}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Estimate #:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">Date:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                </div>
            </section>
            
             <LandscapingDetails document={document} />

            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-1/2">DESCRIPTION</th>
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
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <div className="w-1/3 text-sm space-y-1">
                            <p className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>Tax:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black"><span>Total:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Side Panel Design
export const LandscapingTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'ESTIMATE' : 'ESTIMATE';

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <div className="w-1/3 p-8 text-white" style={{ backgroundColor: style.color }}>
                <h1 className="text-3xl font-bold mb-2">{docTitle}</h1>
                {category !== 'Generic' && <p className="text-sm mb-8">{category}</p>}

                <div className="text-sm space-y-6 flex-grow">
                    <div>
                        <p className="font-bold opacity-80 mb-1">CLIENT</p>
                        <p className="font-bold text-lg">{client.name}</p>
                        <p>{client.address}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">PROJECT</p>
                        <p>{document.projectTitle}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">DETAILS</p>
                        <p>#{document.estimateNumber}</p>
                        <p>Date: {safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                    </div>
                </div>
            </div>
            <div className="w-2/3 p-10 flex flex-col">
                <header className="mb-8">
                    <h2 className="text-2xl font-bold">{business.name}</h2>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </header>
                 <LandscapingDetails document={document} />
                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b-2 border-gray-300">
                            <tr>
                                <th className="py-2 font-bold w-1/2">SERVICE/ITEM</th>
                                <th className="py-2 font-bold text-center">QTY</th>
                                <th className="py-2 font-bold text-right">PRICE</th>
                                <th className="py-2 font-bold text-right">TOTAL</th>
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
                                <div className="flex justify-between p-2 bg-gray-50"><span className="text-gray-600">Subtotal:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between p-2"><span className="text-gray-600">Tax:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between p-2 font-bold text-base" style={{ backgroundColor: `${style.color}20` }}>
                                    <span>Total:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 4: Minimalist Elegant
export const LandscapingTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'Estimate' : 'Estimate';

    return (
        <div className={`p-12 bg-white font-['Garamond',_serif] text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="mb-16 text-center">
                <h1 className="text-5xl font-light tracking-widest">{docTitle.toUpperCase()}</h1>
                {category !== 'Generic' && <p className="text-sm text-gray-500">{category}</p>}
                <p className="text-sm text-gray-500 mt-2">{business.name}</p>
            </header>

            <section className="flex justify-between mb-10 text-xs">
                <div><p className="font-bold mb-1">To:</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="text-right"><p><span className="font-bold">No:</span> {document.estimateNumber}</p><p><span className="font-bold">Date:</span> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p></div>
            </section>
            
             <LandscapingDetails document={document} />

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-semibold w-3/5 border-b-2 border-gray-300">Item</th>
                            <th className="p-2 font-semibold text-center border-b-2 border-gray-300">Quantity</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">Rate</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}><td className="p-2 border-b border-gray-200 whitespace-pre-line">{item.name}</td><td className="p-2 border-b border-gray-200 text-center">{item.quantity}</td><td className="p-2 border-b border-gray-200 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="p-2 border-b border-gray-200 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>
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
                                <tr><td className="py-1 text-gray-500">Tax</td><td className="text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">TOTAL</td><td className="pt-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 5: Bold & Green
export const LandscapingTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'Landscape Estimate' : 'Landscape Estimate';

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="grid grid-cols-2 gap-4 mb-8">
                <div className="space-y-1">
                  <h1 className="text-4xl font-extrabold" style={{ color: style.color }}>{docTitle.split(' ')[0]}</h1>
                  <p className="text-2xl font-extrabold" style={{ color: style.color }}>{docTitle.split(' ')[1]}</p>
                </div>
                <div className="text-right"><p className="text-lg font-bold">{business.name}</p><p className="text-xs">{business.address}</p></div>
            </header>

            <section className="mb-8 p-4 bg-white shadow-sm rounded-md text-xs">
                 <p className="font-bold text-gray-500 mb-2">PROJECT FOR: {client.name}</p>
                 <p className="font-semibold">{document.projectTitle}</p>
                 <p>{client.address}</p>
            </section>
            
             <LandscapingDetails document={document} />

            <main className="flex-grow bg-white p-4 rounded-md shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-3/5">DESCRIPTION</th>
                            <th className="py-2 font-bold text-center">QTY</th>
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
