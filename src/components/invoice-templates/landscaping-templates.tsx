
'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';

interface PageProps {
  invoice: Invoice;
  pageItems: LineItem[];
  pageIndex: number;
  totalPages: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  balanceDue: number;
  t: any;
  currencySymbol: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

const safeFormat = (date: Date | string | number | null | undefined, formatString: string) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

const LandscapingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.landscaping) return null;
    const { landscaping } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.landscapingSpecifics || 'Landscaping Specifics')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p className="col-span-full"><span className="font-semibold text-gray-600">{(t.service || 'Service')}:</span> {landscaping.serviceType}</p>
                {landscaping.lawnSquareFootage && <p><span className="font-semibold text-gray-600">{(t.lawnSqFt || 'Lawn Sq Ft')}:</span> {landscaping.lawnSquareFootage}</p>}
                {landscaping.equipmentFee && <p><span className="font-semibold text-gray-600">{(t.equipmentFee || 'Equipment Fee')}:</span> ${landscaping.equipmentFee.toFixed(2)}</p>}
                {landscaping.disposalFee && <p><span className="font-semibold text-gray-600">{(t.disposalFee || 'Disposal Fee')}:</span> ${landscaping.disposalFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};


// Template 1: Based on user-provided image
export const LandscapingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', minHeight: '1056px', color: props.textColor, backgroundColor: props.backgroundColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                     {business.logoUrl && (
                        <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain"/>
                    )}
                     <h2 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h2>
                     <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h1 className="text-2xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h1>
                    <p className="text-sm">{(t.landscapingLawnCare || 'Landscaping & Lawn Care')}</p>
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
                    <p><span className="font-bold">{(t.invoiceNo || 'Invoice Number')}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{(t.invoiceDate || 'Invoice Date')}:</span> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                </div>
            </section>

             <LandscapingDetails invoice={invoice} t={t}/>
            
            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: accentColor }} className="text-white">
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
                                    <tr className="border-b"><td className="p-2 font-bold">{(t.subtotal || 'Subtotal')}</td><td className="p-2 text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                    <tr className="border-b"><td className="p-2 font-bold">{(t.tax || 'Tax')}</td><td className="p-2 text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                    <tr style={{ backgroundColor: accentColor }} className="text-white"><td className="p-2 font-bold text-lg">{(t.total || 'Total')}</td><td className="p-2 text-right font-bold text-lg">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                                </tbody>
                             </table>
                        </div>
                    </div>
                    <div className="mt-8 text-xs border p-3">
                         <p className="font-bold mb-1" style={{color: accentColor}}>{(t.termsOfService || 'Terms of Services')}</p>
                         <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                </footer>
            )}
        </div>
    );
};

// All other templates will just be stubs for now, pointing to the first one.
export const LandscapingTemplate2: React.FC<PageProps> = (props) => <LandscapingTemplate1 {...props} />;
export const LandscapingTemplate3: React.FC<PageProps> = (props) => <LandscapingTemplate1 {...props} />;
export const LandscapingTemplate4: React.FC<PageProps> = (props) => <LandscapingTemplate1 {...props} />;
export const LandscapingTemplate5: React.FC<PageProps> = (props) => <LandscapingTemplate1 {...props} />;
