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

interface TemplateCategory {
  title: string;
  templates: Template[];
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const templateCategories: TemplateCategory[] = [
  {
    title: "General Purpose",
    templates: [
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
    ]
  },
  {
    title: "Regional (USA)",
    templates: [
       {
        id: 'usa',
        name: 'USA',
        thumbnailUrl: '/templates/usa.png',
        isPro: true,
      }
    ]
  }
];

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      {templateCategories.map((category) => (
        <div key={category.title}>
          <h3 className="text-lg font-semibold mb-3">{category.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {category.templates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                className={cn(
                  'relative cursor-pointer rounded-lg border-2 transition-all',
                  selectedTemplate === template.id ? 'border-primary ring-2 ring-primary/50' : 'border-border hover:border-primary/50'
                )}
              >
                <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-muted flex items-center justify-center">
                  <div className="text-sm text-muted-foreground">{template.name}</div>
                </div>
                <p className="text-center text-sm font-medium p-2">{template.name}</p>
                {template.isPro && (
                  <Badge className="absolute top-2 right-2" variant="secondary">PRO</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
