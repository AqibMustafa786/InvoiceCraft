
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
    const { invoice, pageItems, pageIndex, totalPages, subtotal, t, currencySymbol, accentColor, balanceDue } = props;
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
                        <p className="text-sm">{(t.cleaningService || 'Cleaning Service')}</p>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-4 mb-8 text-xs p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                    <div>
                        <p className="font-bold text-base mb-2">{(t.companyInformation || 'Company Information')}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.companyName || 'Company Name')}:</span> {business.name}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.address || 'Address')}:</span> <span className="whitespace-pre-line">{business.address}</span></p>
                        <p><span className="font-bold w-24 inline-block">{(t.phone || 'Phone')}:</span> {business.phone}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.email || 'Email')}:</span> {business.email}</p>
                    </div>
                    <div>
                        <p className="font-bold text-base mb-2">{(t.customerInformation || 'Customer Information')}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.customerName || 'Customer Name')}:</span> {client.name}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.address || 'Address')}:</span> <span className="whitespace-pre-line">{client.address}</span></p>
                        <p><span className="font-bold w-24 inline-block">{(t.phone || 'Phone')}:</span> {client.phone}</p>
                        <p><span className="font-bold w-24 inline-block">{(t.email || 'Email')}:</span> {client.email}</p>
                    </div>
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
                             <table className="w-1/3 text-sm">
                                <tbody>
                                    <tr className="border-t-2"><td className="p-2 text-right font-bold">{(t.total || 'Total')}</td><td className="p-2 text-right font-bold" style={{backgroundColor: accentColor, color: 'white'}}>{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                                </tbody>
                             </table>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

// Template 2: Fresh
export const CleaningTemplate2: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 bg-white font-sans text-gray-700 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: 'Verdana, sans-serif', fontSize: '9.5pt', minHeight: '1056px', color: props.textColor, backgroundColor: props.backgroundColor }}>
            <header className="flex justify-between items-start mb-10 pb-4 border-b-2 border-gray-100">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain mb-2"/>}
                    <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{business.name}</h1>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-light text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                    <p className="text-sm text-gray-400">{(t.cleaningService || 'Cleaning Service')}</p>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-4 mb-8 text-xs">
                <div>
                    <p className="font-bold text-gray-500">{(t.client || 'Client')}:</p>
                    <p className="font-semibold">{client.name}</p>
                    <p>{client.address}</p>
                </div>
                 <div className="text-right col-span-2">
                    <p><span className="font-bold">{(t.invoiceNo || 'Invoice #')}:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">{(t.date || 'Date')}:</span> {safeFormat(invoice.invoiceDate, 'MMM d, yyyy')}</p>
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
                            <p className="flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Pristine
export const CleaningTemplate3: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: accentColor + '10', color: props.textColor }}>
            <div className="bg-white p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={90} height={45} className="object-contain mb-2"/>}
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500">{business.address}</p>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                </header>
                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div><p className="font-bold text-gray-500 mb-1">{(t.billedTo || 'Billed To')}</p><p>{client.name}<br/>{client.address}</p></div>
                    <div className="text-right"><p><span className="font-bold text-gray-500">{(t.invoiceNo || 'Invoice #')}: </span>{invoice.invoiceNumber}</p><p><span className="font-bold text-gray-500">{(t.date || 'Date')}: </span>{safeFormat(invoice.invoiceDate, 'dd/MM/yyyy')}</p></div>
                </section>
                <CleaningDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="border-b-2 border-gray-200"><th className="py-2 font-bold w-1/2">{(t.service || 'SERVICE').toUpperCase()}</th><th className="py-2 font-bold text-center">{(t.qty || 'QTY').toUpperCase()}</th><th className="py-2 font-bold text-right">{(t.price || 'PRICE').toUpperCase()}</th><th className="py-2 font-bold text-right">{(t.amount || 'AMOUNT').toUpperCase()}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b border-gray-100"><td className="py-2">{item.name}</td><td className="py-2 text-center">{item.quantity}</td><td className="py-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <div className="w-1/3 text-xs space-y-1">
                            <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}:</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span>{(t.tax || 'Tax')}:</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-sm mt-2 pt-2 border-t border-gray-300"><span>{(t.total || 'Total')}:</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};

