import axios from "@/lib/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

export interface ApiProduct {
  id: string;
  name: string;
  price: number;
  status: string;
  amount: number;
}


const fetchProducts = async (): Promise<ApiProduct[]> => {
  const session = await getSession();
  const { data } = await axios.get<ApiProduct[]>("/products", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`
    }
  });

  return data;
};

export const handleAddProduct = async (name: string, price: number, amount: number, status: string) => {
  const session = await getSession();
  const response = await axios.post(
    "/products",
    {
      name,
      price,
      status,
      remaining: amount
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        Authorization: `Bearer ${session?.accessToken}`
      }
    }
  );
  console.log(response.data);
  alert("Product added successfully!");
};

export const updateProductById = async (id: string, updatedProduct: Partial<ApiProduct>): Promise<ApiProduct | null> => {
  const session = await getSession();
  try {
    const response = await axios.put<ApiProduct>(`/products/product`, updatedProduct, {
      params:{id},
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        Authorization: `Bearer ${session?.accessToken}`
      }
    });
    console.log(response.data);
    return response.data; 
  } catch (error) {
    console.error("Error updating product by ID:", error);
    return null;
  }
};






export default fetchProducts;
