
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
  const [selectedPreview, setSelectedPreview] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (template: Template) => {
    setSelectedPreview(template);
    setIsPreviewOpen(true);
  };
  
  const filteredTemplates = useMemo(() => {
    const isInvoice = documentType === 'invoice';
    const toolTypeToShow = isInvoice ? 'Invoice' : 'Estimate'; // Quotes use Estimate templates

    // If a category is selected, find templates for that specific category.
    if (category && category !== "General Services" && category !== "Generic") {
      // The category in the dropdown might be "Plumbing", but in the data it's "Plumbing Services"
      // We check for a partial match to be more robust.
      const specificTemplates = allTemplates.filter(t => 
        t.category.includes(category) && t.toolType === toolTypeToShow
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
    <>
      <div className="grid grid-cols-2 gap-6">
        {filteredTemplates.map((template) => {
          return (
              <div
              key={`${template.id}-${template.category}-${template.toolType}`}
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
                  onClick={() => onSelectTemplate(template.id)}
              >
                  <Image
                  src={template.thumbnailUrl}
                  alt={`${template.name} ${docTypeLabel} template`}
                  width={188}
                  height={250}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button onClick={(e) => { e.stopPropagation(); handlePreview(template); }} variant="secondary">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                   </div>
              </div>
              <p className="text-center text-sm font-semibold p-3">{template.name}</p>
              </div>
          )
        })}
      </div>
      {filteredTemplates.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <p>No specific templates found for this category.</p>
        </div>
      )}
      <TemplatePreview
        template={selectedPreview}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
