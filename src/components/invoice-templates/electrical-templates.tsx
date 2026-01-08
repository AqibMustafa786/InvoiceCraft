
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

export const ElectricalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.electrical) return null;
    const { electrical } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.electricalServiceDetails || 'Electrical Service Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {electrical.serviceType}</p>
                <p><span className="font-semibold text-gray-600">{t.voltage || 'Voltage'}:</span> {electrical.voltage}</p>
                <p><span className="font-semibold text-gray-600">{t.fixtureDevice || 'Fixture/Device'}:</span> {electrical.fixtureDevice}</p>
                {electrical.permitCost && <p><span className="font-semibold text-gray-600">{t.permitCost || 'Permit Cost'}:</span> ${electrical.permitCost.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Voltage
export const ElectricalTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, accentColor, t } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', minHeight: '1056px', color: props.textColor, backgroundColor: props.backgroundColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold" style={{ color: accentColor }}>{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-8 text-xs">
                <div>
                    <p className="font-bold" style={{color: accentColor}}>Bill To</p>
                    <p className="font-semibold">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p className="whitespace-pre-line mt-2">{client.shippingAddress || client.projectLocation}</p>
                </div>
                <div className="text-right space-y-1">
                    <p><span className="font-bold" style={{color: accentColor}}>Invoice Number:</span> {invoice.invoiceNumber}</p>
                    {invoice.poNumber && <p><span className="font-bold" style={{color: accentColor}}>Reference #:</span> {invoice.poNumber}</p>}
                    <p><span className="font-bold" style={{color: accentColor}}>Date Issued:</span> {safeFormat(invoice.invoiceDate, 'dd-MM-yyyy')}</p>
                    <p><span className="font-bold" style={{color: accentColor}}>Due Date:</span> {safeFormat(invoice.dueDate, 'dd-MM-yyyy')}</p>
                </div>
            </section>
            
            <ElectricalDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead style={{ backgroundColor: accentColor, color: 'white' }}>
                        <tr>
                            <th className="p-2 font-bold w-[10%] text-center">QTY</th>
                            <th className="p-2 font-bold w-[50%]">Description</th>
                            <th className="p-2 font-bold text-right">Unit Price</th>
                            <th className="p-2 font-bold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="p-2 align-top text-center">{item.quantity}</td>
                                <td className="p-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 align-top text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-6">
                    <div className="flex justify-end">
                        <div className="w-2/5 text-sm space-y-1">
                             <div className="flex justify-between p-1"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                             {discountAmount > 0 && <div className="flex justify-between p-1 text-red-500"><span>Discount</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                             {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-1"><span>Shipping/Extra</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                             {taxAmount > 0 && <div className="flex justify-between p-1"><span>Tax ({invoice.summary.taxPercentage}%)</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>}
                             <div className="flex justify-between p-1 font-bold"><span>Total</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                            {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between p-1 text-green-600"><span>Amount Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2" style={{borderColor: accentColor}}><span>Balance Due ({invoice.currency})</span><span style={{color: accentColor}}>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div className="text-xs mt-8">
                        <p className="font-bold" style={{color: accentColor}}>Terms and Conditions</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                     <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Circuit
export const ElectricalTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, accentColor, t } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', color: props.textColor, backgroundColor: props.backgroundColor }}>
            <header className="text-center mb-8">
                {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={80} className="object-contain mx-auto mb-2"/>}
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-xs whitespace-pre-line">{business.address} • {business.phone}</p>
                <div className="mt-4">
                    <h2 className="text-3xl font-bold" style={{ color: accentColor }}>{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs">
                <div>
                    <p className="font-bold">Bill To:</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div className="text-center">
                    <p className="font-bold">Invoice Number:</p>
                    <p>{invoice.invoiceNumber}</p>
                    {invoice.poNumber && <><p className="font-bold mt-2">PO Number:</p><p>{invoice.poNumber}</p></>}
                </div>
                <div className="text-right">
                    <p className="font-bold">Date:</p>
                    <p>{safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                    <p className="font-bold mt-2">Due Date:</p>
                    <p>{safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p>
                </div>
            </section>
            
            <ElectricalDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b-2" style={{borderColor: accentColor}}>
                            <th className="py-2 font-bold w-[60%]">DESCRIPTION</th>
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
                <footer className="mt-auto pt-8 flex justify-between items-end">
                    <div className="w-1/2 text-xs">
                        <p className="font-bold mb-1">Terms:</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                         <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                    </div>
                    <div className="w-1/3 text-sm">
                        <p className="flex justify-between py-1"><span>Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between py-1 text-red-500"><span>Discount:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>Shipping/Extra:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between py-1"><span>Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between py-1 text-green-600"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2 border-black"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Spark
export const ElectricalTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-12 bg-white font-['Garamond',_serif] text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-light tracking-wider">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                    <p className="text-xs">{business.email} | {business.phone}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light tracking-wider">{(t.invoice || 'Invoice').toUpperCase()}</h2>
                </div>
            </header>

            <section className="flex justify-between mb-10 text-xs">
                 <div>
                    <p className="font-bold mb-1">Prepared For</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                </div>
                 <div className="text-right">
                    <p><span className="font-bold">Invoice #:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">Date:</span> {safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p>
                    <p><span className="font-bold">Due Date:</span> {safeFormat(invoice.dueDate, 'MMM dd, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO Number:</span> {invoice.poNumber}</p>}
                </div>
            </section>
            
            <ElectricalDetails invoice={invoice} t={t} />

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
                                <tr><td className="py-1 text-gray-500">Subtotal</td><td className="text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                {discountAmount > 0 && <tr><td className="py-1 text-gray-500">Discount</td><td className="text-right text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</td></tr>}
                                {invoice.summary.shippingCost > 0 && <tr><td className="py-1 text-gray-500">Shipping/Extra</td><td className="text-right">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</td></tr>}
                                <tr><td className="py-1 text-gray-500">Sales Tax</td><td className="text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">TOTAL</td><td className="pt-2 text-right">{currencySymbol}{total.toFixed(2)}</td></tr>
                                {(invoice.amountPaid || 0) > 0 && <tr className="font-bold text-green-600"><td>Amount Paid</td><td className="text-right">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td></tr>}
                                <tr className="font-bold text-lg bg-gray-100"><td className="p-2">Balance Due</td><td className="p-2 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">Terms & Conditions:</p>
                        <p className="text-gray-500 whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Wired
export const ElectricalTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, accentColor, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="w-10" style={{ backgroundColor: accentColor }}></div>
            <div className="p-10 flex-grow flex flex-col">
                <header className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs whitespace-pre-line">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-400">{docTitle}</h2>
                        <p className="text-xs text-gray-400">{invoice.invoiceNumber}</p>
                    </div>
                </header>
                 <section className="grid grid-cols-2 gap-4 mb-8 text-xs">
                    <div><p className="font-bold">CLIENT:</p><p>{client.name}, {client.address}</p></div>
                    <div className="text-right"><p className="font-bold">DATE:</p><p>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
                </section>

                <ElectricalDetails invoice={invoice} t={t} />

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-2 font-bold w-3/5">SERVICE</th>
                                <th className="p-2 font-bold text-center">QTY</th>
                                <th className="p-2 font-bold text-right">RATE</th>
                                <th className="p-2 font-bold text-right">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
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
                            <div className="w-2/5 text-sm space-y-2">
                                <div className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                                {discountAmount > 0 && <div className="flex justify-between text-red-500"><span>Discount:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                                {invoice.summary.shippingCost > 0 && <div className="flex justify-between"><span>Shipping/Extra:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                                <div className="flex justify-between"><span>Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                                {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between text-green-600"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Power Grid
export const ElectricalTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, accentColor, t } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="grid grid-cols-2 gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold" style={{color: accentColor}}>{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                     {business.website && <p className="text-xs">{business.website}</p>}
                </div>
                 <div className="text-right">
                     <p className="text-3xl font-bold">{docTitle}</p>
                     <p className="text-sm text-gray-500">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="mb-8 p-4 bg-white shadow-sm rounded-md text-xs">
                 <p className="font-bold text-gray-500 mb-2">PROJECT FOR: {client.name}</p>
                 <p className="font-semibold">{client.companyName || 'N/A'}</p>
                 <p>{client.address}</p>
                 <p className="mt-2"><span className="font-bold">Due Date:</span> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                 {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
            </section>
            
            <ElectricalDetails invoice={invoice} t={t} />

            <main className="flex-grow bg-white p-4 rounded-md shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-[60%]">Description of Work</th>
                            <th className="py-2 font-bold text-center">Qty</th>
                            <th className="py-2 font-bold text-right">Cost</th>
                            <th className="py-2 font-bold text-right">Total</th>
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
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <div className="w-1/3 text-sm space-y-1">
                             <div className="flex justify-between p-1"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                             {discountAmount > 0 && <div className="flex justify-between p-1"><span>Discount</span><span className="text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                            {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-1"><span>Shipping/Extra</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                             <div className="flex justify-between p-1"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                             <div className="flex justify-between p-1 font-bold"><span>Total</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                             {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between p-1 text-green-600 font-bold"><span>Amount Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                             <div className="flex justify-between p-2 mt-2 border-t-2 border-black font-bold text-lg"><span>Balance Due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
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


export const ElectricalTemplate6: React.FC<PageProps> = (props) => <ElectricalTemplate1 {...props} />;
export const ElectricalTemplate7: React.FC<PageProps> = (props) => <ElectricalTemplate2 {...props} />;
export const ElectricalTemplate8: React.FC<PageProps> = (props) => <ElectricalTemplate3 {...props} />;
export const ElectricalTemplate9: React.FC<PageProps> = (props) => <ElectricalTemplate4 {...props} />;
export const ElectricalTemplate10: React.FC<PageProps> = (props) => <ElectricalTemplate5 {...props} />;

