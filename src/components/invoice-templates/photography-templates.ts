'use client';

import React from 'react';
import type { Estimate, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';

interface TemplateProps {
  document: Estimate;
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

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8">
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-500 pt-1 border-t-2 border-gray-700 w-[150px]">{label}</p>
        </div>
    )
}

const PhotographyDetails: React.FC<{ document: Estimate, t: any }> = ({ document, t }) => {
    if (!document.photography) return null;
    const { photography } = document;
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
export const PhotographyTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentTextColor = "#D4AF37"; // A gold-like color for accents
    const docTitle = document.documentType === 'quote' ? t.quote || 'QUOTE' : t.estimate || 'ESTIMATE';

    return (
        <div className={`font-serif bg-[#333333] text-white flex flex-col ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            
            <div className="p-10 flex-grow flex flex-col">
                <section className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h1 className="text-4xl tracking-wider">{docTitle.toUpperCase()}</h1>
                        <p className="text-sm mt-2">{t.no || 'No.'} {document.estimateNumber}</p>
                        <p className="text-sm">{safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm">{(document.documentType === 'quote' ? t.quoteTo : t.estimateTo) || 'Estimate to'}:</p>
                        <p className="text-xl font-bold">{client.name}</p>
                    </div>
                </section>
                <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                     <div>
                        <p className="font-bold mb-1 text-gray-400">{(t.billFrom || 'BILL FROM').toUpperCase()}</p>
                        <p className="font-bold">{business.name}</p>
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone}</p>
                        <p>{business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                     <div>
                        <p className="font-bold mb-1 text-gray-400">{(t.billTo || 'BILL TO').toUpperCase()}</p>
                        <p className="font-bold">{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                    </div>
                </section>

                <PhotographyDetails document={document} t={t} />

                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b" style={{borderColor: accentTextColor}}>
                                <th className="py-2 font-normal w-[40%]" style={{color: accentTextColor}}>{(t.item || 'Item').toUpperCase()}</th>
                                <th className="py-2 font-normal w-[40%]" style={{color: accentTextColor}}>{(t.description || 'Description').toUpperCase()}</th>
                                <th className="py-2 font-normal text-right" style={{color: accentTextColor}}>{(t.price || 'Price').toUpperCase()}</th>
                                <th className="py-2 font-normal text-center" style={{color: accentTextColor}}>{(t.quantity || 'Qty').toUpperCase()}</th>
                                <th className="py-2 font-normal text-right" style={{color: accentTextColor}}>{(t.total || 'Total').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-600">
                                    <td className="py-3 font-medium whitespace-pre-line">{item.name}</td>
                                    <td className="py-3 text-xs text-gray-400 whitespace-pre-line">{item.description}</td>
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
                            <p style={{color: accentTextColor}}>{t.sendPaymentsTo || 'Send Payments To'}:</p>
                            <p>{business.name}</p>
                            <p>{business.email}</p>
                             <p className="mt-4 whitespace-pre-line">{document.termsAndConditions}</p>
                            <div className="flex justify-between mt-8">
                                <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                                <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || 'Client Signature'} />
                            </div>
                        </div>
                        <div className="w-1/3 text-sm space-y-2 text-right">
                            <p className="flex justify-between"><span>{t.totalAmount || 'Total Amount'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between text-red-400"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2" style={{color: accentTextColor}}><span>{t.amountDue || 'Amount due'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
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
export const PhotographyTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'ESTIMATE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`font-sans bg-white text-gray-800 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="p-10 flex justify-between items-start" style={{backgroundColor: style.color || '#111827', color: 'white'}}>
                 <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <div className="text-xs opacity-80 mt-1">
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone}</p>
                        <p>{business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                 <div className="text-right">
                    <h2 className="text-2xl font-bold">{docTitle}</h2>
                    <p>#{document.estimateNumber}</p>
                </div>
            </header>
            <div className="p-10">
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
                        <p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
                        <p><strong>{t.validUntil || 'Valid Until'}:</strong> {safeFormat(document.validUntilDate, 'MMMM d, yyyy')}</p>
                        {document.referenceNumber && <p><strong>Ref #:</strong> {document.referenceNumber}</p>}
                    </div>
                </section>
                <PhotographyDetails document={document} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b-2">
                                <th className="pb-2 font-bold w-1/2">{t.item || 'Item'}</th>
                                <th className="pb-2 font-bold w-1/2">{t.description || 'Description'}</th>
                                <th className="pb-2 font-bold text-center">{t.quantity || 'Qty'}</th>
                                <th className="pb-2 font-bold text-right">{t.unitPrice || 'Unit Price'}</th>
                                <th className="pb-2 font-bold text-right">{t.amount || 'Amount'}</th>
                            </tr>
                        </thead>
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
                           <div className="w-2/5">
                                <p className="flex justify-between py-1"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                                {summary.discount > 0 && <p className="flex justify-between py-1 text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                                {summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                                <p className="flex justify-between py-1"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                                <p className="flex justify-between font-bold text-3xl mt-4"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                           </div>
                        </div>
                         <div className="text-xs mt-8">
                            <p className="font-bold">{t.termsAndConditions || 'Terms & Conditions'}:</p>
                            <p className="text-muted-foreground whitespace-pre-line">{document.termsAndConditions}</p>
                        </div>
                         <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                            <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || 'Client Signature'} />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};
// Template 3: Aperture
export const PhotographyTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'ESTIMATE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();
    return (
         <div className={`p-10 font-serif bg-gray-50 text-gray-700 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px' }}>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-sm">{t.photography || 'Photography'}</p>
            </header>
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold">{t.billedTo || 'Billed To'}</p>
                    <p>{client.name}<br/>{client.address}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p>{client.phone} | {client.email}</p>
                </div>
                <div className="text-right">
                    <p><strong>{t.estimateNo || 'Estimate #'}:</strong> {document.estimateNumber}</p>
                    <p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
                </div>
            </section>
            <PhotographyDetails document={document} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs bg-white shadow-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 font-bold w-1/2">{t.item || 'Item'}</th>
                            <th className="p-2 font-bold w-1/2">{t.description || 'Description'}</th>
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
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between text-red-500"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between border-b pb-1"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold mt-2"><span>{t.total || 'Total'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                        <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || 'Client Signature'} />
                    </div>
                </footer>
            )}
        </div>
    );
};
// Template 4: Golden Hour
export const PhotographyTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'Estimate') : (t.estimate || 'Estimate');

    return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px' }}>
            <header className="p-10 text-white flex justify-between items-center" style={{ backgroundColor: style.color || '#b45309' }}>
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <div className="text-right">
                    <h2 className="text-xl">{docTitle} #{document.estimateNumber}</h2>
                </div>
            </header>
            <div className="p-10">
                <section className="grid grid-cols-2 gap-10 text-sm mb-10">
                    <div>
                        <p className="font-bold mb-2" style={{ color: style.color || '#b45309' }}>{t.billedTo || 'Billed To'}</p>
                        <p className="font-semibold">{client.name}</p>
                        {client.companyName && <p className="text-muted-foreground">{client.companyName}</p>}
                        <p className="text-muted-foreground whitespace-pre-line">{client.address}</p>
                        <p className="text-muted-foreground">{client.phone}</p>
                        <p className="text-muted-foreground">{client.email}</p>
                    </div>
                    <div className="text-right">
                         <p className="font-bold mb-2" style={{ color: style.color || '#b45309' }}>{t.billFrom || 'Bill From'}</p>
                         <p className="whitespace-pre-line">{business.address}</p>
                         <p>{business.phone}</p>
                         <p>{business.email}</p>
                         {business.website && <p>{business.website}</p>}
                         {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                         {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </section>
                <section className="text-sm mb-8">
                    <p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
                    <p><strong>{t.validUntil || 'Valid Until'}:</strong> {safeFormat(document.validUntilDate, 'MM/dd/yyyy')}</p>
                </section>
                <PhotographyDetails document={document} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-100"><th className="p-3 font-bold w-1/2">{t.serviceProvided || 'Service Provided'}</th><th className="p-3 font-bold w-1/2">{t.description || 'Description'}</th><th className="p-3 font-bold text-center">{t.quantity || 'Qty'}</th><th className="p-3 font-bold text-right">{t.fee || 'Fee'}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b">
                            <td className="p-3 font-medium whitespace-pre-line">{item.name}</td>
                            <td className="p-3 text-muted-foreground whitespace-pre-line">{item.description}</td>
                            <td className="p-3 text-center">{item.quantity}</td>
                            <td className="p-3 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-10 pt-10 border-t">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3">
                            <p className="flex justify-between py-1"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                             {summary.discount > 0 && <p className="flex justify-between py-1 text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                             {summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{t.shipping || 'Shipping'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                             <p className="flex justify-between py-1"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-lg mt-2"><span>{t.totalDue || 'Total Due'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">{t.termsAndConditions || 'Terms & Conditions'}:</p>
                        <p className="text-muted-foreground whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                        <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || 'Client Signature'} />
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};
// Template 5: Portfolio
export const PhotographyTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'Estimate') : (t.estimate || 'Estimate');
    return (
        <div className={`p-10 font-serif ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', borderLeft: `10px solid ${style.color || '#1f2937'}` }}>
            <header className="mb-10">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-xs text-gray-500">{t.professionalPhotography || 'Professional Photography'}</p>
                 <div className="text-xs mt-1">
                    <p>{business.address}</p>
                    <p>{business.phone} | {business.email}</p>
                    {business.website && <p>{business.website}</p>}
                    {business.licenseNumber && <p>Lic: {business.licenseNumber}</p>}
                    {business.taxId && <p>Tax ID: {business.taxId}</p>}
                </div>
            </header>
            <section className="flex justify-between text-xs mb-10">
                <div>
                    <p className="font-bold">{t.client || 'Client'}</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone} | {client.email}</p>
                </div>
                <div><p className="font-bold">{(document.documentType === 'quote' ? t.quoteNo : t.estimateNo) || 'Number #'}</p><p>{document.estimateNumber}</p></div>
                <div><p className="font-bold">{t.date || 'Date'}</p><p>{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p></div>
                 <div><p className="font-bold">{t.validUntil || 'Valid Until'}</p><p>{safeFormat(document.validUntilDate, 'yyyy-MM-dd')}</p></div>
                 {document.referenceNumber && <div><p className="font-bold">Ref #</p><p>{document.referenceNumber}</p></div>}
            </section>
            <PhotographyDetails document={document} t={t} />
            <main className="flex-grow mt-4">
                 <table className="w-full text-left text-xs">
                    <thead><tr><th className="py-2 border-b-2 font-normal text-gray-500 w-1/3">{t.item || 'ITEM'}</th><th className="py-2 border-b-2 font-normal text-gray-500 w-2/3">{t.description || 'DESCRIPTION'}</th><th className="py-2 border-b-2 font-normal text-gray-500 text-center">{t.quantity || 'QTY'}</th><th className="py-2 border-b-2 font-normal text-gray-500 text-right">{t.unitPrice || 'UNIT PRICE'}</th><th className="py-2 border-b-2 font-normal text-gray-500 text-right">{t.cost || 'Cost'}</th></tr></thead>
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
                     <div className="flex justify-end">
                        <div className="w-1/3 text-sm">
                            <p className="flex justify-between"><span>{t.total || 'Total'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-xl mt-2" style={{color: style.color}}><span>{t.amountDue || 'Amount Due'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">{t.termsAndConditions || 'Terms & Conditions'}:</p>
                        <p className="text-muted-foreground whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                        <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || 'Client Signature'} />
                    </div>
                </footer>
            )}
        </div>
    );
};