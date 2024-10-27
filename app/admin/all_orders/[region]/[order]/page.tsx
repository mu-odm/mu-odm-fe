'use client';

import { PurchaseCollapse } from "@/components/purchase_collapse";
import RouteBackButton from "@/components/route_back_button";

interface OrderProps {
    params: {
        order: string;
    };
}

type PurchaseList = {
    product_ID: string;
    purchase_ID: string;
    amount: number;
    purchase: {
        id: string;
        order_ID: string;
        client_ID: string;
        created_at: string;
    };
};

export default function Purchase({ params }: OrderProps) {
    const { order } = params;

    const purchase_list: PurchaseList[] = [
        {
            product_ID: "1",
            purchase_ID: "1",
            amount: 10,
            purchase: {
                id: "1",
                order_ID: "1",
                client_ID: "1",
                created_at: "2021-10-10",
            }
        },
        
    ];

    return (
        <div>
            <div className="flex flex-row items-center gap-3">
                <RouteBackButton/>
                <h1>Purchases in Order: {order}</h1>
            </div>
            
            <div className="flex flex-col gap-3 my-5">
                {Array(13).fill(0).map((purchase) => {
                    return (
                        <div key={purchase.product_ID + purchase.purchase_ID} className="   ">
                            <PurchaseCollapse/>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
