
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

export const ITFreelanceDetails: React.FC<{ document: Estimate, t: any }> = ({ document, t }) => {
    if (!document.itFreelance) return null;
    const { itFreelance } = document;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.projectSpecifications || 'Project Specifications'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.projectType || 'Project Type'}:</span> {itFreelance.projectType}</p>
                <p><span className="font-semibold text-gray-600">{t.designStyle || 'Design Style'}:</span> {itFreelance.designStyle}</p>
                {itFreelance.pagesScreensCount && <p><span className="font-semibold text-gray-600">{t.pagesScreens || 'Pages/Screens'}:</span> {itFreelance.pagesScreensCount}</p>}
                {itFreelance.revisionsIncluded && <p><span className="font-semibold text-gray-600">{t.revisions || 'Revisions'}:</span> {itFreelance.revisionsIncluded}</p>}
                <p className="col-span-full"><span className="font-semibold text-gray-600">{t.timeline || 'Timeline'}:</span> {itFreelance.deliveryTimeline}</p>
                <div className="col-span-full mt-2">
                    <p className="font-semibold text-gray-600">{t.scope || 'Scope'}:</p>
                    <p className="whitespace-pre-line pl-2">{itFreelance.scopeOfWork}</p>
                </div>
                <div className="col-span-full mt-2">
                    <p className="font-semibold text-gray-600">{t.features || 'Features'}:</p>
                    <p className="whitespace-pre-line pl-2">{itFreelance.featuresNeeded}</p>
                </div>
                <div className="col-span-full mt-2">
                    <p className="font-semibold text-gray-600">{t.integrations || 'Integrations'}:</p>
                    <p className="whitespace-pre-line pl-2">{itFreelance.integrations}</p>
                </div>
            </div>
        </section>
    );
};


