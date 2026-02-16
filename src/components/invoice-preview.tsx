
'use client';

import * as React from 'react';
import { useState, useLayoutEffect, useMemo, FC } from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import locales from '@/lib/locales';
import { toDateSafe, toNumberSafe } from '@/lib/utils';
import { CategorySpecificDetails } from './invoice-templates/category-specific-details';
import { ConstructionTemplate1, ConstructionTemplate2, ConstructionTemplate3, ConstructionTemplate4, ConstructionTemplate5, ConstructionTemplate6 } from './invoice-templates/construction-templates';
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
import { GenericTemplate1, GenericTemplate2, GenericTemplate3, GenericTemplate4, GenericTemplate5 } from './invoice-templates/generic-templates';


// --- PROPS ---
interface InvoicePreviewProps {
  invoice: Invoice;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  id?: string;
  isPrint?: boolean;
  plan?: string;
}

export interface PageProps {
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

const templates: Record<string, FC<PageProps>> = {
  'default': GenericTemplate1,
  'modern': GenericTemplate2,
  'minimalist': GenericTemplate3,
  'creative': GenericTemplate4,
  'elegant': GenericTemplate5,
  'usa': GenericTemplate1,
  'construction-1': ConstructionTemplate1,
  'construction-2': ConstructionTemplate2,
  'construction-3': ConstructionTemplate3,
  'construction-4': ConstructionTemplate4,
  'construction-5': ConstructionTemplate5,
  'construction-6': ConstructionTemplate6,
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

const PAGE_HEIGHT_PX = 1056; // 11 inches * 96 DPI
const PAGE_PADDING_Y_PX = 80; // 40px top + 40px bottom
const AVAILABLE_PAGE_HEIGHT_PX = PAGE_HEIGHT_PX - PAGE_PADDING_Y_PX;

const InvoicePreviewInternal: FC<InvoicePreviewProps> = ({ invoice, accentColor, backgroundColor, textColor, id = 'invoice-preview', isPrint = false, plan }) => {
  const [paginatedItems, setPaginatedItems] = useState<LineItem[][]>([invoice?.lineItems || []]);
  const [needsRemeasure, setNeedsRemeasure] = useState(true);

  const serializedInvoice = useMemo(() => JSON.stringify(invoice), [invoice]);

  const t = locales[invoice.language as keyof locales] || locales.en;

  const lineItems = invoice.lineItems || [];
  const summary = invoice.summary || { discount: 0, taxPercentage: 0, shippingCost: 0, grandTotal: 0, subtotal: 0, taxAmount: 0 };

  const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * (toNumberSafe((item as any).unitPrice) || 0), 0);
  const discountAmount = summary.discount || 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalAfterDiscount * (summary.taxPercentage || 0)) / 100;
  const total = subtotalAfterDiscount + taxAmount + (summary.shippingCost || 0);
  const balanceDue = total - (invoice.amountPaid || 0);
  const currencySymbol = locales[invoice.language as keyof locales]?.currencySymbol || '$';

  const commonProps: Omit<PageProps, 'pageItems' | 'pageIndex' | 'totalPages'> = useMemo(() => ({
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
  }), [invoice, accentColor, backgroundColor, textColor, t, currencySymbol, subtotal, taxAmount, discountAmount, total, balanceDue]);

