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
  category: EstimateCategory | InvoiceCategory;
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
  { id: 'creative', name: 'Creative', thumbnailUrl: '/templates/Creative.png', category: 'General Services' },
  { id: 'elegant', name: 'Elegant', thumbnailUrl: '/templates/Elegant.png', category: 'General Services' },
  { id: 'usa', name: 'USA', thumbnailUrl: '/templates/Usa.png', category: 'General Services' },
  
  // Construction
  { id: 'construction-1', name: 'Foundation', thumbnailUrl: '/templates/construction-1.png', category: 'Construction' },
  { id: 'construction-2', name: 'Blueprint', thumbnailUrl: '/templates/construction-2.png', category: 'Construction' },
  { id: 'construction-3', name: 'Contractor', thumbnailUrl: '/templates/construction-3.png', category: 'Construction' },
  { id: 'construction-4', name: 'High-Rise', thumbnailUrl: '/templates/construction-4.png', category: 'Construction' },
  { id: 'construction-5', name: 'Steel-Frame', thumbnailUrl: '/templates/construction-5.png', category: 'Construction' },
  { id: 'construction-6', name: 'Classic', thumbnailUrl: '/templates/construction-6.png', category: 'Construction' },
  { id: 'construction-7', name: 'Modern Build', thumbnailUrl: '/templates/construction-7.png', category: 'Construction' },
  { id: 'construction-8', name: 'Grid', thumbnailUrl: '/templates/construction-8.png', category: 'Construction' },
  { id: 'construction-9', name: 'Simple', thumbnailUrl: '/templates/construction-9.png', category: 'Construction' },
  { id: 'construction-10', name: 'Bold', thumbnailUrl: '/templates/construction-10.png', category: 'Construction' },
  
  // Remodeling
  { id: 'remodeling-1', name: 'Precision', thumbnailUrl: '/templates/remodeling-1.png', category: 'Home Remodeling / Renovation' },
  { id: 'remodeling-2', name: 'Modern Reno', thumbnailUrl: '/templates/remodeling-2.png', category: 'Home Remodeling / Renovation' },
  { id: 'remodeling-3', name: 'Blueprint', thumbnailUrl: '/templates/remodeling-3.png', category: 'Home Remodeling / Renovation'},
  { id: 'remodeling-4', name: 'Craftsman', thumbnailUrl: '/templates/remodeling-4.png', category: 'Home Remodeling / Renovation'},
  { id: 'remodeling-5', name: 'Urban Build', thumbnailUrl: '/templates/remodeling-5.png', category: 'Home Remodeling / Renovation'},

  // HVAC
  { id: 'hvac-1', name: 'Coolant', thumbnailUrl: '/templates/hvac-1.png', category: 'HVAC Services' },
  { id: 'hvac-2', name: 'Ventura', thumbnailUrl: '/templates/hvac-2.png', category: 'HVAC Services' },
  { id: 'hvac-3', name: 'EcoLink', thumbnailUrl: '/templates/hvac-3.png', category: 'HVAC Services' },
  { id: 'hvac-4', name: 'ClimateControl', thumbnailUrl: '/templates/hvac-4.png', category: 'HVAC Services' },
  { id: 'hvac-5', name: 'Airflow', thumbnailUrl: '/templates/hvac-5.png', category: 'HVAC Services' },
  { id: 'hvac-6', name: 'Direct', thumbnailUrl: '/templates/hvac-6.png', category: 'HVAC Services' },
  { id: 'hvac-7', name: 'Modern', thumbnailUrl: '/templates/hvac-7.png', category: 'HVAC Services' },
  { id: 'hvac-8', name: 'Minimalist', thumbnailUrl: '/templates/hvac-8.png', category: 'HVAC Services' },
  { id: 'hvac-9', name: 'Corporate', thumbnailUrl: '/templates/hvac-9.png', category: 'HVAC Services' },
  { id: 'hvac-10', name: 'Side Details', thumbnailUrl: '/templates/hvac-10.png', category: 'HVAC Services' },

  // Plumbing
  { id: 'plumbing-1', name: 'Pipework', thumbnailUrl: '/templates/plumbing-1.png', category: 'Plumbing' },
  { id: 'plumbing-2', name: 'Flow', thumbnailUrl: '/templates/plumbing-2.png', category: 'Plumbing' },
  { id: 'plumbing-3', name: 'Aqua', thumbnailUrl: '/templates/plumbing-3.png', category: 'Plumbing' },
  { id: 'plumbing-4', name: 'Pressure', thumbnailUrl: '/templates/plumbing-4.png', category: 'Plumbing' },
  { id: 'plumbing-5', name: 'LeakFree', thumbnailUrl: '/templates/plumbing-5.png', category: 'Plumbing' },
  { id: 'plumbing-6', name: 'Direct', thumbnailUrl: '/templates/plumbing-6.png', category: 'Plumbing' },
  { id: 'plumbing-7', name: 'Modern Blue', thumbnailUrl: '/templates/plumbing-7.png', category: 'Plumbing' },
  { id: 'plumbing-8', name: 'Clean', thumbnailUrl: '/templates/plumbing-8.png', category: 'Plumbing' },
  { id: 'plumbing-9', name: 'Side Panel', thumbnailUrl: '/templates/plumbing-9.png', category: 'Plumbing' },
  { id: 'plumbing-10', name: 'Grid', thumbnailUrl: '/templates/plumbing-10.png', category: 'Plumbing' },
  
  // Electrical
  { id: 'electrical-1', name: 'Voltage', thumbnailUrl: '/templates/electrical-1.png', category: 'Electrical Services' },
  { id: 'electrical-2', name: 'Circuit', thumbnailUrl: '/templates/electrical-2.png', category: 'Electrical Services' },
  { id: 'electrical-3', name: 'Spark', thumbnailUrl: '/templates/electrical-3.png', category: 'Electrical Services' },
  { id: 'electrical-4', name: 'Wired', thumbnailUrl: '/templates/electrical-4.png', category: 'Electrical Services' },
  { id: 'electrical-5', name: 'Power Grid', thumbnailUrl: '/templates/electrical-5.png', category: 'Electrical Services' },
  { id: 'electrical-6', name: 'Volt', thumbnailUrl: '/templates/electrical-6.png', category: 'Electrical Services' },
  { id: 'electrical-7', name: 'Sparkle', thumbnailUrl: '/templates/electrical-7.png', category: 'Electrical Services' },
  { id: 'electrical-8', name: 'Circuited', thumbnailUrl: '/templates/electrical-8.png', category: 'Electrical Services' },
  { id: 'electrical-9', name: 'Wired Up', thumbnailUrl: '/templates/electrical-9.png', category: 'Electrical Services' },
  { id: 'electrical-10', name: 'PowerGrid Pro', thumbnailUrl: '/templates/electrical-10.png', category: 'Electrical Services' },

  // Landscaping
  { id: 'landscaping-1', name: 'Garden', thumbnailUrl: '/templates/landscaping-1.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-2', name: 'Greenway', thumbnailUrl: '/templates/landscaping-2.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-3', name: 'Evergreen', thumbnailUrl: '/templates/landscaping-3.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-4', name: 'Yardly', thumbnailUrl: '/templates/landscaping-4.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-5', name: 'Terrascape', thumbnailUrl: '/templates/landscaping-5.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-6', name: 'Eco Scape', thumbnailUrl: '/templates/landscaping-6.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-7', name: 'Modern Yard', thumbnailUrl: '/templates/landscaping-7.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-8', name: 'Classic Green', thumbnailUrl: '/templates/landscaping-8.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-9', name: 'Simple Cut', thumbnailUrl: '/templates/landscaping-9.png', category: 'Landscaping & Lawn Care' },
  { id: 'landscaping-10', name: 'Bold Stripes', thumbnailUrl: '/templates/landscaping-10.png', category: 'Landscaping & Lawn Care' },

  // Roofing
  { id: 'roofing-1', name: 'USA Contractor', thumbnailUrl: '/templates/roofing-1.png', category: 'Roofing' },
  { id: 'roofing-2', name: 'Modern Roofing', thumbnailUrl: '/templates/roofing-2.png', category: 'Roofing' },
  { id: 'roofing-3', name: 'Classic Roofing', thumbnailUrl: '/templates/roofing-3.png', category: 'Roofing' },
  { id: 'roofing-4', name: 'Clean Grid', thumbnailUrl: '/templates/roofing-4.png', category: 'Roofing' },
  { id: 'roofing-5', name: 'Side Panel', thumbnailUrl: '/templates/roofing-5.png', category: 'Roofing' },
  { id: 'roofing-6', name: 'PeakPro', thumbnailUrl: '/templates/roofing-6.png', category: 'Roofing' },
  { id: 'roofing-7', name: 'Shingle', thumbnailUrl: '/templates/roofing-7.png', category: 'Roofing' },
  { id: 'roofing-8', name: 'Skyline', thumbnailUrl: '/templates/roofing-8.png', category: 'Roofing' },
  { id: 'roofing-9', name: 'Fortress', thumbnailUrl: '/templates/roofing-9.png', category: 'Roofing' },
  { id: 'roofing-10', name: 'Ridge', thumbnailUrl: '/templates/roofing-10.png', category: 'Roofing' },

  // Auto Repair
  { id: 'auto-repair-1', name: 'Gold Standard', thumbnailUrl: '/templates/auto-repair-1.png', category: 'Auto Repair' },
  { id: 'auto-repair-2', name: 'Night Shift', thumbnailUrl: '/templates/auto-repair-2.png', category: 'Auto Repair' },
  { id: 'auto-repair-3', name: 'Classic Garage', thumbnailUrl: '/templates/auto-repair-3.png', category: 'Auto Repair' },
  { id: 'auto-repair-4', name: 'Pro Service', thumbnailUrl: '/templates/auto-repair-4.png', category: 'Auto Repair' },
  { id: 'auto-repair-5', name: 'Gridline', thumbnailUrl: '/templates/auto-repair-5.png', category: 'Auto Repair' },

  // Cleaning
  { id: 'cleaning-1', name: 'Sparkle', thumbnailUrl: '/templates/cleaning-1.png', category: 'Cleaning Services' },
  { id: 'cleaning-2', name: 'Fresh', thumbnailUrl: '/templates/cleaning-2.png', category: 'Cleaning Services' },
  { id: 'cleaning-3', name: 'Pristine', thumbnailUrl: '/templates/cleaning-3.png', category: 'Cleaning Services' },
  { id: 'cleaning-4', name: 'Hygiene', thumbnailUrl: '/templates/cleaning-4.png', category: 'Cleaning Services' },
  { id: 'cleaning-5', name: 'Gleam', thumbnailUrl: '/templates/cleaning-5.png', category: 'Cleaning Services' },
  
  // IT Services
  { id: 'it-1', name: 'Tech Corporate', thumbnailUrl: '/templates/it-1.png', category: 'IT Services / Tech Support' },
  { id: 'it-2', name: 'Modern Dark', thumbnailUrl: '/templates/it-2.png', category: 'IT Services / Tech Support' },
  { id: 'it-3', name: 'Minimalist Grid', thumbnailUrl: '/templates/it-3.png', category: 'IT Services / Tech Support' },
  { id: 'it-4', name: 'Creative Blue', thumbnailUrl: '/templates/it-4.png', category: 'IT Services / Tech Support' },
  { id: 'it-5', name: 'Startup Vibe', thumbnailUrl: '/templates/it-5.png', category: 'IT Services / Tech Support' },
];

export function DocumentTemplateSelector({ selectedTemplate, onSelectTemplate, documentType, category }: DocumentTemplateSelectorProps) {
  
  const filteredTemplates = useMemo(() => {
    const generalCategory = documentType === 'invoice' ? 'General Services' : 'Generic';
    
    // Strict filtering: If a specific category is chosen, show only its templates.
    // If the general category is chosen, show only the general templates.
    if (category === generalCategory || !category) {
      return templates.filter(t => t.category === "General Services");
    }
    
    return templates.filter(t => t.category === category);

  }, [category, documentType]);

  const docTypeLabel = documentType === 'invoice' ? 'Invoice' : (documentType === 'quote' ? 'Quote' : 'Estimate');
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTemplates.map((template) => {
        return (
            <div
            key={template.id}
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
            </div>
            <p className="text-center text-sm font-semibold p-3">{template.name}</p>
            </div>
        )
      })}
    </div>
  );
}