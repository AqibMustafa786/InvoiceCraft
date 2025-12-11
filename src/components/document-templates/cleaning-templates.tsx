
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
        <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-600 mt-1">({signature.signerName})</p>
        </div>
    )
}

const CleaningDetails: React.FC<{ document: Estimate; textColor: string; t: any; }> = ({ document, textColor, t }) => {
    if (!document.cleaning) return null;
    const { cleaning } = document;
    return (
        <section className="my-4 text-xs" style={{color: textColor}}>
            <p className="font-bold border-b" >{t.cleaningSpecifics || 'Cleaning Specifics'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2">
                <p><span className="font-semibold">{t.type || 'Type'}:</span> {cleaning.cleaningType}</p>
                <p><span className="font-semibold">{t.frequency || 'Frequency'}:</span> {cleaning.frequency}</p>
                {cleaning.homeSize && <p><span className="font-semibold">{t.homeSize || 'Home Size'}:</span> {cleaning.homeSize} sq ft</p>}
                {cleaning.bedrooms && <p><span className="font-semibold">{t.bedrooms || 'Bedrooms'}:</span> {cleaning.bedrooms}</p>}
                {cleaning.bathrooms && <p><span className="font-semibold">{t.bathrooms || 'Bathrooms'}:</span> {cleaning.bathrooms}</p>}
                <p><span className="font-semibold">{t.kitchenSize || 'Kitchen Size'}:</span> {cleaning.kitchenSize}</p>
                <p><span className="font-semibold">{t.hasPets || 'Has Pets'}:</span> {cleaning.hasPets ? 'Yes' : 'No'}</p>
                {cleaning.addOns.length > 0 && <p className="col-span-full"><span className="font-semibold">{t.addOns || 'Add-ons'}:</span> {cleaning.addOns.join(', ')}</p>}
            </div>
        </section>
    );
};


// Template 1: Direct interpretation of user image
export const CleaningTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`bg-white font-sans text-gray-800 flex flex-col relative ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: `10pt`, minHeight: '1056px' }}>
            <div className="absolute top-0 left-0 right-0 h-48" style={{ backgroundColor: style.color, clipPath: 'ellipse(100% 70% at 50% 0%)' }}></div>
            <div className="p-10 relative z-10 flex-grow flex flex-col" style={{color: textColor}}>
                <header className="flex justify-between items-start mb-8 text-white">
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs whitespace-pre-line">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold">{docTitle}</h2>
                        {category !== 'Generic' && <p className="text-sm">{t.cleaningService || 'Cleaning Service'}</p>}
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-4 mb-8 text-xs p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                    <div>
                        <p className="font-bold text-base mb-2">{t.companyInformation || 'Company Information'}</p>
                        <p><span className="font-bold w-24 inline-block">{t.companyName || 'Company Name'}:</span> {business.name}</p>
                        <p><span className="font-bold w-24 inline-block">{t.address || 'Address'}:</span> <span className="whitespace-pre-line">{business.address}</span></p>
                        <p><span className="font-bold w-24 inline-block">{t.phone || 'Phone'}:</span> {business.phone}</p>
                        <p><span className="font-bold w-24 inline-block">{t.email || 'Email'}:</span> {business.email}</p>
                    </div>
                    <div>
                        <p className="font-bold text-base mb-2">{t.customerInformation || 'Customer Information'}</p>
                        <p><span className="font-bold w-24 inline-block">{t.customerName || 'Customer Name'}:</span> {client.name}</p>
                        <p><span className="font-bold w-24 inline-block">{t.address || 'Address'}:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                        <p><span className="font-bold w-24 inline-block">{t.phone || 'Phone'}:</span> {client.phone}</p>
                        <p><span className="font-bold w-24 inline-block">{t.email || 'Email'}:</span> {client.email}</p>
                    </div>
                </section>
                
                 <CleaningDetails document={document} textColor={textColor || '#374151'} t={t} />

                <main className="flex-grow">
                     <table className="w-full text-left text-xs">
                        <thead style={{ backgroundColor: style.color }} className="text-white">
                            <tr>
                                <th className="p-2 font-bold w-12">{t.no || 'No'}</th>
                                <th className="p-2 font-bold w-3/5">{t.serviceDescription || 'Service Description'}</th>
                                <th className="p-2 font-bold text-center">{t.quantity || 'Quantity'}</th>
                                <th className="p-2 font-bold text-right">{t.unitPrice || 'Unit Price'}</th>
                                <th className="p-2 font-bold text-right">{t.total || 'Total'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map((item, index) => (
                                <tr key={item.id} className="border-b bg-gray-50/50">
                                    <td className="p-2 text-center">{index + 1}</td>
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
                        <div className="flex justify-end mb-8">
                             <table className="w-1/3 text-sm">
                                <tbody>
                                    <tr className="border-t-2"><td className="p-2 text-right font-bold">{t.subtotal || 'Subtotal'}</td><td className="p-2 text-right font-bold" style={{backgroundColor: style.color, color: 'white'}}>{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                </tbody>
                             </table>
                        </div>
                        <div className="grid grid-cols-2 gap-8 items-end text-xs">
                             <div>
                                <p className="font-bold text-base mb-2">{t.termsAndConditions || 'Terms and Conditions'}:</p>
                                <ul className="list-disc list-inside space-y-1">
                                   <li className="whitespace-pre-line">{document.termsAndConditions}</li>
                                </ul>
                            </div>
                            <div className="text-center">
                                {document.clientSignature ? <Image src={document.clientSignature.image} alt="signature" width={150} height={75} className="mx-auto" /> : <div className="w-48 h-12 border-b border-gray-400 mx-auto"></div>}
                                <p className="mt-2 text-sm font-semibold">{t.customerSignature || 'Customer Signature'}</p>
                                <p className="text-xs">{client.name}</p>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 2: Fresh & Modern
export const CleaningTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#10B981'; // Green
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'ESTIMATE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Inter, sans-serif', fontSize: '9pt', minHeight: '1056px', color: textColor }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2 border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </div>
                <div className='text-right'>
                    <h2 className="text-2xl font-extrabold" >{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm text-gray-400">{category}</p>}
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs p-4 rounded-md" style={{backgroundColor: `${accentColor}1A`}}>
                 <div>
                    <p className="font-bold mb-1">{t.customer.toUpperCase() || 'CUSTOMER'}</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{t.estimateNo || 'Estimate #'}:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">{t.date || 'Date'}:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                </div>
            </section>
            
            <CleaningDetails document={document} textColor={textColor || '#374151'} t={t}/>

            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2" style={{borderColor: accentColor}}>
                            <th className="py-2 font-bold w-3/5">{t.service.toUpperCase() || 'SERVICE'}</th>
                            <th className="py-2 font-bold text-center">{t.quantity.toUpperCase() || 'QTY'}</th>
                            <th className="py-2 font-bold text-right">{t.price.toUpperCase() || 'PRICE'}</th>
                            <th className="py-2 font-bold text-right">{t.total.toUpperCase() || 'TOTAL'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
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
                        <div className="w-2/5 text-sm space-y-1">
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t" style={{borderColor: accentColor}}>
                                <span>{t.total || 'Total'}:</span><span style={{color: accentColor}}>{currencySymbol}{summary.grandTotal.toFixed(2)}</span>
                            </p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Minimalist Checklist
export const CleaningTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? t.proposal || 'Proposal' : t.proposal || 'Proposal';

    return (
        <div className={`p-12 bg-white font-['Garamond',_serif] text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', color: textColor }}>
            <header className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-light tracking-wider">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light tracking-wider">{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm mt-1">{category}</p>}
                </div>
            </header>

            <section className="flex justify-between mb-10 text-xs">
                 <div>
                    <p className="font-bold mb-1">{t.preparedFor || 'Prepared For'}</p>
                    <p>{client.name}</p><p>{client.address}</p>
                </div>
                 <div className="text-right">
                    <p><span className="font-bold">{t.estimateNo || 'Estimate #'}</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">{t.date || 'Date'}:</span> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p>
                </div>
            </section>
            
            <CleaningDetails document={document} textColor={textColor || '#374151'} t={t}/>

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-semibold w-1/2 border-b-2 border-gray-300">{t.task.toUpperCase() || 'TASK'}</th>
                            <th className="p-2 font-semibold text-center border-b-2 border-gray-300">{t.completed.toUpperCase() || 'COMPLETED'}</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">{t.cost.toUpperCase() || 'COST'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="p-2 border-b border-gray-200 whitespace-pre-line">{item.name}</td>
                                <td className="p-2 border-b border-gray-200 text-center">
                                    <div className="w-4 h-4 border border-gray-400 inline-block"></div>
                                </td>
                                <td className="p-2 border-b border-gray-200 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <table className="w-1/3 text-xs">
                             <tbody>
                                <tr><td className="py-1">{t.subtotal || 'Subtotal'}</td><td className="text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">{t.total.toUpperCase() || 'TOTAL'}</td><td className="pt-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Side Panel Bubbles
export const CleaningTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <div className="w-1/3 p-8 text-white flex flex-col" style={{ backgroundColor: style.color }}>
                <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
                <div className="text-sm space-y-6 flex-grow">
                    <div>
                        <p className="font-bold opacity-80 mb-1">{t.client.toUpperCase() || 'CLIENT'}</p>
                        <p className="font-bold text-lg">{client.name}</p>
                        <p>{client.address}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">{t.project.toUpperCase() || 'PROJECT'}</p>
                        <p>{document.projectTitle}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">{t.details.toUpperCase() || 'DETAILS'}</p>
                        <p>#{document.estimateNumber}</p>
                        <p>{t.date || 'Date'}: {safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                    </div>
                </div>
                 {pageIndex === totalPages - 1 && (
                    <div className="mt-auto text-sm">
                         <p className="font-bold opacity-80 mb-2">{t.totalCost.toUpperCase() || 'TOTAL COST'}</p>
                         <p className="text-4xl font-extrabold">{currencySymbol}{summary.grandTotal.toFixed(2)}</p>
                    </div>
                )}
            </div>
            <div className="w-2/3 p-10 flex flex-col" style={{color: textColor}}>
                <header className="mb-8 text-right">
                     <h2 className="text-2xl font-bold">{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm">{category}</p>}
                </header>
                 <CleaningDetails document={document} textColor={textColor || '#374151'} t={t}/>
                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b-2 border-gray-300">
                            <tr>
                                <th className="py-2 font-bold w-2/3">{t.service.toUpperCase() || 'SERVICE'}</th>
                                <th className="py-2 font-bold text-right">{t.total.toUpperCase() || 'TOTAL'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
                                    <td className="py-2 align-top text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    );
};


// Template 5: Bold Grid
export const CleaningTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.estimate || 'Estimate') : (t.estimate || 'Estimate');

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', color: textColor }}>
            <header className="grid grid-cols-2 gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold" style={{ color: style.color }}>{business.name}</h1>
                     <p className="text-xs">{business.address}</p>
                </div>
                 <div className="text-right">
                     <p className="text-3xl font-bold">{docTitle}</p>
                    {category !== 'Generic' && <p className="text-xs text-gray-500">{category}</p>}
                </div>
            </header>

            <section className="mb-8 p-4 bg-white shadow-sm rounded-md text-xs">
                 <p className="font-bold text-gray-500 mb-2">{t.projectFor.toUpperCase() || 'PROJECT FOR'}: {client.name}</p>
                 <p className="font-semibold">{document.projectTitle}</p>
                 <p>{client.address}</p>
            </section>
            
            <CleaningDetails document={document} textColor={textColor || '#374151'} t={t} />

            <main className="flex-grow bg-white p-4 rounded-md shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-3/5">{t.description.toUpperCase() || 'DESCRIPTION'}</th>
                            <th className="py-2 font-bold text-center">{t.quantity.toUpperCase() || 'QTY'}</th>
                            <th className="py-2 font-bold text-right">{t.cost.toUpperCase() || 'COST'}</th>
                            <th className="py-2 font-bold text-right">{t.total.toUpperCase() || 'TOTAL'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="py-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-6 flex justify-end">
                    <div className="w-1/3 text-sm space-y-1">
                        <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>{t.totalEstimate || 'Total Estimate'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};
