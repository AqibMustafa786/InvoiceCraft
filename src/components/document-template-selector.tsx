'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { EstimateCategory, InvoiceCategory } from '@/lib/types';
import { useState, useMemo } from 'react';
import { allTemplates, Template } from '@/lib/template-data';
import { TemplateCard } from './templates/template-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DocumentTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  documentType: 'invoice' | 'estimate' | 'quote';
  category?: EstimateCategory | InvoiceCategory;
}


export function DocumentTemplateSelector({ selectedTemplate, onSelectTemplate, documentType, category }: DocumentTemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = useMemo(() => {
    let toolTypeToShow: 'Invoice' | 'Estimate' | 'Quote';
    if (documentType === 'invoice') {
        toolTypeToShow = 'Invoice';
    } else if (documentType === 'quote') {
        toolTypeToShow = 'Quote';
    } else {
        toolTypeToShow = 'Estimate';
    }
    
    let templates = allTemplates.filter(t => t.toolType === toolTypeToShow);
    
    if (searchTerm) {
        templates = templates.filter(t => 
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.useCases.some(uc => uc.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }
    
    return templates;
  }, [documentType, searchTerm]);

  const docTypeLabel = documentType === 'invoice' ? 'Invoice' : (documentType === 'quote' ? 'Quote' : 'Estimate');
  
  return (
    <div className="space-y-6">
      <div className="relative sticky top-0 z-10 bg-card py-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
            placeholder="Search templates..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
        {filteredTemplates.map((template) => {
          return (
              <TemplateCard 
                  key={`${template.id}-${template.toolType}`}
                  template={template}
                  onPreview={() => onSelectTemplate(template.id)}
                  isSelected={selectedTemplate === template.id}
               />
          )
        })}
         {filteredTemplates.length === 0 && (
          <div className="text-center py-10 text-muted-foreground col-span-full">
            <p>No templates found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
