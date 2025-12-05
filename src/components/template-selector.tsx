
'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useAuth, useFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';

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
    isPro: true,
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
  },
];

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
    const { user } = useAuth();
    const { firestore } = useFirebase();
    const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
    const { data: userData } = useDoc<{ plan: string }>(userDocRef);
    const isBusinessPlan = userData?.plan === 'business' || (user?.email === 'aqib2k1@gmail.com');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {templates.map((template) => {
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
