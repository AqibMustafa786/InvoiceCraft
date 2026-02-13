
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
            <p className="text-xs text-gray-500 pt-1 border-t-2 border-gray-700 w-[150px]">{label}</p>
        </div>
    )
}

export const ConstructionDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.construction) return null;
    const { construction } = invoice;
    const hasDetails = Object.values(construction).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.constructionDetails || 'Construction Details'}</p>
            </section>
        );
    }

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.constructionDetails || 'Construction Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {construction.jobSiteAddress && <p><span className="font-semibold text-gray-600">{t.jobSite || 'Job Site'}:</span> {construction.jobSiteAddress}</p>}
                {construction.permitNumber && <p><span className="font-semibold text-gray-600">{t.permitNumber || 'Permit #'}:</span> {construction.permitNumber}</p>}
                {construction.laborRate && <p><span className="font-semibold text-gray-600">{t.laborRate || 'Labor Rate'}:</span> ${construction.laborRate}/hr</p>}
                {construction.equipmentRentalFees && <p><span className="font-semibold text-gray-600">{t.equipmentFees || 'Equipment Fees'}:</span> ${construction.equipmentRentalFees}</p>}
                {construction.wasteDisposalFee && <p><span className="font-semibold text-gray-600">{t.disposalFee || 'Disposal Fee'}:</span> ${construction.wasteDisposalFee}</p>}
                {construction.projectStartDate && <p><span className="font-semibold text-gray-600">{t.startDate || 'Start Date'}:</span> {safeFormat(construction.projectStartDate, 'MM/dd/yyyy')}</p>}
                {construction.projectEndDate && <p><span className="font-semibold text-gray-600">{t.endDate || 'End Date'}:</span> {safeFormat(construction.projectEndDate, 'MM/dd/yyyy')}</p>}
            </div>
        </section>
    );
};


