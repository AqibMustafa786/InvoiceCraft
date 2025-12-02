
'use client';

import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { format, isValid } from 'date-fns';
import locales from '@/lib/locales';

// --- PROPS ---
interface InvoicePreviewProps {
  invoice: Invoice;
  logoUrl: string | null;
  accentColor: string;
  id?: string;
  isPrint?: boolean;
}

interface CommonTemplateProps {
  invoice: Invoice;
  logoUrl: string | null;
  accentColor: string;
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

const safeFormat = (date: Date | string | number, formatString: string) => {
    const d = new Date(date || new Date());
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

// --- SHARED COMPONENTS ---
const InvoiceHeader = ({ invoice, logoUrl, accentColor, t }: CommonTemplateProps) => (
    <header className="flex justify-between items-start mb-10" data-element="header">
        <div>
            {logoUrl ? (
                <Image src={logoUrl} alt={`${invoice.companyName} Logo`} width={120} height={40} className="object-contain" data-ai-hint="logo" />
            ) : (
                <h1 className="text-3xl font-bold font-headline" style={{ color: accentColor }}>{invoice.companyName}</h1>
            )}
            <div className="text-muted-foreground text-sm mt-2 space-y-1">
              <p className="whitespace-pre-line">{invoice.companyAddress}</p>
              {invoice.companyPhone && <p>{invoice.companyPhone}</p>}
            </div>
        </div>
        <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-400 uppercase tracking-wider">{t.invoice}</h2>
            <p className="text-muted-foreground mt-1">{invoice.invoiceNumber}</p>
        </div>
    </header>
);

const ClientDetails = ({ invoice, t }: { invoice: Invoice, t: any }) => (
     <section className="flex justify-between mb-10" data-element="client-details">
        <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-500">{t.billTo}</p>
            <p className="font-bold">{invoice.clientName}</p>
            <p className="text-muted-foreground text-sm whitespace-pre-line">{invoice.clientAddress}</p>
        </div>
        <div className="text-right space-y-1">
            <p className="text-sm font-semibold text-gray-500">{t.invoiceDate}</p>
            <p>{safeFormat(new Date(invoice.invoiceDate || new Date()), 'MMMM d, yyyy')}</p>
            <p className="text-sm font-semibold text-gray-500 mt-2">{t.dueDate}</p>
            <p>{safeFormat(new Date(invoice.dueDate || new Date()), 'MMMM d, yyyy')}</p>
        </div>
    </section>
);

const ItemsTable = ({ items, t, currencySymbol, accentColor, tableRef }: { items: LineItem[], t: any, currencySymbol: string, accentColor?: string, tableRef?: React.RefObject<HTMLTableElement> }) => (
    <section>
        <table className="w-full text-left" ref={tableRef}>
            <thead style={accentColor ? {backgroundColor: accentColor, color: 'white'} : {}} className={accentColor ? '' : "bg-gray-50"} data-element="table-header">
            <tr>
                <th className="p-3 text-sm font-semibold w-1/2">{t.item}</th>
                <th className="p-3 text-sm font-semibold text-center">{t.quantity}</th>
                <th className="p-3 text-sm font-semibold text-right">{t.rate}</th>
                <th className="p-3 text-sm font-semibold text-right">{t.subtotal}</th>
            </tr>
            </thead>
            <tbody>
            {items.map(item => (
                <tr key={item.id} className="border-b" data-element="table-row">
                <td className="p-3 whitespace-pre-line">{item.name || <span className="text-gray-400">{t.itemDescription}</span>}</td>
                <td className="p-3 text-center tabular-nums">{item.quantity}</td>
                <td className="p-3 text-right tabular-nums">{currencySymbol}{(item as any).rate ? (item as any).rate.toFixed(2) : (item as any).unitPrice.toFixed(2)}</td>
                <td className="p-3 text-right tabular-nums font-medium">{currencySymbol}{(item.quantity * ((item as any).rate || (item as any).unitPrice)).toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </section>
);

const InvoiceFooter = ({ invoice, t, subtotal, taxAmount, discountAmount, total, currencySymbol, accentColor, balanceDue, footerRef }: {
    invoice: Invoice, t: any, subtotal: number, taxAmount: number, discountAmount: number, total: number, currencySymbol: string, accentColor: string, balanceDue: number, footerRef?: React.RefObject<HTMLDivElement>
}) => (
    <div className="avoid-page-break" ref={footerRef}>
        <section className="flex justify-end mt-8">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.subtotal}</span>
                <span className="font-medium tabular-nums">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t.discount} ({invoice.discount}%)</span>
                        <span className="font-medium text-destructive tabular-nums">-{currencySymbol}{discountAmount.toFixed(2)}</span>
                    </div>
                )}
                {invoice.shippingCost > 0 && (
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping Cost</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{invoice.shippingCost.toFixed(2)}</span>
                    </div>
                )}
                {invoice.tax > 0 && (
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.tax} ({invoice.tax}%)</span>
                <span className="font-medium tabular-nums">{currencySymbol}{taxAmount.toFixed(2)}</span>
                </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg">
                <span>{t.total}</span>
                <span className="tabular-nums">{currencySymbol}{total.toFixed(2)}</span>
                </div>
                 {invoice.amountPaid > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-medium tabular-nums">-{currencySymbol}{invoice.amountPaid.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center font-bold text-lg p-3 mt-2 rounded-md" style={{backgroundColor: accentColor, color: 'white'}}>
                    <span>Balance Due</span>
                    <span className="tabular-nums">{currencySymbol}{balanceDue.toFixed(2)}</span>
                </div>
            </div>
        </section>

        {invoice.paymentInstructions && (
            <footer className="mt-10">
                <p className="text-sm font-semibold text-gray-500">{t.notes}</p>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{invoice.paymentInstructions}</p>
            </footer>
        )}
    </div>
);


// --- TEMPLATE: Default ---
const DefaultTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => (
    <div className={`invoice-page ${pageIndex < totalPages - 1 ? "page-break" : ""}`}>
        <div className="p-8 md:p-10">
            <InvoiceHeader {...commonProps} />
            <ClientDetails invoice={commonProps.invoice} t={commonProps.t} />
            <ItemsTable items={pageItems} t={commonProps.t} currencySymbol={commonProps.currencySymbol} />
            {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} balanceDue={commonProps.balanceDue} />}
        </div>
    </div>
);


// --- TEMPLATE: Modern ---
const ModernTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => (
     <div className={`invoice-page ${pageIndex < totalPages - 1 ? "page-break" : ""}`}>
        <div className="p-8 md:p-10">
            <header className="mb-10" data-element="header">
                <div className="p-6 rounded-lg flex justify-between items-start" style={{backgroundColor: commonProps.accentColor, color: 'white'}}>
                    <div>
                        {commonProps.logoUrl ? (
                            <div className="bg-white p-2 rounded-md inline-block">
                                <Image src={commonProps.logoUrl} alt={`${commonProps.invoice.companyName} Logo`} width={120} height={40} className="object-contain" data-ai-hint="logo"/>
                            </div>
                        ) : (
                            <h1 className="text-3xl font-bold font-headline">{commonProps.invoice.companyName}</h1>
                        )}
                        <div className="text-white/80 text-sm mt-2 space-y-1">
                            <p className="whitespace-pre-line">{commonProps.invoice.companyAddress}</p>
                            {commonProps.invoice.companyPhone && <p>{commonProps.invoice.companyPhone}</p>}
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold uppercase tracking-wider">{commonProps.t.invoice}</h2>
                        <p className="text-sm mt-1">{commonProps.invoice.invoiceNumber}</p>
                    </div>
                </div>
            </header>
            <ClientDetails invoice={commonProps.invoice} t={commonProps.t} />
            <ItemsTable items={pageItems} t={commonProps.t} currencySymbol={commonProps.currencySymbol} accentColor={commonProps.accentColor} />
            {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} balanceDue={commonProps.balanceDue} />}
        </div>
    </div>
)

// --- TEMPLATE: Elegant ---
const ElegantTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => (
    <div className={`invoice-page ${pageIndex < totalPages - 1 ? "page-break" : ""}`}>
        <div className="p-8 md:p-10 m-4 border">
            <header className="text-center mb-12" data-element="header">
                <div>
                    {commonProps.logoUrl ? (
                        <Image src={commonProps.logoUrl} alt={`${commonProps.invoice.companyName} Logo`} width={120} height={40} className="object-contain mx-auto mb-4" data-ai-hint="logo" />
                    ) : (
                        <h1 className="text-4xl font-bold font-headline" style={{ color: commonProps.accentColor }}>{commonProps.invoice.companyName}</h1>
                    )}
                    <div className="text-muted-foreground text-sm mt-2 space-y-1">
                        <p className="whitespace-pre-line">{commonProps.invoice.companyAddress}</p>
                        {commonProps.invoice.companyPhone && <p>{commonProps.invoice.companyPhone}</p>}
                    </div>
                </div>
            </header>
            <div className="flex justify-between items-start mb-8" data-element="client-details">
                <div className="text-left space-y-1">
                    <p className="text-sm font-semibold text-gray-500">{commonProps.t.billTo}</p>
                    <p className="font-bold">{commonProps.invoice.clientName}</p>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{commonProps.invoice.clientAddress}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold text-gray-800 uppercase tracking-wider mb-2">{commonProps.t.invoice}</h2>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-end">
                            <span className="font-semibold text-gray-500 w-28 text-left">{commonProps.t.invoice} #: &nbsp;</span>
                            <span className="w-24 text-right">{commonProps.invoice.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-end">
                            <span className="font-semibold text-gray-500 w-28 text-left">{commonProps.t.invoiceDate}: &nbsp;</span>
                            <span className="w-24 text-right">{safeFormat(new Date(commonProps.invoice.invoiceDate || new Date()), 'yyyy-MM-dd')}</span>
                        </div>
                         <div className="flex justify-end">
                            <span className="font-semibold text-gray-500 w-28 text-left">{commonProps.t.dueDate}: &nbsp;</span>
                            <span className="w-24 text-right">{safeFormat(new Date(commonProps.invoice.dueDate || new Date()), 'yyyy-MM-dd')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ItemsTable items={pageItems} t={commonProps.t} currencySymbol={commonProps.currencySymbol} />
            {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} balanceDue={commonProps.balanceDue} />}
        </div>
    </div>
)

// --- TEMPLATE: USA ---
const UsaTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => {
    const { invoice, logoUrl, t, currencySymbol, balanceDue, accentColor } = commonProps;
    const finalShippingAddress = invoice.shippingAddress || invoice.clientAddress;

    return (
        <div className={`invoice-page ${pageIndex < totalPages - 1 ? "page-break" : ""}`}>
            <div className="p-10 font-sans text-sm text-gray-800">
                <header className="flex justify-between items-start pb-6 border-b-2" style={{borderColor: accentColor}} data-element="header">
                    <div className="w-1/2">
                        {logoUrl ? (
                            <Image src={logoUrl} alt={`${invoice.companyName} Logo`} width={160} height={80} className="object-contain" data-ai-hint="logo" />
                        ) : (
                             <h1 className="text-3xl font-bold font-headline" style={{ color: accentColor }}>{invoice.companyName}</h1>
                        )}
                        <div className="mt-4 text-xs text-gray-500 space-y-1">
                            <p className="font-bold text-base text-gray-700">{invoice.companyName}</p>
                            <p className="whitespace-pre-line">{invoice.companyAddress}</p>
                            {invoice.companyPhone && <p>{invoice.companyPhone}</p>}
                        </div>
                    </div>
                    <div className="w-1/2 text-right">
                        <h2 className="text-4xl font-bold uppercase" style={{color: accentColor}}>INVOICE</h2>
                         <div className="mt-4 space-y-1 text-xs">
                            <div className="flex justify-end">
                                <span className="text-gray-500 w-28 text-right">Invoice #</span>
                                <span className="w-28 text-right font-medium">{invoice.invoiceNumber}</span>
                            </div>
                            {invoice.poNumber && (
                                <div className="flex justify-end">
                                    <span className="text-gray-500 w-28 text-right">PO Number</span>
                                    <span className="w-28 text-right font-medium">{invoice.poNumber}</span>
                                </div>
                            )}
                            <div className="flex justify-end">
                                <span className="text-gray-500 w-28 text-right">Invoice Date</span>
                                <span className="w-28 text-right font-medium">{safeFormat(new Date(invoice.invoiceDate || new Date()), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex justify-end">
                                <span className="text-gray-500 w-28 text-right">Due Date</span>
                                <span className="w-28 text-right font-medium">{safeFormat(new Date(invoice.dueDate || new Date()), 'MMM d, yyyy')}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-8 mt-6" data-element="client-details">
                    <div>
                        <p className="font-bold text-xs uppercase text-gray-500">Bill To</p>
                        <p className="font-bold text-gray-700">{invoice.clientName}</p>
                        <p className="text-gray-600 text-xs whitespace-pre-line">{invoice.clientAddress}</p>
                    </div>
                     <div>
                        <p className="font-bold text-xs uppercase text-gray-500">Ship To</p>
                        <p className="font-bold text-gray-700">{invoice.clientName}</p>
                        <p className="text-gray-600 text-xs whitespace-pre-line">{finalShippingAddress}</p>
                        {invoice.trackingNumber && <p className="text-xs text-gray-500 mt-2">Track #: {invoice.trackingNumber}</p>}
                    </div>
                </section>
                
                 <section className="mt-8">
                    <table className="w-full text-left" data-element="items-table">
                        <thead>
                        <tr style={{backgroundColor: accentColor, color: 'white'}} className="text-xs uppercase" data-element="table-header">
                            <th className="p-3 font-semibold w-1/2">Description</th>
                            <th className="p-3 font-semibold text-right">Quantity</th>
                            <th className="p-3 font-semibold text-right">Rate</th>
                            <th className="p-3 font-semibold text-right">Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b" data-element="table-row">
                                <td className="p-3 align-top">
                                    <p className="font-medium">{item.name || <span className="text-gray-400">Item description</span>}</p>
                                </td>
                                <td className="p-3 text-right tabular-nums align-top">{item.quantity}</td>
                                <td className="p-3 text-right tabular-nums align-top">{currencySymbol}{(item as any).rate ? (item as any).rate.toFixed(2) : (item as any).unitPrice.toFixed(2)}</td>
                                <td className="p-3 text-right tabular-nums font-medium align-top">{currencySymbol}{(item.quantity * ((item as any).rate || (item as any).unitPrice)).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                {pageIndex === totalPages - 1 && (
                    <InvoiceFooter {...commonProps} balanceDue={balanceDue} />
                )}
            </div>
        </div>
    );
};

// --- TEMPLATE: Minimalist ---
const MinimalistTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => (
    <div className={`invoice-page font-serif ${pageIndex < totalPages - 1 ? "page-break" : ""}`}>
        <div className="p-10 md:p-12">
            <header className="grid grid-cols-2 gap-10 mb-16" data-element="header">
                <div>
                     {commonProps.logoUrl ? (
                        <Image src={commonProps.logoUrl} alt={`${commonProps.invoice.companyName} Logo`} width={120} height={40} className="object-contain" data-ai-hint="logo" />
                    ) : (
                        <h1 className="text-3xl font-bold font-headline">{commonProps.invoice.companyName}</h1>
                    )}
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-widest">{commonProps.t.invoice}</h2>
                </div>
            </header>
            
            <section className="grid grid-cols-3 gap-10 mb-12" data-element="client-details">
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{commonProps.t.billTo}</p>
                    <p className="font-bold">{commonProps.invoice.clientName}</p>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{commonProps.invoice.clientAddress}</p>
                </div>
                <div className="space-y-1 col-start-3 text-right">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{commonProps.t.invoice} #</p>
                    <p>{commonProps.invoice.invoiceNumber}</p>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-3">{commonProps.t.invoiceDate}</p>
                    <p>{safeFormat(new Date(commonProps.invoice.invoiceDate || new Date()), 'yyyy-MM-dd')}</p>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-3">{commonProps.t.dueDate}</p>
                    <p>{safeFormat(new Date(commonProps.invoice.dueDate || new Date()), 'yyyy-MM-dd')}</p>
                </div>
            </section>

            <ItemsTable items={pageItems} t={commonProps.t} currencySymbol={commonProps.currencySymbol} />
            {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} balanceDue={commonProps.balanceDue} />}
        </div>
    </div>
);


// --- TEMPLATE: Creative ---
const CreativeTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => {
    const { invoice, logoUrl, t, currencySymbol, balanceDue, accentColor } = commonProps;
    
    return (
        <div className={`invoice-page relative overflow-hidden ${pageIndex < totalPages - 1 ? "page-break" : ""}`}>
            <div className="absolute top-0 right-0 h-full w-1/3" style={{backgroundColor: accentColor, opacity: 0.05}}></div>
            <div className="p-10 md:p-12">
                 <header className="grid grid-cols-2 gap-10 items-start mb-16" data-element="header">
                    <div className="z-10">
                        {logoUrl ? (
                            <Image src={logoUrl} alt={`${invoice.companyName} Logo`} width={120} height={40} className="object-contain" data-ai-hint="logo" />
                        ) : (
                            <h1 className="text-3xl font-bold font-headline" style={{ color: accentColor }}>{invoice.companyName}</h1>
                        )}
                        <div className="text-muted-foreground text-sm mt-2 space-y-1">
                          <p className="whitespace-pre-line">{invoice.companyAddress}</p>
                          {invoice.companyPhone && <p>{invoice.companyPhone}</p>}
                        </div>
                    </div>
                    <div className="text-right z-10">
                        <h2 className="text-5xl font-bold uppercase tracking-wider">{t.invoice}</h2>
                        <p className="text-muted-foreground mt-1">{invoice.invoiceNumber}</p>
                    </div>
                </header>

                <section className="mb-12 grid grid-cols-2 gap-10" data-element="client-details">
                    <div className="space-y-1 z-10">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t.billTo}</p>
                        <p className="font-bold text-lg">{invoice.clientName}</p>
                        <p className="text-muted-foreground text-sm whitespace-pre-line">{invoice.clientAddress}</p>
                    </div>
                    <div className="space-y-4 text-right self-end z-10">
                         <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-500">{t.invoiceDate}</p>
                            <p className="font-medium">{safeFormat(new Date(invoice.invoiceDate || new Date()), 'MMMM d, yyyy')}</p>
                        </div>
                         <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-500">{t.dueDate}</p>
                            <p className="font-medium">{safeFormat(new Date(invoice.dueDate || new Date()), 'MMMM d, yyyy')}</p>
                        </div>
                    </div>
                </section>
                
                 <section className="mt-8 z-10 relative">
                    <table className="w-full text-left" data-element="items-table">
                        <thead data-element="table-header">
                            <tr className="border-b-2" style={{borderColor: accentColor}}>
                                <th className="p-3 pb-4 text-sm font-bold uppercase tracking-wider w-1/2">{t.item}</th>
                                <th className="p-3 pb-4 text-sm font-bold uppercase tracking-wider text-center">{t.quantity}</th>
                                <th className="p-3 pb-4 text-sm font-bold uppercase tracking-wider text-right">{t.rate}</th>
                                <th className="p-3 pb-4 text-sm font-bold uppercase tracking-wider text-right">{t.subtotal}</th>
                            </tr>
                        </thead>
                        <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b" data-element="table-row">
                                <td className="p-3 py-4 whitespace-pre-line font-medium">{item.name || <span className="text-gray-400">{t.itemDescription}</span>}</td>
                                <td className="p-3 py-4 text-center tabular-nums">{item.quantity}</td>
                                <td className="p-3 py-4 text-right tabular-nums">{currencySymbol}{(item as any).rate ? (item as any).rate.toFixed(2) : (item as any).unitPrice.toFixed(2)}</td>
                                <td className="p-3 py-4 text-right tabular-nums font-medium">{currencySymbol}{(item.quantity * ((item as any).rate || (item as any).unitPrice)).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} balanceDue={balanceDue} />}

            </div>
        </div>
    );
};

const templates = {
    default: DefaultTemplatePage,
    modern: ModernTemplatePage,
    elegant: ElegantTemplatePage,
    usa: UsaTemplatePage,
    minimalist: MinimalistTemplatePage,
    creative: CreativeTemplatePage,
};


const PAGE_HEIGHT = 1056; // 11 inches at 96 DPI for Letter size
const PAGE_PADDING = 80; // 40px top + 40px bottom
const AVAILABLE_HEIGHT = PAGE_HEIGHT - PAGE_PADDING;


// --- MAIN PREVIEW COMPONENT ---
export function InvoicePreview({ invoice, logoUrl, accentColor, id = 'invoice-preview', isPrint = false }: InvoicePreviewProps) {
  const [paginatedItems, setPaginatedItems] = useState<LineItem[][]>([invoice.items]);
  const [needsRemeasure, setNeedsRemeasure] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * ((item as any).rate || (item as any).unitPrice), 0);
  const taxAmount = (subtotal * invoice.tax) / 100;
  const discountAmount = (subtotal * invoice.discount) / 100;
  const total = subtotal + taxAmount - discountAmount + (invoice.shippingCost || 0);
  const balanceDue = total - (invoice.amountPaid || 0);
  const currencySymbol = currencySymbols[invoice.currency] || '$';
  const t = locales[invoice.language as keyof typeof locales] || locales.en;

  // Trigger remeasure whenever invoice data changes
  useEffect(() => {
    setNeedsRemeasure(true);
  }, [invoice, logoUrl, accentColor, t]);


  const previewStyle = {
      '--primary-hsl': accentColor,
      '--primary': accentColor
  } as React.CSSProperties;

  const TemplateComponent = templates[invoice.template as keyof typeof templates] || templates.default;
  
  useLayoutEffect(() => {
    if (!isPrint || !containerRef.current || !needsRemeasure) return;

    const measureAndPaginate = () => {
      const container = containerRef.current!;
      // Temporarily render all items to measure them
      const tempRoot = document.createElement('div');
      tempRoot.style.position = 'absolute';
      tempRoot.style.left = '-9999px';
      document.body.appendChild(tempRoot);

      // We create a temporary React root to render the full, unpaginated content for measurement.
      Promise.resolve().then(() => {
        const tempContainer = container.cloneNode(true) as HTMLElement;
        tempRoot.appendChild(tempContainer);
        
        const header = tempContainer.querySelector('[data-element="header"]') as HTMLElement;
        const clientDetails = tempContainer.querySelector('[data-element="client-details"]') as HTMLElement;
        const insuranceDetails = tempContainer.querySelector('[data-element="insurance-details"]') as HTMLElement;
        const tableHeader = tempContainer.querySelector('[data-element="table-header"]') as HTMLElement;
        const footer = tempContainer.querySelector('.avoid-page-break') as HTMLElement;
        const allRows = Array.from(tempContainer.querySelectorAll('[data-element="table-row"]')) as HTMLElement[];
        
        if (!header || !tableHeader || !footer || allRows.length !== invoice.items.length) {
            document.body.removeChild(tempRoot);
            return;
        }

        let headerHeight = header.offsetHeight;
        if(clientDetails) headerHeight += clientDetails.offsetHeight;
        if(insuranceDetails) headerHeight += insuranceDetails.offsetHeight;

        const tableHeaderHeight = tableHeader.offsetHeight;
        const footerHeight = footer.offsetHeight;

        let currentPage = 0;
        let currentPageHeight = headerHeight;
        let newPages: LineItem[][] = [[]];

        allRows.forEach((row, index) => {
            const itemHeight = row.offsetHeight;
            let pageHeightForCurrentItem = currentPageHeight + (newPages[currentPage].length === 0 ? tableHeaderHeight : 0) + itemHeight;
            
            // Is this the last item? If so, add footer height.
            let isLastItem = index === allRows.length - 1;
            if (isLastItem) {
                pageHeightForCurrentItem += footerHeight;
            }

            if (pageHeightForCurrentItem > AVAILABLE_HEIGHT) {
                currentPage++;
                newPages[currentPage] = [];
                currentPageHeight = headerHeight + tableHeaderHeight; // Reset for new page
            }
            
            if (newPages[currentPage].length === 0) { // First item on a page
                currentPageHeight += tableHeaderHeight;
            }

            newPages[currentPage].push(invoice.items[index]);
            currentPageHeight += itemHeight;
        });
        
        // Final check: if the last page with items doesn't have space for the footer, push footer to a new page.
        const lastPageItemHeight = newPages[currentPage].reduce((total, item) => {
            const itemIndex = invoice.items.findIndex(i => i.id === item.id);
            return total + (allRows[itemIndex]?.offsetHeight || 0);
        }, 0);

        const lastPageContentHeight = headerHeight + tableHeaderHeight + lastPageItemHeight + footerHeight;

        if (lastPageContentHeight > AVAILABLE_HEIGHT && newPages[currentPage].length > 0) {
             const lastItem = newPages[currentPage].pop();
             if (lastItem) {
                currentPage++;
                newPages[currentPage] = [lastItem];
             }
        }
        
        setPaginatedItems(newPages);
        setNeedsRemeasure(false);
        document.body.removeChild(tempRoot);
      });
    };
    
    // Defer measurement to allow DOM to update
    const timer = setTimeout(measureAndPaginate, 50);
    return () => clearTimeout(timer);

  }, [invoice.items, isPrint, needsRemeasure, TemplateComponent]);


  const commonProps: Omit<PageProps, 'pageItems' | 'pageIndex' | 'totalPages'> = {
    invoice,
    logoUrl,
    accentColor,
    t,
    currencySymbol,
    subtotal,
    taxAmount,
    discountAmount,
    total,
    balanceDue
  };

  if (isPrint) {
    // For printing, we render the paginated content.
    // If we need to remeasure, we render all items so they can be measured.
    const itemsToRender = needsRemeasure ? [invoice.items] : paginatedItems;
    
    return (
      <div id={id} className="bg-white text-gray-800" style={previewStyle} ref={containerRef}>
        {itemsToRender.map((pageItems, pageIndex) => (
          <TemplateComponent
            key={pageIndex}
            {...commonProps}
            pageItems={pageItems}
            pageIndex={pageIndex}
            totalPages={itemsToRender.length}
          />
        ))}
      </div>
    );
  }

  // Default live preview (single page)
  return (
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide" style={previewStyle}>
      <CardContent className="p-0 bg-white text-gray-800 dark:bg-white dark:text-gray-800">
          <TemplateComponent
            {...commonProps}
            pageItems={invoice.items}
            pageIndex={0}
            totalPages={1}
          />
      </CardContent>
    </Card>
  );
}

    

    