
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

export const RentalTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8">
                {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={100} height={100} className="object-contain" /> : <h1 className="text-3xl font-bold">{business.name}</h1>}
                <div className="text-right">
                    <h2 className="text-4xl font-bold" style={{color: accentColor}}>{docTitle.toUpperCase()}</h2>
                    <p>#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                <div>
                    <p className="font-bold text-gray-500">{(t.tenantInfo || 'Tenant Information').toUpperCase()}</p>
                    <p>{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                </div>
                <div className="text-right">
                    <p className="font-bold text-gray-500">{(t.date || 'Date').toUpperCase()}</p>
                    <p>{safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                </div>
            </section>
            <CategorySpecificDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b-2"><th className="pb-2 font-bold w-3/5">{(t.charges || 'Charges').toUpperCase()}</th><th className="pb-2 font-bold text-right">{(t.amount || 'Amount').toUpperCase()}</th></tr></thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="py-2">{item.name}</td>
                                <td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-right text-sm">
                    <div className="w-1/2">
                        <p className="flex justify-between py-1"><span className="text-gray-600">{t.totalCharges || 'Total Charges'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between py-1 text-red-500"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{(t.shipping || 'Other Fees')}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-2xl mt-2 pt-2 border-t-2">
                            <span>{(t.totalDue || 'Total Due').toUpperCase()}:</span>
                            <span>{currencySymbol}{total.toFixed(2)}</span>
                        </p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                         <p className="flex justify-between font-bold bg-gray-100 p-2 mt-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
                 <div className="flex justify-between mt-8">
                    <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                </div>
            </footer>
            )}
        </div>
    );
}

