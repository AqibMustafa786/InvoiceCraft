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

export const RetailDetails: React.FC<{ invoice: Invoice, t: any }> = ({ invoice, t }) => {
    if (!invoice.retail) return null;
    const { retail } = invoice;
    const hasDetails = Object.values(retail).some(val => val !== null && val !== '');
    if (!hasDetails) return null;

    return (
        <section className="my-4 text-xs">
            <p className="font-bold text-gray-500 mb-2 border-b">{t.productDetails || 'Product Details'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                {retail.sku && <p><span className="font-semibold text-gray-600">{t.sku || 'SKU'}:</span> {retail.sku}</p>}
                {retail.productCategory && <p><span className="font-semibold text-gray-600">{t.productCategory || 'Category'}:</span> {retail.productCategory}</p>}
                {retail.unitOfMeasure && <p><span className="font-semibold text-gray-600">{t.unitOfMeasure || 'Unit'}:</span> {retail.unitOfMeasure}</p>}
                {retail.batchNumber && <p><span className="font-semibold text-gray-600">{t.batchNumber || 'Batch #'}:</span> {retail.batchNumber}</p>}
                {retail.stockQuantity && <p><span className="font-semibold text-gray-600">{t.stockQuantity || 'Stock'}:</span> {retail.stockQuantity}</p>}
                {retail.wholesalePrice && <p><span className="font-semibold text-gray-600">{t.wholesalePrice || 'Wholesale'}:</span> ${retail.wholesalePrice.toFixed(2)}</p>}
                {retail.shippingPalletCost && <p><span className="font-semibold text-gray-600">{t.palletCost || 'Pallet Cost'}:</span> ${retail.shippingPalletCost.toFixed(2)}</p>}
            </div>
        </section>
    );
};
