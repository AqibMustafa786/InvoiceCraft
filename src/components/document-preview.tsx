
'use client';

import { useState, useLayoutEffect, useRef, useEffect, FC, useMemo } from 'react';
import type { Estimate, Quote, LineItem, CustomField } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { GenericTemplate1, GenericTemplate2, GenericTemplate3, GenericTemplate4, GenericTemplate5 } from './document-templates/generic-templates';
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
import { ConsultingTemplate1, ConsultingTemplate2, ConsultingTemplate3, ConsultingTemplate4, ConsultingTemplate5 } from './document-templates/consulting-templates';
import { LegalTemplate1, LegalTemplate2, LegalTemplate3, LegalTemplate4, LegalTemplate5 } from './document-templates/legal-templates';
import { MedicalTemplate1, MedicalTemplate2, MedicalTemplate3, MedicalTemplate4, MedicalTemplate5 } from './document-templates/medical-templates';
import { RetailTemplate1 } from './document-templates/retail-templates';
import { PhotographyTemplate1, PhotographyTemplate2, PhotographyTemplate3, PhotographyTemplate4, PhotographyTemplate5 } from './document-templates/photography-templates';
import { RealEstateTemplate1, RealEstateTemplate2, RealEstateTemplate3, RealEstateTemplate4, RealEstateTemplate5 } from './document-templates/real-estate-templates';
import { TransportationTemplate1, TransportationTemplate2, TransportationTemplate3, TransportationTemplate4, TransportationTemplate5 } from './document-templates/transportation-templates';
import { RentalTemplate1, RentalTemplate2, RentalTemplate3, RentalTemplate4, RentalTemplate5 } from './document-templates/rental-templates';
import locales from '@/lib/locales';

import { RemodelingDetails } from './document-templates/remodeling-templates';
import { RoofingDetails } from './document-templates/roofing-templates';
import { HvacDetails } from './document-templates/hvac-templates';
import { PlumbingDetails } from './document-templates/plumbing-templates';
import { ElectricalDetails } from './document-templates/electrical-templates';
import { LandscapingDetails } from './document-templates/landscaping-templates';
import { CleaningDetails } from './document-templates/cleaning-templates';
import { AutoRepairDetails } from './document-templates/auto-repair-templates';
import { ConstructionDetails } from './document-templates/construction-templates';
import { ITFreelanceDetails } from './document-templates/it-freelance-templates';
import { ConsultingDetails } from './document-templates/consulting-templates';
import { LegalDetails } from './document-templates/legal-templates';
import { MedicalDetails } from './document-templates/medical-templates';
import { RetailDetails } from './document-templates/retail-templates';
import { PhotographyDetails } from './document-templates/photography-templates';
import { RealEstateDetails } from './document-templates/real-estate-templates';
import { TransportationDetails } from './document-templates/transportation-templates';
import { RentalDetails } from './document-templates/rental-templates';

// --- PROPS ---
interface DocumentPreviewProps {
  document: Estimate | Quote;
  accentColor: string;
  backgroundColor?: string;
  textColor?: string;
  id?: string;
  isPrint?: boolean;
  plan?: string;
}

interface CommonTemplateProps {
  document: Estimate | Quote;
  accentColor: string;
  backgroundColor?: string;
  textColor?: string;
  t: any;
}

interface PageProps extends CommonTemplateProps {
  pageItems: (Estimate | Quote)['lineItems'];
  pageIndex: number;
  totalPages: number;
  summary: (Estimate | Quote)['summary'];
  style: React.CSSProperties;
}

