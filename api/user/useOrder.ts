import axios from "@/lib/axiosInstance";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { User } from "@/api/user/useUser";

export interface Purchase {
  id: string;
  orderID: string;
  clientID: string;
  created_at: string;
}

export enum Status {
  Available = "Available",
  Unavailable = "Unavailable",
}

export interface Order {
  id: string;
  purchases: Purchase[];
  status: Status;
  region: string;
  user: User
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

const updateOrder = async (orderID: string, status: Status) => {
  const session = await getSession();
  const { data } = await axios.put<Order>(
    `/orders/order`,
    {
      status: status,
    },
    {
      params: { orderID },
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  return data;
}

export const useUpdateOrder = (): UseMutationResult<Order, unknown, { orderID: string; status: Status }> => {
  return useMutation({
    mutationFn: ({ orderID, status }) => updateOrder(orderID, status),
  });
};

export const useGetOrder = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1000 * 60 * 5,
  });
};
