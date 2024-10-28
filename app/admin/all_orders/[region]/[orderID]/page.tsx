'use client';

import { Order, useOrder } from "@/api/user/useOrder";
import PurchaseCollapse from "@/components/purchase_collapse";
import RouteBackButton from "@/components/route_back_button";
import type { Purchase } from "@/api/user/useOrder";
import { usePurchase } from "@/api/user/usePurchase";

interface OrderProps {
    params: {
        orderID: string;
    };
}

export default function Purchase({ params }: OrderProps) {
    const { orderID } = params;
    const { data: orders, isLoading: orderLoading, error: orderError } = useOrder();
    const { data: purchases, isLoading: purchaseLoading, error: purchaseError } = usePurchase();

    const order = orders?.find((order: Order) => order.id === orderID);
    const purchasesInOrder = purchases?.filter((purchase: Purchase) => purchase.orderID === orderID);

    return (
        <div>
            <div className="flex flex-row items-center gap-3">
                <RouteBackButton/>
                <h1>Purchases in Order: {orderID}</h1>
            </div>
            
            <div className="flex flex-col gap-3 my-5">
                {purchasesInOrder?.map((purchase: Purchase) => {
                    return (
                        <div key={purchase.id}>
                            <PurchaseCollapse purchase={purchase} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
