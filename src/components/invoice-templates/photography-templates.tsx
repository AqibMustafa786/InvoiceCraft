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

export const PhotographyDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.photography) return null;
    const hasDetails = Object.values(invoice.photography).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-400 mb-2 border-b border-gray-600">{(t.sessionDetails || 'SESSION DETAILS').toUpperCase()}</p>
            </section>
        );
    }
    
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-400 mb-2 border-b border-gray-600">{(t.sessionDetails || 'SESSION DETAILS').toUpperCase()}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {invoice.photography.eventType && <p><span className="font-semibold text-gray-300">{(t.eventType || 'Event')}:</span> {invoice.photography.eventType}</p>}
                {invoice.photography.shootDate && <p><span className="font-semibold text-gray-300">{(t.shootDate || 'Date')}:</span> {safeFormat(invoice.photography.shootDate, 'MM/dd/yyyy')}</p>}
                {invoice.photography.hoursOfCoverage && <p><span className="font-semibold text-gray-300">{(t.coverage || 'Coverage')}:</span> {invoice.photography.hoursOfCoverage} hrs</p>}
                {invoice.photography.packageSelected && <p><span className="font-semibold text-gray-300">{(t.package || 'Package')}:</span> {invoice.photography.packageSelected}</p>}
                {invoice.photography.editedPhotosCount && <p><span className="font-semibold text-gray-300">{(t.editedPhotos || 'Edits')}:</span> {invoice.photography.editedPhotosCount}</p>}
                {invoice.photography.rawFilesCost && <p><span className="font-semibold text-gray-300">{(t.rawFiles || 'RAWs')}:</span> ${invoice.photography.rawFilesCost.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Lens
export const PhotographyTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    const headerImageUrl = "https://picsum.photos/seed/camera-lens/800/200";

    return (
        <div className={`font-serif bg-[#333333] text-white flex flex-col ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <div 
                className="relative h-48 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${headerImageUrl})` }}
                data-ai-hint="camera lens"
            ></div>
            
            <div className="p-10 flex-grow flex flex-col">
                <section className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h1 className="text-4xl tracking-wider">{docTitle}</h1>
                        <p className="text-sm mt-2">{t.no || 'No.'} {invoice.invoiceNumber}</p>
                        <p className="text-sm">{safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm">{t.invoiceTo || 'Invoice to'}:</p>
                        <p className="text-xl font-bold">{client.name}</p>
                    </div>
                </section>

                <CategorySpecificDetails invoice={invoice} t={t} />

                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b" style={{borderColor: accentColor}}>
                                <th className="py-2 font-normal w-3/5" style={{color: accentColor}}>{t.description.toUpperCase()}</th>
                                <th className="py-2 font-normal text-right" style={{color: accentColor}}>{t.price.toUpperCase()}</th>
                                <th className="py-2 font-normal text-center" style={{color: accentColor}}>{t.quantity.toUpperCase()}</th>
                                <th className="py-2 font-normal text-right" style={{color: accentColor}}>{t.total.toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-600">
                                    <td className="py-3">{item.name}</td>
                                    <td className="py-3 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="py-3 text-center">{item.quantity}</td>
                                    <td className="py-3 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>

                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-between items-start">
                        <div className="text-sm">
                            <p style={{color: accentColor}}>{t.sendPaymentsTo || 'Send Payments To'}:</p>
                            <p>{business.name}</p>
                            <p>{business.email}</p>
                            <div className="flex justify-between mt-8">
                                <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                            </div>
                        </div>
                        <div className="w-1/3 text-sm space-y-2 text-right">
                            <p className="flex justify-between"><span>{t.totalAmount || 'Total Amount'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between text-red-400"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2" style={{color: accentColor}}><span>{t.amountDue || 'Amount due'}</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                             {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-400"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                             <p className="flex justify-between font-bold bg-gray-700 p-2 mt-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
                )}
            </div>
            
            <div className="bg-gray-200 text-gray-700 p-4 text-xs text-center flex justify-center items-center gap-4">
                <span>{business.address}</span>
                <span>•</span>
                <span>{business.website}</span>
                 <span>•</span>
                <span>{business.email}</span>
            </div>
        </div>
    );
}

// Template 2: Shutter
export const PhotographyTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
     return (
        <div className={`font-sans bg-white text-gray-800 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="p-10 flex justify-between items-start" style={{backgroundColor: accentColor, color: 'white'}}>
                 <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs opacity-80">{t.photographyServices || 'Photography Services'}</p>
                </div>
                 <div className="text-right">
                    <h2 className="text-2xl font-bold">{docTitle}</h2>
                    <p>#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <div className="p-10">
                <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                     <div><p className="font-bold">{t.client || 'Client'}</p><p>{client.name}<br/>{client.address}</p></div>
                     <div className="text-right"><p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p></div>
                </section>
                <CategorySpecificDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="border-b-2"><th className="pb-2 font-bold w-3/5">{t.description || 'Description'}</th><th className="pb-2 font-bold text-right">{t.amount || 'Amount'}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                 {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8">
                        <div className="flex justify-end text-sm">
                            <div className="w-1/2">
                                <p className="flex justify-between py-1"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                                {discountAmount > 0 && <p className="flex justify-between py-1 text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                                {invoice.summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                                <p className="flex justify-between py-1"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                                <p className="flex justify-between font-bold text-3xl mt-4"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
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
        </div>
    );
};
// Template 3: Aperture
export const PhotographyTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
         <div className={`p-10 font-serif bg-gray-50 text-gray-700 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-sm">{t.photography || 'Photography'}</p>
            </header>
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div><p className="font-bold">{t.billedTo || 'Billed To'}</p><p>{client.name}<br/>{client.address}</p></div>
                <div className="text-right"><p><strong>{t.invoiceNo || 'Invoice #'}:</strong> {invoice.invoiceNumber}</p><p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p></div>
            </section>
            <CategorySpecificDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs bg-white shadow-sm">
                    <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">{t.description || 'Description'}</th><th className="p-2 font-bold text-right">{t.fee || 'Fee'}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
             {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3 space-y-1">
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
// Template 4: Golden Hour
export const PhotographyTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');

    return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
             <header className="p-10 text-white flex justify-between items-center" style={{backgroundColor: accentColor}}>
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <div className="text-right">
                    <h2 className="text-xl">{docTitle} #{invoice.invoiceNumber}</h2>
                </div>
            </header>
            <div className="p-10">
                <section className="grid grid-cols-2 gap-10 text-sm mb-10">
                    <div><p className="font-bold">{t.billedTo || 'Billed To'}</p><p>{client.name}<br/>{client.address}</p></div>
                    <div className="text-right"><p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}<br/><strong>{t.dueDate || 'Due Date'}:</strong> {safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p></div>
                </section>
                <CategorySpecificDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-100"><th className="p-3 font-bold w-3/5">{t.serviceProvided || 'Service Provided'}</th><th className="p-3 font-bold text-right">{t.fee || 'Fee'}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-3">{item.name}</td><td className="p-3 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
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
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};
// Template 5: Portfolio
export const PhotographyTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');
    return (
        <div className={`font-serif p-10 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', borderLeft: `10px solid ${accentColor}`, backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="mb-10">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-xs text-gray-500">{t.professionalPhotography || 'Professional Photography'}</p>
            </header>
            <section className="flex justify-between text-xs mb-10">
                <div><p className="font-bold">{t.client || 'Client'}</p><p>{client.name}</p></div>
                <div><p className="font-bold">{t.invoiceNo || 'Invoice #'}</p><p>{invoice.invoiceNumber}</p></div>
                <div><p className="font-bold">{t.date || 'Date'}</p><p>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
            </section>
            <CategorySpecificDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                 <table className="w-full text-left text-xs">
                    <thead><tr><th className="py-2 border-b-2 font-normal text-gray-500 w-3/5">{t.service || 'Service'}</th><th className="py-2 border-b-2 font-normal text-gray-500 text-right">{t.cost || 'Cost'}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id}><td className="py-2 border-b">{item.name}</td><td className="py-2 border-b text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
             {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <div className="w-1/3 text-sm">
                            <p className="flex justify-between"><span>{t.total || 'Total'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-xl mt-2" style={{color: accentColor}}><span>{t.amountDue || 'Amount Due'}</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold bg-gray-100 p-1"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
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
```