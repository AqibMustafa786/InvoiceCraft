
'use client';

import React from 'react';
import type { Estimate, Quote, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';

interface TemplateProps {
  document: Estimate | Quote;
  pageItems: LineItem[];
  pageIndex: number;
  totalPages: number;
  style: React.CSSProperties;
  t: any;
}

const currencySymbols: { [key: string]: string } = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: '₨' };

const safeFormat = (date: Date | string | number | undefined | null, formatString: string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
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
export const GenericTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();
    
    return (
        <div className={`p-10 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: style.color }}>
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
                    <p className="font-bold mt-1" style={{color: style.color}}>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line mt-1">{client.address}</p>
                    {client.phone && <p>{client.phone}</p>}
                    {client.email && <p>{client.email}</p>}
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{t.date || 'Date'}:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold">{t.validUntil || 'Valid Until'}:</span> {safeFormat(document.validUntilDate, 'MMM d, yyyy')}</p>
                </div>
            </section>
            
            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead className="border-b" style={{ borderColor: style.color }}>
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
                            <div className="flex justify-between py-1"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                            {summary.discount > 0 && <div className="flex justify-between py-1 text-red-600"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></div>}
                            {summary.shippingCost > 0 && <div className="flex justify-between py-1"><span>{(t.shipping || 'Shipping/Extra')}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between py-1"><span>{(t.tax || 'Tax')} ({summary.taxPercentage}%):</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold py-2 mt-2 border-t-2 border-gray-800" style={{ color: style.color }}><span className="text-lg">{(t.total || 'Total')}:</span><span className="text-lg">{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div className="mt-8 text-xs">
                        <p className="font-bold mb-1">{(t.termsAndConditions || 'Terms & Conditions')}</p>
                        <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{document.termsAndConditions}</p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <SignatureDisplay signature={document.business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                        <SignatureDisplay signature={document.clientSignature} label={(t.clientSignature || 'Client Signature')} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 2: Modern Dark Header
export const GenericTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-0 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor }}>
            <header className="p-10 text-white flex justify-between items-start" style={{ backgroundColor: '#1F2937' }}>
                <div>
                     {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={120} height={50} className="mb-2 object-contain filter invert brightness-0" /> : <h1 className="text-4xl font-bold">{business.name}</h1>}
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
                    <h2 className="text-3xl font-bold">{docTitle}</h2>
                </div>
            </header>

            <div className="p-10 flex-grow flex flex-col" style={{color: textColor}}>
                 <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
                    <div>
                        <p className="font-bold text-gray-500 mb-1" style={{color: textColor ? textColor : undefined}}>{(t.clientInformation || 'CLIENT INFORMATION')}</p>
                        <p className="font-bold">{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                        {client.phone && <p>{client.phone}</p>}
                        {client.email && <p>{client.email}</p>}
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-500 mb-1" style={{color: textColor ? textColor : undefined}}>{(t.projectDetails || 'PROJECT DETAILS')}</p>
                        <p>{document.projectTitle}</p>
                        <p className="mt-2"><span className="font-bold">{(t.dateIssued || 'Date Issued')}:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                    </div>
                </section>
                
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
                                <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                                {document.business.ownerSignature && <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />}
                            </div>
                            <div className="w-2/5">
                                <div className="bg-gray-100 p-4 rounded-lg text-sm">
                                    <div className="flex justify-between py-1"><span>{(t.subtotal || 'Subtotal')}:</span><span className="font-medium">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                                    {summary.discount > 0 && <div className="flex justify-between py-1 text-red-600"><span>{(t.discount || 'Discount')}:</span><span className="font-medium">-{currencySymbol}{summary.discount.toFixed(2)}</span></div>}
                                    {summary.shippingCost > 0 && <div className="flex justify-between py-1"><span>{(t.shipping || 'Shipping/Extra')}:</span><span className="font-medium">{currencySymbol}{summary.shippingCost.toFixed(2)}</span></div>}
                                    <div className="flex justify-between py-1"><span>{(t.tax || 'Tax')} ({summary.taxPercentage}%):</span><span className="font-medium">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                                    <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2 border-gray-300"><span>{(t.grandTotal || 'Grand Total')}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
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
export const GenericTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Quote').toUpperCase() : (t.estimate || 'Estimate').toUpperCase();

    return (
        <div className={`p-10 font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
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
                <p className="font-bold mb-1 text-gray-500">{(t.client || 'CLIENT')}:</p>
                <p>{client.name}</p>
                {client.companyName && <p>{client.companyName}</p>}
                <p className="whitespace-pre-line">{client.address}</p>
                {client.phone && <p>{client.phone}</p>}
                {client.email && <p>{client.email}</p>}
                {client.projectLocation && (
                    <div className="mt-2">
                         <p className="font-bold text-gray-500">PROJECT LOCATION:</p>
                         <p className="whitespace-pre-line">{client.projectLocation}</p>
                    </div>
                )}
            </section>
            
            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr>
                            <th className="p-2 font-bold w-1/2 bg-gray-50">{(t.description || 'DESCRIPTION')}</th>
                            <th className="p-2 font-bold text-center bg-gray-50">{(t.quantity || 'QTY')}</th>
                            <th className="p-2 font-bold text-right bg-gray-50">{(t.unitPrice || 'UNIT PRICE')}</th>
                            <th className="p-2 font-bold text-right bg-gray-50">{(t.total || 'TOTAL')}</th>
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
                            <div className="flex justify-between py-1"><span>{(t.subtotal || 'Subtotal')}</span><span className="font-medium">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                             {summary.discount > 0 && <div className="flex justify-between py-1 text-red-600"><span>{(t.discount || 'Discount')}</span><span className="font-medium">-{currencySymbol}{summary.discount.toFixed(2)}</span></div>}
                            {summary.shippingCost > 0 && <div className="flex justify-between py-1"><span>{(t.shipping || 'Shipping/Extra')}</span><span className="font-medium">{currencySymbol}{summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between py-1"><span>{(t.tax || 'Tax')}</span><span className="font-medium">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between py-2 mt-1 border-t-2 border-black font-bold"><span>{(t.total || 'Total')}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                     <div className="flex justify-between items-end mt-4">
                        <SignatureDisplay signature={document.business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                        <SignatureDisplay signature={document.clientSignature} label={(t.clientSignature || 'Client Signature')} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Side Bar Color Accent
export const GenericTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor }}>
            <div className="w-1/3 p-8 text-white" style={{ backgroundColor: style.color }}>
                {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={80} height={80} className="mb-4 object-contain filter invert brightness-0" /> : <h1 className="text-4xl font-bold mb-2">{business.name}</h1>}
                <div className="text-sm space-y-4 mt-8">
                  <div>
                    <p className="font-bold opacity-80 mb-1">{t.client || 'CLIENT'}</p>
                    <p className="font-bold text-lg">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                  </div>
                  <div>
                    <p className="font-bold opacity-80 mb-1">{t.details || 'DETAILS'}</p>
                    <p>#{document.estimateNumber}</p>
                    <p>{t.date || 'Date'}: {safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                  </div>
                </div>
            </div>
            <div className="w-2/3 p-10 flex flex-col" style={{color: textColor}}>
                 <main className="flex-grow">
                    <div className='flex justify-end mb-4'>
                        <div className="text-right">
                            <h2 className="text-3xl font-bold">{docTitle}</h2>
                        </div>
                    </div>
                    <table className="w-full text-left text-sm mt-4">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-2 font-bold w-[50%]">{(t.serviceItem || 'SERVICE / ITEM')}</th>
                                <th className="py-2 font-bold text-center">{(t.quantity || 'QUANTITY')}</th>
                                <th className="py-2 font-bold text-right">{(t.rate || 'RATE')}</th>
                                <th className="py-2 font-bold text-right">{(t.total || 'TOTAL')}</th>
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
                                <div className="flex justify-between p-2 bg-gray-50 rounded-t-lg"><span>{(t.subtotal || 'Subtotal')}:</span><span className="font-medium">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                                {summary.discount > 0 && <div className="flex justify-between p-2 text-red-600"><span>{(t.discount || 'Discount')}:</span><span className="font-medium">-{currencySymbol}{summary.discount.toFixed(2)}</span></div>}
                                {summary.shippingCost > 0 && <div className="flex justify-between p-2"><span>{(t.shipping || 'Shipping/Extra')}:</span><span className="font-medium">{currencySymbol}{summary.shippingCost.toFixed(2)}</span></div>}
                                <div className="flex justify-between p-2"><span>{(t.tax || 'Tax')} ({summary.taxPercentage}%):</span><span className="font-medium">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between p-3 bg-gray-800 text-white rounded-b-lg font-bold text-base"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                            </div>
                        </div>
                        <div className="mt-8 text-xs">
                           <p className="font-bold uppercase tracking-wider mb-2">{(t.paymentScheduleAndTerms || 'Payment Schedule &amp; Terms')}</p>
                           <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{document.termsAndConditions}</p>
                        </div>
                        <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                            <SignatureDisplay signature={document.clientSignature} label={(t.clientApproval || 'Client Approval')} />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Bold & Grid
export const GenericTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-10 font-sans text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                     {business.logoUrl ? (
                        <Image src={business.logoUrl} alt="Logo" width={100} height={40} className="object-contain" />
                     ) : (
                        <h1 className="text-4xl font-bold">{business.name}</h1>
                     )}
                </div>
                 <div className="text-right">
                    <h2 className="text-3xl font-extrabold text-gray-400">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-8 mb-10 text-xs">
                <div className="p-4 bg-gray-50 rounded">
                    <p className="font-bold text-gray-500 mb-2" style={{color: textColor}}>{(t.client || 'CLIENT')}</p>
                    <p className="font-bold text-base">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone} | {client.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                    <p className="font-bold text-gray-500 mb-2" style={{color: textColor}}>{(t.details || 'DETAILS')}</p>
                    <p><span className="font-semibold">No:</span> {document.estimateNumber}</p>
                    <p><span className="font-semibold">{t.date || 'Date'}:</span> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p>
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
            
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead style={{ backgroundColor: style.color, color: 'white' }}>
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
                             <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{document.termsAndConditions}</p>
                         </div>
                         <div className="w-2/5">
                            <div className="flex justify-between p-2"><span>{(t.subtotal || 'Subtotal')}</span><span className="font-medium">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                             {summary.discount > 0 && <div className="flex justify-between p-2 text-red-600"><span>{(t.discount || 'Discount')}</span><span className="font-medium">-{currencySymbol}{summary.discount.toFixed(2)}</span></div>}
                            {summary.shippingCost > 0 && <div className="flex justify-between p-2"><span>{(t.shipping || 'Shipping/Extra')}</span><span className="font-medium">{currencySymbol}{summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between p-2"><span>{(t.tax || 'Tax')}</span><span className="font-medium">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between p-2 mt-2 border-t-2 border-black font-bold text-xl"><span >{(t.total || 'TOTAL').toUpperCase()}</span><span >{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                         </div>
                     </div>
                      <div className="flex justify-between mt-12">
                        <SignatureDisplay signature={document.business.ownerSignature} label={(t.companySignature || 'Company Signature')} />
                        <SignatureDisplay signature={document.clientSignature} label={(t.clientApproval || 'Client Approval')} />
                    </div>
                </footer>
            )}
        </div>
    );
};

    
