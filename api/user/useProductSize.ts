import axios from "@/lib/axiosInstance";
import { ProductSize } from "@/types/db-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";



const getProductSizeList = async () => {
  const session = await getSession();
  const { data } = await axios.get<ProductSize[]>("/product_size", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
};

const createProductSize = async (productSize: ProductSize) => {
    const session = await getSession();
    const { data } = await axios.post<ProductSize>("/product_size", productSize, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
    });
    return data;
};

const deleteProductSize = async (id: string) => {
    const session = await getSession();
    const { data } = await axios.delete<ProductSize>(`/product_size/product_size`, {
        params: { id },
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
        },
    });
    return data;
};

export const useDeleteProductSize = () => {
    return useMutation<ProductSize, unknown, string>({
        mutationFn: (id: string) => deleteProductSize(id),
    });
};

export const useCreateProductSize = () => {
    return useMutation<ProductSize, unknown, ProductSize>({
        mutationFn: createProductSize,
    });
};

export const useGetProductSizeList = () => {
  return useQuery<ProductSize[]>({
    queryKey: ["product_size_list"],
    queryFn: getProductSizeList,
    staleTime: 1000 * 60 * 5,
  });
};
export { ProductSize };

