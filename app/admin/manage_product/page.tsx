'use client';

import { useEffect, useState } from "react";
import { Product, useGetProducts } from "@/api/user/useProduct";
import Card from "@/components/card";
import LoadingAnimation from "@/components/loading_animation";
import SearchBar from "@/components/search_bar";
import useProductsSearchedStore from "@/stores/searchedStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IoMdRefreshCircle } from "react-icons/io";

export default function ManageProduct() {
    const { data: products, isLoading: productLoading, error: productError, refetch } = useGetProducts();
    const { searchedProducts, clearProducts } = useProductsSearchedStore();
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

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

    useEffect(() => {
        setDisplayedProducts(searchedProducts.length > 0 ? searchedProducts : products || []);
    }, [searchedProducts, products]);

    const clearHandler = () => {
        refetch();
        clearProducts();
        setStatusValue(StatusProps.None);
        setOrderByValue(OrderByProps.None);
    };

    if (productLoading) return <LoadingAnimation />;
    if (productError) return <div>Error loading products</div>;

    let filteredProducts = statusValue === StatusProps.None
        ? displayedProducts
        : displayedProducts.filter((product) => product.status === statusValue);

    if (orderByValue === OrderByProps.AscendingRemaining) {
        filteredProducts.sort((a, b) => a.remaining - b.remaining);
    } else if (orderByValue === OrderByProps.DescendingRemaining) {
        filteredProducts.sort((a, b) => b.remaining - a.remaining);
    }

    return (
        <div className="flex flex-col gap-10 w-full items-start">
            <div className="flex flex-row gap-2 items-center h-[3rem]">
                <SearchBar />
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
                {filteredProducts.map((product) => (
                    <Card key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
