

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

const CleaningDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.cleaning) return null;
    const { cleaning } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{(t.cleaningSpecifics || 'Cleaning Specifics')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{(t.cleaningType || 'Type')}:</span> {cleaning.cleaningType}</p>
                <p><span className="font-semibold text-gray-600">{(t.schedule || 'Schedule')}:</span> {cleaning.recurringSchedule}</p>
                {cleaning.squareFootage && <p><span className="font-semibold text-gray-600">{(t.sqFt || 'Sq Ft')}:</span> {cleaning.squareFootage}</p>}
                {cleaning.numberOfRooms && <p><span className="font-semibold text-gray-600">{(t.rooms || 'Rooms')}:</span> {cleaning.numberOfRooms}</p>}
                {cleaning.suppliesFee && <p><span className="font-semibold text-gray-600">{(t.suppliesFee || 'Supplies Fee')}:</span> ${cleaning.suppliesFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Sparkle
export const CleaningTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;
    
    return (
        <div className={`bg-white font-sans text-gray-800 flex flex-col relative ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: `10pt`, minHeight: '1056px', color: props.textColor, backgroundColor: props.backgroundColor }}>
            <div className="absolute top-0 left-0 right-0 h-48" style={{ backgroundColor: accentColor, clipPath: 'ellipse(100% 70% at 50% 0%)' }}></div>
            <div className="p-10 relative z-10 flex-grow flex flex-col">
                <header className="flex justify-between items-start mb-8 text-white">
                    <div>
                        {business.logoUrl ? (
                            <Image src={business.logoUrl} alt={`${business.name} Logo`} width={120} height={50} className="object-contain" />
                        ) : (
                            <h1 className="text-3xl font-bold">{business.name}</h1>
                        )}
                        <p className="text-xs whitespace-pre-line">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                        <p className="text-sm">#{invoice.invoiceNumber}</p>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-4 mb-8 text-xs p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                    <div>
                        <p className="font-bold text-base mb-2">{(t.companyInformation || 'Company Information')}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.companyName || 'Company Name')}:</span> {business.name}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.address || 'Address')}:</span> <span className="whitespace-pre-line">{business.address}</span></p>
                        <p><span className="font-bold w-24 inline-block">{(t.phone || 'Phone')}:</span> {business.phone}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.email || 'Email')}:</span> {business.email}</p>
                        {business.website && <p><span className="font-bold w-24 inline-block">{(t.website || 'Website')}:</span> {business.website}</p>}
                        {business.licenseNumber && <p><span className="font-bold w-24 inline-block">{(t.license || 'License #')}:</span> {business.licenseNumber}</p>}
                        {business.taxId && <p><span className="font-bold w-24 inline-block">{(t.taxId || 'Tax ID')}:</span> {business.taxId}</p>}
                    </div>
                    <div>
                        <p className="font-bold text-base mb-2">{(t.customerInformation || 'Customer Information')}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.customerName || 'Customer Name')}:</span> {client.name}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.address || 'Address')}:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                        <p><span className="font-bold w-24 inline-block">{(t.phone || 'Phone')}:</span> {client.phone}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.email || 'Email')}:</span> {client.email}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                        {client.projectLocation && <p className="mt-2"><span className="font-bold">Project Location:</span><br/>{client.projectLocation}</p>}
                    </div>
                </section>

                <section className="text-xs mb-4">
                    <p><span className="font-bold">Date:</span> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                    <p><span className="font-bold">Due Date:</span> {safeFormat(invoice.dueDate, 'MMMM d, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </section>
                
                 <CleaningDetails invoice={invoice} t={t} />

                <main className="flex-grow">
                     <table className="w-full text-left text-xs">
                        <thead style={{ backgroundColor: accentColor }} className="text-white">
                            <tr>
                                <th className="p-2 font-bold w-12">{(t.no || 'No')}</th>
                                <th className="p-2 font-bold w-3/5">{(t.serviceDescription || 'Service Description')}</th>
                                <th className="p-2 font-bold text-center">{(t.quantity || 'Quantity')}</th>
                                <th className="p-2 font-bold text-right">{(t.unitPrice || 'Unit Price')}</th>
                                <th className="p-2 font-bold text-right">{(t.total || 'Total')}</th>
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
                             <table className="w-2/5 text-sm">
                                <tbody>
                                    <tr><td className="p-2 text-right">{(t.subtotal || 'Subtotal')}</td><td className="p-2 text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                    {discountAmount > 0 && <tr><td className="p-2 text-right text-red-500">{(t.discount || 'Discount')}</td><td className="p-2 text-right text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</td></tr>}
                                    {invoice.summary.shippingCost > 0 && <tr><td className="p-2 text-right">{(t.shipping || 'Shipping')}</td><td className="p-2 text-right">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</td></tr>}
                                    <tr><td className="p-2 text-right">{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%)</td><td className="p-2 text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                    <tr className="border-t-2 font-bold"><td className="p-2 text-right">{(t.total || 'Total')}</td><td className="p-2 text-right">{currencySymbol}{total.toFixed(2)}</td></tr>
                                    {(invoice.amountPaid || 0) > 0 && <tr className="text-green-600 font-bold"><td className="p-2 text-right">{(t.amountPaid || 'Amount Paid')}</td><td className="p-2 text-right">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td></tr>}
                                    <tr style={{backgroundColor: accentColor, color: 'white'}} className="font-bold"><td className="p-2 text-right">{(t.balanceDue || 'Balance Due')}</td><td className="p-2 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                                </tbody>
                             </table>
                        </div>
                        <div className="grid grid-cols-2 gap-8 items-end text-xs">
                             <div>
                                <p className="font-bold text-base mb-2">{(t.termsAndConditions || 'Terms and Conditions')}:</p>
                                <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                            </div>
                            <div className="text-center">
                                 {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label={"Authorized Signature"} />}
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 2: Fresh
export const CleaningTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', color: props.textColor, backgroundColor: props.backgroundColor }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2 border-gray-100">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain mb-2"/>}
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                    <p className="text-xs text-gray-500">{business.phone} | {business.email}</p>
                    {business.website && <p className="text-xs text-gray-500">{business.website}</p>}
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                    <p className="text-xs text-gray-500">{business.licenseNumber && `Lic#: ${business.licenseNumber}`}</p>
                    <p className="text-xs text-gray-500">{business.taxId && `Tax ID: ${business.taxId}`}</p>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500">{(t.client || 'Client')}:</p>
                    <p className="font-semibold">{client.name}</p>
                    <p>{client.address}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                </div>
                <div>
                     <p className="font-bold text-gray-500">{(t.project || 'Project')}:</p>
                     <p className="font-semibold">{invoice.poNumber || 'N/A'}</p>
                     {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                     {client.projectLocation && <p className="mt-2"><span className="font-bold">Project Location:</span><br/>{client.projectLocation}</p>}
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{(t.invoiceNo || 'Invoice #')}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{(t.date || 'Date')}:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold">{(t.dueDate || 'Due Date')}:</span> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                </div>
            </section>
            
             <CleaningDetails invoice={invoice} t={t}/>

            <main className="flex-grow mt-4">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="py-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
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
                            <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between">Discount: <span className="text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between">Shipping: <span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                             {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                     {business.ownerSignature && (
                        <div className="mt-8">
                            <p className="text-sm font-semibold text-gray-500">Authorized Signature</p>
                            <Image src={business.ownerSignature.image} alt="Owner Signature" width={150} height={75} />
                        </div>
                    )}
                </footer>
            )}
        </div>
    );
};

