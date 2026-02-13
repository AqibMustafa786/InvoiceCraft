
'use client';

import type { Estimate } from '@/lib/types';
import { ClientDocumentPreview } from './document-preview';

interface EstimatePreviewProps {
  estimate: Estimate;
  accentColor: string;
}

export function EstimatePreview({ estimate, accentColor }: EstimatePreviewProps) {
  return (
    <ClientDocumentPreview
      document={estimate}
      accentColor={accentColor}
    />
  );
}