  React.useEffect(() => {
    setNeedsRemeasure(true);
  }, [serializedInvoice, accentColor, backgroundColor, textColor]);

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
    return templates[templateId] || GenericTemplate1;
  };

  const TemplateComponent = getTemplateComponent();

  useLayoutEffect(() => {
    if (!isPrint || !needsRemeasure || typeof window === 'undefined' || !TemplateComponent) return;

    const measureAndPaginate = () => {
      const measurementRoot = document.createElement('div');
      measurementRoot.style.position = 'absolute';
      measurementRoot.style.left = '-9999px';
      measurementRoot.style.width = '8.5in';
      document.body.appendChild(measurementRoot);

      const measureComponent = (component: React.ReactElement): number => {
        const div = document.createElement('div');
        measurementRoot.appendChild(div);
        const root = (require('react-dom/client') as any).createRoot(div);
        root.render(component);
        const height = div.offsetHeight;
        root.unmount();
        div.remove();
        return height;
      };

      const firstPageDummy = <TemplateComponent {...commonProps} pageItems={[]} pageIndex={0} totalPages={1} />;
      const subsequentPageDummy = <TemplateComponent {...commonProps} pageItems={[]} pageIndex={1} totalPages={2} />;

      // Measure header content only once
      const headerContent = (
        <>
          <header data-element="header"></header>
          <section data-element="client-details"></section>
          <div data-element="category-details"></div>
        </>
      );

      const firstPageHeaderHeight = measureComponent(
        <div style={previewStyle} className="p-8 md:p-10">{React.cloneElement(firstPageDummy, { children: headerContent })}</div>
      );
      const subsequentPageHeaderHeight = measureComponent(
        <div style={previewStyle} className="p-8 md:p-10">{React.cloneElement(subsequentPageDummy, { children: headerContent })}</div>
      );

      const footerHeight = measureComponent(<PagePropsFooter {...commonProps} />);
      const tableHeaderHeight = measureComponent(<table className="w-full" style={previewStyle}><thead data-element="table-header"><tr><th>Header</th></tr></thead></table>);

      const firstPageAvailableHeight = AVAILABLE_PAGE_HEIGHT_PX - firstPageHeaderHeight - footerHeight - tableHeaderHeight;
      const subsequentPageAvailableHeight = AVAILABLE_PAGE_HEIGHT_PX - subsequentPageHeaderHeight - footerHeight - tableHeaderHeight;

      const rowHeights = invoice.lineItems.map(item =>
        measureComponent(<table className="w-full" style={previewStyle}><tbody><tr data-element="table-row">{item.name}</tr></tbody></table>)
      );

      const pages: LineItem[][] = [];
      let currentPageItems: LineItem[] = [];
      let currentHeight = 0;

      for (let i = 0; i < invoice.lineItems.length; i++) {
        const itemHeight = rowHeights[i];
        const isFirstPage = pages.length === 0;
        const availableHeight = isFirstPage ? firstPageAvailableHeight : subsequentPageAvailableHeight;

        if (currentHeight + itemHeight > availableHeight && currentPageItems.length > 0) {
          pages.push(currentPageItems);
          currentPageItems = [];
          currentHeight = 0;
        }

        currentPageItems.push(invoice.lineItems[i]);
        currentHeight += itemHeight;
      }

      if (currentPageItems.length > 0) {
        pages.push(currentPageItems);
      }

      setPaginatedItems(pages.length > 0 ? pages : [[]]);
      setNeedsRemeasure(false);

      document.body.removeChild(measurementRoot);
    };

    const timer = setTimeout(measureAndPaginate, 150);
    return () => clearTimeout(timer);
  }, [isPrint, needsRemeasure, TemplateComponent, commonProps, invoice.lineItems, previewStyle, serializedInvoice]);

  if (isPrint) {
    const itemsToRender = needsRemeasure ? [invoice.lineItems] : (paginatedItems.length > 0 ? paginatedItems : [[]]);

    return (
      <div id={id}>
        {itemsToRender.map((pageItems, pageIndex) => (
          <div key={pageIndex} data-element="page-container" className={pageIndex < itemsToRender.length - 1 ? "page-break-after" : ""}>
            <TemplateComponent
              {...commonProps}
              pageItems={pageItems}
              pageIndex={pageIndex}
              totalPages={itemsToRender.length}
            />
            {plan === 'free' && (
              <div className="watermark-overlay">
                <span className="watermark-text">Created with InvoiceCraft</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Default live preview (single page)
  return (
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide hover:shadow-primary/20 transition-shadow" style={{ backgroundColor: backgroundColor }}>
      <CardContent className="p-0" style={{ color: textColor }}>
        <div data-element="page-container">
          <TemplateComponent
            {...commonProps}
            pageItems={invoice.lineItems}
            pageIndex={0}
            totalPages={1}
          />
          {plan === 'free' && (
            <div className="watermark-overlay">
              <span className="watermark-text">Created with InvoiceCraft</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PagePropsFooter: FC<Omit<PageProps, 'pageItems' | 'pageIndex' | 'totalPages'>> = (props) => {
  // A simplified footer just for measurement, adjust if your footers are very different
  return <footer className="mt-auto pt-8">Footer Content</footer>
};


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