const templates: { [key: string]: FC<PageProps> } = {
  'generic-1': GenericTemplate1,
  'generic-2': GenericTemplate2,
  'generic-3': GenericTemplate3,
  'generic-4': GenericTemplate4,
  'generic-5': GenericTemplate5,
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


const PAGE_HEIGHT = 1056; // 11 inches at 96 DPI for Letter size
const PAGE_PADDING = 80; // 40px top + 40px bottom
const AVAILABLE_HEIGHT = PAGE_HEIGHT - PAGE_PADDING;

const CategorySpecificDetails: FC<{ document: Estimate | Quote, t: any }> = ({ document, t }) => {
  const category = document.category;

  switch (category) {
    case 'Construction Estimate': return <ConstructionDetails document={document} t={t} textColor={document.textColor || '#000'} />;
    case 'Home Remodeling / Renovation': return <RemodelingDetails document={document} t={t} textColor={document.textColor || '#000'} />;
    case 'Roofing Estimate': return <RoofingDetails document={document} t={t} />;
    case 'HVAC (Air Conditioning / Heating)': return <HvacDetails document={document} t={t} textColor={document.textColor || '#000'} />;
    case 'Plumbing Estimate': return <PlumbingDetails document={document} t={t} />;
    case 'Electrical Estimate': return <ElectricalDetails document={document} t={t} textColor={document.textColor || '#000'} />;
    case 'Landscaping Estimate': return <LandscapingDetails document={document} t={t} />;
    case 'Cleaning Estimate': return <CleaningDetails document={document} t={t} textColor={document.textColor || '#000'} />;
    case 'Auto Repair Estimate': return <AutoRepairDetails document={document} t={t} textColor={document.textColor || '#000'} />;
    case 'IT / Freelance Estimate': return <ITFreelanceDetails document={document} t={t} />;
    // Add more cases here as you create more detail components
    default: return null;
  }
}


const DocumentPreviewInternal: FC<DocumentPreviewProps> = ({ document, accentColor, backgroundColor, textColor, id = 'document-preview', isPrint = false, plan }) => {
  const [paginatedItems, setPaginatedItems] = useState<(Estimate | Quote)['lineItems'][]>(document ? [document.lineItems || []] : [[]]);
  const [needsRemeasure, setNeedsRemeasure] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const t = locales[document.language as keyof locales] || locales.en;

  const serializedDocument = useMemo(() => JSON.stringify(document), [document]);

  useEffect(() => {
    setNeedsRemeasure(true);
  }, [serializedDocument]);

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

  const TemplateComponent = templates[document.template] || templates['generic-1'];

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

        const pages: (Estimate | Quote)['lineItems'][] = [];
        let currentPageItems: (Estimate | Quote)['lineItems'] = [];
        let currentPageHeight = 0;

        const lineItems = document.lineItems || [];
        for (let i = 0; i < lineItems.length; i++) {
          const item = lineItems[i];
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

  }, [serializedDocument, isPrint, needsRemeasure, TemplateComponent, document]);


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
      <div id={id} style={{ backgroundColor: backgroundColor }} ref={containerRef}>
        <div style={{ position: 'absolute', left: '-9999px' }}>
          {/* This is a dummy for measurement */}
        </div>
        {itemsToRender.map((pageItems, pageIndex) => (
          <div key={pageIndex} className="watermark-container">
            <TemplateComponent
              {...commonProps}
              pageItems={pageItems}
              pageIndex={pageIndex}
              totalPages={itemsToRender.length}
              summary={document.summary || {}}
              style={dynamicColorStyle}
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

  return (
    <Card id={id} className="w-full shadow-lg rounded-xl overflow-hidden print-hide hover:shadow-primary/20 transition-shadow" style={previewStyle}>
      <CardContent className="p-0" style={{ backgroundColor: backgroundColor }}>
        <TemplateComponent
          {...commonProps}
          pageItems={document.lineItems}
          pageIndex={0}
          totalPages={1}
          summary={document.summary || {}}
          style={dynamicColorStyle}
        />
        {plan === 'free' && (
          <div className="watermark-overlay">
            <span className="watermark-text">Created with InvoiceCraft</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const ClientDocumentPreview: FC<DocumentPreviewProps> = (props) => {
  if (!props.document) {
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
