'use client';

import type { Invoice, LineItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { format } from 'date-fns';
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
}

const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    PKR: '₨',
};

const ITEMS_PER_PAGE = 10;

// --- SHARED COMPONENTS ---
const InvoiceHeader = ({ invoice, logoUrl, accentColor, t }: CommonTemplateProps) => (
    <header className="flex justify-between items-start mb-10">
        <div>
            {logoUrl ? (
                <Image src={logoUrl} alt={`${invoice.companyName} Logo`} width={120} height={40} className="object-contain" data-ai-hint="logo" />
            ) : (
                <h1 className="text-3xl font-bold font-headline" style={{ color: accentColor }}>{invoice.companyName}</h1>
            )}
            <p className="text-muted-foreground text-sm mt-2 whitespace-pre-line">{invoice.companyAddress}</p>
        </div>
        <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-400 uppercase tracking-wider">{t.invoice}</h2>
            <p className="text-muted-foreground mt-1">{invoice.invoiceNumber}</p>
        </div>
    </header>
);

const ClientDetails = ({ invoice, t }: { invoice: Invoice, t: any }) => (
     <section className="flex justify-between mb-10">
        <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-500">{t.billTo}</p>
            <p className="font-bold">{invoice.clientName}</p>
            <p className="text-muted-foreground text-sm whitespace-pre-line">{invoice.clientAddress}</p>
        </div>
        <div className="text-right space-y-1">
            <p className="text-sm font-semibold text-gray-500">{t.invoiceDate}</p>
            <p>{format(invoice.invoiceDate, 'MMMM d, yyyy')}</p>
            <p className="text-sm font-semibold text-gray-500 mt-2">{t.dueDate}</p>
            <p>{format(invoice.dueDate, 'MMMM d, yyyy')}</p>
        </div>
    </section>
);

