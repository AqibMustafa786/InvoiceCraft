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

export const ElectricalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.electrical) return null;
    const { electrical } = invoice;
    const hasDetails = Object.values(electrical).some(val => val !== null && val !== '');
    if (!hasDetails) return null;

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.electricalServiceDetails || 'Electrical Service Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {electrical.serviceType && <p><span className="font-semibold text-gray-600">{t.serviceType || 'Service Type'}:</span> {electrical.serviceType}</p>}
                {electrical.voltage && <p><span className="font-semibold text-gray-600">{t.voltage || 'Voltage'}:</span> {electrical.voltage}</p>}
                {electrical.fixtureDevice && <p><span className="font-semibold text-gray-600">{t.fixtureDevice || 'Fixture/Device'}:</span> {electrical.fixtureDevice}</p>}
                {electrical.permitCost && <p><span className="font-semibold text-gray-600">{t.permitCost || 'Permit Cost'}:</span> ${electrical.permitCost.toFixed(2)}</p>}
            </div>
        </section>
    );
};