// Template 1: Tech Corporate (Based on user image)
export const ITTemplate1: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency } = document;
    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className={`p-10 bg-white font-sans text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ fontFamily: style.fontFamily, fontSize: `${style.fontSize}pt`, minHeight: '1056px' }}>
            <header className="flex justify-between items-start pb-5 mb-5">
                <div className="flex items-center gap-4">
                    {business.logoUrl ?
                        <Image src={business.logoUrl} alt="Logo" width={50} height={50} className="object-contain" /> :
                        <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                    }
                    <div>
                        <h1 className="text-3xl font-bold">{business.name}</h1>
                        <p className="text-xs text-gray-500">{business.address} • {business.phone}</p>
                        <p className="text-xs text-blue-600">{business.email}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-extrabold">{currencySymbol}{summary.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-sm font-bold text-gray-500 tracking-wider">{(t.totalCost || 'TOTAL COST').toUpperCase()}</p>
                </div>
            </header>

            <section className="mb-8 p-4 bg-gray-50 rounded-md text-xs">
                <p className="font-bold text-gray-400 tracking-widest mb-2">{(t.projectInformation || 'PROJECT INFORMATION').toUpperCase()}</p>
                <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-1">
                    <span className="text-gray-600">{t.projectName || 'PROJECT NAME'}:</span><span className="font-semibold">{document.projectTitle}</span>
                    <span className="text-gray-600">{t.location || 'LOCATION'}:</span><span className="font-semibold">{client.projectLocation}</span>
                    <span className="text-gray-600">{t.contactPerson || 'CONTACT PERSON'}:</span><span className="font-semibold">{client.name}</span>
                    <span className="text-gray-600">{t.estimator || 'ESTIMATOR'}:</span><span className="font-semibold">{business.name}</span>
                    <span className="text-gray-600">{t.estimationDate || 'ESTIMATION DATE'}:</span><span className="font-semibold">{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</span>
                </div>
            </section>

            <ITFreelanceDetails document={document} t={t} />

            <main className="flex-grow">
                <p className="font-bold text-gray-400 tracking-widest mb-2 text-xs">{(t.costEstimate || 'COST ESTIMATE').toUpperCase()}</p>
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-1/2">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="py-2 font-bold text-center">{(t.quantity || 'QUANTITY').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.unitPrice || 'UNIT PRICE').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="py-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8 flex justify-between items-end text-xs">
                    <div className="space-y-4">
                        <div>
                            <p className="font-bold text-gray-400 tracking-widest mb-2">{(t.notes || 'NOTES').toUpperCase()}</p>
                            <p className="text-gray-600 whitespace-pre-line w-96">{document.termsAndConditions}</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-400 tracking-widest mb-2">{(t.clientInformation || 'CLIENT INFORMATION').toUpperCase()}</p>
                            <p><span className="text-gray-600 w-20 inline-block">{t.client || 'CLIENT'}:</span> <span className="font-semibold">{client.name}</span></p>
                            <p><span className="text-gray-600 w-20 inline-block">{t.address || 'ADDRESS'}:</span> <span className="font-semibold">{client.address}</span></p>
                            <p><span className="text-gray-600 w-20 inline-block">{t.contact || 'CONTACT'}:</span> <span className="font-semibold">{client.phone}</span></p>
                            <p><span className="text-gray-600 w-20 inline-block">{t.email || 'EMAIL'}:</span> <span className="font-semibold">{client.email}</span></p>
                        </div>
                    </div>
                    <div className="text-right">
                        <SignatureDisplay signature={document.business.ownerSignature} label={business.name} />
                        <p className="text-lg font-bold mt-4" style={{ fontFamily: 'cursive' }}>{t.thankYou || 'Thank you!'}</p>
                        <p className="text-[8px] text-gray-500 mt-2 max-w-[250px]">{t.thankYouMessage || 'Thank you for considering IT Solutions Inc. for your project needs. We look forward to the opportunity to work together and deliver exceptional results.'}</p>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 2: Modern Dark Mode
export const ITTemplate2: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-10 bg-gray-900 text-gray-200 font-['Roboto_Mono',_monospace] flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-4xl font-bold" style={{ color: style.color || '#4C1D95' }}>{business.name}</h1>
                    <p className="text-xs text-gray-400">{t.softwareAndITSolutions || 'Software & IT Solutions'}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light text-gray-400">{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm text-gray-400">{category}</p>}
                </div>
            </header>

            <section className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div><p className="font-bold text-gray-500 mb-1">{(t.projectFor || 'PROJECT FOR').toUpperCase()}:</p><p className="font-medium">{client.name}</p><p className="text-gray-400">{client.address}</p></div>
                <div className="text-right"><p className="font-bold text-gray-500 mb-1">{(t.date || 'DATE').toUpperCase()}:</p><p>{safeFormat(document.estimateDate, 'MM-dd-yyyy')}</p></div>
            </section>

            <ITFreelanceDetails document={document} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="py-2 font-semibold w-1/2 text-gray-400">{(t.service || 'SERVICE').toUpperCase()}</th>
                            <th className="py-2 font-semibold text-center text-gray-400">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="py-2 font-semibold text-right text-gray-400">{(t.rate || 'RATE').toUpperCase()}</th>
                            <th className="py-2 font-semibold text-right text-gray-400">{(t.total || 'TOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-800">
                                <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="py-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <div className="w-2/5 text-sm space-y-1">
                            <div className="flex justify-between"><span className="text-gray-400">{t.subtotal || 'Subtotal'}:</span><span>{currencySymbol}{summary.subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">{t.tax || 'Tax'} ({summary.taxPercentage}%):</span><span>{currencySymbol}{summary.taxAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-600"><span>{t.estimateTotal || 'Total Estimate'}:</span><span style={{ color: style.color || '#4C1D95' }}>{currencySymbol}{summary.grandTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

// Template 3: Minimalist Grid
export const ITTemplate3: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-12 bg-white font-['Inter',_sans-serif] text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-extrabold tracking-tighter">{docTitle}</h2>
                    {category !== 'Generic' && <p className="text-sm">{category}</p>}
                </div>
            </header>

            <section className="grid grid-cols-4 gap-4 mb-10 text-xs">
                <div><p className="font-bold text-gray-500 mb-1">{t.to || 'To'}</p><p>{client.name}</p></div>
                <div><p className="font-bold text-gray-500 mb-1">{t.estimateNo || 'Estimate #'}</p><p>{document.estimateNumber}</p></div>
                <div><p className="font-bold text-gray-500 mb-1">{t.date || 'Date'}</p><p>{safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p></div>
                <div><p className="font-bold text-gray-500 mb-1">{t.project || 'Project'}</p><p>{document.projectTitle}</p></div>
            </section>

            <ITFreelanceDetails document={document} t={t} />

            <main className="flex-grow">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr>
                            <th className="p-2 font-bold w-3/5 border-b-2 border-gray-300">{(t.item || 'ITEM').toUpperCase()}</th>
                            <th className="p-2 font-bold text-center border-b-2 border-gray-300">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right border-b-2 border-gray-300">{(t.price || 'PRICE').toUpperCase()}</th>
                            <th className="p-2 font-bold text-right border-b-2 border-gray-300">{(t.amount || 'AMOUNT').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id}>
                                <td className="p-2 border-b border-gray-100 whitespace-pre-line">{item.name}</td>
                                <td className="p-2 border-b border-gray-100 text-center">{item.quantity}</td>
                                <td className="p-2 border-b border-gray-100 text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="p-2 border-b border-gray-100 text-right">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8">
                    <div className="flex justify-end">
                        <table className="w-1/3 text-xs">
                            <tbody>
                                <tr><td className="py-1 text-gray-500">{t.subtotal || 'Subtotal'}</td><td className="py-1 text-right">{currencySymbol}{summary.subtotal.toFixed(2)}</td></tr>
                                <tr className="border-b"><td className="py-1 text-gray-500">{t.tax || 'Tax'}</td><td className="py-1 text-right">{currencySymbol}{summary.taxAmount.toFixed(2)}</td></tr>
                                <tr className="font-bold text-base"><td className="pt-2">{(t.total || 'TOTAL').toUpperCase()}</td><td className="pt-2 text-right">{currencySymbol}{summary.grandTotal.toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </footer>
            )}
        </div>
    );
};


// Template 4: Creative Blue
export const ITTemplate4: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`bg-white font-sans text-gray-800 flex ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <div className="w-1/3 p-8 text-white flex flex-col" style={{ backgroundColor: style.color || '#1D4ED8' }}>
                <h1 className="text-4xl font-bold mb-10">{docTitle}</h1>
                <div className="text-sm space-y-6 flex-grow">
                    <div>
                        <p className="font-bold opacity-80 mb-1">{(t.client || 'CLIENT').toUpperCase()}</p>
                        <p className="font-bold text-lg">{client.name}</p>
                        <p>{client.address}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">{(t.project || 'PROJECT').toUpperCase()}</p>
                        <p>{document.projectTitle}</p>
                    </div>
                    <div>
                        <p className="font-bold opacity-80 mb-1">{(t.reference || 'REFERENCE').toUpperCase()}</p>
                        <p>#{document.estimateNumber}</p>
                        <p>{t.date || 'Date'}: {safeFormat(document.estimateDate, 'yyyy-MM-dd')}</p>
                    </div>
                </div>
                {pageIndex === totalPages - 1 && (
                    <div className="mt-auto text-sm">
                        <p className="font-bold opacity-80 mb-2">{(t.totalEstimate || 'TOTAL ESTIMATE').toUpperCase()}</p>
                        <p className="text-4xl font-extrabold">{currencySymbol}{summary.grandTotal.toFixed(2)}</p>
                    </div>
                )}
            </div>
            <div className="w-2/3 p-10 flex flex-col">
                <header className="mb-8 text-right">
                    <h2 className="text-3xl font-bold">{business.name}</h2>
                    <p className="text-xs text-gray-500">{business.address}</p>
                </header>
                <ITFreelanceDetails document={document} t={t} />
                <main className="flex-grow">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b-2 border-gray-300">
                            <tr>
                                <th className="py-2 font-bold w-1/2">{(t.serviceItem || 'SERVICE/ITEM').toUpperCase()}</th>
                                <th className="py-2 font-bold text-center">{(t.quantity || 'QTY').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.rate || 'RATE').toUpperCase()}</th>
                                <th className="py-2 font-bold text-right">{(t.total || 'TOTAL').toUpperCase()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
                                    <td className="py-2 align-top text-center">{item.quantity}</td>
                                    <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                    <td className="py-2 align-top text-right font-medium">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    );
};

