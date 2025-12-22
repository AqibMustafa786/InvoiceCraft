
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
  accentColor: string;
  id?: string;
  isPrint?: boolean;
}

interface CommonTemplateProps {
  doc: InsuranceDocument;
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

const InsuredEntityDetails: React.FC<{ doc: InsuranceDocument; t: any; }> = ({ doc, t }) => {
    return (
        <section className="mb-6 text-xs" data-element="insured-entity-details">
            <p className="font-bold text-gray-600 border-b mb-1">Insured Entity</p>
            <p><span className="font-bold">Category:</span> {doc.insuranceCategory}</p>
            <p><span className="font-bold">Description:</span> {doc.insuredItemDescription}</p>
            <p className="font-bold mt-2">Coverage Details:</p>
            <p><span className="font-bold">Sum Insured:</span> {doc.coverageAmount}</p>
            <p><span className="font-bold">Deductible:</span> {doc.deductibleAmount}</p>
            <p className="mt-1"><span className="font-bold">Scope:</span> {doc.coverageScope}</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                    <p className="font-semibold">Included:</p>
                    <p className="whitespace-pre-line text-green-700">{doc.includedRisks}</p>
                </div>
                 <div>
                    <p className="font-semibold">Excluded:</p>
                    <p className="whitespace-pre-line text-red-700">{doc.excludedRisks}</p>
                </div>
            </div>
        </section>
    )
}

// --- TEMPLATE: USA Claim Default ---
const UsaClaimDefaultTemplatePage = ({ pageItems, pageIndex, totalPages, ...commonProps }: PageProps) => {
    const { doc, accentColor, total, subtotal, currencySymbol } = commonProps;

    return (
        <div className={`invoice-page font-sans text-gray-800 ${pageIndex < totalPages - 1 ? "page-break" : ""}`}>
            <div className="p-8 m-4 border-2" style={{ borderColor: accentColor }}>
                <header className="grid grid-cols-2 gap-10 mb-8" data-element="header">
                     <div>
                        {doc.logoUrl ? (
                            <Image src={doc.logoUrl} alt={`${doc.business.name} Logo`} width={160} height={80} className="object-contain mb-2" data-ai-hint="logo" />
                        ) : (
                            <h1 className="text-3xl font-bold mb-1" style={{color: accentColor}}>{doc.business.name}</h1>
                        )}
                        <p className="text-xs text-gray-600 whitespace-pre-line">{doc.business.address}</p>
                    </div>
                     <div className="text-right">
                        <h2 className="text-4xl font-bold">INVOICE</h2>
                        <div className="mt-4 text-xs space-y-1">
                            <p><span className="font-bold text-gray-500">Invoice #:</span> {doc.policyNumber}</p>
                            <p><span className="font-bold text-gray-500">Date:</span> {safeFormat(new Date(doc.documentDate || new Date()), 'M/d/yyyy')}</p>
                        </div>
                    </div>
                </header>
                 <section className="mb-6 text-xs" data-element="insurance-details">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 p-3 bg-gray-50 rounded-md">
                        <div>
                            <p className="font-bold text-gray-600 border-b mb-1">Policy Holder</p>
                            <p><span className="font-bold">Name:</span> {doc.policyHolder.name}</p>
                            <p><span className="font-bold">Address:</span> {doc.policyHolder.address}</p>
                            <p><span className="font-bold">Policy ID:</span> {doc.policyId}</p>
                        </div>
                         <div>
                            <p className="font-bold text-gray-600 border-b mb-1">Claim Details</p>
                            <p><span className="font-bold">Claim #:</span> {doc.claimNumber}</p>
                            <p><span className="font-bold">Date of Loss:</span> {doc.dateOfLoss}</p>
                            <p><span className="font-bold">Claim Type:</span> {doc.typeOfClaim}</p>
                        </div>
                        <div className="col-span-2">
                             <p className="font-bold text-gray-600 border-b mb-1">Provider Information</p>
                             <p><span className="font-bold">Company:</span> {doc.insuranceCompany.name}</p>
                             <p><span className="font-bold">Agent:</span> {doc.insuranceCompany.agentName} {doc.insuranceCompany.agentLicenseNumber && `(Lic: ${doc.insuranceCompany.agentLicenseNumber})`}</p>
                             <p><span className="font-bold">Contact:</span> {doc.insuranceCompany.phone} | {doc.insuranceCompany.email}</p>
                        </div>
                         <div className="col-span-2">
                             <p className="font-bold text-gray-600 border-b mb-1">Policy Information</p>
                             <p><span className="font-bold">Policy Type:</span> {doc.policyType}</p>
                             <p><span className="font-bold">Period:</span> {safeFormat(doc.policyStartDate, 'MM/dd/yyyy')} - {safeFormat(doc.policyEndDate, 'MM/dd/yyyy')}</p>
                             <p><span className="font-bold">Status:</span> <span className="capitalize">{doc.status}</span></p>
                        </div>
                    </div>
                </section>
                <InsuredEntityDetails doc={doc} t={commonProps.t} />
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
                                <td className="border p-2 align-top h-8 whitespace-pre-line font-bold">{doc.insuredItemDescription}</td>
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
export function InsurancePreview({ doc, accentColor, id = 'insurance-preview', isPrint = false }: InsurancePreviewProps) {
  const [paginatedItems, setPaginatedItems] = useState<LineItem[][]>([]);
  const [needsRemeasure, setNeedsRemeasure] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
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
  }, [doc, accentColor, t]);


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
    accentColor,
    t,
    currencySymbol,
    subtotal,
    taxAmount,
    discountAmount,
    total,
  };
  
  if (!isClient) {
    return (
        <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide">
            <CardContent className="p-8 text-center text-muted-foreground">
                Loading Preview...
            </CardContent>
        </Card>
    );
  }


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
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide hover:shadow-primary/20 transition-shadow" style={previewStyle}>
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
