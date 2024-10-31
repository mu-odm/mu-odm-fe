import axios from "@/lib/axiosInstance";
import { Client } from "@/types/db-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";



const getClients = async () => {
  const session = await getSession();
  if (!session || !session.accessToken) {
    throw new Error("No session or access token found.");
  }

  const { data } = await axios.get<Client[]>("/clients", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  console.log('Clients Data from API:', data); // Log the response data for debugging
  return data;
};

const getClientByEmail = async (email: string) => {
  const session = await getSession();
  if (!session || !session.accessToken) {
    throw new Error("No session or access token found.");
  }

  const { data } = await axios.get<Client>("/clients/email", {
    params: { email },
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  return data;
};

// Define the addClient function
const addClient = async (client: Client): Promise<Client> => {
  const session = await getSession();
  if (!session || !session.accessToken) {
    throw new Error("No session or access token found.");
  }

  console.log("Data being sent to the API:", client); // Log to confirm data structure
  const { data } = await axios.post<Client>("/clients", client, {
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  return data; // Ensure backend returns the client with user_id
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

export const useAddClient = () => {
  const queryClient = useQueryClient();

  return useMutation<Client, Error, Client>({
    mutationFn: addClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error) => {
      console.error("Error adding client:", error); // Log the error
    },
  });
};
