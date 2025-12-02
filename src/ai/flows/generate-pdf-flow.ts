
'use server';
/**
 * @fileOverview A Genkit flow for generating PDF documents from HTML.
 *
 * - generatePdf - A function that takes document data, renders it to HTML, and returns a Base64-encoded PDF.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import puppeteer from 'puppeteer';
import { type Estimate } from '@/lib/types';
import { renderDocumentToHtml } from '@/lib/render-document';

// The input is now the document data itself.
export const GeneratePdfInputSchema = z.custom<Estimate>();
export type GeneratePdfInput = z.infer<typeof GeneratePdfInputSchema>;

export const GeneratePdfOutputSchema = z.object({
  pdfBase64: z.string().describe('The Base64-encoded PDF content.'),
});
export type GeneratePdfOutput = z.infer<typeof GeneratePdfOutputSchema>;

export async function generatePdf(input: GeneratePdfInput): Promise<GeneratePdfOutput> {
  return generatePdfFlow(input);
}

const generatePdfFlow = ai.defineFlow(
  {
    name: 'generatePdfFlow',
    inputSchema: GeneratePdfInputSchema,
    outputSchema: GeneratePdfOutputSchema,
  },
  async (documentData) => {
    // Render the React component to an HTML string using the server utility
    const documentHtml = await renderDocumentToHtml(documentData);

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Inject Tailwind CSS into the page
    const tailwindCss = `
      <style>
        body { font-family: 'Inter', sans-serif; }
        .font-headline { font-family: 'Inter', sans-serif; }
        /* Add other critical Tailwind styles here if needed */
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    `;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${documentData.documentType.charAt(0).toUpperCase() + documentData.documentType.slice(1)}</title>
          ${tailwindCss}
        </head>
        <body>
          ${documentHtml}
        </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });
    
    await browser.close();

    return {
      pdfBase64: pdfBuffer.toString('base64'),
    };
  }
);
