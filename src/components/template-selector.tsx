'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
        id: 'minimalist',
        name: 'Minimalist',
        thumbnailUrl: '/templates/minimalist.png',
      },
       {
        id: 'creative',
        name: 'Creative',
        thumbnailUrl: '/templates/creative.png',
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
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {templateCategories.flatMap(category => category.templates).map((template, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="p-1">
               <div
                onClick={() => onSelectTemplate(template.id)}
                className={cn(
                  'relative cursor-pointer rounded-lg border-2 transition-all overflow-hidden group',
                  selectedTemplate === template.id ? 'border-primary ring-2 ring-primary/50' : 'border-border hover:border-primary/50'
                )}
              >
                <div className="aspect-[3/4] w-full bg-muted flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={template.thumbnailUrl} alt={template.name} className="object-cover w-full h-full" />
                </div>
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold">Select</span>
                 </div>
                {template.isPro && (
                  <Badge className="absolute top-2 right-2" variant="secondary">PRO</Badge>
                )}
              </div>
               <p className="text-center text-sm font-medium p-2">{template.name}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12"/>
      <CarouselNext className="mr-12"/>
    </Carousel>
  );
}
