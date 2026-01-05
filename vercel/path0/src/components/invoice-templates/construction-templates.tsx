
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

const ConstructionDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.construction) return null;
    const { construction } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.constructionDetails || 'Construction Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.jobSite || 'Job Site'}:</span> {construction.jobSiteAddress}</p>
                <p><span className="font-semibold text-gray-600">{t.permitNumber || 'Permit #'}:</span> {construction.permitNumber}</p>
                {construction.laborRate && <p><span className="font-semibold text-gray-600">{t.laborRate || 'Labor Rate'}:</span> ${construction.laborRate}/hr</p>}
                {construction.equipmentRentalFees && <p><span className="font-semibold text-gray-600">{t.equipmentFees || 'Equipment Fees'}:</span> ${construction.equipmentRentalFees}</p>}
                {construction.wasteDisposalFee && <p><span className="font-semibold text-gray-600">{t.disposalFee || 'Disposal Fee'}:</span> ${construction.wasteDisposalFee}</p>}
                {construction.projectStartDate && <p><span className="font-semibold text-gray-600">{t.startDate || 'Start Date'}:</span> {safeFormat(construction.projectStartDate, 'MM/dd/yyyy')}</p>}
                {construction.projectEndDate && <p><span className="font-semibold text-gray-600">{t.endDate || 'End Date'}:</span> {safeFormat(construction.projectEndDate, 'MM/dd/yyyy')}</p>}
            </div>
        </section>
    );
};

