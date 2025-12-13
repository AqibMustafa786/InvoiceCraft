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

const RoofingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.roofing) return null;
    const { roofing } = invoice;
    return (
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 text-xs">
            <p><span className="text-gray-500">{(t.roofMaterial || 'Roof Material')}:</span> <span className="font-semibold">{roofing.roofType}</span></p>
            {roofing.squareFootage && <p><span className="text-gray-500">{(t.roofSizeSqFt || 'Roof Size (sq ft)')}:</span> <span className="font-semibold">{roofing.squareFootage}</span></p>}
            <p><span className="text-gray-500">{(t.roofPitch || 'Roof Pitch')}:</span> <span className="font-semibold">{roofing.pitch}</span></p>
            <p><span className="text-gray-500">{(t.layersToRemove || 'Layers to Remove')}:</span> <span className="font-semibold">{roofing.tearOffRequired ? 'Yes' : 'No'}</span></p>
            <p><span className="text-gray-500">{(t.underlayment || 'Underlayment')}:</span> <span className="font-semibold">{roofing.underlaymentType}</span></p>
            {roofing.dumpsterFee && <p><span className="text-gray-500">{(t.disposalFee || 'Disposal Fee')}:</span> <span className="font-semibold">${roofing.dumpsterFee.toFixed(2)}</span></p>}
        </div>
    );
};


