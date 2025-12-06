'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useAuth, useFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { type InvoiceCategory } from '@/lib/types';

interface Template {
  id: string;
  name: string;
  thumbnailUrl: string;
  isPro?: boolean;
  category?: InvoiceCategory | 'all';
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  category: InvoiceCategory;
}

const templates: Template[] = [
  // General
  { id: 'default', name: 'Default', thumbnailUrl: '/templates/Default.png', category: 'all' },
  { id: 'modern', name: 'Modern', thumbnailUrl: '/templates/Modern.png', category: 'all' },
  { id: 'minimalist', name: 'Minimalist', thumbnailUrl: '/templates/Minimalist.png', category: 'all' },
  { id: 'creative', name: 'Creative', thumbnailUrl: '/templates/Creative.png', category: 'all', isPro: true },
  { id: 'elegant', name: 'Elegant', thumbnailUrl: '/templates/Elegant.png', category: 'all', isPro: true },
  { id: 'usa', name: 'USA', thumbnailUrl: '/templates/Usa.png', category: 'all', isPro: true },

  // Construction
  { id: 'construction-1', name: 'Foundation', thumbnailUrl: '/templates/construction-1.png', category: 'Construction' },
  { id: 'construction-2', name: 'Blueprint', thumbnailUrl: '/templates/construction-2.png', category: 'Construction' },
  { id: 'construction-3', name: 'Contractor', thumbnailUrl: '/templates/construction-3.png', category: 'Construction' },
  { id: 'construction-4', name: 'High-Rise', thumbnailUrl: '/templates/construction-4.png', category: 'Construction', isPro: true },
  { id: 'construction-5', name: 'Steel-Frame', thumbnailUrl: '/templates/construction-5.png', category: 'Construction', isPro: true },
  { id: 'construction-6', name: 'Classic', thumbnailUrl: '/templates/construction-1.png', category: 'Construction', isPro: true },
  { id: 'construction-7', name: 'Modern Build', thumbnailUrl: '/templates/construction-2.png', category: 'Construction', isPro: true },
  { id: 'construction-8', name: 'Grid', thumbnailUrl: '/templates/construction-3.png', category: 'Construction', isPro: true },
  { id: 'construction-9', name: 'Simple', thumbnailUrl: '/templates/construction-4.png', category: 'Construction', isPro: true },
  { id: 'construction-10', name: 'Bold', thumbnailUrl: '/templates/construction-5.png', category: 'Construction', isPro: true },

  // Plumbing
  { id: 'plumbing-1', name: 'Direct', thumbnailUrl: '/templates/plumbing-1.png', category: 'Plumbing' },
  { id: 'plumbing-2', name: 'Modern Blue', thumbnailUrl: '/templates/plumbing-2.png', category: 'Plumbing' },
  { id: 'plumbing-3', name: 'Clean', thumbnailUrl: '/templates/plumbing-3.png', category: 'Plumbing' },
  { id: 'plumbing-4', name: 'Side Panel', thumbnailUrl: '/templates/plumbing-4.png', category: 'Plumbing', isPro: true },
  { id: 'plumbing-5', name: 'Grid', thumbnailUrl: '/templates/plumbing-5.png', category: 'Plumbing', isPro: true },
  { id: 'plumbing-6', name: 'Aqua', thumbnailUrl: '/templates/plumbing-1.png', category: 'Plumbing', isPro: true },
  { id: 'plumbing-7', name: 'Flow', thumbnailUrl: '/templates/plumbing-2.png', category: 'Plumbing', isPro: true },
  { id: 'plumbing-8', name: 'LeakFree', thumbnailUrl: '/templates/plumbing-3.png', category: 'Plumbing', isPro: true },
  { id: 'plumbing-9', name: 'Pressure', thumbnailUrl: '/templates/plumbing-4.png', category: 'Plumbing', isPro: true },
  { id: 'plumbing-10', name: 'Classic', thumbnailUrl: '/templates/plumbing-5.png', category: 'Plumbing', isPro: true },

  // Electrical
  { id: 'electrical-1', name: 'Direct', thumbnailUrl: '/templates/electrical-1.png', category: 'Electrical Services' },
  { id: 'electrical-2', name: 'Centered', thumbnailUrl: '/templates/electrical-2.png', category: 'Electrical Services' },
  { id: 'electrical-3', name: 'Minimal', thumbnailUrl: '/templates/electrical-3.png', category: 'Electrical Services' },
  { id: 'electrical-4', name: 'Side Accent', thumbnailUrl: '/templates/electrical-4.png', category: 'Electrical Services', isPro: true },
  { id: 'electrical-5', name: 'Grid', thumbnailUrl: '/templates/electrical-5.png', category: 'Electrical Services', isPro: true },
  { id: 'electrical-6', name: 'Volt', thumbnailUrl: '/templates/electrical-1.png', category: 'Electrical Services', isPro: true },
  { id: 'electrical-7', name: 'Spark', thumbnailUrl: '/templates/electrical-2.png', category: 'Electrical Services', isPro: true },
  { id: 'electrical-8', name: 'Circuit', thumbnailUrl: '/templates/electrical-3.png', category: 'Electrical Services', isPro: true },
  { id: 'electrical-9', name: 'Wired', thumbnailUrl: '/templates/electrical-4.png', category: 'Electrical Services', isPro: true },
  { id: 'electrical-10', name: 'PowerGrid', thumbnailUrl: '/templates/electrical-5.png', category: 'Electrical Services', isPro: true },

];

export function TemplateSelector({ selectedTemplate, onSelectTemplate, category }: TemplateSelectorProps) {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
    const { data: userData } = useDoc<{ plan: string }>(userDocRef);
    const isBusinessPlan = userData?.plan === 'business' || (user?.email === 'aqib2k1@gmail.com');

    const filteredTemplates = templates.filter(t => t.category === category || t.category === 'all');

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTemplates.map((template) => {
        const isLocked = template.isPro && !isBusinessPlan;
        return (
            <div
            key={template.id}
            onClick={() => !isLocked && onSelectTemplate(template.id)}
            className={cn("cursor-pointer group", isLocked && "cursor-not-allowed opacity-60")}
            >
            <div
                className={cn(
                'relative rounded-lg border-2 transition-all overflow-hidden aspect-[3/4] shadow-md mx-auto',
                selectedTemplate === template.id && !isLocked
                    ? 'border-primary ring-4 ring-primary/20'
                    : 'border-border',
                !isLocked && 'hover:border-primary/50'
                )}
                style={{ width: '188px' }}
            >
                <Image
                src={template.thumbnailUrl}
                alt={`${template.name} invoice template`}
                width={188}
                height={250}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {!isLocked && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Select</span>
                    </div>
                )}
                {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                )}
                {template.isPro && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                    PRO
                </Badge>
                )}
            </div>
            <p className="text-center text-sm font-semibold p-3">{template.name}</p>
            </div>
        )
      })}
    </div>
  );
}
