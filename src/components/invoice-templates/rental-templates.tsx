
'use client';

import React from 'react';
import type { Invoice, LineItem } from '@/lib/types';
import { format, isValid } from 'date-fns';

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

export const RentalDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.rental) return null;
    const { rental } = invoice;
    const hasDetails = Object.values(rental).some(val => val !== null && val !== '');
    if (!hasDetails) {
        return (
            <section className="my-4 text-xs">
                <p className="font-bold text-gray-500 mb-2 border-b">{t.rentalDetails || 'Rental Details'}</p>
            </section>
        )
    }

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.rentalDetails || 'Rental Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {rental.rentalItemName && <p className="col-span-full"><span className="font-semibold text-gray-600">{t.itemRented || 'Item'}:</span> {rental.rentalItemName}</p>}
                {rental.rentalStartDate && <p><span className="font-semibold text-gray-600">{t.rentalStart || 'Start'}:</span> {safeFormat(rental.rentalStartDate, 'MM/dd/yyyy')}</p>}
                {rental.rentalEndDate && <p><span className="font-semibold text-gray-600">{t.rentalEnd || 'End'}:</span> {safeFormat(rental.rentalEndDate, 'MM/dd/yyyy')}</p>}
                {rental.dailyRate && <p><span className="font-semibold text-gray-600">{t.dailyRate || 'Daily Rate'}:</span> ${rental.dailyRate.toFixed(2)}</p>}
                {rental.hourlyRate && <p><span className="font-semibold text-gray-600">{t.hourlyRate || 'Hourly Rate'}:</span> ${rental.hourlyRate.toFixed(2)}</p>}
                {rental.numberOfDays && <p><span className="font-semibold text-gray-600">{t.days || 'Days'}:</span> {rental.numberOfDays}</p>}
                {rental.numberOfHours && <p><span className="font-semibold text-gray-600">{t.hours || 'Hours'}:</span> {rental.numberOfHours}</p>}
                {rental.securityDeposit && <p><span className="font-semibold text-gray-600">{t.securityDeposit || 'Deposit'}:</span> ${rental.securityDeposit.toFixed(2)}</p>}
                {rental.damageCharges && <p><span className="font-semibold text-gray-600">{t.damageCharges || 'Damages'}:</span> ${rental.damageCharges.toFixed(2)}</p>}
                {rental.deliveryFee && <p><span className="font-semibold text-gray-600">{t.deliveryFee || 'Delivery'}:</span> ${rental.deliveryFee.toFixed(2)}</p>}
                {rental.pickupFee && <p><span className="font-semibold text-gray-600">{t.pickupFee || 'Pickup'}:</span> ${rental.pickupFee.toFixed(2)}</p>}
            </div>
        </section>
    );
};
