import axios from "@/lib/axiosInstance";
import { PPS } from "@/types/db-schema";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { getSession } from "next-auth/react";



const getAllPPS = async () => {
  const session = await getSession();
  const { data } = await axios.get<PPS[]>("/pps", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
};

const getAllPPSByProductID = async (product_id: string) => {
    const session = await getSession();
    const { data } = await axios.get<PPS[]>(`/pps/product/${product_id}`, {
        headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        },
    });
    
    return data;
}
    
export const useGetAllPPSBYProductID = (product_id: string): UseQueryResult<PPS[]> => {
    return useQuery({
      queryKey: ["product", name],
      queryFn: () => getAllPPSByProductID(product_id),
      staleTime: 1000 * 60 * 5,
      enabled: !!product_id, 
    });
  };
  

export const useGetAllPPS = () => {
  return useQuery<PPS[]>({
    queryKey: ["product_size_list"],
    queryFn: getAllPPS,
    staleTime: 1000 * 60 * 5,
  });
};


