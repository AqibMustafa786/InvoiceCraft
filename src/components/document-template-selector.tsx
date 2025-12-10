

'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { EstimateCategory, InvoiceCategory } from '@/lib/types';
import { useMemo } from 'react';

interface Template {
  id: string;
  name: string;
  thumbnailUrl: string;
  isPro?: boolean;
  category: EstimateCategory | InvoiceCategory | 'all';
}

interface DocumentTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  documentType: 'estimate' | 'quote' | 'invoice';
  category: EstimateCategory | InvoiceCategory;
}

const templates: Template[] = [
  // General
  { id: 'default', name: 'Default', thumbnailUrl: '/templates/Default.png', category: 'General Services' },
  { id: 'modern', name: 'Modern', thumbnailUrl: '/templates/Modern.png', category: 'General Services' },
  { id: 'minimalist', name: 'Minimalist', thumbnailUrl: '/templates/Minimalist.png', category: 'General Services' },
  { id: 'creative', name: 'Creative', thumbnailUrl: '/templates/Creative.png', category: 'General Services', isPro: true },
  { id: 'elegant', name: 'Elegant', thumbnailUrl: '/templates/Elegant.png', category: 'General Services', isPro: true },
  { id: 'usa', name: 'USA', thumbnailUrl: '/templates/Usa.png', category: 'General Services', isPro: true },
  
  {
    id: 'construction-1',
    name: 'Foundation',
    thumbnailUrl: '/templates/construction-1.png',
    category: 'Construction',
  },
  {
    id: 'construction-2',
    name: 'Blueprint',
    thumbnailUrl: '/templates/construction-2.png',
    category: 'Construction',
  },
  {
    id: 'construction-3',
    name: 'Contractor',
    thumbnailUrl: '/templates/construction-3.png',
    category: 'Construction',
  },
  {
    id: 'construction-4',
    name: 'High-Rise',
    thumbnailUrl: '/templates/construction-4.png',
    category: 'Construction',
    isPro: true,
  },
  {
    id: 'construction-5',
    name: 'Steel-Frame',
    thumbnailUrl: '/templates/construction-5.png',
    category: 'Construction',
    isPro: true,
  },
   { id: 'construction-6', name: 'Classic', thumbnailUrl: '/templates/construction-1.png', category: 'Construction', isPro: true },
  { id: 'construction-7', name: 'Modern Build', thumbnailUrl: '/templates/construction-2.png', category: 'Construction', isPro: true },
  { id: 'construction-8', name: 'Grid', thumbnailUrl: '/templates/construction-3.png', category: 'Construction', isPro: true },
  { id: 'construction-9', name: 'Simple', thumbnailUrl: '/templates/construction-4.png', category: 'Construction', isPro: true },
  { id: 'construction-10', name: 'Bold', thumbnailUrl: '/templates/construction-5.png', category: 'Construction', isPro: true },

  {
    id: 'remodeling-1',
    name: 'Precision',
    thumbnailUrl: '/templates/remodeling-1.png',
    category: 'Home Remodeling / Renovation',
  },
  {
    id: 'remodeling-2',
    name: 'Modern Reno',
    thumbnailUrl: '/templates/remodeling-2.png',
    category: 'Home Remodeling / Renovation',
  },
  {
    id: 'remodeling-3',
    name: 'Blueprint',
    thumbnailUrl: '/templates/remodeling-3.png',
    category: 'Home Remodeling / Renovation',
    isPro: true,
  },
  {
    id: 'remodeling-4',
    name: 'Craftsman',
    thumbnailUrl: '/templates/remodeling-4.png',
    category: 'Home Remodeling / Renovation',
    isPro: true,
  },
  {
    id: 'remodeling-5',
    name: 'Urban Build',
    thumbnailUrl: '/templates/remodeling-5.png',
    category: 'Home Remodeling / Renovation',
    isPro: true,
  },
   {
    id: 'hvac-1',
    name: 'Coolant',
    thumbnailUrl: '/templates/hvac-1.png',
    category: 'HVAC Services',
  },
  {
    id: 'hvac-2',
    name: 'Ventura',
    thumbnailUrl: '/templates/hvac-2.png',
    category: 'HVAC Services',
  },
  {
    id: 'hvac-3',
    name: 'EcoLink',
    thumbnailUrl: '/templates/hvac-3.png',
    category: 'HVAC Services',
    isPro: true,
  },
  {
    id: 'hvac-4',
    name: 'ClimateControl',
    thumbnailUrl: '/templates/hvac-4.png',
    category: 'HVAC Services',
    isPro: true,
  },
  {
    id: 'hvac-5',
    name: 'Airflow',
    thumbnailUrl: '/templates/hvac-5.png',
    category: 'HVAC Services',
    isPro: true,
  },
   { id: 'hvac-6', name: 'Direct', thumbnailUrl: '/templates/Usa-insurance.png', category: 'HVAC Services', isPro: true },
  { id: 'hvac-7', name: 'Modern', thumbnailUrl: '/templates/Modern.png', category: 'HVAC Services', isPro: true },
  { id: 'hvac-8', name: 'Minimalist', thumbnailUrl: '/templates/Minimalist.png', category: 'HVAC Services', isPro: true },
  { id: 'hvac-9', name: 'Corporate', thumbnailUrl: '/templates/Creative.png', category: 'HVAC Services', isPro: true },
  { id: 'hvac-10', name: 'Side Details', thumbnailUrl: '/templates/Elegant.png', category: 'HVAC Services', isPro: true },
  {
    id: 'plumbing-1',
    name: 'Pipework',
    thumbnailUrl: '/templates/plumbing-1.png',
    category: 'Plumbing',
  },
  {
    id: 'plumbing-2',
    name: 'Flow',
    thumbnailUrl: '/templates/plumbing-2.png',
    category: 'Plumbing',
  },
  {
    id: 'plumbing-3',
    name: 'Aqua',
    thumbnailUrl: '/templates/plumbing-3.png',
    category: 'Plumbing',
    isPro: true,
  },
  {
    id: 'plumbing-4',
    name: 'Pressure',
    thumbnailUrl: '/templates/plumbing-4.png',
    category: 'Plumbing',
    isPro: true,
  },
  {
    id: 'plumbing-5',
    name: 'LeakFree',
    thumbnailUrl: '/templates/plumbing-5.png',
    category: 'Plumbing',
    isPro: true,
  },
  { id: 'plumbing-6', name: 'Direct', thumbnailUrl: '/templates/plumbing-1.png', category: 'Plumbing', isPro: true },
  { id: 'plumbing-7', name: 'Modern Blue', thumbnailUrl: '/templates/plumbing-2.png', category: 'Plumbing', isPro: true },
  { id: 'plumbing-8', name: 'Clean', thumbnailUrl: '/templates/plumbing-3.png', category: 'Plumbing', isPro: true },
  { id: 'plumbing-9', name: 'Side Panel', thumbnailUrl: '/templates/plumbing-4.png', category: 'Plumbing', isPro: true },
  { id: 'plumbing-10', name: 'Grid', thumbnailUrl: '/templates/plumbing-5.png', category: 'Plumbing', isPro: true },
  {
    id: 'electrical-1',
    name: 'Voltage',
    thumbnailUrl: '/templates/electrical-1.png',
    category: 'Electrical Services',
  },
  {
    id: 'electrical-2',
    name: 'Circuit',
    thumbnailUrl: '/templates/electrical-2.png',
    category: 'Electrical Services',
  },
  {
    id: 'electrical-3',
    name: 'Spark',
    thumbnailUrl: '/templates/electrical-3.png',
    category: 'Electrical Services',
    isPro: true,
  },
  {
    id: 'electrical-4',
    name: 'Wired',
    thumbnailUrl: '/templates/electrical-4.png',
    category: 'Electrical Services',
    isPro: true,
  },
  {
    id: 'electrical-5',
    name: 'Power Grid',
    thumbnailUrl: '/templates/electrical-5.png',
    category: 'Electrical Services',
    isPro: true,
  },
  { id: 'electrical-6', name: 'Volt', thumbnailUrl: '/templates/electrical-1.png', category: 'Electrical Services', isPro: true },
  { id: 'electrical-7', name: 'Spark', thumbnailUrl: '/templates/electrical-2.png', category: 'Electrical Services', isPro: true },
  { id: 'electrical-8', name: 'Circuit', thumbnailUrl: '/templates/electrical-3.png', category: 'Electrical Services', isPro: true },
  { id: 'electrical-9', name: 'Wired', thumbnailUrl: '/templates/electrical-4.png', category: 'Electrical Services', isPro: true },
  { id: 'electrical-10', name: 'PowerGrid', thumbnailUrl: '/templates/electrical-5.png', category: 'Electrical Services', isPro: true },
  {
    id: 'landscaping-1',
    name: 'Garden',
    thumbnailUrl: '/templates/landscaping-1.png',
    category: 'Landscaping & Lawn Care',
  },
  {
    id: 'landscaping-2',
    name: 'Greenway',
    thumbnailUrl: '/templates/landscaping-2.png',
    category: 'Landscaping & Lawn Care',
  },
  {
    id: 'landscaping-3',
    name: 'Evergreen',
    thumbnailUrl: '/templates/landscaping-3.png',
    category: 'Landscaping & Lawn Care',
    isPro: true,
  },
  {
    id: 'landscaping-4',
    name: 'Yardly',
    thumbnailUrl: '/templates/landscaping-4.png',
    category: 'Landscaping & Lawn Care',
    isPro: true,
  },
  {
    id: 'landscaping-5',
    name: 'Terrascape',
    thumbnailUrl: '/templates/landscaping-5.png',
    category: 'Landscaping & Lawn Care',
    isPro: true,
  },
  { id: 'roofing-1', name: 'USA Contractor', thumbnailUrl: '/templates/roofing-1.png', category: 'Roofing' },
  { id: 'roofing-2', name: 'Modern Roofing', thumbnailUrl: '/templates/roofing-2.png', category: 'Roofing' },
  { id: 'roofing-3', name: 'Classic Roofing', thumbnailUrl: '/templates/roofing-3.png', category: 'Roofing' },
  { id: 'roofing-4', name: 'Clean Grid', thumbnailUrl: '/templates/roofing-4.png', category: 'Roofing', isPro: true, },
  { id: 'roofing-5', name: 'Side Panel', thumbnailUrl: '/templates/roofing-5.png', category: 'Roofing', isPro: true, },
  { id: 'roofing-6', name: 'PeakPro', thumbnailUrl: '/templates/roofing-1.png', category: 'Roofing', isPro: true },
  { id: 'roofing-7', name: 'Shingle', thumbnailUrl: '/templates/roofing-2.png', category: 'Roofing', isPro: true },
  { id: 'roofing-8', name: 'Skyline', thumbnailUrl: '/templates/roofing-3.png', category: 'Roofing', isPro: true },
  { id: 'roofing-9', name: 'Fortress', thumbnailUrl: '/templates/roofing-4.png', category: 'Roofing', isPro: true },
  { id: 'roofing-10', name: 'Ridge', thumbnailUrl: '/templates/roofing-5.png', category: 'Roofing', isPro: true },
  { id: 'auto-repair-1', name: 'Gold Standard', thumbnailUrl: '/templates/auto-repair-1.png', category: 'Auto Repair' },
  { id: 'auto-repair-2', name: 'Night Shift', thumbnailUrl: '/templates/auto-repair-2.png', category: 'Auto Repair' },
  { id: 'auto-repair-3', name: 'Classic Garage', thumbnailUrl: '/templates/auto-repair-3.png', category: 'Auto Repair', isPro: true, },
  { id: 'auto-repair-4', name: 'Pro Service', thumbnailUrl: '/templates/auto-repair-4.png', category: 'Auto Repair', isPro: true, },
  { id: 'auto-repair-5', name: 'Gridline', thumbnailUrl: '/templates/auto-repair-5.png', category: 'Auto Repair', isPro: true, },
  { id: 'cleaning-1', name: 'Sparkle', thumbnailUrl: '/templates/cleaning-1.png', category: 'Cleaning Services' },
  { id: 'cleaning-2', name: 'Fresh', thumbnailUrl: '/templates/cleaning-2.png', category: 'Cleaning Services' },
  { id: 'cleaning-3', name: 'Pristine', thumbnailUrl: '/templates/cleaning-3.png', category: 'Cleaning Services', isPro: true, },
  { id: 'cleaning-4', name: 'Hygiene', thumbnailUrl: '/templates/cleaning-4.png', category: 'Cleaning Services', isPro: true, },
  { id: 'cleaning-5', name: 'Gleam', thumbnailUrl: '/templates/cleaning-5.png', category: 'Cleaning Services', isPro: true, },
  { id: 'it-1', name: 'Tech Corporate', thumbnailUrl: '/templates/it-1.png', category: 'IT Services / Tech Support' },
  { id: 'it-2', name: 'Modern Dark', thumbnailUrl: '/templates/it-2.png', category: 'IT Services / Tech Support' },
  { id: 'it-3', name: 'Minimalist Grid', thumbnailUrl: '/templates/it-3.png', category: 'IT Services / Tech Support', isPro: true, },
  { id: 'it-4', name: 'Creative Blue', thumbnailUrl: '/templates/it-4.png', category: 'IT Services / Tech Support', isPro: true, },
  { id: 'it-5', name: 'Startup Vibe', thumbnailUrl: '/templates/it-5.png', category: 'IT Services / Tech Support', isPro: true, },
];

