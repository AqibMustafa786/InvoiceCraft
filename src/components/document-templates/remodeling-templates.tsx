
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

const RemodelingDetails: React.FC<{ document: Estimate; textColor: string }> = ({ document, textColor }) => {
    if (!document.homeRemodeling) return null;
    const { homeRemodeling } = document;
    return (
        <section className="my-4 text-xs" style={{color: textColor}}>
            <p className="font-bold text-gray-500 mb-2 border-b">Project Specifics</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">Project Type:</span> {homeRemodeling.projectType}</p>
                <p><span className="font-semibold text-gray-600">Property Type:</span> {homeRemodeling.propertyType}</p>
                {homeRemodeling.squareFootage && <p><span className="font-semibold text-gray-600">Sq Ft:</span> {homeRemodeling.squareFootage}</p>}
                <p><span className="font-semibold text-gray-600">Material Grade:</span> {homeRemodeling.materialGrade}</p>
                <p><span className="font-semibold text-gray-600">Demolition:</span> {homeRemodeling.demolitionRequired ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold text-gray-600">Permit:</span> {homeRemodeling.permitRequired ? 'Yes' : 'No'}</p>
                {homeRemodeling.expectedStartDate && <p><span className="font-semibold text-gray-600">Start Date:</span> {safeFormat(homeRemodeling.expectedStartDate, 'MMM d, yyyy')}</p>}
                {homeRemodeling.expectedCompletionDate && <p><span className="font-semibold text-gray-600">End Date:</span> {safeFormat(homeRemodeling.expectedCompletionDate, 'MMM d, yyyy')}</p>}
                <p className="col-span-2"><span className="font-semibold text-gray-600">Rooms:</span> {homeRemodeling.roomsIncluded}</p>
                {homeRemodeling.specialInstructions && <p className="col-span-2"><span className="font-semibold text-gray-600">Instructions:</span> {homeRemodeling.specialInstructions}</p>}
            </div>
        </section>
    );
};


// Template 1: Precision (Based on user image)
export const RemodelingTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'Quote' : 'Estimate';
    
    return (
        <div className={`font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor }}>
            <header className="p-10 text-white" style={{ backgroundColor: '#0A2D4D' }}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {business.logoUrl ? 
                            <Image src={business.logoUrl} alt="logo" width={40} height={40}/> :
                            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-md"><span style={{color: '#0A2D4D'}}>🏠</span></div>
                        }
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold">{docTitle}</h2>
                        {category !== 'Generic' && <p className="text-sm">{category.replace(' / ', ' / ')}</p>}
                    </div>
                </div>
            </header>

            <div className="p-10 flex-grow flex flex-col" style={{color: textColor}}>
                 <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div>
                        <p>{business.phone}</p>
                        <p>{business.email}</p>
                        <p className="whitespace-pre-line">{business.address}</p>
                    </div>
                    <div className="space-y-1">
                        <p><span className="font-bold">Name:</span> {client.name}</p>
                        <p><span className="font-bold">Address:</span> {client.address}</p>
                        <p><span className="font-bold">Phone:</span> {client.phone}</p>
                        <p><span className="font-bold">Email:</span> {client.email}</p>
                        <p><span className="font-bold">Date:</span> {safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
                    </div>
                </section>

                <div className="flex justify-between items-center mb-4">
                    <p className="font-bold">Estimate Cost</p>
                    <div className="flex items-center gap-2">
                        <p className="text-xs">Estimate Number:</p>
                        <p className="p-2 px-4 text-white font-bold rounded" style={{ backgroundColor: '#0A2D4D' }}>{document.estimateNumber}</p>
                    </div>
                </div>

                <RemodelingDetails document={document} textColor={textColor} />

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead style={{ backgroundColor: '#0A2D4D', color: 'white' }}>
                            <tr>
                                <th className="p-2 font-bold w-[25%]">Cost Type</th>
                                <th className="p-2 font-bold w-[50%]">Description</th>
                                <th className="p-2 font-bold text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-200">
                                    <td className="p-2 align-top font-semibold">{item.name}</td>
                                    <td className="p-2 align-top text-gray-600 whitespace-pre-line" style={{color: textColor}}>{item.description}</td>
                                    <td className="p-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        {pageIndex === totalPages - 1 && (
                             <tfoot>
                                 <tr>
                                     <td colSpan={2} className="p-2 pt-4 text-right font-bold text-base">Total Cost</td>
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
                                <p className="font-bold mb-2">Additional Notes:</p>
                                <ul className="list-disc list-inside text-gray-600 space-y-1" style={{color: textColor}}>
                                   <li className="whitespace-pre-line">{document.termsAndConditions}</li>
                                </ul>
                                <div className="mt-4">
                                    <p className="font-bold mb-2">Payment Information:</p>
                                    <p className="text-gray-600" style={{color: textColor}}>Details provided upon acceptance.</p>
                                </div>
                            </div>
                             <div className="text-right">
                                 <p className="mb-1">Date: {safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
                                 <SignatureDisplay signature={document.business.ownerSignature} label="Supervisor's Signature" style={{alignItems: 'flex-end', textAlign: 'right'}} />
                             </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 2: Light & Modern
export const RemodelingTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'QUOTE' : 'ESTIMATE';

    return (
        <div className={`p-10 font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-10">
                <div>
                     {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="mb-2 object-contain"/>}
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs text-gray-500 whitespace-pre-line" style={{color: textColor}}>{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-light" style={{color: style.color}}>{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm" style={{color: style.color}}>{category.replace(' / ', ' / ')}</p>}
                    <p className="mt-2"><span className="font-bold text-gray-500">#</span> {document.estimateNumber}</p>
                    <p className="text-xs"><span className="font-bold text-gray-500">Date:</span> {safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
                </div>
            </header>
            
            <section className="p-4 rounded-md mb-8 grid grid-cols-2 gap-4" style={{backgroundColor: `${style.color}1A`}}>
                <div className="text-xs">
                     <p className="font-bold text-gray-500 mb-1" style={{color: textColor}}>CLIENT</p>
                     <p className="font-semibold">{client.name}</p>
                     <p>{client.address}</p>
                </div>
                 <div className="text-xs text-right">
                     <p className="font-bold text-gray-500 mb-1" style={{color: textColor}}>PROJECT</p>
                     <p className="font-semibold">{document.projectTitle}</p>
                     <p>{client.projectLocation}</p>
                </div>
            </section>
            
            <RemodelingDetails document={document} textColor={textColor} />

            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b-2" style={{borderColor: style.color}}>
                            <th className="py-2 font-bold w-[60%]">Service Description</th>
                            <th className="py-2 font-bold text-center">Qty</th>
                            <th className="py-2 font-bold text-right">Unit Price</th>
                            <th className="py-2 font-bold text-right">Total</th>
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
                            <div className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                            {summary.taxAmount > 0 && <div className="flex justify-between"><span>Tax</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>}
                             <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t" style={{borderColor: style.color}}><span>Estimate Total</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                     <div className="text-xs text-gray-500 border-t pt-4" style={{color: textColor}}>
                         <p className="font-bold mb-1">Notes and Terms</p>
                         <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                     </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Formal with Grid
export const RemodelingTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'QUOTE' : 'ESTIMATE';

    return (
        <div className={`p-10 font-['Times_New_Roman',_serif] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold">{docTitle}</h1>
                {category !== 'Generic' && <p className="text-sm text-gray-600" style={{color: textColor}}>{category.replace(' / ', ' / ')}</p>}
                <p className="text-sm text-gray-600 mt-1" style={{color: textColor}}>{business.name} • {business.phone} • {business.email}</p>
            </header>

            <section className="mb-8 p-4 border border-gray-200 rounded grid grid-cols-3 gap-4 text-xs">
                <div><p className="font-bold">Client:</p><p>{client.name}</p><p>{client.address}</p></div>
                <div><p className="font-bold">Project:</p><p>{document.projectTitle}</p><p>{client.projectLocation}</p></div>
                <div><p className="font-bold">Estimate #:</p><p>{document.estimateNumber}</p><p className="font-bold mt-1">Date:</p><p>{safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p></div>
            </section>
            
            <RemodelingDetails document={document} textColor={textColor} />

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 font-bold w-1/2">ITEM</th>
                            <th className="p-2 font-bold text-center">QUANTITY</th>
                            <th className="p-2 font-bold text-right">UNIT PRICE</th>
                            <th className="p-2 font-bold text-right">LINE TOTAL</th>
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
                     <div className="flex justify-between">
                         <div className="w-2/3 text-xs text-gray-600" style={{color: textColor}}>
                            <p className="font-bold mb-1">TERMS</p>
                            <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                         </div>
                         <div className="w-1/3 text-right text-sm">
                            <p className="py-1"><span className="text-gray-500" style={{color: textColor}}>Subtotal: </span>{currencySymbol}{summary.subtotal.toFixed(2)}</p>
                            <p className="py-1"><span className="text-gray-500" style={{color: textColor}}>Tax: </span>{currencySymbol}{summary.taxAmount.toFixed(2)}</p>
                            <p className="py-2 mt-1 border-t-2 border-black font-bold"><span className="text-base">TOTAL: </span><span className="text-base">{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                         </div>
                     </div>
                     <div className="flex justify-between mt-10">
                        <SignatureDisplay signature={document.business.ownerSignature} label={`${business.name} Signature`} />
                        <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                    </div>
                 </footer>
            )}
        </div>
    );
};

// Template 4: Bold & Blue
export const RemodelingTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'ESTIMATE' : 'ESTIMATE';

    return (
        <div className={`p-10 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial', fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-center mb-8 pb-4 border-b-4" style={{borderColor: style.color}}>
                <div className="text-right">
                    <h1 className="text-4xl font-extrabold" style={{color: style.color}}>{docTitle}</h1>
                     {category !== 'Generic' && <p className="text-sm" style={{color: style.color}}>{category.replace(' / ', ' / ')}</p>}
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg">{business.name}</p>
                    <p className="text-xs text-gray-500" style={{color: textColor}}>{business.address}</p>
                </div>
            </header>
            
            <section className="mb-8 grid grid-cols-2 gap-4 text-xs">
                 <div><p><span className="font-bold text-gray-500" style={{color: textColor}}>TO: </span>{client.name}</p><p>{client.address}</p></div>
                 <div className="text-right"><p><span className="font-bold text-gray-500" style={{color: textColor}}>ESTIMATE #: </span>{document.estimateNumber}</p><p><span className="font-bold text-gray-500" style={{color: textColor}}>DATE: </span>{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p></div>
            </section>
            
            <RemodelingDetails document={document} textColor={textColor} />

            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 font-bold w-[60%]">DESCRIPTION</th>
                            <th className="p-2 font-bold text-center">QTY</th>
                            <th className="p-2 font-bold text-right">PRICE</th>
                            <th className="p-2 font-bold text-right">AMOUNT</th>
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
                                <tr><td className="py-1 text-gray-600" style={{color: textColor}}>Subtotal</td><td className="py-1 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                {summary.taxAmount > 0 && <tr><td className="py-1 text-gray-600" style={{color: textColor}}>Taxes</td><td className="py-1 text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>}
                                <tr className="font-bold text-base border-t-2 border-black"><td className="py-2">Total</td><td className="py-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 5: Minimal Side-by-Side
export const RemodelingTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'QUOTE' : 'ESTIMATE';

    return (
        <div className={`p-12 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="mb-12">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <p className="text-xs" style={{color: style.color}}>{docTitle}</p>
                {category !== 'Generic' && <p className="text-xs" style={{color: style.color}}>{category.replace(' / ', ' / ')}</p>}
            </header>

            <section className="grid grid-cols-2 gap-10 text-xs mb-10">
                <div>
                    <p className="font-bold text-gray-500" style={{color: textColor}}>CLIENT</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                    <p>{client.email}</p>
                </div>
                <div>
                     <p className="font-bold text-gray-500" style={{color: textColor}}>DETAILS</p>
                     <p>Estimate: {document.estimateNumber}</p>
                     <p>Date: {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                </div>
            </section>
            
            <RemodelingDetails document={document} textColor={textColor} />

            <main className="flex-grow">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr>
                            <th className="pb-2 font-bold w-1/2 border-b-2 border-gray-800">DESCRIPTION</th>
                            <th className="pb-2 font-bold text-center border-b-2 border-gray-800">QTY</th>
                            <th className="pb-2 font-bold text-right border-b-2 border-gray-800">PRICE</th>
                            <th className="pb-2 font-bold text-right border-b-2 border-gray-800">TOTAL</th>
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
                             <div className="flex justify-between"><span className="text-gray-600" style={{color: textColor}}>Subtotal</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                             <div className="flex justify-between"><span className="text-gray-600" style={{color: textColor}}>Tax</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                             <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-800"><span>TOTAL</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

    