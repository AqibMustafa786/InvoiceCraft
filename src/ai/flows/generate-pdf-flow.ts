'use server';
/**
 * @fileOverview A Genkit flow for generating PDF documents from HTML.
 *
 * - generatePdf - A function that takes HTML content and returns a Base64-encoded PDF.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import puppeteer from 'puppeteer';

export const GeneratePdfInputSchema = z.object({
  html: z.string().describe('The HTML content to be converted to a PDF.'),
});
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
  async (input) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Set a default viewport size
    await page.setViewport({ width: 1080, height: 1024 });

    await page.setContent(input.html, { waitUntil: 'networkidle0' });
    
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
