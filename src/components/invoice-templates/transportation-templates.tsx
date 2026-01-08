'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import Image from 'next/image';

interface PageProps {
  invoice: Invoice;
  pageItems: LineItem[];
  pageIndex: number;
  totalPages: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  balanceDue: number;
  t: any;
  currencySymbol: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

const safeFormat = (date: Date | string | number | null | undefined, formatString: string) => {
    if (!date) return "N/A";
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

export const TransportationDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.transportation) return null;
    const { transportation } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.shipmentDetails || 'Shipment Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.pickup || 'Pickup'}:</span> {transportation.pickupLocation}</p>
                <p><span className="font-semibold text-gray-600">{t.dropoff || 'Dropoff'}:</span> {transportation.dropoffLocation}</p>
                {transportation.milesDriven && <p><span className="font-semibold text-gray-600">{t.miles || 'Miles'}:</span> {transportation.milesDriven}</p>}
                {transportation.ratePerMile && <p><span className="font-semibold text-gray-600">{t.ratePerMile || 'Rate/Mile'}:</span> ${transportation.ratePerMile.toFixed(2)}</p>}
                {transportation.weight && <p><span className="font-semibold text-gray-600">{t.weight || 'Weight'}:</span> {transportation.weight}</p>}
                <p><span className="font-semibold text-gray-600">{t.loadType || 'Load Type'}:</span> {transportation.loadType}</p>
                {transportation.fuelSurcharge && <p><span className="font-semibold text-gray-600">{t.fuelSurcharge || 'Fuel Surcharge'}:</span> ${transportation.fuelSurcharge.toFixed(2)}</p>}
                {transportation.tollCharges && <p><span className="font-semibold text-gray-600">{t.tolls || 'Tolls'}:</span> ${transportation.tollCharges.toFixed(2)}</p>}
                {transportation.detentionFee && <p><span className="font-semibold text-gray-600">{t.detention || 'Detention'}:</span> ${transportation.detentionFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};
