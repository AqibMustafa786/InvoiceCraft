

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { type Estimate, type Quote, type Invoice } from '@/lib/types';
import { format, isValid } from 'date-fns';
import { dictionaries, type Language } from '@/lib/i18n/dictionaries';
import { toDateSafe } from '@/lib/utils';

// Register Fonts
// Font.register({
//   family: 'Inter',
//   fonts: [
//     { src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf' },
//     { src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf', fontWeight: 'bold' },
//   ],
// });

Font.register({
  family: 'Noto Sans SC',
  src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk@main/Sans/SubsetOTF/SC/NotoSansSC-Regular.otf',
});

Font.register({
  family: 'Noto Sans Devanagari',
  src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf',
});

// Helper for safe date formatting
const safeFormat = (date: any, formatString: string) => {
  const d = toDateSafe(date);
  return d ? format(d, formatString) : 'N/A';
};

// Helper for safe text rendering (prevents Error #31)
const s = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return val.toString();
  return String(val);
};

// Helper to get correct font for language
const getFontForLanguage = (lang: Language): string => {
  if (lang === 'zh') return 'Noto Sans SC';
  if (lang === 'hi') return 'Noto Sans Devanagari';
  return 'Helvetica';
};

// Define styles creator
const createStyles = (language: Language, colors: { accent?: string; background?: string; text?: string }, customFont?: string) => {
  const accent = colors.accent || '#3F51B5';
  const background = colors.background || '#FFFFFF';
  const text = colors.text || '#374151';

  return StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: customFont || getFontForLanguage(language),
      fontSize: 10,
      color: text,
      backgroundColor: background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
      alignItems: 'flex-start',
      borderBottomWidth: 2,
      borderBottomColor: accent,
      paddingBottom: 20,
    },
    headerLeft: {
      flexDirection: 'column',
      maxWidth: '60%',
    },
    logo: {
      width: 140,
      height: 50,
      marginBottom: 5,
      objectFit: 'contain',
    },
    companyName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: accent,
    },
    companyDetails: {
      fontSize: 9,
      color: '#6B7280',
      marginTop: 2,
    },
    headerRight: {
      textAlign: 'right',
    },
    documentTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: accent,
      textTransform: 'uppercase',
    },
    documentNumber: {
      fontSize: 12,
      color: '#4B5563',
      marginTop: 4,
      fontWeight: 'bold',
    },
    detailsSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginTop: 20,
    },
    billingColumn: {
      flexDirection: 'column',
      width: '32%',
    },
    metaColumn: {
      flexDirection: 'column',
      width: '32%',
      textAlign: 'right',
    },
    sectionTitle: {
      fontSize: 9,
      fontWeight: 'bold',
      color: accent,
      textTransform: 'uppercase',
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      paddingBottom: 2,
    },
    infoText: {
      fontSize: 9,
      marginBottom: 2,
    },
    boldText: {
      fontWeight: 'bold',
      color: '#1F2937',
    },
    table: {
      width: '100%',
      marginTop: 10,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#F9FAFB',
      borderBottomWidth: 1,
      borderBottomColor: accent,
    },
    tableHeaderCell: {
      padding: 8,
      fontSize: 9,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: accent,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
      alignItems: 'center',
      minHeight: 30,
    },
    tableCell: {
      padding: 8,
      fontSize: 9,
    },
    itemMain: {
      fontWeight: 'bold',
      marginBottom: 2,
    },
    itemDescription: {
      fontSize: 8,
      color: '#6B7280',
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
      paddingVertical: 3,
      fontSize: 9,
    },
    grandTotalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      marginTop: 6,
      backgroundColor: accent,
      color: 'white',
      fontWeight: 'bold',
      borderRadius: 4,
      paddingHorizontal: 8,
    },
    balanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
      marginTop: 4,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
      fontWeight: 'bold',
      color: '#ef4444', // Red for balance due
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: 'center',
      fontSize: 8,
      color: 'grey',
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
      paddingTop: 10,
    },
    notesSection: {
      marginTop: 30,
      padding: 10,
      backgroundColor: '#F9FAFB',
      borderRadius: 4,
    },
    signatureSection: {
      marginTop: 40,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    signatureBox: {
      width: 150,
      textAlign: 'center',
    },
    signatureLine: {
      borderTopWidth: 1,
      borderTopColor: '#374151',
      marginTop: 40,
      paddingTop: 5,
    },
    signatureImage: {
      width: 100,
      height: 40,
      alignSelf: 'center',
    }
  });
};

