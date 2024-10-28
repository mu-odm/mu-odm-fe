// Updated API Hook: app/api/user/usePurchase.ts

import axios from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

export interface PurchaseProduct {
  id: {
    purchase_id: string;
    product_id: string;
  };
  productID: string;
  clientID: string;
  amount: number;
  created_at?: string; // Add if necessary
}

// Fetch function for Purchase Products
const getPurchaseProducts = async () => {
  const session = await getSession();
  const { data } = await axios.get<PurchaseProduct[]>("/purchases_product", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
};

// Custom hook to use the purchase products data
export const usePurchaseProducts = () => {
  return useQuery<PurchaseProduct[]>({
    queryKey: ["purchaseProducts"],
    queryFn: getPurchaseProducts,
    staleTime: 1000 * 60 * 5,
  });
};
