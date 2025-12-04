

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

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8">
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-500 pt-1 border-t-2 border-gray-700 w-[150px]">{label}</p>
        </div>
    )
}

const RoofingDetails: React.FC<{ document: Estimate }> = ({ document }) => {
    if (!document.roofing) return null;
    const { roofing } = document;
    return (
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 text-xs">
            <p><span className="text-gray-500">Roof Material:</span> <span className="font-semibold">{roofing.roofMaterial}</span></p>
            <p><span className="text-gray-500">Shingle Brand:</span> <span className="font-semibold">{roofing.shingleBrand}</span></p>
            {roofing.roofSize && <p><span className="text-gray-500">Roof Size (sq ft):</span> <span className="font-semibold">{roofing.roofSize}</span></p>}
            <p><span className="text-gray-500">Layers to Remove:</span> <span className="font-semibold">{roofing.layersToRemove}</span></p>
            <p><span className="text-gray-500">Roof Pitch:</span> <span className="font-semibold">{roofing.roofPitch}</span></p>
            <p><span className="text-gray-500">Underlayment:</span> <span className="font-semibold">{roofing.underlaymentType}</span></p>
            <p><span className="text-gray-500">Flashing:</span> <span className="font-semibold">{roofing.flashingDetails}</span></p>
            <p><span className="text-gray-500">Ventilation:</span> <span className="font-semibold">{roofing.ventilationSystem}</span></p>
            <p><span className="text-gray-500">Gutter Work:</span> <span className="font-semibold">{roofing.gutterRepairNeeded}</span></p>
            <p><span className="text-gray-500">Warranty:</span> <span className="font-semibold">{roofing.warranty}</span></p>
            <p><span className="text-gray-500">Timeline:</span> <span className="font-semibold">{roofing.estimatedTimeline}</span></p>
            <p><span className="text-gray-500">Inspection:</span> <span className="font-semibold">{roofing.inspectionRequired}</span></p>
        </div>
    );
};


