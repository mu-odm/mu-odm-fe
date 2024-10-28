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

interface ProductInput {
  name: string;
  price: number;
  remaining: number;
  status: string;
}

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

// React Query mutation hook for updating products
export const useUpdateProduct = (): UseMutationResult<Product, unknown, { id: string; product: Product }> => {
  return useMutation({
    mutationFn: ({ id, product }) => updateProduct(id, product),
  });
};

// Query hook for fetching all products
export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });
};

// Query hook for fetching a single product by ID
export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    staleTime: 1000 * 60 * 5,
  });
};

// Define function to add a new product
const addProduct = async (product: ProductInput): Promise<Product> => {
  const session = await getSession();

  // Check if session exists and if access token is present
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
          Authorization: `Bearer ${session.accessToken}`, // Include the token in the Authorization header
        },
      }
    );

    return data; // Return the product data from the response
  } catch (error) {
    console.error("Error adding product:", error); // Log error for debugging
    throw error; // Re-throw the error for further handling
  }
};

// Mutation hook for adding a new product
export const useAddProduct = (): UseMutationResult<Product, Error, ProductInput> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProduct, // Correct way to pass the mutation function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Refetch products list
    },
  });
};


