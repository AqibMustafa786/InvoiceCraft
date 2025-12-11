
'use client';

import { useState, useLayoutEffect, useRef, useEffect, FC } from 'react';
import type { Estimate } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { format, isValid } from 'date-fns';
import { ConstructionTemplate1, ConstructionTemplate2, ConstructionTemplate3, ConstructionTemplate4, ConstructionTemplate5 } from './document-templates/construction-templates';
import { RemodelingTemplate1, RemodelingTemplate2, RemodelingTemplate3, RemodelingTemplate4, RemodelingTemplate5 } from './document-templates/remodeling-templates';
import { HVACTemplate1, HVACTemplate2, HVACTemplate3, HVACTemplate4, HVACTemplate5 } from './document-templates/hvac-templates';
import { PlumbingTemplate1, PlumbingTemplate2, PlumbingTemplate3, PlumbingTemplate4, PlumbingTemplate5 } from './document-templates/plumbing-templates';
import { ElectricalTemplate1, ElectricalTemplate2, ElectricalTemplate3, ElectricalTemplate4, ElectricalTemplate5 } from './document-templates/electrical-templates';
import { LandscapingTemplate1, LandscapingTemplate2, LandscapingTemplate3, LandscapingTemplate4, LandscapingTemplate5 } from './document-templates/landscaping-templates';
import { RoofingTemplate1, RoofingTemplate2, RoofingTemplate3, RoofingTemplate4, RoofingTemplate5 } from './document-templates/roofing-templates';
import { AutoRepairTemplate1, AutoRepairTemplate2, AutoRepairTemplate3, AutoRepairTemplate4, AutoRepairTemplate5 } from './document-templates/auto-repair-templates';
import { CleaningTemplate1, CleaningTemplate2, CleaningTemplate3, CleaningTemplate4, CleaningTemplate5 } from './document-templates/cleaning-templates';
import { ITTemplate1, ITTemplate2, ITTemplate3, ITTemplate4, ITTemplate5 } from './document-templates/it-freelance-templates';
import locales from '@/lib/locales';


// --- PROPS ---
interface DocumentPreviewProps {
  document: Estimate;
  accentColor: string;
  backgroundColor?: string;
  textColor?: string;
  id?: string;
  isPrint?: boolean;
}

interface CommonTemplateProps {
  document: Estimate;
  accentColor: string;
  backgroundColor?: string;
  textColor?: string;
  t: any;
}

interface PageProps extends CommonTemplateProps {
    pageItems: Estimate['lineItems'];
    pageIndex: number;
    totalPages: number;
    summary: Estimate['summary'];
    style: React.CSSProperties;
}

const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    PKR: '₨',
};

const safeFormat = (date: Date | string | number | undefined | null, formatString: string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-4" data-element="signature">
            <p className="text-xs text-gray-500">{label}</p>
            <Image src={signature.image} alt="Signature" width={150} height={75} className="mt-1 border-b" />
            <p className="text-xs text-gray-600 mt-1">Signed by: {signature.signerName}</p>
            <p className="text-xs text-gray-500">Date: {safeFormat(signature.signedAt, 'MMM d, yyyy, h:mm a')}</p>
        </div>
    )
}

const CategoryPreview = ({ document }: { document: Estimate }) => {
    return null;
};

