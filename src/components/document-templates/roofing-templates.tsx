
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

const RoofingDetails: React.FC<{ document: Estimate, t: any }> = ({ document, t }) => {
    if (!document.roofing) return null;
    const { roofing } = document;
    return (
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 text-xs">
            <p><span className="text-gray-500">{(t.roofMaterial || 'Roof Material')}:</span> <span className="font-semibold">{roofing.roofMaterial}</span></p>
            <p><span className="text-gray-500">{(t.shingleBrand || 'Shingle Brand')}:</span> <span className="font-semibold">{roofing.shingleBrand}</span></p>
            {roofing.roofSize && <p><span className="text-gray-500">{(t.roofSizeSqFt || 'Roof Size (sq ft)')}:</span> <span className="font-semibold">{roofing.roofSize}</span></p>}
            <p><span className="text-gray-500">{(t.layersToRemove || 'Layers to Remove')}:</span> <span className="font-semibold">{roofing.layersToRemove}</span></p>
            <p><span className="text-gray-500">{(t.roofPitch || 'Roof Pitch')}:</span> <span className="font-semibold">{roofing.roofPitch}</span></p>
            <p><span className="text-gray-500">{(t.underlayment || 'Underlayment')}:</span> <span className="font-semibold">{roofing.underlaymentType}</span></p>
            <p><span className="text-gray-500">{(t.flashing || 'Flashing')}:</span> <span className="font-semibold">{roofing.flashingDetails}</span></p>
            <p><span className="text-gray-500">{(t.ventilation || 'Ventilation')}:</span> <span className="font-semibold">{roofing.ventilationSystem}</span></p>
            <p><span className="text-gray-500">{(t.gutterWork || 'Gutter Work')}:</span> <span className="font-semibold">{roofing.gutterRepairNeeded ? (t.yes || 'Yes') : (t.no || 'No')}</span></p>
            <p><span className="text-gray-500">{(t.warranty || 'Warranty')}:</span> <span className="font-semibold">{roofing.warranty}</span></p>
            <p><span className="text-gray-500">{(t.timeline || 'Timeline')}:</span> <span className="font-semibold">{roofing.estimatedTimeline}</span></p>
            <p><span className="text-gray-500">{(t.inspection || 'Inspection')}:</span> <span className="font-semibold">{roofing.inspectionRequired}</span></p>
        </div>
    );
};