// Template 4: Hygiene
export const CleaningTemplate4: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, currencySymbol, t, accentColor } = props;
    const { business, client } = invoice;

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <div className="border-t-8" style={{borderColor: accentColor}}>
                <header className="my-8 flex justify-between items-center">
                    <div>
                        {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={100} height={50} className="object-contain mb-2"/>}
                        <h1 className="text-2xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500">{business.address}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-light text-gray-400">{(t.invoice || 'INVOICE').toUpperCase()}</h2>
                        <p className="text-xs text-gray-500">{invoice.invoiceNumber}</p>
                    </div>
                </header>
                 <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div><p className="font-bold text-gray-500">{(t.billTo || 'Bill To')}</p><p>{client.name}<br/>{client.address}</p></div>
                    <div className="text-right"><p><span className="font-bold text-gray-500">{(t.date || 'Date')}: </span>{safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p><p><span className="font-bold text-gray-500">{(t.dueDate || 'Due Date')}: </span>{safeFormat(invoice.dueDate, 'MMM dd, yyyy')}</p></div>
                </section>
                <CleaningDetails invoice={invoice} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-3/5">{(t.item || 'Item').toUpperCase()}</th><th className="p-2 font-bold text-center">{(t.qty || 'Qty').toUpperCase()}</th><th className="p-2 font-bold text-right">{(t.price || 'Price').toUpperCase()}</th><th className="p-2 font-bold text-right">{(t.total || 'Total').toUpperCase()}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-center">{item.quantity}</td><td className="p-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <table className="w-2/5 text-xs">
                            <tbody>
                                <tr><td className="py-1">{(t.subtotal || 'Subtotal')}</td><td className="py-1 text-right">{currencySymbol}{subtotal.toFixed(2)}</td></tr>
                                <tr><td className="py-1">{(t.tax || 'Tax')}</td><td className="py-1 text-right">{currencySymbol}{taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base"><td className="py-2 border-t-2 border-black">{(t.total || 'Total')}</td><td className="py-2 border-t-2 border-black text-right">{currencySymbol}{balanceDue.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
                )}
            </div>
        </div>
    );
};

