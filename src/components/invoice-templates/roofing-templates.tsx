
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

export const RoofingDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.roofing) return null;
    const { roofing } = invoice;
    const hasDetails = Object.values(roofing).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.roofingSpecifications || 'Roofing Specifications'}</p>
            </section>
        );
    }
    
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.roofingSpecifications || 'Roofing Specifications'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1">
                {roofing.roofType && <p><span className="text-gray-500">{(t.roofMaterial || 'Roof Material')}:</span> <span className="font-semibold">{roofing.roofType}</span></p>}
                {roofing.squareFootage && <p><span className="text-gray-500">{(t.roofSizeSqFt || 'Roof Size (sq ft)')}:</span> <span className="font-semibold">{roofing.squareFootage}</span></p>}
                {roofing.pitch && <p><span className="text-gray-500">{(t.roofPitch || 'Roof Pitch')}:</span> <span className="font-semibold">{roofing.pitch}</span></p>}
                {roofing.tearOffRequired && <p><span className="text-gray-500">{(t.layersToRemove || 'Layers to Remove')}:</span> <span className="font-semibold">{roofing.tearOffRequired ? 'Yes' : 'No'}</span></p>}
                {roofing.underlaymentType && <p><span className="text-gray-500">{(t.underlayment || 'Underlayment')}:</span> <span className="font-semibold">{roofing.underlaymentType}</span></p>}
                {roofing.dumpsterFee && <p><span className="text-gray-500">{(t.disposalFee || 'Disposal Fee')}:</span> <span className="font-semibold">${roofing.dumpsterFee.toFixed(2)}</span></p>}
            </div>
        </section>
    );
};

