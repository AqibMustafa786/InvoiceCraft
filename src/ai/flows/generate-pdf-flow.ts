
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
    // Manually render the document to an HTML string to avoid React dependencies.
    const documentHtml = `
      <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; color: #374151; }
            .container { padding: 40px; }
            h1, h2, h3 { color: #111827; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
            .header img { max-width: 150px; max-height: 50px; object-fit: contain; }
            .header-right { text-align: right; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 12px; text-align: left; }
            thead { background-color: #f3f4f6; }
            tbody tr { border-bottom: 1px solid #e5e7eb; }
            .total-section { display: flex; justify-content: flex-end; margin-top: 20px; }
            .total-table { width: 300px; }
            .total-table td { padding: 8px; }
            .grand-total { font-weight: bold; font-size: 1.125rem; }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div>
                ${documentData.business.logoUrl ? `<img src="${documentData.business.logoUrl}" alt="Logo">` : `<h1>${documentData.business.name}</h1>`}
                <p>${documentData.business.address.replace(/\n/g, '<br>')}</p>
              </div>
              <div class="header-right">
                <h2>${documentData.documentType === 'estimate' ? 'ESTIMATE' : 'QUOTE'}</h2>
                <p>#${documentData.estimateNumber}</p>
              </div>
            </div>
            <div class="details">
              <div>
                <h3>Bill To</h3>
                <p><strong>${documentData.client.name}</strong></p>
                <p>${documentData.client.address.replace(/\n/g, '<br>')}</p>
              </div>
              <div>
                <p><strong>Date Issued:</strong> ${new Date(documentData.estimateDate).toLocaleDateString()}</p>
                <p><strong>Valid Until:</strong> ${new Date(documentData.validUntilDate).toLocaleDateString()}</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: right;">Quantity</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${documentData.lineItems.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td style="text-align: right;">${item.quantity}</td>
                    <td style="text-align: right;">${item.unitPrice.toFixed(2)}</td>
                    <td style="text-align: right;">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total-section">
              <table class="total-table">
                <tr><td>Subtotal:</td><td style="text-align: right;">${documentData.summary.subtotal.toFixed(2)}</td></tr>
                <tr><td>Tax (${documentData.summary.taxPercentage}%):</td><td style="text-align: right;">${documentData.summary.taxAmount.toFixed(2)}</td></tr>
                <tr class="grand-total"><td>Grand Total:</td><td style="text-align: right;">${documentData.summary.grandTotal.toFixed(2)}</td></tr>
              </table>
            </div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
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
