'use client';

import axios from "@/lib/axiosInstance";
import { Product, PPS } from "@/types/db-schema";
import { useQuery, UseQueryResult, useMutation, UseMutationResult } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

// Fetch product data from the pps table by product ID
const getPPSByProductId = async (productId: string): Promise<PPS[]> => {
  const session = await getSession();
  const { data } = await axios.get<PPS[]>(`/pps/product`, {
    params: { product_id: productId },
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
      "Content-Type": "application/json",
      "Accept": "*/*",
    },
  });

  return data;
};

// Create a React Query hook for getting product data by product ID
export const useGetPPSByProductId = (productId: string): UseQueryResult<PPS[]> => {
  return useQuery({
    queryKey: ["ppsProduct", productId],
    queryFn: () => getPPSByProductId(productId), // Update `getPPSByProductId` to return `PPS[]`
    staleTime: 1000 * 60 * 5,
    enabled: !!productId,
  });
};

// POST PPS
const postPPS = async (product_id: string, product_size_id: string) => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Access token is missing or invalid.");
  }
  const response = await axios.post(
    '/pps',
    { product_id, product_size_id },
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    }
  );
  return response.data;
};


// Create a React Query hook for posting PPS
export const usePostPPS = (): UseMutationResult<PPS, unknown, { product_id: string; product_size_id: string }> => {
  return useMutation({
    mutationFn: async ({ product_id, product_size_id }) => {
      try {
        return await postPPS(product_id, product_size_id);
      } catch (error) {
        console.error("postPPS error:", error);
        throw error;
      }
    },
  });
};