const PageHeader = ({ document, style, pageIndex, t }: { document: Estimate, style: React.CSSProperties, pageIndex: number, t: any }) => {
    const { business } = document;
    const documentTitle = document.documentType === 'quote' ? t.quote || 'Quote' : t.estimate || 'Estimate';
    
    return (
        <div data-element="page-header-content" className="flex flex-col">
            {pageIndex === 0 && (
                 <div className="flex justify-between items-start mb-8">
                    <div className="w-1/2">
                        {business.logoUrl ? (
                            <Image src={business.logoUrl} alt={`${business.name} Logo`} width={100} height={100} className="object-contain" data-ai-hint="logo" />
                        ) : (
                            <h2 className="text-xl font-bold" style={{ color: style.color }}>{business.name}</h2>
                        )}
                    </div>
                    <div className="w-1/2 text-right">
                       <h2 className="text-3xl font-bold mb-4" style={{ color: business.logoUrl ? style.color : 'inherit' }}>{documentTitle}</h2>
                    </div>
                </div>
            )}
             <div className="flex justify-between items-start text-xs">
                <div className="w-1/2 space-y-0.5">
                    {pageIndex === 0 && (
                        <>
                            {business.licenseNumber && <p>{t.license || 'Lic #'}: {business.licenseNumber}</p>}
                            {business.taxId && <p>{t.taxId || 'Tax ID'}: {business.taxId}</p>}
                            <p>{business.phone}</p>
                            <p>{business.email}</p>
                            <p className="whitespace-pre-line">{business.address}</p>
                        </>
                    )}
                </div>
                 <div className="w-1/2 text-right">
                    <div className="flex justify-end">
                        <span className="font-bold w-24">{t.estimateNumber || 'Estimate #'}</span>
                        <span className="w-24 text-left">{document.estimateNumber}</span>
                    </div>
                    <div className="flex justify-end mt-1">
                        <span className="font-bold w-24">{t.date || 'Date'}</span>
                        <span className="w-24 text-left">{safeFormat(document.estimateDate, 'MM/dd/yyyy')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PageClientDetails = ({ document, t }: { document: Estimate, t: any }) => (
     <section data-element="client-details" className="flex justify-between items-start my-8 text-xs">
        <div className="w-1/3 space-y-0.5">
            <p className="font-bold mb-1">{t.billTo || 'BILL TO'}</p>
            <p className="font-semibold">{document.client.name}</p>
            {document.client.companyName && <p>{document.client.companyName}</p>}
            {document.client.email && <p>{document.client.email}</p>}
            {document.client.phone && <p>{document.client.phone}</p>}
            <p className="whitespace-pre-line">{document.client.address}</p>
        </div>
        <div className="w-1/3 space-y-0.5">
            {document.client.projectLocation && (
                <>
                    <p className="font-bold mb-1">{t.projectLocation || 'PROJECT LOCATION'}</p>
                    <p className="whitespace-pre-line">{document.client.projectLocation}</p>
                </>
            )}
        </div>
    </section>
);


const PageFooter = ({ document, style, t }: { document: Estimate, style: React.CSSProperties, t: any }) => {
    const { summary } = document;
    const currencySymbol = currencySymbols[document.currency] || '$';
    const subtotalLessDiscount = summary.subtotal - (summary.discount || 0);
    const taxRate = summary.taxPercentage || 0;

    return (
        <div data-element="footer" className="avoid-page-break">
            <section className="flex justify-between items-start mt-6">
                <div className="w-1/2 text-xs">
                    <p className="font-bold mb-1">{t.notes || 'Notes'}</p>
                    <p className="whitespace-pre-line">{document.termsAndConditions}</p>
                    <div className="flex gap-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || "Authorized Signature"} />
                        <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || "Client Signature"} />
                    </div>
                </div>
                <div className="w-2/5 space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span>{t.subtotal || 'Subtotal'}</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{summary.subtotal.toFixed(2)}</span>
                    </div>
                     {summary.discount > 0 && (
                        <div className="flex justify-between text-red-500">
                            <span>{t.discount || 'Discount'}</span>
                            <span className="font-medium tabular-nums">-{currencySymbol}{summary.discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold border-b pb-1 mb-1">
                        <span>{t.subtotalLessDiscount || 'Subtotal less discount'}</span>
                        <span className="tabular-nums">{currencySymbol}{subtotalLessDiscount.toFixed(2)}</span>
                    </div>
                    {taxRate > 0 && (
                         <div className="flex justify-between">
                            <span>{t.taxRate || 'Tax Rate'}</span>
                            <span className="tabular-nums">{taxRate.toFixed(2)}%</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>{t.totalTax || 'Total tax'}</span>
                        <span className="font-medium tabular-nums">{currencySymbol}{summary.taxAmount.toFixed(2)}</span>
                    </div>
                     {summary.shippingCost > 0 && (
                        <div className="flex justify-between">
                            <span>{t.shipping || 'Shipping/Handling'}</span>
                            <span className="font-medium tabular-nums">{currencySymbol}{summary.shippingCost.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center font-bold text-lg pt-2 mt-2" style={{ color: style.color }}>
                        <span className="uppercase">{document.documentType === 'quote' ? t.quoteTotal || 'Quote Total' : t.estimateTotal || 'Estimate Total'}</span>
                        <span className="tabular-nums">{currencySymbol}{summary.grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </section>
        </div>
    );
};


const ModernTemplatePage: FC<PageProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const currencySymbol = currencySymbols[document.currency] || '$';

    return (
        <div className={`p-8 md:p-10 font-sans flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ color: document.textColor, fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, backgroundColor: document.backgroundColor, minHeight: '1056px' }}>
            <div data-element="page-content">
                <PageHeader document={document} style={style} pageIndex={pageIndex} t={t}/>
                {(pageIndex === 0) && (
                    <>
                        <PageClientDetails document={document} t={t}/>
                        <CategoryPreview document={document} />
                    </>
                )}
            </div>
            
            <section className="mt-8 flex-grow">
                <table className="w-full text-left text-xs" data-element="items-table">
                    <thead style={{ backgroundColor: style.color, color: 'white' }} data-element="table-header">
                        <tr>
                            <th className="p-2 font-bold w-1/2">{t.item || 'Item/Service Description'}</th>
                            <th className="p-2 font-bold text-right">{t.quantity || 'Quantity'}</th>
                            <th className="p-2 font-bold text-right">{t.rate || 'Item Price'}</th>
                            <th className="p-2 font-bold text-right">{t.amount || 'Amount'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b" data-element="table-row">
                                <td className="p-2 whitespace-pre-line">{item.name || ''}</td>
                                <td className="p-2 text-right tabular-nums">{item.quantity}</td>
                                <td className="p-2 text-right tabular-nums">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 text-right tabular-nums">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {pageIndex === totalPages - 1 && <PageFooter document={document} style={style} t={t}/>}
        </div>
    );
};

const templates: { [key: string]: FC<PageProps> } = {
  'default': ModernTemplatePage,
  'construction-1': ConstructionTemplate1,
  'construction-2': ConstructionTemplate2,
  'construction-3': ConstructionTemplate3,
  'construction-4': ConstructionTemplate4,
  'construction-5': ConstructionTemplate5,
  'remodeling-1': RemodelingTemplate1,
  'remodeling-2': RemodelingTemplate2,
  'remodeling-3': RemodelingTemplate3,
  'remodeling-4': RemodelingTemplate4,
  'remodeling-5': RemodelingTemplate5,
  'hvac-1': HVACTemplate1,
  'hvac-2': HVACTemplate2,
  'hvac-3': HVACTemplate3,
  'hvac-4': HVACTemplate4,
  'hvac-5': HVACTemplate5,
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
  'landscaping-1': LandscapingTemplate1,
  'landscaping-2': LandscapingTemplate2,
  'landscaping-3': LandscapingTemplate3,
  'landscaping-4': LandscapingTemplate4,
  'landscaping-5': LandscapingTemplate5,
  'roofing-1': RoofingTemplate1,
  'roofing-2': RoofingTemplate2,
  'roofing-3': RoofingTemplate3,
  'roofing-4': RoofingTemplate4,
  'roofing-5': RoofingTemplate5,
  'auto-repair-1': AutoRepairTemplate1,
  'auto-repair-2': AutoRepairTemplate2,
  'auto-repair-3': AutoRepairTemplate3,
  'auto-repair-4': AutoRepairTemplate4,
  'auto-repair-5': AutoRepairTemplate5,
  'cleaning-1': CleaningTemplate1,
  'cleaning-2': CleaningTemplate2,
  'cleaning-3': CleaningTemplate3,
  'cleaning-4': CleaningTemplate4,
  'cleaning-5': CleaningTemplate5,
  'it-1': ITTemplate1,
  'it-2': ITTemplate2,
  'it-3': ITTemplate3,
  'it-4': ITTemplate4,
  'it-5': ITTemplate5,
};


const PAGE_HEIGHT = 1056; // 11 inches at 96 DPI for Letter size
const PAGE_PADDING = 80; // 40px top + 40px bottom
const AVAILABLE_HEIGHT = PAGE_HEIGHT - PAGE_PADDING;


const DocumentPreviewInternal: FC<DocumentPreviewProps> = ({ document, accentColor, backgroundColor, textColor, id = 'document-preview', isPrint = false }) => {
  const [paginatedItems, setPaginatedItems] = useState<Estimate['lineItems'][][]>(document ? [document.lineItems] : [[]]);
  const [needsRemeasure, setNeedsRemeasure] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const t = locales[document.language as keyof typeof locales] || locales.en;

  useEffect(() => {
    setNeedsRemeasure(true);
  }, [document]);
  
  const previewStyle = {
      color: document?.textColor || '#374151',
      fontFamily: document?.fontFamily || 'Inter, sans-serif',
      fontSize: `${document?.fontSize || 10}pt`,
      backgroundColor: document?.backgroundColor || '#FFFFFF',
  } as React.CSSProperties;

  const dynamicColorStyle = {
      color: accentColor,
      fontFamily: document?.fontFamily || 'Inter, sans-serif',
      fontSize: `${document?.fontSize || 10}pt`,
  }

  const TemplateComponent = templates[document.template] || templates.default;
  
  useLayoutEffect(() => {
    if (!document || !isPrint || !needsRemeasure || !TemplateComponent) return;

    const measureAndPaginate = async () => {
        if (typeof window.document === 'undefined') return;
        const container = containerRef.current;
        if (!container) return;

        const tempRoot = window.document.createElement('div');
        tempRoot.style.position = 'absolute';
        tempRoot.style.left = '-9999px';
        tempRoot.style.width = `${container.clientWidth}px`;
        window.document.body.appendChild(tempRoot);

        try {
            const tempContainer = container.cloneNode(true) as HTMLElement;
            tempRoot.appendChild(tempContainer);
            
            await new Promise(resolve => setTimeout(resolve, 0));

            const headerContentEl = tempContainer.querySelector('[data-element="page-header-content"]') as HTMLElement;
            const clientDetailsEl = tempContainer.querySelector('[data-element="client-details"]') as HTMLElement;
            const categoryEl = tempContainer.querySelector('[data-element="category-preview-wrapper"]') as HTMLElement;
            const tableHeaderEl = tempContainer.querySelector('[data-element="table-header"]') as HTMLElement;
            const footerEl = tempContainer.querySelector('[data-element="footer"]') as HTMLElement;
            const allRows = Array.from(tempContainer.querySelectorAll('[data-element="table-row"]')) as HTMLElement[];

            if (!headerContentEl || !tableHeaderEl || !footerEl || allRows.length === 0) {
                setPaginatedItems([document.lineItems]);
                setNeedsRemeasure(false);
                window.document.body.removeChild(tempRoot);
                return;
            }
            
            const firstPageHeaderHeight = headerContentEl.offsetHeight + (clientDetailsEl?.offsetHeight || 0) + (categoryEl?.offsetHeight || 0);
            const subsequentPageHeaderHeight = headerContentEl.offsetHeight;
            const tableHeaderHeight = tableHeaderEl.offsetHeight;
            const footerHeight = footerEl.offsetHeight;

            const pages: Estimate['lineItems'][][] = [];
            let currentPageItems: Estimate['lineItems'][] = [];
            let currentPageHeight = 0;

            for (let i = 0; i < document.lineItems.length; i++) {
                const item = document.lineItems[i];
                const rowHeight = allRows[i] ? allRows[i].offsetHeight : 20;
                
                const isFirstPage = pages.length === 0;
                const isFirstItemOnNewPage = currentPageItems.length === 0;

                let usedHeight = currentPageHeight;
                if (isFirstItemOnNewPage) {
                    usedHeight += isFirstPage ? firstPageHeaderHeight + tableHeaderHeight : subsequentPageHeaderHeight + tableHeaderHeight;
                }
                
                const isLastItem = i === document.lineItems.length - 1;
                const spaceNeeded = rowHeight + (isLastItem ? footerHeight : 0);

                if (usedHeight + spaceNeeded > AVAILABLE_HEIGHT) {
                    pages.push(currentPageItems);
                    currentPageItems = [item];
                    currentPageHeight = rowHeight;
                } else {
                    currentPageItems.push(item);
                    currentPageHeight += rowHeight;
                }
            }

            if (currentPageItems.length > 0) {
                pages.push(currentPageItems);
            }
            
            if (pages.length === 0 && document.lineItems.length > 0) {
                pages.push(document.lineItems);
            } else if (pages.length === 0) {
                pages.push([]);
            }

            setPaginatedItems(pages);
            setNeedsRemeasure(false);

        } finally {
            if (window.document.body.contains(tempRoot)) {
                window.document.body.removeChild(tempRoot);
            }
        }
    };
    
    const timer = setTimeout(measureAndPaginate, 100);
    return () => clearTimeout(timer);

  }, [document, isPrint, needsRemeasure, TemplateComponent]);


  if (!document || !TemplateComponent) {
    return (
      <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide">
        <CardContent className="p-8 text-center text-muted-foreground">
          Loading Preview...
        </CardContent>
      </Card>
    );
  }

  const commonProps: CommonTemplateProps = {
    document,
    accentColor,
    backgroundColor: backgroundColor || '#FFFFFF',
    textColor: textColor || '#374151',
    t,
  };

  if (isPrint) {
    const itemsToRender = needsRemeasure ? [document.lineItems] : paginatedItems;
    
    return (
      <div id={id} style={{backgroundColor: backgroundColor}} ref={containerRef}>
        <div style={{ position: 'absolute', left: '-9999px' }}>
             <PageHeader document={document} style={dynamicColorStyle} pageIndex={0} t={t}/>
             <PageClientDetails document={document} t={t}/>
             <CategoryPreview document={document} />
             <PageFooter document={document} style={dynamicColorStyle} t={t} />
        </div>
        {itemsToRender.map((pageItems, pageIndex) => (
           <TemplateComponent
            key={pageIndex}
            {...commonProps}
            pageItems={pageItems}
            pageIndex={pageIndex}
            totalPages={itemsToRender.length}
            summary={document.summary}
            style={dynamicColorStyle}
          />
        ))}
      </div>
    );
  }

  return (
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide" style={previewStyle}>
      <CardContent className="p-0" style={{backgroundColor: backgroundColor}}>
         <TemplateComponent
            {...commonProps}
            pageItems={document.lineItems}
            pageIndex={0}
            totalPages={1}
            summary={document.summary}
            style={dynamicColorStyle}
          />
      </CardContent>
    </Card>
  );
}

export const ClientDocumentPreview: FC<DocumentPreviewProps> = (props) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <Card id={props.id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide">
            <CardContent className="p-8 text-center text-muted-foreground">
            Loading Preview...
            </CardContent>
        </Card>
    );
  }
  return <DocumentPreviewInternal {...props} />;
};

export { DocumentPreviewInternal as DocumentPreview };

