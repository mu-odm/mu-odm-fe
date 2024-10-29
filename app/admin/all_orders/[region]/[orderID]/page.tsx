'use client';

import { Order, useGetOrder } from "@/api/user/useOrder";
import PurchaseCollapse from "@/components/purchase_collapse";
import RouteBackButton from "@/components/route_back_button";
import { PurchaseApproval, usePurchase } from "@/api/user/usePurchase";
import LoadingAnimation from "@/components/loading_animation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { Purchase } from "@/api/user/usePurchase";

interface OrderProps {
    params: {
        orderID: string;
    };
}

export default function Purchase({ params }: OrderProps) {
    const { orderID } = params;
    const { data: purchases, isLoading: purchaseLoading, error: purchaseError } = usePurchase();
    const { data: orders, isLoading: orderLoading, error: orderError } = useGetOrder();
    const [selectedStatus, setSelectedStatus] = useState<PurchaseApproval | undefined>(PurchaseApproval.Pending);

    const purchasesInOrder = purchases?.filter((purchase: Purchase) => purchase.orderID === orderID);
    const orderData = orders?.find((order: Order) => order.id === orderID);
    const filteredPurchases = selectedStatus
        ? purchasesInOrder?.filter((purchase: Purchase) => purchase.status === selectedStatus)
        : purchasesInOrder;

    if (purchaseLoading || orderLoading) {
        return <LoadingAnimation/>
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-3">
                    <RouteBackButton/>
                    <h1>Purchases in Order: {orderID}</h1>
                </div>
                <h1>Status: <span className={
                    orderData?.status === "Available" ? "text-green-500" : "text-red-500"
                }>{orderData?.status}</span></h1>
            </div>
            <Select
                    value={selectedStatus}
                    onValueChange={(value: PurchaseApproval) => setSelectedStatus(value)}
                >
                    <SelectTrigger id="order" className="h-full">
                        <SelectValue placeholder={selectedStatus} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value={PurchaseApproval.Approved}>Approved</SelectItem>
                        <SelectItem value={PurchaseApproval.Rejected}>Rejected</SelectItem>
                        <SelectItem value={PurchaseApproval.Pending}>Pending</SelectItem>
                    </SelectContent>
                </Select>
            <div className="flex flex-col gap-3 my-5">
                {filteredPurchases?.map((purchase: Purchase) => {
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
