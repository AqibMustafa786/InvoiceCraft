

'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';

interface PageProps {
  invoice: Invoice;
  pageItems: LineItem[];
  pageIndex: number;
  totalPages: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  balanceDue: number;
  t: any;
  currencySymbol: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

const safeFormat = (date: Date | string | number | null | undefined, formatString: string) => {
    if (!date) return "N/A";
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

const LandscapingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.landscaping) return null;
    const { landscaping } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.landscapingSpecifics || 'Landscaping Specifics')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p className="col-span-full"><span className="font-semibold text-gray-600">{(t.service || 'Service')}:</span> {landscaping.serviceType}</p>
                {landscaping.lawnSquareFootage && <p><span className="font-semibold text-gray-600">{(t.lawnSqFt || 'Lawn Sq Ft')}:</span> {landscaping.lawnSquareFootage}</p>}
                {landscaping.equipmentFee && <p><span className="font-semibold text-gray-600">{(t.equipmentFee || 'Equipment Fee')}:</span> ${landscaping.equipmentFee.toFixed(2)}</p>}
                {landscaping.disposalFee && <p><span className="font-semibold text-gray-600">{(t.disposalFee || 'Disposal Fee')}:</span> ${landscaping.disposalFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};


// Template 1: Based on user-provided image
export const LandscapingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', minHeight: '1056px', color: props.textColor, backgroundColor: props.backgroundColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                     {business.logoUrl && (
                        <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain"/>
                    )}
                     <h2 className="text-3xl font-bold mt-2" style={{ color: accentColor }}>{business.name}</h2>
                     <p className="text-xs whitespace-pre-line">{business.address}</p>
                     <p className="text-xs">{business.phone} | {business.email}</p>
                     {business.website && <p className="text-xs">{business.website}</p>}
                     {business.licenseNumber && <p className="text-xs">Lic #: {business.licenseNumber}</p>}
                     {business.taxId && <p className="text-xs">Tax ID: {business.taxId}</p>}
                </div>
                <div className="text-right">
                    <h1 className="text-2xl font-bold">{docTitle}</h1>
                    <p className="text-xs text-gray-500">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-8 text-sm">
                 <div className="text-xs space-y-1">
                    <p className="font-bold text-gray-500 mb-1">BILLED TO</p>
                    <p className="font-bold">{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    {client.projectLocation && <p className="mt-2"><span className="font-bold">Project Location:</span><br/>{client.projectLocation}</p>}
                </div>
                <div className="text-xs space-y-1 text-right">
                    <p><span className="font-bold">Date:</span> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                    <p><span className="font-bold">Due Date:</span> {safeFormat(invoice.dueDate, 'MMMM d, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>

             <LandscapingDetails invoice={invoice} t={t}/>
            
            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: accentColor }} className="text-white">
                            <th className="p-2 font-bold w-1/2">DESCRIPTION</th>
                            <th className="p-2 font-bold text-center">QTY</th>
                            <th className="p-2 font-bold text-right">UNIT PRICE</th>
                            <th className="p-2 font-bold text-right">TOTAL COST</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b bg-gray-50/50">
                                <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right font-bold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <div className="w-2/5 text-sm">
                             <table className="w-full">
                                <tbody>
                                    <tr className="border-b"><td className="p-2">Subtotal</td><td className="p-2 text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                    {discountAmount > 0 && <tr className="border-b"><td className="p-2">Discount</td><td className="p-2 text-right text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</td></tr>}
                                    {invoice.summary.shippingCost > 0 && <tr className="border-b"><td className="p-2">Shipping</td><td className="p-2 text-right">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</td></tr>}
                                    <tr className="border-b"><td className="p-2">Tax</td><td className="p-2 text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                    <tr className="border-b"><td className="p-2 font-bold">Total</td><td className="p-2 text-right font-bold">{currencySymbol}{total.toFixed(2)}</td></tr>
                                    {(invoice.amountPaid || 0) > 0 && <tr className="border-b text-green-600"><td className="p-2 font-bold">Paid</td><td className="p-2 text-right font-bold">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td></tr>}
                                    <tr style={{ backgroundColor: accentColor }} className="text-white"><td className="p-2 font-bold text-lg">Balance Due</td><td className="p-2 text-right font-bold text-lg">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                                </tbody>
                             </table>
                        </div>
                    </div>
                    <div className="mt-8 text-xs border p-3">
                         <p className="font-bold mb-1" style={{color: accentColor}}>Terms of Services</p>
                         <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                    {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />}
                </footer>
            )}
        </div>
    );
};


