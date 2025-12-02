'use server';

import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { DocumentPreview } from '@/components/document-preview';
import { type Estimate, type Quote } from '@/lib/types';

/**
 * Renders an Estimate or Quote document to an HTML string using React's server-side rendering.
 * This is a server-only utility.
 */
export async function renderDocumentToHtml(document: Estimate | Quote): Promise<string> {
  // Pass the necessary props to the DocumentPreview component
  const documentElement = React.createElement(DocumentPreview, {
    document: document,
    accentColor: "hsl(var(--primary))",
    isPrint: true,
  });

  return renderToStaticMarkup(documentElement);
}
