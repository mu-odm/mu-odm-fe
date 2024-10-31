'use client';

import { useEffect, useState } from "react";
import { useGetProducts } from "@/api/user/useProduct";
import Card from "@/components/card";
import LoadingAnimation from "@/components/loading_animation";
import SearchBar from "@/components/search_bar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PPS, Product, ProductSize } from "@/types/db-schema";
import { useGetAllPPS } from "@/api/user/usePPS";
import { useGetProductSizeList } from "@/api/user/useProductSize";
import useProductsSearchedStore from "@/stores/searchedStore";
import { IoMdRefreshCircle } from "react-icons/io";

interface PPSFullData extends PPS {
    product: Product;
    productSize: ProductSize;
}

export default function ManageProduct() {
    const { data: products, isLoading: productLoading, error: productError, refetch: productsRefetch } = useGetProducts();
    const { data: productSizeList, isLoading: productSizeListLoading, error: productSizeListError, refetch: productSizeRefetch } = useGetProductSizeList();
    const { data: pps, isLoading: ppsLoading, error: ppsError, refetch: ppsRefetch } = useGetAllPPS();
    const { searchedProducts, clearProducts } = useProductsSearchedStore();
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Update displayed products based on searched products or all products
        setDisplayedProducts(searchedProducts.length > 0 ? searchedProducts : products || []);
    }, [searchedProducts, products]);

    // Ensure PPSFullData is created from products and PPS data
    const ppsFullData = pps?.map((pps: PPS) => ({
        ...pps,
        product: products?.find((product: Product) => product.id === pps.id.product_id),
        productSize: productSizeList?.find((productSize: ProductSize) => productSize.id === pps.id.product_size_id),
    })) as PPSFullData[];

    const StatusProps = {
        Available: "Available",
        Unavailable: "Unavailable",
        None: "None",
    };

    const OrderByProps = {
        AscendingRemaining: "Ascending Remaining",
        DescendingRemaining: "Descending Remaining",
        None: "None",
    };

    const [statusValue, setStatusValue] = useState(StatusProps.None);
    const [orderByValue, setOrderByValue] = useState(OrderByProps.None);

    if (productLoading || ppsLoading || productSizeListLoading) return <LoadingAnimation />;
    if (productError || ppsError || productSizeListError) return <div>Error loading products</div>;

    let filteredData = ppsFullData;

    // Filter based on status selection
    if (statusValue !== StatusProps.None) {
        filteredData = filteredData.filter((ppsItem) => {
            const productAvailability = ppsItem.status; // Adjust according to your product's availability property
            return (
                (statusValue === StatusProps.Available && productAvailability === "Available") ||
                (statusValue === StatusProps.Unavailable && productAvailability === "Unavailable")
            );
        });
    }

    // Sort based on order selection
    if (orderByValue === OrderByProps.AscendingRemaining) {
        filteredData.sort((a, b) => (a.remaining || 0) - (b.remaining || 0)); // Adjust according to your remaining quantity property
    } else if (orderByValue === OrderByProps.DescendingRemaining) {
        filteredData.sort((a, b) => (b.remaining || 0) - (a.remaining || 0)); // Adjust according to your remaining quantity property
    }

    const clearHandler = () => {
        productsRefetch();
        productSizeRefetch();
        ppsRefetch();
        clearProducts();
        setStatusValue(StatusProps.None);
        setOrderByValue(OrderByProps.None);
    };

    return (
        <div className="flex flex-col gap-10 w-full items-start">
            <div className="flex flex-row gap-2 items-center h-[3rem]">
                <Select
                    value={statusValue}
                    onValueChange={(value) => setStatusValue(value)}
                >
                    <SelectTrigger id="status" className="h-full">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value={StatusProps.Available}>Available</SelectItem>
                        <SelectItem value={StatusProps.Unavailable}>Unavailable</SelectItem>
                        <SelectItem value={StatusProps.None}>None</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={orderByValue}
                    onValueChange={(value) => setOrderByValue(value)}
                >
                    <SelectTrigger id="order" className="h-full">
                        <SelectValue placeholder="Order By" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value={OrderByProps.AscendingRemaining}>Ascending Remaining</SelectItem>
                        <SelectItem value={OrderByProps.DescendingRemaining}>Descending Remaining</SelectItem>
                        <SelectItem value={OrderByProps.None}>None</SelectItem>
                    </SelectContent>
                </Select>
                <div className="btn bg-red-500 text-white cursor-pointer" onClick={clearHandler}>
                    <IoMdRefreshCircle className="w-[2rem] h-[2rem]" />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-10 justify-between">
                { 
                    filteredData.map((ppsItem: PPSFullData) => {
                        const uniqueKey = ppsItem.id.product_id + ppsItem.id.product_size_id;
                        return (
                            <Card key={uniqueKey} ppsItem={ppsItem} />
                        );
                    })
                }
            </div>
        </div>
    );
}
