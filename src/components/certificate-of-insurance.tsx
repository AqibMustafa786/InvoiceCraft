
'use client';

import React from 'react';
import { format, isValid } from 'date-fns';
import NextImage from 'next/image';
import type { InsuranceDocument } from '@/lib/types';
import { Separator } from './ui/separator';

interface COIProps {
    document: InsuranceDocument;
}

const safeFormat = (date: any, formatString: string) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    if (!isValid(d)) return "Invalid Date";
    return format(d, formatString);
}

const Field: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className }) => (
    <div className={className}>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
    </div>
);

export const CertificateOfInsurance: React.FC<COIProps> = ({ document }) => {

    const { business, policyHolder, insuranceCompany, policyNumber, policyStartDate, policyEndDate, coverageAmount, id } = document;

    return (
        <div className="p-10 bg-white text-gray-800 font-serif">
            <header className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
                <div className="flex-1">
                    {business.logoUrl ? (
                         <NextImage src={business.logoUrl} alt={`${business.name} Logo`} width={120} height={60} className="object-contain mb-4" />
                    ): (
                        <h1 className="text-3xl font-bold text-gray-800">{business.name}</h1>
                    )}
                    <p className="text-xs text-gray-600 whitespace-pre-line max-w-xs">{business.address}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold text-gray-500 tracking-widest">CERTIFICATE OF INSURANCE</h2>
                    <p className="text-xs text-gray-500 mt-2">Doc ID: {id}</p>
                </div>
            </header>
            
            <section className="my-8 text-sm">
                <p>This certificate is issued as a matter of information only and confers no rights upon the certificate holder. This certificate does not amend, extend or alter the coverage afforded by the policies below.</p>
            </section>

            <section className="grid grid-cols-2 gap-8 my-8 text-sm">
                 <div>
                    <h3 className="font-bold text-lg mb-2 pb-1 border-b">Producer</h3>
                    <p>{insuranceCompany.name}</p>
                    <p className="text-xs text-gray-600 whitespace-pre-line">{insuranceCompany.address}</p>
                    <p className="text-xs text-gray-600">Agent: {insuranceCompany.agentName}</p>
                </div>
                 <div>
                    <h3 className="font-bold text-lg mb-2 pb-1 border-b">Insured</h3>
                    <p>{policyHolder.name}</p>
                     {policyHolder.companyName && <p>{policyHolder.companyName}</p>}
                    <p className="text-xs text-gray-600 whitespace-pre-line">{policyHolder.address}</p>
                </div>
            </section>
            
             <section className="my-8">
                <h3 className="font-bold text-lg mb-4 pb-1 border-b">Coverages</h3>
                <p className="text-xs text-gray-600 mb-4">This is to certify that the policies of insurance listed below have been issued to the insured named above for the policy period indicated. Notwithstanding any requirement, term or condition of any contract or other document with respect to which this certificate may be issued or may pertain, the insurance afforded by the policies described herein is subject to all the terms, exclusions and conditions of such policies.</p>
                
                <div className="border rounded-lg p-4 grid grid-cols-3 gap-6">
                    <Field label="Policy Type" value={document.policyType} />
                    <Field label="Policy Number" value={policyNumber} />
                    <Field label="Policy Effective Date" value={safeFormat(policyStartDate, 'MM/dd/yyyy')} />
                    <Field label="Policy Expiration Date" value={safeFormat(policyEndDate, 'MM/dd/yyyy')} />
                    <Field label="Sum Insured" value={`${document.currency} ${coverageAmount.toLocaleString()}`} />
                    <Field label="Deductible" value={`${document.currency} ${document.deductibleAmount.toLocaleString()}`} />
                    <div className="col-span-3">
                         <p className="text-xs text-gray-500 uppercase tracking-wider">Coverage Scope</p>
                         <p className="font-semibold text-sm whitespace-pre-line">{document.coverageScope}</p>
                    </div>
                </div>
            </section>

            <footer className="pt-8 mt-10 border-t text-xs text-gray-600">
                <div className="grid grid-cols-2 gap-8">
                     <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2 pb-1 border-b">Certificate Holder</h3>
                        <div className="w-full h-20 border border-dashed rounded-md flex items-center justify-center text-gray-400">
                            Additional Insured / Certificate Holder Information Area
                        </div>
                    </div>
                     <div className="text-right">
                        <h3 className="font-bold text-lg text-gray-800 mb-2 pb-1 border-b">Authorized Representative</h3>
                        <div className="flex flex-col items-end mt-10">
                            {business.ownerSignature ? (
                                <NextImage src={business.ownerSignature.image} alt="Signature" width={150} height={75} />
                            ) : (
                                 <div className="w-48 h-12 border-b"></div>
                            )}
                            <p className="mt-1">{business.ownerSignature?.signerName || business.name}</p>
                        </div>
                    </div>
                </div>
                 <Separator className="my-6" />
                 <p className="text-center text-gray-500">Should any of the above described policies be cancelled before the expiration date thereof, notice will be delivered in accordance with the policy provisions.</p>
            </footer>
        </div>
    );
}

