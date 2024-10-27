'use client';

import React, { useState } from 'react';

interface FormData {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    newPassword: '',
    confirmNewPassword: '',
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


    if (formData.newPassword !== formData.confirmNewPassword) {
      console.log('Passwords do not match');
      return;
    }


    console.log('Password reset for:', formData.email, 'New password:', formData.newPassword);
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Reset Your Password</h1>

        <form onSubmit={handleSubmit} className="w-full">
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

          {/* ช่อง new pw */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-3 text-sm border border-gray-300 rounded-md"
              placeholder="Enter your new password"
              required
            />
          </div>

          {/* ช่อง Confirm new pw */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="w-full p-3 text-sm border border-gray-300 rounded-md"
              placeholder="Confirm your new password"
              required
            />
          </div>

          {/* ปุ่ม reset pw */}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-md mb-4"
          >
            Reset Password
          </button>

          {/* link ไปหน้า Login */}
          <div className="mt-2 text-sm text-right">
            Remembered your password?{' '}
            <a href="/home/login" className="text-red-500 hover:underline">
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