// Template 5: Gleam
export const CleaningTemplate5: React.FC<PageProps> = (props) => {
    const { invoice, pageItems, pageIndex, totalPages, subtotal, taxAmount, balanceDue, t, currencySymbol, accentColor } = props;
    const { business, client } = invoice;
    return (
        <div className={`p-8 font-['Georgia',_serif] ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: props.backgroundColor, color: props.textColor }}>
            <header className="mb-16 text-center">
                 {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={70} height={70} className="mx-auto mb-4 rounded-full"/>}
                <h1 className="text-4xl font-bold">{business.name}</h1>
                <p className="text-sm text-gray-500">{(t.professionalCleaningServices || 'Professional Cleaning Services')}</p>
            </header>
            <section className="flex justify-between text-xs mb-8">
                <div><p className="font-bold text-gray-500">{(t.invoiceTo || 'INVOICE TO')}</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="text-right"><p><span className="font-bold text-gray-500">{(t.invoice || 'INVOICE').toUpperCase()}: </span>{invoice.invoiceNumber}</p><p><span className="font-bold text-gray-500">{(t.date || 'DATE')}: </span>{safeFormat(invoice.invoiceDate, 'MMM dd, yyyy')}</p></div>
            </section>
            <CleaningDetails invoice={invoice} t={t} />
            <main className="flex-grow mt-4">
                 <table className="w-full text-left text-xs">
                    <thead><tr><th className="pb-2 font-bold w-1/2 border-b-2">{(t.description || 'DESCRIPTION').toUpperCase()}</th><th className="pb-2 font-bold text-center border-b-2">{(t.qty || 'QTY').toUpperCase()}</th><th className="pb-2 font-bold text-right border-b-2">{(t.price || 'PRICE').toUpperCase()}</th><th className="pb-2 font-bold text-right border-b-2">{(t.total || 'TOTAL').toUpperCase()}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id}><td className="py-2 border-b">{item.name}</td><td className="py-2 border-b text-center">{item.quantity}</td><td className="py-2 border-b text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td><td className="py-2 border-b text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
            <footer className="mt-auto pt-8">
                <div className="flex justify-end">
                    <div className="w-1/3 text-xs space-y-2">
                        <p className="flex justify-between"><span>{(t.subtotal || 'Subtotal')}</span><span>{currencySymbol}{subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>{(t.tax || 'Tax')}</span><span>{currencySymbol}{taxAmount.toFixed(2)}</span></p>
                        <div className="h-4"></div>
                        <p className="flex justify-between font-bold text-base" style={{color: accentColor}}><span>{(t.total || 'Total')}</span><span>{currencySymbol}{balanceDue.toFixed(2)}</span></p>
                    </div>
                </div>
            </footer>
            )}
        </div>
    );
};
```
</change>
  <change>
    <file>src/components/document-template-selector.tsx</file>
    <content><![CDATA[
'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { EstimateCategory, InvoiceCategory } from '@/lib/types';
import { useMemo } from 'react';

interface Template {
  id: string;
  name: string;
  thumbnailUrl: string;
  category: EstimateCategory | InvoiceCategory;
}

interface DocumentTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  documentType: 'estimate' | 'quote' | 'invoice';
  category: EstimateCategory | InvoiceCategory;
}

const templates: Template[] = [
  // General
  { id: 'default', name: 'Default', thumbnailUrl: '/templates/Default.png', category: 'General Services' },
  { id: 'modern', name: 'Modern', thumbnailUrl: '/templates/Modern.png', category: 'General Services' },
  { id: 'minimalist', name: 'Minimalist', thumbnailUrl: '/templates/Minimalist.png', category: 'General Services' },
  { id: 'creative', name: 'Creative', thumbnailUrl: '/templates/Creative.png', category: 'General Services' },
  { id: 'elegant', name: 'Elegant', thumbnailUrl: '/templates/Elegant.png', category: 'General Services' },
  { id: 'usa', name: 'USA', thumbnailUrl: '/templates/Usa.png', category: 'General Services' },
  
  // Construction
  { id: 'construction-1', name: 'Foundation', thumbnailUrl: '/templates/construction-1.png', category: 'Construction' },
  { id: 'construction-2', name: 'Blueprint', thumbnailUrl: '/templates/construction-2.png', category: 'Construction' },
  { id: 'construction-3', name: 'Contractor', thumbnailUrl: '/templates/construction-3.png', category: 'Construction' },
  { id: 'construction-4', name: 'High-Rise', thumbnailUrl: '/templates/construction-4.png', category: 'Construction' },
  { id: 'construction-5', name: 'Steel-Frame', thumbnailUrl: '/templates/construction-5.png', category: 'Construction' },
  { id: 'construction-6', name: 'Classic', thumbnailUrl: '/templates/construction-6.png', category: 'Construction' },
  { id: 'construction-7', name: 'Modern Build', thumbnailUrl: '/templates/construction-7.png', category: 'Construction' },
  { id: 'construction-8', name: 'Grid', thumbnailUrl: '/templates/construction-8.png', category: 'Construction' },
  { id: 'construction-9', name: 'Simple', thumbnailUrl: '/templates/construction-9.png', category: 'Construction' },
  { id: 'construction-10', name: 'Bold', thumbnailUrl: '/templates/construction-10.png', category: 'Construction' },
  
  // Remodeling
  { id: 'remodeling-1', name: 'Precision', thumbnailUrl: '/templates/remodeling-1.png', category: 'Home Remodeling / Renovation' },
  { id: 'remodeling-2', name: 'Modern Reno', thumbnailUrl: '/templates/remodeling-2.png', category: 'Home Remodeling / Renovation' },
  { id: 'remodeling-3', name: 'Blueprint', thumbnailUrl: '/templates/remodeling-3.png', category: 'Home Remodeling / Renovation'},
  { id: 'remodeling-4', name: 'Craftsman', thumbnailUrl: '/templates/remodeling-4.png', category: 'Home Remodeling / Renovation'},
  { id: 'remodeling-5', name: 'Urban Build', thumbnailUrl: '/templates/remodeling-5.png', category: 'Home Remodeling / Renovation'},

  // HVAC
  { id: 'hvac-1', name: 'Coolant', thumbnailUrl: '/templates/hvac-1.png', category: 'HVAC Services' },
  { id: 'hvac-2', name: 'Ventura', thumbnailUrl: '/templates/hvac-2.png', category: 'HVAC Services' },
  { id: 'hvac-3', name: 'EcoLink', thumbnailUrl: '/templates/hvac-3.png', category: 'HVAC Services' },
  { id: 'hvac-4', name: 'ClimateControl', thumbnailUrl: '/templates/hvac-4.png', category: 'HVAC Services' },
  { id: 'hvac-5', name: 'Airflow', thumbnailUrl: '/templates/hvac-5.png', category: 'HVAC Services' },
  { id: 'hvac-6', name: 'Direct', thumbnailUrl: '/templates/hvac-6.png', category: 'HVAC Services' },
  { id: 'hvac-7', name: 'Modern', thumbnailUrl: '/templates/hvac-7.png', category: 'HVAC Services' },
  { id: 'hvac-8', name: 'Minimalist', thumbnailUrl: '/templates/hvac-8.png', category: 'HVAC Services' },
  { id: 'hvac-9', name: 'Corporate', thumbnailUrl: '/templates/hvac-9.png', category: 'HVAC Services' },
  { id: 'hvac-10', name: 'Side Details', thumbnailUrl: '/templates/hvac-10.png', category: 'HVAC Services' },

  // Plumbing
  { id: 'plumbing-1', name: 'Pipework', thumbnailUrl: '/templates/plumbing-1.png', category: 'Plumbing' },
  { id: 'plumbing-2', name: 'Flow', thumbnailUrl: '/templates/plumbing-2.png', category: 'Plumbing' },
  { id: 'plumbing-3', name: 'Aqua', thumbnailUrl: '/templates/plumbing-3.png', category: 'Plumbing' },
  { id: 'plumbing-4', name: 'Pressure', thumbnailUrl: '/templates/plumbing-4.png', category: 'Plumbing' },
  { id: 'plumbing-5', name: 'LeakFree', thumbnailUrl: '/templates/plumbing-5.png', category: 'Plumbing' },
  { id: 'plumbing-6', name: 'Direct', thumbnailUrl: '/templates/plumbing-6.png', category: 'Plumbing' },
  { id: 'plumbing-7', name: 'Modern Blue', thumbnailUrl: '/templates/plumbing-7.png', category: 'Plumbing' },
  { id: 'plumbing-8', name: 'Clean', thumbnailUrl: '/templates/plumbing-8.png', category: 'Plumbing' },
  { id: 'plumbing-9', name: 'Side Panel', thumbnailUrl: '/templates/plumbing-9.png', category: 'Plumbing' },
  { id: 'plumbing-10', name: 'Grid', thumbnailUrl: '/templates/plumbing-10.png', category: 'Plumbing' },
  
  // Electrical
  { id: 'electrical-1', name: 'Voltage', thumbnailUrl: '/templates/electrical-1.png', category: 'Electrical Services' },
  { id: 'electrical-2', name: 'Circuit', thumbnailUrl: '/templates/electrical-2.png', category: 'Electrical Services' },
  { id: 'electrical-3', name: 'Spark', thumbnailUrl: '/templates/electrical-3.png', category: 'Electrical Services' },
  { id: 'electrical-4', name: 'Wired', thumbnailUrl: '/templates/electrical-4.png', category: 'Electrical Services' },
  { id: 'electrical-5', name: 'Power Grid', thumbnailUrl: '/templates/electrical-5.png', category: 'Electrical Services' },
  { id: 'electrical-6', name: 'Volt', thumbnailUrl: '/templates/electrical-6.png', category: 'Electrical Services' },
  { id: 'electrical-7', name: 'Sparkle', thumbnailUrl: '/templates/electrical-7.png', category: 'Electrical Services' },
  { id: 'electrical-8', name: 'Circuited', thumbnailUrl: '/templates/electrical-8.png', category: 'Electrical Services' },
  { id: 'electrical-9', name: 'Wired Up', thumbnailUrl: '/templates/electrical-9.png', category: 'Electrical Services' },
  { id: 'electrical-10', name: 'PowerGrid Pro', thumbnailUrl: '/templates/electrical-10.png', category: 'Electrical Services' },

  // Landscaping
  { id: 'landscaping-1', name: 'Garden', thumbnailUrl: '/templates/landscaping-1.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-2', name: 'Greenway', thumbnailUrl: '/templates/landscaping-2.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-3', name: 'Evergreen', thumbnailUrl: '/templates/landscaping-3.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-4', name: 'Yardly', thumbnailUrl: '/templates/landscaping-4.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-5', name: 'Terrascape', thumbnailUrl: '/templates/landscaping-5.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-6', name: 'Eco Scape', thumbnailUrl: '/templates/landscaping-6.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-7', name: 'Modern Yard', thumbnailUrl: '/templates/landscaping-7.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-8', name: 'Classic Green', thumbnailUrl: '/templates/landscaping-8.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-9', name: 'Simple Cut', thumbnailUrl: '/templates/landscaping-9.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-10', name: 'Bold Stripes', thumbnailUrl: '/templates/landscaping-10.png', category: 'Landscaping & Lawn Care' },

  // Roofing
  { id: 'roofing-1', name: 'USA Contractor', thumbnailUrl: '/templates/roofing-1.png', category: 'Roofing' },
  { id: 'roofing-2', name: 'Modern Roofing', thumbnailUrl: '/templates/roofing-2.png', category: 'Roofing' },
  { id: 'roofing-3', name: 'Classic Roofing', thumbnailUrl: '/templates/roofing-3.png', category: 'Roofing' },
  { id: 'roofing-4', name: 'Clean Grid', thumbnailUrl: '/templates/roofing-4.png', category: 'Roofing' },
  { id: 'roofing-5', name: 'Side Panel', thumbnailUrl: '/templates/roofing-5.png', category: 'Roofing' },
  { id: 'roofing-6', name: 'PeakPro', thumbnailUrl: '/templates/roofing-6.png', category: 'Roofing' },
  { id: 'roofing-7', name: 'Shingle', thumbnailUrl: '/templates/roofing-7.png', category: 'Roofing' },
  { id: 'roofing-8', name: 'Skyline', thumbnailUrl: '/templates/roofing-8.png', category: 'Roofing' },
  { id: 'roofing-9', name: 'Fortress', thumbnailUrl: '/templates/roofing-9.png', category: 'Roofing' },
  { id: 'roofing-10', name: 'Ridge', thumbnailUrl: '/templates/roofing-10.png', category: 'Roofing' },

  // Auto Repair
  { id: 'auto-repair-1', name: 'Gold Standard', thumbnailUrl: '/templates/auto-repair-1.png', category: 'Auto Repair' },
  { id: 'auto-repair-2', name: 'Night Shift', thumbnailUrl: '/templates/auto-repair-2.png', category: 'Auto Repair' },
  { id: 'auto-repair-3', name: 'Classic Garage', thumbnailUrl: '/templates/auto-repair-3.png', category: 'Auto Repair' },
  { id: 'auto-repair-4', name: 'Pro Service', thumbnailUrl: '/templates/auto-repair-4.png', category: 'Auto Repair' },
  { id: 'auto-repair-5', name: 'Gridline', thumbnailUrl: '/templates/auto-repair-5.png', category: 'Auto Repair' },

  // Cleaning
  { id: 'cleaning-1', name: 'Sparkle', thumbnailUrl: '/templates/cleaning-1.png', category: 'Cleaning Services' },
  { id: 'cleaning-2', name: 'Fresh', thumbnailUrl: '/templates/cleaning-2.png', category: 'Cleaning Services' },
  { id: 'cleaning-3', name: 'Pristine', thumbnailUrl: '/templates/cleaning-3.png', category: 'Cleaning Services' },
  { id: 'cleaning-4', name: 'Hygiene', thumbnailUrl: '/templates/cleaning-4.png', category: 'Cleaning Services' },
  { id: 'cleaning-5', name: 'Gleam', thumbnailUrl: '/templates/cleaning-5.png', category: 'Cleaning Services' },
  
  // IT Services
  { id: 'it-1', name: 'Tech Corporate', thumbnailUrl: '/templates/it-1.png', category: 'IT Services / Tech Support' },
  { id: 'it-2', name: 'Modern Dark', thumbnailUrl: '/templates/it-2.png', category: 'IT Services / Tech Support' },
  { id: 'it-3', name: 'Minimalist Grid', thumbnailUrl: '/templates/it-3.png', category: 'IT Services / Tech Support' },
  { id: 'it-4', name: 'Creative Blue', thumbnailUrl: '/templates/it-4.png', category: 'IT Services / Tech Support' },
  { id: 'it-5', name: 'Startup Vibe', thumbnailUrl: '/templates/it-5.png', category: 'IT Services / Tech Support' },
];

export function DocumentTemplateSelector({ selectedTemplate, onSelectTemplate, documentType, category }: DocumentTemplateSelectorProps) {
  
  const filteredTemplates = useMemo(() => {
    const generalCategory = documentType === 'invoice' ? 'General Services' : 'Generic';
    
    // Strict filtering: If a specific category is chosen, show only its templates.
    // If the general category is chosen, show only the general templates.
    if (category === generalCategory || !category) {
      return templates.filter(t => t.category === "General Services");
    }
    
    return templates.filter(t => t.category === category);

  }, [category, documentType]);

  const docTypeLabel = documentType === 'invoice' ? 'Invoice' : (documentType === 'quote' ? 'Quote' : 'Estimate');
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTemplates.map((template) => {
        return (
            <div
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className="cursor-pointer group"
            >
            <div
                className={cn(
                'relative rounded-lg border-2 transition-all overflow-hidden aspect-[3/4] shadow-md mx-auto',
                selectedTemplate === template.id
                    ? 'border-primary ring-4 ring-primary/20'
                    : 'border-border',
                'hover:border-primary/50'
                )}
                style={{ width: '188px' }}
            >
                <Image
                src={template.thumbnailUrl}
                alt={`${template.name} ${docTypeLabel} template`}
                width={188}
                height={250}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Select</span>
                </div>
            </div>
            <p className="text-center text-sm font-semibold p-3">{template.name}</p>
            </div>
        )
      })}
    </div>
  );
}
