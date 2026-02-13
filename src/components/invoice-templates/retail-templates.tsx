
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
            <p className="text-xs text-gray-500 pt-1 border-t-2 border-gray-700 w-[150px]">{label}</p>
        </div>
    )
}

export const RetailDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.retail) return null;
    const { retail } = invoice;
    const hasDetails = Object.values(retail).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.productDetails || 'Product Details'}</p>
            </section>
        );
    }
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.productDetails || 'Product Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {retail.sku && <p><span className="font-semibold text-gray-600">{t.sku || 'SKU'}:</span> {retail.sku}</p>}
                {retail.productCategory && <p><span className="font-semibold text-gray-600">{t.productCategory || 'Category'}:</span> {retail.productCategory}</p>}
                {retail.unitOfMeasure && <p><span className="font-semibold text-gray-600">{t.unitOfMeasure || 'Unit'}:</span> {retail.unitOfMeasure}</p>}
                {retail.batchNumber && <p><span className="font-semibold text-gray-600">{t.batchNumber || 'Batch #'}:</span> {retail.batchNumber}</p>}
                {retail.stockQuantity && <p><span className="font-semibold text-gray-600">{t.stockQuantity || 'Stock'}:</span> {retail.stockQuantity}</p>}
                {retail.wholesalePrice && <p><span className="font-semibold text-gray-600">{t.wholesalePrice || 'Wholesale'}:</span> ${retail.wholesalePrice.toFixed(2)}</p>}
                {retail.shippingPalletCost && <p><span className="font-semibold text-gray-600">{t.palletCost || 'Pallet Cost'}:</span> ${retail.shippingPalletCost.toFixed(2)}</p>}
            </div>
        </section>
    );
};

export const RetailTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`font-sans flex ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <div className="w-8" style={{ backgroundColor: accentColor || '#86EFAC' }}></div>
            <div className="flex-grow p-8">
                <header className="flex justify-between items-start mb-4">
                    <div>
                        {business.logoUrl && <NextImage src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain mb-2"/>}
                        <h1 className="text-xl font-bold">{business.name}</h1>
                        <p className="text-xs whitespace-pre-line">{business.address}</p>
                        <p className="text-xs">{business.phone} | {business.email}</p>
                        <p className="text-xs">{business.website}</p>
                        {business.licenseNumber && <p className="text-xs">Lic: {business.licenseNumber}</p>}
                        {business.taxId && <p className="text-xs">Tax ID: {business.taxId}</p>}
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-700">{docTitle}</h2>
                        <p className="text-xs mt-1"><span className="font-semibold">{t.date || 'DATE'}:</span> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                        <p className="text-xs"><span className="font-semibold">#:</span> {invoice.invoiceNumber}</p>
                    </div>
                </header>
                <div className="h-px bg-gray-300 mb-4"></div>
                <section className="flex justify-between text-xs mb-4">
                    <div>
                        <p className="font-bold">{t.billTo || 'Bill To'}:</p>
                        <p>{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.phone} | {client.email}</p>
                    </div>
                     <div>
                        <p className="font-bold">{t.shipTo || 'Ship To'}:</p>
                        <p>{client.shippingAddress ? `${client.name},` : ''}</p>
                        <p className="whitespace-pre-line">{client.shippingAddress || client.address}</p>
                    </div>
                </section>
                <section className="text-xs mb-4">
                     <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-1 border font-semibold">{t.poNumber || 'P.O. #'}</th>
                                <th className="p-1 border font-semibold">{t.shipDate || 'Ship Date'}</th>
                                <th className="p-1 border font-semibold">{t.shipVia || 'Ship Via'}</th>
                                <th className="p-1 border font-semibold">{t.dueDate || 'Due Date'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-1 border">{invoice.poNumber}</td>
                                <td className="p-1 border">{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</td>
                                <td className="p-1 border">{invoice.ecommerce?.shippingCarrier}</td>
                                <td className="p-1 border">{safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</td>
                            </tr>
                        </tbody>
                     </table>
                </section>

                <CategorySpecificDetails invoice={invoice} t={t} />

                <main className="flex-grow">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-1 border font-semibold w-[20%]">{t.item || 'Item'}</th>
                                <th className="p-1 border font-semibold w-[40%]">{t.description || 'Description'}</th>
                                <th className="p-1 border font-semibold text-center">{t.quantity || 'Quantity'}</th>
                                <th className="p-1 border font-semibold text-right">{t.unitPrice || 'Unit Price'}</th>
                                <th className="p-1 border font-semibold text-right">{t.lineTotal || 'Line Total'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id}>
                                    <td className="p-1 border font-semibold">{item.name}</td>
                                    <td className="p-1 border">{item.description}</td>
                                    <td className="p-1 border text-center">{item.quantity}</td>
                                    <td className="p-1 border text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-1 border text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                            {[...Array(Math.max(0, 15 - pageItems.length))].map((_, i) => (
                                <tr key={`blank-${i}`}><td className="p-1 h-6 border"></td><td className="p-1 border"></td><td className="p-1 border"></td><td className="p-1 border"></td><td className="p-1 border"></td></tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-4 pt-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-xs">{t.paymentInstructions || 'Payment Instructions'}:</p>
                            <p className="text-xs text-gray-600 whitespace-pre-line">{invoice.paymentInstructions}</p>
                            {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />}
                        </div>
                        <div className="w-1/3 text-xs">
                             <table className="w-full">
                                <tbody>
                                    <tr><td className="text-right pr-4">{t.subtotal || 'SUBTOTAL'}</td><td className="text-right p-1 border">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                    {discountAmount > 0 && <tr><td className="text-right pr-4 text-red-600">{t.discount || 'DISCOUNT'}</td><td className="text-right p-1 border text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</td></tr>}
                                    <tr><td className="text-right pr-4">{t.tax || 'TAX'} ({invoice.summary.taxPercentage}%)</td><td className="text-right p-1 border">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                    <tr><td className="text-right pr-4">{t.delivery || 'Delivery'}</td><td className="text-right p-1 border">{invoice.summary.shippingCost > 0 ? currencySymbol + invoice.summary.shippingCost.toFixed(2) : '-'}</td></tr>
                                    <tr className="font-bold"><td className="text-right pr-4">{t.total || 'TOTAL'}</td><td className="text-right p-1 border">{currencySymbol}{total.toFixed(2)}</td></tr>
                                    {(invoice.amountPaid || 0) > 0 && <tr className="font-bold text-green-600"><td className="text-right pr-4">PAID</td><td className="text-right p-1 border">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td></tr>}
                                     <tr className="font-bold text-lg"><td className="text-right pr-4">BALANCE DUE</td><td className="text-right p-1 border">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                                </tbody>
                             </table>
                        </div>
                    </div>
                     <p className="text-center font-bold text-xs mt-4">{t.thankYouForBusiness || 'THANK YOU FOR YOUR BUSINESS!'}</p>
                </footer>
                )}
            </div>
        </div>
    );
};