// Template 1: Direct Interpretation of user image
export const RoofingTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'QUOTE' : 'ESTIMATE';
    
    return (
        <div className={`bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Lato, sans-serif', fontSize: `10pt`, minHeight: '1056px' }}>
            <header className="p-10 flex justify-between items-start">
                 <div>
                     {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="object-contain" />}
                     <h1 className="text-3xl font-bold mt-2">{business.name}</h1>
                     <p className="text-xs opacity-80">{document.documentType === 'quote' ? 'Quotation Services' : 'Estimation Services'}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold tracking-wider">{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm opacity-90">{category}</p>}
                </div>
            </header>

            <div className="p-10 pt-0 flex-grow">
                 <section className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-2 gap-8 text-xs">
                    <div>
                        <p className="font-bold text-gray-500 mb-2">Customer Information</p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="text-gray-500">Name:</span> <span className="font-semibold">{client.name}</span></p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="text-gray-500">Address:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="text-gray-500">Email:</span> <span>{client.email}</span></p>
                        <p className="grid grid-cols-[80px_1fr]"><span className="text-gray-500">Phone:</span> <span>{client.phone}</span></p>
                    </div>
                    <div>
                         <p className="font-bold text-gray-500 mb-2">Property & Project Information</p>
                         <p className="grid grid-cols-[120px_1fr]"><span className="text-gray-500">Address:</span> <span className="font-semibold whitespace-pre-line">{client.projectLocation || client.address}</span></p>
                    </div>
                </section>
                
                 {document.roofing && (
                    <section className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-xs">
                        <p className="font-bold text-gray-500 mb-2">Project Details</p>
                        <RoofingDetails document={document} />
                    </section>
                )}


                <section className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-xs">
                    <p className="font-bold text-gray-500 mb-2">Description of Work</p>
                    <p className="text-gray-700 whitespace-pre-line">{document.projectTitle}</p>
                </section>
                
                <main>
                    <table className="w-full text-left text-sm">
                        <thead style={{ backgroundColor: '#374151' }} className="text-white text-xs">
                            <tr>
                                <th className="p-2 font-bold w-1/2">DESCRIPTION</th>
                                <th className="p-2 font-bold text-center">QTY</th>
                                <th className="p-2 font-bold text-right">UNIT PRICE</th>
                                <th className="p-2 font-bold text-right">SUBTOTAL</th>
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
                                 <tr>
                                    <td colSpan={3} className="p-2 text-right font-bold text-base">Total Estimated Cost</td>
                                    <td className="p-2 text-right font-bold text-base">{currencySymbol}{summary.grandTotal.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        }
                    </table>
                </main>
            </div>
            
            {pageIndex === totalPages - 1 && (
                <footer className="p-10 pt-0 mt-auto">
                    <div className="flex justify-between items-end">
                        <div className="text-xs">
                            <p className="font-bold text-gray-500 mb-2">Payment Information</p>
                            <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                        </div>
                         <div className="text-right">
                             <p className="text-xs mb-8">Date: {safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
                             <SignatureDisplay signature={document.business.ownerSignature} label="David Martinez" />
                         </div>
                    </div>
                     <div className="flex justify-between items-center text-xs text-gray-500 mt-8 pt-4 border-t">
                        <p>{business.email}</p>
                        <p>{business.phone}</p>
                        <p>{business.website}</p>
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Light and Professional
export const RoofingTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'QUOTE' : 'ESTIMATE';

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2" style={{ borderColor: style.color }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: style.color }}>{business.name}</h1>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm text-gray-400">{category}</p>}
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500 mb-1">Customer:</p>
                    <p className="font-semibold">{client.name}</p>
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Estimate #:</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">Date:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                </div>
            </section>

             {document.roofing && (
                <section className="mb-8 p-4 bg-gray-50 rounded-md text-xs">
                    <p className="font-bold text-gray-500 mb-2">Project Details</p>
                    <RoofingDetails document={document} />
                </section>
            )}
            
            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-1/2">DESCRIPTION</th>
                            <th className="py-2 font-bold text-center">QTY</th>
                            <th className="py-2 font-bold text-right">RATE</th>
                            <th className="py-2 font-bold text-right">TOTAL</th>
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
                            <p className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>Tax:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black"><span>Total:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Blue-tinted Grid
export const RoofingTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#3B82F6';
    const docTitle = document.documentType === 'quote' ? 'QUOTE' : 'ESTIMATE';

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold" style={{color: accentColor}}>{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm">{category}</p>}
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs p-4 bg-white rounded-lg shadow-sm">
                <div><p className="font-bold text-gray-500">Client:</p><p>{client.name}</p><p>{client.address}</p></div>
                <div><p className="font-bold text-gray-500">Project Location:</p><p>{client.projectLocation || client.address}</p></div>
                <div><p className="font-bold text-gray-500">Reference:</p><p>#{document.estimateNumber}</p><p>Date: {safeFormat(document.estimateDate, 'dd-MMM-yyyy')}</p></div>
            </section>
            
             {document.roofing && (
                <section className="mb-8 p-4 bg-white rounded-lg shadow-sm text-xs">
                    <p className="font-bold text-gray-500 mb-2">Roofing Specifications</p>
                    <RoofingDetails document={document} />
                </section>
            )}

            <main className="flex-grow bg-white p-4 rounded-lg shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: `${accentColor}1A`}} className="border-b-2" style={{ borderColor: accentColor }}>
                            <th className="py-2 px-2 font-bold w-[50%]">Item Description</th>
                            <th className="py-2 px-2 font-bold text-center">Qty</th>
                            <th className="py-2 px-2 font-bold text-right">Price</th>
                            <th className="py-2 px-2 font-bold text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 px-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="py-2 px-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 px-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 px-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                 <footer className="mt-auto pt-6 flex justify-end">
                    <div className="w-2/5 text-sm space-y-1">
                        <p className="flex justify-between p-1"><span>Subtotal</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between p-1"><span>Tax</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-gray-300"><span>Total Estimate</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 4: Corporate Clean
export const RoofingTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'QUOTE' : 'ESTIMATE';

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Helvetica, sans-serif', fontSize: '9pt', minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-bold">{business.name}</h1>
                    <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={90} height={45} className="object-contain ml-auto mb-2"/>}
                    <h2 className="text-3xl font-semibold text-gray-400">{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-xs text-gray-400">{category}</p>}
                </div>
            </header>

            <section className="mb-8 text-xs p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                    <div><p className="font-bold">CUSTOMER:</p><p>{client.name}<br/>{client.address}</p></div>
                    <div><p className="font-bold">ESTIMATE #:</p><p>{document.estimateNumber}</p><p className="font-bold mt-2">DATE:</p><p>{safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p></div>
                </div>
                 {document.roofing && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="font-bold mb-1">PROJECT SPECS</p>
                        <RoofingDetails document={document} />
                    </div>
                )}
            </section>
            
            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                            <th className="p-2 font-bold w-[60%]">DESCRIPTION</th>
                            <th className="p-2 font-bold text-center">QTY</th>
                            <th className="p-2 font-bold text-right">UNIT PRICE</th>
                            <th className="p-2 font-bold text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
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
                                <tr><td className="py-1 text-gray-600">Subtotal</td><td className="py-1 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                <tr><td className="py-1 text-gray-600">Tax</td><td className="py-1 text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="py-2">Total</td><td className="py-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 5: Minimal & Wide
export const RoofingTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? 'QUOTE' : 'ESTIMATE';

    return (
        <div className={`p-12 bg-white font-['Garamond',_serif] text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-16">
                <div>
                    <h1 className="text-3xl font-bold tracking-widest">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl">{docTitle}</p>
                    {category !== 'Generic' && <p className="text-xs text-gray-500">{category}</p>}
                </div>
            </header>

            <section className="flex justify-between mb-10 text-xs">
                <div><p className="font-bold">TO:</p><p>{client.name}</p></div>
                <div className="text-right"><p><span className="font-bold">ESTIMATE NO:</span> {document.estimateNumber}</p><p><span className="font-bold">DATE:</span> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p></div>
            </section>
            
             {document.roofing && (
                <section className="mb-8 text-xs">
                    <p className="font-bold border-b border-gray-500 pb-1 mb-2">Project Information</p>
                    <RoofingDetails document={document} />
                </section>
            )}

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-semibold w-3/5 border-b border-gray-500">ITEM</th>
                            <th className="p-2 font-semibold text-center border-b border-gray-500">QTY</th>
                            <th className="p-2 font-semibold text-right border-b border-gray-500">RATE</th>
                            <th className="p-2 font-semibold text-right border-b border-gray-500">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="py-2 px-2 border-b border-gray-200 whitespace-pre-line">{item.name}</td>
                                <td className="py-2 px-2 border-b border-gray-200 text-center">{item.quantity}</td>
                                <td className="py-2 px-2 border-b border-gray-200 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 px-2 border-b border-gray-200 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8 flex justify-end">
                    <table className="w-1/3 text-xs">
                         <tbody>
                            <tr><td className="py-1">Subtotal</td><td className="text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                            <tr className="border-b"><td className="py-1">Tax</td><td className="text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                            <tr className="font-bold text-lg"><td className="pt-2">Total</td><td className="pt-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                        </tbody>
                    </table>
                </footer>
            )}
        </div>
    );
};
