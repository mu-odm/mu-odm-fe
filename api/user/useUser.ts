import axios from "@/lib/axiosInstance";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { User } from "next-auth";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  region: string;
}

const createUser = async (userData: RegisterData): Promise<User> => {
  const { data } = await axios.post<User>("/api/auth/register", userData);
  return data;
};

const useUser = (): UseMutationResult<User, unknown, RegisterData> => {
  return useMutation<User, unknown, RegisterData>({
    mutationFn: createUser,
  });
};

export default useUser;