// Template 3: Pristine
export const CleaningTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: accentColor + '10', color: props.textColor }}>
            <div className="bg-white p-8 shadow-lg">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={90} height={45} className="object-contain mb-2"/>}
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-extrabold text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                        <p className="text-xs"># {invoice.invoiceNumber}</p>
                    </div>
                </header>
                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div>
                        <p className="font-bold text-gray-500 mb-1">{(t.billedTo || 'Billed To')}</p>
                        <p>{client.name}<br/>{client.address}<br/>{client.email}<br/>{client.phone}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                        {client.projectLocation && <p className="mt-2"><span className="font-bold">Project Location:</span><br/>{client.projectLocation}</p>}
                    </div>
                    <div className="text-right">
                        <p><span className="font-bold text-gray-500">{(t.date || 'Date')}: </span>{safeFormat(invoice.invoiceDate, 'dd-MMM-yyyy')}</p>
                        <p><span className="font-bold text-gray-500">{(t.dueDate || 'Due Date')}: </span>{safeFormat(invoice.dueDate, 'dd-MMM-yyyy')}</p>
                        {invoice.poNumber && <p><span className="font-bold text-gray-500">PO #: </span>{invoice.poNumber}</p>}
                    </div>
                </section>
                <CleaningDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">{(t.serviceDescription || 'Service Description')}</th><th className="p-2 font-bold text-right">{(t.fee || 'Fee')}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3 space-y-1">
                            <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between text-red-500"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>{(t.shipping || 'Other Fees')}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-gray-300"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                    {business.ownerSignature && (
                        <div className="mt-8">
                            <p className="text-sm font-semibold text-gray-500">Authorized Signature</p>
                            <Image src={business.ownerSignature.image} alt="Owner Signature" width={150} height={75} />
                        </div>
                    )}
                </footer>
                )}
            </div>
        </div>
    );
};

export const CleaningTemplate4: React.FC<PageProps> = (props) => <CleaningTemplate1 {...props} />;
export const CleaningTemplate5: React.FC<PageProps> = (props) => <CleaningTemplate2 {...props} />;

    