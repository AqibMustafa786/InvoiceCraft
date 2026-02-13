
'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import NextImage from 'next/image';
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
            <NextImage src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-muted-foreground pt-1 border-t-2 border-current w-[150px]">{label}</p>
        </div>
    )
}

export const AutoRepairDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.autoRepair) return null;
    const { autoRepair } = invoice;
    const hasDetails = Object.values(autoRepair).some(val => val !== null && val !== '');

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-muted-foreground mb-2 border-b">{t.vehicleInformation || 'Vehicle Information'}</p>
             {hasDetails && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                    {autoRepair.vehicleMake && <p><span className="font-semibold">{t.vehicle || 'Vehicle'}:</span> {autoRepair.vehicleMake} {autoRepair.vehicleModel} ({autoRepair.year})</p>}
                    {autoRepair.odometer && <p><span className="font-semibold">{(t.mileage || 'Mileage')}:</span> {autoRepair.odometer.toLocaleString()}</p>}
                    {autoRepair.vin && <p className="col-span-full"><span className="font-semibold">VIN:</span> {autoRepair.vin}</p>}
                    {autoRepair.licensePlate && <p><span className="font-semibold">{(t.licensePlate || 'Plate')}:</span> {autoRepair.licensePlate}</p>}
                    {autoRepair.laborHours && <p><span className="font-semibold">{(t.laborHours || 'Labor Hours')}:</span> {autoRepair.laborHours}</p>}
                    {autoRepair.laborRate && <p><span className="font-semibold">{(t.laborRate || 'Labor Rate')}:</span> ${autoRepair.laborRate.toFixed(2)}/hr</p>}
                    {autoRepair.diagnosticFee && <p><span className="font-semibold">{(t.diagnosticFee || 'Diagnostic Fee')}:</span> ${autoRepair.diagnosticFee.toFixed(2)}</p>}
                    {autoRepair.shopSupplyFee && <p><span className="font-semibold">{(t.shopSupplyFee || 'Shop Supply Fee')}:</span> ${autoRepair.shopSupplyFee.toFixed(2)}</p>}
                    {autoRepair.towingFee && <p><span className="font-semibold">{(t.towingFee || 'Towing Fee')}:</span> ${autoRepair.towingFee.toFixed(2)}</p>}
                </div>
             )}
        </section>
    );
};

// Template 1: Mechanic
export const AutoRepairTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '9pt', minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="p-10 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold" style={{ color: accentColor }}>{docTitle}</h2>
                </div>
            </header>
            <div className="px-10 pb-10 flex-grow flex flex-col" style={{color: textColor}}>
                <section className="grid grid-cols-2 gap-4 mb-6 text-xs pb-4 border-b border-gray-200">
                    <div>
                        <p className="p-1 text-sm font-bold rounded" style={{ backgroundColor: `${accentColor}40`}}>{t.customerInformation || 'Customer Information'}</p>
                        <p className="mt-2"><span className="font-bold w-20 inline-block">{t.name || 'Name'}:</span> {client.name}</p>
                        <p><span className="font-bold w-20 inline-block">{t.address || 'Address'}:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                        <p><span className="font-bold w-20 inline-block">{t.phone || 'Phone'}:</span> {client.phone}</p>
                        <p><span className="font-bold w-20 inline-block">{t.email || 'Email'}:</span> {client.email}</p>
                    </div>
                    <div>
                       <p className="p-1 text-sm font-bold rounded" style={{ backgroundColor: `${accentColor}40`}}>{t.invoiceDetails || 'Invoice Details'}</p>
                        <p className="mt-2"><span className="font-bold w-20 inline-block">{t.invoiceNo || 'Invoice #'}:</span> {invoice.invoiceNumber}</p>
                        <p><span className="font-bold w-20 inline-block">{t.date || 'Date'}:</span> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                        <p><span className="font-bold w-20 inline-block">{t.dueDate || 'Due Date'}:</span> {safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p>
                    </div>
                </section>
                
                <CategorySpecificDetails invoice={invoice} t={t} />

                <main className="flex-grow">
                     <p className="p-1 mb-2 text-sm font-bold rounded" style={{ backgroundColor: `${accentColor}40`}}>{t.repairDetails || 'Repair Details'}</p>
                     <table className="w-full text-left text-xs">
                        <thead className="border-y border-gray-400">
                            <tr>
                                <th className="p-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                                <th className="p-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                                <th className="p-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th>
                                <th className="p-2 font-bold text-right">{(t.totalPrice || 'TOTAL PRICE').toUpperCase()}</th>
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
                                <tr><td colSpan={3} className="p-2 text-right">{t.subtotal || 'Subtotal'}</td><td className="p-2 text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                {discountAmount > 0 && <tr><td colSpan={3} className="p-2 text-right">{t.discount || 'Discount'}</td><td className="p-2 text-right text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</td></tr>}
                                {invoice.summary.shippingCost > 0 && <tr><td colSpan={3} className="p-2 text-right">{t.shipping || 'Shipping/Extra'}</td><td className="p-2 text-right">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</td></tr>}
                                <tr><td colSpan={3} className="p-2 text-right">{t.tax || 'Tax'} ({invoice.summary.taxPercentage}%)</td><td className="p-2 text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                <tr>
                                    <td colSpan={3} className="p-2 pt-2 text-right font-bold text-base">{(t.total || 'Total')}</td>
                                    <td className="p-2 pt-2 text-right font-bold text-base">{currencySymbol}{total.toFixed(2)}</td>
                                </tr>
                                {(invoice.amountPaid || 0) > 0 && <tr className="font-bold text-green-600"><td colSpan={3} className="p-2 text-right">Amount Paid</td><td className="p-2 text-right">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td></tr>}
                                <tr className="font-bold bg-gray-100"><td colSpan={3} className="p-2 text-right">Balance Due</td><td className="p-2 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                            </tfoot>
                         )}
                    </table>
                </main>
            
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8 text-xs">
                        <section className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <p className="font-bold mb-2">{(t.paymentInformation || 'Payment Information')}</p>
                                <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                            </div>
                        </section>
                        <div className="flex justify-between items-end border p-4 rounded-md">
                            <div>
                                <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 2: Night Shift
