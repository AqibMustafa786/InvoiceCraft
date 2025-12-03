
'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { EstimateCategory } from '@/lib/types';

interface Template {
  id: string;
  name: string;
  thumbnailUrl: string;
  isPro?: boolean;
  category: EstimateCategory | 'all';
}

interface DocumentTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  documentType: 'estimate' | 'quote';
  category: EstimateCategory;
}

const templates: Template[] = [
  {
    id: 'default',
    name: 'Modern',
    thumbnailUrl: '/templates/Estimate-Default.png',
    category: 'all',
  },
  {
    id: 'construction-1',
    name: 'Foundation',
    thumbnailUrl: '/templates/construction-1.png',
    category: 'Construction Estimate',
  },
  {
    id: 'construction-2',
    name: 'Blueprint',
    thumbnailUrl: '/templates/construction-2.png',
    category: 'Construction Estimate',
  },
  {
    id: 'construction-3',
    name: 'Contractor',
    thumbnailUrl: '/templates/construction-3.png',
    category: 'Construction Estimate',
  },
  {
    id: 'construction-4',
    name: 'High-Rise',
    thumbnailUrl: '/templates/construction-4.png',
    category: 'Construction Estimate',
  },
  {
    id: 'construction-5',
    name: 'Steel-Frame',
    thumbnailUrl: '/templates/construction-5.png',
    category: 'Construction Estimate',
  },
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
  },
  {
    id: 'remodeling-4',
    name: 'Craftsman',
    thumbnailUrl: '/templates/remodeling-4.png',
    category: 'Home Remodeling / Renovation',
  },
  {
    id: 'remodeling-5',
    name: 'Urban Build',
    thumbnailUrl: '/templates/remodeling-5.png',
    category: 'Home Remodeling / Renovation',
  },
   {
    id: 'hvac-1',
    name: 'Coolant',
    thumbnailUrl: '/templates/hvac-1.png',
    category: 'HVAC (Air Conditioning / Heating)',
  },
  {
    id: 'hvac-2',
    name: 'Ventura',
    thumbnailUrl: '/templates/hvac-2.png',
    category: 'HVAC (Air Conditioning / Heating)',
  },
  {
    id: 'hvac-3',
    name: 'EcoLink',
    thumbnailUrl: '/templates/hvac-3.png',
    category: 'HVAC (Air Conditioning / Heating)',
  },
  {
    id: 'hvac-4',
    name: 'ClimateControl',
    thumbnailUrl: '/templates/hvac-4.png',
    category: 'HVAC (Air Conditioning / Heating)',
  },
  {
    id: 'hvac-5',
    name: 'Airflow',
    thumbnailUrl: '/templates/hvac-5.png',
    category: 'HVAC (Air Conditioning / Heating)',
  },
  {
    id: 'plumbing-1',
    name: 'Pipework',
    thumbnailUrl: '/templates/plumbing-1.png',
    category: 'Plumbing Estimate',
  },
  {
    id: 'plumbing-2',
    name: 'Flow',
    thumbnailUrl: '/templates/plumbing-2.png',
    category: 'Plumbing Estimate',
  },
  {
    id: 'plumbing-3',
    name: 'Aqua',
    thumbnailUrl: '/templates/plumbing-3.png',
    category: 'Plumbing Estimate',
  },
  {
    id: 'plumbing-4',
    name: 'Pressure',
    thumbnailUrl: '/templates/plumbing-4.png',
    category: 'Plumbing Estimate',
  },
  {
    id: 'plumbing-5',
    name: 'LeakFree',
    thumbnailUrl: '/templates/plumbing-5.png',
    category: 'Plumbing Estimate',
  },
  {
    id: 'electrical-1',
    name: 'Voltage',
    thumbnailUrl: '/templates/electrical-1.png',
    category: 'Electrical Estimate',
  },
  {
    id: 'electrical-2',
    name: 'Circuit',
    thumbnailUrl: '/templates/electrical-2.png',
    category: 'Electrical Estimate',
  },
  {
    id: 'electrical-3',
    name: 'Spark',
    thumbnailUrl: '/templates/electrical-3.png',
    category: 'Electrical Estimate',
  },
  {
    id: 'electrical-4',
    name: 'Wired',
    thumbnailUrl: '/templates/electrical-4.png',
    category: 'Electrical Estimate',
  },
  {
    id: 'electrical-5',
    name: 'Power Grid',
    thumbnailUrl: '/templates/electrical-5.png',
    category: 'Electrical Estimate',
  },
  {
    id: 'landscaping-1',
    name: 'Garden',
    thumbnailUrl: '/templates/landscaping-1.png',
    category: 'Landscaping Estimate',
  },
  {
    id: 'landscaping-2',
    name: 'Greenway',
    thumbnailUrl: '/templates/landscaping-2.png',
    category: 'Landscaping Estimate',
  },
  {
    id: 'landscaping-3',
    name: 'Evergreen',
    thumbnailUrl: '/templates/landscaping-3.png',
    category: 'Landscaping Estimate',
  },
  {
    id: 'landscaping-4',
    name: 'Yardly',
    thumbnailUrl: '/templates/landscaping-4.png',
    category: 'Landscaping Estimate',
  },
  {
    id: 'landscaping-5',
    name: 'Terrascape',
    thumbnailUrl: '/templates/landscaping-5.png',
    category: 'Landscaping Estimate',
  },
];

export function DocumentTemplateSelector({ selectedTemplate, onSelectTemplate, documentType, category }: DocumentTemplateSelectorProps) {
  
  const filteredTemplates = templates.filter(t => t.category === category || t.category === 'all');
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 justify-center">
      {filteredTemplates.map((template) => (
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
                : 'border-border hover:border-primary/50'
            )}
            style={{ width: '188px' }}
          >
            <Image
              src={template.thumbnailUrl}
              alt={`${template.name} ${documentType} template`}
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
          <p className="text-center text-sm font-semibold p-3">{template.name} {documentType === 'quote' ? 'Quote' : 'Estimate'}</p>
        </div>
      ))}
    </div>
  );
}
