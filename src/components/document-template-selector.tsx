
'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { EstimateCategory, InvoiceCategory } from '@/lib/types';
import { useMemo } from 'react';
import { allTemplates, Template } from '@/lib/template-data';
import { TemplateCard } from './templates/template-card';

interface DocumentTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  documentType: 'invoice' | 'estimate' | 'quote';
  category?: EstimateCategory | InvoiceCategory;
}


export function DocumentTemplateSelector({ selectedTemplate, onSelectTemplate, documentType }: DocumentTemplateSelectorProps) {
  const filteredTemplates = useMemo(() => {
    const toolTypeToShow = documentType === 'invoice' ? 'Invoice' : 'Estimate';
    return allTemplates.filter(t => t.toolType === toolTypeToShow);
  }, [documentType]);

  const docTypeLabel = documentType === 'invoice' ? 'Invoice' : (documentType === 'quote' ? 'Quote' : 'Estimate');
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {filteredTemplates.map((template) => {
        return (
            <TemplateCard 
                key={`${template.id}-${template.category}-${template.toolType}`}
                template={template}
                onPreview={() => onSelectTemplate(template.id)}
             />
        )
      })}
       {filteredTemplates.length === 0 && (
        <div className="text-center py-10 text-muted-foreground col-span-2">
          <p>No templates found for this document type.</p>
        </div>
      )}
    </div>
  );
}
