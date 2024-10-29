'use client';

import axios from "@/lib/axiosInstance";
import { Product, ProductInput } from "@/types/db-schema";
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { getSession } from "next-auth/react";



// Fetch products list
const getProducts = async () => {
  const session = await getSession();
  const { data } = await axios.get<Product[]>("/products", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
};

// Fetch a single product
const getProduct = async (id: string) => {
  const session = await getSession();
  const { data } = await axios.get<Product>(`/products/product`, {
    params: { id },
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
};

const getProductByName = async (name: string) => {
  const session = await getSession();
  const { data } = await axios.get<Product[]>(`/products/name`, {
    params: { name },
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
}

// Update an existing product
const updateProduct = async (productID: string, product: Product) => {
  const session = await getSession();
  const { data } = await axios.put<Product>(
    `/products/product`,
    {
      name: product.name,
      price: product.price,
      status: product.status,
      remaining: product.remaining,
    },
    {
      params: { productID },
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  return data;
};

export const useGetProductByName = (name: string): UseQueryResult<Product[]> => {
  return useQuery({
    queryKey: ["product", name],
    queryFn: () => getProductByName(name),
    staleTime: 1000 * 60 * 5,
    enabled: !!name, 
  });
};

// React Query mutation hook for updating products
export const useUpdateProduct = (): UseMutationResult<Product, unknown, { id: string; product: Product }> => {
  return useMutation({
    mutationFn: ({ id, product }) => updateProduct(id, product),
  });
};

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    staleTime: 1000 * 60 * 5,
  });
};

const addProduct = async (product: ProductInput): Promise<Product> => {
  const session = await getSession();

  if (!session || !session.accessToken) {
    throw new Error("Authentication required. Please log in.");
  }

  try {
    const { data } = await axios.post<Product>(
      "/products",
      {
        name: product.name,
        price: product.price,
        status: product.status,
        remaining: product.remaining,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const useAddProduct = (): UseMutationResult<Product, Error, ProductInput> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export { Product };