const ItemsTable = ({ items, t, currencySymbol, accentColor }: { items: LineItem[], t: any, currencySymbol: string, accentColor?: string }) => (
    <section>
        <table className="w-full text-left">
            <thead style={accentColor ? {backgroundColor: accentColor, color: 'white'} : {}} className={accentColor ? '' : "bg-gray-50"}>
            <tr>
                <th className="p-3 text-sm font-semibold w-1/2">{t.item}</th>
                <th className="p-3 text-sm font-semibold text-center">{t.quantity}</th>
                <th className="p-3 text-sm font-semibold text-right">{t.rate}</th>
                <th className="p-3 text-sm font-semibold text-right">{t.subtotal}</th>
            </tr>
            </thead>
            <tbody>
            {items.map(item => (
                <tr key={item.id} className="border-b">
                <td className="p-3">{item.name || <span className="text-gray-400">{t.itemDescription}</span>}</td>
                <td className="p-3 text-center tabular-nums">{item.quantity}</td>
                <td className="p-3 text-right tabular-nums">{currencySymbol}{item.rate.toFixed(2)}</td>
                <td className="p-3 text-right tabular-nums font-medium">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </section>
);

const InvoiceFooter = ({ invoice, t, subtotal, taxAmount, discountAmount, total, currencySymbol, accentColor }: {
    invoice: Invoice, t: any, subtotal: number, taxAmount: number, discountAmount: number, total: number, currencySymbol: string, accentColor: string
}) => (
    <>
        <section className="flex justify-end mt-8">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.subtotal}</span>
                <span className="font-medium tabular-nums">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                {invoice.tax > 0 && (
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.tax} ({invoice.tax}%)</span>
                <span className="font-medium tabular-nums">{currencySymbol}{taxAmount.toFixed(2)}</span>
                </div>
                )}
                {invoice.discount > 0 && (
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.discount} ({invoice.discount}%)</span>
                <span className="font-medium text-destructive tabular-nums">-{currencySymbol}{discountAmount.toFixed(2)}</span>
                </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg">
                <span>{t.total}</span>
                <span className="tabular-nums" style={{ color: accentColor }}>{currencySymbol}{total.toFixed(2)}</span>
                </div>
            </div>
        </section>

        {invoice.notes && (
            <footer className="mt-10">
                <p className="text-sm font-semibold text-gray-500">{t.notes}</p>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{invoice.notes}</p>
            </footer>
        )}
    </>
);


// --- TEMPLATE: Default ---
const DefaultTemplatePage = ({ invoice, logoUrl, accentColor, t, currencySymbol, pageItems, pageIndex, totalPages, ...totals }: PageProps) => (
    <div className={pageIndex < totalPages - 1 ? "page-break" : ""}>
        <div className="p-8 md:p-10">
            <InvoiceHeader invoice={invoice} logoUrl={logoUrl} accentColor={accentColor} t={t} currencySymbol={currencySymbol} />
            <ClientDetails invoice={invoice} t={t} />
            <ItemsTable items={pageItems} t={t} currencySymbol={currencySymbol} />
            {pageIndex === totalPages - 1 && <InvoiceFooter invoice={invoice} t={t} {...totals} currencySymbol={currencySymbol} accentColor={accentColor}/>}
        </div>
    </div>
);


// --- TEMPLATE: Modern ---
const ModernTemplatePage = ({ invoice, logoUrl, accentColor, t, currencySymbol, pageItems, pageIndex, totalPages, ...totals }: PageProps) => (
     <div className={pageIndex < totalPages - 1 ? "page-break" : ""}>
        <div className="p-8 md:p-10">
            <header className="mb-10">
                <div className="p-6 rounded-lg flex justify-between items-start" style={{backgroundColor: accentColor, color: 'white'}}>
                    <div>
                        {logoUrl ? (
                            <div className="bg-white p-2 rounded-md w-32 h-auto">
                                <Image src={logoUrl} alt={`${invoice.companyName} Logo`} width={120} height={40} className="object-contain" data-ai-hint="logo"/>
                            </div>
                        ) : (
                            <h1 className="text-3xl font-bold font-headline">{invoice.companyName}</h1>
                        )}
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold uppercase tracking-wider">{t.invoice}</h2>
                        <p className="text-sm mt-1">{invoice.invoiceNumber}</p>
                    </div>
                </div>
            </header>
            <ClientDetails invoice={invoice} t={t} />
            <ItemsTable items={pageItems} t={t} currencySymbol={currencySymbol} accentColor={accentColor} />
            {pageIndex === totalPages - 1 && <InvoiceFooter invoice={invoice} t={t} {...totals} currencySymbol={currencySymbol} accentColor={accentColor}/>}
        </div>
    </div>
)

// --- TEMPLATE: Elegant ---
const ElegantTemplatePage = ({ invoice, logoUrl, accentColor, t, currencySymbol, pageItems, pageIndex, totalPages, ...totals }: PageProps) => (
    <div className={pageIndex < totalPages - 1 ? "page-break" : ""}>
        <div className="p-8 md:p-10 m-4 border">
            <header className="text-center mb-12">
                <div>
                    {logoUrl ? (
                        <Image src={logoUrl} alt={`${invoice.companyName} Logo`} width={120} height={40} className="object-contain mx-auto mb-4" data-ai-hint="logo" />
                    ) : (
                        <h1 className="text-4xl font-bold font-headline" style={{ color: accentColor }}>{invoice.companyName}</h1>
                    )}
                    <p className="text-muted-foreground text-sm mt-2 whitespace-pre-line">{invoice.companyAddress}</p>
                </div>
            </header>
            <div className="flex justify-between items-start mb-8">
                <div className="text-left space-y-1">
                    <p className="text-sm font-semibold text-gray-500">{t.billTo}</p>
                    <p className="font-bold">{invoice.clientName}</p>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{invoice.clientAddress}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold text-gray-800 uppercase tracking-wider mb-2">{t.invoice}</h2>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-end">
                            <span className="font-semibold text-gray-500 w-28 text-left">{t.invoice} #: &nbsp;</span>
                            <span className="w-24 text-right">{invoice.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-end">
                            <span className="font-semibold text-gray-500 w-28 text-left">{t.invoiceDate}: &nbsp;</span>
                            <span className="w-24 text-right">{format(invoice.invoiceDate, 'yyyy-MM-dd')}</span>
                        </div>
                         <div className="flex justify-end">
                            <span className="font-semibold text-gray-500 w-28 text-left">{t.dueDate}: &nbsp;</span>
                            <span className="w-24 text-right">{format(invoice.dueDate, 'yyyy-MM-dd')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ItemsTable items={pageItems} t={t} currencySymbol={currencySymbol} />
            {pageIndex === totalPages - 1 && <InvoiceFooter invoice={invoice} t={t} {...totals} currencySymbol={currencySymbol} accentColor={accentColor}/>}
        </div>
    </div>
)

// --- TEMPLATE: USA ---
const UsaTemplatePage = ({ invoice, logoUrl, accentColor, t, currencySymbol, pageItems, pageIndex, totalPages, ...totals }: PageProps) => (
    <div className={pageIndex < totalPages - 1 ? "page-break" : ""}>
        <div className="p-12 text-sm">
            <header className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                    {logoUrl ? (
                         <Image src={logoUrl} alt={`${invoice.companyName} Logo`} width={150} height={50} className="object-contain" data-ai-hint="logo" />
                    ) : (
                        <h1 className="text-2xl font-bold">{invoice.companyName}</h1>
                    )}
                    {invoice.companySlogan && <p className="text-muted-foreground text-xs">{invoice.companySlogan}</p>}
                    <p className="text-muted-foreground text-xs whitespace-pre-line pt-2">{invoice.companyAddress}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold text-gray-800 uppercase tracking-widest">INVOICE</h2>
                    <div className="mt-2 space-y-1 text-xs">
                        <div className="flex justify-end">
                            <span className="text-gray-500 w-24 text-right">Invoice #</span>
                            <span className="w-24 text-right font-medium">{invoice.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-end">
                            <span className="text-gray-500 w-24 text-right">Date</span>
                            <span className="w-24 text-right font-medium">{format(invoice.invoiceDate, 'MMMM d, yyyy')}</span>
                        </div>
                         <div className="flex justify-end">
                            <span className="text-gray-500 w-24 text-right">Due Date</span>
                            <span className="w-24 text-right font-medium">{format(invoice.dueDate, 'MMMM d, yyyy')}</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-8">
                <div className="border p-4 rounded-md bg-gray-50/50 space-y-1">
                    <h3 className="font-bold text-xs uppercase text-gray-500">Billing Address</h3>
                    <p className="font-bold">{invoice.clientName}</p>
                    <p className="text-muted-foreground whitespace-pre-line">{invoice.clientAddress}</p>
                </div>
                 <div className="border p-4 rounded-md bg-gray-50/50 space-y-1">
                    <h3 className="font-bold text-xs uppercase text-gray-500">Delivery Address</h3>
                     <p className="font-bold">{invoice.clientName}</p>
                    <p className="text-muted-foreground whitespace-pre-line">{invoice.clientAddress}</p>
                </div>
            </section>

            <ItemsTable items={pageItems} t={{...t, item: 'DESCRIPTION', quantity: 'QUANTITY', rate: 'UNIT PRICE', subtotal: 'AMOUNT'}} currencySymbol={currencySymbol} />
            
            {pageIndex === totalPages - 1 && (
                <>
                    <section className="flex justify-end mt-4">
                        <div className="w-full max-w-sm space-y-2 text-sm">
                             <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium tabular-nums">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                            </div>
                            {invoice.tax > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Sales Tax ({invoice.tax}%)</span>
                                    <span className="font-medium tabular-nums">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                                </div>
                            )}
                             {invoice.discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Discount ({invoice.discount}%)</span>
                                    <span className="font-medium text-destructive tabular-nums">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="border-t my-1"></div>
                            <div className="flex justify-between border-t-2 border-black pt-2 font-bold">
                                <span>TOTAL DUE</span>
                                <span className="tabular-nums">{currencySymbol}{totals.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </section>
                     <footer className="text-center mt-12 text-xs text-gray-500">
                        {invoice.notes && <p className="mb-4">{invoice.notes}</p>}
                        <p>Make all cheques payable to <strong>{invoice.companyName}</strong></p>
                        <p className="mt-4 font-bold text-gray-600">THANK YOU FOR YOUR BUSINESS!</p>
                    </footer>
                </>
            )}
        </div>
    </div>
);


const templates = {
    default: DefaultTemplatePage,
    modern: ModernTemplatePage,
    elegant: ElegantTemplatePage,
    usa: UsaTemplatePage,
};

// --- MAIN PREVIEW COMPONENT ---
export function InvoicePreview({ invoice, logoUrl, accentColor, id = 'invoice-preview', isPrint = false }: InvoicePreviewProps) {
  const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  const taxAmount = (subtotal * invoice.tax) / 100;
  const discountAmount = (subtotal * invoice.discount) / 100;
  const total = subtotal + taxAmount - discountAmount;
  const currencySymbol = currencySymbols[invoice.currency] || '$';

  const t = locales[invoice.language as keyof typeof locales] || locales.en;

  const previewStyle = {
      '--primary-hsl': accentColor,
      '--primary': accentColor
  } as React.CSSProperties;

  const TemplateComponent = templates[invoice.template as keyof typeof templates] || templates.default;
  
  if (isPrint) {
    const itemPages = [];
    for (let i = 0; i < invoice.items.length; i += ITEMS_PER_PAGE) {
      itemPages.push(invoice.items.slice(i, i + ITEMS_PER_PAGE));
    }
    
    return (
      <div id={id} className="bg-white text-gray-800" style={previewStyle}>
        {itemPages.map((pageItems, pageIndex) => (
          <TemplateComponent
            key={pageIndex}
            invoice={invoice}
            logoUrl={logoUrl}
            accentColor={accentColor}
            t={t}
            currencySymbol={currencySymbol}
            pageItems={pageItems}
            pageIndex={pageIndex}
            totalPages={itemPages.length}
            subtotal={subtotal}
            taxAmount={taxAmount}
            discountAmount={discountAmount}
            total={total}
          />
        ))}
      </div>
    );
  }

  // Default live preview (single page)
  return (
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide" style={previewStyle}>
      <CardContent className="p-0">
          <TemplateComponent
            invoice={invoice}
            logoUrl={logoUrl}
            accentColor={accentColor}
            t={t}
            currencySymbol={currencySymbol}
            pageItems={invoice.items}
            pageIndex={0}
            totalPages={1}
            subtotal={subtotal}
            taxAmount={taxAmount}
            discountAmount={discountAmount}
            total={total}
          />
      </CardContent>
    </Card>
  );
}
