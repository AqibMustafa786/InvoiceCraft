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
    balanceDue: number;
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
                <td className="p-3 whitespace-pre-line">{item.name || <span className="text-gray-400">{t.itemDescription}</span>}</td>
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

        {invoice.paymentInstructions && (
            <footer className="mt-10">
                <p className="text-sm font-semibold text-gray-500">{t.notes}</p>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{invoice.paymentInstructions}</p>
            </footer>
        )}
    </>
);


// --- TEMPLATE: Default ---
const DefaultTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => (
    <div className={pageIndex < totalPages - 1 ? "page-break" : ""}>
        <div className="p-8 md:p-10">
            <InvoiceHeader {...commonProps} />
            <ClientDetails invoice={commonProps.invoice} t={commonProps.t} />
            <ItemsTable items={pageItems} t={commonProps.t} currencySymbol={commonProps.currencySymbol} />
            {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
        </div>
    </div>
);


// --- TEMPLATE: Modern ---
const ModernTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => (
     <div className={pageIndex < totalPages - 1 ? "page-break" : ""}>
        <div className="p-8 md:p-10">
            <header className="mb-10">
                <div className="p-6 rounded-lg flex justify-between items-start" style={{backgroundColor: commonProps.accentColor, color: 'white'}}>
                    <div>
                        {commonProps.logoUrl ? (
                            <div className="bg-white p-2 rounded-md inline-block">
                                <Image src={commonProps.logoUrl} alt={`${commonProps.invoice.companyName} Logo`} width={120} height={40} className="object-contain" data-ai-hint="logo"/>
                            </div>
                        ) : (
                            <h1 className="text-3xl font-bold font-headline">{commonProps.invoice.companyName}</h1>
                        )}
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold uppercase tracking-wider">{commonProps.t.invoice}</h2>
                        <p className="text-sm mt-1">{commonProps.invoice.invoiceNumber}</p>
                    </div>
                </div>
            </header>
            <ClientDetails invoice={commonProps.invoice} t={commonProps.t} />
            <ItemsTable items={pageItems} t={commonProps.t} currencySymbol={commonProps.currencySymbol} accentColor={commonProps.accentColor} />
            {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps} />}
        </div>
    </div>
)

