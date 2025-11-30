'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const templates = [
  {
    id: 'default',
    name: 'Default',
    thumbnailUrl: '/templates/default.png',
  },
  {
    id: 'modern',
    name: 'Modern',
    thumbnailUrl: '/templates/modern.png',
  },
   {
    id: 'elegant',
    name: 'Elegant',
    thumbnailUrl: '/templates/elegant.png',
    isPro: true,
  },
];

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelectTemplate(template.id)}
          className={cn(
            'relative cursor-pointer rounded-lg border-2 transition-all',
            selectedTemplate === template.id ? 'border-primary ring-2 ring-primary/50' : 'border-border hover:border-primary/50'
          )}
        >
          <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-muted flex items-center justify-center">
            {/* Using a simple div as placeholder for now */}
            <div className="text-sm text-muted-foreground">{template.name}</div>
             {/* Replace with Image component when assets are available */}
             {/* <Image 
                src={template.thumbnailUrl}
                alt={`${template.name} template thumbnail`}
                width={150}
                height={200}
                className="object-cover"
             /> */}
          </div>
          <p className="text-center text-sm font-medium p-2">{template.name}</p>
          {template.isPro && (
            <Badge className="absolute top-2 right-2" variant="secondary">PRO</Badge>
          )}
        </div>
      ))}
    </div>
  );
}
