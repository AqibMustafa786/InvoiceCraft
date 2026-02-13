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

export const ConstructionDetails: React.FC<{ document: Estimate; textColor: string; t: any; }> = ({ document, textColor, t }) => {
    if (!document.construction) return null;
    
    return (
         <section className="my-4 text-xs" style={{color: textColor}}>
            <p className="font-bold border-b">{t.constructionDetails || 'Construction Specifics'}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                {document.construction.projectType && <p><span className="font-semibold">{t.projectType || 'Project Type'}:</span> {document.construction.projectType}</p>}
                {document.construction.squareFootage && <p><span className="font-semibold">{t.sqFt || 'Sq Ft'}:</span> {document.construction.squareFootage}</p>}
                {document.construction.lotSize && <p><span className="font-semibold">{t.lotSize || 'Lot Size'}:</span> {document.construction.lotSize}</p>}
                {document.construction.buildingType && <p><span className="font-semibold">{t.buildingType || 'Building Type'}:</span> {document.construction.buildingType}</p>}
                {document.construction.permitRequired && <p><span className="font-semibold">{t.permit || 'Permit Required'}:</span> {document.construction.permitRequired ? (t.yes || 'Yes') : (t.no || 'No')}</p>}
                {document.construction.architectDrawingsProvided && <p><span className="font-semibold">{t.drawings || 'Drawings Provided'}:</span> {document.construction.architectDrawingsProvided ? (t.yes || 'Yes') : (t.no || 'No')}</p>}
                {document.construction.soilCondition && <p><span className="font-semibold">{t.soilCondition || 'Soil Condition'}:</span> {document.construction.soilCondition}</p>}
                {document.construction.materialPreference && <p><span className="font-semibold">{t.materialPreference || 'Material Preference'}:</span> {document.construction.materialPreference}</p>}
                {document.construction.inspectionRequired && <p><span className="font-semibold">{t.inspection || 'Inspection'}:</span> {document.construction.inspectionRequired ? (t.yes || 'Yes') : (t.no || 'No')}</p>}
            </div>
        </section>
    );
};


