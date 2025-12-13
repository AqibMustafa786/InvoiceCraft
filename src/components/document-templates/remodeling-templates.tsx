
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
    return isValid(d) ? format(d, formatString) : "Invalid Date";
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

const RemodelingDetails: React.FC<{ document: Estimate; textColor: string, t: any; }> = ({ document, textColor, t }) => {
    if (!document.homeRemodeling) return null;
    const { homeRemodeling } = document;
    return (
        <section className="my-4 text-xs" style={{color: textColor}}>
            <p className="font-bold text-gray-500 mb-2 border-b">{t.projectSpecifics || 'Project Specifics'}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.projectType || 'Project Type'}:</span> {homeRemodeling.projectType}</p>
                <p><span className="font-semibold text-gray-600">{t.propertyType || 'Property Type'}:</span> {homeRemodeling.propertyType}</p>
                {homeRemodeling.squareFootage && <p><span className="font-semibold text-gray-600">{t.sqFt || 'Sq Ft'}:</span> {homeRemodeling.squareFootage}</p>}
                <p><span className="font-semibold text-gray-600">{t.materialGrade || 'Material Grade'}:</span> {homeRemodeling.materialGrade}</p>
                <p><span className="font-semibold text-gray-600">{t.demolition || 'Demolition'}:</span> {homeRemodeling.demolitionRequired ? (t.yes || 'Yes') : (t.no || 'No')}</p>
                <p><span className="font-semibold text-gray-600">{t.permit || 'Permit'}:</span> {homeRemodeling.permitRequired ? (t.yes || 'Yes') : (t.no || 'No')}</p>
                {homeRemodeling.expectedStartDate && <p><span className="font-semibold text-gray-600">{t.startDate || 'Start Date'}:</span> {safeFormat(homeRemodeling.expectedStartDate, 'MMM d, yyyy')}</p>}
                {homeRemodeling.expectedCompletionDate && <p><span className="font-semibold text-gray-600">{t.endDate || 'End Date'}:</span> {safeFormat(homeRemodeling.expectedCompletionDate, 'MMM d, yyyy')}</p>}
                <p className="col-span-2"><span className="font-semibold text-gray-600">{t.rooms || 'Rooms'}:</span> {homeRemodeling.roomsIncluded}</p>
                {homeRemodeling.specialInstructions && <p className="col-span-2"><span className="font-semibold text-gray-600">{t.instructions || 'Instructions'}:</span> {homeRemodeling.specialInstructions}</p>}
            </div>
        </section>
    );
};


