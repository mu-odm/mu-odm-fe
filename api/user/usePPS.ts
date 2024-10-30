import axios from "@/lib/axiosInstance";
import { PPS, Status } from "@/types/db-schema";
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
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

const updatePPSByPPSID = async (updatedData: PPS) => {
    const session = await getSession();
    const { data } = await axios.put<PPS>(`/pps/product-productSize`,
      {
        product_id: updatedData.id.product_id,
        product_size_id: updatedData.id.product_size_id,
        remaining: updatedData.remaining,
        status: updatedData.status,
      },
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
    });
    
    return data;
}

export const useUpdatePPSByPPSID = (): UseMutationResult<PPS, unknown, PPS> => {
  return useMutation({
    mutationFn: updatePPSByPPSID,
  });
}
    
export const useGetAllPPSBYProductID = (product_id: string): UseQueryResult<PPS[]> => {
    return useQuery({
      queryKey: ["pps", product_id],
      queryFn: () => getAllPPSByProductID(product_id),
      staleTime: 1000 * 60 * 5,
      enabled: !!product_id, 
    });
  };
  

export const useGetAllPPS = () => {
  return useQuery<PPS[]>({
    queryKey: ["pps"],
    queryFn: getAllPPS,
    staleTime: 1000 * 60 * 5,
  });
};


