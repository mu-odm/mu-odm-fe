import { create } from "zustand";
import { authApiInstance } from "@/api/instance";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string | null) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);

interface AuthData {
  email: string;
  username: string;
  password: string;
}

export const loginUser = async ({ email, username, password }: AuthData) => {
  try {
    const response = await authApiInstance.post("/api/auth/login", {
      email,
      username,
      password,
    });

    const token = response.data?.accessToken;
    if (token) {
      useAuthStore.getState().setToken(token);
    } else {
      throw new Error("Token not found in response");
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};

export const registerUser = async ({ email, username, password }: AuthData) => {
  try {
    const response = await authApiInstance.post("/api/auth/register", {
      email,
      username,
      password,
    });

    console.log(response.data);
  } catch (error) {
    console.error("Error during registration:", error);
  }
};
