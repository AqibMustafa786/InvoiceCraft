
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

export const PlumbingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.plumbing) return null;
    const { plumbing } = invoice;
    const hasDetails = Object.values(plumbing).some(val => val !== null && val !== '');

    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.plumbingDetails || 'Plumbing Specifics'}</p>
            </section>
        );
    }
    
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.plumbingDetails || 'Plumbing Specifics'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {plumbing.serviceType && <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service'}:</span> {plumbing.serviceType}</p>}
                {plumbing.pipeMaterial && <p><span className="font-semibold text-gray-600">{t.pipeMaterial || 'Pipe Material'}:</span> {plumbing.pipeMaterial}</p>}
                {plumbing.fixtureName && <p><span className="font-semibold text-gray-600">{t.fixture || 'Fixture'}:</span> {plumbing.fixtureName}</p>}
                {plumbing.emergencyFee && <p><span className="font-semibold text-gray-600">{t.emergencyFee || 'Emergency Fee'}:</span> ${plumbing.emergencyFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

export const PlumbingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice').toUpperCase();

    return (
        <div className={`p-8 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-4">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={120} height={60} className="object-contain" />}
                    <h1 className="text-3xl font-bold mt-2" style={{color: accentColor}}>{business.name}</h1>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold">{docTitle}</h2>
                    <p className="text-xs">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div className="p-2 border border-black">
                    <p className="px-2 font-bold text-white bg-black">SERVICE PROVIDER</p>
                    <div className="p-2 space-y-0.5">
                        <p>{business.name}</p>
                        <p>{business.address}</p>
                        <p>{business.phone}</p>
                        <p>{business.email}</p>
                    </div>
                </div>
                <div className="p-2 border border-gray-400">
                     <p className="px-2 font-bold text-white bg-gray-500">CUSTOMER</p>
                    <div className="p-2 space-y-0.5">
                        <p>{client.name}</p>
                        <p>{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                    </div>
                </div>
            </section>
            
            <PlumbingDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="p-1.5 font-bold w-[5%]">ID</th>
                            <th className="p-1.5 font-bold w-[55%]">PLUMBING SERVICE</th>
                            <th className="p-1.5 font-bold text-center">QUANTITY</th>
                            <th className="p-1.5 font-bold text-right">PRICE</th>
                            <th className="p-1.5 font-bold text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-300">
                                <td className="p-1.5 align-top">{index + 1}</td>
                                <td className="p-1.5 align-top whitespace-pre-line">{item.name}</td>
                                <td className="p-1.5 align-top text-center">{item.quantity}</td>
                                <td className="p-1.5 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-1.5 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-4 text-xs">
                     <div className="flex justify-between items-start">
                        <div className="w-1/2">
                             <p className="font-bold">THANK YOU FOR YOUR BUSINESS!</p>
                             <p className="font-bold mt-4">Terms & Conditions:</p>
                             <p className="whitespace-pre-line text-gray-600">{invoice.paymentInstructions}</p>
                             <div className="flex gap-16 mt-8">
                                <SignatureDisplay signature={business.ownerSignature} label={"Owner Signature"} />
                            </div>
                        </div>
                        <div className="w-2/5">
                            <div className="space-y-1">
                                <div className="flex justify-between p-1"><span className="font-bold">SUBTOTAL</span><span className="font-bold">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                                {discountAmount > 0 && <div className="flex justify-between p-1"><span className="font-bold">DISCOUNT</span><span className="font-bold text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                                {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-1"><span className="font-bold">SHIPPING AND HANDLING</span><span className="font-bold">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                                {taxAmount > 0 && <div className="flex justify-between p-1"><span className="font-bold">SALES TAX ({invoice.summary.taxPercentage}%)</span><span className="font-bold">{currencySymbol}{taxAmount.toFixed(2)}</span></div>}
                                <div className="flex justify-between p-2 mt-1 bg-black text-white font-bold text-base"><span>TOTAL</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                                {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between p-1 font-bold text-green-600"><span>AMOUNT PAID</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                                <div className="flex justify-between p-1 mt-1 bg-gray-200 font-bold"><span>BALANCE DUE</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Modern Blue
export const PlumbingTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-4xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs whitespace-pre-line text-gray-500">{business.address}</p>
                    {business.website && <p className="text-xs text-gray-500">{business.website}</p>}
                    {business.licenseNumber && <p className="text-xs text-gray-500">Lic #: {business.licenseNumber}</p>}
                    {business.taxId && <p className="text-xs text-gray-500">Tax ID: {business.taxId}</p>}
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-400">{docTitle}</h2>
                    <p className="text-sm">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 my-4 text-sm">
                <div><p className="font-bold text-gray-500">TO</p><p>{client.name}</p>{client.companyName && <p>{client.companyName}</p>}<p>{client.address}</p></div>
                 <div className="text-right col-span-2">
                    <p><span className="font-bold text-gray-500">DATE: </span>{safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold text-gray-500">DUE DATE: </span>{safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                </div>
            </section>
            
            <PlumbingDetails invoice={invoice} t={t} />

            <main className="flex-grow mt-4">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr style={{ backgroundColor: accentColor }} className="text-white">
                            <th className="p-2 font-bold w-1/2 rounded-l-md">DESCRIPTION</th>
                            <th className="p-2 font-bold text-center">QTY</th>
                            <th className="p-2 font-bold text-right">UNIT PRICE</th>
                            <th className="p-2 font-bold text-right rounded-r-md">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
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
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <div className="w-1/3 text-sm space-y-1">
                             <div className="flex justify-between p-1"><span className="text-gray-600">Subtotal:</span><span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                             {discountAmount > 0 && <div className="flex justify-between p-1"><span className="text-gray-600">Discount:</span><span className="font-medium text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                            {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-1"><span className="text-gray-600">Shipping/Extra:</span><span className="font-medium">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between p-1"><span className="text-gray-600">Tax:</span><span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2" style={{ borderColor: accentColor }}><span style={{ color: accentColor }}>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                            {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between font-bold text-green-600"><span>Amount Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                             <div className="flex justify-between font-bold text-base mt-1 p-2 bg-gray-100"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">Terms & Conditions:</p>
                        <p className="text-gray-500 whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label="Owner Signature" />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Clean & Minimal
export const PlumbingTemplate3: React.FC<PageProps> = (props) => <div>Plumbing Template 3 not fully implemented</div>;
// Template 4: Side Panel
export const PlumbingTemplate4: React.FC<PageProps> = (props) => <div>Plumbing Template 4 not fully implemented</div>;
// Template 5: Bold Grid
export const PlumbingTemplate5: React.FC<PageProps> = (props) => <div>Plumbing Template 5 not fully implemented</div>;

