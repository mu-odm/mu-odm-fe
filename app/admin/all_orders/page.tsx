'use client';

import useOrder from "@/api/user/useOrder";
import { useRouter } from "next/navigation";

export default function AllOrders() {

    const router = useRouter();

    const { data: orders, isLoading, error } = useOrder();

    const routeHandler = (route: string, id: number) => {
        router.push(route + "/" + id);
    }

    return (
        <div className="flex flex-col h-[40rem] justify-between">  
            <div className="gap-4 flex flex-col">
                <div className="text-3xl">All Orders</div>
                <div className="gap-2 flex flex-col">
                    {
                        orders && orders!.map((order: any) => (
                            <div key={order.id} className="flex justify-between">
                                <div>{order.purchase?.id}</div>
                                <div>{order.id}</div>
                                <div>{order.status}</div>
                                <div>{order.region}</div>
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