// A reusable PDF document component that mirrors the structure of DocumentPreview
export const PDFDocument = ({ data, language, plan }: { data: Estimate | Quote | Invoice, language?: Language, plan?: string }) => {
  const lang = (data as any).language as Language || language || 'en';
  const customFont = (data as any).fontFamily;

  // Extract branding colors
  const branding = {
    accent: (data as any).accentColor || (data as any).primaryColor || '#3F51B5',
    background: (data as any).backgroundColor || '#FFFFFF',
    text: (data as any).textColor || '#374151',
  };

  const styles = createStyles(lang, branding, customFont);
  const t = dictionaries[lang]?.pdf || dictionaries.en.pdf;

  // Determine document type and fields
  const isInvoice = data.documentType === 'invoice';
  const docTitle = isInvoice ? t.invoice : (data.documentType === 'estimate' ? t.estimate : t.quote);
  const docNumber = isInvoice ? (data as Invoice).invoiceNumber : (data as Estimate).estimateNumber;
  const docDate = isInvoice ? (data as Invoice).invoiceDate : (data as Estimate).estimateDate;
  const expiryDate = isInvoice ? (data as Invoice).dueDate : (data as Estimate).validUntilDate;
  const poNumber = isInvoice ? (data as Invoice).poNumber : (data as Estimate).referenceNumber;
  const category = (data as any).category;

  const { business = {} as any, client = {} as any, lineItems = [], summary = { subtotal: 0, taxAmount: 0, discount: 0, shippingCost: 0, grandTotal: 0, taxPercentage: 0 } } = data;
  const amountPaid = (data as any).amountPaid || 0;
  const balanceDue = (summary?.grandTotal || 0) - amountPaid;

  // cast to any for extended fields
  const termsAndConditions = (data as any).termsAndConditions;
  const paymentInstructions = (data as any).paymentInstructions;
  const notes = (data as any).notes;

  // Signatures
  const ownerSignature = business.ownerSignature;
  const clientSignature = (data as any).clientSignature;
  const customFields = (data as any).customFields as any[] || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {business.logoUrl ? (
              <Image style={styles.logo} src={business.logoUrl} />
            ) : (
              <Text style={styles.companyName}>{s(business.name)}</Text>
            )}
            <Text style={styles.companyDetails}>{s(business.address)}</Text>
            {business.phone && <Text style={styles.companyDetails}>{t.phone}: {s(business.phone)}</Text>}
            {business.email && <Text style={styles.companyDetails}>{t.email}: {s(business.email)}</Text>}
            {business.website && <Text style={styles.companyDetails}>{t.website}: {s(business.website)}</Text>}
            {business.licenseNumber && <Text style={styles.companyDetails}>{t.licenseNumber}: {s(business.licenseNumber)}</Text>}
            {business.taxId && <Text style={styles.companyDetails}>{t.taxId}: {s(business.taxId)}</Text>}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.documentTitle}>{s(docTitle)}</Text>
            <Text style={styles.documentNumber}>#{s(docNumber)}</Text>
            {category && <Text style={[styles.companyDetails, { marginTop: 4 }]}>{t.category}: {s(category)}</Text>}
          </View>
        </View>

        {/* Billing Section (3 Columns) */}
        <View style={styles.detailsSection}>
          <View style={styles.billingColumn}>
            <Text style={styles.sectionTitle}>{t.billFrom}</Text>
            <Text style={styles.boldText}>{s(business.name)}</Text>
            <Text style={styles.infoText}>{s(business.address)}</Text>
            {business.email && <Text style={styles.infoText}>{s(business.email)}</Text>}
            {business.phone && <Text style={styles.infoText}>{s(business.phone)}</Text>}
          </View>

          <View style={styles.billingColumn}>
            <Text style={styles.sectionTitle}>{t.billTo}</Text>
            <Text style={styles.boldText}>{s(client.name)}</Text>
            {client.companyName && <Text style={styles.infoText}>{s(client.companyName)}</Text>}
            <Text style={styles.infoText}>{s(client.address)}</Text>
            {client.email && <Text style={styles.infoText}>{s(client.email)}</Text>}
            {client.phone && <Text style={styles.infoText}>{s(client.phone)}</Text>}
            {client.shippingAddress && client.shippingAddress !== client.address && (
              <View style={{ marginTop: 8 }}>
                <Text style={[styles.sectionTitle, { fontSize: 7, borderBottomWidth: 0 }]}>{t.shippingAddress}</Text>
                <Text style={styles.infoText}>{s(client.shippingAddress)}</Text>
              </View>
            )}
          </View>

          <View style={styles.metaColumn}>
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.sectionTitle}>{isInvoice ? t.poNumber : t.project}</Text>
              <Text style={styles.boldText}>{s(poNumber) || 'N/A'}</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.sectionTitle}>{t.issuedDate}</Text>
              <Text style={styles.boldText}>{safeFormat(docDate, 'MMM d, yyyy')}</Text>
            </View>
            <View>
              <Text style={styles.sectionTitle}>{isInvoice ? t.dueDate : t.validUntil}</Text>
              <Text style={styles.boldText}>{safeFormat(expiryDate, 'MMM d, yyyy')}</Text>
            </View>
            {customFields.length > 0 && (
              <View style={{ marginTop: 10 }}>
                {customFields.map((f, i) => (
                  <View key={i} style={{ marginBottom: 2 }}>
                    <Text style={{ fontSize: 7, color: branding.accent }}>{s(f.label).toUpperCase()}</Text>
                    <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{s(f.value)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 4 }]}>{t.item}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'center' }]}>{t.qty}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: 'right' }]}>{t.price}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5, textAlign: 'right' }]}>{t.total}</Text>
          </View>
          {lineItems.map(item => (
            <View key={item.id} style={styles.tableRow} wrap={false}>
              <View style={{ flex: 4, padding: 8 }}>
                <Text style={styles.itemMain}>{s(item.name)}</Text>
                {item.description && <Text style={styles.itemDescription}>{s(item.description)}</Text>}
              </View>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{s(item.quantity)}</Text>
              <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'right' }]}>{s(item.unitPrice.toFixed(2))}</Text>
              <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'right' }]}>{s((item.quantity * (item.unitPrice || item.rate || 0)).toFixed(2))}</Text>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalSection} wrap={false}>
          <View style={styles.totalTable}>
            <View style={styles.totalRow}><Text>{t.subtotal}</Text><Text>{s(summary.subtotal.toFixed(2))}</Text></View>
            {summary.taxAmount > 0 && <View style={styles.totalRow}><Text>{t.tax} ({s(summary.taxPercentage)}%)</Text><Text>{s(summary.taxAmount.toFixed(2))}</Text></View>}
            {summary.discount > 0 && <View style={styles.totalRow}><Text>{t.discount}</Text><Text>-{s(summary.discount.toFixed(2))}</Text></View>}
            {summary.shippingCost > 0 && <View style={styles.totalRow}><Text>{t.shipping}</Text><Text>{s(summary.shippingCost.toFixed(2))}</Text></View>}
            <View style={styles.grandTotalRow}><Text>{t.grandTotal}</Text><Text>{s(summary.grandTotal.toFixed(2))}</Text></View>
            {isInvoice && amountPaid > 0 && <View style={styles.totalRow}><Text>{t.amountPaid}</Text><Text>{s(amountPaid.toFixed(2))}</Text></View>}
            {isInvoice && <View style={styles.balanceRow}><Text>{t.balanceDue}</Text><Text>{s(balanceDue.toFixed(2))}</Text></View>}
          </View>
        </View>

        {/* Bottom Details Section */}
        <View style={{ marginTop: 20 }} wrap={false}>
          {paymentInstructions && (
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>{t.paymentInstructions}</Text>
              <Text style={styles.infoText}>{s(paymentInstructions)}</Text>
            </View>
          )}

          {notes && (
            <View style={[styles.notesSection, { marginTop: 10 }]}>
              <Text style={styles.sectionTitle}>{t.notes}</Text>
              <Text style={styles.infoText}>{s(notes)}</Text>
            </View>
          )}

          {termsAndConditions && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.sectionTitle, { borderBottomWidth: 0 }]}>{t.terms}</Text>
              <Text style={[styles.infoText, { color: '#6B7280', fontSize: 8 }]}>{s(termsAndConditions)}</Text>
            </View>
          )}
        </View>

        {/* Signature Section */}
        {(ownerSignature || clientSignature) && (
          <View style={styles.signatureSection} wrap={false}>
            {ownerSignature && (
              <View style={styles.signatureBox}>
                {ownerSignature.image ? (
                  <Image style={styles.signatureImage} src={ownerSignature.image} />
                ) : (
                  <View style={{ height: 40 }} />
                )}
                <View style={styles.signatureLine}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{s(ownerSignature.signerName || business.name)}</Text>
                  <Text style={{ fontSize: 7, color: '#6B7280' }}>{t.authorizedSignature}</Text>
                </View>
              </View>
            )}

            {clientSignature && (
              <View style={[styles.signatureBox, { marginLeft: 40 }]}>
                {clientSignature.image ? (
                  <Image style={styles.signatureImage} src={clientSignature.image} />
                ) : (
                  <View style={{ height: 40 }} />
                )}
                <View style={styles.signatureLine}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{s(clientSignature.signerName || client.name)}</Text>
                  <Text style={{ fontSize: 7, color: '#6B7280' }}>{t.authorizedSignature}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* WATERMARK FOR FREE PLAN */}
        {plan === 'free' && (
          <View fixed style={{
            position: 'absolute',
            bottom: 300,
            left: 100,
            opacity: 0.1,
            transform: 'rotate(-45deg)',
          }}>
            <Text style={{ fontSize: 60, color: 'grey', fontWeight: 'bold' }}>Created with InvoiceCraft</Text>
          </View>
        )}

        <Text style={styles.footer} fixed>{t.footer}</Text>
      </Page>
    </Document>
  );
};
