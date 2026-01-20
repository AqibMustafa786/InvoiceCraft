
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

const RealEstateDetails: React.FC<{ document: Estimate, t: any }> = ({ document, t }) => {
    if (!document.realEstate) return null;
    const { realEstate } = document;
    const hasDetails = Object.values(realEstate).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.propertyDetails || 'Property Details'}</p>
            </section>
        );
    }
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.propertyDetails || 'Property Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {realEstate.propertyAddress && <p><span className="font-semibold text-gray-600">{t.property || 'Property'}:</span> {realEstate.propertyAddress}</p>}
                {realEstate.unitNumber && <p><span className="font-semibold text-gray-600">{t.unit || 'Unit'}:</span> {realEstate.unitNumber}</p>}
                {realEstate.leaseTerm && <p><span className="font-semibold text-gray-600">{t.leaseTerm || 'Lease Term'}:</span> {realEstate.leaseTerm}</p>}
                {realEstate.tenantName && <p><span className="font-semibold text-gray-600">{t.tenant || 'Tenant'}:</span> {realEstate.tenantName}</p>}
                {realEstate.monthlyRent && <p><span className="font-semibold text-gray-600">{t.rent || 'Rent'}:</span> ${realEstate.monthlyRent.toFixed(2)}</p>}
                {realEstate.cleaningFee && <p><span className="font-semibold text-gray-600">{t.cleaningFee || 'Cleaning'}:</span> ${realEstate.cleaningFee.toFixed(2)}</p>}
                {realEstate.maintenanceFee && <p><span className="font-semibold text-gray-600">{t.maintenance || 'Maintenance'}:</span> ${realEstate.maintenanceFee.toFixed(2)}</p>}
                {realEstate.lateFee && <p><span className="font-semibold text-gray-600">{t.lateFee || 'Late Fee'}:</span> ${realEstate.lateFee.toFixed(2)}</p>}
                {realEstate.hoaCharges && <p><span className="font-semibold text-gray-600">{t.hoa || 'HOA'}:</span> ${realEstate.hoaCharges.toFixed(2)}</p>}
                {realEstate.utilityCharges && <p><span className="font-semibold text-gray-600">{t.utilities || 'Utilities'}:</span> ${realEstate.utilityCharges.toFixed(2)}</p>}
            </div>
        </section>
    );
};

