
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

const PlumbingDetails: React.FC<{ document: Estimate }> = ({ document }) => {
    if (!document.plumbing) return null;
    const { plumbing } = document;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">Plumbing Specifics</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">Service:</span> {plumbing.serviceType}</p>
                <p><span className="font-semibold text-gray-600">Fixture:</span> {plumbing.fixtureType}</p>
                <p><span className="font-semibold text-gray-600">Pipe Material:</span> {plumbing.pipeMaterial}</p>
                <p><span className="font-semibold text-gray-600">Floor:</span> {plumbing.floorLevel}</p>
                <p><span className="font-semibold text-gray-600">Emergency:</span> {plumbing.emergencyService ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold text-gray-600">Pressure Issue:</span> {plumbing.waterPressureIssue ? 'Yes' : 'No'}</p>
                {plumbing.leakLocation && <p className="col-span-full"><span className="font-semibold text-gray-600">Leak Location:</span> {plumbing.leakLocation}</p>}
                {plumbing.estimatedRepairTime && <p><span className="font-semibold text-gray-600">Est. Time:</span> {plumbing.estimatedRepairTime}</p>}
            </div>
        </section>
    );
};


// Template 1: Direct Replica
export const PlumbingTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'PLUMBING QUOTE' : 'PLUMBING ESTIMATE';


    return (
        <div className={`p-8 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: `9pt`, minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-4">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain" />}
                    <p className="text-2xl font-bold">{business.name}</p>
                </div>
                <div className="text-right">
                    <h1 className="text-3xl font-bold">{docTitle.split(' ')[1]}</h1>
                    <p className="text-sm">{docTitle.split(' ')[0]}</p>
                    <p className="text-sm mt-2">DATE: {safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
                    <p className="text-sm">ESTIMATE #: {document.estimateNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div className="p-2 border border-black">
                    <p className="px-2 font-bold text-white bg-black">SERVICE PROVIDER</p>
                    <div className="p-2 space-y-0.5">
                        <p>{business.name}</p>
                        <p>{business.address}</p>
                        <p>{business.phone}</p>
                        <p>{business.email}</p>
                    </div>
                </div>
                <div className="p-2 border border-gray-400">
                     <p className="px-2 font-bold text-white bg-gray-500">CUSTOMER</p>
                    <div className="p-2 space-y-0.5">
                        <p>{client.name}</p>
                        <p>{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                    </div>
                </div>
            </section>
            
            <section className="p-2 border border-t-0 border-black text-xs mb-4">
              <span className="font-bold">PROJECT DESCRIPTION: </span>
              {document.projectTitle}
            </section>
            
            <PlumbingDetails document={document} />

            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="p-1.5 font-bold w-[5%]">ID</th>
                            <th className="p-1.5 font-bold w-[55%]">PLUMBING SERVICE</th>
                            <th className="p-1.5 font-bold text-center">QUANTITY</th>
                            <th className="p-1.5 font-bold text-right">PRICE</th>
                            <th className="p-1.5 font-bold text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-300">
                                <td className="p-1.5 align-top">{index + 1}</td>
                                <td className="p-1.5 align-top whitespace-pre-line">{item.name}</td>
                                <td className="p-1.5 align-top text-center">{item.quantity}</td>
                                <td className="p-1.5 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-1.5 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-4 text-xs">
                     <div className="flex justify-between items-end">
                        <div className="w-1/2">
                             <p className="font-bold">THANK YOU FOR YOUR BUSINESS!</p>
                             <p className="mt-8">Signature/Stamp:</p>
                             <div className="w-48 h-px bg-black mt-8"></div>
                        </div>
                        <div className="w-2/5">
                            <div className="space-y-1">
                                <div className="flex justify-between p-1"><span className="font-bold">SUBTOTAL</span><span className="font-bold">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                                {summary.taxAmount > 0 && <div className="flex justify-between p-1"><span className="font-bold">SALES TAX ({summary.taxPercentage}%)</span><span className="font-bold">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>}
                                {summary.shippingCost > 0 && <div className="flex justify-between p-1"><span className="font-bold">SHIPPING AND HANDLING</span><span className="font-bold">{currencySymbol}{summary.shippingCost.toFixed(2)}</span></div>}
                                <div className="flex justify-between p-2 mt-1 bg-black text-white font-bold text-base"><span>TOTAL</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Modern Blue
export const PlumbingTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#2563EB';
    const docTitle = document.documentType === 'quote' ? 'QUOTE' : 'ESTIMATE';

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-8 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs whitespace-pre-line text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-400">{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm text-gray-400">{category}</p>}
                    <p className="text-sm"># {document.estimateNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 my-4 text-sm">
                <div><p className="font-bold text-gray-500">TO</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="text-center"><p className="font-bold text-gray-500">PROJECT</p><p>{document.projectTitle}</p></div>
                <div className="text-right"><p className="font-bold text-gray-500">DATE</p><p>{safeFormat(document.estimateDate, 'MMM d, yyyy')}</p></div>
            </section>
            
            <PlumbingDetails document={document} />

            <main className="flex-grow mt-4">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr style={{ backgroundColor: accentColor }} className="text-white">
                            <th className="p-2 font-bold w-1/2 rounded-l-md">DESCRIPTION</th>
                            <th className="p-2 font-bold text-center">QTY</th>
                            <th className="p-2 font-bold text-right">UNIT PRICE</th>
                            <th className="p-2 font-bold text-right rounded-r-md">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="p-2 align-top text-center">{item.quantity}</td>
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
                        <div className="w-1/3 text-sm space-y-1">
                             <div className="flex justify-between p-1"><span className="text-gray-600">Subtotal:</span><span className="font-medium">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between p-1"><span className="text-gray-600">Tax:</span><span className="font-medium">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2" style={{ borderColor: accentColor }}><span style={{ color: accentColor }}>Total:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Clean & Minimal
export const PlumbingTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'Plumbing Quote' : 'Plumbing Estimate';

    return (
        <div className={`p-12 bg-white font-['Helvetica'] text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-light tracking-widest">{docTitle.split(' ')[1].toUpperCase()}</h1>
                <p className="text-sm text-gray-500 mt-2">{docTitle.split(' ')[0]} Services by {business.name}</p>
            </header>

            <section className="flex justify-between mb-8 text-xs">
                <div>
                    <p className="font-bold mb-1">Prepared for:</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Estimate #:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">Date:</span> {safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                </div>
            </section>
            
             <PlumbingDetails document={document} />

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-semibold w-1/2 border-b-2 border-gray-300">Service</th>
                            <th className="p-2 font-semibold text-center border-b-2 border-gray-300">Quantity</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">Rate</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">Amount</th>
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
                                <tr><td className="py-1 text-gray-500">Sales Tax</td><td className="text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">TOTAL</td><td className="pt-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Side Panel
export const PlumbingTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'QUOTE' : 'ESTIMATE';

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <div className="w-1/3 p-8 text-white bg-gray-800 flex flex-col">
                <h1 className="text-2xl font-bold mb-2">{docTitle}</h1>
                {category !== 'Generic' && <p className="text-xs mb-8">{category}</p>}
                 <div className="text-xs space-y-4 flex-grow">
                    <div>
                        <p className="font-bold opacity-70 mb-1">ESTIMATE FOR</p>
                        <p className="font-bold text-base">{client.name}</p>
                        <p>{client.address}</p>
                    </div>
                     <div>
                        <p className="font-bold opacity-70 mb-1">FROM</p>
                        <p>{business.name}</p>
                        <p>{business.address}</p>
                    </div>
                     <div>
                        <p className="font-bold opacity-70 mb-1">REFERENCE</p>
                        <p>#{document.estimateNumber}</p>
                        <p>Date: {safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                    </div>
                </div>
                 {pageIndex === totalPages - 1 && (
                    <div className="mt-auto text-xs">
                        <p className="font-bold opacity-70 mb-2">PROJECT</p>
                        <p>{document.projectTitle}</p>
                    </div>
                )}
            </div>
            <div className="w-2/3 p-10 flex flex-col">
                 <PlumbingDetails document={document} />
                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-2 font-bold w-1/2">Service</th>
                                <th className="py-2 font-bold text-center">Qty</th>
                                <th className="py-2 font-bold text-right">Price</th>
                                <th className="py-2 font-bold text-right">Total</th>
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
                            <div className="w-1/2 text-sm">
                                <div className="flex justify-between p-2 bg-gray-50"><span className="text-gray-600">Subtotal:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between p-2"><span className="text-gray-600">Tax:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between p-2 bg-gray-800 text-white font-bold text-base"><span>Total:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Bold Grid
export const PlumbingTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'Estimate' : 'Estimate';

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="grid grid-cols-2 gap-4 mb-10">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold">{business.name}</h1>
                    <p className="text-sm text-gray-500">{docTitle}</p>
                     {category !== 'Generic' && <p className="text-xs text-gray-500">{category}</p>}
                </div>
                 <div className="text-right">
                     <p className="text-lg font-bold">ESTIMATE</p>
                     <p className="text-xs"># {document.estimateNumber}</p>
                     <p className="text-xs">Date: {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                </div>
            </header>

            <section className="mb-8 p-4 bg-white shadow-sm rounded-md text-xs">
                 <p className="font-bold text-gray-500 mb-2">PROJECT FOR: {client.name}</p>
                 <p className="font-semibold">{document.projectTitle}</p>
                 <p>{client.address}</p>
            </section>
            
            <PlumbingDetails document={document} />

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
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <div className="w-1/3 text-sm space-y-1">
                             <div className="flex justify-between p-1"><span>Subtotal</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                             <div className="flex justify-between p-1"><span>Tax</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                             <div className="flex justify-between p-2 mt-2 border-t-2 border-black font-bold text-lg"><span>Total</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};
