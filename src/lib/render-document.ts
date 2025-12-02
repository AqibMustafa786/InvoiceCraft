'use server';

import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { DocumentPreview } from '@/components/document-preview';
import { type Estimate, type Quote } from '@/lib/types';

/**
 * Renders a document component to an HTML string on the server.
 * This is a server-only utility.
 */
export function renderDocumentToHtml(document: Estimate | Quote): string {
  // Pass the necessary props to the DocumentPreview component
  const documentElement = React.createElement(DocumentPreview, {
    document: document,
    accentColor: "hsl(var(--primary))",
    isPrint: true,
  });

  return renderToStaticMarkup(documentElement);
}
