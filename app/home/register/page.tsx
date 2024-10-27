'use client';

import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    console.log('Form data submitted:', formData);
  };

  return (
    <div className="flex h-screen bg-white justify-center items-center p-10">
      <div className="flex flex-col justify-center items-center w-full max-w-lg">
        {/* ใส่ Image */}
        <img
          src="/path-to-your-logo.png"
          alt="Logo"
          className="mb-4 w-16 h-16"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Your Account</h1>

        <form onSubmit={handleSubmit} className="w-full">
          {/* ช่อง Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 text-sm border border-gray-300 rounded-md"  
              placeholder="Enter your name"
              required
            />
          </div>

          {/* ช่อง Email */}
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

          {/* ช่อง pw */}
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

          {/* ช่อง confirm pw */}
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

          {/* ปุ่ม Create Account */}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-md mb-4"
          >
            Create Account
          </button>

          {/* link ไปหน้า Login */}
          <div className="mt-2 text-sm text-right">
            Already have an account?{' '}
            <a href="/home/login" className="text-red-500 hover:underline">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