// Template 2: Modern & Clean
export const LandscapingTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', color: props.textColor, backgroundColor: props.backgroundColor }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2 border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                    <p className="text-xs text-gray-500">{business.phone} | {business.email}</p>
                    {business.website && <p className="text-xs text-gray-500">{business.website}</p>}
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500">Client:</p>
                    <p className="font-semibold">{client.name}</p>
                    <p>{client.address}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                </div>
                <div>
                     <p className="font-bold text-gray-500">Project:</p>
                     <p className="font-semibold">{client.projectLocation || 'N/A'}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Invoice #:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">Date:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold">Due Date:</span> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>
            
             <LandscapingDetails invoice={invoice} t={t}/>

            <main className="flex-grow mt-4">
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
                            <p className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between">Discount: <span className="text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between">Shipping/Extra: <span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold"><span>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                    {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />}
                </footer>
            )}
        </div>
    );
};

// Template 3: Side Panel Design
export const LandscapingTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="w-1/3 p-8 text-white" style={{ backgroundColor: accentColor }}>
                <h1 className="text-4xl font-bold mb-2">{docTitle}</h1>

                <div className="text-sm space-y-6 flex-grow">
                    <div>
                        <p className="font-bold opacity-80 mb-1">CLIENT</p>
                        <p className="font-bold text-lg">{client.name}</p>
                        <p>{client.address}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">PROJECT</p>
                        <p>{invoice.poNumber || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">DETAILS</p>
                        <p># {invoice.invoiceNumber}</p>
                        <p>Date: {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                        <p>Due: {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                    </div>
                </div>
            </div>
            <div className="w-2/3 p-10 flex flex-col">
                <header className="mb-8 text-right">
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain ml-auto mb-2"/>}
                    <h2 className="text-3xl font-bold">{business.name}</h2>
                    <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                </header>
                 <LandscapingDetails invoice={invoice} t={t}/>
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b-2 border-gray-300">
                            <tr>
                                <th className="py-2 font-bold w-1/2">SERVICE/ITEM</th>
                                <th className="py-2 font-bold text-center">QTY</th>
                                <th className="py-2 font-bold text-right">PRICE</th>
                                <th className="py-2 font-bold text-right">TOTAL</th>
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
                            <div className="w-1/2 text-sm">
                                <div className="flex justify-between p-2 bg-gray-50"><span className="text-gray-600">Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                                {discountAmount > 0 && <div className="flex justify-between p-2"><span className="text-gray-600">Discount:</span><span className="text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                                {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-2"><span className="text-gray-600">Shipping:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                                <div className="flex justify-between p-2"><span className="text-gray-600">Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                                {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between p-2"><span className="text-gray-600">Paid:</span><span className="text-green-600">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                                <div className="flex justify-between p-2 font-bold text-base" style={{ backgroundColor: `${accentColor}20` }}>
                                    <span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                         {business.ownerSignature && <div className="mt-8 flex justify-start"><SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" /></div>}
                    </footer>
                )}
            </div>
        </div>
    );
};

export const LandscapingTemplate4: React.FC<PageProps> = (props) => <LandscapingTemplate1 {...props} />;
export const LandscapingTemplate5: React.FC<PageProps> = (props) => <LandscapingTemplate2 {...props} />;
export const LandscapingTemplate6: React.FC<PageProps> = (props) => <LandscapingTemplate3 {...props} />;
export const LandscapingTemplate7: React.FC<PageProps> = (props) => <LandscapingTemplate1 {...props} />;
export const LandscapingTemplate8: React.FC<PageProps> = (props) => <LandscapingTemplate2 {...props} />;
export const LandscapingTemplate9: React.FC<PageProps> = (props) => <LandscapingTemplate3 {...props} />;
export const LandscapingTemplate10: React.FC<PageProps> = (props) => <LandscapingTemplate1 {...props} />;

