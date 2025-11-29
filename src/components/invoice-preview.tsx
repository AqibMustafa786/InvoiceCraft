'use client';

import type { Invoice } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { format } from 'date-fns';
import locales from '@/lib/locales';

interface InvoicePreviewProps {
  invoice: Invoice;
  logoUrl: string | null;
  accentColor: string;
  id?: string;
  isPrint?: boolean;
}

const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    PKR: '₨',
};

const ITEMS_PER_PAGE = 10;

const PageHeader = ({ invoice, logoUrl, accentColor, t }: { invoice: Invoice, logoUrl: string | null, accentColor: string, t: any }) => (
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

const PageClientDetails = ({ invoice, t }: { invoice: Invoice, t: any }) => (
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
)

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


  if (isPrint) {
    const itemPages = [];
    for (let i = 0; i < invoice.items.length; i += ITEMS_PER_PAGE) {
      itemPages.push(invoice.items.slice(i, i + ITEMS_PER_PAGE));
    }
    
    return (
      <div id={id} className="bg-white text-gray-800" style={previewStyle}>
        {itemPages.map((pageItems, pageIndex) => (
          <div key={pageIndex} className={pageIndex < itemPages.length - 1 ? "page-break" : ""}>
            <div className="p-8 md:p-10">
              <PageHeader invoice={invoice} logoUrl={logoUrl} accentColor={accentColor} t={t} />
              <PageClientDetails invoice={invoice} t={t} />
              <section>
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-sm font-semibold w-1/2">{t.item}</th>
                      <th className="p-3 text-sm font-semibold text-center">{t.quantity}</th>
                      <th className="p-3 text-sm font-semibold text-right">{t.rate}</th>
                      <th className="p-3 text-sm font-semibold text-right">{t.subtotal}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map(item => (
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

              {pageIndex === itemPages.length - 1 && (
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
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default live preview (single page)
  return (
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide" style={previewStyle}>
      <CardContent className="p-8 md:p-10 text-gray-800">
          <PageHeader invoice={invoice} logoUrl={logoUrl} accentColor={accentColor} t={t}/>
          <PageClientDetails invoice={invoice} t={t}/>
          <section>
              <table className="w-full text-left">
                  <thead className="bg-gray-50">
                  <tr>
                      <th className="p-3 text-sm font-semibold w-1/2">{t.item}</th>
                      <th className="p-3 text-sm font-semibold text-center">{t.quantity}</th>
                      <th className="p-3 text-sm font-semibold text-right">{t.rate}</th>
                      <th className="p-3 text-sm font-semibold text-right">{t.subtotal}</th>
                  </tr>
                  </thead>
                  <tbody>
                  {invoice.items.map(item => (
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
      </CardContent>
    </Card>
  );
}
