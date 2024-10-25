'use client';

import { useRouter } from "next/navigation";

export default function AllOrders() {

    const router = useRouter();

    const region = {
        id: 1,
        name: "North",
        num_orders: 10,
        route: "/admin/all_orders"
    }

    const regions = [
        region,
        region,
        region,
        region
    ]

    const routeHandler = (route: string, id: number) => {
        router.push(route + "/" + id);
    }

    return (
        <div className="flex flex-col h-[40rem] justify-between">  
            <div className="gap-4 flex flex-col">
                <div className="text-3xl">All Orders</div>
                <div className="gap-2 flex flex-col">
                    {
                        regions.map((region, index) => (
                            <div key={index} className="flex justify-between btn" onClick={() => routeHandler(region.route, region.id)}>
                                <div>{region.name} order: </div>
                                <div>{region.num_orders} in active</div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div>
                <div>Orders in active: num</div>
                <div>All shops in active: num</div>
            </div>
        </div>
    )
}