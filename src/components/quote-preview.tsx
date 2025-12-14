

'use client';

import type { Quote } from '@/lib/types';
import { ClientDocumentPreview } from './document-preview';

interface QuotePreviewProps {
  quote: Quote;
  accentColor: string;
}

export function QuotePreview({ quote, accentColor }: QuotePreviewProps) {
  return (
    <ClientDocumentPreview
      document={quote}
      accentColor={accentColor}
    />
  );
}
