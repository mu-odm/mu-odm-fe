'use client';

import { useGetAllPPS } from "@/api/user/usePPS";
import { useGetProduct, useGetProducts } from "@/api/user/useProduct";
import { useGetProductSizeList } from "@/api/user/useProductSize";
import LoadingAnimation from "@/components/loading_animation";
import { ProductManageForm } from "@/components/product_manage_form";
import { ProductSize } from "@/types/db-schema";
import type { PPS, Product } from "@/types/db-schema";

interface ProductProps {
    params: {
        productID: string;
        sizeID: string;
    };
}

interface PPSFullData extends PPS {
    product: Product;
    productSize: ProductSize;
}

export default function Product({ params }: ProductProps) {
    const { productID, sizeID} = params;

    const { data: product, isLoading, error, refetch } = useGetProduct(productID);
    const { data: productSizeList, isLoading: productSizeListLoading, error: productSizeListError, refetch: refetchProductSizeList } = useGetProductSizeList();
    const { data: pps, isLoading: ppsLoading, error: ppsError } = useGetAllPPS();
    const productSize = productSizeList?.find((productSize: ProductSize) => productSize.id === sizeID);
    const ppsData = pps?.find((pps: PPS) => pps.id.product_id === productID && pps.id.product_size_id === sizeID);
    
    if (productSizeListLoading || ppsLoading) {
        return <LoadingAnimation/>
    }

    if ( !productSize || !ppsData || !product) {
        return <div>Product Size not found</div>;
    }
    
    const ppsFullData: PPSFullData = {
        ...ppsData,
        product,
        productSize,
    }

    if (isLoading) {
        return <LoadingAnimation/>
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex flex-col text-lg text-black font-bold my-5 w-3/5 justify-between">
                <div>Product ID: {productID}</div>
                <div>Size ID: {sizeID}</div>
            </div>
            <div className="w-3/5">
                <ProductManageForm ppsItem={ppsFullData} />
            </div>
        </div>
    );
}