// Template 5: Startup Vibe
export const ITTemplate5: React.FC<TemplateProps> = ({ document, pageItems, pageIndex, totalPages, style, t }) => {
    const { business, client, summary, currency, category } = document;
    const currencySymbol = currencySymbols[currency] || '$';
    const docTitle = document.documentType === 'quote' ? (t.quote || 'QUOTE').toUpperCase() : (t.estimate || 'ESTIMATE').toUpperCase();

    return (
        <div className={`p-10 bg-gray-50 font-['Inter',_sans-serif] text-gray-800 flex flex-col ${pageIndex < totalPages - 1 ? "page-break-after" : ""}`} style={{ minHeight: '1056px' }}>
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tighter">{business.name}</h1>
                    <p className="text-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-extrabold tracking-tighter text-gray-400">{docTitle}</p>
                    {category !== 'Generic' && <p className="text-xs text-gray-400">{category}</p>}
                </div>
            </header>

            <section className="grid grid-cols-2 gap-4 text-xs mb-8">
                <div>
                    <p className="text-gray-500">{t.to || 'To'}:</p>
                    <p className="font-bold">{client.name}</p>
                    <p className="text-gray-600">{client.address}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-500">{t.estimate || 'Estimate'} <span className="font-mono text-black">#{document.estimateNumber}</span></p>
                    <p className="text-gray-500">{t.date || 'Date'}: <span className="font-mono text-black">{safeFormat(document.estimateDate, 'dd.MM.yyyy')}</span></p>
                </div>
            </section>

            <ITFreelanceDetails document={document} t={t} />

            <main className="flex-grow bg-white p-4 rounded-lg shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 font-bold w-3/5 text-gray-500">{(t.description || 'DESCRIPTION').toUpperCase()}</th>
                            <th className="py-2 font-bold text-center text-gray-500">{(t.quantity || 'QTY').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right text-gray-500">{(t.price || 'PRICE').toUpperCase()}</th>
                            <th className="py-2 font-bold text-right text-gray-500">{(t.total || 'TOTAL').toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-2 align-top whitespace-pre-line">{item.name}</td>
                                <td className="py-2 align-top text-center">{item.quantity}</td>
                                <td className="py-2 align-top text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 align-top text-right font-semibold">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            {pageIndex === totalPages - 1 && (
                <footer className="mt-auto pt-8 flex justify-end">
                    <div className="w-1/3 text-sm space-y-1">
                        <p className="flex justify-between"><span>{t.subtotal || 'Subtotal'}</span><span className="font-mono">{currencySymbol}{summary.subtotal.toFixed(2)}</span></p>
                        <p className="flex justify-between"><span>{t.tax || 'Tax'}</span><span className="font-mono">{currencySymbol}{summary.taxAmount.toFixed(2)}</span></p>
                        <p className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-black">
                            <span>{t.totalDue || 'Total Due'}</span>
                            <span className="font-mono">{currencySymbol}{summary.grandTotal.toFixed(2)}</span>
                        </p>
                    </div>
                </footer>
            )}
        </div>
    );
};
