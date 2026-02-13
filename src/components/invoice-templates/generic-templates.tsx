
'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
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
    try {
        const d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
    } catch (e) {
        return "Invalid Date";
    }
}

const SignatureDisplay = ({ signature, label, style }: { signature: any, label: string, style?: React.CSSProperties }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8" style={style}>
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b" style={{borderColor: '#374151'}} />
            <p className="text-xs pt-1 border-t-2 w-[150px]" style={{borderColor: '#374151'}}>{label}</p>
        </div>
    )
}

// Template 1: Classic Professional
export const GenericTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    
    return (
        <div className={`p-10 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}pt`, minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    {business.logoUrl ? (
                         <Image src={business.logoUrl} alt="Logo" width={120} height={50} className="object-contain mb-2"/>
                    ) : (
                        <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
                    )}
                    <div className="text-xs space-y-0.5" style={{ color: textColor || '#6B7280' }}>
                        <p className="whitespace-pre-line">{business.address}</p>
                        {business.phone && <p>{business.phone}</p>}
                        {business.email && <p>{business.email}</p>}
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>{t.license || 'Lic #'}: {business.licenseNumber}</p>}
                        {business.taxId && <p>{t.taxId || 'Tax ID'}: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-8 text-sm">
                <div>
                    <p className="font-bold">{((t.billTo as string) || 'BILLED TO').toUpperCase()}</p>
                    <p className="font-bold mt-1" style={{color: accentColor}}>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line mt-1">{client.address}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    {client.phone && <p>{client.phone}</p>}
                    {client.email && <p>{client.email}</p>}
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{t.invoiceNo || 'Invoice #'}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{(t.date || 'Date')}:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold">{(t.dueDate || 'Due Date')}:</span> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />
            
            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead className="border-b" style={{ borderColor: accentColor }}>
                        <tr>
                            <th className="p-2 pb-1 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.price || 'PRICE').toUpperCase()}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="p-2 align-top">
                                    <p className="font-medium whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line" style={{ wordBreak: 'break-all' }}>{item.description}</p>}
                                </td>
                                <td className="p-2 align-top text-right">{item.quantity}</td>
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
                        <div className="w-2/5 text-sm">
                            <div className="flex justify-between py-1"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                            {discountAmount > 0 && <div className="flex justify-between py-1 text-red-600"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                            {invoice.summary.shippingCost > 0 && <div className="flex justify-between py-1"><span>{(t.shipping || 'Shipping/Extra')}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between py-1"><span>{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%):</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold py-2 mt-2 border-t-2 border-gray-800" style={{ color: accentColor }}><span className="text-lg">{(t.total || 'Total')}:</span><span className="text-lg">{currencySymbol}{total.toFixed(2)}</span></div>
                            {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between py-1 text-green-600"><span>{(t.amountPaid || 'Amount Paid')}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                             <div className="flex justify-between font-bold text-lg mt-1 p-2 bg-gray-100"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div className="mt-8 text-xs">
                        <p className="font-bold mb-1">{(t.termsAndConditions || 'Terms & Conditions')}</p>
                        <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{invoice.paymentInstructions}</p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <SignatureDisplay signature={business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 2: Modern Dark Header
export const GenericTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, textColor, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-0 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="p-10 text-white flex justify-between items-start" style={{ backgroundColor: accentColor }}>
                <div>
                     {business.logoUrl ? (
                        <Image src={business.logoUrl} alt="Logo" width={120} height={50} className="mb-2 object-contain filter invert brightness-0"/>
                    ) : (
                        <h1 className="text-4xl font-bold">{business.name}</h1>
                    )}
                     <div className="text-xs space-y-0.5 mt-2" style={{ color: '#D1D5DB' }}>
                        <p className="whitespace-pre-line">{business.address}</p>
                        {business.phone && <p>{business.phone}</p>}
                        {business.email && <p>{business.email}</p>}
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>{t.license || 'Lic #'}: {business.licenseNumber}</p>}
                        {business.taxId && <p>{t.taxId || 'Tax ID'}: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                </div>
            </header>

            <div className="p-10 flex-grow flex flex-col" style={{color: textColor}}>
                 <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
                    <div>
                        <p className="font-bold text-gray-500 mb-1" style={{color: textColor ? textColor : undefined}}>{(t.clientInformation || 'CLIENT INFORMATION')}</p>
                        <p className="font-bold">{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold text-gray-500">Ship To:</span><br/>{client.shippingAddress}</p>}
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-500 mb-1" style={{color: textColor ? textColor : undefined}}>{(t.invoiceDetails || 'INVOICE DETAILS')}</p>
                        <p># {invoice.invoiceNumber}</p>
                        <p>{safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                        <p>Due: {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                        {invoice.poNumber && <p>PO: {invoice.poNumber}</p>}
                    </div>
                </section>
                
                <CategorySpecificDetails invoice={invoice} t={t} />

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-2 font-bold w-[50%]">{(t.item || 'ITEM').toUpperCase()}</th>
                                <th className="py-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-200">
                                     <td className="py-2 align-top">
                                        <p className="font-medium whitespace-pre-line">{item.name}</p>
                                        {item.description && <p className="text-xs text-gray-500 whitespace-pre-line" style={{ wordBreak: 'break-all' }}>{item.description}</p>}
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
                        <div className="flex justify-between items-start">
                            <div className="w-1/2 text-xs">
                                <p className="font-bold text-gray-500 mb-2" style={{ color: textColor ? textColor : undefined }}>{(t.termsAndConditions || 'TERMS & CONDITIONS')}</p>
                                <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                                {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />}
                            </div>
                            <div className="w-2/5">
                                <div className="bg-gray-100 p-4 rounded-lg text-sm">
                                    <div className="flex justify-between py-1"><span>{(t.subtotal || 'Subtotal')}:</span><span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                                    {discountAmount > 0 && <div className="flex justify-between py-1 text-red-600"><span>{(t.discount || 'Discount')}:</span><span className="font-medium">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                                    {invoice.summary.shippingCost > 0 && <div className="flex justify-between py-1"><span>{(t.shipping || 'Shipping/Extra')}:</span><span className="font-medium">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                                    <div className="flex justify-between py-1"><span>{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%):</span><span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                                    <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2 border-gray-300"><span>{(t.grandTotal || 'Grand Total')}:</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                                    {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between py-1 text-green-600"><span>{(t.amountPaid || 'Amount Paid')}:</span><span className="font-medium">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-gray-400"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                                </div>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 3: Minimalist & Clean
export const GenericTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, textColor, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-12">
                 <div>
                    {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="mb-2 object-contain" /> : <h1 className="text-2xl font-bold mb-1">{business.name}</h1>}
                    <div className="text-xs" style={{ color: textColor || '#6B7280' }}>
                        <p className="whitespace-pre-line">{business.address}</p>
                        {business.phone && <p>{business.phone}</p>}
                        {business.email && <p>{business.email}</p>}
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>{t.license || 'Lic #'}: {business.licenseNumber}</p>}
                        {business.taxId && <p>{t.taxId || 'Tax ID'}: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold">{docTitle}</h2>
                </div>
            </header>

            <section className="mb-10 text-sm">
                <p className="font-bold mb-1 text-gray-500">{(t.billTo || 'BILL TO')}:</p>
                <p>{client.name}</p>
                {client.companyName && <p>{client.companyName}</p>}
                <p className="whitespace-pre-line">{client.address}</p>
                {client.phone && <p>{client.phone}</p>}
                {client.email && <p>{client.email}</p>}
                {client.shippingAddress && (
                    <div className="mt-2">
                         <p className="font-bold text-gray-500">SHIP TO:</p>
                         <p className="whitespace-pre-line">{client.shippingAddress}</p>
                    </div>
                )}
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr>
                            <th className="p-2 font-bold w-1/2 bg-gray-50">{(t.item || 'ITEM')}</th>
                            <th className="p-2 font-bold text-center bg-gray-50">{(t.quantity || 'QTY')}</th>
                            <th className="p-2 font-bold text-right bg-gray-50">{(t.rate || 'RATE')}</th>
                            <th className="p-2 font-bold text-right bg-gray-50">{(t.amount || 'AMOUNT')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="p-2 border-b border-gray-200">
                                    <p className="font-medium whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line" style={{ wordBreak: 'break-all' }}>{item.description}</p>}
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
                     <div className="flex justify-end mb-8">
                        <div className="w-1/3 text-sm">
                            <div className="flex justify-between py-1"><span>{(t.subtotal || 'Subtotal')}</span><span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                             {discountAmount > 0 && <div className="flex justify-between py-1 text-red-600"><span>{(t.discount || 'Discount')}</span><span className="font-medium">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                            {invoice.summary.shippingCost > 0 && <div className="flex justify-between py-1"><span>{(t.shipping || 'Shipping/Extra')}</span><span className="font-medium">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between py-1"><span>{(t.tax || 'Tax')}</span><span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between py-2 mt-1 border-t-2 border-black font-bold"><span>{(t.total || 'Total')}</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                            {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between py-1 font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                             <div className="flex justify-between py-1 font-bold bg-gray-100 p-1"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                     <div className="flex justify-between items-end mt-4">
                        <SignatureDisplay signature={business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Creative
export const GenericTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, accentColor, backgroundColor, textColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: backgroundColor, color: textColor }}>
            <div className="w-1/3 p-8 text-white" style={{ backgroundColor: accentColor }}>
                <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
                 <div className="text-sm space-y-1 mt-4 text-white/80">
                    <p className="whitespace-pre-line">{business.address}</p>
                    {business.phone && <p>{business.phone}</p>}
                    {business.email && <p>{business.email}</p>}
                    {business.website && <p>{business.website}</p>}
                    {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                    {business.taxId && <p>Tax ID: {business.taxId}</p>}
                </div>
                <div className="text-sm space-y-4 mt-8">
                  <div>
                    <p className="font-bold opacity-80 mb-1">{(t.client || 'CLIENT').toUpperCase()}</p>
                    <p className="font-bold text-lg">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                  </div>
                  <div>
                    <p className="font-bold opacity-80 mb-1">{(t.details || 'DETAILS').toUpperCase()}</p>
                    <p># {invoice.invoiceNumber}</p>
                    <p>{t.date || 'Date'}: {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                    <p>{t.dueDate || 'Due'}: {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                    {invoice.poNumber && <p>PO: {invoice.poNumber}</p>}
                  </div>
                </div>
            </div>
            <div className="w-2/3 p-10 flex flex-col" style={{color: textColor}}>
                 <main className="flex-grow">
                    <div className='flex justify-end mb-4'>
                        <div className="text-right">
                            <h2 className="text-3xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                        </div>
                    </div>
                    <CategorySpecificDetails invoice={invoice} t={t} />
                    <table className="w-full text-left text-sm mt-4">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-2 font-bold w-[40%]">{(t.serviceItem || 'SERVICE / ITEM').toUpperCase()}</th>
                                <th className="py-2 font-bold w-[30%]">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                                <th className="py-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="py-2 align-top font-medium whitespace-pre-line">{item.name}</td>
                                    <td className="py-2 align-top text-xs text-gray-500 whitespace-pre-line">{item.description}</td>
                                    <td className="py-2 align-top text-center">{item.quantity}</td>
                                    <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="py-2 align-top text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8">
                         <div className="flex justify-end">
                            <div className="w-1/2 text-sm">
                                <div className="flex justify-between p-2 bg-gray-50 rounded-t-lg"><span>{(t.subtotal || 'Subtotal')}:</span><span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                                {discountAmount > 0 && <div className="flex justify-between p-2 text-red-600"><span>{(t.discount || 'Discount')}:</span><span className="font-medium">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                                {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-2"><span>{(t.shipping || 'Shipping/Extra')}:</span><span className="font-medium">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                                <div className="flex justify-between p-2"><span>{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%):</span><span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between p-3 bg-gray-800 text-white rounded-b-lg font-bold text-base"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                                {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between p-2 mt-1 text-green-600 font-bold"><span>Amount Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                                <div className="flex justify-between p-2 font-bold"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                            </div>
                        </div>
                        <div className="mt-8 text-xs">
                           <p className="font-bold uppercase tracking-wider mb-2">{(t.paymentScheduleAndTerms || 'Payment Schedule &amp; Terms')}</p>
                           <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{invoice.paymentInstructions}</p>
                        </div>
                         <div className="flex justify-end mt-4">
                             <SignatureDisplay signature={business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                         </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Bold & Grid
export const GenericTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, accentColor, textColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                     {business.logoUrl ? (
                        <Image src={business.logoUrl} alt="Logo" width={100} height={40} className="object-contain" />
                     ) : (
                        <h1 className="text-4xl font-bold">{business.name}</h1>
                     )}
                </div>
                 <div className="text-right">
                    <h2 className="text-3xl font-extrabold text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-8 mb-10 text-xs">
                <div className="p-4 bg-gray-50 rounded">
                    <p className="font-bold text-gray-500 mb-2" style={{color: textColor}}>{(t.client || 'CLIENT')}</p>
                    <p className="font-bold text-base">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone} | {client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold text-gray-500">Ship To:</span><br/>{client.shippingAddress}</p>}
                </div>
                <div className="p-4 bg-gray-50 rounded">
                    <p className="font-bold text-gray-500 mb-2" style={{color: textColor}}>{(t.details || 'DETAILS')}</p>
                    <p><span className="font-semibold">No:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-semibold">{t.date || 'Date'}:</span> {safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p>
                    <p><span className="font-semibold">{t.dueDate || 'Due'}:</span> {safeFormat(invoice.dueDate, 'MMM dd, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-semibold">PO #:</span> {invoice.poNumber}</p>}
                </div>
                <div className="p-4 bg-gray-50 rounded break-words">
                    <p className="font-bold text-gray-500 mb-2" style={{color: textColor}}>{(t.contact || 'CONTACT')}</p>
                     <p className="whitespace-pre-line">{business.address}</p>
                    <p>{business.phone}</p>
                    <p>{business.email}</p>
                    <p>{business.website}</p>
                     <p>Lic: {business.licenseNumber}</p>
                    <p>Tax ID: {business.taxId}</p>
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />
            
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead style={{ backgroundColor: accentColor, color: 'white' }}>
                        <tr>
                            <th className="p-3 font-bold w-1/2">{(t.itemDescription || 'ITEM DESCRIPTION')}</th>
                            <th className="p-3 font-bold text-center">{(t.quantity || 'QTY')}</th>
                            <th className="p-3 font-bold text-right">{(t.unitPrice || 'UNIT PRICE')}</th>
                            <th className="p-3 font-bold text-right">{(t.total || 'TOTAL')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3 align-top">
                                    <p className="font-medium whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line" style={{ wordBreak: 'break-all' }}>{item.description}</p>}
                                </td>
                                <td className="p-3 align-top text-center">{item.quantity}</td>
                                <td className="p-3 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-3 align-top text-right font-bold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     <div className="flex justify-between items-start">
                         <div className="w-1/2 text-xs">
                             <p className="font-bold mb-1">{(t.terms || 'TERMS')}</p>
                             <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{invoice.paymentInstructions}</p>
                         </div>
                         <div className="w-2/5">
                            <div className="flex justify-between p-2"><span>{(t.subtotal || 'Subtotal')}</span><span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                             {discountAmount > 0 && <div className="flex justify-between p-2 text-red-600"><span>{(t.discount || 'Discount')}</span><span className="font-medium">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                            {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-2"><span>{(t.shipping || 'Shipping/Extra')}</span><span className="font-medium">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between p-2"><span>{(t.tax || 'Tax')}</span><span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between p-2 mt-2 border-t-2 border-black font-bold text-xl"><span >{(t.total || 'TOTAL').toUpperCase()}</span><span >{currencySymbol}{total.toFixed(2)}</span></div>
                            {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between p-2 font-bold text-green-600"><span>Amount Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                             <div className="flex justify-between p-2 font-bold bg-gray-100"><span>Balance Due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                         </div>
                     </div>
                      <div className="flex justify-between mt-12">
                        {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label="Company Signature" />}
                    </div>
                </footer>
            )}
        </div>
    );
};

    
