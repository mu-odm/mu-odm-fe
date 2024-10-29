import axios from "@/lib/axiosInstance";
import { RegisterUser, User } from "@/types/db-schema";
import { useQuery, UseQueryResult, useMutation, UseMutationResult } from "@tanstack/react-query";
import { getSession } from "next-auth/react";



const createUser = async (userData: RegisterUser) => {
  const { data } = await axios.post<RegisterUser>("/api/auth/register", userData);
  return data;
};

const getUser = async (email: string) => {
  const session = await getSession();
  const { data } = await axios.get<User>("/users/email", {
    params: { email },
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return data;
};

// New function to get all users
const getAllUsers = async () => {
  const session = await getSession();
  const { data } = await axios.get<User[]>("/users", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return data;
};

export const useCreateUser = (): UseMutationResult<RegisterUser, unknown, RegisterUser> => {
  return useMutation<RegisterUser, unknown, RegisterUser>({
    mutationFn: createUser,
  });
};

export const useGetUser = (email: string): UseQueryResult<User> => {
  return useQuery<User>({
    queryKey: ["user", email],
    queryFn: () => getUser(email),
    staleTime: 1000 * 60 * 5,
    enabled: !!email,
  });
};

// New React Query hook for getAllUsers
export const useGetAllUsers = (): UseQueryResult<User[]> => {
  return useQuery<User[]>({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
    staleTime: 1000 * 60 * 5,
  });
};
