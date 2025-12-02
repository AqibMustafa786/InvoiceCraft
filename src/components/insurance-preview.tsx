
'use client';

import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import type { InsuranceDocument, LineItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { format, isValid } from 'date-fns';
import locales from '@/lib/locales';

// --- PROPS ---
interface InsurancePreviewProps {
  doc: InsuranceDocument;
  logoUrl: string | null;
  accentColor: string;
  id?: string;
  isPrint?: boolean;
}

interface CommonTemplateProps {
  doc: InsuranceDocument;
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

const safeFormat = (date: Date | string | number, formatString: string) => {
    const d = new Date(date || new Date());
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}


// --- TEMPLATE: USA Claim Default ---
const UsaClaimDefaultTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => {
    const { doc, logoUrl, accentColor, total, subtotal, currencySymbol } = commonProps;

    return (
        <div className={`invoice-page font-sans text-gray-800 ${pageIndex < totalPages - 1 ? "page-break" : ""}`}>
            <div className="p-8 m-4 border-2" style={{ borderColor: accentColor }}>
                <header className="grid grid-cols-2 gap-10 mb-8" data-element="header">
                     <div>
                        {logoUrl ? (
                            <Image src={logoUrl} alt={`${doc.companyName} Logo`} width={160} height={80} className="object-contain mb-2" data-ai-hint="logo" />
                        ) : (
                            <h1 className="text-3xl font-bold mb-1" style={{color: accentColor}}>{doc.companyName}</h1>
                        )}
                        <p className="text-xs text-gray-600 whitespace-pre-line">{doc.companyAddress}</p>
                    </div>
                     <div className="text-right">
                        <h2 className="text-4xl font-bold">INVOICE</h2>
                        <div className="mt-4 text-xs space-y-1">
                            <p><span className="font-bold text-gray-500">Invoice #:</span> {doc.documentNumber}</p>
                            <p><span className="font-bold text-gray-500">Date:</span> {safeFormat(new Date(doc.documentDate || new Date()), 'M/d/yyyy')}</p>
                        </div>
                    </div>
                </header>
                 <section className="mb-6 text-xs" data-element="insurance-details">
                    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 p-3 bg-gray-50 rounded-md">
                        <span className="font-bold text-gray-600">Insured:</span><span className="font-medium">{doc.insuredName}</span>
                        <span className="font-bold text-gray-600">Address:</span><span className="whitespace-pre-line font-medium">{doc.insuredAddress}</span>
                        <span className="font-bold text-gray-600">Claim #:</span><span className="font-medium">{doc.claimNumber}</span>
                        <span className="font-bold text-gray-600">Policy ID:</span><span className="font-medium">{doc.policyId}</span>
                        <span className="font-bold text-gray-600">Date of Loss:</span><span className="font-medium">{doc.dateOfLoss}</span>
                        <span className="font-bold text-gray-600">Claim Type:</span><span className="font-medium">{doc.typeOfClaim}</span>
                        <span className="font-bold text-gray-600">Insurance Co:</span><span className="font-medium">{doc.insuranceCompany}</span>
                         <span className="font-bold text-gray-600">Adjuster:</span><span className="whitespace-pre-line font-medium">{doc.adjusterInfo}</span>
                    </div>
                </section>
                <main>
                    <table className="w-full border-collapse border text-sm" data-element="items-table">
                        <thead data-element="table-header">
                            <tr className="bg-gray-100">
                                <th className="border p-2 font-bold w-full text-left">Description of Services</th>
                                <th className="border p-2 font-bold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr data-element="table-row">
                                <td className="border p-2 align-top h-8 whitespace-pre-line font-bold">{doc.incidentDescription}</td>
                                <td className="border p-2 text-right align-top"></td>
                            </tr>
                            {pageItems?.filter(Boolean).map((item) => (
                                <tr key={item.id} data-element="table-row">
                                    <td className="border p-2 align-top h-8 whitespace-pre-line pl-6">{item.name}</td>
                                    <td className="border p-2 text-right align-top">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                                </tr>
                            ))}
                             {[...Array(Math.max(0, 8 - (pageItems?.length || 0)))].map((_, i) => (
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
                            {doc.tax > 0 && <tr>
                                <td className="border p-2 text-right font-bold">Tax ({doc.tax}%)</td>
                                <td className="border p-2 text-right">{currencySymbol}{commonProps.taxAmount.toFixed(2)}</td>
                            </tr>}
                            {doc.discount > 0 && <tr>
                                <td className="border p-2 text-right font-bold">Discount ({doc.discount}%)</td>
                                <td className="border p-2 text-right text-red-600">-{currencySymbol}{commonProps.discountAmount.toFixed(2)}</td>
                            </tr>}
                            <tr className="bg-gray-100 font-bold text-base">
                                <td className="border p-2 text-right">Total Due</td>
                                <td className="border p-2 text-right">{currencySymbol}{total.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </main>
                {doc.notes && (
                    <footer className="mt-8 text-xs" data-element="footer">
                        <p className="font-bold">Notes:</p>
                        <p className="text-gray-600 whitespace-pre-line">{doc.notes}</p>
                    </footer>
                )}
            </div>
        </div>
    );
};


const templates = {
    'usa-claim-default': UsaClaimDefaultTemplatePage,
};


const PAGE_HEIGHT = 1056; // 11 inches at 96 DPI for Letter size
const PAGE_PADDING = 80; // 40px top + 40px bottom
const AVAILABLE_HEIGHT = PAGE_HEIGHT - PAGE_PADDING;


// --- MAIN PREVIEW COMPONENT ---
export function InsurancePreview({ doc, logoUrl, accentColor, id = 'insurance-preview', isPrint = false }: InsurancePreviewProps) {
  const [paginatedItems, setPaginatedItems] = useState<LineItem[][]>(doc ? [doc.items] : [[]]);
  const [needsRemeasure, setNeedsRemeasure] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  if (!doc) {
    return null;
  }

  const subtotal = doc.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  const taxAmount = (subtotal * doc.tax) / 100;
  const discountAmount = (subtotal * doc.discount) / 100;
  const total = subtotal + taxAmount - discountAmount + (doc.shippingCost || 0);
  const currencySymbol = currencySymbols[doc.currency] || '$';
  const t = locales[doc.language as keyof typeof locales] || locales.en;

  useEffect(() => {
    setNeedsRemeasure(true);
    setPaginatedItems(doc ? [doc.items] : [[]]);
  }, [doc, logoUrl, accentColor, t]);


  const previewStyle = {
      '--primary-hsl': accentColor,
      '--primary': accentColor
  } as React.CSSProperties;

  const TemplateComponent = templates[doc.template as keyof typeof templates] || templates['usa-claim-default'];
  
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
        const insuranceDetails = tempContainer.querySelector('[data-element="insurance-details"]') as HTMLElement;
        const tableHeader = tempContainer.querySelector('[data-element="table-header"]') as HTMLElement;
        const footer = tempContainer.querySelector('[data-element="footer"]') as HTMLElement;
        const allRows = Array.from(tempContainer.querySelectorAll('[data-element="table-row"]')) as HTMLElement[];
        
        if (!header || !tableHeader || allRows.length === 0) {
            document.body.removeChild(tempRoot);
            return;
        }

        let headerHeight = header.offsetHeight + (insuranceDetails?.offsetHeight || 0);
        const tableHeaderHeight = tableHeader.offsetHeight;
        const footerHeight = (footer?.offsetHeight || 0) + (tableHeader?.parentElement?.querySelector('tfoot')?.offsetHeight || 0);

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

            newPages[currentPage].push(doc.items[index]);
            currentPageHeight += itemHeight;
        });
        
        const lastPageItemHeight = (newPages[currentPage] || []).reduce((total, item) => {
            if (!item) return total;
            const itemIndex = doc.items.findIndex(i => i.id === item.id);
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

  }, [doc.items, isPrint, needsRemeasure, TemplateComponent, doc]);


  const commonProps: Omit<PageProps, 'pageItems' | 'pageIndex' | 'totalPages'> = {
    doc,
    logoUrl,
    accentColor,
    t,
    currencySymbol,
    subtotal,
    taxAmount,
    discountAmount,
    total,
  };

  if (isPrint) {
    const itemsToRender = needsRemeasure ? (doc ? [doc.items] : [[]]) : paginatedItems;
    
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
            pageItems={doc.items}
            pageIndex={0}
            totalPages={1}
          />
      </CardContent>
    </Card>
  );
}

    

    