
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

const LegalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.legal) return null;
    const { legal } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.caseDetails || 'Case Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.caseName || 'Case Name'}:</span> {legal.caseName}</p>
                <p><span className="font-semibold text-gray-600">{t.caseNumber || 'Case #'}:</span> {legal.caseNumber}</p>
                <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {legal.serviceType}</p>
                {legal.hourlyRate && <p><span className="font-semibold text-gray-600">{t.hourlyRate || 'Rate'}:</span> ${legal.hourlyRate.toFixed(2)}/hr</p>}
                {legal.hoursWorked && <p><span className="font-semibold text-gray-600">{t.hoursWorked || 'Hours'}:</span> {legal.hoursWorked}</p>}
                {legal.retainerAmount && <p><span className="font-semibold text-gray-600">{t.retainer || 'Retainer'}:</span> ${legal.retainerAmount.toFixed(2)}</p>}
                {legal.courtFilingFees && <p><span className="font-semibold text-gray-600">{t.filingFees || 'Filing Fees'}:</span> ${legal.courtFilingFees.toFixed(2)}</p>}
                {legal.travelTime && <p><span className="font-semibold text-gray-600">{t.travelTime || 'Travel (hrs)'}:</span> {legal.travelTime}</p>}
                {legal.additionalDisbursements && <p className="col-span-full"><span className="font-semibold text-gray-600">{t.disbursements || 'Disbursements'}:</span> {legal.additionalDisbursements}</p>}
            </div>
        </section>
    );
};

