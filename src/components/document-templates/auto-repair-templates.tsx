
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

// Template 1: Direct Interpretation
export const AutoRepairTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, autoRepair } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#FBBF24'; // Default to a gold/yellow

    return (
        <div className={`bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '9pt', minHeight: '1056px' }}>
            <header className="p-10 pb-5" style={{ backgroundColor: accentColor }}>
                <div className="flex justify-between items-center text-white">
                    <div>
                        <h1 className="text-3xl font-bold">Repair Estimate</h1>
                        <p className="text-sm opacity-90">Restoring Vehicles, Reviving Peace of Mind</p>
                    </div>
                    {business.logoUrl ? 
                        <Image src={business.logoUrl} alt="Logo" width={80} height={80} className="object-contain" /> :
                        <div className="text-right"><p className="font-bold text-lg">{business.name}</p></div>
                    }
                </div>
            </header>
            <div className="p-10 pt-5 flex-grow flex flex-col">
                <section className="grid grid-cols-2 gap-4 mb-6 text-xs pb-4 border-b border-gray-200">
                    <div>
                        <p className="p-1 text-sm font-bold rounded" style={{ backgroundColor: `${accentColor}40`}}>Customer Information</p>
                        <p className="mt-2"><span className="font-bold w-20 inline-block">Name:</span> {client.name}</p>
                        <p><span className="font-bold w-20 inline-block">Address:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                        <p><span className="font-bold w-20 inline-block">Phone:</span> {client.phone}</p>
                        <p><span className="font-bold w-20 inline-block">Email:</span> {client.email}</p>
                    </div>
                    {autoRepair &&
                    <div>
                        <p className="p-1 text-sm font-bold rounded" style={{ backgroundColor: `${accentColor}40`}}>Vehicle Information</p>
                        <p className="mt-2"><span className="font-bold w-20 inline-block">Make:</span> {autoRepair.vehicleMake}</p>
                        <p><span className="font-bold w-20 inline-block">Model:</span> {autoRepair.vehicleModel}</p>
                        <p><span className="font-bold w-20 inline-block">Year:</span> {autoRepair.vehicleYear}</p>
                        <p><span className="font-bold w-20 inline-block">VIN:</span> {autoRepair.vin}</p>
                    </div>
                    }
                </section>
            
                <main className="flex-grow">
                     <p className="p-1 mb-2 text-sm font-bold rounded" style={{ backgroundColor: `${accentColor}40`}}>Repair Details</p>
                     <table className="w-full text-left text-xs">
                        <thead className="border-y border-gray-400">
                            <tr>
                                <th className="p-2 font-bold w-1/2">DESCRIPTION</th>
                                <th className="p-2 font-bold text-center">QTY</th>
                                <th className="p-2 font-bold text-right">UNIT PRICE</th>
                                <th className="p-2 font-bold text-right">TOTAL PRICE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-200">
                                    <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
                                    <td className="p-2 align-top text-center">{item.quantity}</td>
                                    <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                         {pageIndex === totalPages - 1 && (
                            <tfoot>
                                <tr>
                                    <td colSpan={3} className="p-2 pt-2 text-right font-bold text-base">Total</td>
                                    <td className="p-2 pt-2 text-right font-bold text-base">{currencySymbol}{summary.subtotal.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                         )}
                    </table>
                </main>
            
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8 text-xs">
                        <section className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <p className="font-bold mb-2">Payment Information</p>
                                <p>Details available upon request or on final invoice.</p>
                            </div>
                             <div>
                                <p className="font-bold mb-2">Additional Notes</p>
                                <p className="whitespace-pre-line text-gray-600">{document.termsAndConditions}</p>
                            </div>
                        </section>
                        <div className="flex justify-between items-end border p-4 rounded-md">
                            <div>
                                <p className="font-bold mb-2">Terms and Conditions</p>
                                <p className="text-gray-600">By signing below, the customer agrees to the repair estimate and authorizes {business.name}<br/> to proceed with repairs, understanding that additional costs may apply and will be discussed.</p>
                            </div>
                            <div className="text-center">
                                {document.clientSignature ? <Image src={document.clientSignature.image} alt="signature" width={120} height={60} /> : <div className="w-40 h-10 border-b border-gray-400"></div>}
                                <p className="text-xs mt-1">Customer Signature</p>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 2: Modern Dark
export const AutoRepairTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency, autoRepair } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className={`bg-gray-800 text-white font-sans flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Roboto, sans-serif', fontSize: '9.5pt', minHeight: '1056px' }}>
            <header className="p-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-extrabold tracking-wider">REPAIR ESTIMATE</h1>
                    <div className="text-right">
                        <p className="font-bold text-lg">{business.name}</p>
                        <p className="text-xs text-gray-300">{business.address}</p>
                    </div>
                </div>
            </header>
            <div className="p-10 pt-0 flex-grow flex flex-col">
                <section className="mb-6 pb-4 border-b border-gray-600 grid grid-cols-2 gap-8 text-xs">
                     <div>
                        <p className="font-bold text-gray-400 mb-1">CUSTOMER</p>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-gray-300">{client.address}</p>
                    </div>
                    {autoRepair && 
                    <div className="text-right">
                        <p className="font-bold text-gray-400 mb-1">VEHICLE</p>
                        <p className="font-medium">{autoRepair.vehicleMake} {autoRepair.vehicleModel} ({autoRepair.vehicleYear})</p>
                        <p className="text-gray-300">VIN: {autoRepair.vin}</p>
                    </div>}
                </section>
            
                <main className="flex-grow">
                     <table className="w-full text-left text-sm">
                        <thead className="text-gray-300">
                            <tr>
                                <th className="py-2 font-semibold w-1/2">SERVICE</th>
                                <th className="py-2 font-semibold text-center">QTY</th>
                                <th className="py-2 font-semibold text-right">UNIT COST</th>
                                <th className="py-2 font-semibold text-right">SUBTOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-700">
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
                         <div className="flex justify-end mb-6">
                            <div className="w-2/5 text-sm space-y-2">
                                <div className="flex justify-between"><span className="text-gray-400">Subtotal:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Taxes & Fees:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2 border-gray-500" style={{color: style.color || '#FBBF24'}}><span>ESTIMATE TOTAL:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};


// Template 3: Minimalist & Clean
export const AutoRepairTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className={`p-12 bg-white font-['Garamond',_serif] text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{minHeight: '1056px' }}>
            <header className="mb-12">
                <h1 className="text-4xl font-light tracking-wider">Repair Estimate</h1>
                <p className="text-sm mt-1">{business.name}</p>
            </header>

            <section className="flex justify-between mb-10 text-xs">
                 <div>
                    <p className="font-bold text-gray-500 mb-1">Prepared For</p>
                    <p>{client.name}</p><p>{client.address}</p>
                </div>
                 <div className="text-right">
                    <p><span className="font-bold">Estimate #</span> {document.estimateNumber}</p>
                    <p><span className="font-bold">Date:</span> {safeFormat(document.estimateDate, 'MMM dd, yyyy')}</p>
                </div>
            </section>
            
            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-semibold w-1/2 border-b-2 border-gray-300">ITEM</th>
                            <th className="p-2 font-semibold text-center border-b-2 border-gray-300">QUANTITY</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">PRICE</th>
                            <th className="p-2 font-semibold text-right border-b-2 border-gray-300">AMOUNT</th>
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
                    <div className="flex justify-end">
                        <table className="w-1/3 text-xs">
                             <tbody>
                                <tr><td className="py-1 text-gray-500">Subtotal</td><td className="text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                <tr><td className="py-1 text-gray-500">Tax</td><td className="text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">TOTAL</td><td className="pt-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Corporate Blue Accents
export const AutoRepairTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const accentColor = style.color || '#3B82F6';

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="flex justify-between items-center pb-4 border-b-2" style={{borderColor: accentColor}}>
                <h1 className="text-3xl font-extrabold" style={{color: accentColor}}>REPAIR ESTIMATE</h1>
                <div className="text-right">
                    <p className="font-bold text-lg">{business.name}</p>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </div>
            </header>
            
            <section className="my-8 grid grid-cols-2 gap-4 text-xs">
                 <div><p><span className="font-bold text-gray-500">TO: </span>{client.name}</p><p>{client.address}</p></div>
                 <div className="text-right"><p><span className="font-bold text-gray-500">ESTIMATE #: </span>{document.estimateNumber}</p><p><span className="font-bold text-gray-500">DATE: </span>{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p></div>
            </section>
            
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
                                <tr><td className="py-1 text-gray-600">Subtotal</td><td className="py-1 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                {summary.taxAmount > 0 && <tr><td className="py-1 text-gray-600">Taxes</td><td className="py-1 text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>}
                                <tr className="font-bold text-base border-t-2 border-black"><td className="py-2">Total</td><td className="py-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 5: Grid Layout
export const AutoRepairTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto',_sans-serif] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{minHeight: '1056px'}}>
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold" style={{color: style.color || '#DC2626'}}>ESTIMATE</h1>
                {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={100} height={40} className="object-contain" />}
            </header>

            <section className="grid grid-cols-2 gap-4 mb-8 text-xs p-4 bg-white rounded-lg shadow-sm">
                <div><p className="font-bold text-gray-500">From:</p><p className="font-semibold">{business.name}</p><p>{business.address}</p></div>
                <div><p className="font-bold text-gray-500">To:</p><p className="font-semibold">{client.name}</p><p>{client.address}</p></div>
                <div><p className="font-bold text-gray-500">Estimate No:</p><p>{document.estimateNumber}</p></div>
                <div><p className="font-bold text-gray-500">Date Issued:</p><p>{safeFormat(document.estimateDate, 'MMM d, yyyy')}</p></div>
            </section>
            
            <main className="flex-grow bg-white p-4 rounded-lg shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-3/5">DESCRIPTION OF WORK</th>
                            <th className="py-2 font-bold text-center">HOURS/QTY</th>
                            <th className="py-2 font-bold text-right">COST</th>
                            <th className="py-2 font-bold text-right">TOTAL</th>
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
                        <p className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>Tax</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>Total Estimate</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};
