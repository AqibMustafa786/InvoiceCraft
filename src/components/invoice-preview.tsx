
'use client';

import { useState, useLayoutEffect, useRef, useEffect, FC, useMemo } from 'react';
import type { Invoice, LineItem, CustomField } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { format, isValid } from 'date-fns';
import locales from '@/lib/locales';
import { ConstructionTemplate1, ConstructionTemplate2, ConstructionTemplate3, ConstructionTemplate4, ConstructionTemplate5 } from './invoice-templates/construction-templates';
import { PlumbingTemplate1, PlumbingTemplate2, PlumbingTemplate3, PlumbingTemplate4, PlumbingTemplate5 } from './invoice-templates/plumbing-templates';
import { ElectricalTemplate1, ElectricalTemplate2, ElectricalTemplate3, ElectricalTemplate4, ElectricalTemplate5 } from './invoice-templates/electrical-templates';
import { HVACTemplate1, HVACTemplate2, HVACTemplate3, HVACTemplate4, HVACTemplate5 } from './invoice-templates/hvac-templates';
import { RoofingTemplate1, RoofingTemplate2, RoofingTemplate3, RoofingTemplate4, RoofingTemplate5 } from './invoice-templates/roofing-templates';
import { LandscapingTemplate1, LandscapingTemplate2, LandscapingTemplate3, LandscapingTemplate4, LandscapingTemplate5 } from './invoice-templates/landscaping-templates';
import { CleaningTemplate1, CleaningTemplate2, CleaningTemplate3, CleaningTemplate4, CleaningTemplate5 } from './invoice-templates/cleaning-templates';
import { AutoRepairTemplate1, AutoRepairTemplate2, AutoRepairTemplate3, AutoRepairTemplate4, AutoRepairTemplate5 } from './invoice-templates/auto-repair-templates';
import { ITTemplate1, ITTemplate2, ITTemplate3, ITTemplate4, ITTemplate5 } from './invoice-templates/it-freelance-templates';
import { ConsultingTemplate1, ConsultingTemplate2, ConsultingTemplate3, ConsultingTemplate4, ConsultingTemplate5 } from './invoice-templates/consulting-templates';
import { LegalTemplate1, LegalTemplate2, LegalTemplate3, LegalTemplate4, LegalTemplate5 } from './invoice-templates/legal-templates';
import { MedicalTemplate1, MedicalTemplate2, MedicalTemplate3, MedicalTemplate4, MedicalTemplate5 } from './invoice-templates/medical-templates';
import { EcommerceTemplate1 } from './invoice-templates/ecommerce-templates';
import { RetailTemplate1 } from './invoice-templates/retail-templates';
import { PhotographyTemplate1, PhotographyTemplate2, PhotographyTemplate3, PhotographyTemplate4, PhotographyTemplate5 } from './invoice-templates/photography-templates';
import { RealEstateTemplate1, RealEstateTemplate2, RealEstateTemplate3, RealEstateTemplate4, RealEstateTemplate5 } from './invoice-templates/real-estate-templates';
import { TransportationTemplate1, TransportationTemplate2, TransportationTemplate3, TransportationTemplate4, TransportationTemplate5 } from './invoice-templates/transportation-templates';
import { RentalTemplate1, RentalTemplate2, RentalTemplate3, RentalTemplate4, RentalTemplate5 } from './invoice-templates/rental-templates';
import { toNumberSafe, toDateSafe } from '@/lib/utils';
import { CategorySpecificDetails } from './invoice-templates/category-specific-details';
import { GenericTemplate1, GenericTemplate2, GenericTemplate3, GenericTemplate4, GenericTemplate5 } from '../document-templates/generic-templates';


// --- PROPS ---
interface InvoicePreviewProps {
  invoice: Invoice;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  id?: string;
  isPrint?: boolean;
}

interface CommonTemplateProps {
  invoice: Invoice;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  t: any;
  currencySymbol: string;
}

interface PageProps extends CommonTemplateProps {
    pageItems: LineItem[];
    pageIndex: number;
    totalPages: number;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    balanceDue: number;
}

const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    PKR: '₨',
};

const safeFormat = (date: Date | string | number | null | undefined, formatString: string) => {
    if (!date) return "N/A";
    const d = toDateSafe(date);
    return isValid(d) ? format(d, formatString) : "Invalid Date";
}

