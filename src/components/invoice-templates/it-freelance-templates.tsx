'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';
import { CategorySpecificDetails } from './category-specific-details';

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
            <p className="text-xs text-muted-foreground pt-1 border-t-2 border-current w-[150px]">{label}</p>
        </div>
    )
}

export const ITServiceDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.itServices && !invoice.freelance) return null;
    
    if (invoice.category === 'IT Services / Tech Support' && invoice.itServices) {
        const hasDetails = Object.values(invoice.itServices).some(val => val !== null && val !== '');
        if (!hasDetails) {
            return (
                <section className="my-4 text-xs">
                    <p className="font-bold text-gray-500 mb-2 border-b">{t.itServiceDetails || 'IT Service Details'}</p>
                </section>
            );
        }

        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.itServiceDetails || 'IT Service Details'}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                    {invoice.itServices.serviceType && <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {invoice.itServices.serviceType}</p>}
                    {invoice.itServices.hourlyRate && <p><span className="font-semibold text-gray-600">{t.hourlyRate || 'Hourly Rate'}:</span> ${invoice.itServices.hourlyRate.toFixed(2)}</p>}
                    {invoice.itServices.hoursWorked && <p><span className="font-semibold text-gray-600">{t.hoursWorked || 'Hours Worked'}:</span> {invoice.itServices.hoursWorked}</p>}
                    {invoice.itServices.deviceType && <p><span className="font-semibold text-gray-600">{t.deviceType || 'Device Type'}:</span> {invoice.itServices.deviceType}</p>}
                    {invoice.itServices.serialNumber && <p><span className="font-semibold text-gray-600">{t.serialNumber || 'Serial #'}:</span> {invoice.itServices.serialNumber}</p>}
                    {invoice.itServices.hardwareReplacementCost && <p><span className="font-semibold text-gray-600">{t.hardwareCost || 'Hardware Cost'}:</span> ${invoice.itServices.hardwareReplacementCost.toFixed(2)}</p>}
                    {invoice.itServices.monthlyMaintenanceFee && <p><span className="font-semibold text-gray-600">{t.maintenanceFee || 'Maintenance Fee'}:</span> ${invoice.itServices.monthlyMaintenanceFee.toFixed(2)}</p>}
                </div>
            </section>
        );
    }

    if (invoice.category === 'Freelance / Agency' && invoice.freelance) {
         const hasDetails = Object.values(invoice.freelance).some(val => val !== null && val !== '');
         if (!hasDetails) {
            return (
                <section className="my-4 text-xs">
                    <p className="font-bold text-gray-500 mb-2 border-b">{t.projectSpecifications || 'Project Specifications'}</p>
                </section>
            );
         }

         return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.projectSpecifications || 'Project Specifications'}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                    {invoice.freelance.projectName && <p className="col-span-full"><span className="font-semibold text-gray-600">{t.projectName || 'Project'}:</span> {invoice.freelance.projectName}</p>}
                    {invoice.freelance.hourlyRate && <p><span className="font-semibold text-gray-600">{t.hourlyRate || 'Hourly Rate'}:</span> ${invoice.freelance.hourlyRate.toFixed(2)}</p>}
                    {invoice.freelance.fixedRate && <p><span className="font-semibold text-gray-600">{t.fixedRate || 'Fixed Rate'}:</span> ${invoice.freelance.fixedRate.toFixed(2)}</p>}
                    {invoice.freelance.hoursLogged && <p><span className="font-semibold text-gray-600">{t.hoursLogged || 'Hours Logged'}:</span> {invoice.freelance.hoursLogged}</p>}
                    {invoice.freelance.milestoneDescription && <p className="col-span-full"><span className="font-semibold text-gray-600">{t.milestone || 'Milestone'}:</span> {invoice.freelance.milestoneDescription}</p>}
                </div>
            </section>
        );
    }
    
    return null;
};

