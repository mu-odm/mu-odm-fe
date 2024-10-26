import axios from "@/lib/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

interface Purchase {
  id: string;
  created_at: string;
}

interface Order {
  id: string;
  purchase: Purchase;
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

const useOrder = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1000 * 60 * 5,
  });
};

export default useOrder;
