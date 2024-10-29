import axios from "@/lib/axiosInstance";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

export enum PurchaseApproval {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface Purchase {
    id: string;
    orderID: string;
    clientID: string;
    created_at: string;
    status: PurchaseApproval;
}

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
