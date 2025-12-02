
'use server';
/**
 * @fileOverview A Genkit flow for generating PDF documents from Estimate/Quote data using @react-pdf/renderer.
 *
 * - generatePdf - A function that takes document data, renders it to a PDF buffer, and returns it as a Base64 string.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { type Estimate, type Quote } from '@/lib/types';
import { format, isValid } from 'date-fns';

export const GeneratePdfInputSchema = z.custom<Estimate | Quote>();
export type GeneratePdfInput = z.infer<typeof GeneratePdfInputSchema>;

export const GeneratePdfOutputSchema = z.object({
  pdfBase64: z.string().describe('The Base64-encoded PDF content.'),
});
export type GeneratePdfOutput = z.infer<typeof GeneratePdfOutputSchema>;

// Helper for safe date formatting
const safeFormat = (date: Date | string | number | undefined, formatString: string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return isValid(d) ? format(d, formatString) : "Invalid Date";
};

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'column',
    maxWidth: '60%',
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 5,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  companyDetails: {
    fontSize: 9,
    color: '#6B7280',
    whiteSpace: 'pre-line',
  },
  headerRight: {
    textAlign: 'right',
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  documentNumber: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  clientInfo: {
    maxWidth: '50%',
  },
  metaInfo: {
    textAlign: 'right',
    maxWidth: '40%',
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableCell: {
    padding: 8,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  totalTable: {
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 4,
    backgroundColor: '#3F51B5',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  footer: {
      position: 'absolute',
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: 'center',
      fontSize: 8,
      color: 'grey',
  }
});


// A reusable PDF document component that mirrors the structure of DocumentPreview
const PDFDocument = ({ data }: { data: Estimate | Quote }) => {
    const { business, client, lineItems, summary, documentType, estimateNumber, estimateDate, validUntilDate, projectTitle, termsAndConditions } = data;
    const documentTitle = documentType === 'estimate' ? 'Estimate' : 'Quote';

    return (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    {business.logoUrl ? <Image style={styles.logo} src={business.logoUrl} /> : <Text style={styles.companyName}>{business.name}</Text>}
                    <Text style={styles.companyDetails}>{business.address}</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.documentTitle}>{documentTitle}</Text>
                    <Text style={styles.documentNumber}>#{estimateNumber}</Text>
                </View>
            </View>

            {/* Details */}
            <View style={styles.detailsSection}>
                <View style={styles.clientInfo}>
                    <Text style={styles.sectionTitle}>Bill To</Text>
                    <Text style={styles.boldText}>{client.name}</Text>
                    <Text style={{ fontSize: 9, color: '#6B7280', whiteSpace: 'pre-line' }}>{client.address}</Text>
                </View>
                <View style={styles.metaInfo}>
                    <Text style={styles.sectionTitle}>Project</Text>
                    <Text>{projectTitle}</Text>
                    <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Date Issued</Text>
                    <Text>{safeFormat(estimateDate, 'MMM d, yyyy')}</Text>
                    <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Valid Until</Text>
                    <Text>{safeFormat(validUntilDate, 'MMM d, yyyy')}</Text>
                </View>
            </View>

            {/* Line Items Table */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { flex: 4 }]}>Item</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'center' }]}>Qty</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: 'right' }]}>Price</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: 'right' }]}>Total</Text>
                </View>
                {lineItems.map(item => (
                    <View key={item.id} style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 4, whiteSpace: 'pre-line' }]}>{item.name}</Text>
                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.quantity}</Text>
                        <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'right' }]}>{item.unitPrice.toFixed(2)}</Text>
                        <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'right' }]}>{(item.quantity * item.unitPrice).toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            {/* Totals Section */}
            <View style={styles.totalSection}>
                <View style={styles.totalTable}>
                    <View style={styles.totalRow}><Text>Subtotal</Text><Text>{summary.subtotal.toFixed(2)}</Text></View>
                    {summary.taxAmount > 0 && <View style={styles.totalRow}><Text>Tax ({summary.taxPercentage}%)</Text><Text>{summary.taxAmount.toFixed(2)}</Text></View>}
                    <View style={styles.grandTotalRow}><Text>Grand Total</Text><Text>{summary.grandTotal.toFixed(2)}</Text></View>
                </View>
            </View>

            {/* Terms and Conditions */}
            {termsAndConditions && (
                <View style={{ marginTop: 30 }}>
                    <Text style={styles.sectionTitle}>Terms & Conditions</Text>
                    <Text style={{ fontSize: 9, color: '#6B7280', whiteSpace: 'pre-line' }}>{termsAndConditions}</Text>
                </View>
            )}

            <Text style={styles.footer} fixed>Thank you for your business!</Text>
        </Page>
    </Document>
    );
};

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
    const pdfBuffer = await pdf(<PDFDocument data={documentData} />).toBuffer();

    // Convert the buffer to a Base64 string
    const pdfBase64 = pdfBuffer.toString('base64');

    return {
      pdfBase64,
    };
  }
);
