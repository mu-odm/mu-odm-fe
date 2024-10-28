'use client';

import { Order, useGetOrder } from "@/api/user/useOrder";
import PurchaseCollapse from "@/components/purchase_collapse";
import RouteBackButton from "@/components/route_back_button";
import type { Purchase } from "@/api/user/useOrder";
import { usePurchase } from "@/api/user/usePurchase";
import LoadingAnimation from "@/components/loading_animation";

interface OrderProps {
    params: {
        orderID: string;
    };
}

export default function Purchase({ params }: OrderProps) {
    const { orderID } = params;
    const { data: purchases, isLoading: purchaseLoading, error: purchaseError } = usePurchase();
    const { data: orders, isLoading: orderLoading, error: orderError } = useGetOrder();

    const purchasesInOrder = purchases?.filter((purchase: Purchase) => purchase.orderID === orderID);
    const orderData = orders?.find((order: Order) => order.id === orderID);

    if (purchaseLoading || orderLoading) {
        return <LoadingAnimation/>
    }

    return (
        <div>
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-3">
                    <RouteBackButton/>
                    <h1>Purchases in Order: {orderID}</h1>
                </div>
                <h1>Status: <span className={
                    orderData?.status === "Available" ? "text-green-500" : "text-red-500"
                }>{orderData?.status}</span></h1>
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
