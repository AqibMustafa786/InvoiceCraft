
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
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.orderDetails || 'Order Details')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.orderNumber || 'Order #')}:</span> {ecommerce.orderNumber}</p>
                <p><span className="font-semibold text-gray-600">{(t.shippingCarrier || 'Carrier')}:</span> {ecommerce.shippingCarrier}</p>
                <p><span className="font-semibold text-gray-600">{(t.trackingId || 'Tracking ID')}:</span> {ecommerce.trackingId}</p>
            </div>
        </section>
    );
};

export const EcommerceTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={120} height={60} className="object-contain" /> : <h1 className="text-3xl font-bold">{business.name}</h1>}
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold" style={{color: accentColor}}>{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                    <p>#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                <div><p className="font-bold text-gray-500">{(t.billedTo || 'Billed To')}</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="text-right"><p className="font-bold text-gray-500">{(t.shippedTo || 'Shipped To')}</p><p>{client.shippingAddress || client.address}</p></div>
            </section>
            <EcommerceDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-2/5">{(t.item || 'Item')}</th><th className="p-2 font-bold text-center">{(t.qty || 'Qty')}</th><th className="p-2 font-bold text-right">{(t.price || 'Price')}</th><th className="p-2 font-bold text-right">{(t.total || 'Total')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-center">{item.quantity}</td><td className="p-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-right text-sm">
                    <div className="w-1/2">
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{props.subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.shipping || 'Shipping')}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.tax || 'Tax')}:</span><span>{currencySymbol}{props.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
}

export const EcommerceTemplate2: React.FC<PageProps> = (props) => <EcommerceTemplate1 {...props} />;
export const EcommerceTemplate3: React.FC<PageProps> = (props) => <EcommerceTemplate1 {...props} />;
export const EcommerceTemplate4: React.FC<PageProps> = (props) => <EcommerceTemplate1 {...props} />;
export const EcommerceTemplate5: React.FC<PageProps> = (props) => <EcommerceTemplate1 {...props} />;
