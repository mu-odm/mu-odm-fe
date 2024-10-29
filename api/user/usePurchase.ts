import axios from "@/lib/axiosInstance";
import { Purchase, PurchaseApproval } from "@/types/db-schema";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";



const getPurchases = async () => {
  const session = await getSession();
  const { data } = await axios.get<Purchase[]>("/purchases", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
};

const updatePurchase = async (purchaseID: string, status: PurchaseApproval) => {
  const session = await getSession();
  
  const { data } = await axios.put<Purchase>(
    `/purchases/purchase?purchaseID=${purchaseID}`, 
    { status: status },
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  return data;
};


export const useUpdatePurchase = (): UseMutationResult<Purchase, unknown, { purchaseID: string; status: PurchaseApproval }> => {
  return useMutation({
    mutationFn: ({ purchaseID, status }) => updatePurchase(purchaseID, status),
  });
};

export const usePurchase = () => {
  return useQuery<Purchase[]>({
    queryKey: ["purchases"],
    queryFn: getPurchases,
    staleTime: 1000 * 60 * 5,
  });
};