// Template 1: Direct Interpretation of user image
export const RoofingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    
    return (
        <div className={`bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Lato, sans-serif', fontSize: `10pt`, minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="p-10 flex justify-between items-start">
                 <div>
                     {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="object-contain" />}
                     <h1 className="text-3xl font-bold mt-2">{business.name}</h1>
                     <p className="text-xs opacity-80">{t.roofingServices || 'Roofing Services'}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold tracking-wider">{docTitle}</h2>
                    <p className="text-xs text-gray-500">#{invoice.invoiceNumber}</p>
                </div>
            </header>

            <div className="p-10 pt-0 flex-grow flex flex-col">
                 <section className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-2 gap-8 text-xs">
                    <div>
                        <p className="font-bold text-gray-500 mb-2">{(t.companyInfo || 'Company Information').toUpperCase()}</p>
                        <p className="font-bold">{business.name}</p>
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>P: {business.phone}</p>
                        <p>E: {business.email}</p>
                        {business.website && <p>W: {business.website}</p>}
                        {business.licenseNumber && <p>Lic: {business.licenseNumber}</p>}
                        {business.taxId && <p>Tax ID: {business.taxId}</p>}
                    </div>
                    <div>
                        <p className="font-bold text-gray-500 mb-2">{(t.customerInformation || 'Customer Information').toUpperCase()}</p>
                        <p className="font-semibold">{client.name}</p>
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>E: {client.email}</p>
                        <p>P: {client.phone}</p>
                        {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                        {client.projectLocation && <p className="mt-2"><span className="font-bold">Project Location:</span><br/>{client.projectLocation}</p>}
                    </div>
                </section>
                
                 {invoice.roofing && (
                    <section className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-xs">
                        <p className="font-bold text-gray-500 mb-2">{t.projectDetails || 'Project Details'}</p>
                        <RoofingDetails invoice={invoice} t={t}/>
                    </section>
                )}
                
                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead style={{ backgroundColor: '#374151' }} className="text-white text-xs">
                            <tr>
                                <th className="p-2 font-bold w-1/2">DESCRIPTION</th>
                                <th className="p-2 font-bold text-center">QTY</th>
                                <th className="p-2 font-bold text-right">UNIT PRICE</th>
                                <th className="p-2 font-bold text-right">SUBTOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b bg-gray-50">
                                    <td className="p-2 align-top text-xs whitespace-pre-line">{item.name}</td>
                                    <td className="p-2 align-top text-center text-xs">{item.quantity}</td>
                                    <td className="p-2 align-top text-right text-xs">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="p-2 align-top text-right text-xs font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        {pageIndex === totalPages - 1 &&
                            <tfoot>
                                <tr><td colSpan={3} className="p-2 text-right">Subtotal</td><td className="p-2 text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                {discountAmount > 0 && <tr><td colSpan={3} className="p-2 text-right">Discount</td><td className="p-2 text-right text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</td></tr>}
                                {invoice.summary.shippingCost > 0 && <tr><td colSpan={3} className="p-2 text-right">Shipping/Extra</td><td className="p-2 text-right">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</td></tr>}
                                <tr><td colSpan={3} className="p-2 text-right">Tax ({invoice.summary.taxPercentage}%)</td><td className="p-2 text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base"><td colSpan={3} className="p-2 text-right">Total</td><td className="p-2 text-right">{currencySymbol}{total.toFixed(2)}</td></tr>
                                {(invoice.amountPaid || 0) > 0 && <tr className="text-green-600 font-bold">
                                    <td colSpan={3} className="p-2 text-right">Amount Paid</td>
                                    <td className="p-2 text-right">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</td>
                                </tr>}
                                <tr className="font-bold text-base bg-gray-200">
                                    <td colSpan={3} className="p-2 text-right">Balance Due</td>
                                    <td className="p-2 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        }
                    </table>
                </main>
            
                {pageIndex === totalPages - 1 && (
                    <footer className="pt-8 mt-auto">
                        <div className="flex justify-between items-end">
                            <div className="text-xs w-1/2">
                                <p className="font-bold text-gray-500 mb-2">Terms & Conditions</p>
                                <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-end mt-8">
                            {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label={"Owner Signature"} />}
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-8 pt-4 border-t">
                            <p>{business.email}</p>
                            <p>{business.phone}</p>
                            <p>{business.website}</p>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};


// Template 2: Light and Professional
export const RoofingTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                    {business.website && <p className="text-xs text-gray-500">{business.website}</p>}
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{docTitle}</h2>
                    <p className="text-xs text-gray-500">{business.licenseNumber && `Lic#: ${business.licenseNumber}`}</p>
                    <p className="text-xs text-gray-500">{business.taxId && `Tax ID: ${business.taxId}`}</p>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500 mb-1">Customer:</p>
                    <p className="font-semibold">{client.name}</p>
                    <p>{client.address}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    {client.projectLocation && <p className="mt-2"><span className="font-bold">Project Location:</span><br/>{client.projectLocation}</p>}
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Invoice #:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">Date:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold">Due Date:</span> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </section>

             {invoice.roofing && (
                <section className="mb-8 p-4 bg-gray-50 rounded-md text-xs">
                    <p className="font-bold text-gray-500 mb-2">Project Details</p>
                    <RoofingDetails invoice={invoice} t={t}/>
                </section>
            )}
            
            <main className="flex-grow">
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
                     <div className="text-xs mt-8">
                        <p className="font-bold text-gray-500 mb-2">Terms & Conditions</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label={"Owner Signature"} />}
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Blue-tinted Grid
export const RoofingTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={80} height={40} className="object-contain" />}
                    <h1 className="text-4xl font-extrabold mt-2" style={{color: accentColor}}>{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{docTitle}</h2>
                    <p className="text-xs text-gray-500">{business.licenseNumber && `Lic#: ${business.licenseNumber}`}</p>
                    <p className="text-xs text-gray-500">{business.taxId && `Tax ID: ${business.taxId}`}</p>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs p-4 bg-white rounded-lg shadow-sm">
                <div><p className="font-bold text-gray-500">Client:</p><p>{client.name}<br/>{client.address}<br/>{client.email}<br/>{client.phone}</p></div>
                <div><p className="font-bold text-gray-500">Project Location:</p><p>{client.shippingAddress || client.projectLocation || client.address}</p></div>
                <div><p className="font-bold text-gray-500">Reference:</p><p>#{invoice.invoiceNumber}<br/>Date: {safeFormat(invoice.invoiceDate, 'dd-MMM-yyyy')}<br/>Due: {safeFormat(invoice.dueDate, 'dd-MMM-yyyy')}<br/>PO#: {invoice.poNumber}</p></div>
            </section>
            
             {invoice.roofing && (
                <section className="mb-8 p-4 bg-white rounded-lg shadow-sm text-xs">
                    <p className="font-bold text-gray-500 mb-2">Roofing Specifications</p>
                    <RoofingDetails invoice={invoice} t={t}/>
                </section>
            )}

            <main className="flex-grow bg-white p-4 rounded-lg shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr style={{ backgroundColor: `${accentColor}1A`, borderBottom: `2px solid ${accentColor}`}}><th className="py-2 px-2 font-bold w-[50%]">Item Description</th><th className="py-2 px-2 font-bold text-center">Qty</th><th className="py-2 px-2 font-bold text-right">Price</th><th className="py-2 px-2 font-bold text-right">Total</th></tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 px-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="py-2 px-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 px-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 px-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                 <footer className="mt-auto pt-6 flex justify-between items-end">
                    <div className="w-1/2 text-xs">
                        <p className="font-bold text-gray-500 mb-2">Terms & Conditions</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                         <div className="flex gap-16 mt-8">
                            {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label={"Owner Signature"} />}
                        </div>
                    </div>
                    <div className="w-2/5 text-sm space-y-1">
                        <p className="flex justify-between p-1"><span>Subtotal</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        {discountAmount > 0 && <p className="flex justify-between p-1">Discount: <span className="text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                        {invoice.summary.shippingCost > 0 && <p className="flex justify-between p-1">Shipping/Extra: <span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                        <p className="flex justify-between p-1"><span>Tax</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between p-1"><span>Total</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between p-1 text-green-600"><span>Paid</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-gray-300"><span>Total Due</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 4: NEW - Clean Grid
export const RoofingTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="flex justify-between items-start mb-8 pb-4 border-b">
                <div>
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light">{docTitle}</h2>
                </div>
            </header>
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold mb-1">To:</p>
                    <p>{client.name}</p>
                    <p>{client.address}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                </div>
                <div className="text-right">
                    <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
                    <p><strong>Date:</strong> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><strong>Due Date:</strong> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                    <p><strong>PO #:</strong> {invoice.poNumber}</p>
                </div>
            </section>
            
            {invoice.roofing && (
                <section className="mb-8 text-xs">
                    <p className="font-bold mb-2 text-center text-sm tracking-wider border-y py-1 bg-gray-50">SCOPE OF WORK</p>
                    <RoofingDetails invoice={invoice} t={t}/>
                </section>
            )}

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 font-bold w-4/5">Description</th>
                            <th className="p-2 font-bold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8 flex justify-between items-end">
                     <div className="w-1/2 text-xs">
                        <p className="font-bold text-gray-500 mb-2">Terms & Conditions</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                         <div className="flex gap-16 mt-8">
                            {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label={"Owner Signature"} />}
                        </div>
                     </div>
                     <div className="w-1/3 text-sm">
                         <p className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                         {discountAmount > 0 && <p className="flex justify-between">Discount: <span className="text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                         {invoice.summary.shippingCost > 0 && <p className="flex justify-between">Shipping/Extra: <span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                         <p className="flex justify-between border-b pb-1"><span>Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                         <p className="flex justify-between font-bold"><span>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                         {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                         <p className="flex justify-between font-bold text-lg mt-2"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 5: NEW - Side Panel
export const RoofingTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="w-1/3 p-8 text-white" style={{ backgroundColor: accentColor || '#4B5563' }}>
                <h2 className="text-3xl font-bold mb-10">{docTitle}</h2>
                <div className="text-sm space-y-4">
                    <div>
                        <p className="font-bold opacity-80 mb-1">Prepared For</p>
                        <p>{client.name}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">Date</p>
                        <p>{safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">Invoice #</p>
                        <p>{invoice.invoiceNumber}</p>
                    </div>
                </div>
            </div>
            <div className="w-2/3 p-10 flex flex-col">
                <header className="mb-10 text-right">
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs text-gray-500 whitespace-pre-line">{business.address}</p>
                </header>

                {invoice.roofing && (
                    <section className="mb-8 text-xs">
                        <p className="font-bold mb-2 text-center text-sm tracking-wider border-y py-1 bg-gray-50">Project Details</p>
                        <RoofingDetails invoice={invoice} t={t}/>
                    </section>
                )}

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b">
                            <tr>
                                <th className="pb-2 font-bold w-4/5">Description</th>
                                <th className="pb-2 font-bold text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id}>
                                    <td className="py-2 border-b">{item.name}</td>
                                    <td className="py-2 border-b text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8 text-right">
                         <div className="text-xs mb-8">
                            <p className="font-bold text-gray-500 mb-2">Terms & Conditions</p>
                            <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                        </div>
                        <div className="inline-block w-1/2 text-sm">
                            <p className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between">Discount: <span className="text-red-600">-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between">Shipping: <span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <div className="w-full h-px bg-gray-300 my-2"></div>
                            <p className="flex justify-between font-bold text-lg"><span>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                             <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                         <div className="flex justify-between mt-8">
                            {business.ownerSignature && <SignatureDisplay signature={business.ownerSignature} label={"Owner Signature"} />}
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};


export const RoofingTemplate6: React.FC<PageProps> = (props) => <RoofingTemplate1 {...props} />;
export const RoofingTemplate7: React.FC<PageProps> = (props) => <RoofingTemplate2 {...props} />;
export const RoofingTemplate8: React.FC<PageProps> = (props) => <RoofingTemplate3 {...props} />;
export const RoofingTemplate9: React.FC<PageProps> = (props) => <RoofingTemplate4 {...props} />;
export const RoofingTemplate10: React.FC<PageProps> = (props) => <RoofingTemplate5 {...props} />;
