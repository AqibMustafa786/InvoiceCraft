'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';

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

export const HvacDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.hvac) return null;
    const { hvac } = invoice;
    const hasDetails = Object.values(hvac).some(val => val !== null && val !== '');

    if (!hasDetails) return null;

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.hvacSpecifications || 'HVAC Specifications'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {hvac.unitType && <p><span className="font-semibold text-gray-600">{t.unitType || 'Unit Type'}:</span> {hvac.unitType}</p>}
                {hvac.modelNumber && <p><span className="font-semibold text-gray-600">{t.modelNo || 'Model #'}:</span> {hvac.modelNumber}</p>}
                {hvac.refrigerantType && <p><span className="font-semibold text-gray-600">{t.refrigerant || 'Refrigerant'}:</span> {hvac.refrigerantType}</p>}
                {hvac.maintenanceFee && <p><span className="font-semibold text-gray-600">{t.maintenanceFee || 'Maintenance Fee'}:</span> ${hvac.maintenanceFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};