// Template 1: Gavel (Based on User Image)
export const LegalTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, balanceDue, subtotal, taxAmount, discountAmount, total, currencySymbol, t } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 font-serif bg-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="grid grid-cols-2 gap-8 items-start mb-8">
                <div className="flex items-start gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gavel"><path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/></svg>
                    <div>
                        <h2 className="text-2xl font-bold">{t.legalInvoice || 'LEGAL INVOICE'}</h2>
                        <p className="text-xs text-gray-500">{business.name}</p>
                    </div>
                </div>
                <div className="text-xs space-y-1 text-right">
                    <p><span className="font-bold">Invoice No.</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{t.date || 'Date'}:</span> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                    <p><span className="font-bold">{t.dueDate || 'Due Date'}:</span> {safeFormat(invoice.dueDate, 'yyyy-MM-dd')}</p>
                    {invoice.poNumber && <p><span className="font-bold">PO #:</span> {invoice.poNumber}</p>}
                </div>
            </header>
            
            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold mb-1">Bill From</p>
                    <p>{business.name}</p>
                    <p className="whitespace-pre-line">{business.address}</p>
                    <p>Phone: {business.phone}</p>
                    <p>Email: {business.email}</p>
                    {business.website && <p>Web: {business.website}</p>}
                    {business.licenseNumber && <p>Lic #: {business.licenseNumber}</p>}
                    {business.taxId && <p>Tax ID: {business.taxId}</p>}
                </div>
                <div>
                    <p className="font-bold mb-1">Bill To</p>
                    <p>{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>Phone: {client.phone}</p>
                    <p>Email: {client.email}</p>
                    {client.shippingAddress && <p className="mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    {client.projectLocation && <p className="mt-2"><span className="font-bold">Project Location:</span><br/>{client.projectLocation}</p>}
                </div>
            </section>

            <LegalDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="border p-2 font-bold w-2/5">Description</th>
                            <th className="border p-2 font-bold text-center">Quantity</th>
                            <th className="border p-2 font-bold text-center">Rate</th>
                            <th className="border p-2 font-bold text-right">Total ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map((item, index) => (
                            <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <td className="border p-2">{item.name}</td>
                                <td className="border p-2 text-center">{item.quantity}</td>
                                <td className="border p-2 text-center">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="border p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                         {[...Array(Math.max(0, 10 - pageItems.length))].map((_, i) => (
                            <tr key={`blank-${i}`} className={ (pageItems.length + i) % 2 === 0 ? 'bg-gray-100' : ''}>
                                <td className="border p-2 h-8"></td>
                                <td className="border p-2"></td>
                                <td className="border p-2"></td>
                                <td className="border p-2"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-4">
                <div className="flex justify-end text-xs">
                    <div className="w-1/3">
                        <div className="flex justify-between p-1"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                        {discountAmount > 0 && <div className="flex justify-between p-1 text-red-600"><span>{t.discount || 'Discount'}</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                        {invoice.summary.shippingCost > 0 && <div className="flex justify-between p-1"><span>{t.shipping || 'Shipping'}</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                        <div className="flex justify-between p-1"><span>{t.salesTax || 'Sales Tax'}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                        <div className="flex justify-between p-1 mt-1 border-t-2 border-black font-bold"><span>{t.total || 'Total'}</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                        {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between p-1 text-green-600 font-bold"><span>{t.amountPaid || 'Amount Paid'}</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                        <div className="flex justify-between p-1 mt-1 border-t-2 border-black font-bold text-base bg-gray-100"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                    </div>
                </div>
                <div className="text-xs mt-8 border-t pt-4">
                    <p className="font-bold">{t.termsAndConditions || 'Terms and Conditions'}</p>
                    <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                </div>
                <div className="flex justify-between mt-8">
                  <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                  <SignatureDisplay signature={invoice.clientSignature} label={t.clientSignature || 'Client Signature'} />
                </div>
            </footer>
            )}
        </div>
    );
}


// Template 2: Advocate
export const LegalTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
     return (
        <div className={`font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="p-10 text-white flex justify-between" style={{backgroundColor: accentColor || '#1a202c'}}>
                <div>
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <p className="text-xs opacity-80 whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                    <p>#{invoice.invoiceNumber}</p>
                </div>
            </header>
            <div className="p-10">
                <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                     <div>
                        <p className="font-bold">{t.client || 'Client'}</p>
                        <p>{client.name}</p>
                        <p className="whitespace-pre-line">{client.address}</p>
                        <p>{client.email}</p>
                        <p>{client.phone}</p>
                     </div>
                     <div className="text-right">
                        <p><strong>{(t.date || 'Date')}:</strong> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                        <p><strong>{(t.dueDate || 'Due Date')}:</strong> {safeFormat(invoice.dueDate, 'MMMM d, yyyy')}</p>
                     </div>
                </section>
                <LegalDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="border-b-2"><th className="pb-2 font-bold w-3/5">{(t.description || 'Description')}</th><th className="pb-2 font-bold text-right">{(t.amount || 'Amount')}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                 {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8">
                        <div className="flex justify-end text-sm">
                           <div className="w-1/2">
                                <p className="flex justify-between py-1"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                                {discountAmount > 0 && <p className="flex justify-between py-1 text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                                {invoice.summary.shippingCost > 0 && <p className="flex justify-between py-1"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                                <p className="flex justify-between py-1"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                                <p className="flex justify-between font-bold text-lg mt-4"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                                {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>{(t.amountPaid || 'Amount Paid')}:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                                <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                           </div>
                        </div>
                         <div className="flex justify-between mt-8">
                            <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                            <SignatureDisplay signature={invoice.clientSignature} label={t.clientSignature || 'Client Signature'} />
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};
// Template 3: Justice
export const LegalTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-sans bg-gray-50 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="bg-white p-8 shadow-lg">
                <header className="flex justify-between items-start mb-8">
                    <div>
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
                        <p className="font-bold text-gray-500 mb-1">Billed To</p>
                        <p>{client.name}<br/>{client.address}<br/>{client.email}<br/>{client.phone}</p>
                    </div>
                    <div className="text-right">
                        <p><span className="font-bold text-gray-500">Date: </span>{safeFormat(invoice.invoiceDate, 'dd-MMM-yyyy')}</p>
                        <p><span className="font-bold text-gray-500">Due Date: </span>{safeFormat(invoice.dueDate, 'dd-MMM-yyyy')}</p>
                    </div>
                </section>
                <LegalDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">Service Description</th><th className="p-2 font-bold text-right">Fee</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3 space-y-1">
                            <p className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            {discountAmount > 0 && <p className="flex justify-between text-red-500"><span>Discount:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></p>}
                            {invoice.summary.shippingCost > 0 && <p className="flex justify-between"><span>Other Fees:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>Tax:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold"><span>Total:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between text-green-600"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                            <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-gray-300"><span>Balance Due:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                    <div className="flex justify-between mt-8">
                      <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                      <SignatureDisplay signature={invoice.clientSignature} label="Client Signature" />
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};
// Template 4: Paralegal
export const LegalTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, total, balanceDue, currencySymbol, t } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-10 font-serif bg-white ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-sm">{(t.attorneysAtLaw || 'Attorneys at Law')}</p>
            </header>
            <div className="w-full h-px bg-gray-300 mb-8"></div>
            <section className="grid grid-cols-2 gap-8 mb-8 text-sm">
                <div><p className="font-bold">{(t.statementOfAccountFor || 'Statement of Account For')}:</p><p>{client.name}</p></div>
                <div className="text-right"><p><strong>INVOICE #:</strong> {invoice.invoiceNumber}</p><p><strong>{(t.date || 'DATE')}:</strong> {safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p></div>
            </section>
            <LegalDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead><tr className="border-b-2 border-t-2"><th className="py-2 w-3/5">{(t.professionalServicesRendered || 'Professional Services Rendered')}</th><th className="py-2 text-right">{(t.amount || 'Amount')}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/3">
                        <p className="flex justify-between py-1"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        {(invoice.amountPaid || 0) > 0 && <p className="flex justify-between py-1 text-green-600"><span>Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>}
                        <p className="flex justify-between font-bold text-xl mt-2 pt-2 border-t-2"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className="flex justify-between mt-8">
                  <SignatureDisplay signature={business.ownerSignature} label="Authorized Signature" />
                  <SignatureDisplay signature={invoice.clientSignature} label="Client Signature" />
                </div>
            </footer>
            )}
        </div>
    );
};
// Template 5: The Firm
export const LegalTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`flex ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="w-1/4 p-8 text-white" style={{backgroundColor: accentColor}}><h1 className="text-3xl font-bold">{business.name}</h1></div>
            <div className="w-3/4 p-10">
                <header className="text-right mb-10"><h2 className="text-4xl font-bold">{(t.invoice || 'INVOICE').toUpperCase()}</h2></header>
                <section className="text-sm mb-10">
                    <p className="font-bold">{(t.client || 'Client')}: {client.name}</p>
                    <p><strong>{(t.invoiceNo || 'Invoice #')}:</strong> {invoice.invoiceNumber} | <strong>{(t.date || 'Date')}:</strong> {safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                </section>
                <LegalDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">{(t.description || 'Description')}</th><th className="p-2 font-bold text-right">{(t.total || 'Total')}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                      <div className="w-1/2 text-right">
                        <div className="flex justify-between text-sm"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></div>
                        {discountAmount > 0 && <div className="flex justify-between text-sm text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                        {invoice.summary.shippingCost > 0 && <div className="flex justify-between text-sm"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span></div>}
                        <div className="flex justify-between text-sm"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></div>
                        {(invoice.amountPaid || 0) > 0 && <div className="flex justify-between text-sm text-green-600"><span>Amount Paid:</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></div>}
                        <div className="flex justify-between text-2xl font-bold mt-2 pt-2 border-t"><span>{t.totalDue || 'Total Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-8">
                      <SignatureDisplay signature={business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                      <SignatureDisplay signature={invoice.clientSignature} label={t.clientSignature || 'Client Signature'} />
                    </div>
                </footer>
                )}
            </div>
        </div>
    )
};
