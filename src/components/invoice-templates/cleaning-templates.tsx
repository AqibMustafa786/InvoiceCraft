
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

const CleaningDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.cleaning) return null;
    const { cleaning } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.cleaningSpecifics || 'Cleaning Specifics')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.cleaningType || 'Type')}:</span> {cleaning.cleaningType}</p>
                <p><span className="font-semibold text-gray-600">{(t.schedule || 'Schedule')}:</span> {cleaning.recurringSchedule}</p>
                {cleaning.squareFootage && <p><span className="font-semibold text-gray-600">{(t.sqFt || 'Sq Ft')}:</span> {cleaning.squareFootage}</p>}
                {cleaning.numberOfRooms && <p><span className="font-semibold text-gray-600">{(t.rooms || 'Rooms')}:</span> {cleaning.numberOfRooms}</p>}
                {cleaning.suppliesFee && <p><span className="font-semibold text-gray-600">{(t.suppliesFee || 'Supplies Fee')}:</span> ${cleaning.suppliesFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Direct interpretation of user image
export const CleaningTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, t, currencySymbol, accentColor, balanceDue } = props;
    const { business, client } = invoice;
    
    return (
        <div className={`bg-white font-sans text-gray-800 flex flex-col relative ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: `10pt`, minHeight: '1056px', color: props.textColor, backgroundColor: props.backgroundColor }}>
            <div className="absolute top-0 left-0 right-0 h-48" style={{ backgroundColor: accentColor, clipPath: 'ellipse(100% 70% at 50% 0%)' }}></div>
            <div className="p-10 relative z-10 flex-grow flex flex-col">
                <header className="flex justify-between items-start mb-8 text-white">
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs whitespace-pre-line">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                        <p className="text-sm">{(t.cleaningService || 'Cleaning Service')}</p>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-4 mb-8 text-xs p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                    <div>
                        <p className="font-bold text-base mb-2">{(t.companyInformation || 'Company Information')}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.companyName || 'Company Name')}:</span> {business.name}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.address || 'Address')}:</span> <span className="whitespace-pre-line">{business.address}</span></p>
                        <p><span className="font-bold w-24 inline-block">{(t.phone || 'Phone')}:</span> {business.phone}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.email || 'Email')}:</span> {business.email}</p>
                    </div>
                    <div>
                        <p className="font-bold text-base mb-2">{(t.customerInformation || 'Customer Information')}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.customerName || 'Customer Name')}:</span> {client.name}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.address || 'Address')}:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                        <p><span className="font-bold w-24 inline-block">{(t.phone || 'Phone')}:</span> {client.phone}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.email || 'Email')}:</span> {client.email}</p>
                    </div>
                </section>
                
                 <CleaningDetails invoice={invoice} t={t} />

                <main className="flex-grow">
                     <table className="w-full text-left text-xs">
                        <thead style={{ backgroundColor: accentColor }} className="text-white">
                            <tr>
                                <th className="p-2 font-bold w-12">{(t.no || 'No')}</th>
                                <th className="p-2 font-bold w-3/5">{(t.serviceDescription || 'Service Description')}</th>
                                <th className="p-2 font-bold text-center">{(t.quantity || 'Quantity')}</th>
                                <th className="p-2 font-bold text-right">{(t.unitPrice || 'Unit Price')}</th>
                                <th className="p-2 font-bold text-right">{(t.total || 'Total')}</th>
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
                             <table className="w-1/3 text-sm">
                                <tbody>
                                    <tr className="border-t-2"><td className="p-2 text-right font-bold">{(t.subtotal || 'Subtotal')}</td><td className="p-2 text-right font-bold" style={{backgroundColor: accentColor, color: 'white'}}>{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                </tbody>
                             </table>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// All other templates will just be stubs for now, pointing to the first one.
export const CleaningTemplate2: React.FC<PageProps> = (props) => <CleaningTemplate1 {...props} />;
export const CleaningTemplate3: React.FC<PageProps> = (props) => <CleaningTemplate1 {...props} />;
export const CleaningTemplate4: React.FC<PageProps> = (props) => <CleaningTemplate1 {...props} />;
export const CleaningTemplate5: React.FC<PageProps> = (props) => <CleaningTemplate1 {...props} />;
