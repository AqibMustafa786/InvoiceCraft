
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
            <p className="font-bold text-gray-500 mb-2 border-b">{t.plumbingDetails || 'Plumbing Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {plumbing.serviceType}</p>
                <p><span className="font-semibold text-gray-600">{t.pipeMaterial || 'Pipe Material'}:</span> {plumbing.pipeMaterial}</p>
                <p><span className="font-semibold text-gray-600">{t.fixture || 'Fixture'}:</span> {plumbing.fixtureName}</p>
                {plumbing.emergencyFee && <p><span className="font-semibold text-gray-600">{t.emergencyFee || 'Emergency Fee'}:</span> ${plumbing.emergencyFee.toFixed(2)}</p>}
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
                    <p>{(invoice.paymentInstructions || '').split('\n')[0] || (t.dueOnReceipt || 'Due on receipt')}</p>
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

// Template 2: Modern Blue
export const PlumbingTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-8 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-4xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs whitespace-pre-line text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 my-4 text-sm">
                <div><p className="font-bold text-gray-500">{(t.to || 'TO')}</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="text-center"><p className="font-bold text-gray-500">{(t.project || 'PROJECT')}</p><p>{invoice.poNumber || 'N/A'}</p></div>
                <div className="text-right"><p className="font-bold text-gray-500">{(t.date || 'DATE')}</p><p>{safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p></div>
            </section>
            
            <PlumbingDetails invoice={invoice} t={t} />

            <main className="flex-grow mt-4">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr style={{ backgroundColor: accentColor }} className="text-white">
                            <th className="p-2 font-bold w-1/2 rounded-l-md">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right rounded-r-md">{(t.total || 'TOTAL').toUpperCase()}</th>
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
                             <div className="flex justify-between p-1"><span className="text-gray-600">{(t.subtotal || 'Subtotal')}:</span><span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between p-1"><span className="text-gray-600">{(t.tax || 'Tax')}:</span><span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2" style={{ borderColor: accentColor }}><span style={{ color: accentColor }}>{(t.total || 'Total')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Clean & Minimal
export const PlumbingTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, t, currencySymbol } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-12 bg-white font-['Helvetica'] text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-12 text-center">
                <div className="text-left">
                    <h1 className="text-4xl font-bold">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light tracking-widest">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                </div>
            </header>

            <section className="flex justify-between mb-8 text-xs">
                <div>
                    <p className="font-bold mb-1">{(t.preparedFor || 'Prepared for')}:</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{(t.invoiceNo || 'Invoice #')}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{(t.date || 'Date')}:</span> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                </div>
            </section>
            
             <PlumbingDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-semibold w-1/2 border-b-2 border-gray-300">{(t.service || 'Service').toUpperCase()}</th>
                            <th className="p-2 font-semibold text-center border-b-2 border-gray-300">{(t.quantity || 'Quantity').toUpperCase()}</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">{(t.rate || 'Rate').toUpperCase()}</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">{(t.amount || 'Amount').toUpperCase()}</th>
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
                                <tr><td className="py-1 text-gray-500">{(t.subtotal || 'Subtotal')}</td><td className="text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                <tr><td className="py-1 text-gray-500">{(t.salesTax || 'Sales Tax')}</td><td className="text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">{(t.total || 'TOTAL').toUpperCase()}</td><td className="pt-2 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Side Panel
export const PlumbingTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, t, currencySymbol } = props;
    const { business, client } = invoice;

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="w-1/3 p-8 text-white bg-gray-800 flex flex-col">
                 <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
                <div className="text-xs space-y-4 flex-grow">
                    <div>
                        <p className="font-bold opacity-70 mb-1">{(t.invoiceFor || 'INVOICE FOR').toUpperCase()}</p>
                        <p className="font-bold text-base">{client.name}</p>
                        <p>{client.address}</p>
                    </div>
                     <div>
                        <p className="font-bold opacity-70 mb-1">{(t.from || 'FROM').toUpperCase()}</p>
                        <p>{business.address}</p>
                    </div>
                     <div>
                        <p className="font-bold opacity-70 mb-1">{(t.reference || 'REFERENCE').toUpperCase()}</p>
                        <p>#{invoice.invoiceNumber}</p>
                        <p>{(t.date || 'Date')}: {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                    </div>
                </div>
            </div>
            <div className="w-2/3 p-10 flex flex-col">
                <div className='flex justify-end mb-4'>
                    <div className="text-right">
                        <h2 className='text-2xl font-bold'>{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                    </div>
                </div>
                 <PlumbingDetails invoice={invoice} t={t} />
                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-2 font-bold w-1/2">{(t.service || 'Service').toUpperCase()}</th>
                                <th className="py-2 font-bold text-center">{(t.qty || 'Qty').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.price || 'Price').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.total || 'Total').toUpperCase()}</th>
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
                                <div className="flex justify-between p-2 bg-gray-50"><span className="text-gray-600">{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between p-2"><span className="text-gray-600">{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between p-2 bg-gray-800 text-white font-bold text-base"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Bold Grid
export const PlumbingTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, t, currencySymbol } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="grid grid-cols-2 gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                 <div className="text-right">
                     <p className="text-3xl font-bold">{(t.invoice || 'Invoice')}</p>
                </div>
            </header>

            <section className="mb-8 p-4 bg-white shadow-sm rounded-md text-xs">
                 <p className="font-bold text-gray-500 mb-2">{(t.projectFor || 'PROJECT FOR').toUpperCase()}: {client.name}</p>
                 <p className="font-semibold">{invoice.poNumber || 'N/A'}</p>
                 <p>{client.address}</p>
            </section>
            
            <PlumbingDetails invoice={invoice} t={t} />

            <main className="flex-grow bg-white p-4 rounded-md shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-[60%]">{(t.descriptionOfWork || 'Description of Work').toUpperCase()}</th>
                            <th className="py-2 font-bold text-center">{(t.qty || 'Qty').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.cost || 'Cost').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.total || 'Total').toUpperCase()}</th>
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
                             <div className="flex justify-between p-1"><span>{(t.subtotal || 'Subtotal')}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                             <div className="flex justify-between p-1"><span>{(t.tax || 'Tax')}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                             <div className="flex justify-between p-2 mt-2 border-t-2 border-black font-bold text-lg"><span>{(t.total || 'Total')}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export const PlumbingTemplate6: React.FC<PageProps> = (props) => <PlumbingTemplate1 {...props} />;
export const PlumbingTemplate7: React.FC<PageProps> = (props) => <PlumbingTemplate2 {...props} />;
export const PlumbingTemplate8: React.FC<PageProps> = (props) => <PlumbingTemplate3 {...props} />;
export const PlumbingTemplate9: React.FC<PageProps> = (props) => <PlumbingTemplate4 {...props} />;
export const PlumbingTemplate10: React.FC<PageProps> = (props) => <PlumbingTemplate5 {...props} />;