export const RealEstateTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? t.quote || 'QUOTE' : t.estimate || 'ESTIMATE';

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                  {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={100} height={100} className="object-contain" /> : <h1 className="text-3xl font-bold">{business.name}</h1>}
                   <div className="text-xs mt-2 text-gray-600" style={{color: textColor ? `${textColor}B3` : undefined}}>
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone}</p>
                        <p>{business.email}</p>
                        {business.website && <p>{business.website}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold" style={{color: style.color}}>{docTitle.toUpperCase()}</h2>
                    <p>#{document.estimateNumber}</p>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                <div>
                    <p className="font-bold text-gray-500" style={{color: textColor ? `${textColor}B3` : undefined}}>{(t.tenantInfo || 'Tenant Information').toUpperCase()}</p>
                    <p className="font-bold">{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-gray-500" style={{color: textColor ? `${textColor}B3` : undefined}}>{(t.date || 'Date').toUpperCase()}</p>
                    <p>{safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
                </div>
            </section>
            <RealEstateDetails document={document} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b-2"><th className="pb-2 font-bold w-3/5">{(t.description || 'DESCRIPTION').toUpperCase()}</th><th className="pb-2 font-bold text-center">{(t.quantity || 'QUANTITY').toUpperCase()}</th><th className="pb-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th><th className="pb-2 font-bold text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th></tr></thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="py-2"><p className="font-semibold whitespace-pre-line">{item.name}</p>{item.description && <p className="text-xs text-muted-foreground whitespace-pre-line">{item.description}</p>}</td>
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
                <div className="flex justify-end text-right text-sm">
                    <div className="w-1/2">
                        <p className="flex justify-between py-1"><span className="text-gray-600">{t.totalCharges || 'Total Charges'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        {summary.discount > 0 && <p className="flex justify-between py-1 text-red-500"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                        {summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{(t.shipping || 'Other Fees')}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between py-1"><span className="text-gray-600">{(t.tax || 'Tax')}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-2xl mt-2 pt-2 border-t-2">
                            <span>{(t.totalDue || 'Total Due').toUpperCase()}:</span>
                            <span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span>
                        </p>
                    </div>
                </div>
                 <div className="text-xs mt-8">
                    <p className="font-bold">{t.termsAndConditions || 'Terms &amp; Conditions'}:</p>
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
}

export const RealEstateTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'ESTIMATE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();
    return (
      <div className={`p-10 bg-gray-50 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
        <header className="flex justify-between items-center mb-8 pb-4 border-b-2">
            <div>
                <h1 className="text-2xl font-bold">{business.name}</h1>
                <p className="text-xs mt-1 text-gray-500">{business.address}</p>
            </div>
            <h2 className="text-2xl font-light text-gray-500">{docTitle}</h2>
        </header>
        <section className="grid grid-cols-2 gap-8 text-sm mb-8">
            <div><p><strong>{t.to || 'To'}:</strong> {client.name}</p><p>{client.address}</p></div>
            <div className="text-right"><p><strong>#:</strong> {document.estimateNumber}</p><p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p></div>
        </section>
        <RealEstateDetails document={document} t={t} />
        <main className="flex-grow mt-4">
            <table className="w-full text-left text-sm">
                <thead><tr className="bg-gray-200"><th className="p-2 w-1/2 font-bold">{t.item || 'Item'}</th><th className="p-2 font-bold text-center">{(t.quantity || 'Qty')}</th><th className="p-2 font-bold text-right">{(t.unitPrice || 'Unit Price')}</th><th className="p-2 font-bold text-right">{t.total || 'TOTAL'}</th></tr></thead>
                <tbody>
                    {pageItems.map(item => (
                        <tr key={item.id} className="border-b">
                            <td className="p-2 font-semibold">{item.name}</td>
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
                    <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                    {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                    <p className="flex justify-between border-b pb-1"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                    <p className="flex justify-between font-bold mt-2"><span>{t.total || 'Total'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
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
export const RealEstateTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'Quote' : 'Estimate';
    return (
      <div className={`p-10 font-serif bg-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
        <header className="text-center mb-10">
            <h1 className="text-4xl font-bold">{business.name}</h1>
            <p className="text-xs mt-1">{business.address}</p>
        </header>
        <div className="w-full h-px bg-gray-300 mb-8"></div>
        <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div>
                <p><strong>{t.billedFor || 'Billed For'}:</strong></p>
                <p>{client.name}</p>
            </div>
            <div className="text-right">
                <p><strong>{docTitle} #:</strong> {document.estimateNumber}</p>
                <p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
            </div>
        </section>
        <RealEstateDetails document={document} t={t} />
        <main className="flex-grow mt-4">
            <table className="w-full text-left text-sm">
                <thead><tr className="border-b-2 border-t-2"><th className="py-2 w-1/2">{t.item || 'Item'}</th><th className="py-2 text-center">{t.quantity || 'Qty'}</th><th className="py-2 text-right">{t.unitPrice || 'Unit Price'}</th><th className="py-2 text-right">{t.amount || 'Amount'}</th></tr></thead>
                <tbody>
                    {pageItems.map(item => (
                        <tr key={item.id} className="border-b">
                            <td className="py-2 font-semibold">{item.name}</td>
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
                    <p className="flex justify-between py-1"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                    <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2"><span>{t.totalDue || 'Total Due'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                </div>
            </div>
             <div className="text-xs mt-8">
                <p className="font-bold">{t.termsAndConditions || 'Terms &amp; Conditions'}:</p>
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
export const RealEstateTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? t.quote || 'QUOTE' : t.estimate || 'ESTIMATE';

    return (
        <div className={`flex font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            {/* Left Sidebar */}
            <div className="w-1/3 text-white p-8 flex flex-col" style={{backgroundColor: style.color}}>
                <h2 className="text-4xl font-bold mb-10">{docTitle.toUpperCase()}</h2>
                <div className="space-y-6 text-sm mt-auto">
                    <div>
                        <p className="font-bold opacity-80">{t.date || 'Date'}</p>
                        <p>{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80">{t.validUntil || 'Valid Until'}</p>
                        <p>{safeFormat(document.validUntilDate, 'yyyy-MM-dd')}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80">#</p>
                        <p>{document.estimateNumber}</p>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="w-2/3 p-10 flex flex-col">
                <header className="mb-10 text-right">
                    {business.logoUrl && <Image src={business.logoUrl} alt="Company Logo" width={80} height={40} className="object-contain ml-auto mb-2"/>}
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs text-muted-foreground">{business.address}</p>
                </header>

                <section className="mb-10 text-sm">
                    <p className="font-bold text-muted-foreground">{t.to || 'To'}:</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                </section>
                
                <RealEstateDetails document={document} t={t} />

                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 font-bold w-3/5">{t.description || 'Description'}</th>
                                <th className="p-2 font-bold text-right">{t.total || 'Total'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2">{item.name}</td>
                                    <td className="p-2 text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>

                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end text-right">
                        <div className="w-1/2 space-y-2 text-sm">
                           <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span> <span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                           <p className="flex justify-between"><span>{t.tax || 'Tax'} ({summary.taxPercentage}%):</span> <span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                           <div className="p-4 bg-gray-100 rounded-md mt-2">
                               <p className="flex justify-between font-bold text-lg"><span>{t.totalDue || 'Total Due'}:</span> <span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                           </div>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">{t.termsAndConditions || 'Terms &amp; Conditions'}:</p>
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
export const RealEstateTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? t.quote || 'Quote' : t.estimate || 'Estimate';
    return (
        <div className={`p-10 font-serif ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: '#FDFBF7', color: '#5A4A42' }}>
            <header className="text-center mb-10">
                <h1 className="text-2xl font-bold">{business.name}</h1>
                <div className="text-xs mt-1">
                    <p className="whitespace-pre-line">{business.address}</p>
                    <p>{business.phone} | {business.email}</p>
                    {business.website && <p>{business.website}</p>}
                </div>
            </header>
            <h2 className="text-center text-xl mb-8">{docTitle.toUpperCase()}</h2>
            <section className="text-xs mb-8">
                <p><strong>{t.to || 'To'}:</strong> {client.name}</p>
                <p className="whitespace-pre-line">{client.address}</p>
                <p>{client.phone} | {client.email}</p>
                <p className="mt-2"><strong>{t.no || 'No'}:</strong> {document.estimateNumber}</p>
                <p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
                <p><strong>{t.validUntil || 'Valid Until'}:</strong> {safeFormat(document.validUntilDate, 'MM/dd/yyyy')}</p>
            </section>
            <RealEstateDetails document={document} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr><th className="py-2 border-b-2 w-1/4">{(t.item || 'ITEM').toUpperCase()}</th><th className="py-2 border-b-2 w-2/4">{(t.description || 'DESCRIPTION').toUpperCase()}</th><th className="py-2 border-b-2 text-center">{(t.quantity || 'QTY').toUpperCase()}</th><th className="py-2 border-b-2 text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th><th className="py-2 border-b-2 text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th></tr></thead>
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
                        <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                        {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold mt-2 pt-2 border-t"><span>{t.total || 'TOTAL'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </div>
                 <div className="text-xs mt-8">
                    <p className="font-bold">{t.paymentInstructions || 'Payment Instructions'}:</p>
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
