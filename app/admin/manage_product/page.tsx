'use client';

import { Product, useGetProducts } from "@/api/user/useProduct";
import Card from "@/components/card";

export default function ManageProduct() {

    const { data: products, isLoading: productLoading, error: productError } = useGetProducts();

    return (
        <div className="grid grid-cols-3 w-full gap-10 justify-between">
            {
                products?.map((product: Product) => {
                    return (
                        <Card key={product.id} product={product} />
                    );
                })
            }
        </div>
    )
}