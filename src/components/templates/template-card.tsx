'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import type { Template } from '@/lib/template-data';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  isSelected?: boolean;
}

export function TemplateCard({ template, onPreview, isSelected }: TemplateCardProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      } 
    },
  };
  
  const toolColors: Record<string, string> = {
    Invoice: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Estimate: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Quote: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    Insurance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative block overflow-hidden rounded-lg border bg-card shadow-sm cursor-pointer"
      onClick={() => onPreview(template)}
    >
      <div
        className={cn(
          'relative aspect-[3/4] overflow-hidden transition-all',
           isSelected ? 'ring-4 ring-primary ring-offset-2 rounded-md' : 'ring-0'
        )}
      >
        <Image
          src={template.thumbnailUrl}
          alt={`Thumbnail for ${template.name} template`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div 
          aria-hidden="true" 
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        ></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button variant="secondary" size="sm" className="pointer-events-none">
            <Eye className="mr-2 h-4 w-4" />
            Select
          </Button>
        </div>
        {template.isPro && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            PRO
          </Badge>
        )}
      </div>
      <div className="p-3 bg-card flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-xs text-card-foreground leading-tight truncate">{template.name}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{template.category}</p>
        </div>
        <Badge 
            variant="outline" 
            className={cn("text-[10px] shrink-0", toolColors[template.toolType] || 'border')}
          >
            {template.toolType}
          </Badge>
      </div>
    </motion.div>
  );
}
