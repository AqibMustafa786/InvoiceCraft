
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

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8">
            <p className="text-xs text-gray-500">{label}</p>
            <Image src={signature.image} alt={label} width={150} height={75} className="mt-1" />
            <p className="text-xs border-t border-gray-400 pt-1 w-[150px]">{signature.signerName}</p>
        </div>
    );
}

// Base Template inspired by user image
export const HVACTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    
    return (
        <div className={`p-8 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: `9pt`, minHeight: '1056px' }}>
            <header className="flex justify-between items-center pb-4 border-b-2" style={{ borderColor: style.color }}>
                <div className="flex items-center gap-4">
                     {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={50} height={50} className="object-contain" />}
                    <div>
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                        <p className="text-xs text-gray-500">{business.email} | {business.phone}</p>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-700">HVAC ESTIMATE</h2>
            </header>

            <section className="grid grid-cols-2 gap-4 my-6 text-xs border-b pb-6">
                <div>
                    <p className="font-bold text-gray-500 mb-1">SERVICE CONTRACTOR</p>
                    <p>{business.name}</p>
                    <p className="whitespace-pre-line">{business.address}</p>
                    <p>{business.email}</p>
                    <p>{business.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                    <p className="font-bold text-gray-500 mb-1">CLIENT INFORMATION</p>
                    <p>{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                </div>
            </section>
            
            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: `${style.color}20`}}>
                            <th className="p-2 font-bold w-1/6">SERVICE NO.</th>
                            <th className="p-2 font-bold w-2/5">DESCRIPTION</th>
                            <th className="p-2 font-bold text-center">QUANTITY</th>
                            <th className="p-2 font-bold text-right">UNIT COST</th>
                            <th className="p-2 font-bold text-right">SUB-TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="p-2 align-top">{`SRVC-${String(index + 1).padStart(4,'0')}`}</td>
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
                <footer className="mt-auto pt-6 flex justify-between items-end">
                    <div className="w-1/2 text-xs text-gray-600">
                        <p className="font-bold mb-1" style={{ color: style.color }}>TERMS & CONDITION:</p>
                        <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                     <div className="w-2/5">
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between p-1"><span className="text-gray-600">Sub-total:</span><span className="font-medium">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between p-1"><span className="text-gray-600">Tax ({summary.taxPercentage}%):</span><span className="font-medium">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between p-2 mt-1 border-t-2 border-gray-400 font-bold" style={{ color: style.color }}><span className="text-base">TOTAL ESTIMATE COST:</span><span className="text-base">{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                        <div className="mt-8 text-center">
                            <SignatureDisplay signature={document.clientSignature} label="RECEIVER'S NAME OVER PRINTED NAME" />
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 2: Blue Accents, Modern
export const HVACTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#3B82F6';

    return (
        <div className={`p-8 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Inter, sans-serif', fontSize: `9pt`, minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold">HVAC Estimate</h2>
                    <p className="text-xs">#{document.estimateNumber}</p>
                    <p className="text-xs mt-1">Date: {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-6 text-xs">
                <div className="space-y-1">
                    <p className="font-bold text-gray-400 tracking-wider">PREPARED FOR</p>
                    <p className="font-bold">{client.name}</p>
                    <p>{client.address}</p>
                    <p>{client.email}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-bold text-gray-400 tracking-wider">PROJECT LOCATION</p>
                    <p>{document.projectTitle}</p>
                    <p>{client.projectLocation || client.address}</p>
                </div>
            </section>
            
            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2" style={{ borderColor: accentColor }}>
                            <th className="p-2 font-bold w-1/2">DESCRIPTION</th>
                            <th className="p-2 font-bold text-center">QTY</th>
                            <th className="p-2 font-bold text-right">UNIT PRICE</th>
                            <th className="p-2 font-bold text-right">TOTAL</th>
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
                            <div className="flex justify-between p-1"><span className="text-gray-500">Subtotal</span><span className="">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between p-1"><span className="text-gray-500">Tax</span><span className="">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between p-2 mt-2 font-bold text-white rounded" style={{ backgroundColor: accentColor }}>
                                <span className="text-base">Total</span>
                                <span className="text-base">{currencySymbol}{summary.grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-xs text-gray-500">
                        <p className="font-bold text-gray-400 tracking-wider">NOTES</p>
                        <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Clean & Grid-based
export const HVACTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Roboto, sans-serif', fontSize: `9pt`, minHeight: '1056px' }}>
            <header className="mb-10">
                <h1 className="text-4xl font-light tracking-wide">Estimate</h1>
                <p className="text-sm" style={{ color: style.color }}>For HVAC Services</p>
            </header>

            <section className="mb-8 p-4 border rounded-md grid grid-cols-3 gap-4 text-xs">
                <div><p className="font-bold text-gray-500">From:</p><p className="font-bold">{business.name}</p><p>{business.address}</p></div>
                <div><p className="font-bold text-gray-500">To:</p><p className="font-bold">{client.name}</p><p>{client.address}</p></div>
                <div><p className="font-bold text-gray-500">Details:</p><p># {document.estimateNumber}</p><p>Date: {safeFormat(document.estimateDate, 'MM-dd-yyyy')}</p></div>
            </section>
            
            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 font-bold w-1/2">SERVICE DESCRIPTION</th>
                            <th className="p-2 font-bold text-center">QUANTITY</th>
                            <th className="p-2 font-bold text-right">RATE</th>
                            <th className="p-2 font-bold text-right">AMOUNT</th>
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
                 <footer className="mt-auto pt-8 flex justify-between items-start">
                     <div className="w-1/2 text-xs text-gray-500">
                         <p className="font-bold text-gray-700 mb-1">TERMS</p>
                         <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                     </div>
                     <div className="w-1/3 text-right text-sm">
                         <p className="py-1 flex justify-between"><span className="text-gray-500">Subtotal:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                         <p className="py-1 flex justify-between"><span className="text-gray-500">Tax:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                         <p className="py-2 mt-2 flex justify-between border-t-2 border-black font-bold text-base"><span>TOTAL:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                     </div>
                 </footer>
            )}
        </div>
    );
};

