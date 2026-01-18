
'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import NextImage from 'next/image';
import { CategorySpecificDetails } from './category-specific-details';

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

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8">
            <NextImage src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-muted-foreground pt-1 border-t-2 border-current w-[150px]">{label}</p>
        </div>
    )
}


export const EcommerceDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.ecommerce) {
      return null;
    }

    const { ecommerce } = invoice;
    const hasDetails = Object.values(ecommerce).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.orderDetails || 'Order Details'}</p>
            </section>
        );
    }
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.orderDetails || 'Order Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {ecommerce.orderNumber && <p><span className="font-semibold text-gray-600">{t.orderNumber || 'Order #'}:</span> {ecommerce.orderNumber}</p>}
                {ecommerce.sku && <p><span className="font-semibold text-gray-600">{t.sku || 'SKU'}:</span> {ecommerce.sku}</p>}
                {ecommerce.shippingCarrier && <p><span className="font-semibold text-gray-600">{t.shippingCarrier || 'Carrier'}:</span> {ecommerce.shippingCarrier}</p>}
                {ecommerce.trackingId && <p><span className="font-semibold text-gray-600">{t.trackingId || 'Tracking #'}:</span> {ecommerce.trackingId}</p>}
            </div>
        </section>
    );
};


// Rebuilt EcommerceTemplate1
export const EcommerceTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-0 font-sans text-gray-800 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="relative text-white" style={{ backgroundColor: accentColor }}>
                <div className="flex justify-between items-center p-10">
                    <div className="w-1/2">
                        {business.logoUrl ? (
                             <NextImage src={business.logoUrl} alt="Company Logo" width={100} height={50} className="object-contain mb-4 filter invert brightness-0" />
                        ): (
                            <h1 className="text-4xl font-extrabold tracking-tight">{business.name}</h1>
                        )}
                        <div className="text-xs text-white/80 whitespace-pre-line mt-2">
                            <p>{business.address}</p>
                            <p>{business.phone} | {business.email}</p>
                            {business.website && <p>{business.website}</p>}
                            {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                            {business.taxId && <p>Tax ID: {business.taxId}</p>}
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-10">
                <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                    <div>
                        <p className="font-bold text-lg mb-2">Invoice to: {client.name}</p>
                        <div className="text-xs text-gray-600">
                            {client.companyName && <p>{client.companyName}</p>}
                            <p className="whitespace-pre-line">{client.address}</p>
                            <p>{client.phone}</p>
                            <p>{client.email}</p>
                            {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex justify-end items-center gap-2 mb-2">
                             <p className="text-xl font-bold">{docTitle}</p>
                        </div>
                        <p className="text-xs"><span className="font-bold">Invoice#:</span> {invoice.invoiceNumber}</p>
                        <p className="text-xs"><span className="font-bold">Date:</span> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                        <p className="text-xs"><span className="font-bold">Due Date:</span> {safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p>
                        {invoice.poNumber && <p className="text-xs"><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                    </div>
                </section>
                
                <CategorySpecificDetails invoice={invoice} t={t} />

                <main className="flex-grow">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr style={{ backgroundColor: accentColor, color: 'white' }}>
                                <th className="p-2 font-bold w-[5%]">SL.</th>
                                <th className="p-2 font-bold w-[30%]">ITEM</th>
                                <th className="p-2 font-bold w-[30%]">DESCRIPTION</th>
                                <th className="p-2 font-bold text-right">PRICE</th>
                                <th className="p-2 font-bold text-center">QTY.</th>
                                <th className="p-2 font-bold text-right">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map((item, index) => (
                                <tr key={item.id} className="border-b" style={{backgroundColor: index % 2 === 0 ? '#F9FAFB' : 'white'}}>
                                    <td className="p-2 text-center">{index + 1}</td>
                                    <td className="p-2 font-semibold whitespace-pre-line">{item.name}</td>
                                    <td className="p-2 text-gray-500 whitespace-pre-line">{item.description}</td>
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
                    <div className="flex justify-between items-start">
                        <div className="text-xs w-1/2">
                            <p className="font-bold text-lg mb-2">Thank you for your purchase</p>
                            <p className="font-semibold">Payment Instructions:</p>
                            <p className="whitespace-pre-line text-muted-foreground">{invoice.paymentInstructions}</p>
                            {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature"/>}
                        </div>
                         <div className="w-1/3 text-xs space-y-2">
                             <p className="flex justify-between"><span>SUBTOTAL:</span> <span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                             {discountAmount > 0 && <p className="flex justify-between text-red-500"><span>DISCOUNT:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                             {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>SHIPPING:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                             <p className="flex justify-between"><span>TAX:</span> <span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                             <div className="p-3 rounded-md text-white font-bold flex justify-between text-base" style={{backgroundColor: accentColor}}>
                                <span>TOTAL:</span>
                                <span>{currencySymbol}{total.toFixed(2)}</span>
                            </div>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>PAID:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-base mt-1"><span>BALANCE DUE:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
                )}
            </div>
             {pageIndex === totalPages - 1 && (
                <div className="text-center text-gray-500 text-xs font-light tracking-widest p-4 mt-auto">
                    THANK YOU FOR YOUR BUSINESS
                </div>
             )}
        </div>
    );
};
