'use client';

import { Product } from "@/api/user/useProduct";
import useRouteHandler from "@/lib/routeHandler";

export default function Card({ product }: { product: Product }) {

    const navigateToRoute = useRouteHandler()

    return (
        <div className="card card-compact bg-base-100 shadow-xl flex hover:cursor-pointer hover:scale-95 transition-transform"
            onClick={() => navigateToRoute(
                '/admin/manage_product',
                product.id
            )}
        >
            <div className="card-body">
                <div className='flex flex-row justify-between items-center overflow-clip'>
                    <div className="card-title">{product.name}</div>
                </div>
                <p>remaining: {product.remaining}</p>
                <p>price: {product.price}</p>
                <div className="flex flex-row w-fit gap-2">
                    <p>status:</p>
                    <p className={
                        product.status === 'Available' ? 'text-green-500' : 'text-red-500'
                    }>{product.status}</p>
                </div>
                <div className="card-actions justify-end">
                </div>
            </div>
        </div>
    )
}