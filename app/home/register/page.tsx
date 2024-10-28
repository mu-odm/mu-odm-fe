"use client";

import { useCreateUser } from "@/api/user/useUser";
import useRouteHandler from "@/lib/routeHandler";
import React, { useState } from "react";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  region: string;
}

const RegisterPage: React.FC = () => {

  const user = useCreateUser();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    region: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigateToRoute = useRouteHandler();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    
    setErrorMessage(null);
    setSuccessMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const res = await user!.mutateAsync({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        region: formData.region,
      });
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        region: "",
      });

      navigateToRoute("/home", "login");

    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage("Registration failed. Please try again.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-white justify-center items-center p-10 w-full">
      <div className="flex flex-col justify-center items-center w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Register
        </h1>

        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 mb-4">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 text-sm border border-gray-300 rounded-md"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 text-sm border border-gray-300 rounded-md"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 text-sm border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 text-sm border border-gray-300 rounded-md"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region
            </label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full p-3 text-sm border border-gray-300 rounded-md"
              placeholder="Enter your region"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-md mb-4"
          >
            Register
          </button>

          <div className="flex flex-row gap-2 mt-2 text-sm justify-start">
            <p>Already have an account?</p>
            <a href="./login" className="text-red-500 hover:underline">
              Login
            </a>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
