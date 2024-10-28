'use client';

import { useGetProduct } from "@/api/user/useProduct";
import LoadingAnimation from "@/components/loading_animation";
import { ProductManageForm } from "@/components/product_manage_form";

interface ProductProps {
    params: {
        productID: string;
    };
}

export default function Product({ params }: ProductProps) {
    const { productID } = params;

    const { data: product, isLoading, error, refetch } = useGetProduct(productID);

    if (isLoading) {
        return <LoadingAnimation/>
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex flex-row gap-5 text-lg text-black font-bold my-5 w-3/5 justify-between">
                <div>Product ID: {product?.id}</div>
            </div>
            <div className="w-3/5">
                <ProductManageForm product={product} />
            </div>
        </div>
    );
}
