import axios from "@/lib/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

interface PurchaseProductKey {
    purchase_id: string;
    product_id: string;
}

export interface PurchaseProduct {
    id: PurchaseProductKey;
    productID: string;
    clientID: string;
    amount: number;
}

const getPurchaseProducts = async () => {
  const session = await getSession();
  const { data } = await axios.get<PurchaseProduct[]>("/purchase_product", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
};

export const usePurchaseProduct = () => {
  return useQuery<PurchaseProduct[]>({
    queryKey: ["purchase_products"],
    queryFn: getPurchaseProducts,
    staleTime: 1000 * 60 * 5,
  });
};
