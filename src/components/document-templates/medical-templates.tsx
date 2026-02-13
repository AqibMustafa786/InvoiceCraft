
'use client';

import React from 'react';
import type { Estimate, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';

interface TemplateProps {
    document: Estimate;
    pageItems: LineItem[];
    pageIndex: number;
    totalPages: number;
    style: React.CSSProperties;
    t: any;
}

const currencySymbols: { [key: string]: string } = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: '₨' };

const safeFormat = (date: Date | string | number | undefined | null, formatString: string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

const SignatureDisplay = ({ signature, label }: { signature: any, label: string }) => {
    if (!signature?.image) return null;
    return (
        <div className="mt-8">
            <Image src={signature.image} alt={label} width={150} height={75} className="border-b border-gray-400" />
            <p className="text-xs text-gray-500 pt-1 border-t-2 border-gray-700 w-[150px]">{label}</p>
        </div>
    )
}

export const MedicalDetails: React.FC<{ document: Estimate, t: any }> = ({ document, t }) => {
    if (!document.medical) return null;
    const { medical } = document;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.patientInformation || 'Patient Information'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.patientName || 'Patient'}:</span> {medical.patientName}</p>
                <p><span className="font-semibold text-gray-600">{t.patientId || 'Patient ID'}:</span> {medical.patientId}</p>
                <p><span className="font-semibold text-gray-600">{t.visitDate || 'Visit Date'}:</span> {safeFormat(medical.visitDate, 'MM/dd/yyyy')}</p>
                <p><span className="font-semibold text-gray-600">{t.physician || 'Physician'}:</span> {medical.physicianName}</p>
                <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {medical.serviceType}</p>
                <p><span className="font-semibold text-gray-600">{t.cptCode || 'CPT'}:</span> {medical.cptCode}</p>
                <p><span className="font-semibold text-gray-600">{t.icdCode || 'ICD-10'}:</span> {medical.icdCode}</p>
                {medical.copayAmount && <p><span className="font-semibold text-gray-600">{t.copay || 'Copay'}:</span> ${medical.copayAmount.toFixed(2)}</p>}
                {medical.labFee && <p><span className="font-semibold text-gray-600">{t.labFee || 'Lab Fee'}:</span> ${medical.labFee.toFixed(2)}</p>}
                {medical.medicationCharges && <p><span className="font-semibold text-gray-600">{t.medication || 'Medication'}:</span> ${medical.medicationCharges.toFixed(2)}</p>}
            </div>
        </section>
    );
};

