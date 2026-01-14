
'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { CategorySpecificDetails } from './category-specific-details';
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

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8">
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-500 pt-1 border-t-2 border-gray-700 w-[150px]">{label}</p>
        </div>
    )
}

export const LandscapingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.landscaping) return null;
    const { landscaping } = invoice;
    const hasDetails = Object.values(landscaping).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
             <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.landscapingSpecifics || 'Landscaping Specifics'}</p>
            </section>
        )
    }

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.landscapingSpecifics || 'Landscaping Specifics'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {landscaping.serviceType && <p className="col-span-full"><span className="font-semibold text-gray-600">{(t.service || 'Service')}:</span> {landscaping.serviceType}</p>}
                {landscaping.lawnSquareFootage && <p><span className="font-semibold text-gray-600">{(t.lawnSqFt || 'Lawn Sq Ft')}:</span> {landscaping.lawnSquareFootage}</p>}
                {landscaping.equipmentFee && <p><span className="font-semibold text-gray-600">{(t.equipmentFee || 'Equipment Fee')}:</span> ${landscaping.equipmentFee.toFixed(2)}</p>}
                {landscaping.disposalFee && <p><span className="font-semibold text-gray-600">{(t.disposalFee || 'Disposal Fee')}:</span> ${landscaping.disposalFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};


// Template 1: Green Thumb
export const LandscapingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    
    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}pt`, minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                     {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain"/>}
                     <h2 className="text-3xl font-bold mt-2" style={{ color: accentColor }}>{business.name}</h2>
                     <div className="text-xs text-gray-500 mt-1">
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-2xl font-bold">{docTitle}</h1>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-8 text-sm">
                 <div>
                    <p className="font-bold mb-1 text-gray-500">{t.customerInformation || 'CUSTOMER'}</p>
                    <p className="font-bold">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                </div>
                <div className="text-right">
                    <p className="font-bold mb-1">{t.invoiceNo || 'Invoice Number'}: <span className="font-normal">{invoice.invoiceNumber}</span></p>
                    <p className="font-bold mb-1">{t.invoiceDate || 'Invoice Date'}: <span className="font-normal">{safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</span></p>
                    <p className="font-bold mb-1">{t.dueDate || 'Due Date'}: <span className="font-normal">{safeFormat(invoice.dueDate, 'MMMM d, yyyy')}</span></p>
                     {invoice.poNumber && <p className="font-bold mb-1">PO #: <span className="font-normal">{invoice.poNumber}</span></p>}
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t}/>

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
                                <td className="p-2 align-top">
                                  <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                  {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                </td>
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
                                    <tr className="border-b"><td className="p-2 font-bold">{t.subtotal || 'Subtotal'}</td><td className="p-2 text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                    {discountAmount > 0 && <tr className="border-b text-red-500"><td className="p-2 font-bold">{t.discount || 'Discount'}</td><td className="p-2 text-right">-{currencySymbol}{discountAmount.toFixed(2)}</td></tr>}
                                    {invoice.summary.shippingCost > 0 && <tr className="border-b"><td className="p-2 font-bold">{t.shipping || 'Shipping'}</td><td className="p-2 text-right">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</td></tr>}
                                    <tr className="border-b"><td className="p-2 font-bold">{t.tax || 'Tax'}</td><td className="p-2 text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                    <tr style={{ backgroundColor: accentColor }} className="text-white"><td className="p-2 font-bold text-lg">{t.total || 'Total'}</td><td className="p-2 text-right font-bold text-lg">{currencySymbol}{total.toFixed(2)}</td></tr>
                                    {(invoice.amountPaid || 0) > 0 && <tr className="text-green-600"><td className="p-2 font-bold">{t.amountPaid || 'Amount Paid'}</td><td className="p-2 text-right">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td></tr>}
                                    <tr className="bg-gray-100"><td className="p-2 font-bold text-lg">{t.balanceDue || 'Balance Due'}</td><td className="p-2 text-right font-bold text-lg">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                                </tbody>
                             </table>
                        </div>
                    </div>
                    <div className="mt-8 text-xs border p-3">
                         <p className="font-bold mb-1" style={{color: accentColor}}>{(t.termsOfService || 'Terms of Services')}</p>
                         <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                    <div className="flex justify-end mt-4">
                       <SignatureDisplay signature={business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Modern & Clean
export const LandscapingTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <div className="text-xs text-gray-500">
                        <p>{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500">{t.client || 'Client'}:</p>
                    <p className="font-semibold">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p>{client.address}</p>
                    <p>{client.phone} | {client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold text-gray-500">Ship To:</span><br/>{client.shippingAddress}</p>}
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{t.invoiceNo || 'Invoice #'}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{t.date || 'Date'}:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold">{t.dueDate || 'Due Date'}:</span> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t}/>

            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="py-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
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
                        <div className="w-1/3 text-sm space-y-1">
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between">{t.discount || 'Discount'}: <span className="text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between">{t.shipping || 'Shipping/Extra'}: <span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold bg-gray-100 p-2 mt-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold text-gray-500 mb-2">{t.termsAndConditions || 'Terms & Conditions'}</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label={"Owner Signature"} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Side Panel Design
export const LandscapingTemplate3: React.FC<PageProps> = (props) => <LandscapingTemplate1 {...props} />;
export const LandscapingTemplate4: React.FC<PageProps> = (props) => <LandscapingTemplate1 {...props} />;
export const LandscapingTemplate5: React.FC<PageProps> = (props) => <LandscapingTemplate1 {...props} />;
