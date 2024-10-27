"use client";

import type { Purchase } from "@/api/user/useOrder";
import { usePurchase } from "@/api/user/usePurchase";

interface PurchaseCollapseProps {
    purchase: Purchase;
}

const PurchaseCollapse: React.FC<PurchaseCollapseProps> = ({ purchase }) => {

    const { data: purchases, isLoading, error } = usePurchase();

    const purchaseData = purchases?.find((p: Purchase) => p.id === purchase.id);

    return (
        <div tabIndex={0} className="collapse collapse-arrow border-base-300 bg-base-200 border">
            <div className="collapse-title text-xl font-medium">Purchase ID: {purchase.id}</div>
            <div className="collapse-content">
                <p>Client ID: {purchaseData?.client_id}</p>
                <p>Created At: {purchaseData?.created_at}</p>
                <p>Purchase ID: {purchaseData?.id}</p>
                <p>Order ID: {purchaseData?.order_id}</p>
                <p>Created At: {purchase.created_at}</p>
            </div>
        </div>
    );
};

export default PurchaseCollapse;
