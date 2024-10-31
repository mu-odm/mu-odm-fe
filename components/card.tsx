'use client';

import useRouteHandler from "@/lib/routeHandler";
import { PPS, Product, ProductSize } from "@/types/db-schema";

interface PPSFullData extends PPS {
    product: Product;
    productSize: ProductSize;
}

export default function Card({ ppsItem }: { ppsItem: PPSFullData }) {

    const navigateToRoute = useRouteHandler()

    return (
        <div className="card card-compact bg-base-100 shadow-xl flex hover:cursor-pointer hover:scale-95 transition-transform"
            onClick={() => navigateToRoute(
                `/admin/manage_product/${ppsItem.id.product_id}`,
                ppsItem.id.product_size_id
            )}
        >
            <div className="card-body">
                <div className='flex flex-row justify-between items-center overflow-clip'>
                    <div className="card-title">{ppsItem.product.name}</div>
                </div>
                <p>remaining: {ppsItem.remaining}</p>
                <p>total cost: {ppsItem.product.price + ppsItem.productSize.additional_price}</p>
                <p>size: {ppsItem.productSize.size}</p>
                <div className="flex flex-row w-fit gap-2">
                    <p>status:</p>
                    <p className={
                        ppsItem.status === 'Available' ? 'text-green-500' : 'text-red-500'
                    }>{ppsItem.status}</p>
                </div>
                <div className="card-actions justify-end">
                </div>
            </div>
        </div>
    )
}