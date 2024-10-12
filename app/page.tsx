"use client";

import Card from "@/components/card";
import { useEffect, useState } from "react";
import { fetchUserByEmail, useUserStore } from "@/stores/userStore";
import { loginUser, registerUser, useAuthStore } from "@/stores/authStore";
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  
  

  const goToProductPage = () => {
      router.push('/product_view');
  };

  const registerHandler = async () => {
    await registerUser({
      email: "xxxx@gmail.com",
      username: "pun",
      password: "Pu@13@ljljuuun",
    });
  };

  const loginHandler = async () => {
    await loginUser({
      email: "xxxx@gmail.com",
      username: "pun",
      password: "Pu@13@ljljuuun",
    });
  };

  const logoutHandler = () => {
    useAuthStore.getState().clearToken();
    window.location.reload();
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (token != null) {
        try {
          await fetchUserByEmail("xxxx@gmail.com");
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, [token]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>hello world</div>
      <button onClick={registerHandler} className="btn">Register</button>
      <button onClick={loginHandler} className="btn">Login</button>
      <button onClick={logoutHandler} className="btn bg-red-600">Logout</button>
      <button onClick={goToProductPage} className="btn">Go to Product Page</button>
      <Card />
      <div>
        <h3>
          {user ? (
            <div>
              <p>{user.username}</p>
              <p>{user.email}</p>
              <p>{user.role}</p>
            </div>
          ) : (
            "Loading..."
          )}
        </h3>
      </div>
    </main>
  );
}