// Template 4: Corporate Blue
export const HVACTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className={`bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: `9pt`, minHeight: '1056px' }}>
            <div className="p-10">
                <header className="flex justify-between items-center pb-5 mb-5 border-b-8" style={{ borderColor: style.color }}>
                    <h1 className="text-3xl font-extrabold">{business.name}</h1>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-500">ESTIMATE</h2>
                        <p className="text-xs"># {document.estimateNumber}</p>
                    </div>
                </header>
                
                <section className="grid grid-cols-2 gap-4 mb-8 text-xs">
                    <div className="space-y-0.5"><p className="font-bold">CLIENT:</p><p>{client.name}</p><p>{client.address}</p></div>
                    <div className="text-right space-y-0.5"><p className="font-bold">DATE:</p><p>{safeFormat(document.estimateDate, 'MMMM dd, yyyy')}</p></div>
                </section>
                
                <main className="flex-grow">
                     <table className="w-full text-left text-xs">
                        <thead className="border-b-2 border-gray-300">
                            <tr>
                                <th className="pb-2 font-bold w-1/2">SERVICE</th>
                                <th className="pb-2 font-bold text-center">QTY</th>
                                <th className="pb-2 font-bold text-right">UNIT PRICE</th>
                                <th className="pb-2 font-bold text-right">SUBTOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-200">
                                    <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
                                    <td className="py-2 align-top text-center">{item.quantity}</td>
                                    <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="py-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </div>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto">
                    <div className="p-10 bg-gray-50">
                        <div className="flex justify-end mb-4">
                            <table className="w-2/5 text-xs">
                                <tbody>
                                    <tr><td className="py-1">Subtotal</td><td className="py-1 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                    <tr><td className="py-1">Tax ({summary.taxPercentage}%)</td><td className="py-1 text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                    <tr className="font-bold text-lg"><td className="py-2 border-t-2 border-black">Total</td><td className="py-2 border-t-2 border-black text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-gray-500 text-center whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 5: Minimal with side details
export const HVACTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Helvetica, sans-serif', fontSize: `9pt`, minHeight: '1056px' }}>
            <div className="w-1/4 pr-8 border-r border-gray-200">
                <h1 className="text-2xl font-bold" style={{ color: style.color }}>ESTIMATE</h1>
                {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="mt-4 object-contain" />}
                <div className="text-xs mt-8 space-y-4">
                    <div><p className="font-bold text-gray-500">Estimate #</p><p>{document.estimateNumber}</p></div>
                    <div><p className="font-bold text-gray-500">Date</p><p>{safeFormat(document.estimateDate, 'MMM d, yyyy')}</p></div>
                    <div><p className="font-bold text-gray-500">From</p><p>{business.name}</p><p>{business.address}</p></div>
                    <div><p className="font-bold text-gray-500">To</p><p>{client.name}</p><p>{client.address}</p></div>
                </div>
            </div>
            <div className="w-3/4 pl-8 flex flex-col">
                <main className="flex-grow">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr>
                                <th className="pb-2 font-bold w-1/2 border-b-2 border-gray-300">ITEM/SERVICE</th>
                                <th className="pb-2 font-bold text-center border-b-2 border-gray-300">QTY</th>
                                <th className="pb-2 font-bold text-right border-b-2 border-gray-300">UNIT PRICE</th>
                                <th className="pb-2 font-bold text-right border-b-2 border-gray-300">LINE TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id}>
                                    <td className="py-2 border-b border-gray-100 whitespace-pre-line">{item.name}</td>
                                    <td className="py-2 border-b border-gray-100 text-center">{item.quantity}</td>
                                    <td className="py-2 border-b border-gray-100 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="py-2 border-b border-gray-100 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                     <footer className="mt-auto pt-8">
                         <div className="flex justify-end">
                            <div className="w-1/2 text-sm space-y-2">
                                 <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                                 <div className="flex justify-between"><span className="text-gray-600">Tax:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                                 <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-800"><span>Total Estimate:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};
