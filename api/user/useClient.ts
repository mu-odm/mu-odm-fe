import axios from "@/lib/axiosInstance";
import { Client } from "@/types/db-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";



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
};

// Define the addClient function
const addClient = async (client: Client) => {
  const session = await getSession();
  const { data } = await axios.post<Client>("/clients", client, {
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return data;
};

const updateClient = async (client: Client) => {
  const session = await getSession();
  const { data } = await axios.put<Client>(
    "/clients/email",
    {
      email: client.email,
      name: client.name,
      contract_year: client.contract_year,
      location: client.location,
      contact: client.contact,
      deferStatus: client.deferStatus,
    },
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      params: { email: client.email }, // Add params here
    }
  );

  return data;
};

export const useUpdateClient = () => {
  return useMutation<Client, unknown, Client>({
    mutationFn: (client) => updateClient(client),
  });
}

// Create a useAddClient hook similar to useGetClients and useGetClientByEmail
export const useGetClientByEmail = (email: string) => {
  return useQuery<Client, unknown, string>({
    queryKey: ["clients", email],
    queryFn: () => getClientByEmail(email),
  });
};

export const useGetClients = () => {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5,
  });
};

// New useAddClient hook
// New useAddClient hook
export const useAddClient = () => {
  const queryClient = useQueryClient();

  return useMutation<Client, Error, Client>({
    mutationFn: addClient, // Mutation function
  });
};

