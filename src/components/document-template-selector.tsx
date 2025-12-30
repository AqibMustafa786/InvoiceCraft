

'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { EstimateCategory, InvoiceCategory } from '@/lib/types';
import { useMemo, useState } from 'react';
import { allTemplates, Template } from '@/lib/template-data';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';
import { TemplatePreview } from './templates/template-preview';

interface DocumentTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  documentType: 'invoice' | 'estimate' | 'quote';
  category?: EstimateCategory | InvoiceCategory;
}


export function DocumentTemplateSelector({ selectedTemplate, onSelectTemplate, documentType, category }: DocumentTemplateSelectorProps) {
  const filteredTemplates = useMemo(() => {
    let generalCategory: EstimateCategory | InvoiceCategory = documentType === 'invoice' ? 'General Services' : 'Generic';
    let currentCategory = category;

    if (documentType === 'estimate' && category) {
      // Map invoice category to estimate category if needed
      const categoryMap: { [key in InvoiceCategory]?: EstimateCategory } = {
        'Construction': 'Construction Estimate',
        'Plumbing': 'Plumbing Estimate',
        'Electrical Services': 'Electrical Estimate',
        'HVAC Services': 'HVAC (Air Conditioning / Heating)',
        'Roofing': 'Roofing Estimate',
        'Landscaping & Lawn Care': 'Landscaping Estimate',
        'Cleaning Services': 'Cleaning Estimate',
        'Freelance / Agency': 'IT / Freelance Estimate',
        'Auto Repair': 'Auto Repair Estimate',
      };
      currentCategory = categoryMap[category as InvoiceCategory] || category;
    }
    
    if (!currentCategory || currentCategory === 'General Services' && documentType !== 'invoice') {
        currentCategory = 'Generic';
    }

    if (currentCategory === 'General Services' && documentType === 'invoice') {
        return allTemplates.filter(t => t.category === "General Services" && t.toolType === "Invoice");
    }

    if (currentCategory === 'Generic') {
        return allTemplates.filter(t => t.category === "Generic" && t.toolType !== "Invoice");
    }
    
    return allTemplates.filter(t => t.category === currentCategory);

  }, [category, documentType]);

  const docTypeLabel = documentType === 'invoice' ? 'Invoice' : (documentType === 'quote' ? 'Quote' : 'Estimate');
  
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        {filteredTemplates.map((template) => {
          return (
              <div
              key={`${template.id}-${template.category}`}
              className="cursor-pointer group"
              onClick={() => onSelectTemplate(template.id)}
              >
              <div
                  className={cn(
                  'relative rounded-lg border-2 transition-all overflow-hidden aspect-[3/4] shadow-md mx-auto',
                  selectedTemplate === template.id
                      ? 'border-primary ring-4 ring-primary/20'
                      : 'border-border',
                  'hover:border-primary/50'
                  )}
                  style={{ width: '188px' }}
              >
                  <Image
                  src={template.thumbnailUrl}
                  alt={`${template.name} ${docTypeLabel} template`}
                  width={188}
                  height={250}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   </div>
              </div>
              <p className="text-center text-sm font-semibold p-3">{template.name}</p>
              </div>
          )
        })}
      </div>
    </>
  );
}
