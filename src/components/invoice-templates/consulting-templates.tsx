
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

export const ConsultingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.consulting) return null;
    const { consulting } = invoice;
    const hasDetails = Object.values(consulting).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.consultingDetails || 'Consulting Details'}</p>
            </section>
        );
    }

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.consultingDetails || 'Consulting Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {consulting.consultationType && <p><span className="font-semibold text-gray-600">{t.consultationType || 'Type'}:</span> {consulting.consultationType}</p>}
                {consulting.sessionHours && <p><span className="font-semibold text-gray-600">{t.sessionHours || 'Hours'}:</span> {consulting.sessionHours}</p>}
                {consulting.retainerFee && <p><span className="font-semibold text-gray-600">{t.retainerFee || 'Retainer'}:</span> ${consulting.retainerFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};


// Template 1: Expert
export const ConsultingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            {/* Header */}
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-2xl font-bold">{business.name || 'Your Company'}</h1>
                    <div className="text-xs text-muted-foreground whitespace-pre-line">
                      <p>{business.address || '123 Main St, Anytown, USA 12345'}</p>
                      <p>{business.phone}</p>
                      <p>{business.email}</p>
                      <p>{business.website}</p>
                      {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                      {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                {business.logoUrl && (
                    <Image src={business.logoUrl} alt="Company Logo" width={80} height={80} className="object-cover rounded-md" />
                )}
            </header>

            {/* Title */}
            <div className="text-left my-8">
                <h2 className="text-3xl font-bold tracking-wider">{docTitle}</h2>
            </div>
            
            {/* Bill To and Invoice Details */}
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold text-muted-foreground mb-1">{t.billTo || 'BILL TO'}</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                </div>
                <div className="text-right space-y-1">
                    <p><span className="font-bold">{t.invoiceNo || 'Invoice #'}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{t.date || 'DATE'}:</span> {safeFormat(invoice.invoiceDate, 'MM-dd-yyyy')}</p>
                    <p><span className="font-bold">{t.dueDate || 'DUE DATE'}:</span> {safeFormat(invoice.dueDate, 'MM-dd-yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO#:</span> {invoice.poNumber}</p>}
                </div>
            </section>

             <CategorySpecificDetails invoice={invoice} t={t}/>

            {/* Items Table */}
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{backgroundColor: accentColor, color: 'white'}}>
                            <th className="p-2 font-bold w-[30%]">{t.item || 'ITEM'}</th>
                            <th className="p-2 font-bold w-[40%]">{t.description || 'DESCRIPTION'}</th>
                            <th className="p-2 font-bold text-center">{t.quantity || 'QTY'}</th>
                            <th className="p-2 font-bold text-right">{t.unitPrice || 'UNIT PRICE'}</th>
                            <th className="p-2 font-bold text-right">{t.amount || 'AMOUNT'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 align-top font-semibold whitespace-pre-line">{item.name}</td>
                                <td className="p-2 align-top whitespace-pre-line text-muted-foreground">{item.description}</td>
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
                {/* Totals Summary */}
                <div className="flex justify-end text-sm mb-8">
                    <div className="w-2/5 space-y-2">
                        <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>{t.tax || 'Tax'} ({invoice.summary.taxPercentage}%):</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold bg-gray-100 p-1 mt-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="text-xs">
                    <p className="font-bold">{t.termsAndConditions || 'Terms and Conditions'}</p>
                    <p className="text-muted-foreground whitespace-pre-line">{invoice.paymentInstructions}</p>
                </div>
                 <div className="flex justify-between mt-8">
                    <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                </div>
            </footer>
            )}
        </div>
    );
};


// Template 2: Strategy
export const ConsultingTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div style={{ backgroundColor: accentColor, color: 'white' }} className="p-8 rounded-t-lg">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <div className="text-xs opacity-80 mt-1">
                            <p className="whitespace-pre-line">{business.address}</p>
                            <p>{business.phone} | {business.email}</p>
                            {business.website && <p>{business.website}</p>}
                            {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                            {business.taxId && <p>Tax ID: {business.taxId}</p>}
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold">{docTitle}</h2>
                        <p>#{invoice.invoiceNumber}</p>
                        {invoice.poNumber && <p>PO #{invoice.poNumber}</p>}
                    </div>
                </header>
            </div>
            <div className="p-8 bg-white shadow-lg rounded-b-lg border">
                <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                     <div>
                        <p className="font-bold mb-1">{t.billTo || 'Bill To'}:</p>
                        <p>{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    </div>
                     <div className="text-right">
                        <p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                        <p><strong>{t.dueDate || 'Due Date'}:</strong> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                     </div>
                </section>
                <CategorySpecificDetails invoice={invoice} t={t}/>
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                       <thead>
                           <tr className="border-b">
                               <th className="pb-2 font-semibold w-[30%]">{t.service || 'Service'}</th>
                               <th className="pb-2 font-semibold w-[40%]">{t.description || 'Description'}</th>
                               <th className="pb-2 font-semibold text-center">{t.quantity || 'Qty'}</th>
                               <th className="pb-2 font-semibold text-right">{t.rate || 'Rate'}</th>
                               <th className="pb-2 font-semibold text-right">{t.amount || 'Amount'}</th>
                           </tr>
                       </thead>
                       <tbody>
                           {pageItems.map(item => (
                               <tr key={item.id} className="border-b">
                                   <td className="py-2 font-medium whitespace-pre-line">{item.name}</td>
                                   <td className="py-2 text-muted-foreground whitespace-pre-line">{item.description}</td>
                                   <td className="py-2 text-center">{item.quantity}</td>
                                   <td className="py-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                   <td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                               </tr>
                           ))}
                       </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-8 pt-8 border-t">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/2">
                            <p className="flex justify-between py-1"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between py-1 text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between py-1"><span>{t.tax || 'Tax'} ({invoice.summary.taxPercentage}%):</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-xl mt-4"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-xl mt-2 bg-gray-100 p-2"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">{t.termsAndConditions || 'Terms & Conditions'}:</p>
                        <p className="text-muted-foreground whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};
// Template 3: Advisory
export const ConsultingTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 font-sans bg-gray-50 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="bg-white p-8 shadow-lg">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={90} height={45} className="object-contain mb-2"/>}
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                        <p className="text-xs text-gray-500">{business.phone} | {business.email}</p>
                        {business.website && <p className="text-xs text-gray-500">{business.website}</p>}
                        {business.licenseNumber && <p className="text-xs text-gray-500">Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p className="text-xs text-gray-500">Tax ID: {business.taxId}</p>}
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-light text-gray-400">{docTitle}</h2>
                        <p className="text-xs"># {invoice.invoiceNumber}</p>
                        {invoice.poNumber && <p className="text-xs">PO # {invoice.poNumber}</p>}
                    </div>
                </header>
                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div>
                        <p className="font-bold text-gray-500 mb-1">{t.billedTo || 'Billed To'}</p>
                        <p>{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    </div>
                    <div className="text-right">
                        <p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'dd-MMM-yyyy')}</p>
                        <p><strong>{t.dueDate || 'Due Date'}:</strong> {safeFormat(invoice.dueDate, 'dd-MMM-yyyy')}</p>
                    </div>
                </section>
                <CategorySpecificDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 font-bold w-1/2">{t.serviceDescription || 'Service Description'}</th>
                                <th className="p-2 font-bold w-1/4">{t.description || 'Details'}</th>
                                <th className="p-2 font-bold text-center">{t.quantity || 'Qty'}</th>
                                <th className="p-2 font-bold text-right">{t.unitPrice || 'Unit Price'}</th>
                                <th className="p-2 font-bold text-right">{t.fee || 'Fee'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2 font-semibold whitespace-pre-line">{item.name}</td>
                                    <td className="p-2 text-xs text-muted-foreground whitespace-pre-line">{item.description}</td>
                                    <td className="p-2 text-center">{item.quantity}</td>
                                    <td className="p-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3 space-y-1">
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-gray-300"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold bg-gray-100 p-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                    <div className="text-xs mt-8">
                        <p className="font-bold text-gray-500 mb-2">{t.termsAndConditions || 'Terms & Conditions'}</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                      <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};
// Template 4: Modern
export const ConsultingTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');

    return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header style={{ backgroundColor: accentColor }} className="text-white p-10 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">{business.name}</h1>
                  <p className="text-xs opacity-80 whitespace-pre-line">{business.address}</p>
                  <p className="text-xs opacity-80">{business.phone} | {business.email}</p>
                  {business.website && <p className="text-xs opacity-80">{business.website}</p>}
                  {business.licenseNumber && <p className="text-xs opacity-80">Lic #: {business.licenseNumber}</p>}
                  {business.taxId && <p className="text-xs opacity-80">Tax ID: {business.taxId}</p>}
                </div>
                <h2 className="text-xl">{docTitle} #{invoice.invoiceNumber}</h2>
            </header>
            <div className="p-10">
                <section className="grid grid-cols-2 gap-10 text-sm mb-10">
                    <div>
                        <p className="font-bold">{t.billedTo || 'Billed To'}</p>
                        <p>{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    </div>
                    <div className="text-right">
                        <p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                        <p><strong>{t.dueDate || 'Due Date'}:</strong> {safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p>
                        {invoice.poNumber && <p><strong>PO #:</strong> {invoice.poNumber}</p>}
                    </div>
                </section>
                <CategorySpecificDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 font-bold w-1/2">{t.serviceProvided || 'Service Provided'}</th>
                                <th className="p-3 font-bold w-1/4">{t.description || 'Description'}</th>
                                <th className="p-3 font-bold text-center">{(t.quantity || 'Qty').toUpperCase()}</th>
                                <th className="p-3 font-bold text-right">{t.rate || 'Rate'}</th>
                                <th className="p-3 font-bold text-right">{t.fee || 'Fee'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-3 font-medium whitespace-pre-line">{item.name}</td>
                                    <td className="p-3 text-muted-foreground whitespace-pre-line">{item.description}</td>
                                    <td className="p-3 text-center">{item.quantity}</td>
                                    <td className="p-3 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-3 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-10 pt-10 border-t">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3">
                            <p className="flex justify-between py-1"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                             {discountAmount > 0 && <p className="flex justify-between py-1 text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                             {invoice.summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{t.shipping || 'Shipping'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                             <p className="flex justify-between py-1"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-lg mt-2"><span>{t.totalDue || 'Total Due'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold mt-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">{t.termsAndConditions || 'Terms & Conditions'}:</p>
                        <p className="text-muted-foreground whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};
// Template 5: Minimal
export const ConsultingTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');
    return (
        <div className={`p-10 font-mono text-sm ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="mb-10">
                <h1 className="text-xl font-bold">{business.name} // {docTitle.toUpperCase()}</h1>
                <p className="text-xs">{business.address}</p>
                <p className="text-xs">{business.phone} | {business.email}</p>
                {business.website && <p className="text-xs">{business.website}</p>}
                {business.licenseNumber && <p className="text-xs">Lic #: {business.licenseNumber}</p>}
                {business.taxId && <p className="text-xs">Tax ID: {business.taxId}</p>}
            </header>
            <section className="mb-10">
                <p>{t.to || 'To'}: {client.name}</p>
                {client.companyName && <p>{client.companyName}</p>}
                <p className="whitespace-pre-line">{client.address}</p>
                <p>{client.phone} | {client.email}</p>
                {client.shippingAddress && <p className="mt-2">Ship To: {client.shippingAddress}</p>}
                <p className="mt-2">{t.date || 'Date'}: {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                <p>{t.dueDate || 'Due'}: {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                <p>Ref: {invoice.invoiceNumber}</p>
                {invoice.poNumber && <p>PO: {invoice.poNumber}</p>}
            </section>
            <CategorySpecificDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr><th className="pt-2 pb-2 border-t border-b border-dashed w-3/5">{t.description || 'Description'}</th><th className="pt-2 pb-2 border-t border-b border-dashed text-center">{t.quantity || 'Qty'}</th><th className="pt-2 pb-2 border-t border-b border-dashed text-right">{t.unitPrice || 'Unit Price'}</th><th className="pt-2 pb-2 border-t border-b border-dashed text-right">{t.cost || 'Cost'}</th></tr></thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="py-1"><p className="font-semibold whitespace-pre-line">{item.name}</p>{item.description && <p className="text-xs text-muted-foreground whitespace-pre-line">{item.description}</p>}</td>
                                <td className="py-1 text-center">{item.quantity}</td>
                                <td className="py-1 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-1 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-xs">
                    <div className="w-1/2">
                        <p className="flex justify-between border-t border-dashed pt-2"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t-2 border-black"><span>{t.total || 'Total'}</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold bg-gray-200 p-1"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
                 <div className="text-xs mt-8">
                    <p className="font-bold">{t.termsAndConditions || 'Terms'}:</p>
                    <p className="text-muted-foreground whitespace-pre-line">{invoice.paymentInstructions}</p>
                 </div>
                 <div className="flex justify-between mt-8">
                    <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                </div>
            </footer>
            )}
        </div>
    );
};