// Template 1: Classic Professional
export const ConstructionTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE') : (t.estimate || 'ESTIMATE');
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';
    
    return (
        <div className={`p-10 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: style.color }}>
                <div>
                    <h1 className="text-4xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                    <p className="text-xs">{business.phone}</p>
                    <p className="text-xs">{business.email}</p>
                    {business.website && <p className="text-xs">{business.website}</p>}
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{docTitle}</h2>
                    {business.licenseNumber && <p className="text-xs">Lic #: {business.licenseNumber}</p>}
                    {business.taxId && <p className="text-xs">Tax ID: {business.taxId}</p>}
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 my-8 text-sm">
                <div>
                    <p className="font-bold">{(t.billTo || 'BILLED TO')}</p>
                    <p>{client.name}</p>
                    <p>{client.companyName}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div>
                    <p className="font-bold">{(t.project || 'PROJECT')}</p>
                    <p>{document.projectTitle}</p>
                    <p className="whitespace-pre-line">{client.projectLocation}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{(t.date || 'Date')}:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold">{(t.validUntil || 'Valid Until')}:</span> {safeFormat(document.validUntilDate, 'MMM d, yyyy')}</p>
                </div>
            </section>

            <ConstructionDetails document={document} textColor={textColor || '#374151'} t={t} />
            
            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead className="border-b" style={{ borderColor: style.color }}>
                        <tr>
                            <th className="p-2 pb-1 font-bold w-1/2">{(t.description || 'DESCRIPTION')}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.quantity || 'QTY')}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.price || 'PRICE')}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.total || 'TOTAL')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
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
                        <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{document.termsAndConditions.replace(/estimate/gi, docTypeTerm)}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                        <SignatureDisplay signature={document.clientSignature} label={(t.clientSignature || 'Client Signature')} />
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Modern Dark Header
export const ConstructionTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE') : (t.estimate || 'ESTIMATE');
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`p-0 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor }}>
            <header className="p-10 text-white flex justify-between items-start" style={{ backgroundColor: '#1F2937' }}>
                <div>
                     {business.logoUrl ? (
                        <Image src={business.logoUrl} alt="Logo" width={120} height={50} className="filter invert brightness-0"/>
                    ) : (
                        <h1 className="text-4xl font-bold">{business.name}</h1>
                    )}
                    <p className="text-xs whitespace-pre-line mt-2 text-gray-300">{business.address}<br/>{business.phone}<br/>{business.email}</p>
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
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-500 mb-1" style={{color: textColor ? textColor : undefined}}>{(t.projectDetails || 'PROJECT DETAILS')}</p>
                        <p>{document.projectTitle}</p>
                        <p className="whitespace-pre-line">{client.projectLocation}</p>
                        <p className="mt-2"><span className="font-bold">{(t.dateIssued || 'Date Issued')}:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                        <p><span className="font-bold">{(t.expires || 'Expires')}:</span> {safeFormat(document.validUntilDate, 'MMM d, yyyy')}</p>
                    </div>
                </section>

                <ConstructionDetails document={document} textColor={textColor || '#374151'} t={t} />
                
                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-2 font-bold w-[50%]">{(t.item || 'ITEM')}</th>
                                <th className="py-2 font-bold text-center">{(t.quantity || 'QTY')}</th>
                                <th className="py-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE')}</th>
                                <th className="py-2 font-bold text-right">{(t.total || 'TOTAL')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-200">
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
                        <div className="flex justify-between items-start">
                            <div className="w-1/2 text-xs">
                                <p className="font-bold text-gray-500 mb-2" style={{ color: textColor ? textColor : undefined }}>{(t.termsAndConditions || 'TERMS & CONDITIONS')}</p>
                                <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{document.termsAndConditions.replace(/estimate/gi, docTypeTerm)}</p>
                                <div className="flex gap-16 mt-8">
                                    <SignatureDisplay signature={document.business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                                    <SignatureDisplay signature={document.clientSignature} label={(t.clientSignature || 'Client Signature')} />
                                </div>
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
export const ConstructionTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Quote') : (t.estimate || 'Estimate');
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`p-10 font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-12">
                 <div>
                    <h1 className="text-4xl font-light tracking-wider mb-1">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}<br/>{business.phone}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light tracking-wider mb-1">{docTitle}</h2>
                </div>
            </header>

            <section className="mb-10 text-sm">
                <p className="font-bold mb-1">{(t.client || 'CLIENT')}:</p>
                <p>{client.name}</p>
                <p>{client.companyName}</p>
                <p className="whitespace-pre-line">{client.address}</p>
            </section>

             <ConstructionDetails document={document} textColor={textColor || '#374151'} t={t} />
            
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
                                <td className="p-2 border-b border-gray-200 whitespace-pre-line">{item.name}</td>
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
                    <div className="text-xs">
                        <p className="font-bold mb-1">{(t.notes || 'Notes')}</p>
                        <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{document.termsAndConditions.replace(/estimate/gi, docTypeTerm)}</p>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                        <SignatureDisplay signature={document.clientSignature} label={(t.clientSignature || 'Client Signature')} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Side Bar Color Accent
export const ConstructionTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE') : (t.estimate || 'ESTIMATE');
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor }}>
            <div className="w-1/4 p-8 text-white" style={{ backgroundColor: style.color }}>
                <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
                <div className="text-sm space-y-4">
                    <div>
                        <p className="font-bold opacity-80 mb-1">{(t.from || 'FROM')}</p>
                        <p className="whitespace-pre-line">{business.address}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">{(t.for || 'FOR')}</p>
                        <p>{client.name}</p>
                        <p className="whitespace-pre-line">{client.address}</p>
                    </div>
                     <div>
                        <p className="font-bold opacity-80 mb-1">{(t.details || 'DETAILS')}</p>
                        <p>#{document.estimateNumber}</p>
                        <p>{(t.date || 'Date')}: {safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                    </div>
                </div>
            </div>
            <div className="w-3/4 p-10 flex flex-col" style={{color: textColor}}>
                 <main className="flex-grow">
                    <div className='flex justify-end mb-4'>
                        <div className="text-right">
                            <h2 className="text-3xl font-bold">{docTitle}</h2>
                        </div>
                    </div>
                    <ConstructionDetails document={document} textColor={textColor || '#374151'} t={t} />
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
                                    <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
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
                           <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{document.termsAndConditions.replace(/estimate/gi, docTypeTerm)}</p>
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
export const ConstructionTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE') : (t.estimate || 'ESTIMATE');
    const docTypeTerm = document.documentType === 'quote' ? 'quote' : 'estimate';

    return (
        <div className={`p-10 font-sans text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
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
                </div>
                <div className="p-4 bg-gray-50 rounded">
                    <p className="font-bold text-gray-500 mb-2" style={{color: textColor}}>{(t.details || 'DETAILS')}</p>
                    <p><span className="font-semibold">No:</span> {document.estimateNumber}</p>
                    <p><span className="font-semibold">{(t.date || 'Date')}:</span> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded break-words">
                    <p className="font-bold text-gray-500 mb-2" style={{color: textColor}}>{(t.contact || 'CONTACT')}</p>
                    <p>{business.phone}</p>
                    <p>{business.email}</p>
                    <p>{business.website}</p>
                </div>
            </section>

             <ConstructionDetails document={document} textColor={textColor || '#374151'} t={t} />
            
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
                                <td className="p-3 align-top whitespace-pre-line">{item.name}</td>
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
                             <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{document.termsAndConditions.replace(/estimate/gi, docTypeTerm)}</p>
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

export const ConstructionTemplate6: React.FC<TemplateProps> = (props) => <ConstructionTemplate1 {...props} />;
