
'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Template } from '@/lib/template-data';
import { FileText, DraftingCompass, Shield, FileQuestion } from 'lucide-react';
import React from 'react';

interface TemplatePreviewProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

const getIconForTool = (toolType: string) => {
    switch (toolType) {
        case 'Invoice': return <FileText className="h-4 w-4" />;
        case 'Estimate': return <DraftingCompass className="h-4 w-4" />;
        case 'Quote': return <FileQuestion className="h-4 w-4" />;
        case 'Insurance': return <Shield className="h-4 w-4" />;
        default: return <FileText className="h-4 w-4" />;
    }
}

export function TemplatePreview({ template, isOpen, onClose }: TemplatePreviewProps) {
  if (!template) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-5xl p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <SheetDescription className='text-sm text-primary font-semibold'>{template.category}</SheetDescription>
          <SheetTitle className="text-2xl font-bold">{template.name}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-hidden">
          <ScrollArea className="col-span-1 lg:col-span-2 h-full">
            <div className="p-8 bg-background">
               <div className="w-full max-w-2xl mx-auto bg-background rounded-md shadow-2xl overflow-hidden">
                 <Image
                    src={template.thumbnailUrl}
                    alt={`Preview of ${template.name}`}
                    width={850}
                    height={1100}
                    className="w-full h-auto object-contain"
                  />
               </div>
            </div>
          </ScrollArea>
          <aside className="hidden lg:block bg-card border-l">
            <ScrollArea className="h-full">
                 <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Template Details</h3>
                         <div className="text-sm space-y-3 text-muted-foreground">
                            <p className="flex items-center gap-2">
                                {getIconForTool(template.toolType)}
                                <span className="font-medium text-foreground">{template.toolType}</span>
                            </p>
                            <p>
                                <span className="font-semibold text-card-foreground">Category:</span> {template.category}
                            </p>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Best For</h3>
                         <div className="flex flex-wrap gap-2">
                            {template.useCases.map(useCase => (
                                <Badge key={useCase} variant="secondary">{useCase}</Badge>
                            ))}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Description</h3>
                        <p className="text-sm text-muted-foreground" style={{wordBreak: 'break-word'}}>{template.description}</p>
                    </div>
                 </div>
            </ScrollArea>
          </aside>
        </div>
      </SheetContent>
    </Sheet>
  );
}