// Template 1: Direct Interpretation of user image
export const RoofingTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE') : (t.estimate || 'ESTIMATE');
    
    return (
        <div className={`bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Lato, sans-serif', fontSize: `10pt`, minHeight: '1056px' }}>
            <header className="p-10 flex justify-between items-start">
                 <div>
                     {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="object-contain" />}
                     <h1 className="text-3xl font-bold mt-2">{business.name}</h1>
                     <p className="text-xs opacity-80">{document.documentType === 'quote' ? (t.quotationServices || 'Quotation Services') : (t.estimationServices || 'Estimation Services')}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold tracking-wider">{docTitle}</h2>
                </div>
            </header>

            <div className="p-10 pt-0 flex-grow flex flex-col">
                 <section className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-2 gap-8 text-xs">
                    <div>
                        <p className="font-bold text-gray-500 mb-2">{t.customerInformation || 'Customer Information'}</p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="text-gray-500">{t.name || 'Name'}:</span> <span className="font-semibold">{client.name}</span></p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="text-gray-500">{t.address || 'Address'}:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="text-gray-500">{t.email || 'Email'}:</span> <span>{client.email}</span></p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="text-gray-500">{t.phone || 'Phone'}:</span> <span>{client.phone}</span></p>
                    </div>
                    <div>
                         <p className="font-bold text-gray-500 mb-2">{t.propertyProjectInfo || 'Property & Project Information'}</p>
                         <p className="grid grid-cols-[120px_1fr]"><span className="text-gray-500">{t.address || 'Address'}:</span> <span className="font-semibold whitespace-pre-line">{client.projectLocation || client.address}</span></p>
                    </div>
                </section>
                
                 {document.roofing && (
                    <section className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-xs">
                        <p className="font-bold text-gray-500 mb-2">{t.projectDetails || 'Project Details'}</p>
                        <RoofingDetails document={document} t={t}/>
                    </section>
                )}


                <section className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-xs">
                    <p className="font-bold text-gray-500 mb-2">{t.descriptionOfWork || 'Description of Work'}</p>
                    <p className="text-gray-700 whitespace-pre-line">{document.projectTitle}</p>
                </section>
                
                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead style={{ backgroundColor: '#374151' }} className="text-white text-xs">
                            <tr>
                                <th className="p-2 font-bold w-1/2">{t.description || 'DESCRIPTION'}</th>
                                <th className="p-2 font-bold text-center">{t.quantity || 'QTY'}</th>
                                <th className="p-2 font-bold text-right">{t.unitPrice || 'UNIT PRICE'}</th>
                                <th className="p-2 font-bold text-right">{t.subtotal || 'SUBTOTAL'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b bg-gray-50">
                                    <td className="p-2 align-top text-xs whitespace-pre-line">{item.name}</td>
                                    <td className="p-2 align-top text-center text-xs">{item.quantity}</td>
                                    <td className="p-2 align-top text-right text-xs">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-2 align-top text-right text-xs font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        {pageIndex === totalPages - 1 &&
                            <tfoot>
                                <tr><td colSpan={3} className="p-2 text-right">{t.subtotal || 'Subtotal'}</td><td className="p-2 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                {summary.discount > 0 && <tr><td colSpan={3} className="p-2 text-right">{t.discount || 'Discount'}</td><td className="p-2 text-right text-red-600">-{currencySymbol}{summary.discount.toFixed(2)}</td></tr>}
                                {summary.shippingCost > 0 && <tr><td colSpan={3} className="p-2 text-right">{t.shipping || 'Shipping/Extra'}</td><td className="p-2 text-right">{currencySymbol}{summary.shippingCost.toFixed(2)}</td></tr>}
                                <tr><td colSpan={3} className="p-2 text-right">{t.tax || 'Tax'} ({summary.taxPercentage}%)</td><td className="p-2 text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                <tr>
                                    <td colSpan={3} className="p-2 text-right font-bold text-base">{t.totalEstimatedCost || 'Total Estimated Cost'}</td>
                                    <td className="p-2 text-right font-bold text-base">{currencySymbol}{summary.grandTotal.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        }
                    </table>
                </main>
            
                {pageIndex === totalPages - 1 && (
                    <footer className="pt-8 mt-auto">
                        <div className="flex justify-between items-end">
                            <div className="text-xs w-1/2">
                                <p className="font-bold text-gray-500 mb-2">{t.termsAndConditions || 'Terms & Conditions'}</p>
                                <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-end mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label={"Owner Signature"} />
                            <SignatureDisplay signature={document.clientSignature} label={"Client Signature"} />
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-8 pt-4 border-t">
                            <p>{business.email}</p>
                            <p>{business.phone}</p>
                            <p>{business.website}</p>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};


// Template 2: Light and Professional
export const RoofingTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE') : (t.estimate || 'ESTIMATE');

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2" style={{ borderColor: style.color }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: style.color }}>{business.name}</h1>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500 mb-1">{t.customer || 'Customer'}:</p>
                    <p className="font-semibold">{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{t.estimateNo || 'Estimate #'}:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">{t.date || 'Date'}:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                </div>
            </section>

             {document.roofing && (
                <section className="mb-8 p-4 bg-gray-50 rounded-md text-xs">
                    <p className="font-bold text-gray-500 mb-2">{t.projectDetails || 'Project Details'}</p>
                    <RoofingDetails document={document} t={t}/>
                </section>
            )}
            
            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-1/2">{t.description || 'DESCRIPTION'}</th>
                            <th className="py-2 font-bold text-center">{t.quantity || 'QTY'}</th>
                            <th className="py-2 font-bold text-right">{t.rate || 'RATE'}</th>
                            <th className="py-2 font-bold text-right">{t.total || 'TOTAL'}</th>
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

// Template 3: Blue-tinted Grid
export const RoofingTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#3B82F6';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE') : (t.estimate || 'ESTIMATE');

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="object-contain" />}
                    <h1 className="text-4xl font-extrabold mt-2" style={{color: accentColor}}>{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs p-4 bg-white rounded-lg shadow-sm">
                <div><p className="font-bold text-gray-500">{t.client || 'Client'}:</p><p>{client.name}<br/>{client.address}</p></div>
                <div><p className="font-bold text-gray-500">{t.projectLocation || 'Project Location'}:</p><p>{client.projectLocation || client.address}</p></div>
                <div><p className="font-bold text-gray-500">{t.reference || 'Reference'}:</p><p>#{document.estimateNumber}<br/>{t.date || 'Date'}: {safeFormat(document.estimateDate, 'dd-MMM-yyyy')}</p></div>
            </section>
            
             {document.roofing && (
                <section className="mb-8 p-4 bg-white rounded-lg shadow-sm text-xs">
                    <p className="font-bold text-gray-500 mb-2">{t.roofingSpecifications || 'Roofing Specifications'}</p>
                    <RoofingDetails document={document} t={t}/>
                </section>
            )}

            <main className="flex-grow bg-white p-4 rounded-lg shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: `${accentColor}1A`}} className="border-b-2" style={{ borderColor: accentColor }}><th className="py-2 px-2 font-bold w-[50%]">{t.itemDescription || 'Item Description'}</th><th className="py-2 px-2 font-bold text-center">{t.quantity || 'Qty'}</th><th className="py-2 px-2 font-bold text-right">{t.price || 'Price'}</th><th className="py-2 px-2 font-bold text-right">{t.total || 'Total'}</th></tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 px-2 align-top">{item.name}</td>
                                <td className="py-2 px-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 px-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 px-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                 <footer className="mt-auto pt-6 flex justify-between items-end">
                    <div className="w-1/2 text-xs">
                        <p className="font-bold text-gray-500 mb-2">{t.termsAndConditions || 'Terms & Conditions'}</p>
                        <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                         <div className="flex gap-16 mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label={"Owner Signature"} />
                            <SignatureDisplay signature={document.clientSignature} label={"Client Signature"} />
                        </div>
                    </div>
                    <div className="w-2/5 text-sm space-y-1">
                        <p className="flex justify-between p-1"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        {summary.discount > 0 && <p className="flex justify-between p-1">{t.discount || 'Discount'}: <span className="text-red-600">-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                        {summary.shippingCost > 0 && <p className="flex justify-between p-1">{t.shipping || 'Shipping/Extra'}: <span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between p-1"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-gray-300"><span>{t.totalEstimate || 'Total Estimate'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: NEW - Clean Grid
export const RoofingTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE') : (t.estimate || 'ESTIMATE');

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-8 pb-4 border-b">
                <div>
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light">{docTitle}</h2>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold mb-1">{t.to || 'To'}:</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><strong>{t.estimateNo || 'Estimate #'}:</strong> {document.estimateNumber}</p>
                    <p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                </div>
            </section>
            
            {document.roofing && (
                <section className="mb-8 text-xs">
                    <p className="font-bold mb-2 text-center text-sm tracking-wider border-y py-1 bg-gray-50">{t.scopeOfWork || 'SCOPE OF WORK'}</p>
                    <RoofingDetails document={document} t={t}/>
                </section>
            )}

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 font-bold w-4/5">{t.description || 'Description'}</th>
                            <th className="p-2 font-bold text-right">{t.amount || 'Amount'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8 flex justify-between items-end">
                     <div className="w-1/2 text-xs">
                        <p className="font-bold text-gray-500 mb-2">{t.termsAndConditions || 'Terms & Conditions'}</p>
                        <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                         <div className="flex gap-16 mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label={"Owner Signature"} />
                            <SignatureDisplay signature={document.clientSignature} label={"Client Signature"} />
                        </div>
                     </div>
                     <div className="w-1/3 text-sm">
                         <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                         {summary.discount > 0 && <p className="flex justify-between">{t.discount || 'Discount'}: <span className="text-red-600">-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                         {summary.shippingCost > 0 && <p className="flex justify-between">{t.shipping || 'Shipping/Extra'}: <span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                         <p className="flex justify-between border-b pb-1"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                         <p className="flex justify-between font-bold text-lg mt-2"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 5: NEW - Side Panel
export const RoofingTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE') : (t.estimate || 'ESTIMATE');

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <div className="w-1/3 p-8 text-white" style={{ backgroundColor: style.color || '#4B5563' }}>
                <h2 className="text-3xl font-bold mb-10">{docTitle}</h2>
                <div className="text-sm space-y-4">
                    <div>
                        <p className="font-bold opacity-80 mb-1">{t.preparedFor || 'Prepared For'}</p>
                        <p>{client.name}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">{t.date || 'Date'}</p>
                        <p>{safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">{t.estimateNo || 'Estimate #'}</p>
                        <p>{document.estimateNumber}</p>
                    </div>
                </div>
            </div>
            <div className="w-2/3 p-10 flex flex-col">
                <header className="mb-10 text-right">
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </header>

                {document.roofing && (
                    <section className="mb-8 text-xs">
                        <p className="font-bold mb-2 text-center text-sm tracking-wider border-y py-1 bg-gray-50">{t.projectDetails || 'Project Details'}</p>
                        <RoofingDetails document={document} t={t}/>
                    </section>
                )}

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b">
                            <tr>
                                <th className="pb-2 font-bold w-4/5">{t.description || 'Description'}</th>
                                <th className="pb-2 font-bold text-right">{t.amount || 'Amount'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id}>
                                    <td className="py-2 border-b">{item.name}</td>
                                    <td className="py-2 border-b text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8 text-right">
                         <div className="text-xs mb-8">
                            <p className="font-bold text-gray-500 mb-2">{t.termsAndConditions || 'Terms & Conditions'}</p>
                            <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                        </div>
                        <div className="inline-block w-1/2 text-sm">
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between">{t.discount || 'Discount'}: <span className="text-red-600">-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between">{t.shipping || 'Shipping/Extra'}: <span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <div className="w-full h-px bg-gray-300 my-2"></div>
                            <p className="flex justify-between font-bold text-lg"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                         <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label={"Owner Signature"} />
                            <SignatureDisplay signature={document.clientSignature} label={"Client Signature"} />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};