export const AutoRepairTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`font-sans flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Roboto, sans-serif', fontSize: '9.5pt', minHeight: '1056px', color: props.textColor, backgroundColor: props.backgroundColor }}>
            <header className="p-10 flex justify-between items-start" style={{backgroundColor: accentColor, color: 'white'}}>
                <div>
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <p className="text-xs text-gray-300">{business.address}</p>
                    <p className="text-xs text-gray-300">{business.phone} | {business.email}</p>
                    <p className="text-xs text-gray-300">{business.website}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold tracking-wider">{docTitle}</h2>
                </div>
            </header>
            <div className="p-10 pt-6 flex-grow flex flex-col">
                <section className="mb-6 pb-4 border-b grid grid-cols-2 gap-8 text-xs" style={{borderColor: props.textColor ? props.textColor + '30' : 'rgba(255,255,255,0.3)'}}>
                     <div>
                        <p className="font-bold text-muted-foreground mb-1">{(t.customer || 'CUSTOMER').toUpperCase()}</p>
                        <p className="font-medium">{client.name}</p>
                        <p>{client.address}</p>
                        <p>{client.phone} | {client.email}</p>
                    </div>
                    <div className="text-right">
                        <p><span className="font-bold text-muted-foreground">{t.invoiceNo || 'Invoice #'}: </span>{invoice.invoiceNumber}</p>
                        <p><span className="font-bold text-muted-foreground">{(t.date || 'DATE').toUpperCase()}: </span>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                        <p><span className="font-bold text-muted-foreground">{(t.dueDate || 'DUE DATE').toUpperCase()}: </span>{safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                        {invoice.poNumber && <p><span className="font-bold text-muted-foreground">PO #: </span>{invoice.poNumber}</p>}
                    </div>
                </section>
                
                <CategorySpecificDetails invoice={invoice} t={t} />

                <main className="flex-grow">
                     <table className="w-full text-left text-sm">
                        <thead className="text-muted-foreground">
                            <tr>
                                <th className="py-2 font-semibold w-1/2">{(t.service || 'SERVICE').toUpperCase()}</th>
                                <th className="py-2 font-semibold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                                <th className="py-2 font-semibold text-right">{(t.unitCost || 'UNIT COST').toUpperCase()}</th>
                                <th className="py-2 font-semibold text-right">{(t.subtotal || 'SUBTOTAL').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b" style={{borderColor: props.textColor ? props.textColor + '15' : 'rgba(255,255,255,0.15)'}}>
                                    <td className="py-2 align-top">
                                        <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                        {item.description && <p className="text-xs text-gray-400 whitespace-pre-line">{item.description}</p>}
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
                         <div className="flex justify-end mb-6">
                            <div className="w-2/5 text-sm space-y-2">
                                <div className="flex justify-between"><span className="text-muted-foreground">{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                                {discountAmount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">{t.discount || 'Discount'}:</span><span className="text-red-400">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                                {invoice.summary.shippingCost > 0 && <div className="flex justify-between"><span className="text-muted-foreground">{t.shipping || 'Shipping'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                                <div className="flex justify-between"><span className="text-muted-foreground">{(t.taxesAndFees || 'Taxes &amp; Fees')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2" style={{borderColor: props.textColor}}><span style={{color: accentColor}}>{(t.total || 'TOTAL')}:</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                                {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between font-bold text-green-400"><span>{t.amountPaid || 'Amount Paid'}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                                <div className="flex justify-between font-bold p-1 rounded mt-1" style={{backgroundColor: `${accentColor}20`}}><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-end text-xs">
                            <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};


// Template 3: Classic Garage
export const AutoRepairTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'Invoice');

    return (
        <div className={`p-12 font-['Garamond',_serif] flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{minHeight: '1056px', color: textColor, backgroundColor: props.backgroundColor }}>
            <header className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-light tracking-wider mb-1">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                    <p className="text-xs">{business.phone}</p>
                    <p className="text-xs">{business.email}</p>
                    <p className="text-xs">{business.website}</p>
                    <p className="text-xs">{business.licenseNumber}</p>
                    <p className="text-xs">{business.taxId}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light tracking-wider" style={{color: accentColor}}>{docTitle.toUpperCase()}</h2>
                </div>
            </header>

            <section className="flex justify-between mb-10 text-xs">
                 <div>
                    <p className="font-bold mb-1">{(t.preparedFor || 'Prepared For')}:</p>
                    <p>{client.name}</p>
                    <p>{client.companyName}</p>
                    <p>{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                </div>
                 <div className="text-right">
                    <p><span className="font-bold">{t.invoiceNo || 'Invoice #'}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{(t.date || 'Date')}:</span> {safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p>
                    <p><span className="font-bold">{(t.dueDate || 'Due Date')}:</span> {safeFormat(invoice.dueDate, 'MMM dd, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>
            
             <CategorySpecificDetails invoice={invoice} t={t} />
            
            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-semibold w-2/5 border-b-2" style={{borderColor: accentColor}}>{(t.item || 'ITEM').toUpperCase()}</th>
                            <th className="p-2 font-semibold w-2/5 border-b-2" style={{borderColor: accentColor}}>{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 font-semibold text-center border-b-2" style={{borderColor: accentColor}}>{(t.quantity || 'QUANTITY').toUpperCase()}</th>
                            <th className="p-2 font-semibold text-right border-b-2" style={{borderColor: accentColor}}>{(t.price || 'PRICE').toUpperCase()}</th>
                            <th className="p-2 font-semibold text-right border-b-2" style={{borderColor: accentColor}}>{(t.amount || 'AMOUNT').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="p-2 border-b border-gray-200 whitespace-pre-line">{item.name}</td>
                                <td className="p-2 border-b border-gray-200 whitespace-pre-line">{item.description}</td>
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
                                <tr><td className="py-1 text-muted-foreground">{t.subtotal || 'Subtotal'}</td><td className="text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                {discountAmount > 0 && <tr><td className="py-1 text-muted-foreground">{t.discount || 'Discount'}</td><td className="text-right text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</td></tr>}
                                {invoice.summary.shippingCost > 0 && <tr><td className="py-1 text-muted-foreground">{t.shipping || 'Shipping/Extra'}</td><td className="text-right">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</td></tr>}
                                <tr><td className="py-1 text-muted-foreground">{(t.salesTax || 'Sales Tax')}</td><td className="text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base border-t-2 border-black"><td className="pt-2">{(t.total || 'TOTAL').toUpperCase()}</td><td className="pt-2 text-right">{currencySymbol}{total.toFixed(2)}</td></tr>
                                {(invoice.amountPaid || 0) > 0 && <tr className="font-bold text-green-600"><td>{t.amountPaid || 'Amount Paid'}</td><td className="text-right">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td></tr>}
                                <tr className="font-bold bg-gray-100"><td className="p-1">{t.balanceDue || 'Balance Due'}</td><td className="p-1 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                     <div className="text-xs mt-8">
                        <p className="font-bold">{t.termsAndConditions || 'Terms & Conditions'}:</p>
                        <p className="text-muted-foreground whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: Pro Service
export const AutoRepairTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', color: textColor, backgroundColor: props.backgroundColor }}>
            <header className="flex justify-between items-center mb-8 pb-4 border-b-4" style={{borderColor: accentColor}}>
                <div>
                    <p className="font-bold text-3xl">{business.name}</p>
                    <div className="text-xs text-muted-foreground">
                        <p>{business.address}</p>
                        <p>{business.website}</p>
                        <p>Lic #: {business.licenseNumber}</p>
                        <p>Tax ID: {business.taxId}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-2xl font-extrabold" style={{color: accentColor}}>{docTitle}</h1>
                </div>
            </header>
            
            <section className="mb-8 grid grid-cols-2 gap-4 text-xs">
                 <div>
                    <p className="font-bold">{t.clientInfo || 'Client Information'}:</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p>{client.address}</p>
                    <p>{client.phone} | {client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                </div>
                 <div className="text-right">
                    <p><span className="font-bold text-muted-foreground">{t.invoiceNo || 'Invoice #'}: </span>{invoice.invoiceNumber}</p>
                    <p><span className="font-bold text-muted-foreground">{(t.date || 'DATE').toUpperCase()}: </span>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                    <p><span className="font-bold text-muted-foreground">{(t.dueDate || 'DUE DATE').toUpperCase()}: </span>{safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                     {invoice.poNumber && <p><span className="font-bold text-muted-foreground">PO #: </span>{invoice.poNumber}</p>}
                 </div>
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 font-bold w-[60%]">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.price || 'PRICE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 align-top"><p className="font-semibold whitespace-pre-line">{item.name}</p>{item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}</td>
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
                                <tr><td className="py-1 text-muted-foreground">{t.subtotal || 'Subtotal'}</td><td className="py-1 text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                {discountAmount > 0 && (<tr><td className="py-1 text-muted-foreground">{t.discount || 'Discount'}</td><td className="py-1 text-right text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</td></tr>)}
                                {invoice.summary.shippingCost > 0 && (<tr><td className="py-1 text-muted-foreground">{t.shipping || 'Shipping'}</td><td className="py-1 text-right">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</td></tr>)}
                                {taxAmount > 0 && <tr><td className="py-1 text-muted-foreground">{t.tax || 'Taxes'}</td><td className="py-1 text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>}
                                <tr className="font-bold text-base border-t-2 border-black"><td className="py-2">{t.total || 'Total'}</td><td className="py-2 text-right">{currencySymbol}{total.toFixed(2)}</td></tr>
                                {(invoice.amountPaid || 0) > 0 && <tr className="font-bold text-green-600"><td>{t.amountPaid || 'Amount Paid'}</td><td className="text-right">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td></tr>}
                                <tr className="font-bold bg-gray-100"><td className="p-1">{t.balanceDue || 'Balance Due'}</td><td className="p-1 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-4">
                       <SignatureDisplay signature={business.ownerSignature} label={(t.authorizedSignature || 'Authorized Signature')} style={{alignItems: 'flex-end', textAlign: 'right'}} />
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 5: Gridline
export const AutoRepairTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = 'Invoice';

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto',_sans-serif] text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="grid grid-cols-2 gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold">{business.name}</h1>
                    <div className="text-xs mt-1">
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                        {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                </div>
                 <div className="text-right">
                     <p className="text-3xl font-bold">{docTitle.toUpperCase()}</p>
                     <p className="text-sm">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <section className="mb-8 p-4 bg-white shadow-sm rounded-md text-xs">
                 <p className="font-bold text-gray-500 mb-2">BILLED TO: {client.name}</p>
                 <p className="font-semibold">{client.address}</p>
                 <p>{client.phone} | {client.email}</p>
                 {client.companyName && <p>{client.companyName}</p>}
                 {client.shippingAddress && <p className="mt-2"><span className="font-bold text-gray-500">SHIP TO:</span> {client.shippingAddress}</p>}
            </section>
            
            <section className="mb-4 text-xs grid grid-cols-3 gap-2">
                <p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                <p><strong>Due Date:</strong> {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                {invoice.poNumber && <p><strong>PO #:</strong> {invoice.poNumber}</p>}
            </section>
            
            <CategorySpecificDetails invoice={invoice} t={t} />

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
                                <td className="py-2 align-top">
                                    <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>}
                                </td>
                                <td className="py-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8 flex justify-between items-end">
                    <div className="text-xs w-1/2">
                        <p className="font-bold">Terms & Conditions:</p>
                        <p className="text-gray-500 whitespace-pre-line">{invoice.paymentInstructions}</p>
                         <SignatureDisplay signature={business.ownerSignature} label="Owner Signature" />
                    </div>
                    <div className="w-1/3 text-sm space-y-1">
                        <p className="flex justify-between"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between"><span>Discount</span><span className="text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>Shipping/Extra</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between p-2 mt-2 border-t-2 border-black font-bold text-lg"><span>Total</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between p-2 text-green-600 font-bold"><span>Amount Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                         <p className="flex justify-between bg-gray-200 p-2 font-bold text-lg"><span>Balance Due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

    