import axios from "@/lib/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

export interface Purchase {
  id: string;
  order_id: string;
  client_id: string;
  created_at: string;
}

export interface Order {
  id: string;
  purchases: Purchase[];
  status: string;
  region: string;
}

const getOrders = async () => {
  const session = await getSession();
  const { data } = await axios.get<Order[]>("/orders", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
};

export const useOrder = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1000 * 60 * 5,
  });
};
