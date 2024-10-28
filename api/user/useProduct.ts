'use client';

import axios from "@/lib/axiosInstance";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

export interface Product {
    id: string;
    name: string;
    price: number;
    status: string;
    remaining: number;
}

const getProducts = async () => {
  const session = await getSession();
  const { data } = await axios.get<Product[]>("/products", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
};

const getProduct = async (id: string) => {
  const session = await getSession();
  const { data } = await axios.get<Product>(`/products/product`, {
    params: { id },
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
}

const updateProduct = async (productID: string, product: Product) => {
  const session = await getSession();
  const { data } = await axios.put<Product>(`/products/product`, {
    name: product.name,
    price: product.price,
    status: product.status,
    remaining: product.remaining,
  }, {
    params: { productID },
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
}

export const useUpdateProduct = (): UseMutationResult<Product, unknown, { id: string, product: Product }> => {
  return useMutation<Product, unknown, { id: string, product: Product }>({
    mutationFn: ({ id, product }) => updateProduct(id, product),
  });
};


export const useGetProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    staleTime: 1000 * 60 * 5,
  });
};