// Template 1: Foundation (REBUILT)
export const ConstructionTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, accentColor, textColor, backgroundColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    
    return (
        <div className={`p-10 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}pt`, minHeight: '1056px', backgroundColor: backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    {business.logoUrl ? (
                        <Image src={business.logoUrl} alt="Logo" width={120} height={60} className="object-contain mb-2" />
                    ) : (
                        <h1 className="text-4xl font-extrabold">{business.name}</h1>
                    )}
                     <div className="text-xs space-y-0.5 mt-1" style={{ color: textColor ? `${textColor}B3` : 'rgba(55,65,81,0.7)' }}>
                        <p className="whitespace-pre-line">{business.address}</p>
                        {business.phone && <p>{t.phone || 'Phone'}: {business.phone}</p>}
                        {business.email && <p>{t.email || 'Email'}: {business.email}</p>}
                        {business.website && <p>{t.website || 'Website'}: {business.website}</p>}
                        {business.licenseNumber && <p>{t.license || 'Lic #'}: {business.licenseNumber}</p>}
                        {business.taxId && <p>{t.taxId || 'Tax ID'}: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold" style={{ color: accentColor }}>{docTitle}</h2>
                    <p className="text-sm mt-1"># {invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-4 text-xs">
                 <div>
                    <p className="font-bold uppercase text-gray-500" style={{color: textColor ? `${textColor}B3` : 'rgba(107,114,128,0.7)'}}>{t.billTo || 'BILL TO'}</p>
                    <p className="font-bold mt-1 text-base">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line mt-1">{client.address}</p>
                    {client.phone && <p>{client.phone}</p>}
                    {client.email && <p>{client.email}</p>}
                </div>
                <div>
                    <p className="font-bold uppercase text-gray-500" style={{color: textColor ? `${textColor}B3` : 'rgba(107,114,128,0.7)'}}>{t.shipTo || 'SHIP TO'}</p>
                    <p className="whitespace-pre-line mt-1">{client.shippingAddress || client.address}</p>
                </div>
                 <div className="text-left col-span-2">
                    <p><span className="font-bold text-gray-500" style={{color: textColor ? `${textColor}B3` : 'rgba(107,114,128,0.7)'}}>Date:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold text-gray-500" style={{color: textColor ? `${textColor}B3` : 'rgba(107,114,128,0.7)'}}>Due Date:</span> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold text-gray-500" style={{color: textColor ? `${textColor}B3` : 'rgba(107,114,128,0.7)'}}>PO Number:</span> {invoice.poNumber}</p>}
                </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />
            
            <main className="flex-grow">
                 <table className="w-full text-left text-sm">
                    <thead className="border-b" style={{ borderColor: accentColor }}>
                        <tr>
                            <th className="p-2 pb-1 font-bold w-1/2">{(t.description || 'DESCRIPTION')}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.quantity || 'QTY')}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.price || 'PRICE')}</th>
                            <th className="p-2 pb-1 font-bold text-right">{(t.total || 'TOTAL')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="p-2 align-top">
                                    <p className="font-medium whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line" style={{ wordBreak: 'break-all' }}>{item.description}</p>}
                                </td>
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
                            <div className="flex justify-between py-1"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                            {discountAmount > 0 && <div className="flex justify-between py-1 text-red-600"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                            {invoice.summary.shippingCost > 0 && <div className="flex justify-between py-1"><span>{(t.shipping || 'Shipping/Extra')}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                            <div className="flex justify-between py-1"><span>{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%):</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold py-2 mt-2 border-t-2 border-gray-800" style={{ color: accentColor }}><span className="text-lg">{(t.total || 'Total')}:</span><span className="text-lg">{currencySymbol}{total.toFixed(2)}</span></div>
                            {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between py-1 text-green-600 font-semibold"><span>{(t.amountPaid || 'Amount Paid')}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                             <div className="flex justify-between font-bold text-lg mt-1 p-2 bg-gray-100"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div className="mt-8 text-xs">
                        <p className="font-bold mb-1">{(t.termsAndConditions || 'Terms & Conditions')}</p>
                        <p className="whitespace-pre-line" style={{ color: textColor || '#6B7280' }}>{invoice.paymentInstructions}</p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <SignatureDisplay signature={business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} />
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 2: Modern Dark Header
export const ConstructionTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, textColor, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-0 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="p-10 text-white flex justify-between items-start" style={{ backgroundColor: accentColor }}>
                <div>
                     {business.logoUrl ? (
                        <Image src={business.logoUrl} alt="Logo" width={120} height={50} className="filter invert brightness-0"/>
                    ) : (
                        <h1 className="text-4xl font-bold">{business.name}</h1>
                    )}
                     <div className="text-xs space-y-0.5 mt-2" style={{ color: '#D1D5DB' }}>
                        <p className="whitespace-pre-line">{business.address}</p>
                        {business.phone && <p>{business.phone}</p>}
                        {business.email && <p>{business.email}</p>}
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>{t.license || 'Lic #'}: {business.licenseNumber}</p>}
                        {business.taxId && <p>{t.taxId || 'Tax ID'}: {business.taxId}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                </div>
            </header>

            <div className="p-10 flex-grow flex flex-col" style={{color: textColor}}>
                 <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
                    <div>
                        <p className="font-bold text-gray-500 mb-1" style={{color: textColor ? textColor : undefined}}>{(t.clientInformation || 'CLIENT INFORMATION')}</p>
                        <p className="font-bold">{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.phone}</p>
                        <p>{client.email}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold text-gray-500">Ship To:</span><br/>{client.shippingAddress}</p>}
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-500 mb-1" style={{color: textColor ? textColor : undefined}}>{(t.invoiceDetails || 'INVOICE DETAILS')}</p>
                        <p># {invoice.invoiceNumber}</p>
                        <p>{safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                        <p>Due: {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                        {invoice.poNumber && <p>PO: {invoice.poNumber}</p>}
                    </div>
                </section>
                
                <CategorySpecificDetails invoice={invoice} t={t} />

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-2 font-bold w-[50%]">{(t.item || 'ITEM').toUpperCase()}</th>
                                <th className="py-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-200">
                                     <td className="py-2 align-top">
                                        <p className="font-medium whitespace-pre-line">{item.name}</p>
                                        {item.description && <p className="text-xs text-gray-500 whitespace-pre-line" style={{ wordBreak: 'break-all' }}>{item.description}</p>}
                                    </td>
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
                        <div className="flex justify-between items-start">
                            <div className="w-1/2 text-xs">
                                <p className="font-bold text-gray-500 mb-2" style={{ color: textColor ? textColor : undefined }}>{(t.termsAndConditions || 'TERMS & CONDITIONS')}</p>
                                <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                                {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />}
                            </div>
                            <div className="w-2/5">
                                <div className="bg-gray-100 p-4 rounded-lg text-sm">
                                    <div className="flex justify-between py-1"><span>{(t.subtotal || 'Subtotal')}:</span><span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                                    {discountAmount > 0 && <div className="flex justify-between py-1 text-red-600"><span>{(t.discount || 'Discount')}:</span><span className="font-medium">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                                    {invoice.summary.shippingCost > 0 && <div className="flex justify-between py-1"><span>{(t.shipping || 'Shipping/Extra')}:</span><span className="font-medium">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                                    <div className="flex justify-between py-1"><span>{(t.tax || 'Tax')} ({invoice.summary.taxPercentage}%):</span><span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                                    <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t-2 border-gray-300"><span>{(t.grandTotal || 'Grand Total')}:</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                                    {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between py-1 text-green-600"><span>{(t.amountPaid || 'Amount Paid')}:</span><span className="font-medium">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-gray-400"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                                </div>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 3: Minimalist & Clean
export const ConstructionTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, textColor, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-12">
                 <div>
                    <h1 className="text-4xl font-light tracking-wide">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}<br/>{business.phone}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{(t.invoice || 'Invoice').toUpperCase()}</h2>
                </div>
            </header>

            <section className="mb-8 p-4 border rounded-md grid grid-cols-3 gap-4 text-xs">
                <div><p className="font-bold">{(t.from || 'From')}:</p><p className="font-bold">{business.name}<br/>{business.address}</p></div>
                <div><p className="font-bold">{(t.to || 'To')}:</p><p>{client.name}<br/>{client.companyName && `${client.companyName}<br/>`}{client.address}<br/>{client.phone}<br/>{client.email}</p></div>
                <div><p className="font-bold">{(t.details || 'Details')}:</p><p># {invoice.invoiceNumber}<br/>{(t.date || 'Date')}: {safeFormat(invoice.invoiceDate, 'MM-dd-yyyy')}<br/>Due: {safeFormat(invoice.dueDate, 'MM-dd-yyyy')}<br/>{invoice.poNumber && `PO: ${invoice.poNumber}`}</p></div>
            </section>
            
             <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                 <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 font-bold w-1/2">{(t.serviceDescription || 'SERVICE DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'QUANTITY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th>
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
                 <footer className="mt-auto pt-8 flex justify-between items-start">
                     <div className="w-1/2 text-xs" style={{color: textColor}}>
                        <p className="font-bold mb-1">{(t.terms || 'TERMS')}</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                         {business.ownerSignature && (
                            <div className="mt-8">
                                <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                            </div>
                        )}
                     </div>
                     <div className="w-1/3 text-right text-sm">
                         <p className="py-1 flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                         {discountAmount > 0 && <p className="py-1 flex justify-between text-red-500"><span>{(t.discount || 'Discount')}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                         {invoice.summary.shippingCost > 0 && <p className="py-1 flex justify-between"><span>{(t.shipping || 'Shipping')}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                         <p className="py-1 flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                         <p className="py-2 mt-2 flex justify-between border-t-2 border-black font-bold text-base"><span>{(t.total || 'TOTAL')}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                         {(invoice.amountPaid || 0) > 0 && <p className="py-1 flex justify-between font-bold text-green-600"><span>Amount Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                         <p className="py-2 mt-1 flex justify-between bg-gray-200 font-bold text-base"><span>{(t.balanceDue || 'BALANCE DUE')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                     </div>
                 </footer>
            )}
        </div>
    );
};

export const ConstructionTemplate4: React.FC<PageProps> = (props) => <ConstructionTemplate1 {...props} />;
export const ConstructionTemplate5: React.FC<PageProps> = (props) => <ConstructionTemplate2 {...props} />;
export const ConstructionTemplate6: React.FC<PageProps> = (props) => <ConstructionTemplate3 {...props} />;
