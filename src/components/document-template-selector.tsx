
'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { EstimateCategory, InvoiceCategory } from '@/lib/types';
import { useMemo } from 'react';
import { allTemplates } from '@/lib/template-data';

interface DocumentTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  documentType: 'invoice' | 'estimate' | 'quote';
  category?: EstimateCategory | InvoiceCategory;
}


export function DocumentTemplateSelector({ selectedTemplate, onSelectTemplate, documentType, category }: DocumentTemplateSelectorProps) {
  const filteredTemplates = useMemo(() => {
    const isInvoice = documentType === 'invoice';
    const toolTypeToShow = isInvoice ? 'Invoice' : 'Estimate'; // Quotes use Estimate templates

    // If a category is selected, find templates for that specific category.
    if (category) {
      const categoryToMatch = isInvoice ? category : `${category} Estimate`;
      const specificTemplates = allTemplates.filter(t => 
        t.category === categoryToMatch && t.toolType === toolTypeToShow
      );

      if (specificTemplates.length > 0) {
        return specificTemplates;
      }
    }
    
    // Otherwise, show the default general templates.
    const fallbackCategory = isInvoice ? 'General Services' : 'Generic';
    return allTemplates.filter(t => t.category === fallbackCategory && t.toolType === toolTypeToShow);

  }, [category, documentType]);

  const docTypeLabel = documentType === 'invoice' ? 'Invoice' : (documentType === 'quote' ? 'Quote' : 'Estimate');
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {filteredTemplates.map((template) => {
        return (
            <div
            key={`${template.id}-${template.category}-${template.toolType}`}
            onClick={() => onSelectTemplate(template.id)}
            className="cursor-pointer group"
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
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-lg">Select</span>
                </div>
                {template.isPro && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                    PRO
                </Badge>
                )}
            </div>
            <p className="text-center text-sm font-semibold p-3">{template.name}</p>
            </div>
        )
      })}
       {filteredTemplates.length === 0 && (
        <div className="text-center py-10 text-muted-foreground col-span-2">
          <p>No specific templates found for this category.</p>
        </div>
      )}
    </div>
  );
}
