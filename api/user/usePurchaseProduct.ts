import axios from "@/lib/axiosInstance";
import { PurchaseProduct,CreatePurchaseProductParams } from "@/types/db-schema";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";


const createPurchaseProduct = async (params: CreatePurchaseProductParams): Promise<PurchaseProduct> => {
  const session = await getSession();

  const { data } = await axios.post<PurchaseProduct>(
    `/purchase_product`,
    params,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    }
  );

  return data;
};

export const useCreatePurchaseProduct = (): UseMutationResult<PurchaseProduct, unknown, CreatePurchaseProductParams> => {
  return useMutation({
    mutationFn: (params) => createPurchaseProduct(params),
  });
};

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