// Template 1: Precision (Based on user image)
export const RemodelingTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'Quote').toUpperCase() : (t.estimate || 'Estimate').toUpperCase();
    
    return (
        <div className={`font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="p-10 text-white" style={{ backgroundColor: '#0A2D4D' }}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {business.logoUrl ? 
                            <Image src={business.logoUrl} alt="logo" width={40} height={40}/> :
                            null
                        }
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                    </div>
                </div>
            </header>

            <div className="p-10 flex-grow flex flex-col" style={{color: textColor}}>
                 <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div>
                        <p className="font-bold mb-2">{t.businessInfo || 'Business Information'}</p>
                        <p>{business.phone}</p>
                        <p>{business.email}</p>
                        <p>{business.website}</p>
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                        <p className="whitespace-pre-line mt-2">{business.address}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold mb-2">{t.clientInfo || 'Client Information'}</p>
                        <p><span className="font-bold">{t.name || 'Name'}:</span> {client.name}</p>
                        {client.companyName && <p><span className="font-bold">{t.company || 'Company'}:</span> {client.companyName}</p>}
                        <p><span className="font-bold">{t.address || 'Address'}:</span> {client.address}</p>
                        <p><span className="font-bold">{t.phone || 'Phone'}:</span> {client.phone}</p>
                        <p><span className="font-bold">{t.email || 'Email'}:</span> {client.email}</p>
                    </div>
                </section>

                <div className="flex justify-between items-center mb-4">
                    <div className="text-xs">
                        <p className="font-bold">{t.projectTitle || 'Project Title'}:</p>
                        <p>{document.projectTitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-xs">{document.documentType === 'quote' ? (t.quoteNo || 'Quote #') : (t.estimateNo || 'Estimate #')}:</p>
                        <p className="p-2 px-4 text-white font-bold rounded" style={{ backgroundColor: '#0A2D4D' }}>{document.estimateNumber}</p>
                    </div>
                </div>

                <RemodelingDetails document={document} textColor={textColor || '#374151'} t={t} />

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead style={{ backgroundColor: '#0A2D4D', color: 'white' }}>
                            <tr>
                                <th className="p-2 font-bold w-[50%]">{t.description || 'Description'}</th>
                                <th className="p-2 font-bold text-center">{t.quantity || 'Qty'}</th>
                                <th className="p-2 font-bold text-right">{t.unitPrice || 'Unit Price'}</th>
                                <th className="p-2 font-bold text-right">{t.total || 'Total'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-200">
                                    <td className="p-2 align-top text-gray-600 whitespace-pre-line" style={{color: textColor}}>{item.name}</td>
                                    <td className="p-2 align-top text-center">{item.quantity}</td>
                                    <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        {pageIndex === totalPages - 1 && (
                            <tfoot>
                                <tr><td colSpan={3} className="pt-4 text-right">{t.subtotal || 'Subtotal'}</td><td className="pt-4 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                {summary.discount > 0 && (<tr><td colSpan={3} className="text-right">{t.discount || 'Discount'}</td><td className="text-right text-red-500">-{currencySymbol}{summary.discount.toFixed(2)}</td></tr>)}
                                {summary.shippingCost > 0 && (<tr><td colSpan={3} className="text-right">{t.shipping || 'Shipping'}</td><td className="text-right">{currencySymbol}{summary.shippingCost.toFixed(2)}</td></tr>)}
                                <tr><td colSpan={3} className="text-right">{t.tax || 'Tax'} ({summary.taxPercentage}%)</td><td className="text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                 <tr>
                                     <td colSpan={3} className="p-2 pt-4 text-right font-bold text-base">{t.totalCost || 'Total Cost'}</td>
                                     <td className="p-2 pt-4 text-right font-bold text-base">{currencySymbol}{summary.grandTotal.toFixed(2)}</td>
                                 </tr>
                             </tfoot>
                        )}
                    </table>
                </main>
            
                {pageIndex === totalPages - 1 && (
                    <footer className="pt-8 mt-auto">
                        <div className="w-full h-px bg-gray-300 my-8"></div>
                        <div className="flex justify-between items-start text-xs">
                            <div className="w-1/2">
                                <p className="font-bold mb-2">{t.additionalNotes || 'Additional Notes'}:</p>
                                <ul className="list-disc list-inside text-gray-600 space-y-1" style={{color: textColor}}>
                                   <li className="whitespace-pre-line">{document.termsAndConditions}</li>
                                </ul>
                            </div>
                             <div className="text-right">
                                 <p className="mb-1">{t.date || 'Date'}: {safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
                                 <SignatureDisplay signature={document.business.ownerSignature} label={(t.supervisorSignature || "Supervisor's Signature")} style={{alignItems: 'flex-end', textAlign: 'right'}} />
                             </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 2: Light & Modern
export const RemodelingTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-10 font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-10">
                <div>
                     {business.logoUrl ? <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="mb-2 object-contain"/> : <h1 className="text-3xl font-bold">{business.name}</h1>}
                    <div className="text-xs text-gray-500" style={{color: textColor}}>
                        <p className="whitespace-pre-line">{business.address}</p>
                        {business.phone && <p>{business.phone}</p>}
                        {business.email && <p>{business.email}</p>}
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light" style={{color: style.color}}>{docTitle}</h2>
                    <p className="mt-2"><span className="font-bold text-gray-500">#</span> {document.estimateNumber}</p>
                    <p className="text-xs"><span className="font-bold text-gray-500">{t.date || 'Date'}:</span> {safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
                    <p className="text-xs"><span className="font-bold text-gray-500">{t.validUntil || 'Valid Until'}:</span> {safeFormat(document.validUntilDate, 'MM/dd/yyyy')}</p>
                </div>
            </header>
            
            <section className="p-4 rounded-md mb-8 grid grid-cols-2 gap-4" style={{backgroundColor: `${style.color}1A`}}>
                <div className="text-xs">
                     <p className="font-bold text-gray-500 mb-1" style={{color: textColor}}>{t.client || 'Client'}</p>
                     <p className="font-semibold">{client.name}</p>
                     {client.companyName && <p>{client.companyName}</p>}
                     <p>{client.address}</p>
                     <p>{client.email}</p>
                     <p>{client.phone}</p>
                </div>
                 <div className="text-xs text-right">
                     <p className="font-bold text-gray-500 mb-1" style={{color: textColor}}>{t.project || 'Project'}</p>
                     <p className="font-semibold">{document.projectTitle}</p>
                     <p>{client.projectLocation}</p>
                </div>
            </section>
            
            <RemodelingDetails document={document} textColor={textColor || '#374151'} t={t}/>

            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead className="border-b-2" style={{borderColor: style.color}}>
                        <tr>
                            <th className="py-2 font-bold w-[60%]">{t.serviceDescription || 'Service Description'}</th>
                            <th className="py-2 font-bold text-center">{t.quantity || 'Qty'}</th>
                            <th className="py-2 font-bold text-right">{t.unitPrice || 'Unit Price'}</th>
                            <th className="py-2 font-bold text-right">{t.total || 'Total'}</th>
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
                     <div className="flex justify-end mb-8">
                        <div className="w-2/5 text-sm space-y-1">
                            <div className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                            {summary.discount > 0 && (<div className="flex justify-between text-red-500"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></div>)}
                            {summary.shippingCost > 0 && (<div className="flex justify-between"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></div>)}
                            {summary.taxAmount > 0 && <div className="flex justify-between"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>}
                             <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t" style={{borderColor: style.color}}><span>{t.estimateTotal || 'Estimate Total'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                     <div className="text-xs text-gray-500 border-t pt-4" style={{color: textColor}}>
                         <p className="font-bold mb-1">{t.notesAndTerms || 'Notes and Terms'}</p>
                         <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                     </div>
                     <div className="flex justify-end mt-4">
                        <SignatureDisplay signature={document.business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} style={{alignItems: 'flex-end', textAlign: 'right'}} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Formal with Grid
export const RemodelingTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-10 font-['Times_New_Roman',_serif] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <h2 className="text-2xl font-light">{docTitle}</h2>
            </header>

            <section className="mb-8 p-4 border border-gray-200 rounded grid grid-cols-3 gap-4 text-xs">
                <div>
                    <p className="font-bold">{t.client || 'Client'}:</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p>{client.address}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                </div>
                <div>
                    <p className="font-bold">{t.project || 'Project'}:</p>
                    <p>{document.projectTitle}</p>
                    <p>{client.projectLocation}</p>
                </div>
                <div>
                    <p className="font-bold">{document.documentType === 'quote' ? t.quoteNo : t.estimateNo || 'Number #'}:</p>
                    <p>{document.estimateNumber}</p>
                    <p className="font-bold mt-1">{t.date || 'Date'}:</p>
                    <p>{safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
                    <p className="font-bold mt-1">{t.validUntil || 'Valid Until'}:</p>
                    <p>{safeFormat(document.validUntilDate, 'MM/dd/yyyy')}</p>
                </div>
            </section>
            
            <RemodelingDetails document={document} textColor={textColor || '#374151'} t={t}/>

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 font-bold w-1/2">{t.item || 'ITEM'}</th>
                            <th className="p-2 font-bold text-center">{t.quantity || 'QUANTITY'}</th>
                            <th className="p-2 font-bold text-right">{t.unitPrice || 'UNIT PRICE'}</th>
                            <th className="p-2 font-bold text-right">{t.lineTotal || 'LINE TOTAL'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
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
                 <footer className="mt-auto pt-8">
                     <div className="flex justify-between items-start">
                         <div className="w-2/3 text-xs text-gray-600" style={{color: textColor}}>
                            <p className="font-bold mb-1">{t.terms || 'TERMS'}</p>
                            <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                         </div>
                         <div className="w-1/3 text-right text-sm">
                            <p className="py-1"><span className="text-gray-500" style={{color: textColor}}>{t.subtotal || 'Subtotal'}: </span>{currencySymbol}{summary.subtotal.toFixed(2)}</p>
                            {summary.discount > 0 && (<p className="py-1"><span className="text-gray-500" style={{color: textColor}}>{t.discount || 'Discount'}: </span><span className='text-red-500'>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>)}
                            {summary.shippingCost > 0 && (<p className="py-1"><span className="text-gray-500" style={{color: textColor}}>{t.shipping || 'Shipping'}: </span>{currencySymbol}{summary.shippingCost.toFixed(2)}</p>)}
                            <p className="py-1"><span className="text-gray-500" style={{color: textColor}}>{t.tax || 'Tax'}: </span>{currencySymbol}{summary.taxAmount.toFixed(2)}</p>
                            <p className="py-2 mt-1 border-t-2 border-black font-bold"><span className="text-base">{t.total || 'TOTAL'}: </span><span className="text-base">{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                         </div>
                     </div>
                     <div className="flex justify-between mt-10">
                        <SignatureDisplay signature={document.business.ownerSignature} label={`${business.name} ${t.signature || 'Signature'}`} />
                        <SignatureDisplay signature={document.clientSignature} label={`${t.client || 'Client'} ${t.signature || 'Signature'}`} />
                    </div>
                 </footer>
            )}
        </div>
    );
};

// Template 4: Bold & Blue
export const RemodelingTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'ESTIMATE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-10 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial', fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-center mb-8 pb-4 border-b-4" style={{borderColor: style.color}}>
                <div>
                    <p className="font-bold text-3xl">{business.name}</p>
                    <div className="text-xs text-gray-500" style={{color: textColor}}>
                        <p>{business.address}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-2xl font-extrabold" style={{color: style.color}}>{docTitle}</h1>
                </div>
            </header>
            
            <section className="mb-8 grid grid-cols-2 gap-4 text-xs">
                 <div>
                    <p className="font-bold">{t.clientInfo || 'Client Information'}:</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p>{client.address}</p>
                    <p>{client.phone} | {client.email}</p>
                </div>
                 <div className="text-right">
                    <p><span className="font-bold text-gray-500" style={{color: textColor}}>{document.documentType === 'quote' ? t.quoteNo : t.estimateNo || 'Number #'}: </span>{document.estimateNumber}</p>
                    <p><span className="font-bold text-gray-500" style={{color: textColor}}>{t.date || 'DATE'}: </span>{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                 </div>
            </section>
            
            <RemodelingDetails document={document} textColor={textColor || '#374151'} t={t}/>

            <main className="flex-grow">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 font-bold w-[60%]">{t.description || 'DESCRIPTION'}</th>
                            <th className="p-2 font-bold text-center">{t.quantity || 'QTY'}</th>
                            <th className="p-2 font-bold text-right">{t.price || 'PRICE'}</th>
                            <th className="p-2 font-bold text-right">{t.amount || 'AMOUNT'}</th>
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
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <table className="w-1/3 text-sm">
                            <tbody>
                                <tr><td className="py-1 text-gray-600" style={{color: textColor}}>{t.subtotal || 'Subtotal'}</td><td className="py-1 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                {summary.discount > 0 && (<tr><td className="py-1 text-gray-600" style={{color: textColor}}>{t.discount || 'Discount'}</td><td className="py-1 text-right text-red-500">-{currencySymbol}{summary.discount.toFixed(2)}</td></tr>)}
                                {summary.shippingCost > 0 && (<tr><td className="py-1 text-gray-600" style={{color: textColor}}>{t.shipping || 'Shipping'}</td><td className="py-1 text-right">{currencySymbol}{summary.shippingCost.toFixed(2)}</td></tr>)}
                                {summary.taxAmount > 0 && <tr><td className="py-1 text-gray-600" style={{color: textColor}}>{t.tax || 'Taxes'}</td><td className="py-1 text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>}
                                <tr className="font-bold text-base border-t-2 border-black"><td className="py-2">{t.total || 'Total'}</td><td className="py-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-4">
                       <SignatureDisplay signature={document.business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} style={{alignItems: 'flex-end', textAlign: 'right'}} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 5: Minimal Side-by-Side
export const RemodelingTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-12 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-bold">{business.name}</h1>
                    <div className="text-xs text-gray-500" style={{color: textColor}}>
                        {business.licenseNumber && <p className="mt-2">Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p className="mt-1">Tax ID: {business.taxId}</p>}
                    </div>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-10 text-xs mb-10">
                <div>
                    <p className="font-bold text-gray-500" style={{color: textColor}}>{t.client || 'CLIENT'}</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                    <p>{client.email}</p>
                </div>
                <div>
                     <p className="font-bold text-gray-500" style={{color: textColor}}>{t.details || 'DETAILS'}</p>
                     <p>{(document.documentType === 'quote' ? t.quote : t.estimate) || 'Estimate'}: {document.estimateNumber}</p>
                     <p>{t.date || 'Date'}: {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                     <p className="font-bold mt-2">{t.projectTitle || 'Project Title'}:</p>
                     <p>{document.projectTitle}</p>
                </div>
            </section>
            
            <RemodelingDetails document={document} textColor={textColor || '#374151'} t={t}/>

            <main className="flex-grow">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr>
                            <th className="pb-2 font-bold w-1/2 border-b-2 border-gray-800">{t.description || 'DESCRIPTION'}</th>
                            <th className="pb-2 font-bold text-center border-b-2 border-gray-800">{t.quantity || 'QTY'}</th>
                            <th className="pb-2 font-bold text-right border-b-2 border-gray-800">{t.price || 'PRICE'}</th>
                            <th className="pb-2 font-bold text-right border-b-2 border-gray-800">{t.total || 'TOTAL'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="py-2 border-b border-gray-200 whitespace-pre-line">{item.name}</td>
                                <td className="py-2 border-b border-gray-200 text-center">{item.quantity}</td>
                                <td className="py-2 border-b border-gray-200 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 border-b border-gray-200 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <div className="w-2/5 text-sm space-y-2">
                             <div className="flex justify-between"><span className="text-gray-600" style={{color: textColor}}>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                             {summary.discount > 0 && (<div className="flex justify-between text-red-500"><span className="text-gray-600" style={{color: textColor}}>{t.discount || 'Discount'}</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></div>)}
                            {summary.shippingCost > 0 && (<div className="flex justify-between"><span className="text-gray-600" style={{color: textColor}}>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></div>)}
                             <div className="flex justify-between"><span className="text-gray-600" style={{color: textColor}}>{t.tax || 'Tax'}</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                             <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-800"><span>{t.total || 'TOTAL'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                     <div className="flex justify-end mt-4">
                       <SignatureDisplay signature={document.business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} style={{alignItems: 'flex-end', textAlign: 'right'}} />
                    </div>
                </footer>
            )}
        </div>
    );
};

