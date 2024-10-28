import axios from "@/lib/axiosInstance";
import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

export interface User {
  username: string;
  email: string;
  region: string;
  role: string;
}

export interface RegisterUser {
  username: string;
  email: string;
  password: string;
  region: string;
}

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

export const useCreateUser = (): UseMutationResult<RegisterUser, unknown, RegisterUser> => {
  return useMutation<RegisterUser, unknown, RegisterUser>({
    mutationFn: createUser,
  });
};

export const useGetUser = (email: string) => {
  return useQuery<User>({
    queryKey: ["user", email],
    queryFn: () => getUser(email),
    staleTime: 1000 * 60 * 5,
  });
};
