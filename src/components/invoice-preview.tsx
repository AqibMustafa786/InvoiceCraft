'use client';

import { useState, useLayoutEffect, useRef, useEffect, FC } from 'react';
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
  backgroundColor: string;
  textColor: string;
  id?: string;
  isPrint?: boolean;
}

interface CommonTemplateProps {
  invoice: Invoice;
  logoUrl: string | null;
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

const safeFormat = (date: Date | string | number, formatString: string) => {
    const d = new Date(date || new Date());
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

// --- SHARED COMPONENTS ---
const ItemsTable: FC<{ items: LineItem[], t: any, currencySymbol: string, accentColor?: string, headerStyle?: 'filled' | 'underline' }> = ({ items, t, currencySymbol, accentColor, headerStyle = 'filled' }) => (
    <section>
        <table className="w-full text-left">
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
                <tr key={item.id} className="border-b" data-element="table-row">
                <td className="p-3 whitespace-pre-line">{item.name || <span className="text-gray-400">{t.itemDescription}</span>}</td>
                <td className="p-3 text-center tabular-nums">{item.quantity}</td>
                <td className="p-3 text-right tabular-nums">{currencySymbol}{((item as any).rate || 0).toFixed(2)}</td>
                <td className="p-3 text-right tabular-nums font-medium">{currencySymbol}{(item.quantity * ((item as any).rate || 0)).toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </section>
);

const InvoiceFooter: FC<{
    invoice: Invoice, t: any, subtotal: number, taxAmount: number, discountAmount: number, total: number, currencySymbol: string, accentColor: string, balanceDue: number
}> = ({ invoice, t, subtotal, taxAmount, discountAmount, total, currencySymbol, accentColor, balanceDue }) => (
    <div className="avoid-page-break">
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
            <footer className="mt-10" data-element="footer">
                <p className="text-sm font-semibold text-gray-500">{t.notes}</p>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{invoice.paymentInstructions}</p>
            </footer>
        )}
    </div>
);


const DefaultTemplatePage: FC<PageProps> = ({ pageItems, pageIndex, totalPages, ...commonProps }) => (
    <div className={`p-8 md:p-10 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{minHeight: '1056px', fontFamily: commonProps.invoice.fontFamily, fontSize: `${commonProps.invoice.fontSize}px`, backgroundColor: commonProps.backgroundColor, color: commonProps.textColor }}>
        <div data-element="page-content" className="flex-grow">
            <header className="flex justify-between items-start mb-10" data-element="header">
                <div>
                    {commonProps.logoUrl ? (
                        <Image src={commonProps.logoUrl} alt={`${commonProps.invoice.companyName} Logo`} width={120} height={40} className="object-contain" data-ai-hint="logo" />
                    ) : (
                        <h1 className="text-3xl font-bold font-headline" style={{ color: commonProps.accentColor }}>{commonProps.invoice.companyName}</h1>
                    )}
                    <div className="text-sm mt-2 space-y-1">
                      <p className="whitespace-pre-line">{commonProps.invoice.companyAddress}</p>
                      {commonProps.invoice.companyPhone && <p>{commonProps.invoice.companyPhone}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-400 uppercase tracking-wider">{commonProps.t.invoice}</h2>
                    <p className="mt-1">{commonProps.invoice.invoiceNumber}</p>
                </div>
            </header>
             <section className="flex justify-between mb-10" data-element="client-details">
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-500">{commonProps.t.billTo}</p>
                    <p className="font-bold">{commonProps.invoice.clientName}</p>
                    <p className="text-sm whitespace-pre-line">{commonProps.invoice.clientAddress}</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-gray-500">{commonProps.t.invoiceDate}</p>
                    <p>{safeFormat(new Date(commonProps.invoice.invoiceDate || new Date()), 'MMMM d, yyyy')}</p>
                    <p className="text-sm font-semibold text-gray-500 mt-2">{commonProps.t.dueDate}</p>
                    <p>{safeFormat(new Date(commonProps.invoice.dueDate || new Date()), 'MMMM d, yyyy')}</p>
                </div>
            </section>
            <ItemsTable items={pageItems} {...commonProps} />
        </div>
        {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
    </div>
);

// --- TEMPLATE: Modern ---
const ModernTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => (
     <div className={`p-8 md:p-10 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{minHeight: '1056px', fontFamily: commonProps.invoice.fontFamily, fontSize: `${commonProps.invoice.fontSize}px`, backgroundColor: commonProps.backgroundColor, color: commonProps.textColor }}>
        <div data-element="page-content" className="flex-grow">
            <div className="flex justify-between items-center pb-4 border-b-4" style={{borderColor: commonProps.accentColor}} data-element="header">
                 <div>
                    {commonProps.logoUrl ? (
                        <Image src={commonProps.logoUrl} alt={`${commonProps.invoice.companyName} Logo`} width={100} height={40} className="object-contain" />
                    ) : (
                        <h1 className="text-2xl font-bold font-headline">{commonProps.invoice.companyName}</h1>
                    )}
                 </div>
                 <h2 className="text-3xl font-bold uppercase" style={{color: commonProps.accentColor}}>{commonProps.t.invoice}</h2>
            </div>
             <section className="flex justify-between my-8 text-sm" data-element="client-details">
                <div className="space-y-1">
                    <p className="font-bold">{commonProps.invoice.companyName}</p>
                    <p className="whitespace-pre-line">{commonProps.invoice.companyAddress}</p>
                    <p>{commonProps.invoice.companyPhone}</p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="font-bold">{commonProps.invoice.clientName}</p>
                    <p className="whitespace-pre-line">{commonProps.invoice.clientAddress}</p>
                </div>
            </section>
             <section className="flex justify-between my-8 text-sm" data-element="invoice-meta">
                <div className="space-y-1">
                    <p className="font-bold">Invoice #</p>
                    <p>{commonProps.invoice.invoiceNumber}</p>
                </div>
                 <div className="space-y-1 text-right">
                    <p className="font-bold">Date</p>
                    <p>{safeFormat(new Date(commonProps.invoice.invoiceDate || new Date()), 'MM/dd/yyyy')}</p>
                </div>
                 <div className="space-y-1 text-right">
                    <p className="font-bold">Due Date</p>
                    <p>{safeFormat(new Date(commonProps.invoice.dueDate || new Date()), 'MM/dd/yyyy')}</p>
                </div>
            </section>
            <ItemsTable items={pageItems} {...commonProps} accentColor={commonProps.accentColor} />
        </div>
        {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
    </div>
);

// --- TEMPLATE: Minimalist ---
const MinimalistTemplatePage: FC<PageProps> = ({ pageItems, pageIndex, totalPages, ...commonProps }) => (
    <div className={`p-12 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{minHeight: '1056px', fontFamily: commonProps.invoice.fontFamily, fontSize: `${commonProps.invoice.fontSize}px`, backgroundColor: commonProps.backgroundColor, color: commonProps.textColor }}>
        <div data-element="page-content" className="flex-grow">
            <header data-element="header" className="mb-12">
                <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold">{commonProps.invoice.companyName}</h1>
                    <h2 className="text-2xl font-light uppercase text-gray-500">{commonProps.t.invoice}</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">{commonProps.invoice.companyAddress}</p>
            </header>
            <section data-element="client-details" className="grid grid-cols-3 gap-4 mb-12 text-xs">
                <div className="space-y-1">
                    <p className="text-gray-500 uppercase tracking-widest">Billed To</p>
                    <p className="font-medium">{commonProps.invoice.clientName}</p>
                    <p>{commonProps.invoice.clientAddress}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-gray-500 uppercase tracking-widest">Invoice #</p>
                    <p className="font-medium">{commonProps.invoice.invoiceNumber}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-gray-500 uppercase tracking-widest">Date</p>
                    <p className="font-medium">{safeFormat(new Date(commonProps.invoice.invoiceDate || new Date()), 'yyyy-MM-dd')}</p>
                </div>
            </section>
            <ItemsTable items={pageItems} {...commonProps} headerStyle="underline" />
        </div>
        {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
    </div>
);

// --- TEMPLATE: Creative ---
const CreativeTemplatePage: FC<PageProps> = ({ pageItems, pageIndex, totalPages, ...commonProps }) => (
    <div className={`p-8 relative flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{minHeight: '1056px', fontFamily: commonProps.invoice.fontFamily, fontSize: `${commonProps.invoice.fontSize}px`, backgroundColor: commonProps.backgroundColor, color: commonProps.textColor }}>
        <div className="absolute top-0 left-0 w-full h-48" style={{backgroundColor: commonProps.accentColor, opacity: 0.1}}></div>
        <div data-element="page-content" className="flex-grow z-10">
            <header data-element="header" className="flex justify-between items-center mb-12">
                <div>
                    {commonProps.logoUrl && <Image src={commonProps.logoUrl} alt="logo" width={80} height={80} className="rounded-full" />}
                    <h1 className="text-3xl font-bold mt-2">{commonProps.invoice.companyName}</h1>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-extrabold uppercase" style={{color: commonProps.accentColor}}>{commonProps.t.invoice}</h2>
                    <p className="text-sm mt-1">{commonProps.invoice.invoiceNumber}</p>
                </div>
            </header>
            <section data-element="client-details" className="mb-10 text-sm">
                <p className="text-gray-500">Billed to:</p>
                <p className="font-bold text-lg">{commonProps.invoice.clientName}</p>
                <p>{commonProps.invoice.clientAddress}</p>
            </section>
            <ItemsTable items={pageItems} {...commonProps} accentColor={commonProps.accentColor} />
        </div>
        {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
    </div>
);

// --- TEMPLATE: Elegant ---
const ElegantTemplatePage: FC<PageProps> = ({ pageItems, pageIndex, totalPages, ...commonProps }) => (
    <div className={`p-10 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{minHeight: '1056px', fontFamily: commonProps.invoice.fontFamily, fontSize: `${commonProps.invoice.fontSize}px`, backgroundColor: commonProps.backgroundColor, color: commonProps.textColor }}>
        <div data-element="page-content" className="flex-grow">
            <header data-element="header" className="text-center mb-16">
                {commonProps.logoUrl && <Image src={commonProps.logoUrl} alt="logo" width={100} height={50} className="mx-auto mb-4 object-contain" />}
                <h1 className="text-4xl font-bold tracking-tight">{commonProps.invoice.companyName}</h1>
                <p className="text-xs text-gray-500 mt-2 tracking-widest">{commonProps.invoice.companyAddress}</p>
            </header>
            <div className="w-full h-px bg-gray-300 mb-10"></div>
            <section data-element="meta" className="flex justify-between items-center mb-10 text-sm">
                <div>
                    <p className="font-bold">Billed to: {commonProps.invoice.clientName}</p>
                    <p>{commonProps.invoice.clientAddress}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Invoice Number:</span> {commonProps.invoice.invoiceNumber}</p>
                    <p><span className="font-bold">Date of Issue:</span> {safeFormat(new Date(commonProps.invoice.invoiceDate || new Date()), 'MMMM dd, yyyy')}</p>
                </div>
            </section>
            <ItemsTable items={pageItems} {...commonProps} headerStyle="underline" />
        </div>
        {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
    </div>
);

// --- TEMPLATE: USA ---
const UsaTemplatePage: FC<PageProps> = ({ pageItems, pageIndex, totalPages, ...commonProps }) => {
    const { invoice, logoUrl, accentColor, total, subtotal, currencySymbol } = commonProps;

    return (
        <div className={`invoice-page ${pageIndex < totalPages - 1 ? "page-break" : ""}`} style={{fontFamily: commonProps.invoice.fontFamily, fontSize: `${commonProps.invoice.fontSize}px`, backgroundColor: commonProps.backgroundColor, color: commonProps.textColor }}>
            <div className="p-8 m-4 border-2" style={{ borderColor: accentColor }}>
                <header className="grid grid-cols-2 gap-10 mb-8" data-element="header">
                     <div>
                        {logoUrl ? (
                            <Image src={logoUrl} alt={`${invoice.companyName} Logo`} width={160} height={80} className="object-contain mb-2" data-ai-hint="logo" />
                        ) : (
                            <h1 className="text-3xl font-bold mb-1" style={{color: accentColor}}>{invoice.companyName}</h1>
                        )}
                        <p className="text-xs whitespace-pre-line">{invoice.companyAddress}</p>
                    </div>
                     <div className="text-right">
                        <h2 className="text-4xl font-bold">INVOICE</h2>
                        <div className="mt-4 text-xs space-y-1">
                            <p><span className="font-bold text-gray-500">Invoice #:</span> {invoice.invoiceNumber}</p>
                            <p><span className="font-bold text-gray-500">Date:</span> {safeFormat(new Date(invoice.invoiceDate || new Date()), 'M/d/yyyy')}</p>
                        </div>
                    </div>
                </header>
                 <section className="mb-6 text-xs" data-element="client-details">
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 p-3 bg-gray-50 rounded-md">
                        <span className="font-bold text-gray-600">Billed To:</span><span className="font-medium">{invoice.clientName}</span>
                        <span className="font-bold text-gray-600">Address:</span><span className="whitespace-pre-line font-medium">{invoice.clientAddress}</span>
                        {invoice.poNumber && <><span className="font-bold text-gray-600">PO Number:</span><span className="font-medium">{invoice.poNumber}</span></>}
                    </div>
                </section>
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
                                    <td className="border p-2 align-top h-8 whitespace-pre-line pl-6">{item.name}</td>
                                    <td className="border p-2 text-right align-top">{currencySymbol}{(item.quantity * ((item as any).rate || 0)).toFixed(2)}</td>
                                </tr>
                            ))}
                             {[...Array(Math.max(0, 10 - (pageItems?.length || 0)))].map((_, i) => (
                                <tr key={`blank-${i}`}>
                                    <td className="border p-2 h-8"></td>
                                    <td className="border p-2"></td>
                                </tr>
                            ))}
                        </tbody>
                         <tfoot className="text-sm font-medium">
                            <tr>
                                <td className="border p-2 text-right font-bold">Subtotal</td>
                                <td className="border p-2 text-right">{currencySymbol}{subtotal.toFixed(2)}</td>
                            </tr>
                            {invoice.tax > 0 && <tr>
                                <td className="border p-2 text-right font-bold">Tax ({invoice.tax}%)</td>
                                <td className="border p-2 text-right">{currencySymbol}{commonProps.taxAmount.toFixed(2)}</td>
                            </tr>}
                            {invoice.discount > 0 && <tr>
                                <td className="border p-2 text-right font-bold">Discount ({invoice.discount}%)</td>
                                <td className="border p-2 text-right text-red-600">-{currencySymbol}{commonProps.discountAmount.toFixed(2)}</td>
                            </tr>}
                             {invoice.amountPaid > 0 && <tr>
                                <td className="border p-2 text-right font-bold">Amount Paid</td>
                                <td className="border p-2 text-right text-green-600">-{currencySymbol}{invoice.amountPaid.toFixed(2)}</td>
                            </tr>}
                            <tr className="bg-gray-100 font-bold text-base">
                                <td className="border p-2 text-right">Total Due</td>
                                <td className="border p-2 text-right">{currencySymbol}{commonProps.balanceDue.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </main>
                {invoice.paymentInstructions && (
                    <footer className="mt-8 text-xs" data-element="footer">
                        <p className="font-bold">Notes:</p>
                        <p className="text-gray-600 whitespace-pre-line">{invoice.paymentInstructions}</p>
                    </footer>
                )}
            </div>
        </div>
    );
};


const templates = {
  'default': DefaultTemplatePage,
  'modern': ModernTemplatePage,
  'minimalist': MinimalistTemplatePage,
  'creative': CreativeTemplatePage,
  'elegant': ElegantTemplatePage,
  'usa': UsaTemplatePage,
};


const PAGE_HEIGHT = 1056; // 11 inches at 96 DPI for Letter size
const PAGE_PADDING = 80; // 40px top + 40px bottom
const AVAILABLE_HEIGHT = PAGE_HEIGHT - PAGE_PADDING;


const InvoicePreviewInternal: FC<InvoicePreviewProps> = ({ invoice, logoUrl, accentColor, backgroundColor, textColor, id = 'invoice-preview', isPrint = false }) => {
  const [paginatedItems, setPaginatedItems] = useState<LineItem[][]>([]);
  const [needsRemeasure, setNeedsRemeasure] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const t = locales[invoice.language as keyof typeof locales] || locales.en;
  
  const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * ((item as any).rate || 0), 0);
  const taxAmount = (subtotal * invoice.tax) / 100;
  const discountAmount = (subtotal * invoice.discount) / 100;
  const total = subtotal + taxAmount - discountAmount + (invoice.shippingCost || 0);
  const balanceDue = total - (invoice.amountPaid || 0);
  const currencySymbol = currencySymbols[invoice.currency] || '$';

  useEffect(() => {
    setNeedsRemeasure(true);
    setPaginatedItems([invoice.items]);
  }, [invoice, logoUrl, accentColor, t]);


  const previewStyle = {
      '--primary-hsl': accentColor,
      '--primary': accentColor,
      fontFamily: invoice.fontFamily || 'Inter, sans-serif',
      fontSize: `${invoice.fontSize || 10}pt`,
      backgroundColor: backgroundColor || '#FFFFFF',
      color: textColor || '#374151',
  } as React.CSSProperties;

  const TemplateComponent = templates[invoice.template as keyof typeof templates] || templates['default'];
  
  useLayoutEffect(() => {
    if (!isPrint || !containerRef.current || !needsRemeasure) return;

    const measureAndPaginate = () => {
      const container = containerRef.current!;
      const tempRoot = document.createElement('div');
      tempRoot.style.position = 'absolute';
      tempRoot.style.left = '-9999px';
      document.body.appendChild(tempRoot);

      Promise.resolve().then(() => {
        const tempContainer = container.cloneNode(true) as HTMLElement;
        tempRoot.appendChild(tempContainer);
        
        const header = tempContainer.querySelector('[data-element="header"]') as HTMLElement;
        const clientDetails = tempContainer.querySelector('[data-element="client-details"]') as HTMLElement;
        const tableHeader = tempContainer.querySelector('[data-element="table-header"]') as HTMLElement;
        const footer = tempContainer.querySelector('[data-element="footer"]') as HTMLElement;
        const allRows = Array.from(tempContainer.querySelectorAll('[data-element="table-row"]')) as HTMLElement[];
        
        if (!header || !tableHeader || allRows.length === 0) {
            document.body.removeChild(tempRoot);
            return;
        }

        let headerHeight = header.offsetHeight + (clientDetails?.offsetHeight || 0);
        const tableHeaderHeight = tableHeader.offsetHeight;
        const footerHeight = footer?.offsetHeight || 0;

        let currentPage = 0;
        let currentPageHeight = headerHeight;
        let newPages: LineItem[][] = [[]];

        allRows.forEach((row, index) => {
            const itemHeight = row.offsetHeight;
            let pageHeightForCurrentItem = currentPageHeight + (newPages[currentPage].length === 0 ? tableHeaderHeight : 0) + itemHeight;
            
            let isLastItem = index === allRows.length - 1;
            if (isLastItem) {
                pageHeightForCurrentItem += footerHeight;
            }

            if (pageHeightForCurrentItem > AVAILABLE_HEIGHT) {
                currentPage++;
                newPages[currentPage] = [];
                currentPageHeight = headerHeight + tableHeaderHeight; 
            }
            
            if (newPages[currentPage].length === 0) { 
                currentPageHeight += tableHeaderHeight;
            }

            newPages[currentPage].push(invoice.items[index]);
            currentPageHeight += itemHeight;
        });
        
        const lastPageItemHeight = (newPages[currentPage] || []).reduce((total, item) => {
            if (!item) return total;
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
        
        setPaginatedItems(newPages.length > 0 ? newPages.filter(p => p.length > 0) : [[]]);
        setNeedsRemeasure(false);
        document.body.removeChild(tempRoot);
      });
    };
    
    const timer = setTimeout(measureAndPaginate, 50);
    return () => clearTimeout(timer);

  }, [invoice.items, isPrint, needsRemeasure, TemplateComponent, invoice]);


  const commonProps: Omit<PageProps, 'pageItems' | 'pageIndex' | 'totalPages'> = {
    invoice,
    logoUrl,
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
    const itemsToRender = needsRemeasure ? [invoice.items] : paginatedItems;
    
    return (
      <div id={id} ref={containerRef}>
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
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide" style={{backgroundColor: backgroundColor}}>
      <CardContent className="p-0" style={{color: textColor}}>
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

export const ClientInvoicePreview: FC<InvoicePreviewProps> = (props) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || !props.invoice) {
        return (
            <Card id={props.id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide">
                <CardContent className="p-8 text-center text-muted-foreground">
                    Loading Preview...
                </CardContent>
            </Card>
        );
    }
    return <InvoicePreviewInternal {...props} />;
}


export { InvoicePreviewInternal as InvoicePreview };
