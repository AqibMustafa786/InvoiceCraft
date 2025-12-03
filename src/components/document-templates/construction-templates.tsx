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

const ConstructionDetails: React.FC<{ document: Estimate }> = ({ document }) => {
    if (!document.construction) return null;
    const { construction } = document;
    return (
         <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">Construction Specifics</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">Project Type:</span> {construction.projectType}</p>
                {construction.squareFootage && <p><span className="font-semibold text-gray-600">Sq Ft:</span> {construction.squareFootage}</p>}
                <p><span className="font-semibold text-gray-600">Lot Size:</span> {construction.lotSize}</p>
                <p><span className="font-semibold text-gray-600">Building Type:</span> {construction.buildingType}</p>
                <p><span className="font-semibold text-gray-600">Permit Required:</span> {construction.permitRequired ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold text-gray-600">Drawings Provided:</span> {construction.architectDrawingsProvided ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold text-gray-600">Soil Condition:</span> {construction.soilCondition}</p>
                <p><span className="font-semibold text-gray-600">Material Preference:</span> {construction.materialPreference}</p>
                <p><span className="font-semibold text-gray-600">Inspection:</span> {construction.inspectionRequired ? 'Yes' : 'No'}</p>
            </div>
        </section>
    );
};


// Template 1: Classic Professional
export const ConstructionTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    
    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px' }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: style.color }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: style.color }}>{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">ESTIMATE</h2>
                    <p className="text-sm">#{document.estimateNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 my-8 text-sm">
                <div>
                    <p className="font-bold text-gray-500">BILLED TO</p>
                    <p>{client.name}</p>
                    <p>{client.companyName}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div>
                    <p className="font-bold text-gray-500">PROJECT</p>
                    <p>{document.projectTitle}</p>
                    <p className="whitespace-pre-line">{client.projectLocation}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Date:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold">Valid Until:</span> {safeFormat(document.validUntilDate, 'MMM d, yyyy')}</p>
                </div>
            </section>

            <ConstructionDetails document={document} />
            
            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead className="border-b" style={{ borderColor: style.color }}>
                        <tr>
                            <th className="p-2 pb-1 font-bold w-1/2">DESCRIPTION</th>
                            <th className="p-2 pb-1 font-bold text-right">QTY</th>
                            <th className="p-2 pb-1 font-bold text-right">PRICE</th>
                            <th className="p-2 pb-1 font-bold text-right">TOTAL</th>
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
                            <div className="flex justify-between py-1"><span className="text-gray-600">Subtotal:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                            {summary.discount > 0 && <div className="flex justify-between py-1"><span className="text-gray-600">Discount:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></div>}
                            <div className="flex justify-between py-1"><span className="text-gray-600">Tax ({summary.taxPercentage}%):</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold py-2 mt-2 border-t-2 border-gray-800" style={{ color: style.color }}><span className="text-lg">Total Estimate:</span><span className="text-lg">{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div className="mt-8 text-xs text-gray-600">
                        <p className="font-bold mb-1">Terms & Conditions</p>
                        <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                        <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Modern Dark Header
export const ConstructionTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className={`p-0 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px' }}>
            <header className="p-10 text-white" style={{ backgroundColor: '#1F2937' }}>
                <div className="flex justify-between items-center">
                    <div>
                         {business.logoUrl ? (
                            <Image src={business.logoUrl} alt="Logo" width={120} height={50} />
                        ) : (
                            <h1 className="text-3xl font-bold">{business.name}</h1>
                        )}
                        <p className="text-xs whitespace-pre-line mt-2 text-gray-300">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-bold">ESTIMATE</h2>
                        <p className="text-sm mt-1"># {document.estimateNumber}</p>
                    </div>
                </div>
            </header>

            <div className="p-10 flex-grow">
                 <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
                    <div>
                        <p className="font-bold text-gray-500 mb-1">CLIENT INFORMATION</p>
                        <p className="font-bold">{client.name}</p>
                        <p>{client.companyName}</p>
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-500 mb-1">PROJECT DETAILS</p>
                        <p>{document.projectTitle}</p>
                        <p className="whitespace-pre-line">{client.projectLocation}</p>
                        <p className="mt-2"><span className="font-bold">Date Issued:</span> {safeFormat(document.estimateDate, 'MMM d, yyyy')}</p>
                        <p><span className="font-bold">Expires:</span> {safeFormat(document.validUntilDate, 'MMM d, yyyy')}</p>
                    </div>
                </section>

                <ConstructionDetails document={document} />
                
                <main>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-2 font-bold w-[50%]">ITEM</th>
                                <th className="py-2 font-bold text-center">QTY</th>
                                <th className="py-2 font-bold text-right">UNIT PRICE</th>
                                <th className="py-2 font-bold text-right">TOTAL</th>
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
            </div>
            
            {pageIndex === totalPages - 1 && (
                <footer className="p-10 mt-auto">
                    <div className="flex justify-between items-start">
                        <div className="w-1/2 text-xs">
                             <p className="font-bold text-gray-500 mb-2">TERMS & CONDITIONS</p>
                             <p className="text-gray-600 whitespace-pre-line">{document.termsAndConditions}</p>
                              <div className="flex gap-16">
                                <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                                <SignatureDisplay signature={document.clientSignature} label="Client Signature" />
                            </div>
                        </div>
                        <div className="w-2/5">
                            <div className="bg-gray-100 p-4 rounded-lg text-sm">
                                <div className="flex justify-between py-1"><span className="text-gray-600">Subtotal:</span><span className="font-medium">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between py-1"><span className="text-gray-600">Tax ({summary.taxPercentage}%):</span><span className="font-medium">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                                {summary.discount > 0 && <div className="flex justify-between py-1"><span className="text-gray-600">Discount:</span><span className="font-medium">-{currencySymbol}{summary.discount.toFixed(2)}</span></div>}
                                <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2 border-gray-300"><span>Grand Total:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Minimalist & Clean
export const ConstructionTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px' }}>
            <header className="mb-12">
                <h1 className="text-4xl font-light tracking-wider mb-2">Estimate</h1>
                <div className="flex justify-between text-sm">
                    <div>
                        <p className="font-bold">{business.name}</p>
                        <p className="whitespace-pre-line">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <p><span className="font-bold">Estimate #:</span> {document.estimateNumber}</p>
                        <p><span className="font-bold">Date:</span> {safeFormat(document.estimateDate, 'MM-dd-yyyy')}</p>
                    </div>
                </div>
            </header>

            <section className="mb-10 text-sm p-4 border" style={{ borderColor: style.color }}>
                <p className="font-bold mb-1">CLIENT:</p>
                <p>{client.name}</p>
                <p>{client.companyName}</p>
                <p className="whitespace-pre-line">{client.address}</p>
            </section>

             <ConstructionDetails document={document} />
            
            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr>
                            <th className="p-2 font-bold w-1/2 bg-gray-50">DESCRIPTION</th>
                            <th className="p-2 font-bold text-center bg-gray-50">QTY</th>
                            <th className="p-2 font-bold text-right bg-gray-50">UNIT PRICE</th>
                            <th className="p-2 font-bold text-right bg-gray-50">TOTAL</th>
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
                            <div className="flex justify-between py-1"><span className="text-gray-500">Subtotal</span><span className="font-medium">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between py-1"><span className="text-gray-500">Tax</span><span className="font-medium">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between py-2 mt-1 border-t-2 border-black font-bold"><span>Total</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        <p className="font-bold mb-1">Notes</p>
                        <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                     <div className="flex justify-end mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Side Bar Color Accent
export const ConstructionTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px' }}>
            <div className="w-1/4 p-8 text-white" style={{ backgroundColor: style.color }}>
                <h1 className="text-3xl font-bold mb-10">ESTIMATE</h1>
                <div className="text-sm space-y-4">
                    <div>
                        <p className="font-bold opacity-80 mb-1">FROM</p>
                        <p className="font-bold text-base">{business.name}</p>
                        <p className="whitespace-pre-line">{business.address}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">FOR</p>
                        <p>{client.name}</p>
                        <p className="whitespace-pre-line">{client.address}</p>
                    </div>
                     <div>
                        <p className="font-bold opacity-80 mb-1">DETAILS</p>
                        <p>#{document.estimateNumber}</p>
                        <p>Date: {safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                    </div>
                </div>
            </div>
            <div className="w-3/4 p-10 flex flex-col">
                 <main className="flex-grow">
                    <ConstructionDetails document={document} />
                    <table className="w-full text-left text-sm mt-4">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-2 font-bold w-[50%]">SERVICE / ITEM</th>
                                <th className="py-2 font-bold text-center">QUANTITY</th>
                                <th className="py-2 font-bold text-right">RATE</th>
                                <th className="py-2 font-bold text-right">TOTAL</th>
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
                                <div className="flex justify-between p-2 bg-gray-50 rounded-t-lg"><span className="text-gray-600">Subtotal:</span><span className="font-medium">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between p-2"><span className="text-gray-600">Tax ({summary.taxPercentage}%):</span><span className="font-medium">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between p-3 bg-gray-800 text-white rounded-b-lg font-bold text-base"><span>Total:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                            </div>
                        </div>
                        <div className="mt-8 text-xs text-gray-500">
                           <p className="font-bold uppercase tracking-wider mb-2">Payment Schedule & Terms</p>
                           <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                        </div>
                        <div className="flex justify-end mt-8">
                            <SignatureDisplay signature={document.business.ownerSignature} label="Authorized Signature" />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Bold & Grid
export const ConstructionTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className={`p-10 bg-white font-sans text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px' }}>
            <header className="flex justify-between items-center mb-8">
                <div>
                     {business.logoUrl ? (
                        <Image src={business.logoUrl} alt="Logo" width={100} height={40} />
                    ) : (
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                    )}
                </div>
                 <h2 className="text-4xl font-extrabold text-gray-400">ESTIMATE</h2>
            </header>

            <section className="grid grid-cols-3 gap-8 mb-10 text-xs">
                <div className="p-4 bg-gray-50 rounded">
                    <p className="font-bold text-gray-500 mb-2">CLIENT</p>
                    <p className="font-bold text-base">{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                    <p className="font-bold text-gray-500 mb-2">DETAILS</p>
                    <p><span className="font-semibold">Estimate No:</span> {document.estimateNumber}</p>
                    <p><span className="font-semibold">Date:</span> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p>
                    <p><span className="font-semibold">Expires:</span> {safeFormat(document.validUntilDate, 'MMM dd, yyyy')}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                    <p className="font-bold text-gray-500 mb-2">CONTACT</p>
                    <p>{business.phone}</p>
                    <p>{business.email}</p>
                    <p>{business.website}</p>
                </div>
            </section>

             <ConstructionDetails document={document} />
            
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr style={{ backgroundColor: style.color, color: 'white' }}>
                            <th className="p-3 font-bold w-1/2">ITEM DESCRIPTION</th>
                            <th className="p-3 font-bold text-center">QTY</th>
                            <th className="p-3 font-bold text-right">UNIT PRICE</th>
                            <th className="p-3 font-bold text-right">TOTAL</th>
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
                         <div className="w-1/2 text-xs text-gray-600">
                             <p className="font-bold mb-1 text-gray-800">TERMS</p>
                             <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                         </div>
                         <div className="w-2/5">
                            <div className="flex justify-between p-2"><span className="text-gray-600">Subtotal</span><span className="font-medium">{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between p-2"><span className="text-gray-600">Tax</span><span className="font-medium">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between p-2 mt-2 border-t-2 border-black font-bold text-xl"><span >TOTAL</span><span >{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                         </div>
                     </div>
                      <div className="flex justify-between mt-12">
                        <SignatureDisplay signature={document.business.ownerSignature} label="Company Signature" />
                        <SignatureDisplay signature={document.clientSignature} label="Client Approval" />
                    </div>
                </footer>
            )}
        </div>
    );
};
