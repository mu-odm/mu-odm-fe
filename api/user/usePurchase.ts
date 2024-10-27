import axios from "@/lib/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

export interface Purchase {
    id: string;
    order_id: string;
    client_id: string;
    created_at: string;
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

export const usePurchase = () => {
  return useQuery<Purchase[]>({
    queryKey: ["purchases"],
    queryFn: getPurchases,
    staleTime: 1000 * 60 * 5,
  });
};
