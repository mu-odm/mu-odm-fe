'use client';

import { Order, useOrder } from "@/api/user/useOrder";
import PurchaseCollapse from "@/components/purchase_collapse";
import RouteBackButton from "@/components/route_back_button";
import type { Purchase } from "@/api/user/useOrder";

interface OrderProps {
    params: {
        orderID: string;
    };
}

export default function Purchase({ params }: OrderProps) {
    const { orderID } = params;
    const { data: orders, isLoading, error } = useOrder();

    const order = orders?.find((order: Order) => order.id === orderID);
    const purchases = order?.purchases;

    return (
        <div>
            <div className="flex flex-row items-center gap-3">
                <RouteBackButton/>
                <h1>Purchases in Order: {orderID}</h1>
            </div>
            
            <div className="flex flex-col gap-3 my-5">
                {purchases?.map((purchase: Purchase) => {
                    return (
                        <div key={purchase.id} className="   ">
                            <PurchaseCollapse purchase={purchase} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
