'use client';

import { Order, useOrder } from "@/api/user/useOrder";
import LoadingAnimation from "@/components/loading_animation";
import useRouteHandler from "@/lib/routeHandler";

export default function AllOrders() {

    const { data: orders, isLoading, error } = useOrder();
    const navigateToRoute = useRouteHandler();
    const uniqueRegions = orders ? Array.from(new Set(orders.map((order: Order) => order.region))) : [];

    if (isLoading) return (
        <LoadingAnimation/>
    )

    return (
        <div className="flex flex-col h-[40rem] justify-between">  
            <div className="gap-4 flex flex-col">
                <div className="text-3xl">All Orders</div>
                <div className="gap-2 flex flex-col">
                    {
                        uniqueRegions?.map((region: any) => (
                            <div key={region} className="flex justify-between btn" 
                                onClick={() => navigateToRoute(`/admin/all_orders`, region)}
                            >
                                <div className="flex flex-row gap-2 font-bold">
                                    <div>Region:</div>
                                    <div className="text-red-500">{region}</div>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <div>Orders in region:</div>
                                    <div>
                                        {orders?.filter((order: Order) => order.region === region).length}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div>
                <div>Orders in active: {
                    orders?.filter((order: Order) => order.status === "available").length
                }</div>
            </div>
        </div>
    )
}