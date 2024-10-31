'use client';

import { useEffect, useState } from "react";
import { useGetProductByName } from "@/api/user/useProduct";
import useProductsSearchedStore from "@/stores/searchedStore";
import { useForm } from "react-hook-form";

export default function SearchBar() {
    interface SearchData {
        search: string;
    }

    const { register, handleSubmit, reset } = useForm<SearchData>();
    const [searchTerm, setSearchTerm] = useState<string>("");
    
    const { data: products, isLoading: productLoading, error: productError } = useGetProductByName(searchTerm);
    const { addProducts, clearProducts } = useProductsSearchedStore();

    const onSubmit = (data: SearchData) => {
        setSearchTerm(data.search);
        reset();
    };

    useEffect(() => {
        clearProducts();
        if (products && products.length > 0) {
            addProducts(products);
        }
    }, [products, addProducts, clearProducts]);

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className="input input-bordered flex items-center gap-2">
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="Search" 
                        {...register("search")}
                    />
                    <button type="submit">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </label>
            </form>
        </div>
    );
}
