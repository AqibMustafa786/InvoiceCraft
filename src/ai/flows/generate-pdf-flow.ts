
'use server';
/**
 * @fileOverview A Genkit flow for generating PDF documents from Estimate/Quote data using @react-pdf/renderer.
 *
 * - generatePdf - A function that takes document data, renders it to a PDF buffer, and returns it as a Base64 string.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { type Estimate, type Quote } from '@/lib/types';
import { PDFDocument } from '@/components/pdf/document-pdf';

export const GeneratePdfInputSchema = z.custom<Estimate | Quote>();
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
    // Generate PDF as a buffer
    const pdfBuffer = await pdf(React.createElement(PDFDocument, { data: documentData })).toBuffer();

    // Convert the buffer to a Base64 string
    const pdfBase64 = pdfBuffer.toString('base64');

    return {
      pdfBase64,
    };
  }
);
