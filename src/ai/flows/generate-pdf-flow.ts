
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
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1080, height: 1024 });

    // Manually construct the HTML to avoid importing client components
    const documentHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${documentData.documentType.charAt(0).toUpperCase() + documentData.documentType.slice(1)}</title>
        <style>
          body { font-family: sans-serif; color: #333; }
          .container { padding: 2rem; }
          .header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
          .header h1 { font-size: 2rem; font-weight: bold; color: #3F51B5; }
          .client-info { margin-bottom: 2rem; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; }
          .items-table th { background-color: #f5f5f5; text-align: left; }
          .totals { text-align: right; }
          .totals table { display: inline-block; }
          .totals td { padding: 4px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>${documentData.business.name}</h1>
              <p>${documentData.business.address.replace(/\n/g, '<br>')}</p>
            </div>
            <div style="text-align: right;">
              <h2>${documentData.documentType.toUpperCase()}</h2>
              <p>#${documentData.estimateNumber}</p>
            </div>
          </div>
          <div class="client-info">
            <p><strong>To:</strong></p>
            <p>${documentData.client.name}</p>
            <p>${documentData.client.address.replace(/\n/g, '<br>')}</p>
          </div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${documentData.lineItems.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${documentData.currency} ${item.unitPrice.toFixed(2)}</td>
                  <td>${documentData.currency} ${(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="totals">
             <table>
                <tr><td>Subtotal:</td><td>${documentData.currency} ${documentData.summary.subtotal.toFixed(2)}</td></tr>
                <tr><td>Tax (${documentData.summary.taxPercentage}%):</td><td>${documentData.currency} ${documentData.summary.taxAmount.toFixed(2)}</td></tr>
                <tr><td><strong>Grand Total:</strong></td><td><strong>${documentData.currency} ${documentData.summary.grandTotal.toFixed(2)}</strong></td></tr>
             </table>
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(documentHtml, { waitUntil: 'networkidle0' });
    
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
