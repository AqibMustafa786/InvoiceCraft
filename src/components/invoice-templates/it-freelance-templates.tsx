
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

const ITServiceDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.itServices) return null;
    const { itServices } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.itServiceDetails || 'IT Service Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {itServices.serviceType}</p>
                {itServices.hourlyRate && <p><span className="font-semibold text-gray-600">{t.hourlyRate || 'Rate'}:</span> ${itServices.hourlyRate.toFixed(2)}/hr</p>}
                {itServices.hoursWorked && <p><span className="font-semibold text-gray-600">{t.hoursWorked || 'Hours Worked'}:</span> {itServices.hoursWorked}</p>}
                <p><span className="font-semibold text-gray-600">{t.deviceType || 'Device/Server'}:</span> {itServices.deviceType}</p>
                <p><span className="font-semibold text-gray-600">{t.serialNumber || 'Serial #'}:</span> {itServices.serialNumber}</p>
                {itServices.hardwareReplacementCost && <p><span className="font-semibold text-gray-600">{t.hardwareCost || 'Hardware Cost'}:</span> ${itServices.hardwareReplacementCost.toFixed(2)}</p>}
                {itServices.monthlyMaintenanceFee && <p><span className="font-semibold text-gray-600">{t.maintenanceFee || 'Maintenance Fee'}:</span> ${itServices.monthlyMaintenanceFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};


// Template 1: Tech Corporate
export const ITTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    
    return (
        <div className={`p-10 font-sans flex flex-col ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start pb-5 mb-5">
                <div className="flex items-center gap-4">
                    {business.logoUrl ? 
                        <Image src={business.logoUrl} alt="Logo" width={50} height={50} className="object-contain" /> :
                        <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                    }
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                        <p className="text-xs text-gray-500">{business.phone} • {business.email}</p>
                        {business.website && <p className="text-xs text-blue-600">{business.website}</p>}
                        {business.licenseNumber && <p className="text-xs text-gray-500">Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p className="text-xs text-gray-500">Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                 <div className="text-right">
                    <p className="text-2xl font-extrabold">{currencySymbol}{total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p className="text-sm font-bold text-gray-500 tracking-wider">{(t.totalCost || 'TOTAL COST').toUpperCase()}</p>
                </div>
            </header>

            <section className="mb-8 p-4 bg-gray-50 rounded-md text-xs">
                <p className="font-bold text-gray-400 tracking-widest mb-2">{(t.projectInformation || 'PROJECT INFORMATION').toUpperCase()}</p>
                <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-1">
                    <span className="text-gray-600">{(t.projectName || 'PROJECT NAME')}:</span><span className="font-semibold">{invoice.freelance?.projectName || 'N/A'}</span>
                    <span className="text-gray-600">{(t.location || 'LOCATION')}:</span><span className="font-semibold">{client.projectLocation}</span>
                    <span className="text-gray-600">{(t.contactPerson || 'CONTACT PERSON')}:</span><span className="font-semibold">{client.name}</span>
                    <span className="text-gray-600">{(t.estimator || 'ESTIMATOR')}:</span><span className="font-semibold">{business.name}</span>
                    <span className="text-gray-600">{(t.estimationDate || 'DATE')}:</span><span className="font-semibold">{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</span>
                    <span className="text-gray-600">{(t.dueDate || 'DUE DATE')}:</span><span className="font-semibold">{safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</span>
                    <span className="text-gray-600">PO #:</span><span className="font-semibold">{invoice.poNumber}</span>
                </div>
            </section>
            
            <ITServiceDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                 <p className="font-bold text-gray-400 tracking-widest mb-2 text-xs">{(t.costBreakdown || 'COST BREAKDOWN').toUpperCase()}</p>
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="py-2 font-bold text-center">{(t.quantity || 'QUANTITY').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th>
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
                <footer className="mt-auto pt-8 flex justify-between items-end text-xs">
                    <div className="space-y-4">
                        <div>
                             <p className="font-bold text-gray-400 tracking-widest mb-2">{(t.notes || 'NOTES').toUpperCase()}</p>
                             <p className="text-gray-600 whitespace-pre-line w-96">{invoice.paymentInstructions}</p>
                        </div>
                         <div>
                             <p className="font-bold text-gray-400 tracking-widest mb-2">{(t.clientInformation || 'CLIENT INFORMATION').toUpperCase()}</p>
                            <p><span className="text-gray-600 w-20 inline-block">{t.client || 'CLIENT'}:</span> <span className="font-semibold">{client.name}</span></p>
                            <p><span className="text-gray-600 w-20 inline-block">{t.address || 'ADDRESS'}:</span> <span className="font-semibold whitespace-pre-line">{client.address}</span></p>
                            <p><span className="text-gray-600 w-20 inline-block">{t.contact || 'CONTACT'}:</span> <span className="font-semibold">{client.phone}</span></p>
                            <p><span className="text-gray-600 w-20 inline-block">{t.email || 'EMAIL'}:</span> <span className="font-semibold">{client.email}</span></p>
                        </div>
                    </div>
                     <div className="text-right">
                        <SignatureDisplay signature={business.ownerSignature} label={business.name} />
                         <p className="text-lg font-bold mt-4" style={{fontFamily: 'cursive'}}>{t.thankYou || 'Thank you!'}</p>
                     </div>
                </footer>
            )}
        </div>
    );
};

// Template 2: Modern Dark Mode
export const ITTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-gray-900 text-gray-200 font-['Roboto_Mono',_monospace] flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: '#1A202C', color: '#E2E8F0' }}>
            <header className="flex justify-between items-start mb-10">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain mb-2 filter invert brightness-0"/>}
                    <h1 className="text-4xl font-bold" style={{ color: accentColor || '#4C1D95' }}>{business.name}</h1>
                    <div className="text-xs text-gray-400 mt-1">
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light text-gray-400">{docTitle}</h2>
                    <p className="text-xs text-gray-500">{business.licenseNumber && `Lic#: ${business.licenseNumber}`}</p>
                    <p className="text-xs text-gray-500">{business.taxId && `Tax ID: ${business.taxId}`}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500 mb-1">{(t.projectFor || 'PROJECT FOR').toUpperCase()}:</p>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-gray-400 whitespace-pre-line">{client.address}</p>
                    <p className="text-gray-400">{client.email}</p>
                    <p className="text-gray-400">{client.phone}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-gray-500 mb-1">{(t.date || 'DATE').toUpperCase()}:</p>
                    <p>{safeFormat(invoice.invoiceDate, 'MM-dd-yyyy')}</p>
                     <p className="font-bold text-gray-500 mt-2 mb-1">{(t.dueDate || 'DUE DATE').toUpperCase()}:</p>
                    <p>{safeFormat(invoice.dueDate, 'MM-dd-yyyy')}</p>
                    {invoice.poNumber && <><p className="font-bold text-gray-500 mt-2 mb-1">PO #:</p><p>{invoice.poNumber}</p></>}
                </div>
            </section>
            
            <ITServiceDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="py-2 font-semibold w-1/2 text-gray-400">{(t.service || 'SERVICE').toUpperCase()}</th>
                            <th className="py-2 font-semibold text-center text-gray-400">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="py-2 font-semibold text-right text-gray-400">{(t.rate || 'RATE').toUpperCase()}</th>
                            <th className="py-2 font-semibold text-right text-gray-400">{(t.total || 'TOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-800">
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
                        <div className="w-2/5 text-sm space-y-1">
                            <div className="flex justify-between"><span className="text-gray-400">{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                             {discountAmount > 0 && <div className="flex justify-between text-red-400"><span className="text-gray-400">{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                             {invoice.summary.shippingCost > 0 && <div className="flex justify-between"><span className="text-gray-400">{(t.shipping || 'Shipping')}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between"><span className="text-gray-400">{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%):</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                             <div className="flex justify-between font-bold border-t border-gray-600 mt-2 pt-2"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                             {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between text-green-400"><span>{(t.amountPaid || 'Amount Paid')}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-600"><span>{(t.balanceDue || 'Balance Due')}:</span><span style={{ color: accentColor || '#4C1D95' }}>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                    {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label={"Authorized Signature"}/>}
                </footer>
            )}
        </div>
    );
};

// Template 3: Minimalist Grid
export const ITTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-12 bg-white font-['Inter',_sans-serif] text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-12">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="object-contain mb-2"/>}
                    <h1 className="text-3xl font-bold tracking-tighter">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                 <div className="text-right">
                    <h2 className="text-2xl font-extrabold tracking-tighter">{docTitle}</h2>
                    <p className="text-xs">{business.licenseNumber && `Lic#: ${business.licenseNumber}`}</p>
                    <p className="text-xs">{business.taxId && `Tax ID: ${business.taxId}`}</p>
                </div>
            </header>

            <section className="grid grid-cols-4 gap-4 mb-10 text-xs">
                <div>
                    <p className="font-bold text-gray-500 mb-1">{(t.to || 'To')}</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                </div>
                <div><p className="font-bold text-gray-500 mb-1">{(t.invoiceNo || 'Invoice #')}</p><p>{invoice.invoiceNumber}</p></div>
                <div><p className="font-bold text-gray-500 mb-1">{(t.date || 'Date')}</p><p>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
                <div><p className="font-bold text-gray-500 mb-1">{(t.project || 'Project')}</p><p>{invoice.poNumber || 'N/A'}</p></div>
            </section>
            
            <ITServiceDetails invoice={invoice} t={t}/>

            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-bold w-3/5 border-b-2 border-gray-300">{(t.item || 'ITEM').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center border-b-2 border-gray-300">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right border-b-2 border-gray-300">{(t.price || 'PRICE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right border-b-2 border-gray-300">{(t.amount || 'AMOUNT').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="p-2 border-b border-gray-100 whitespace-pre-line">{item.name}</td>
                                <td className="p-2 border-b border-gray-100 text-center">{item.quantity}</td>
                                <td className="p-2 border-b border-gray-100 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 border-b border-gray-100 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
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
                                <tr><td className="py-1 text-gray-500">{(t.subtotal || 'Subtotal')}</td><td className="py-1 text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                {discountAmount > 0 && <tr><td className="py-1 text-gray-500">{(t.discount || 'Discount')}</td><td className="py-1 text-right text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</td></tr>}
                                {invoice.summary.shippingCost > 0 && <tr><td className="py-1 text-gray-500">{(t.shipping || 'Shipping')}</td><td className="py-1 text-right">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</td></tr>}
                                <tr className="border-b"><td className="py-1 text-gray-500">{(t.tax || 'Tax')}</td><td className="py-1 text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base"><td className="pt-2">{(t.total || 'TOTAL').toUpperCase()}</td><td className="pt-2 text-right">{currencySymbol}{total.toFixed(2)}</td></tr>
                                {(invoice.amountPaid || 0) > 0 && <tr className="font-bold text-green-600"><td>Amount Paid</td><td className="text-right">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td></tr>}
                                <tr className="font-bold text-lg bg-gray-100"><td className="p-2">Balance Due</td><td className="p-2 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                     {business.ownerSignature && <div className="mt-8"><SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" /></div>}
                </footer>
            )}
        </div>
    );
};


// Template 4: Creative Blue
export const ITTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="w-1/3 p-8 text-white flex flex-col" style={{ backgroundColor: accentColor || '#1D4ED8' }}>
                 {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="object-contain mb-4 filter invert brightness-0"/>}
                <h1 className="text-4xl font-bold mb-10">{docTitle}</h1>
                <div className="text-sm space-y-6 flex-grow">
                    <div>
                        <p className="font-bold opacity-80 mb-1">{(t.client || 'CLIENT').toUpperCase()}</p>
                        <p className="font-bold text-lg">{client.name}</p>
                        <p className="whitespace-pre-line">{client.address}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">{(t.reference || 'REFERENCE').toUpperCase()}</p>
                        <p># {invoice.invoiceNumber}</p>
                        <p>{(t.date || 'Date')}: {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                        <p>{(t.dueDate || 'Due')}: {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                    </div>
                </div>
                 {pageIndex === totalPages - 1 && (
                    <div className="mt-auto text-sm">
                         <p className="font-bold opacity-80 mb-2">{(t.balanceDue || 'BALANCE DUE').toUpperCase()}</p>
                         <p className="text-4xl font-extrabold">{currencySymbol}{balanceDue.toFixed(2)}</p>
                    </div>
                )}
            </div>
            <div className="w-2/3 p-10 flex flex-col">
                <header className="mb-8 text-right">
                    <h2 className="text-3xl font-bold">{business.name}</h2>
                    <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                </header>
                 <ITServiceDetails invoice={invoice} t={t} />
                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b-2 border-gray-300">
                            <tr>
                                <th className="py-2 font-bold w-1/2">{(t.serviceItem || 'SERVICE/ITEM').toUpperCase()}</th>
                                <th className="py-2 font-bold text-center">{(t.hours || 'HOURS').toUpperCase()}</th>
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

// Template 5: Startup Vibe
export const ITTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-gray-50 font-['Inter',_sans-serif] text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-10">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="object-contain mb-2"/>}
                    <h1 className="text-3xl font-extrabold tracking-tighter">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                 <div className="text-right">
                    <p className="text-2xl font-extrabold tracking-tighter text-gray-400">{docTitle}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 text-xs mb-8">
                <div>
                    <p className="text-gray-500">{(t.to || 'To')}:</p>
                    <p className="font-bold">{client.name}</p>
                    <p className="text-gray-600 whitespace-pre-line">{client.address}</p>
                    <p className="text-gray-600">{client.email} | {client.phone}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-500">{(t.invoice || 'Invoice')} <span className="font-mono text-black">#{invoice.invoiceNumber}</span></p>
                    <p className="text-gray-500">{(t.date || 'Date')}: <span className="font-mono text-black">{safeFormat(invoice.invoiceDate, 'dd.MM.yyyy')}</span></p>
                </div>
            </section>
            
             <ITServiceDetails invoice={invoice} t={t}/>

            <main className="flex-grow bg-white p-4 rounded-lg shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-3/5 text-gray-500">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="py-2 font-bold text-center text-gray-500">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right text-gray-500">{(t.price || 'PRICE').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right text-gray-500">{(t.total || 'TOTAL').toUpperCase()}</th>
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
                <footer className="mt-auto pt-8 flex justify-end">
                    <div className="w-1/3 text-sm space-y-1">
                        <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}</span><span className="font-mono">{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>{(t.tax || 'Tax')}</span><span className="font-mono">{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        {(props.invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>{(t.amountPaid || 'Amount Paid')}</span><span className="font-mono">-{currencySymbol}{(props.invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black">
                            <span>{(t.balanceDue || 'Balance Due')}</span>
                            <span className="font-mono">{currencySymbol}{balanceDue.toFixed(2)}</span>
                        </p>
                    </div>
                </footer>
            )}
        </div>
    );
};
