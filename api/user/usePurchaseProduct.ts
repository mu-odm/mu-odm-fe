import axios from "@/lib/axiosInstance";
import { PurchaseProduct } from "@/types/db-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";



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
