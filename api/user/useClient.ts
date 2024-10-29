import axios from "@/lib/axiosInstance";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { User } from "@/api/user/useUser";

// Update the Client interface to include user
export interface Client {
  user_id: string;
  id: string;
  email: string;
  name: string; // Or username if that's how it's structured
  contract_year: number;
  location: string;
  contact: string;
  deferstatus: boolean; // Ensure this field matches the backend
}

export interface UseClient {
  user: User; // Include the user object directly
  id: string;
  email: string;
  name: string; // Or username if that's how it's structured
  contract_year: number;
  location: string;
  contact: string;
  deferstatus: boolean;
}

const getClients = async () => {
  const session = await getSession();
  if (!session || !session.accessToken) {
    throw new Error("No session or access token found.");
  }

  const { data } = await axios.get<UseClient[]>("/clients", {
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

// Define the updateClient function
const updateClient = async (email: string, clientUpdate: Partial<Client>): Promise<Client> => {
  const session = await getSession();
  if (!session || !session.accessToken) {
    throw new Error("No session or access token found.");
  }

  const { data } = await axios.put<Client>(`/clients/email`, clientUpdate, {
    params: { email },
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  return data;
};

// Create a useUpdateClient hook
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<Client, Error, { email: string; clientUpdate: Partial<Client> }>({
    mutationFn: ({ email, clientUpdate }) => updateClient(email, clientUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error) => {
      console.error("Error updating client:", error); // Log the error
    },
  });
};

// Other hooks remain the same
export const useGetClientByEmail = (email: string) => {
  return useQuery<Client, unknown, string>({
    queryKey: ["clients", email],
    queryFn: () => getClientByEmail(email),
  });
};

export const useGetClients = () => {
  return useQuery<UseClient[]>({
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