// --- TEMPLATE: Elegant ---
const ElegantTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => (
    <div className={pageIndex < totalPages - 1 ? "page-break" : ""}>
        <div className="p-8 md:p-10 m-4 border">
            <header className="text-center mb-12">
                <div>
                    {commonProps.logoUrl ? (
                        <Image src={commonProps.logoUrl} alt={`${commonProps.invoice.companyName} Logo`} width={120} height={40} className="object-contain mx-auto mb-4" data-ai-hint="logo" />
                    ) : (
                        <h1 className="text-4xl font-bold font-headline" style={{ color: commonProps.accentColor }}>{commonProps.invoice.companyName}</h1>
                    )}
                    <p className="text-muted-foreground text-sm mt-2 whitespace-pre-line">{commonProps.invoice.companyAddress}</p>
                </div>
            </header>
            <div className="flex justify-between items-start mb-8">
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
                            <span className="w-24 text-right">{format(commonProps.invoice.invoiceDate, 'yyyy-MM-dd')}</span>
                        </div>
                         <div className="flex justify-end">
                            <span className="font-semibold text-gray-500 w-28 text-left">{commonProps.t.dueDate}: &nbsp;</span>
                            <span className="w-24 text-right">{format(commonProps.invoice.dueDate, 'yyyy-MM-dd')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ItemsTable items={pageItems} t={commonProps.t} currencySymbol={commonProps.currencySymbol} />
            {pageIndex === totalPages - 1 && <InvoiceFooter {...commonProps}/>}
        </div>
    </div>
)

// --- TEMPLATE: USA ---
const UsaTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => {
    const { invoice, logoUrl, t, currencySymbol, subtotal, taxAmount, discountAmount, total, balanceDue, accentColor } = commonProps;

    const finalShippingAddress = invoice.shippingAddress || invoice.clientAddress;

    return (
        <div className={pageIndex < totalPages - 1 ? "page-break" : ""}>
            <div className="p-10 font-sans text-sm text-gray-800">
                {/* Header */}
                <header className="flex justify-between items-start pb-6 border-b-2" style={{borderColor: accentColor}}>
                    <div className="w-1/2">
                        {logoUrl ? (
                            <Image src={logoUrl} alt={`${invoice.companyName} Logo`} width={160} height={80} className="object-contain" data-ai-hint="logo" />
                        ) : (
                             <h1 className="text-3xl font-bold font-headline" style={{ color: accentColor }}>{invoice.companyName}</h1>
                        )}
                        <div className="mt-4 text-xs text-gray-500">
                            <p className="font-bold text-base text-gray-700">{invoice.companyName}</p>
                            <p className="whitespace-pre-line">{invoice.companyAddress}</p>
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
                                <span className="w-28 text-right font-medium">{format(invoice.invoiceDate, 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex justify-end">
                                <span className="text-gray-500 w-28 text-right">Due Date</span>
                                <span className="w-28 text-right font-medium">{format(invoice.dueDate, 'MMM d, yyyy')}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Client Info */}
                <section className="grid grid-cols-2 gap-8 mt-6">
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
                
                {/* Items Table */}
                 <section className="mt-8">
                    <table className="w-full text-left">
                        <thead>
                        <tr style={{backgroundColor: accentColor, color: 'white'}} className="text-xs uppercase">
                            <th className="p-3 font-semibold w-1/2">Description</th>
                            <th className="p-3 font-semibold text-right">Quantity</th>
                            <th className="p-3 font-semibold text-right">Rate</th>
                            <th className="p-3 font-semibold text-right">Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3 align-top">
                                    <p className="font-medium">{item.name || <span className="text-gray-400">Item description</span>}</p>
                                </td>
                                <td className="p-3 text-right tabular-nums align-top">{item.quantity}</td>
                                <td className="p-3 text-right tabular-nums align-top">{currencySymbol}{item.rate.toFixed(2)}</td>
                                <td className="p-3 text-right tabular-nums font-medium align-top">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>


                {pageIndex === totalPages - 1 && (
                    <div className="grid grid-cols-2 gap-8 mt-6">
                        {/* Payment Instructions */}
                        <div>
                             {invoice.paymentInstructions && (
                                <div className="text-xs">
                                    <p className="font-bold text-gray-500 uppercase">Payment Instructions</p>
                                    <div className="mt-2 text-gray-600 whitespace-pre-line">
                                        {invoice.paymentInstructions}
                                    </div>
                                </div>
                             )}
                        </div>

                        {/* Totals */}
                        <div className="text-sm">
                             <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium tabular-nums">{currencySymbol}{subtotal.toFixed(2)}</span>
                                </div>
                                 {invoice.discount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Discount ({invoice.discount}%)</span>
                                        <span className="font-medium tabular-nums">-{currencySymbol}{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {invoice.shippingCost > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Shipping Cost</span>
                                        <span className="font-medium tabular-nums">{currencySymbol}{invoice.shippingCost.toFixed(2)}</span>
                                    </div>
                                )}
                                {invoice.tax > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Sales Tax ({invoice.tax}%)</span>
                                        <span className="font-medium tabular-nums">{currencySymbol}{taxAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold">
                                    <span className="text-gray-500">Total</span>
                                    <span className="tabular-nums">{currencySymbol}{total.toFixed(2)}</span>
                                </div>
                                {invoice.amountPaid > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Amount Paid</span>
                                        <span className="font-medium tabular-nums">-{currencySymbol}{invoice.amountPaid.toFixed(2)}</span>
                                    </div>
                                )}
                                 <div className="flex justify-between items-center font-bold text-lg p-3 mt-2 rounded-md" style={{backgroundColor: accentColor, color: 'white'}}>
                                    <span>Balance Due</span>
                                    <span className="tabular-nums">{currencySymbol}{balanceDue.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                 {pageIndex === totalPages - 1 && (
                    <footer className="text-center mt-16 text-xs text-gray-500">
                        <p>Thank you for your business!</p>
                    </footer>
                )}

            </div>
        </div>
    );
};


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
  const total = subtotal + taxAmount - discountAmount + (invoice.shippingCost || 0);
  const balanceDue = total - (invoice.amountPaid || 0);
  const currencySymbol = currencySymbols[invoice.currency] || '$';

  const t = locales[invoice.language as keyof typeof locales] || locales.en;

  const previewStyle = {
      '--primary-hsl': accentColor,
      '--primary': accentColor
  } as React.CSSProperties;

  const TemplateComponent = templates[invoice.template as keyof typeof templates] || templates.default;
  
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
    const itemPages = [];
    for (let i = 0; i < invoice.items.length; i += ITEMS_PER_PAGE) {
      itemPages.push(invoice.items.slice(i, i + ITEMS_PER_PAGE));
    }
    
    return (
      <div id={id} className="bg-white text-gray-800" style={previewStyle}>
        {itemPages.map((pageItems, pageIndex) => (
          <TemplateComponent
            key={pageIndex}
            {...commonProps}
            pageItems={pageItems}
            pageIndex={pageIndex}
            totalPages={itemPages.length}
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
            {...commonProps}
            pageItems={invoice.items}
            pageIndex={0}
            totalPages={1}
          />
      </CardContent>
    </Card>
  );
}
