
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

const PlumbingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.plumbing) return null;
    const { plumbing } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.plumbingDetails || 'Plumbing Details')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.serviceType || 'Service Type')}:</span> {plumbing.serviceType}</p>
                <p><span className="font-semibold text-gray-600">{(t.pipeMaterial || 'Pipe Material')}:</span> {plumbing.pipeMaterial}</p>
                <p><span className="font-semibold text-gray-600">{(t.fixture || 'Fixture')}:</span> {plumbing.fixtureName}</p>
                {plumbing.emergencyFee && <p><span className="font-semibold text-gray-600">{(t.emergencyFee || 'Emergency Fee')}:</span> ${plumbing.emergencyFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Direct Replica
export const PlumbingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-8 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
             <header className="flex justify-between items-start mb-4">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={120} height={60} className="object-contain" />}
                    <h1 className="text-3xl font-bold mt-2" style={{color: accentColor}}>{business.name}</h1>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                    <p className="text-xs text-gray-500">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold mb-1">{(t.from || 'From')}:</p>
                    <p>{business.name}</p>
                    <p className="whitespace-pre-line">{business.address}</p>
                    <p>{business.phone}</p>
                    <p>{business.email}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold mb-1">{(t.billTo || 'Bill to')}:</p>
                    <p>{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                </div>
            </section>
            
            <section className="grid grid-cols-3 gap-4 text-xs mb-8 text-center">
                <div className="p-2 bg-gray-100 rounded">
                    <p className="font-bold text-gray-500">{(t.invoiceDate || 'Invoice Date')}</p>
                    <p>{safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                </div>
                 <div className="p-2 bg-gray-100 rounded">
                    <p className="font-bold text-gray-500">{(t.terms || 'Terms')}</p>
                    <p>{invoice.paymentInstructions.split('\n')[0] || (t.dueOnReceipt || 'Due on receipt')}</p>
                </div>
                 <div className="p-2 bg-gray-100 rounded">
                    <p className="font-bold text-gray-500">{(t.dueDate || 'Due Date')}</p>
                    <p>{safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p>
                </div>
            </section>
            
            <PlumbingDetails invoice={invoice} t={t} />
            
            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: accentColor }} className="text-white">
                            <th className="p-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
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
                        <div className="w-2/5 text-xs space-y-1">
                            <div className="flex justify-between p-1"><span>{(t.subtotal || 'Subtotal')}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between p-1"><span>{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%)</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t" style={{borderColor: accentColor}}>
                                <span>{(t.balanceDue || 'Balance Due')}</span><span style={{color: accentColor}}>{currencySymbol}{balanceDue.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">{(t.notesPaymentInstructions || 'Notes / Payment Instructions')}:</p>
                        <p className="text-gray-600 whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                </footer>
            )}
        </div>
    );
}

export const PlumbingTemplate2: React.FC<PageProps> = (props) => <PlumbingTemplate1 {...props} />;
export const PlumbingTemplate3: React.FC<PageProps> = (props) => <PlumbingTemplate1 {...props} />;
export const PlumbingTemplate4: React.FC<PageProps> = (props) => <PlumbingTemplate1 {...props} />;
export const PlumbingTemplate5: React.FC<PageProps> = (props) => <PlumbingTemplate1 {...props} />;
export const PlumbingTemplate6: React.FC<PageProps> = (props) => <PlumbingTemplate1 {...props} />;
export const PlumbingTemplate7: React.FC<PageProps> = (props) => <PlumbingTemplate1 {...props} />;
export const PlumbingTemplate8: React.FC<PageProps> = (props) => <PlumbingTemplate1 {...props} />;
export const PlumbingTemplate9: React.FC<PageProps> = (props) => <PlumbingTemplate1 {...props} />;
export const PlumbingTemplate10: React.FC<PageProps> = (props) => <PlumbingTemplate1 {...props} />;
