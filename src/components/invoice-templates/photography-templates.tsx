

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

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8">
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-500 pt-1 border-t-2 border-gray-700 w-[150px]">{label}</p>
        </div>
    )
}

const PhotographyDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.photography) return null;
    const { photography } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-400 mb-2 border-b border-gray-600">{(t.sessionDetails || 'SESSION DETAILS').toUpperCase()}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-300">{(t.eventType || 'Event')}:</span> {photography.eventType}</p>
                <p><span className="font-semibold text-gray-300">{(t.shootDate || 'Date')}:</span> {safeFormat(photography.shootDate, 'MM/dd/yyyy')}</p>
                {photography.hoursOfCoverage && <p><span className="font-semibold text-gray-300">{(t.coverage || 'Coverage')}:</span> {photography.hoursOfCoverage} hrs</p>}
                <p><span className="font-semibold text-gray-300">{(t.package || 'Package')}:</span> {photography.packageSelected}</p>
                {photography.editedPhotosCount && <p><span className="font-semibold text-gray-300">{(t.editedPhotos || 'Edits')}:</span> {photography.editedPhotosCount}</p>}
                {photography.rawFilesCost && <p><span className="font-semibold text-gray-300">{(t.rawFiles || 'RAWs')}:</span> ${photography.rawFilesCost.toFixed(2)}</p>}
                {photography.travelFee && <p><span className="font-semibold text-gray-300">{(t.travelFee || 'Travel')}:</span> ${photography.travelFee.toFixed(2)}</p>}
                {photography.equipmentRentalFee && <p><span className="font-semibold text-gray-300">{(t.equipmentFee || 'Gear')}:</span> ${photography.equipmentRentalFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Lens
export const PhotographyTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, subtotal, taxAmount, discountAmount, total, currencySymbol, t } = props;
    const { business, client } = invoice;
    const accentTextColor = "#D4AF37"; // A gold-like color for accents
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`font-serif bg-[#333333] text-white flex flex-col ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px' }}>
            <header className="relative h-48 w-full">
                <Image src="https://picsum.photos/seed/camera-lens/800/200" layout="fill" objectFit="cover" alt="Camera" data-ai-hint="camera lens" />
            </header>
            
            <div className="p-10 flex-grow flex flex-col">
                <section className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h1 className="text-4xl tracking-wider">{docTitle}</h1>
                        <p className="text-sm mt-2">{t.no || 'No.'} {invoice.invoiceNumber}</p>
                        <p className="text-sm">{safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                        <p className="text-sm">Due: {safeFormat(invoice.dueDate, 'MMMM d, yyyy')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm">Invoice to:</p>
                        <p className="text-xl font-bold">{client.name}</p>
                        {client.companyName && <p className="text-xl font-bold">{client.companyName}</p>}
                        <p className="text-xs whitespace-pre-line">{client.address}</p>
                    </div>
                </section>

                <PhotographyDetails invoice={invoice} t={t} />

                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b" style={{borderColor: accentTextColor}}>
                                <th className="py-2 font-normal w-3/5" style={{color: accentTextColor}}>DESCRIPTION</th>
                                <th className="py-2 font-normal text-right" style={{color: accentTextColor}}>PRICE</th>
                                <th className="py-2 font-normal text-center" style={{color: accentTextColor}}>QUANTITY</th>
                                <th className="py-2 font-normal text-right" style={{color: accentTextColor}}>TOTAL</th>
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
                            <p style={{color: accentTextColor}}>Send Payments To:</p>
                            <p>{business.name}</p>
                            <p>{business.email}</p>
                            <div className="flex justify-between mt-8">
                                <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                                <SignatureDisplay signature={invoice.clientSignature} label={t.clientSignature || 'Client Signature'} />
                            </div>
                        </div>
                        <div className="w-1/3 text-sm space-y-2 text-right">
                            <p className="flex justify-between"><span>Total Amount</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between text-red-400"><span>Discount</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>Shipping</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold"><span>Total</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-400"><span>Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-base mt-2 pt-2" style={{color: accentTextColor}}><span>Amount due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
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
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor, total } = props;
    const { business, client } = invoice;
     return (
        <div className={`font-sans bg-white text-gray-800 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="p-10 flex justify-between items-start" style={{backgroundColor: accentColor || '#111827', color: 'white'}}>
                 <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs opacity-80 whitespace-pre-line">{business.address}</p>
                </div>
                 <div className="text-right">
                    <h2 className="text-2xl font-bold">INVOICE</h2>
                    <p>#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <div className="p-10">
                <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                     <div>
                        <p className="font-bold">Client</p>
                        <p>{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                     </div>
                     <div className="text-right">
                        <p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                        <p><strong>Due:</strong> {safeFormat(invoice.dueDate, 'MMMM d, yyyy')}</p>
                    </div>
                </section>
                <PhotographyDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="border-b-2"><th className="pb-2 font-bold w-3/5">Description</th><th className="pb-2 font-bold text-right">Amount</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                 {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8">
                        {(invoice.amountPaid || 0) > 0 && <p className="text-right text-green-600">Paid: -{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</p>}
                        <div className="text-right text-3xl font-bold">Total: {currencySymbol}{balanceDue.toFixed(2)}</div>
                         <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                            <SignatureDisplay signature={invoice.clientSignature} label={t.clientSignature || 'Client Signature'} />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};
// Template 3: Aperture
export const PhotographyTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    return (
         <div className={`p-10 font-serif bg-gray-50 text-gray-700 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-sm">Photography</p>
                <p className="text-xs whitespace-pre-line">{business.address}</p>
            </header>
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold">Billed To</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
                    <p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                    <p><strong>Due Date:</strong> {safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p>
                </div>
            </section>
            <PhotographyDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs bg-white shadow-sm">
                    <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">Description</th><th className="p-2 font-bold text-right">Fee</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
             {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3 space-y-1">
                            <p className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between text-red-500"><span>Discount</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>Shipping</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between border-b pb-1"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold"><span>Total</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold mt-2 pt-2 border-t"><span>Balance Due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                        <SignatureDisplay signature={invoice.clientSignature} label={t.clientSignature || 'Client Signature'} />
                    </div>
                </footer>
            )}
        </div>
    );
};
// Template 4: Golden Hour
export const PhotographyTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
             <header className="p-10 text-white flex justify-between items-center" style={{backgroundColor: accentColor || '#b45309'}}>
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <div className="text-right">
                    <h2 className="text-xl">Invoice</h2>
                    <p className="text-xs">#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <div className="p-10">
                <section className="text-xs mb-8">
                    <p className="font-bold">Client:</p>
                    <p>{client.name}, {client.address}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                </section>
                <PhotographyDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-3/5">Service</th><th className="p-2 font-bold text-center">Qty</th><th className="p-2 font-bold text-right">Rate</th><th className="p-2 font-bold text-right">Amount</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-center">{item.quantity}</td><td className="p-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                 {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end text-sm">
                        <div className="w-2/5">
                            <p className="flex justify-between py-1"><span>Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between py-1 text-red-500"><span>Discount:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>Shipping:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between py-1 border-b"><span>Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold"><span>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between py-1 text-green-600"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-lg mt-2 pt-2"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                        <SignatureDisplay signature={invoice.clientSignature} label={t.clientSignature || 'Client Signature'} />
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};
// Template 5: Portfolio
export const PhotographyTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`font-serif p-10 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', borderLeft: `10px solid ${accentColor || '#1f2937'}`, backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="mb-10">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-xs text-gray-500">Professional Photography</p>
            </header>
            <section className="flex justify-between text-xs mb-10">
                <div>
                    <p className="font-bold">Client</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                </div>
                <div><p className="font-bold">Invoice No.</p><p>{invoice.invoiceNumber}</p></div>
                <div><p className="font-bold">Date</p><p>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
            </section>
            <PhotographyDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                 <table className="w-full text-left text-xs">
                    <thead><tr><th className="py-2 border-b-2 font-normal text-gray-500 w-3/5">Service</th><th className="py-2 border-b-2 font-normal text-gray-500 text-right">Cost</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id}><td className="py-2 border-b">{item.name}</td><td className="py-2 border-b text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
             {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <div className="w-1/3 text-sm">
                            <p className="flex justify-between"><span>Total</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-xl mt-2" style={{color: accentColor}}><span>Amount Due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                        <SignatureDisplay signature={invoice.clientSignature} label={t.clientSignature || 'Client Signature'} />
                    </div>
                </footer>
            )}
        </div>
    );
};