// --- SHARED COMPONENTS ---

const ItemsTable: FC<{ items: LineItem[], t: any, currencySymbol: string, accentColor?: string, headerStyle?: 'filled' | 'underline' }> = ({ items, t, currencySymbol, accentColor, headerStyle = 'filled' }) => (
    <section>
        <table className="w-full text-left" style={{ pageBreakInside: 'auto' }}>
            <thead 
              data-element="table-header"
              style={headerStyle === 'filled' ? {backgroundColor: accentColor, color: 'white'} : {}} 
              className={headerStyle === 'filled' ? '' : 'border-b-2'}
            >
            <tr>
                <th className="p-3 text-sm font-semibold w-1/2">{t.item}</th>
                <th className="p-3 text-sm font-semibold text-center">{t.quantity}</th>
                <th className="p-3 text-sm font-semibold text-right">{t.rate}</th>
                <th className="p-3 text-sm font-semibold text-right">{t.subtotal}</th>
            </tr>
            </thead>
            <tbody>
            {items.map(item => (
                <tr key={item.id} className="border-b" data-element="table-row" style={{ pageBreakInside: 'avoid' }}>
                <td className="p-3 align-top">
                    <p className="font-medium whitespace-pre-line">{item.name || <span className="text-gray-400">{t.itemDescription}</span>}</p>
                    {item.description && <p className="text-xs text-muted-foreground whitespace-pre-line" style={{ wordBreak: 'break-all' }}>{item.description}</p>}
                </td>
                <td className="p-3 text-center align-top tabular-nums">{item.quantity}</td>
                <td className="p-3 text-right align-top tabular-nums">{currencySymbol}{(item.unitPrice || 0).toFixed(2)}</td>
                <td className="p-3 text-right align-top tabular-nums font-medium">{currencySymbol}{(item.quantity * (item.unitPrice || 0)).toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </section>
);

const InvoiceFooter: FC<{
    invoice: Invoice, t: any, subtotal: number, taxAmount: number, discountAmount: number, total: number, currencySymbol: string, accentColor: string, balanceDue: number
}> = ({ invoice, t, subtotal, taxAmount, discountAmount, total, currencySymbol, accentColor, balanceDue }) => (
    <div className="avoid-page-break" data-element="footer-content">
        <section className="flex justify-end mt-8">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.subtotal}</span>
                <span className="font-medium tabular-nums">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                {invoice.summary.discount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t.discount}</span>
                        <span className="font-medium text-destructive tabular-nums">-{currencySymbol}{discountAmount.toFixed(2)}</span>
                    </div>
                )}
                {invoice.summary.shippingCost > 0 && (
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping Cost</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{invoice.summary.shippingCost.toFixed(2)}</span>
                    </div>
                )}
                {invoice.summary.taxPercentage > 0 && (
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.tax} ({invoice.summary.taxPercentage}%)</span>
                <span className="font-medium tabular-nums">{currencySymbol}{taxAmount.toFixed(2)}</span>
                </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg">
                <span>{t.total}</span>
                <span className="tabular-nums">{currencySymbol}{total.toFixed(2)}</span>
                </div>
                 {(invoice.amountPaid || 0) > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-medium tabular-nums">-{currencySymbol}{(invoice.amountPaid || 0).toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center font-bold text-lg p-3 mt-2 rounded-md" style={{backgroundColor: accentColor, color: 'white'}}>
                    <span>Balance Due</span>
                    <span className="tabular-nums">{currencySymbol}{balanceDue.toFixed(2)}</span>
                </div>
            </div>
        </section>

        {invoice.paymentInstructions && (
            <footer className="mt-10" data-element="footer">
                <p className="text-sm font-semibold text-gray-500">{t.notes}</p>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{invoice.paymentInstructions}</p>
            </footer>
        )}
         {invoice.business.ownerSignature && (
            <div className="mt-8">
                <p className="text-sm font-semibold text-gray-500">Authorized Signature</p>
                <Image src={invoice.business.ownerSignature.image} alt="Owner Signature" width={150} height={75} />
            </div>
        )}
    </div>
);


const DefaultTemplatePage: FC<PageProps> = ({ pageItems, pageIndex, totalPages, ...commonProps }) => {
    const { invoice, t, currencySymbol, accentColor } = commonProps;
    const { business, client } = invoice;
    return (
        <div className={`p-8 md:p-10 flex flex-col`} style={{minHeight: '1056px', fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}px`, backgroundColor: commonProps.backgroundColor, color: commonProps.textColor }}>
            <div data-element="page-content" className="flex-grow">
                <header className="flex justify-between items-start mb-10" data-element="header">
                    <div>
                        {business.logoUrl ? (
                            <Image src={business.logoUrl} alt={`${business.name} Logo`} width={120} height={40} className="object-contain mb-2" data-ai-hint="logo" />
                        ) : (
                            <h1 className="text-3xl font-bold font-headline" style={{ color: accentColor }}>{business.name}</h1>
                        )}
                        <div className="text-sm mt-2 space-y-1">
                          <p className="whitespace-pre-line">{business.address}</p>
                          {business.phone && <p>{business.phone}</p>}
                          {business.email && <p>{business.email}</p>}
                          {business.website && <p>{business.website}</p>}
                          {business.licenseNumber && <p>{t.license || 'Lic #'}: {business.licenseNumber}</p>}
                          {business.taxId && <p>{t.taxId || 'Tax ID'}: {business.taxId}</p>}
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-400 uppercase tracking-wider">{((t.invoice as string) || 'Invoice').toUpperCase()}</h2>
                        <p className="mt-1">{invoice.invoiceNumber}</p>
                        {invoice.poNumber && <p className="text-xs">PO: {invoice.poNumber}</p>}
                    </div>
                </header>
                 <section className="flex justify-between mb-10" data-element="client-details">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-500">{((t.billTo as string) || 'BILL TO').toUpperCase()}</p>
                        <p className="font-bold">{client.name}</p>
                        {client.companyName && <p>{client.companyName}</p>}
                        <p className="text-sm whitespace-pre-line">{client.address}</p>
                        {client.phone && <p className="text-sm">{client.phone}</p>}
                        {client.email && <p className="text-sm">{client.email}</p>}
                        {client.shippingAddress && <p className="text-sm mt-2"><span className="font-bold">Ship To:</span><br/>{client.shippingAddress}</p>}
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-sm font-semibold text-gray-500">{((t.invoiceDate as string) || 'Invoice Date').toUpperCase()}</p>
                        <p>{safeFormat(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
                        <p className="text-sm font-semibold text-gray-500 mt-2">{((t.dueDate as string) || 'Due Date').toUpperCase()}</p>
                        <p>{safeFormat(invoice.dueDate, 'MMMM d, yyyy')}</p>
                    </div>
                </section>
                <div data-element="category-details">
                    <CategorySpecificDetails invoice={invoice} t={t} />
                </div>
                <ItemsTable items={pageItems} {...commonProps} />
            </div>
            {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
        </div>
    );
};

// --- TEMPLATE: Modern ---
const ModernTemplatePage: FC<PageProps> = ({ pageItems, pageIndex, totalPages, ...commonProps }) => {
    const { invoice, t, currencySymbol, accentColor } = commonProps;
    const { business, client } = invoice;
    return (
     <div className={`p-8 md:p-10 flex flex-col`} style={{minHeight: '1056px', fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}px`, backgroundColor: commonProps.backgroundColor, color: commonProps.textColor }}>
        <div data-element="page-content" className="flex-grow">
            <div className="flex justify-between items-center pb-4 border-b-4" style={{borderColor: accentColor}} data-element="header">
                 <div>
                    {business.logoUrl ? (
                        <Image src={business.logoUrl} alt={`${business.name} Logo`} width={100} height={40} className="object-contain" />
                    ) : (
                        <h1 className="text-2xl font-bold font-headline">{business.name}</h1>
                    )}
                 </div>
                 <h2 className="text-3xl font-bold uppercase" style={{color: accentColor}}>{((t.invoice as string) || 'Invoice').toUpperCase()}</h2>
            </div>
             <section className="flex justify-between my-8 text-sm" data-element="client-details">
                <div className="space-y-1">
                    <p className="font-bold">{business.name}</p>
                    <p className="whitespace-pre-line">{business.address}</p>
                    <p>{business.phone}</p>
                    <p>{business.email}</p>
                    {business.website && <p>{business.website}</p>}
                    {business.licenseNumber && <p>Lic#: {business.licenseNumber}</p>}
                    {business.taxId && <p>Tax ID: {business.taxId}</p>}
                </div>
                <div className="space-y-1 text-right">
                    <p className="font-bold">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                </div>
            </section>
             <section className="flex justify-between my-8 text-sm" data-element="invoice-meta">
                <div className="space-y-1">
                    <p className="font-bold">Invoice #</p>
                    <p>{invoice.invoiceNumber}</p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="font-bold">Date</p>
                    <p>{safeFormat(invoice.invoiceDate, 'MM/dd/yyyy')}</p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="font-bold">Due Date</p>
                    <p>{safeFormat(invoice.dueDate, 'MM/dd/yyyy')}</p>
                </div>
                 <div className="space-y-1 text-right">
                    <p className="font-bold">PO #</p>
                    <p>{invoice.poNumber || 'N/A'}</p>
                </div>
            </section>
             <div data-element="category-details">
                <CategorySpecificDetails invoice={invoice} t={t} />
            </div>
            <ItemsTable items={pageItems} {...commonProps} accentColor={accentColor} />
        </div>
        {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
    </div>
    )
};

// --- TEMPLATE: Minimalist ---
const MinimalistTemplatePage: FC<PageProps> = ({ pageItems, pageIndex, totalPages, ...commonProps }) => {
    const { invoice, t } = commonProps;
    const { business, client } = invoice;
    return (
    <div className={`p-12 flex flex-col`} style={{minHeight: '1056px', fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}px`, backgroundColor: commonProps.backgroundColor, color: commonProps.textColor }}>
        <div data-element="page-content" className="flex-grow">
            <header data-element="header" className="mb-12">
                <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <h2 className="text-2xl font-light uppercase text-gray-500">{((t.invoice as string) || 'Invoice').toUpperCase()}</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{business.address} | {business.phone} | {business.email}</p>
            </header>
            <section data-element="client-details" className="grid grid-cols-4 gap-4 mb-12 text-xs">
                <div className="space-y-1 col-span-2">
                    <p className="text-gray-500 uppercase tracking-widest">Billed To</p>
                    <p className="font-medium">{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-gray-500 uppercase tracking-widest">Invoice #</p>
                    <p className="font-medium">{invoice.invoiceNumber}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-gray-500 uppercase tracking-widest">Date</p>
                    <p className="font-medium">{safeFormat(invoice.invoiceDate, 'yyyy-MM-dd')}</p>
                </div>
                 <div className="space-y-1 col-span-2">
                    <p className="text-gray-500 uppercase tracking-widest">Shipping Address</p>
                    <p className="font-medium">{client.shippingAddress || 'N/A'}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-gray-500 uppercase tracking-widest">PO Number</p>
                    <p className="font-medium">{invoice.poNumber || 'N/A'}</p>
                </div>
            </section>
             <div data-element="category-details">
                <CategorySpecificDetails invoice={invoice} t={t} />
            </div>
            <ItemsTable items={pageItems} {...commonProps} headerStyle="underline" />
        </div>
        {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
    </div>
    )
};

// --- TEMPLATE: Creative ---
const CreativeTemplatePage: FC<PageProps> = ({ pageItems, pageIndex, totalPages, ...commonProps }) => {
    const { invoice, t, accentColor } = commonProps;
    const { business, client } = invoice;
    return (
    <div className={`p-8 relative flex flex-col`} style={{minHeight: '1056px', fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}px`, backgroundColor: commonProps.backgroundColor, color: commonProps.textColor }}>
        <div className="absolute top-0 left-0 w-full h-48" style={{backgroundColor: accentColor, opacity: 0.1}}></div>
        <div data-element="page-content" className="flex-grow z-10">
            <header data-element="header" className="flex justify-between items-center mb-12">
                <div>
                    {business.logoUrl && <Image src={business.logoUrl} alt="logo" width={80} height={80} className="rounded-full" />}
                    <h1 className="text-3xl font-bold mt-2">{business.name}</h1>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-extrabold uppercase" style={{color: accentColor}}>{((t.invoice as string) || 'Invoice').toUpperCase()}</h2>
                    <p className="text-sm mt-1">{invoice.invoiceNumber}</p>
                </div>
            </header>
            <section data-element="client-details" className="mb-10 text-sm">
                <p className="text-gray-500">Billed to:</p>
                <p className="font-bold text-lg">{client.name}</p>
                {client.companyName && <p>{client.companyName}</p>}
                <p className="whitespace-pre-line">{client.address}</p>
                <p>{client.phone}</p>
                <p>{client.email}</p>
            </section>
             <div data-element="category-details">
                <CategorySpecificDetails invoice={invoice} t={t} />
            </div>
            <ItemsTable items={pageItems} {...commonProps} accentColor={accentColor} />
        </div>
        {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
    </div>
    )
};

// --- TEMPLATE: Elegant ---
const ElegantTemplatePage: FC<PageProps> = ({ pageItems, pageIndex, totalPages, ...commonProps }) => {
    const { invoice, t } = commonProps;
    const { business, client } = invoice;
    return (
    <div className={`p-10 flex flex-col`} style={{minHeight: '1056px', fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}px`, backgroundColor: commonProps.backgroundColor, color: commonProps.textColor }}>
        <div data-element="page-content" className="flex-grow">
            <header data-element="header" className="text-center mb-16">
                {business.logoUrl && <Image src={business.logoUrl} alt="logo" width={100} height={50} className="mx-auto mb-4 object-contain" />}
                <h1 className="text-4xl font-bold tracking-tight">{business.name}</h1>
                <p className="text-xs text-gray-500 mt-2 tracking-widest whitespace-pre-line">{business.address} | {business.phone}</p>
            </header>
            <div className="w-full h-px bg-gray-300 mb-10"></div>
            <section data-element="client-details" className="flex justify-between items-center mb-10 text-sm">
                <div>
                    <p className="font-bold">Billed to: {client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p>{client.address}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Invoice Number:</span> {invoice.invoiceNumber}</p>
                    <p><span className="font-bold">Date of Issue:</span> {safeFormat(invoice.invoiceDate, 'MMMM dd, yyyy')}</p>
                    <p><span className="font-bold">PO Number:</span> {invoice.poNumber || 'N/A'}</p>
                </div>
            </section>
             <div data-element="category-details">
                <CategorySpecificDetails invoice={invoice} t={t} />
            </div>
            <ItemsTable items={pageItems} {...commonProps} headerStyle="underline" />
        </div>
        {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
    </div>
    )
};

// --- TEMPLATE: USA ---
const UsaTemplatePage: FC<PageProps> = ({ pageItems, pageIndex, totalPages, ...commonProps }) => {
    const { invoice, t, accentColor, subtotal, currencySymbol } = commonProps;
    const { business, client } = invoice;

    return (
        <div className={`invoice-page font-sans text-gray-800`} style={{fontFamily: invoice.fontFamily, fontSize: `${invoice.fontSize}px`, backgroundColor: commonProps.backgroundColor, color: commonProps.textColor }}>
            <div className="p-8 m-4 border-2" style={{ borderColor: accentColor }}>
                <header className="grid grid-cols-2 gap-10 mb-8" data-element="header">
                     <div>
                        {business.logoUrl ? (
                            <Image src={business.logoUrl} alt={`${business.name} Logo`} width={160} height={80} className="object-contain mb-2" data-ai-hint="logo" />
                        ) : (
                            <h1 className="text-3xl font-bold mb-1" style={{color: accentColor}}>{business.name}</h1>
                        )}
                        <p className="text-xs text-gray-600 whitespace-pre-line">{business.address}</p>
                    </div>
                     <div className="text-right">
                        <h2 className="text-4xl font-bold">INVOICE</h2>
                        <div className="mt-4 text-xs space-y-1">
                            <p><span className="font-bold text-gray-500">Invoice #:</span> {invoice.invoiceNumber}</p>
                            <p><span className="font-bold text-gray-500">Date:</span> {safeFormat(invoice.invoiceDate, 'M/d/yyyy')}</p>
                        </div>
                    </div>
                </header>
                 <section className="mb-8 text-xs" data-element="client-details">
                    <div className="p-3 bg-gray-50 rounded-md">
                        <p className="font-bold text-gray-600 border-b mb-1">Bill To</p>
                        <p>{client.name}</p>
                        <p>{client.address}</p>
                        {invoice.poNumber && <p className="mt-2"><span className="font-bold">PO #: </span>{invoice.poNumber}</p>}
                    </div>
                </section>
                 <div data-element="category-details">
                    <CategorySpecificDetails invoice={invoice} t={t} />
                </div>
                <main>
                    <table className="w-full border-collapse border text-sm" data-element="items-table">
                        <thead data-element="table-header">
                            <tr className="bg-gray-100">
                                <th className="border p-2 font-bold w-full text-left">Description</th>
                                <th className="border p-2 font-bold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems?.filter(Boolean).map((item) => (
                                <tr key={item.id} data-element="table-row">
                                    <td className="border p-2 align-top h-8 whitespace-pre-line">{item.name}{item.description && `\n${item.description}`}</td>
                                    <td className="border p-2 text-right align-top">{currencySymbol}{(item.quantity * ((item as any).unitPrice || 0)).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                         <tfoot className="text-sm font-medium">
                           {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
                        </tfoot>
                    </table>
                </main>
            </div>
        </div>
    );
};


const templates: Record<string, FC<PageProps>> = {
  'default': DefaultTemplatePage,
  'modern': ModernTemplatePage,
  'minimalist': MinimalistTemplatePage,
  'creative': CreativeTemplatePage,
  'elegant': ElegantTemplatePage,
  'usa': UsaTemplatePage,
  'construction-1': ConstructionTemplate1,
  'construction-2': ConstructionTemplate2,
  'construction-3': ConstructionTemplate3,
  'construction-4': ConstructionTemplate1,
  'construction-5': ConstructionTemplate2,
  'construction-6': ConstructionTemplate3,
  'plumbing-1': PlumbingTemplate1,
  'plumbing-2': PlumbingTemplate2,
  'plumbing-3': PlumbingTemplate3,
  'plumbing-4': PlumbingTemplate4,
  'plumbing-5': PlumbingTemplate5,
  'electrical-1': ElectricalTemplate1,
  'electrical-2': ElectricalTemplate2,
  'electrical-3': ElectricalTemplate3,
  'electrical-4': ElectricalTemplate4,
  'electrical-5': ElectricalTemplate5,
  'hvac-1': HVACTemplate1,
  'hvac-2': HVACTemplate2,
  'hvac-3': HVACTemplate3,
  'hvac-4': HVACTemplate4,
  'hvac-5': HVACTemplate5,
  'roofing-1': RoofingTemplate1,
  'roofing-2': RoofingTemplate2,
  'roofing-3': RoofingTemplate3,
  'roofing-4': RoofingTemplate4,
  'roofing-5': RoofingTemplate5,
  'landscaping-1': LandscapingTemplate1,
  'landscaping-2': LandscapingTemplate2,
  'landscaping-3': LandscapingTemplate3,
  'landscaping-4': LandscapingTemplate4,
  'landscaping-5': LandscapingTemplate5,
  'cleaning-1': CleaningTemplate1,
  'cleaning-2': CleaningTemplate2,
  'cleaning-3': CleaningTemplate3,
  'cleaning-4': CleaningTemplate4,
  'cleaning-5': CleaningTemplate5,
  'auto-repair-1': AutoRepairTemplate1,
  'auto-repair-2': AutoRepairTemplate2,
  'auto-repair-3': AutoRepairTemplate3,
  'auto-repair-4': AutoRepairTemplate4,
  'auto-repair-5': AutoRepairTemplate5,
  'it-1': ITTemplate1,
  'it-2': ITTemplate2,
  'it-3': ITTemplate3,
  'it-4': ITTemplate4,
  'it-5': ITTemplate5,
  'freelance-1': ITTemplate1,
  'consulting-1': ConsultingTemplate1,
  'consulting-2': ConsultingTemplate2,
  'consulting-3': ConsultingTemplate3,
  'consulting-4': ConsultingTemplate4,
  'consulting-5': ConsultingTemplate5,
  'legal-1': LegalTemplate1,
  'legal-2': LegalTemplate2,
  'legal-3': LegalTemplate3,
  'legal-4': LegalTemplate4,
  'legal-5': LegalTemplate5,
  'medical-1': MedicalTemplate1,
  'medical-2': MedicalTemplate2,
  'medical-3': MedicalTemplate3,
  'medical-4': MedicalTemplate4,
  'medical-5': MedicalTemplate5,
  'ecommerce-1': EcommerceTemplate1,
  'retail-1': RetailTemplate1,
  'photography-1': PhotographyTemplate1,
  'photography-2': PhotographyTemplate2,
  'photography-3': PhotographyTemplate3,
  'photography-4': PhotographyTemplate4,
  'photography-5': PhotographyTemplate5,
  'real-estate-1': RealEstateTemplate1,
  'real-estate-2': RealEstateTemplate2,
  'real-estate-3': RealEstateTemplate3,
  'real-estate-4': RealEstateTemplate4,
  'real-estate-5': RealEstateTemplate5,
  'transportation-1': TransportationTemplate1,
  'transportation-2': TransportationTemplate2,
  'transportation-3': TransportationTemplate3,
  'transportation-4': TransportationTemplate4,
  'transportation-5': TransportationTemplate5,
  'rental-1': RentalTemplate1,
  'rental-2': RentalTemplate2,
  'rental-3': RentalTemplate3,
  'rental-4': RentalTemplate4,
  'rental-5': RentalTemplate5,
};

const PAGE_HEIGHT = 1056;
const PAGE_PADDING_TOP = 80;
const PAGE_PADDING_BOTTOM = 80;


const InvoicePreviewInternal: FC<InvoicePreviewProps> = ({ invoice, accentColor, backgroundColor, textColor, id = 'invoice-preview', isPrint = false }) => {
  const [paginatedItems, setPaginatedItems] = useState<LineItem[][]>([invoice?.lineItems || []]);
  const [needsRemeasure, setNeedsRemeasure] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const serializedInvoice = useMemo(() => JSON.stringify(invoice), [invoice]);

  const t = locales[invoice.language as keyof locales] || locales.en;
  
  const subtotal = invoice.lineItems.reduce((acc, item) => acc + item.quantity * ((item as any).unitPrice || 0), 0);
  const taxAmount = (subtotal * invoice.summary.taxPercentage) / 100;
  const discountAmount = invoice.summary.discount;
  const total = subtotal + taxAmount - discountAmount + (invoice.summary.shippingCost || 0);
  const balanceDue = total - (invoice.amountPaid || 0);
  const currencySymbol = currencySymbols[invoice.currency] || '$';

  useEffect(() => {
    setNeedsRemeasure(true);
  }, [serializedInvoice]);


  const previewStyle = {
      '--primary-hsl': accentColor,
      '--primary': accentColor,
      fontFamily: invoice.fontFamily || 'Inter, sans-serif',
      fontSize: `${invoice.fontSize || 10}pt`,
      backgroundColor: backgroundColor || '#FFFFFF',
      color: textColor || '#374151',
  } as React.CSSProperties;

  const getTemplateComponent = () => {
    const templateId = invoice.template;
    return templates[templateId] || DefaultTemplatePage;
  };

  const TemplateComponent = getTemplateComponent();
  
   useLayoutEffect(() => {
    if (!isPrint || !needsRemeasure) return;

    const measureAndPaginate = () => {
      const container = containerRef.current;
      if (!container || !document.body.contains(container)) {
        // If container isn't in the DOM yet, retry.
        requestAnimationFrame(measureAndPaginate);
        return;
      }

      // Clone just the first page for measurement purposes
      const firstPage = container.querySelector('[data-element="page-container"]');
      if (!firstPage) return;

      const tempRoot = document.createElement('div');
      tempRoot.style.position = 'absolute';
      tempRoot.style.left = '-9999px';
      tempRoot.style.width = `${container.clientWidth}px`;
      document.body.appendChild(tempRoot);

      try {
        const tempContainer = firstPage.cloneNode(true) as HTMLElement;
        tempRoot.appendChild(tempContainer);
        
        // Let browser render the cloned content
        requestAnimationFrame(() => {
            const header = tempContainer.querySelector('[data-element="header"]') as HTMLElement;
            const clientDetails = tempContainer.querySelector('[data-element="client-details"]') as HTMLElement;
            const invoiceMeta = tempContainer.querySelector('[data-element="invoice-meta"]') as HTMLElement;
            const categoryDetails = tempContainer.querySelector('[data-element="category-details"]') as HTMLElement;
            const tableHeader = tempContainer.querySelector('[data-element="table-header"]') as HTMLElement;
            const allRows = Array.from(tempContainer.querySelectorAll('[data-element="table-row"]')) as HTMLElement[];
            
            if (!header || !tableHeader || allRows.length === 0) {
              setNeedsRemeasure(false);
              document.body.removeChild(tempRoot);
              return;
            }

            const headerHeight = header.offsetHeight + (clientDetails?.offsetHeight || 0) + (invoiceMeta?.offsetHeight || 0) + (categoryDetails?.offsetHeight || 0);
            const tableHeaderHeight = tableHeader.offsetHeight;
            const footerHeight = 250; // Estimate footer height

            const firstPageAvailableHeight = PAGE_HEIGHT - PAGE_PADDING_TOP - PAGE_PADDING_BOTTOM - headerHeight - tableHeaderHeight;
            const subsequentPageAvailableHeight = PAGE_HEIGHT - PAGE_PADDING_TOP - PAGE_PADDING_BOTTOM - headerHeight - tableHeaderHeight;

            let pages: LineItem[][] = [];
            let currentPageItems: LineItem[] = [];
            let currentHeight = 0;

            allRows.forEach((row, index) => {
                const itemHeight = row.offsetHeight;
                const isFirstPage = pages.length === 0;
                const availableHeight = isFirstPage ? firstPageAvailableHeight : subsequentPageAvailableHeight;
                
                if (currentHeight + itemHeight > availableHeight) {
                    pages.push(currentPageItems);
                    currentPageItems = [];
                    currentHeight = 0;
                }
                
                currentPageItems.push(invoice.lineItems[index]);
                currentHeight += itemHeight;
            });

            pages.push(currentPageItems);

            setPaginatedItems(pages.filter(p => p.length > 0));
            setNeedsRemeasure(false);
        });

      } finally {
        // Clean up asynchronously to be safe
        setTimeout(() => {
          if (document.body.contains(tempRoot)) {
            document.body.removeChild(tempRoot);
          }
        }, 100);
      }
    };

    measureAndPaginate();
  }, [serializedInvoice, isPrint, needsRemeasure, TemplateComponent, invoice]);


  const commonProps: Omit<PageProps, 'pageItems' | 'pageIndex' | 'totalPages'> = {
    invoice,
    accentColor,
    backgroundColor,
    textColor,
    t,
    currencySymbol,
    subtotal,
    taxAmount,
    discountAmount,
    total,
    balanceDue,
  };
  
  if (isPrint) {
    const itemsToRender = needsRemeasure ? [invoice.lineItems] : (paginatedItems.length > 0 ? paginatedItems : [[]]);
    
    return (
      <div id={id} ref={containerRef}>
        {itemsToRender.map((pageItems, pageIndex) => (
          <div key={pageIndex} data-element="page-container" className={pageIndex < itemsToRender.length - 1 ? "page-break-after" : ""}>
             <TemplateComponent
                {...commonProps}
                pageItems={pageItems}
                pageIndex={pageIndex}
                totalPages={itemsToRender.length}
              />
          </div>
        ))}
      </div>
    );
  }

  // Default live preview (single page)
  return (
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide hover:shadow-primary/20 transition-shadow" style={{backgroundColor: backgroundColor}}>
      <CardContent className="p-0" style={{color: textColor}}>
          <div data-element="page-container">
            <TemplateComponent
              {...commonProps}
              pageItems={invoice.lineItems}
              pageIndex={0}
              totalPages={1}
            />
          </div>
      </CardContent>
    </Card>
  );
}

export const ClientInvoicePreview: FC<InvoicePreviewProps> = (props) => {
    const processedInvoice = useMemo(() => {
        if (!props.invoice) return null;
        // Deep copy and process dates
        const newInvoice = JSON.parse(JSON.stringify(props.invoice));
        newInvoice.invoiceDate = toDateSafe(newInvoice.invoiceDate);
        newInvoice.dueDate = toDateSafe(newInvoice.dueDate);
        // Process any other date fields here if necessary
        return newInvoice;
    }, [props.invoice]);
    
    if (!processedInvoice) {
        return (
            <Card id={props.id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide">
                <CardContent className="p-8 text-center text-muted-foreground">
                    Loading Preview...
                </CardContent>
            </Card>
        );
    }
    return <InvoicePreviewInternal {...props} invoice={processedInvoice} />;
}


export { InvoicePreviewInternal as InvoicePreview };
