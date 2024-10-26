'use client';

import RouteBackButton from "@/components/route_back_button";
import { useRouter } from "next/navigation";

interface RegionProps {
    params: {
        region: string;
    };
}

export default function Order({ params }: RegionProps) {
    const router = useRouter();
    const { region } = params;

    const this_region = {
        id: 1,
        name: 'north',
    };

    const orders = [
        { id: 1, status: "available", region: "north" },
        { id: 2, status: "available", region: "north" },
        { id: 3, status: "available", region: "north" },
        { id: 4, status: "available", region: "north" },
        { id: 5, status: "available", region: "north" },
    ];

    const routeHandler = (orderId: number) => {
        router.push(`/admin/all_orders/${region}/${orderId}`);
    };

    return (
        <div className="">
            <div className="flex flex-row items-center gap-3">
                <RouteBackButton/>
                <h1>Orders in Region: {region}</h1>
            </div>
            <div className="grid grid-cols-2 gap-2 my-5">
                {orders
                    .filter((order) => order.region === this_region.name)
                    .map((order) => (
                        <div key={order.id} className="btn flex flex-row justify-between" onClick={() => routeHandler(order.id)}>
                            <div>Order: {order.id}</div>
                            <div>Status: {order.status}</div>
               
                        </div>
                    ))}
            </div>
        </div>
    );
}
