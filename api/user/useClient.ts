import axios from "@/lib/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

export interface Client {
    id: string;
    email: string;
    name: string;
    contract_year: number;
    location: string;
    contact: string;
}

const getClients = async () => {
  const session = await getSession();
  const { data } = await axios.get<Client[]>("/clients", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
};

const getClientByEmail = async (email: string) => {
  const session = await getSession();
  const { data } = await axios.get<Client>("/clients/email", {
    params: { email },
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
}

export const useGetClientByEmail = (email: string) => {
  return useQuery<Client, unknown, string>({
    queryKey: ["clients", email],
    queryFn: () => getClientByEmail(email),
  });
}

export const useGetClients = () => {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5,
  });
};
