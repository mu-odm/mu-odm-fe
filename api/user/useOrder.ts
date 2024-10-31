import axios from "@/lib/axiosInstance";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { Order, Status, User } from "@/types/db-schema";



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
