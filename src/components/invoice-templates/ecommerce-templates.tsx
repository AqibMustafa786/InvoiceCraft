
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

const EcommerceDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.ecommerce) return null;
    const { ecommerce } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.orderDetails || 'Order Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.orderNumber || 'Order #'}:</span> {ecommerce.orderNumber}</p>
                <p><span className="font-semibold text-gray-600">{t.shippingCarrier || 'Carrier'}:</span> {ecommerce.shippingCarrier}</p>
                <p><span className="font-semibold text-gray-600">{t.trackingId || 'Tracking'}:</span> {ecommerce.trackingId}</p>
            </div>
        </section>
    );
};

export const EcommerceTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    // The primary color from the image is orange. Let's use it as the accent.
    const accentColor = '#F97316'; 

    return (
        <div className={`p-0 font-sans text-gray-800 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#FFFFFF', color: '#374151' }}>
            {/* Header Section */}
            <header className="relative text-white" style={{ backgroundColor: accentColor }}>
                <div className="flex justify-between items-center p-10">
                    <div className="w-1/2">
                        <h1 className="text-4xl font-extrabold tracking-tight">CREATE YOUR</h1>
                        <h1 className="text-4xl font-extrabold tracking-tight">OWN STYLE</h1>
                        <p className="text-lg font-light tracking-[0.2em] mt-2">NEW COLLECTION</p>
                    </div>
                    <div className="w-1/2 h-40 relative">
                        <Image src="https://picsum.photos/seed/ecom-fashion/400/200" layout="fill" objectFit="cover" alt="Fashion models" className="rounded-md" data-ai-hint="fashion models" />
                    </div>
                </div>
            </header>

            <div className="p-10">
                {/* Client and Invoice Details */}
                <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                    <div>
                        <p className="font-bold text-lg mb-2">Invoice to: {client.name}</p>
                        <p className="text-xs text-gray-600 whitespace-pre-line">{client.address}</p>
                         {/* This section can be populated with bank details if needed */}
                         <p className="text-xs text-gray-600 mt-2">
                           <span className="font-bold">Bank Details:</span> Add your details here
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex justify-end items-center gap-2 mb-2">
                             <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                             </div>
                             <p className="text-xl font-bold">NEW SALE</p>
                        </div>
                        <p className="text-xs"><span className="font-bold">Invoice#:</span> {invoice.invoiceNumber}</p>
                        <p className="text-xs"><span className="font-bold">Date:</span> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                    </div>
                </section>
                
                <EcommerceDetails invoice={invoice} t={t} />

                {/* Items Table */}
                <main className="flex-grow">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr style={{ backgroundColor: accentColor, color: 'white' }}>
                                <th className="p-2 font-bold w-[5%]">SL.</th>
                                <th className="p-2 font-bold w-[55%]">PLANT DESCRIPTION</th>
                                <th className="p-2 font-bold text-right">PRICE</th>
                                <th className="p-2 font-bold text-center">QTY.</th>
                                <th className="p-2 font-bold text-right">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map((item, index) => (
                                <tr key={item.id} className="border-b" style={{backgroundColor: index % 2 === 0 ? '#F9FAFB' : 'white'}}>
                                    <td className="p-2 text-center">{index + 1}</td>
                                    <td className="p-2 whitespace-pre-line">{item.name}</td>
                                    <td className="p-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-2 text-center">{item.quantity}</td>
                                    <td className="p-2 text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>

                {pageIndex === totalPages - 1 && (
                <footer className="mt-8 pt-8 border-t">
                    <div className="flex justify-between items-end">
                        <div className="text-xs">
                            <p className="font-bold text-lg mb-2">Thank you for your purchase</p>
                            <p className="font-semibold">Payment Info:</p>
                            <p>Account#: 1234567890</p>
                            <p>A/C Name: {business.name}</p>
                            <p>Bank Details: Add your details</p>
                        </div>
                         <div className="w-1/3 text-xs space-y-2">
                            <p className="flex justify-between"><span>SUBTOTAL:</span> <span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>TAX:</span> <span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <div className="p-3 rounded-md text-white font-bold flex justify-between text-base" style={{backgroundColor: accentColor}}>
                                <span>TOTAL:</span>
                                <span>{currencySymbol}{balanceDue.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </footer>
                )}
            </div>
             {pageIndex === totalPages - 1 && (
                <div className="text-center text-gray-500 text-xs font-light tracking-widest p-4 mt-auto">
                    CLOTHES JUST FOR YOU, SHOP YOUR FAVORITE
                </div>
             )}
        </div>
    );
};