// Template 1: Gable
export const RoofingTemplate1: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, discountAmount, total, balanceDue, t, currencySymbol, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    
    return (
        <div className={`p-10 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}pt`, minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <div>
                    <h1 className="text-4xl font-bold">{business.name}</h1>
                    <p className="text-xs whitespace-pre-line">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 my-8 text-sm">
                <div>
                    <p className="font-bold">{(t.billTo || 'BILLED TO')}</p>
                    <p>{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{(t.date || 'Date')}:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
                    <p><span className="font-bold">{(t.dueDate || 'Due Date')}:</span> {safeFormat(invoice.dueDate, 'MMM d, yyyy')}</p>
                </div>
            </section>

            <RoofingDetails invoice={invoice} t={t} />
            
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
                                <td className="p-2 align-top">{item.name}</td>
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
                            <div className="flex justify-between py-1"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold py-2 mt-2 border-t-2 border-gray-800" style={{ color: accentColor }}><span className="text-lg">{(t.total || 'Total')}:</span><span className="text-lg">{currencySymbol}{total.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-lg mt-1 p-2 bg-gray-100"><span>{(t.balanceDue || 'Balance Due')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export const RoofingTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, total, balanceDue, t, currencySymbol, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    return (
        <div className={`p-10 font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2" style={{borderColor: accentColor}}>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{docTitle}</h2>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div><p className="font-bold text-gray-500 mb-1">{t.customer || 'Customer'}:</p><p className="font-semibold">{client.name}</p><p>{client.address}</p></div>
                <div className="text-right"><p><span className="font-bold">{t.invoiceNo || 'Invoice #'}:</span> {invoice.invoiceNumber}</p><p><span className="font-bold">{t.date || 'Date'}:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p></div>
            </section>
            
            <RoofingDetails invoice={invoice} t={t}/>

            <main className="flex-grow mt-4">
                 <table className="w-full text-left text-xs">
                    <thead><tr className="border-b-2 border-gray-200"><th className="py-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th><th className="py-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th><th className="py-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th><th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b border-gray-100"><td className="py-2 align-top">{item.name}</td><td className="py-2 align-top text-center">{item.quantity}</td><td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="py-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <div className="w-1/3 text-sm space-y-1">
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold bg-gray-100 p-2 mt-1"><span>{t.balanceDue || 'Balance Due'}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export const RoofingTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    return (
        <div className={`p-10 bg-gray-50 font-['Roboto'] text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-start mb-8">
                <div><h1 className="text-4xl font-extrabold" style={{color: accentColor}}>{business.name}</h1><p className="text-xs">{business.address}</p></div>
                <div className="text-right"><h2 className="text-3xl font-bold">{docTitle}</h2></div>
            </header>
            <section className="grid grid-cols-3 gap-4 mb-8 text-xs p-4 bg-white rounded-lg shadow-sm">
                <div><p className="font-bold text-gray-500">{t.client || 'Client'}:</p><p>{client.name}<br/>{client.address}</p></div>
                <div className="text-center"><p className="font-bold text-gray-500">{t.projectLocation || 'Project Location'}:</p><p>{invoice.client.projectLocation || client.address}</p></div>
                <div className="text-right"><p className="font-bold text-gray-500">{t.reference || 'Reference'}:</p><p>#{invoice.invoiceNumber}<br/>{t.date || 'Date'}: {safeFormat(invoice.invoiceDate, 'dd-MMM-yyyy')}</p></div>
            </section>
            
            <RoofingDetails invoice={invoice} t={t}/>
            <main className="flex-grow bg-white p-4 rounded-lg shadow-sm mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr style={{ backgroundColor: `${accentColor}1A`}} className="border-b-2" style={{ borderColor: accentColor }}><th className="py-2 px-2 font-bold w-[50%]">{t.itemDescription || 'Item Description'}</th><th className="py-2 px-2 font-bold text-center">{t.quantity || 'Qty'}</th><th className="py-2 px-2 font-bold text-right">{t.price || 'Price'}</th><th className="py-2 px-2 font-bold text-right">{t.total || 'Total'}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b border-gray-100"><td className="py-2 px-2 align-top">{item.name}</td><td className="py-2 px-2 align-top text-center">{item.quantity}</td><td className="py-2 px-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="py-2 px-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                 <footer className="mt-auto pt-6 flex justify-between items-end">
                    <div className="w-1/2 text-xs">
                        <p className="font-bold text-gray-500 mb-2">{t.termsAndConditions || 'Terms & Conditions'}</p>
                        <p className="whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </div>
                    <div className="w-2/5 text-sm space-y-1">
                        <p className="flex justify-between p-1"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between p-1"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-gray-300"><span>{t.total || 'Total Invoice'}</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold bg-gray-200 p-2 mt-1"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </footer>
            )}
        </div>
    );
};

export const RoofingTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    return (
        <div className={`p-10 font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Arial', fontSize: `${invoice.fontSize}pt`, minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-center mb-8 pb-4 border-b-4" style={{borderColor: accentColor}}>
                <div><p className="font-bold text-3xl">{business.name}</p><div className="text-xs text-gray-500"><p>{business.address}</p>{business.website && <p>{business.website}</p>}</div></div>
                <div className="text-right"><h1 className="text-2xl font-extrabold" style={{color: accentColor}}>{docTitle}</h1></div>
            </header>
            
            <section className="mb-8 grid grid-cols-2 gap-4 text-xs">
                 <div><p className="font-bold">{t.clientInfo || 'Client Information'}:</p><p>{client.name}</p><p>{client.address}</p><p>{client.phone} | {client.email}</p></div>
                 <div className="text-right"><p><span className="font-bold text-gray-500">{t.invoiceNo || 'Invoice #'}: </span>{invoice.invoiceNumber}</p><p><span className="font-bold text-gray-500">{t.date || 'DATE'}: </span>{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p></div>
            </section>
            
            <RoofingDetails invoice={invoice} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 font-bold w-[60%]">{t.description || 'DESCRIPTION'}</th>
                            <th className="p-2 font-bold text-center">{t.quantity || 'QTY'}</th>
                            <th className="p-2 font-bold text-right">{t.price || 'PRICE'}</th>
                            <th className="p-2 font-bold text-right">{t.amount || 'AMOUNT'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2 align-top whitespace-pre-line">{item.name}</td><td className="p-2 align-top text-center">{item.quantity}</td><td className="p-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="p-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}
                    </tbody>
                </table>
            </main>
            
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                     <div className="flex justify-end">
                        <table className="w-1/3 text-sm">
                            <tbody>
                                <tr><td className="py-1 text-gray-600">{t.subtotal || 'Subtotal'}</td><td className="py-1 text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                {taxAmount > 0 && <tr><td className="py-1 text-gray-600">{t.tax || 'Taxes'}</td><td className="py-1 text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>}
                                <tr className="font-bold text-base border-t-2 border-black"><td className="py-2">{t.total || 'Total'}</td><td className="py-2 text-right">{currencySymbol}{total.toFixed(2)}</td></tr>
                                <tr className="font-bold text-lg bg-gray-100"><td className="p-2">{t.balanceDue || 'Balance Due'}</td><td className="p-2 text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};

export const RoofingTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, total, balanceDue, currencySymbol, t, accentColor, textColor } = props;
    const { business, client } = invoice;
    const docTitle = (t.invoice || 'INVOICE').toUpperCase();
    return (
        <div className={`p-10 font-serif bg-white text-gray-900 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: textColor }}>
            <header className="text-center mb-10"><h1 className="text-4xl font-bold">{business.name}</h1></header>
            <h2 className="text-xl font-semibold mb-8">{docTitle}</h2>
            <section className="text-xs mb-8">
                <p><strong>{t.to || 'To'}:</strong> {client.name}</p>
                <p><strong>{t.invoiceNo || 'Invoice #'}:</strong> {invoice.invoiceNumber}</p>
                <p><strong>{t.date || 'Date'}:</strong> {safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
            </section>
            
            <RoofingDetails invoice={invoice} t={t}/>

            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead><tr className="border-b-2"><th className="py-2 w-3/4">{t.service || 'SERVICE'}</th><th className="py-2 text-right">{t.charge || 'CHARGE'}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="py-2">{item.name}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end text-sm">
                    <div className="w-1/3">
                        <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>{t.tax || 'Tax'}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold mt-2 pt-2 border-t"><span>{t.total || 'TOTAL'}</span><span>{currencySymbol}{total.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold mt-1 text-green-600"><span>{t.amountPaid || 'Amount Paid'}</span><span>-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold mt-1"><span>{t.balanceDue || 'Balance Due'}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};
