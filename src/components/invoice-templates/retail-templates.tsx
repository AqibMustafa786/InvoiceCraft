
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

export const RetailDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.retail) return null;
    const { retail } = invoice;
    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.productDetails || 'Product Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <p><span className="font-semibold text-gray-600">{t.sku || 'SKU'}:</span> {retail.sku}</p>
                <p><span className="font-semibold text-gray-600">{t.productCategory || 'Category'}:</span> {retail.productCategory}</p>
                <p><span className="font-semibold text-gray-600">{t.unitOfMeasure || 'Unit'}:</span> {retail.unitOfMeasure}</p>
                <p><span className="font-semibold text-gray-600">{t.batchNumber || 'Batch #'}:</span> {retail.batchNumber}</p>
                {retail.stockQuantity && <p><span className="font-semibold text-gray-600">{t.stockQuantity || 'Stock'}:</span> {retail.stockQuantity}</p>}
                {retail.wholesalePrice && <p><span className="font-semibold text-gray-600">{t.wholesalePrice || 'Wholesale'}:</span> ${retail.wholesalePrice.toFixed(2)}</p>}
                {retail.shippingPalletCost && <p><span className="font-semibold text-gray-600">{t.palletCost || 'Pallet Cost'}:</span> ${retail.shippingPalletCost.toFixed(2)}</p>}
            </div>
        </section>
    );
};
