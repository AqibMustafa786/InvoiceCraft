
'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface Template {
  id: string;
  name: string;
  thumbnailUrl: string;
  isPro?: boolean;
}

interface InsuranceTemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const templates: Template[] = [
  {
    id: 'usa-claim-default',
    name: 'USA Claim Form',
    thumbnailUrl: '/templates/Usa-insurance.png',
  },
  {
    id: 'usa-service',
    name: 'USA Service',
    thumbnailUrl: '/templates/Usa-service.png',
  },
];

export function InsuranceTemplateSelector({ selectedTemplate, onSelectTemplate }: InsuranceTemplateSelectorProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelectTemplate(template.id)}
          className="cursor-pointer group"
        >
          <div
            className={cn(
              'relative rounded-lg border-2 transition-all overflow-hidden aspect-[3/4] shadow-md',
              selectedTemplate === template.id
                ? 'border-primary ring-4 ring-primary/20'
                : 'border-border hover:border-primary/50'
            )}
          >
            <Image
              src={template.thumbnailUrl}
              alt={`${template.name} insurance document template`}
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
      ))}
    </div>
  );
}
