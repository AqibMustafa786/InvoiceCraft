

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

const RoofingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.roofing) return null;
    const { roofing } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.roofingDetails || 'Roofing Details')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.roofType || 'Roof Type')}:</span> {roofing.roofType}</p>
                {roofing.squareFootage && <p><span className="font-semibold text-gray-600">{(t.sqFt || 'Sq Ft')}:</span> {roofing.squareFootage}</p>}
                <p><span className="font-semibold text-gray-600">{(t.pitch || 'Pitch')}:</span> {roofing.pitch}</p>
                <p><span className="font-semibold text-gray-600">{(t.tearOff || 'Tear-off')}:</span> {roofing.tearOffRequired ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold text-gray-600">{(t.underlayment || 'Underlayment')}:</span> {roofing.underlaymentType}</p>
                {roofing.dumpsterFee && <p><span className="font-semibold text-gray-600">{(t.disposalFee || 'Disposal Fee')}:</span> ${roofing.dumpsterFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Direct Interpretation from Image
export const RoofingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;

    return (
        <div className={`bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Lato, sans-serif', fontSize: `10pt`, minHeight: '1056px' }}>
            <header className="p-10 flex justify-between items-start">
                 <div>
                     {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="object-contain" />}
                     <h1 className="text-3xl font-bold mt-2">{business.name}</h1>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold tracking-wider">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                </div>
            </header>

            <div className="p-10 pt-0 flex-grow">
                 <section className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-2 gap-8 text-xs">
                    <div>
                        <p className="font-bold text-gray-500 mb-2">Customer Information</p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="text-gray-500">Name:</span> <span className="font-semibold">{client.name}</span></p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="text-gray-500">Address:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="text-gray-500">Email:</span> <span>{client.email}</span></p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="text-gray-500">Phone:</span> <span>{client.phone}</span></p>
                    </div>
                    <div>
                         <p className="font-bold text-gray-500 mb-2">Property & Project Information</p>
                         <p className="grid grid-cols-[120px_1fr]"><span className="text-gray-500">Address:</span> <span className="font-semibold whitespace-pre-line">{client.shippingAddress || client.address}</span></p>
                    </div>
                </section>
                
                 {invoice.roofing && (
                    <section className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-xs">
                        <p className="font-bold text-gray-500 mb-2">Project Details</p>
                        <RoofingDetails invoice={invoice} t={t}/>
                    </section>
                )}


                <section className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-xs">
                    <p className="font-bold text-gray-500 mb-2">Description of Work</p>
                    <p className="text-gray-700 whitespace-pre-line">{invoice.poNumber || 'N/A'}</p>
                </section>
                
                <main>
                    <table className="w-full text-left text-sm">
                        <thead style={{ backgroundColor: '#374151' }} className="text-white text-xs">
                            <tr>
                                <th className="p-2 font-bold w-1/2">DESCRIPTION</th>
                                <th className="p-2 font-bold text-center">QTY</th>
                                <th className="p-2 font-bold text-right">UNIT PRICE</th>
                                <th className="p-2 font-bold text-right">SUBTOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b bg-gray-50">
                                    <td className="p-2 align-top text-xs whitespace-pre-line">{item.name}</td>
                                    <td className="p-2 align-top text-center text-xs">{item.quantity}</td>
                                    <td className="p-2 align-top text-right text-xs">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-2 align-top text-right text-xs font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        {pageIndex === totalPages - 1 &&
                            <tfoot>
                                 <tr>
                                    <td colSpan={3} className="p-2 text-right font-bold text-base">Total Estimated Cost</td>
                                    <td className="p-2 text-right font-bold text-base">{currencySymbol}{balanceDue.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        }
                    </table>
                </main>
            </div>
        </div>
    );
};


// Template 2: Light and Professional
export const RoofingTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500 mb-1">Customer:</p>
                    <p className="font-semibold">{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Invoice #:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">Date:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                </div>
            </section>

             {invoice.roofing && (
                <section className="mb-8 p-4 bg-gray-50 rounded-md text-xs">
                    <p className="font-bold text-gray-500 mb-2">Project Details</p>
                    <RoofingDetails invoice={invoice} t={t}/>
                </section>
            )}
            
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
                                <td className="py-2 align-top">{item.name}</td>
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
                            <p className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black"><span>Total:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Blue-tinted Grid
export const RoofingTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="object-contain" />}
                    <h1 className="text-4xl font-extrabold mt-2" style={{color: accentColor}}>{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs p-4 bg-white rounded-lg shadow-sm">
                <div><p className="font-bold text-gray-500">Client:</p><p>{client.name}<br/>{client.address}</p></div>
                <div><p className="font-bold text-gray-500">Project Location:</p><p>{invoice.client.shippingAddress || client.address}</p></div>
                <div><p className="font-bold text-gray-500">Reference:</p><p>#{invoice.invoiceNumber}<br/>Date: {safeFormat(invoice.invoiceDate, 'dd-MMM-yyyy')}</p></div>
            </section>
            
             {invoice.roofing && (
                <section className="mb-8 p-4 bg-white rounded-lg shadow-sm text-xs">
                    <p className="font-bold text-gray-500 mb-2">Roofing Specifications</p>
                    <RoofingDetails invoice={invoice} t={t}/>
                </section>
            )}

            <main className="flex-grow bg-white p-4 rounded-lg shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: `${accentColor}1A`}} className="border-b-2" style={{ borderColor: accentColor }}><th className="py-2 px-2 font-bold w-[50%]">Item Description</th><th className="py-2 px-2 font-bold text-center">Qty</th><th className="py-2 px-2 font-bold text-right">Price</th><th className="py-2 px-2 font-bold text-right">Total</th></tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 px-2 align-top">{item.name}</td>
                                <td className="py-2 px-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 px-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 px-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                 <footer className="mt-auto pt-6 flex justify-end">
                    <div className="w-2/5 text-sm space-y-1">
                        <p className="flex justify-between p-1"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between p-1"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-gray-300"><span>Total Due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};


export const RoofingTemplate4: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
export const RoofingTemplate5: React.FC<PageProps> = (props) => <RoofingTemplate2 {...props} />;
export const RoofingTemplate6: React.FC<PageProps> = (props) => <RoofingTemplate3 {...props} />;
export const RoofingTemplate7: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
export const RoofingTemplate8: React.FC<PageProps> = (props) => <RoofingTemplate2 {...props} />;
export const RoofingTemplate9: React.FC<PageProps> = (props) => <RoofingTemplate3 {...props} />;
export const RoofingTemplate10: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
