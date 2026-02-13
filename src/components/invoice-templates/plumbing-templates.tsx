
'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';
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
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-500 pt-1 border-t-2 border-gray-700 w-[150px]">{label}</p>
        </div>
    )
}

export const PlumbingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.plumbing) return null;
    const { plumbing } = invoice;
    const hasDetails = Object.values(plumbing).some(val => val !== null && val !== '');

    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.plumbingDetails || 'Plumbing Specifics'}</p>
            </section>
        );
    }
    
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.plumbingDetails || 'Plumbing Specifics'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {plumbing.serviceType && <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service'}:</span> {plumbing.serviceType}</p>}
                {plumbing.pipeMaterial && <p><span className="font-semibold text-gray-600">{t.pipeMaterial || 'Pipe Material'}:</span> {plumbing.pipeMaterial}</p>}
                {plumbing.fixtureName && <p><span className="font-semibold text-gray-600">{t.fixture || 'Fixture'}:</span> {plumbing.fixtureName}</p>}
                {plumbing.emergencyFee && <p><span className="font-semibold text-gray-600">{t.emergencyFee || 'Emergency Fee'}:</span> ${plumbing.emergencyFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

export const PlumbingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice').toUpperCase();

    return (
        <div className={`p-8 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-4">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={120} height={60} className="object-contain" />}
                    <h1 className="text-3xl font-bold mt-2" style={{color: accentColor}}>{business.name}</h1>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold">{docTitle}</h2>
                    <p className="text-xs">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div className="p-2 border border-black">
                    <p className="px-2 font-bold text-white bg-black">SERVICE PROVIDER</p>
                    <div className="p-2 space-y-0.5">
                        <p>{business.name}</p>
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone}</p>
                        <p>{business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                <div className="p-2 border border-gray-400">
                     <p className="px-2 font-bold text-white bg-gray-500">CUSTOMER</p>
                    <div className="p-2 space-y-0.5">
                        <p>{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                    </div>
                </div>
            </section>
            
             <section className="p-2 border border-t-0 border-black text-xs mb-4 grid grid-cols-3 gap-2">
                <div><span className="font-bold">Date: </span>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</div>
                <div><span className="font-bold">Due Date: </span>{safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</div>
                {invoice.poNumber && <div><span className="font-bold">PO Number: </span>{invoice.poNumber}</div>}
             </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="p-1.5 font-bold w-[30%]">{t.item || 'ITEM'}</th>
                            <th className="p-1.5 font-bold w-[30%]">{t.description || 'DESCRIPTION'}</th>
                            <th className="p-1.5 font-bold text-center">{t.quantity || 'QTY'}</th>
                            <th className="p-1.5 font-bold text-right">{t.price || 'PRICE'}</th>
                            <th className="p-1.5 font-bold text-right">{t.total || 'TOTAL'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-300">
                                <td className="p-1.5 align-top whitespace-pre-line">{item.name}</td>
                                <td className="p-1.5 align-top whitespace-pre-line">{item.description}</td>
                                <td className="p-1.5 align-top text-center">{item.quantity}</td>
                                <td className="p-1.5 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-1.5 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-4 text-xs">
                     <div className="flex justify-between items-start">
                        <div className="w-1/2">
                             <p className="font-bold">THANK YOU FOR YOUR BUSINESS!</p>
                             <p className="font-bold mt-4">Terms & Conditions:</p>
                             <p className="whitespace-pre-line text-gray-600">{invoice.paymentInstructions}</p>
                             <div className="flex gap-16 mt-8">
                                <SignatureDisplay signature={business.ownerSignature} label={"Owner Signature"} />
                            </div>
                        </div>
                        <div className="w-2/5">
                            <div className="space-y-1">
                                <div className="flex justify-between p-1"><span className="font-bold">SUBTOTAL</span><span className="font-bold">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                                {discountAmount > 0 && <div className="flex justify-between p-1"><span className="font-bold">DISCOUNT</span><span className="font-bold text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                                {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-1"><span className="font-bold">SHIPPING AND HANDLING</span><span className="font-bold">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                                {taxAmount > 0 && <div className="flex justify-between p-1"><span className="font-bold">SALES TAX ({invoice.summary.taxPercentage}%)</span><span className="font-bold">{currencySymbol}{taxAmount.toFixed(2)}</span></div>}
                                <div className="flex justify-between p-2 mt-1 bg-black text-white font-bold text-base"><span>TOTAL</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                                {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between p-1 font-bold text-green-600"><span>AMOUNT PAID</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                                <div className="flex justify-between p-1 mt-1 bg-gray-200 font-bold"><span>BALANCE DUE</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Modern Blue
export const PlumbingTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-4xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs whitespace-pre-line text-gray-500">{business.address}</p>
                    <p className="text-xs text-gray-500">{business.phone} | {business.email}</p>
                    {business.website && <p className="text-xs text-gray-500">{business.website}</p>}
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-400">{docTitle}</h2>
                    <p className="text-sm">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 my-4 text-sm">
                <div>
                    <p className="font-bold text-gray-500">TO</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold text-gray-500">DATE: </span>{safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold text-gray-500">DUE DATE: </span>{safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold text-gray-500">PO #: </span>{invoice.poNumber}</p>}
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow mt-4">
                 <table className="w-full text-left text-sm">
                    <thead style={{ backgroundColor: accentColor }} className="text-white">
                        <tr className="rounded-t-lg">
                            <th className="p-2 font-bold w-1/2 rounded-tl-md">DESCRIPTION</th>
                            <th className="p-2 font-bold text-center">QTY</th>
                            <th className="p-2 font-bold text-right">UNIT PRICE</th>
                            <th className="p-2 font-bold text-right rounded-tr-md">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="p-2 align-top">
                                    <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                </td>
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
                             <div className="flex justify-between p-1"><span className="text-gray-600">Subtotal:</span><span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                             {discountAmount > 0 && <div className="flex justify-between p-1"><span className="text-gray-600">Discount:</span><span className="font-medium text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                            {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-1"><span className="text-gray-600">Shipping/Extra:</span><span className="font-medium">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between p-1"><span className="text-gray-600">Tax:</span><span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2" style={{ borderColor: accentColor }}><span style={{ color: accentColor }}>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                            {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between font-bold text-green-600"><span>Amount Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                            <div className="flex justify-between font-bold text-base mt-1 p-2 bg-gray-100"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">Terms & Conditions:</p>
                        <p className="text-gray-500 whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label="Owner Signature" />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Clean & Minimal
export const PlumbingTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = 'Invoice';

    return (
        <div className={`p-12 bg-white font-['Helvetica'] text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-12 text-center">
                <div className="text-left">
                    <h1 className="text-4xl font-bold">{business.name}</h1>
                    <div className="text-xs mt-1">
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light tracking-widest">{docTitle.toUpperCase()}</h2>
                    <p className="text-sm">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="flex justify-between mb-8 text-xs">
                <div>
                    <p className="font-bold mb-1">Prepared for:</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Date:</span> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                    <p><span className="font-bold">Due Date:</span> {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-semibold w-1/2 border-b-2 border-gray-300">Service</th>
                            <th className="p-2 font-semibold text-center border-b-2 border-gray-300">Quantity</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">Rate</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="p-2 border-b border-gray-200">
                                    <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                </td>
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
                                <tr><td className="py-1 text-gray-500">Subtotal</td><td className="text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                {discountAmount > 0 && <tr><td className="py-1 text-gray-500">Discount</td><td className="text-right text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</td></tr>}
                                {invoice.summary.shippingCost > 0 && <tr><td className="py-1 text-gray-500">Shipping/Extra</td><td className="text-right">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</td></tr>}
                                <tr><td className="py-1 text-gray-500">Sales Tax</td><td className="text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">TOTAL</td><td className="pt-2 text-right">{currencySymbol}{total.toFixed(2)}</td></tr>
                                {(invoice.amountPaid || 0) > 0 && <tr className="font-bold text-green-600"><td>Amount Paid</td><td className="text-right">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td></tr>}
                                <tr className="font-bold bg-gray-100"><td className="p-2">Balance Due</td><td className="p-2 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">Terms & Conditions:</p>
                        <p className="text-gray-500 whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label="Owner Signature" />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Side Panel
export const PlumbingTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = 'Invoice';

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <div className="w-1/3 p-8 text-white bg-gray-800 flex flex-col">
                 <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
                <div className="text-xs space-y-4 flex-grow">
                    <div>
                        <p className="font-bold opacity-70 mb-1">INVOICE FOR</p>
                        <p className="font-bold text-base">{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                         {client.shippingAddress && <p className="mt-2"><span className="font-bold opacity-70">SHIP TO:</span><br/>{client.shippingAddress}</p>}
                    </div>
                     <div>
                        <p className="font-bold opacity-70 mb-1">FROM</p>
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone}</p>
                        <p>{business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                     <div>
                        <p className="font-bold opacity-70 mb-1">REFERENCE</p>
                        <p>#{invoice.invoiceNumber}</p>
                        <p>Date: {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                        <p>Due: {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                        {invoice.poNumber && <p>PO: {invoice.poNumber}</p>}
                    </div>
                </div>
            </div>
            <div className="w-2/3 p-10 flex flex-col">
                <div className='flex justify-end mb-4'>
                    <div className="text-right">
                        <h2 className='text-2xl font-bold'>{docTitle.toUpperCase()}</h2>
                    </div>
                </div>
                 <CategorySpecificDetails invoice={invoice} t={t} />
                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-2 font-bold w-1/2">Service</th>
                                <th className="py-2 font-bold text-center">Qty</th>
                                <th className="py-2 font-bold text-right">Price</th>
                                <th className="py-2 font-bold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="py-2 align-top">
                                        <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                        {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                    </td>
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
                                <div className="flex justify-between p-2 bg-gray-50"><span className="text-gray-600">Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                                {discountAmount > 0 && <div className="flex justify-between p-2"><span className="text-gray-600">Discount:</span><span className="text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                                {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-2"><span className="text-gray-600">Shipping/Extra:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                                <div className="flex justify-between p-2"><span className="text-gray-600">Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between p-2 bg-gray-800 text-white font-bold text-base"><span>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                                {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between p-2 text-green-600 font-bold"><span>Amount Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                                <div className="flex justify-between p-2 bg-gray-200 font-bold"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                            </div>
                        </div>
                        <div className="text-xs mt-8">
                            <p className="font-bold">Terms & Conditions:</p>
                            <p className="text-gray-500 whitespace-pre-line">{invoice.paymentInstructions}</p>
                        </div>
                         <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={business.ownerSignature} label="Owner Signature" />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Bold Grid
export const PlumbingTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = 'Invoice';

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="grid grid-cols-2 gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold">{business.name}</h1>
                    <div className="text-xs mt-1">
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                 <div className="text-right">
                     <p className="text-3xl font-bold">{docTitle.toUpperCase()}</p>
                     <p className="text-sm">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="mb-8 p-4 bg-white shadow-sm rounded-md text-xs">
                 <p className="font-bold text-gray-500 mb-2">BILLED TO: {client.name}</p>
                 <p className="font-semibold">{client.address}</p>
                 <p>{client.phone} | {client.email}</p>
                 {client.companyName && <p>{client.companyName}</p>}
                 {client.shippingAddress && <p className="mt-2"><span className="font-bold text-gray-500">SHIP TO:</span> {client.shippingAddress}</p>}
            </section>
            
            <section className="mb-4 text-xs grid grid-cols-3 gap-2">
                <p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                <p><strong>Due Date:</strong> {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                {invoice.poNumber && <p><strong>PO #:</strong> {invoice.poNumber}</p>}
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow bg-white p-4 rounded-md shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-[60%]">Description of Work</th>
                            <th className="py-2 font-bold text-center">Qty</th>
                            <th className="py-2 font-bold text-right">Cost</th>
                            <th className="py-2 font-bold text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 align-top">
                                    <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                </td>
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
                             <div className="flex justify-between p-1"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                             {discountAmount > 0 && <div className="flex justify-between p-1"><span>Discount</span><span className="text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                            {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-1"><span>Shipping/Extra</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                             <div className="flex justify-between p-1"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                             <div className="flex justify-between p-2 mt-2 border-t-2 border-black font-bold text-lg"><span>Total</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                            {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between p-2 text-green-600 font-bold"><span>Amount Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                             <div className="flex justify-between p-2 mt-1 bg-gray-200 font-bold text-lg"><span>Balance Due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">Terms & Conditions:</p>
                        <p className="text-gray-500 whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label="Owner Signature" />
                    </div>
                </footer>
            )}
        </div>
    );
};
