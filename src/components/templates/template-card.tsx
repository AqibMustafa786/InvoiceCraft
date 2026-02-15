'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ArrowRight } from 'lucide-react';
import type { Template } from '@/lib/template-data';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  isSelected?: boolean;
}

export function TemplateCard({ template, onPreview, isSelected }: TemplateCardProps) {
  const toolColors: Record<string, string> = {
    Invoice: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50',
    Estimate: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50',
    Quote: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-200/50 dark:border-violet-800/50',
    Insurance: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/50',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 cursor-pointer dark:from-card/80 dark:to-card/40",
        isSelected ? "ring-2 ring-primary ring-offset-2" : "border-border/50"
      )}
      onClick={() => onPreview(template)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/20">
        <Image
          src={template.thumbnailUrl}
          alt={`Thumbnail for ${template.name}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <Button size="sm" variant="secondary" className="backdrop-blur-md bg-white/90 dark:bg-black/80 hover:bg-white dark:hover:bg-black shadow-lg transform transition-transform hover:scale-105">
            <Eye className="mr-2 h-3.5 w-3.5" />
            Preview
          </Button>
        </div>

        {template.isPro && (
          <Badge className="absolute top-3 right-3 shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white font-semibold tracking-wide text-[10px] px-2 py-0.5">
            PRO
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
              {template.name}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">{template.category}</p>
          </div>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <Badge
            variant="outline"
            className={cn("text-[10px] h-5 px-1.5 font-medium border", toolColors[template.toolType] || 'border-border')}
          >
            {template.toolType}
          </Badge>
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="text-xs text-primary font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Use <ArrowRight className="ml-1 h-3 w-3" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