export function DocumentTemplateSelector({ selectedTemplate, onSelectTemplate, documentType, category }: DocumentTemplateSelectorProps) {
  
  const filteredTemplates = useMemo(() => {
    const generalCategory = documentType === 'invoice' ? 'General Services' : 'Generic';
    
    if (category === generalCategory) {
      return templates.filter(t => t.category === generalCategory);
    }
    
    // For any other specific category, show ONLY those templates.
    return templates.filter(t => t.category === category);

  }, [category, documentType]);

  const docTypeLabel = documentType === 'invoice' ? 'Invoice' : (documentType === 'quote' ? 'Quote' : 'Estimate');
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTemplates.map((template) => {
        const isLocked = false; 

        return (
            <div
            key={template.id}
            onClick={() => !isLocked && onSelectTemplate(template.id)}
            className={cn("cursor-pointer group", isLocked && "cursor-not-allowed opacity-60")}
            >
            <div
                className={cn(
                'relative rounded-lg border-2 transition-all overflow-hidden aspect-[3/4] shadow-md mx-auto',
                selectedTemplate === template.id && !isLocked
                    ? 'border-primary ring-4 ring-primary/20'
                    : 'border-border',
                !isLocked && 'hover:border-primary/50'
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
                {!isLocked && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Select</span>
                    </div>
                )}
                 {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                )}
                {template.isPro && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                    PRO
                </Badge>
                )}
            </div>
            <p className="text-center text-sm font-semibold p-3">{template.name} {docTypeLabel}</p>
            </div>
        )
      })}
    </div>
  );
}
