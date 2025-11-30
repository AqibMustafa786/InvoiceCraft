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

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const templates: Template[] = [
  {
    id: 'default',
    name: 'Default',
    thumbnailUrl: '/templates/Default.png',
  },
  {
    id: 'modern',
    name: 'Modern',
    thumbnailUrl: '/templates/Modern.png',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    thumbnailUrl: '/templates/Minimalist.png',
  },
  {
    id: 'creative',
    name: 'Creative',
    thumbnailUrl: '/templates/Creative.png',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    thumbnailUrl: '/templates/Elegant.png',
    isPro: true,
  },
  {
    id: 'usa',
    name: 'USA',
    thumbnailUrl: '/templates/Usa.png',
    isPro: true,
  }
];

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {templates.map((template) => (
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
              alt={template.name}
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