export const RentalTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    return (
      <div className={`p-10 bg-gray-50 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
        <header className="flex justify-between items-center mb-8 pb-4 border-b-2">
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <h2 className="text-2xl font-light text-gray-500">{docTitle}</h2>
        </header>
        <section className="grid grid-cols-2 gap-8 text-sm mb-8">
            <div><p><strong>{t.to || 'To'}:</strong> {client.name}</p><p>{client.address}</p>{invoice.client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{invoice.client.shippingAddress}</p>}</div>
            <div className="text-right"><p><strong>#:</strong> {invoice.invoiceNumber}</p><p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p><p><strong>{t.dueDate || 'Due Date'}:</strong> {safeFormat(invoice.dueDate, 'MMM dd, yyyy')}</p></div>
        </section>
        <CategorySpecificDetails invoice={invoice} t={t} />
        <main className="flex-grow mt-4">
            <table className="w-full text-left text-sm">
                <thead><tr className="bg-gray-200"><th className="p-2 w-1/2 font-bold">{t.item || 'Item'}</th><th className="p-2 w-1/2 font-bold">{t.description || 'Description'}</th><th className="p-2 font-bold text-center">{(t.quantity || 'Qty')}</th><th className="p-2 font-bold text-right">{(t.unitPrice || 'Unit Price')}</th><th className="p-2 font-bold text-right">{t.total || 'TOTAL'}</th></tr></thead>
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
                <div className="w-1/3">
                    <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                    {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                    {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                    <p className="flex justify-between border-b pb-1"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                    <p className="flex justify-between font-bold mt-2"><span>{t.total || 'Total'}</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                    {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                    <p className="flex justify-between font-bold bg-gray-200 p-1"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                </div>
            </div>
             <div className="flex justify-between mt-8">
                <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
            </div>
        </footer>
        )}
      </div>
    );
};
export const RentalTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');
    return (
      <div className={`p-10 font-serif bg-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
        <header className="text-center mb-10">
            <h1 className="text-4xl font-bold">{business.name}</h1>
             <div className="text-xs mt-1">
                <p className="whitespace-pre-line">{business.address}</p>
                <p>{business.phone} | {business.email}</p>
                {business.website && <p>{business.website}</p>}
                {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                {business.taxId && <p>Tax ID: {business.taxId}</p>}
            </div>
        </header>
        <div className="w-full h-px bg-gray-300 mb-8"></div>
        <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div>
                <p><strong>{t.billedFor || 'Billed For'}:</strong></p>
                <p>{client.name}</p>
                {client.companyName && <p>{client.companyName}</p>}
                <p className="whitespace-pre-line">{client.address}</p>
                <p>{client.phone}</p>
                <p>{client.email}</p>
                {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
            </div>
            <div className="text-right">
                <p><strong>{docTitle} #:</strong> {invoice.invoiceNumber}</p>
                <p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                <p><strong>{t.dueDate || 'Due Date'}:</strong> {safeFormat(invoice.dueDate, 'MMMM d, yyyy')}</p>
                {invoice.poNumber && <p><strong>PO #:</strong> {invoice.poNumber}</p>}
            </div>
        </section>
        <CategorySpecificDetails invoice={invoice} t={t} />
        <main className="flex-grow mt-4">
            <table className="w-full text-left text-sm">
                <thead><tr className="border-b-2 border-t-2"><th className="py-2 w-1/2">{t.item || 'Item'}</th><th className="py-2 w-1/2">{t.description || 'Description'}</th><th className="py-2 text-center">{t.quantity || 'Qty'}</th><th className="py-2 text-right">{t.unitPrice || 'Unit Price'}</th><th className="py-2 text-right">{t.amount || 'Amount'}</th></tr></thead>
                <tbody>
                    {pageItems.map(item => (
                        <tr key={item.id} className="border-b">
                            <td className="py-2 font-semibold whitespace-pre-line">{item.name}</td>
                            <td className="py-2 text-xs text-muted-foreground whitespace-pre-line">{item.description}</td>
                            <td className="py-2 text-center">{item.quantity}</td>
                            <td className="py-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                            <td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
        {pageIndex === totalPages - 1 && (
        <footer className="mt-auto pt-8">
            <div className="flex justify-end text-sm">
                <div className="w-1/3">
                    <p className="flex justify-between py-1"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                    {discountAmount > 0 && <p className="flex justify-between py-1 text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                    {invoice.summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                     <p className="flex justify-between py-1"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                    <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2"><span>{t.totalDue || 'Total Due'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                    {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                    <p className="flex justify-between font-bold bg-gray-100 p-2"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                </div>
            </div>
             <div className="text-xs mt-8">
                <p className="font-bold">{t.paymentInstructions || 'Payment Instructions'}:</p>
                <p className="text-muted-foreground whitespace-pre-line">{invoice.paymentInstructions}</p>
            </div>
             <div className="flex justify-between mt-8">
                <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
            </div>
        </footer>
        )}
      </div>
    );
};
export const RentalTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`flex ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="w-1/3 p-8 text-white" style={{backgroundColor: accentColor || '#be123c'}}>
                <h1 className="text-3xl font-bold">{docTitle}</h1>
                <div className="mt-10 text-xs space-y-4">
                    <div><p className="opacity-70">{t.date || 'DATE'}</p><p>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
                    <div><p className="opacity-70">{t.dueDate || 'DUE DATE'}</p><p>{safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p></div>
                    <div><p className="opacity-70">#</p><p>{invoice.invoiceNumber}</p></div>
                    {invoice.poNumber && <div><p className="opacity-70">PO #</p><p>{invoice.poNumber}</p></div>}
                </div>
            </div>
            <div className="w-2/3 p-10 flex flex-col">
                <header className="text-right mb-10"><h2 className="text-2xl font-bold">{business.name}</h2><p className="text-xs">{business.address}</p></header>
                <section className="mb-10 text-sm"><p><strong>{t.to || 'To'}:</strong> {client.name}</p></section>
                <CategorySpecificDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                       <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 font-bold w-1/3">{t.item || 'Item'}</th>
                                <th className="p-2 font-bold w-1/3">{t.description || 'Description'}</th>
                                <th className="p-2 font-bold text-center">{t.quantity || 'Qty'}</th>
                                <th className="p-2 font-bold text-right">{t.unitPrice || 'Unit Price'}</th>
                                <th className="p-2 font-bold text-right">{t.amount || 'Amount'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2 whitespace-pre-line">{item.name}</td>
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
                        <div className="w-2/3">
                            <p className="flex justify-between py-1"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between py-1 text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{t.shipping || 'Shipping'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between py-1"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-2xl mt-2"><span>{t.totalDue || 'Total Due'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                             <p className="flex justify-between font-bold mt-1 bg-gray-100 p-2"><span>{t.balanceDue || 'Balance'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">{t.paymentInstructions || 'Payment Instructions'}:</p>
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
export const RentalTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');

    return (
        <div className={`p-10 font-serif ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#FDFBF7', color: '#5A4A42' }}>
            <header className="text-center mb-10">
                <h1 className="text-2xl font-bold">{business.name}</h1>
                <p className="text-xs">{business.address} | {business.phone}</p>
            </header>
            <h2 className="text-center text-xl mb-8">{docTitle.toUpperCase()}</h2>
            <section className="text-xs mb-8">
                <p><strong>{t.to || 'To'}:</strong> {client.name}</p>
                <p><strong>{t.no || 'No'}:</strong> {invoice.invoiceNumber}</p>
                <p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                <p><strong>{t.dueDate || 'Due'}:</strong> {safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p>
                {invoice.poNumber && <p><strong>PO #:</strong> {invoice.poNumber}</p>}
            </section>
            <CategorySpecificDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr><th className="py-2 border-b-2 w-1/4">{t.item || 'ITEM'}</th><th className="py-2 border-b-2 w-2/4">{t.description || 'DESCRIPTION'}</th><th className="py-2 border-b-2 text-center">{t.quantity || 'QTY'}</th><th className="py-2 border-b-2 text-right">{t.unitPrice || 'UNIT PRICE'}</th><th className="py-2 border-b-2 text-right">{t.amount || 'AMOUNT'}</th></tr></thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="py-2 border-b font-medium whitespace-pre-line">{item.name}</td>
                                <td className="py-2 border-b text-xs text-muted-foreground whitespace-pre-line">{item.description}</td>
                                <td className="py-2 border-b text-center">{item.quantity}</td>
                                <td className="py-2 border-b text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 border-b text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/3">
                        <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold mt-2 pt-2 border-t"><span>{t.total || 'TOTAL'}</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                         {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                         <p className="flex justify-between font-bold bg-gray-200 p-1"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
                 <div className="text-xs mt-8">
                    <p className="font-bold">{t.paymentInstructions || 'Payment Instructions'}:</p>
                    <p className="text-muted-foreground whitespace-pre-line">{invoice.paymentInstructions}</p>
                 </div>
                 <div className="flex justify-between mt-8">
                    <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                </div>
            </footer>
            )}
        </div>
    );
};
