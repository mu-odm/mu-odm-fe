import { authApiInstance } from "@/api/instance";
import { create } from "zustand";

interface User {
  username: string;
  email: string;
  role: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export const fetchUserByEmail = async (email: string) => {
    await authApiInstance({
      method: "GET",
      url: "/users/email",
      params: {
        email,
      }
    })
      .then((res) => {
        useUserStore.getState().setUser(res.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  };
  