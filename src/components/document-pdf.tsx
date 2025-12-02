
import { renderToStaticMarkup } from 'react-dom/server';
import { type Estimate } from '@/lib/types';
import { DefaultTemplate, ContractorTemplate } from '@/components/document-preview';

const templates = {
  'default': DefaultTemplate,
  'contractor': ContractorTemplate,
};

interface DocumentPdfProps {
  document: Estimate;
  accentColor: string;
}

export async function DocumentPdf({ document, accentColor }: DocumentPdfProps) {

  const TemplateComponent = templates[document.template as keyof typeof templates] || templates.default;

  const documentHtml = renderToStaticMarkup(
    <TemplateComponent document={document} accentColor={accentColor} />
  );

  // This is a simplified set of styles. In a real app, you'd use a more robust CSS-inlining solution.
  const fullHtml = `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Roboto:wght@400;700&family=Lato:wght@400;700&family=Merriweather:wght@400;700&display=swap');
          body { font-family: '${document.fontFamily || 'Inter'}', sans-serif; font-size: ${document.fontSize || 14}px; background-color: #fff; color: ${document.textColor || '#1f2937'}; }
          .p-8 { padding: 2rem; } .md\\:p-10 { padding: 2.5rem; } .bg-white { background-color: #fff; } .text-gray-800 { color: #1f2937; }
          .flex { display: flex; } .justify-between { justify-content: space-between; } .items-start { align-items: flex-start; }
          .mb-10 { margin-bottom: 2.5rem; } .text-3xl { font-size: 1.875rem; } .font-bold { font-weight: 700; }
          .grid { display: grid; } .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .gap-4 { gap: 1rem; } .text-sm { font-size: 0.875rem; }
          .text-muted-foreground { color: #6b7281; } .mt-2 { margin-top: 0.5rem; } .space-y-1 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.25rem; }
          .whitespace-pre-line { white-space: pre-line; } .text-right { text-align: right; } .uppercase { text-transform: uppercase; } .tracking-wider { letter-spacing: 0.05em; }
          .text-gray-400 { color: #9ca3af; } .font-headline { font-weight: 700; } .w-full { width: 100%; } .text-left { text-align: left; }
          .p-3 { padding: 0.75rem; } .w-1\\/2 { width: 50%; } .font-semibold { font-weight: 600; } .tabular-nums { font-variant-numeric: tabular-nums; }
          .border-b { border-bottom-width: 1px; border-color: #e5e7eb; } .font-medium { font-weight: 500; }
          .mt-8 { margin-top: 2rem; } .max-w-xs { max-width: 20rem; } .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
          .items-center { align-items: center; } .text-lg { font-size: 1.125rem; } .rounded-md { border-radius: 0.375rem; }
          .text-destructive { color: #ef4444; } .mt-10 { margin-top: 2.5rem; } .mb-8 { margin-bottom: 2rem; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 0.75rem; text-align: left; }
          h1, h2, h3, h4, h5, h6 { font-weight: bold; }
          .border-t-8 { border-top-width: 8px; } .mb-12 { margin-bottom: 3rem; } .gap-10 { gap: 2.5rem; }
          .text-4xl { font-size: 2.25rem; } .text-5xl { font-size: 3rem; } .font-light { font-weight: 300; }
          .bg-gray-50 { background-color: #f9fafb; } .rounded-md { border-radius: 0.375rem; }
          .text-gray-600 { color: #4b5563; } .text-lg { font-size: 1.125rem; } .border-b-2 { border-bottom-width: 2px; }
          .border-gray-300 { border-color: #d1d5db; } .p-2 { padding: 0.5rem; } .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
          .mt-6 { margin-top: 1.5rem; } .max-w-sm { max-width: 24rem; } .text-xl { font-size: 1.25rem; }
          .border-t { border-top-width: 1px; } .pt-2 { padding-top: 0.5rem; } .pt-6 { padding-top: 1.5rem; }
          .text-xs { font-size: 0.75rem; } .mt-1 { margin-top: 0.25rem; } .border { border-width: 1px; }
        </style>
      </head>
      <body>${'${documentHtml}'}</body>
    </html>
  `;

  return fullHtml;
}
