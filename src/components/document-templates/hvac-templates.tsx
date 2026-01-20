
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

const SignatureDisplay = ({ signature, label, style }: { signature: any, label: string, style?: React.CSSProperties }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8" style={style}>
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b" style={{borderColor: '#374151'}} />
            <p className="text-xs pt-1 border-t-2 w-[150px]" style={{borderColor: '#374151'}}>{label}</p>
        </div>
    )
}

const HvacDetails: React.FC<{ document: Estimate; textColor: string, t: any; }> = ({ document, textColor, t }) => {
    if (!document.hvac) return null;
    const { hvac } = document;
    return (
        <section className="my-4 text-xs" style={{color: textColor}}>
            <p className="font-bold border-b">{t.hvacSpecifications || 'HVAC Specifications'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2">
                <p><span className="font-semibold">{t.service || 'Service'}:</span> {hvac.serviceType}</p>
                <p><span className="font-semibold">{t.system || 'System'}:</span> {hvac.systemType}</p>
                {hvac.unitSize && <p><span className="font-semibold">{t.unitSize || 'Unit Size'}:</span> {hvac.unitSize}</p>}
                {hvac.seerRating && <p><span className="font-semibold">SEER:</span> {hvac.seerRating}</p>}
                <p><span className="font-semibold">{t.furnace || 'Furnace'}:</span> {hvac.furnaceType}</p>
                <p><span className="font-semibold">{t.thermostat || 'Thermostat'}:</span> {hvac.thermostatType}</p>
                <p><span className="font-semibold">{t.ductwork || 'Ductwork'}:</span> {hvac.ductworkRequired ? (t.required || 'Required') : (t.notRequired || 'Not Required')}</p>
                {hvac.refrigerantType && <p><span className="font-semibold">{t.refrigerant || 'Refrigerant'}:</span> {hvac.refrigerantType}</p>}
                {hvac.existingSystemCondition && <p className="col-span-full"><span className="font-semibold">{t.existingSystem || 'Existing System'}:</span> {hvac.existingSystemCondition}</p>}
            </div>
        </section>
    );
};


// Base Template inspired by user image
export const HVACTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE') : (t.estimate || 'ESTIMATE');
    
    return (
        <div className={`p-8 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: `9pt`, minHeight: '1056px', color: textColor, backgroundColor: document.backgroundColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: style.color }}>
                <div className="flex items-center gap-4">
                     {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={50} height={50} className="object-contain" />}
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs whitespace-pre-line">{business.address}</p>
                        <p className="text-xs">{business.email} | {business.phone}</p>
                         {business.website && <p className="text-xs">{business.website}</p>}
                         {business.licenseNumber && <p className="text-xs">Lic #: {business.licenseNumber}</p>}
                    </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-700">{docTitle}</h2>
                  <p className="text-xs">#{document.estimateNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 my-6 text-xs border-b pb-6">
                 <div>
                    <p className="font-bold text-gray-500 mb-1">{t.clientInformation || 'CLIENT INFORMATION'}</p>
                    <p className="font-semibold">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                </div>
                 <div className="p-4 bg-gray-50 rounded-md">
                     {document.referenceNumber && <p className="mt-2"><span className="font-bold text-gray-500">Ref #:</span><br/>{document.referenceNumber}</p>}
                     <p className="font-bold text-gray-500 mt-2 mb-1">{t.dateIssued || 'Date Issued'}</p>
                     <p>{safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                     <p className="font-bold text-gray-500 mt-2 mb-1">{t.validUntil || 'Valid Until'}</p>
                     <p>{safeFormat(document.validUntilDate, 'MMM d, yyyy')}</p>
                </div>
            </section>
            
            <HvacDetails document={document} textColor={textColor || '#374151'} t={t} />

            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: `${style.color}20`}}>
                            <th className="p-2 font-bold w-3/5">{t.description || 'DESCRIPTION'}</th>
                            <th className="p-2 font-bold text-center">{t.quantity || 'QUANTITY'}</th>
                            <th className="p-2 font-bold text-right">{t.unitCost || 'UNIT COST'}</th>
                            <th className="p-2 font-bold text-right">{t.subtotal || 'SUB-TOTAL'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-6 flex justify-between items-end">
                    <div className="w-1/2 text-xs">
                        <p className="font-bold mb-1" style={{ color: style.color }}>{t.termsAndConditions || 'TERMS & CONDITION'}:</p>
                        <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                         <div className="flex gap-16 mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                            <SignatureDisplay signature={document.clientSignature} label={(t.clientSignature || 'Client Signature')} />
                        </div>
                    </div>
                     <div className="w-2/5">
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between p-1"><span>{t.subtotal || 'Sub-total'}:</span><span className="font-medium">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                            {summary.discount > 0 && <div className="flex justify-between p-1"><span>{t.discount || 'Discount'}:</span><span className="font-medium text-red-500">-{currencySymbol}{summary.discount.toFixed(2)}</span></div>}
                            {summary.shippingCost > 0 && <div className="flex justify-between p-1"><span>{t.shipping || 'Shipping'}:</span><span className="font-medium">{currencySymbol}{summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between p-1"><span>{t.tax || 'Tax'} ({summary.taxPercentage}%):</span><span className="font-medium">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between p-2 mt-1 border-t-2 border-gray-400 font-bold" style={{ color: style.color }}><span className="text-base">{t.totalCost || 'TOTAL COST'}:</span><span className="text-base">{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 2: Coolant
export const HVACTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#3B82F6';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', color: textColor, backgroundColor: document.backgroundColor }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500">{t.client || 'Client'}:</p>
                    <p className="font-semibold">{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{document.documentType === 'quote' ? t.quoteNo : t.estimateNo || 'Number #'}:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">{t.date || 'Date'}:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                </div>
            </section>
            
            <HvacDetails document={document} textColor={textColor || '#374151'} t={t}/>

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
                                <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
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
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between">{t.discount || 'Discount'}: <span className="text-red-600">-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between">{t.shipping || 'Shipping/Extra'}: <span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold text-gray-500 mb-2">{t.termsAndConditions || 'Terms & Conditions'}</p>
                        <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={"Owner Signature"} />
                        <SignatureDisplay signature={document.clientSignature} label={"Client Signature"} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Clean & Grid-based
export const HVACTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Quote') : (t.estimate || 'Estimate');

    return (
        <div className={`p-10 font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Roboto, sans-serif', fontSize: `9pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-4xl font-light tracking-wide">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{docTitle.toUpperCase()}</h2>
                    <p className="text-xs text-gray-500">#{document.estimateNumber}</p>
                </div>
            </header>

            <section className="mb-8 p-4 border rounded-md grid grid-cols-3 gap-4 text-xs">
                <div><p className="font-bold">{(t.from || 'From')}:</p><p className="font-bold">{business.name}<br/>{business.address}</p></div>
                <div><p className="font-bold">{(t.to || 'To')}:</p><p>{client.name}<br/>{client.companyName && `${client.companyName}<br/>`}{client.address}</p></div>
                <div><p className="font-bold">{(t.details || 'Details')}:</p><p>{t.date || 'Date'}: {safeFormat(document.estimateDate, 'MM-dd-yyyy')}<br/>Valid: {safeFormat(document.validUntilDate, 'MM-dd-yyyy')}</p></div>
            </section>
            
             <HvacDetails document={document} textColor={textColor || '#374151'} t={t}/>

            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 font-bold w-1/2">{(t.serviceDescription || 'SERVICE DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'QUANTITY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                 <footer className="mt-auto pt-8 flex justify-between items-start">
                     <div className="w-1/2 text-xs">
                         <p className="font-bold mb-1">{(t.terms || 'TERMS')}</p>
                         <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                         <div className="flex gap-16 mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                            <SignatureDisplay signature={document.clientSignature} label={(t.clientSignature || 'Client Signature')} />
                        </div>
                     </div>
                     <div className="w-1/3 text-right text-sm">
                         <p className="py-1 flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                         {summary.discount > 0 && <p className="py-1 flex justify-between text-red-500"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                         {summary.shippingCost > 0 && <p className="py-1 flex justify-between"><span>{(t.shipping || 'Shipping')}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                         <p className="py-1 flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                         <p className="py-2 mt-2 flex justify-between border-t-2 border-black font-bold text-base"><span>{(t.total || 'TOTAL')}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                     </div>
                 </footer>
            )}
        </div>
    );
};

export const HVACTemplate4: React.FC<TemplateProps> = (props) => <HVACTemplate1 {...props} />;
export const HVACTemplate5: React.FC<TemplateProps> = (props) => <HVACTemplate2 {...props} />;
