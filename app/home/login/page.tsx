'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';

interface FormData {
  email: string;
  password: string;
  username: string;
}

const LoginPage: React.FC = () => {

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    username: ''
  });
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const res = await signIn(
        'credentials',
        {
          email: formData.email,
          password: formData.password,
        }
      );
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex h-screen bg-white justify-center items-center p-10">
      <div className="flex flex-col justify-center items-center w-full max-w-lg">
        <button className="text-2xl font-bold text-gray-800 mb-6">Login</button>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
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
         
          {/* Password input */}
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

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-red-600" />
              <label className="ml-2 text-sm text-gray-700">Remember me</label>
            </div>
            <a href="./resetpassword" className="text-sm text-red-500 hover:underline">
              Reset Password
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-md"
          >
            Login
          </button>
          <div className="mt-2 text-sm text-right">
            Don't have an account?{' '}
            <a href="./register" className="text-red-500 hover:underline">
              Create Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