// Template 1: Caduceus (Based on user-provided image)
export const MedicalTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? t.quote || 'Quote' : t.estimate || 'Estimate';


    return (
        <div className={`p-10 font-sans relative ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <div className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-5" style={{ backgroundImage: `url("https://storage.googleapis.com/studio-hosting-assets/invoice-template-previews/medical-watermark.svg")` }}></div>

            <div className="relative z-10">
                <header className="mb-8">
                    <div className="w-full h-2 mb-8" style={{ backgroundColor: style.color }}></div>
                    <h1 className="text-3xl font-bold">{t.medicalInvoice || 'Medical Invoice'}</h1>
                </header>

                <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                    <div>
                        <p className="font-bold mb-2 border-b pb-1" style={{ borderColor: style.color }}>{t.patientInformation || 'Patient Information'}</p>
                        <p className="font-bold">{client.name}</p>
                        <p>{client.phone}</p>
                        <p className="whitespace-pre-line">{client.address}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold mb-2 border-b pb-1" style={{ borderColor: style.color }}>{t.prescribingPhysician || "Prescribing Physician's Information"}</p>
                        <p className="font-bold">{business.name}</p>
                        <p>{business.phone}</p>
                        <p className="whitespace-pre-line">{business.address}</p>
                    </div>
                </section>

                <section className="grid grid-cols-4 gap-4 text-xs text-center mb-8 p-3 bg-gray-100 rounded-md">
                    <div><p className="font-bold text-gray-500">{(t.invoiceNo || 'INVOICE NUMBER').toUpperCase()}</p><p className="mt-1">{document.estimateNumber}</p></div>
                    <div><p className="font-bold text-gray-500">{(t.date || 'DATE').toUpperCase()}</p><p className="mt-1">{safeFormat(document.estimateDate, 'dd/MM/yy')}</p></div>
                    <div><p className="font-bold text-gray-500">{(t.dueDate || 'INVOICE DUE DATE').toUpperCase()}</p><p className="mt-1">{safeFormat(document.validUntilDate, 'dd/MM/yy')}</p></div>
                    <div><p className="font-bold text-gray-500">{(t.price || 'PRICE').toUpperCase()}</p><p className="mt-1 font-bold">{currencySymbol}{summary.grandTotal.toFixed(2)}</p></div>
                </section>

                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead style={{ backgroundColor: style.color }} className="text-white">
                            <tr>
                                <th className="p-2 font-bold w-2/5">{(t.item || 'ITEM').toUpperCase()}</th>
                                <th className="p-2 font-bold w-2/5">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                                <th className="p-2 font-bold text-right">{(t.price || 'PRICE').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2 text-xs">{item.name}</td>
                                    <td className="p-2 text-xs">{item.description}</td>
                                    <td className="p-2 text-right text-xs">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>

                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8">
                        <div className="flex justify-between items-start">
                            <div className="w-1/3 text-xs p-4 bg-gray-50 rounded-md">
                                <p className="font-bold" style={{ color: style.color }}>{t.notes || 'Notes'}</p>
                                <p className="mt-1">{document.termsAndConditions}</p>
                            </div>
                            <div className="w-1/3 text-right text-xs space-y-2">
                                <p className="grid grid-cols-2"><span className="font-bold">{(t.subtotal || 'SUBTOTAL').toUpperCase()}</span> <span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                                {summary.discount > 0 && <p className="grid grid-cols-2"><span className="font-bold text-red-600">{(t.discount || 'DISCOUNT').toUpperCase()}</span> <span className="text-red-600">-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                                {summary.shippingCost > 0 && <p className="grid grid-cols-2"><span className="font-bold">{(t.shipping || 'SHIPPING').toUpperCase()}</span> <span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                                <p className="grid grid-cols-2"><span className="font-bold">{(t.taxRate || 'TAX RATE').toUpperCase()}</span> <span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                                <p className="grid grid-cols-2 mt-2 pt-2 border-t-2 font-bold text-lg" style={{ borderColor: style.color }}><span style={{ color: style.color }}>{(t.total || 'TOTAL').toUpperCase()}</span> <span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
}

// Template 2: Vitality
export const MedicalTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? t.quote || 'Quote' : t.estimate || 'Estimate';

    return (
        <div className={`p-10 font-serif bg-gray-50 ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold">{business.name}</h1>
            </header>
            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div><p className="font-bold">{t.patient || 'Patient'}:</p><p>{client.name}</p><p>{client.address}</p></div>
                <div className="text-right"><p><strong>{docTitle} #:</strong> {document.estimateNumber}</p><p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p></div>
            </section>
            <MedicalDetails document={document} t={t} />
            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs bg-white">
                    <thead><tr className="bg-gray-200"><th className="p-2 font-semibold w-2/5">{t.serviceDate || 'Service Date'}</th><th className="p-2 font-semibold w-3/5">{t.procedure || 'Procedure'}</th><th className="p-2 font-semibold text-right">{t.charge || 'Charge'}</th></tr></thead>
                    <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{safeFormat(document.medical?.visitDate, 'MM/dd/yyyy')}</td><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/3">
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between border-b pb-1"><span>{t.adjustments || 'Adjustments'}:</span><span>{currencySymbol}{(summary.taxAmount > 0 ? summary.taxAmount.toFixed(2) : '0.00')}</span></p>
                            <p className="flex justify-between font-bold mt-2"><span>{t.total || 'Total'}:</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}

// Template 3: Clinic
export const MedicalTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = t.statement || 'STATEMENT';

    return (
        <div className={`flex ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <div className="w-1/3 p-8 text-white" style={{ backgroundColor: style.color || '#1E40AF' }}>
                <h1 className="text-3xl font-bold">{docTitle.toUpperCase()}</h1>
                <div className="mt-10 text-xs space-y-4">
                    <div><p className="opacity-70">{t.statementDate || 'Statement Date'}</p><p>{safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p></div>
                    <div><p className="opacity-70">{t.validUntil || 'Valid Until'}</p><p>{safeFormat(document.validUntilDate, 'MM/dd/yyyy')}</p></div>
                    <div><p className="opacity-70">{t.accountNo || 'Account #'}</p><p>{document.medical?.patientId || document.estimateNumber}</p></div>
                </div>
            </div>
            <div className="w-2/3 p-10">
                <header className="text-right mb-10"><h2 className="text-2xl font-bold">{business.name}</h2><p className="text-xs">{business.address}</p></header>
                <section className="mb-10 text-sm"><p className="font-bold">{t.to || 'To'}:</p><p>{client.name}</p></section>
                <MedicalDetails document={document} t={t} />
                <main className="flex-grow mt-4">
                    <table className="w-full text-left text-xs">
                        <thead><tr className="bg-gray-100"><th className="p-2 font-bold w-4/5">{t.description || 'Description'}</th><th className="p-2 font-bold text-right">{t.amount || 'Amount'}</th></tr></thead>
                        <tbody>{pageItems.map(item => (<tr key={item.id} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td></tr>))}</tbody>
                    </table>
                </main>
                {pageIndex === totalPages - 1 && (
                    <footer className="mt-auto pt-8">
                        <div className="text-right text-xl font-bold">{t.total || 'Total'}: {currencySymbol}{summary.grandTotal.toFixed(2)}</div>
                    </footer>
                )}
            </div>
        </div>
    );
};
// Template 4: Wellness
export const MedicalTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? t.quote || 'Quote' : t.estimate || 'Estimate';

    return (
        <div className={`p-10 font-sans ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', borderTop: `10px solid ${style.color}`, backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <div className="text-xs text-muted-foreground">
                        <p className="whitespace-pre-line">{business.address}</p>
                        <p>{business.phone} | {business.email}</p>
                        {business.website && <p>{business.website}</p>}
                    </div>
                </div>
                <h2 className="text-3xl font-light text-gray-500">{docTitle.toUpperCase()}</h2>
            </header>
            <section className="grid grid-cols-2 gap-8 text-sm mb-8">
                <div>
                    <p className="font-bold">{t.patient || 'Patient'}:</p>
                    <p>{client.name}</p>
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                </div>
                <div className="text-right">
                    <p><strong>{docTitle} #:</strong> {document.estimateNumber}</p>
                    <p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MMMM d, yyyy')}</p>
                    <p><strong>{t.validUntil || 'Valid Until'}:</strong> {safeFormat(document.validUntilDate, 'MMMM d, yyyy')}</p>
                </div>
            </section>

            <MedicalDetails document={document} t={t} />

            <main className="flex-grow mt-4">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="pb-2 font-bold w-2/5">{(t.description || 'Description')}</th>
                            <th className="pb-2 font-bold w-1/5 text-center">{(t.quantity || 'Quantity')}</th>
                            <th className="pb-2 font-bold text-right w-1/5">{(t.unitPrice || 'Unit Price')}</th>
                            <th className="pb-2 font-bold text-right w-1/5">{(t.amount || 'Amount')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="py-2">
                                    <p className="font-semibold whitespace-pre-line">{item.name}</p>
                                    {item.description && <p className="text-xs text-muted-foreground whitespace-pre-line">{item.description}</p>}
                                </td>
                                <td className="py-2 text-center">{item.quantity}</td>
                                <td className="py-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-right">
                        <div className="w-1/3 text-sm">
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.adjustments || 'Adjustments'}</span><span>{currencySymbol}{(summary.taxAmount > 0 ? summary.taxAmount.toFixed(2) : '0.00')}</span></p>
                            <p className="flex justify-between font-bold mt-2"><span>{t.totalDue || 'Total Due'}</span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                    <div className="text-xs mt-8">
                        <p className="font-bold">{t.paymentInstructions || 'Payment Instructions'}:</p>
                        <p className="text-muted-foreground whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                        <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || 'Client Signature'} />
                    </div>
                </footer>
            )}
        </div>
    );
};
// Template 5: Remedy
export const MedicalTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, textColor } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? t.quote || 'Quote' : t.estimate || 'Estimate';

    return (
        <div className={`p-8 font-serif ${pageIndex < totalPages - 1 ? 'page-break-after' : ''}`} style={{ minHeight: '1056px', backgroundColor: document.backgroundColor, color: textColor }}>
            <header className="text-center mb-10">
                {business.logoUrl && <Image src={business.logoUrl} alt="Logo" width={90} height={45} className="object-contain mx-auto mb-2" />}
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <div className="text-xs mt-1 text-gray-600" style={{ color: textColor ? `${textColor}B3` : undefined }}>
                    <p className="whitespace-pre-line">{business.address}</p>
                    <p>{business.phone} | {business.email}</p>
                    {business.website && <p>{business.website}</p>}
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 text-xs mb-8">
                <div>
                    <p className="font-bold">{t.billedTo || 'Billed To'}:</p>
                    <p>{client.name}</p>
                    {client.companyName && <p>{client.companyName}</p>}
                    <p className="whitespace-pre-line">{client.address}</p>
                    <p>{client.phone}</p>
                    <p>{client.email}</p>
                </div>
                <div className="text-right">

                    <p><strong>{docTitle} #:</strong> {document.estimateNumber}</p>
                    <p><strong>{t.date || 'Date'}:</strong> {safeFormat(document.estimateDate, 'MM/dd/yyyy')}</p>
                    <p><strong>{t.validUntil || 'Valid Until'}:</strong> {safeFormat(document.validUntilDate, 'MM/dd/yyyy')}</p>
                </div>
            </section>

            <MedicalDetails document={document} t={t} />

            <main className="flex-grow mt-4">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 font-bold w-[30%]">{(t.service || 'Service').toUpperCase()}</th>
                            <th className="p-2 font-bold w-[30%]">{(t.description || 'Description').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center">{(t.quantity || 'Qty').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.unitPrice || 'Unit Price').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right">{(t.charge || 'Charge').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2 font-semibold whitespace-pre-line">{item.name}</td>
                                <td className="p-2 text-xs text-muted-foreground whitespace-pre-line">{item.description}</td>
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end text-sm">
                        <div className="w-1/2">
                            <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                            {summary.discount > 0 && <p className="flex justify-between text-red-600"><span>{t.discount || 'Discount'}:</span><span>-{currencySymbol}{summary.discount.toFixed(2)}</span></p>}
                            {summary.shippingCost > 0 && <p className="flex justify-between"><span>{t.shipping || 'Other Fees'}:</span><span>{currencySymbol}{summary.shippingCost.toFixed(2)}</span></p>}
                            <p className="flex justify-between"><span>{t.tax || 'Tax'}:</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-xl mt-2" style={{ color: style.color }}><span>{t.pleaseRemit || 'Please Remit'}: </span><span>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></p>
                        </div>
                    </div>
                    <div className="text-xs mt-8">
                        <p className="font-bold">{t.paymentInstructions || 'Payment Instructions'}:</p>
                        <p className="text-muted-foreground whitespace-pre-line">{document.termsAndConditions}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <SignatureDisplay signature={document.business.ownerSignature} label={t.authorizedSignature || 'Authorized Signature'} />
                        <SignatureDisplay signature={document.clientSignature} label={t.clientSignature || 'Client Signature'} />
                    </div>
                </footer>
            )}
        </div>
    );
};