// Template 1: Tech Corporate (Based on user image)
export const ITTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}pt`, minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start pb-5 mb-5">
                <div className="flex items-center gap-4">
                    {business.logoUrl ? 
                        <Image src={business.logoUrl} alt="Logo" width={50} height={50} className="object-contain" /> :
                        <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                    }
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500">{business.address} • {business.phone}</p>
                        <p className="text-xs text-blue-600">{business.email}</p>
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
                    <span className="text-gray-600">{t.contactPerson || 'CONTACT PERSON'}:</span><span className="font-semibold">{client.name}</span>
                    <span className="text-gray-600">{t.date || 'DATE'}:</span><span className="font-semibold">{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</span>
                    <span className="text-gray-600">{t.dueDate || 'DUE DATE'}:</span><span className="font-semibold">{safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</span>
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />

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
                            <p><span className="text-gray-600 w-20 inline-block">{t.address || 'ADDRESS'}:</span> <span className="font-semibold">{client.address}</span></p>
                            <p><span className="text-gray-600 w-20 inline-block">{t.contact || 'CONTACT'}:</span> <span className="font-semibold">{client.phone}</span></p>
                            <p><span className="text-gray-600 w-20 inline-block">{t.email || 'EMAIL'}:</span> <span className="font-semibold">{client.email}</span></p>
                        </div>
                    </div>
                     <div className="text-right">
                        <SignatureDisplay signature={business.ownerSignature} label={business.name} />
                         <p className="text-lg font-bold mt-4" style={{fontFamily: 'cursive'}}>{t.thankYou || 'Thank you!'}</p>
                         <p className="text-[8px] text-gray-500 mt-2 max-w-[250px]">{t.thankYouMessage || 'Thank you for considering our services. We look forward to working with you.'}</p>
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
        <div className={`p-10 font-['Roboto_Mono',_monospace] flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-4xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs">{t.softwareAndITSolutions || 'Software & IT Solutions'}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light">{docTitle}</h2>
                    <p className="text-sm">{invoice.category}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div><p className="font-bold text-muted-foreground mb-1">{(t.projectFor || 'PROJECT FOR').toUpperCase()}:</p><p className="font-medium">{client.name}</p><p>{client.address}</p></div>
                <div className="text-right"><p className="font-bold text-muted-foreground mb-1">{(t.date || 'DATE').toUpperCase()}:</p><p>{safeFormat(invoice.invoiceDate, 'MM-dd-yyyy')}</p></div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b" style={{borderColor: props.textColor ? props.textColor + '40' : 'rgba(255,255,255,0.4)'}}>
                            <th className="py-2 font-semibold w-1/2 text-muted-foreground">{(t.service || 'SERVICE').toUpperCase()}</th>
                            <th className="py-2 font-semibold text-center text-muted-foreground">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="py-2 font-semibold text-right text-muted-foreground">{(t.rate || 'RATE').toUpperCase()}</th>
                            <th className="py-2 font-semibold text-right text-muted-foreground">{(t.total || 'TOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b" style={{borderColor: props.textColor ? props.textColor + '20' : 'rgba(255,255,255,0.2)'}}>
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
                            <div className="flex justify-between"><span className="text-muted-foreground">{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">{t.tax || 'Tax'} ({invoice.summary.taxPercentage}%):</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t" style={{borderColor: props.textColor}}><span>{t.total || 'Total'}:</span><span style={{ color: accentColor }}>{currencySymbol}{total.toFixed(2)}</span></div>
                            {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between font-bold text-green-400"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                            <div className="flex justify-between font-bold p-1 rounded mt-1" style={{backgroundColor: `${accentColor}20`}}><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Minimalist Grid
export const ITTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-12 bg-white font-['Inter',_sans-serif] text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                 <div className="text-right">
                    <h2 className="text-2xl font-extrabold tracking-tighter">{docTitle}</h2>
                    <p className="text-sm">{invoice.category}</p>
                </div>
            </header>

            <section className="grid grid-cols-4 gap-4 mb-10 text-xs">
                <div><p className="font-bold text-gray-500 mb-1">{t.to || 'To'}</p><p>{client.name}</p></div>
                <div><p className="font-bold text-gray-500 mb-1">{t.invoiceNo || 'Invoice #'}</p><p>{invoice.invoiceNumber}</p></div>
                <div><p className="font-bold text-gray-500 mb-1">{t.date || 'Date'}</p><p>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
                <div><p className="font-bold text-gray-500 mb-1">{t.dueDate || 'Due Date'}</p><p>{safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p></div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t}/>

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
                                <tr><td className="py-1 text-gray-500">{t.subtotal || 'Subtotal'}</td><td className="py-1 text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                <tr><td className="py-1 text-gray-500 border-b">{t.tax || 'Tax'}</td><td className="py-1 text-right border-b">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base"><td className="pt-2">{(t.total || 'TOTAL').toUpperCase()}</td><td className="pt-2 text-right">{currencySymbol}{total.toFixed(2)}</td></tr>
                                {(invoice.amountPaid || 0) > 0 && <tr className="font-bold text-green-600"><td>{t.amountPaid || 'Amount Paid'}</td><td className="text-right">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td></tr>}
                                <tr className="font-bold bg-gray-100"><td className="p-1">{t.balanceDue || 'Balance Due'}</td><td className="p-1 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 4: Creative Blue
export const ITTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`font-sans flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <div className="w-1/3 p-8 text-white flex flex-col" style={{ backgroundColor: accentColor }}>
                <h1 className="text-4xl font-bold mb-10">{docTitle}</h1>
                <div className="text-sm space-y-6 flex-grow">
                    <div>
                        <p className="font-bold opacity-80 mb-1">{(t.client || 'CLIENT').toUpperCase()}</p>
                        <p className="font-bold text-lg">{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">{(t.details || 'DETAILS').toUpperCase()}</p>
                        <p>#{invoice.invoiceNumber}</p>
                        <p>{t.date || 'Date'}: {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                        <p>{t.dueDate || 'Due'}: {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                        {invoice.poNumber && <p>PO: {invoice.poNumber}</p>}
                    </div>
                </div>
                 {pageIndex === totalPages - 1 && (
                    <div className="mt-auto text-sm">
                         <p className="font-bold opacity-80 mb-2">{(t.totalInvoice || 'TOTAL INVOICE').toUpperCase()}</p>
                         <p className="text-4xl font-extrabold">{currencySymbol}{total.toFixed(2)}</p>
                    </div>
                )}
            </div>
            <div className="w-2/3 p-10 flex flex-col" style={{color: textColor}}>
                <header className="mb-8 text-right">
                    <h2 className="text-3xl font-bold">{business.name}</h2>
                    <div className="text-xs text-gray-500">
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                    </div>
                </header>
                 <CategorySpecificDetails invoice={invoice} t={t} />
                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b-2 border-gray-300">
                            <tr>
                                <th className="py-2 font-bold w-1/2">{(t.serviceItem || 'SERVICE / ITEM').toUpperCase()}</th>
                                <th className="py-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="py-2 align-top"><p className="font-semibold whitespace-pre-line">{item.name}</p>{item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}</td>
                                    <td className="py-2 align-top text-center">{item.quantity}</td>
                                    <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="py-2 align-top text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                 {pageIndex === totalPages - 1 && (
                     <p className="mt-auto text-center text-xs text-gray-400">{t.thankYouForBusiness || 'Thank you for your business!'}</p>
                 )}
            </div>
        </div>
    );
};

// Template 5: Startup Vibe
export const ITTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-gray-50 font-['Inter',_sans-serif] text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tighter">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                 <div className="text-right">
                    <p className="text-2xl font-extrabold tracking-tighter text-gray-400">{docTitle}</p>
                    <p className="text-sm">{invoice.category}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 text-xs mb-8">
                <div>
                    <p className="text-gray-500">{t.to || 'To'}:</p>
                    <p className="font-bold">{client.name}</p>
                    <p className="text-gray-600">{client.address}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-500">{t.invoice || 'Invoice'} <span className="font-mono text-black">#{invoice.invoiceNumber}</span></p>
                    <p className="text-gray-500">{t.date || 'Date'}: <span className="font-mono text-black">{safeFormat(invoice.invoiceDate, 'dd.MM.yyyy')}</span></p>
                     <p className="text-gray-500">{t.dueDate || 'Due Date'}: <span className="font-mono text-black">{safeFormat(invoice.dueDate, 'dd.MM.yyyy')}</span></p>
                     {invoice.poNumber && <p className="text-gray-500">PO #: <span className="font-mono text-black">{invoice.poNumber}</span></p>}
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t}/>

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
                                <td className="py-2 align-top"><p className="font-semibold whitespace-pre-line">{item.name}</p>{item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}</td>
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
                        <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span className="font-mono">{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>{t.tax || 'Tax'}</span><span className="font-mono">{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black">
                            <span>{t.totalDue || 'Total Due'}</span>
                            <span className="font-mono">{currencySymbol}{total.toFixed(2)}</span>
                        </p>
                         {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between font-bold text-green-600"><span>{t.amountPaid || 'Amount Paid'}</span><span className="font-mono">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                         <p className="flex justify-between font-bold text-lg p-1 bg-gray-200"><span>{t.balanceDue || 'Balance Due'}</span><span className="font-mono">{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};
