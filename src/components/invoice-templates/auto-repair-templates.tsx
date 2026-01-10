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

export const AutoRepairDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.autoRepair) return null;
    const { autoRepair } = invoice;
    
    // Check if there are any details to display. If not, don't render the section at all.
    const hasDetails = Object.values(autoRepair).some(val => val !== null && val !== '' && !(Array.isArray(val) && val.length === 0));
    if (!hasDetails) return null;
    
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.vehicleInformation || 'Vehicle Information'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {autoRepair.vehicleMake && <p><span className="font-semibold text-gray-600">{(t.vehicle || 'Vehicle')}:</span> {autoRepair.vehicleMake} {autoRepair.vehicleModel} ({autoRepair.year})</p>}
                {autoRepair.odometer && <p><span className="font-semibold text-gray-600">{(t.mileage || 'Mileage')}:</span> {autoRepair.odometer.toLocaleString()}</p>}
                {autoRepair.vin && <p className="col-span-full"><span className="font-semibold text-gray-600">VIN:</span> {autoRepair.vin}</p>}
                {autoRepair.licensePlate && <p><span className="font-semibold text-gray-600">{(t.licensePlate || 'Plate')}:</span> {autoRepair.licensePlate}</p>}
                {autoRepair.laborHours && <p><span className="font-semibold text-gray-600">{(t.laborHours || 'Labor Hours')}:</span> {autoRepair.laborHours}</p>}
                {autoRepair.laborRate && <p><span className="font-semibold text-gray-600">{(t.laborRate || 'Labor Rate')}:</span> ${autoRepair.laborRate.toFixed(2)}/hr</p>}
                {autoRepair.diagnosticFee && <p><span className="font-semibold text-gray-600">{(t.diagnosticFee || 'Diagnostic Fee')}:</span> ${autoRepair.diagnosticFee.toFixed(2)}</p>}
                {autoRepair.shopSupplyFee && <p><span className="font-semibold text-gray-600">{(t.shopSupplyFee || 'Shop Supply Fee')}:</span> ${autoRepair.shopSupplyFee.toFixed(2)}</p>}
                {autoRepair.towingFee && <p><span className="font-semibold text-gray-600">{(t.towingFee || 'Towing Fee')}:</span> ${autoRepair.towingFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};