export const ConstructionTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol } = props;
    const { business, client } = invoice;
    const totalLabor = pageItems.filter(i => (i.name || '').toLowerCase().includes('labor')).reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
    const totalMaterials = pageItems.filter(i => !(i.name || '').toLowerCase().includes('labor')).reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);

    return (
        <div className={`p-8 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                    <p className="text-xs">{business.phone}</p>
                    <p className="text-xs">{business.email}</p>
                    {business.website && <p className="text-xs">{business.website}</p>}
                    {business.licenseNumber && <p className="text-xs">Lic #: {business.licenseNumber}</p>}
                    {business.taxId && <p className="text-xs">Tax ID: {business.taxId}</p>}
                </div>
                <h2 className="text-3xl font-bold text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
            </header>
            
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold">{(t.client || 'Client')}</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    {client.projectLocation && <p className="mt-2"><span className="font-bold">Project Location:</span><br/>{client.projectLocation}</p>}
                </div>
                <div className="bg-gray-100 p-2 rounded">
                    <p className="grid grid-cols-2"><span className="font-bold">{(t.invoiceDate || 'Date of Invoice')}:</span> <span>{safeFormat(invoice.invoiceDate, 'MM-dd-yyyy')}</span></p>
                    <p className="grid grid-cols-2"><span className="font-bold">{(t.invoiceNo || 'Invoice No')}:</span> <span>{invoice.invoiceNumber}</span></p>
                    {invoice.construction?.projectStartDate && <p className="grid grid-cols-2"><span className="font-bold">{(t.workStartDate || 'Work Start Date')}:</span> <span>{safeFormat(invoice.construction.projectStartDate, 'MM-dd-yyyy')}</span></p>}
                    {invoice.construction?.projectEndDate && <p className="grid grid-cols-2"><span className="font-bold">{(t.workEndDate || 'Work End Date')}:</span> <span>{safeFormat(invoice.construction.projectEndDate, 'MM-dd-yyyy')}</span></p>}
                    <p className="grid grid-cols-2"><span className="font-bold">{(t.dueDate || 'Due Date')}:</span> <span>{safeFormat(invoice.dueDate, 'MM-dd-yyyy')}</span></p>
                    {invoice.poNumber && <p className="grid grid-cols-2"><span className="font-bold">PO Number:</span> <span>{invoice.poNumber}</span></p>}
                </div>
            </section>
            
            <ConstructionDetails invoice={invoice} t={t}/>
            
            <main className="grid grid-cols-2 gap-8 flex-grow">
                 {/* Materials Table */}
                <div className="space-y-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-200"><th className="p-1 font-bold w-1/4">{(t.quantity || 'QTY').toUpperCase()}</th><th className="p-1 font-bold w-1/2">{(t.material || 'MATERIAL').toUpperCase()}</th><th className="p-1 font-bold text-right w-1/4">{(t.total || 'TOTAL').toUpperCase()}</th></tr></thead>
                        <tbody>
                            {pageItems.filter(i => !(i.name || '').toLowerCase().includes('labor')).map(item => (
                                <tr key={item.id} className="border-b"><td className="p-1">{item.quantity}</td><td className="p-1">{item.name}</td><td className="p-1 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>
                            ))}
                        </tbody>
                        <tfoot><tr><td colSpan={2} className="p-1 text-right font-bold">{(t.totalMaterials || 'TOTAL MATERIALS').toUpperCase()}</td><td className="p-1 text-right font-bold">{currencySymbol}{totalMaterials.toFixed(2)}</td></tr></tfoot>
                    </table>
                </div>

                {/* Labor & Totals Table */}
                <div className="space-y-4">
                     <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-200"><th className="p-1 font-bold w-1/2">{(t.labor || 'LABOR').toUpperCase()}</th><th className="p-1 font-bold text-right w-1/4">{(t.hours || 'HRS').toUpperCase()}</th><th className="p-1 font-bold text-right w-1/4">{(t.amount || 'AMOUNT').toUpperCase()}</th></tr></thead>
                        <tbody>
                            {pageItems.filter(i => (i.name || '').toLowerCase().includes('labor')).map(item => (
                                <tr key={item.id} className="border-b"><td className="p-1">{item.name}</td><td className="p-1 text-right">{item.quantity}</td><td className="p-1 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>
                            ))}
                        </tbody>
                        <tfoot><tr><td colSpan={2} className="p-1 text-right font-bold">{(t.totalLabor || 'TOTAL LABOR').toUpperCase()}</td><td className="p-1 text-right font-bold">{currencySymbol}{totalLabor.toFixed(2)}</td></tr></tfoot>
                    </table>
                     {pageIndex === totalPages - 1 && (
                         <div className="flex justify-end">
                            <div className="w-full text-xs space-y-1">
                                <p className="grid grid-cols-2"><span className="font-bold">{(t.subtotal || 'SUBTOTAL').toUpperCase()}:</span> <span className="text-right">{currencySymbol}{subtotal.toFixed(2)}</span></p>
                                {discountAmount > 0 && <p className="grid grid-cols-2"><span className="font-bold">{(t.discount || 'DISCOUNT').toUpperCase()}:</span> <span className="text-right">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                                {invoice.summary.shippingCost > 0 && <p className="grid grid-cols-2"><span className="font-bold">{(t.shipping || 'SHIPPING').toUpperCase()}:</span> <span className="text-right">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                                <p className="grid grid-cols-2"><span className="font-bold">{(t.tax || 'TAX').toUpperCase()} ({invoice.summary.taxPercentage}%):</span> <span className="text-right">{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                                <p className="grid grid-cols-2 bg-gray-200 p-1 font-bold text-sm"><span className="">{(t.grandTotal || 'GRAND TOTAL').toUpperCase()}:</span> <span className="text-right">{currencySymbol}{total.toFixed(2)}</span></p>
                                {(invoice.amountPaid || 0) > 0 && <p className="grid grid-cols-2 text-green-600"><span className="font-bold">{(t.amountPaid || 'AMOUNT PAID').toUpperCase()}:</span> <span className="text-right">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                                <p className="grid grid-cols-2 bg-gray-300 p-1 font-bold text-sm"><span className="">{(t.balanceDue || 'BALANCE DUE').toUpperCase()}:</span> <span className="text-right">{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                            </div>
                        </div>
                     )}
                </div>
            </main>
            {pageIndex === totalPages - 1 && (
                <footer className="mt-8 text-xs pt-4 border-t">
                    <p><span className="font-bold">{(t.paymentTerms || 'Payment Terms')}:</span> {invoice.paymentInstructions}</p>
                    <div className="flex justify-between mt-8">
                       {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />}
                       {invoice.clientSignature && <SignatureDisplay signature={invoice.clientSignature} label="Client Signature" />}
                   </div>
                </footer>
            )}
        </div>
    );
}

// Template 2: Modern Dark Header
export const ConstructionTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, textColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-0 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="p-10 text-white flex justify-between items-start" style={{ backgroundColor: '#1F2937' }}>
                <div>
                     {business.logoUrl ? (
                        <Image src={business.logoUrl} alt="Logo" width={120} height={50} className="filter invert brightness-0"/>
                    ) : (
                        <h1 className="text-4xl font-bold">{business.name}</h1>
                    )}
                    <p className="text-xs whitespace-pre-line mt-2 text-gray-300">{business.address}<br/>{business.phone}<br/>{business.email}<br/>{business.website}</p>
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
                        {client.projectLocation && <p className="mt-2"><span className="font-bold text-gray-500">Project Location:</span><br/>{client.projectLocation}</p>}
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-500 mb-1" style={{color: textColor ? textColor : undefined}}>{(t.invoiceDetails || 'INVOICE DETAILS')}</p>
                        <p># {invoice.invoiceNumber}</p>
                        <p>{safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                        <p>Due: {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                        {invoice.poNumber && <p>PO: {invoice.poNumber}</p>}
                    </div>
                </section>

                <ConstructionDetails invoice={invoice} t={t} />
                
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
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, textColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-12">
                 <div>
                    <h1 className="text-4xl font-light tracking-wide">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}<br/>{business.phone}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{(t.invoice || 'Invoice')}</h2>
                </div>
            </header>

            <section className="mb-8 p-4 border rounded-md grid grid-cols-3 gap-4 text-xs">
                <div><p className="font-bold">{(t.from || 'From')}:</p><p>{business.name}<br/>{business.address}</p></div>
                <div><p className="font-bold">{(t.to || 'To')}:</p><p>{client.name}<br/>{client.companyName && `${client.companyName}<br/>`}{client.address}<br/>{client.phone}<br/>{client.email}</p></div>
                <div><p className="font-bold">{(t.details || 'Details')}:</p><p># {invoice.invoiceNumber}<br/>{(t.date || 'Date')}: {safeFormat(invoice.invoiceDate, 'MM-dd-yyyy')}<br/>Due: {safeFormat(invoice.dueDate, 'MM-dd-yyyy')}<br/>PO: {invoice.poNumber}</p></div>
            </section>
            
             <ConstructionDetails invoice={invoice} t={t} />

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
                     <div className="w-1/2 text-xs">
                         <p className="font-bold mb-1">{(t.termsAndConditions || 'TERMS')}</p>
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
                         <p className="py-1 flex justify-between font-bold"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                         {(invoice.amountPaid || 0) > 0 && <p className="py-1 flex justify-between text-green-600"><span>Amount Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                         <p className="py-2 mt-2 flex justify-between border-t-2 border-black font-bold text-base"><span>{(t.balanceDue || 'BALANCE DUE')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                     </div>
                 </footer>
            )}
        </div>
    );
};

export const ConstructionTemplate4: React.FC<PageProps> = (props) => <ConstructionTemplate1 {...props} />;
export const ConstructionTemplate5: React.FC<PageProps> = (props) => <ConstructionTemplate2 {...props} />;
export const ConstructionTemplate6: React.FC<PageProps> = (props) => <ConstructionTemplate3 {...props} />;
