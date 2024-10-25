import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="bg-red-500 w-1/2 flex flex-col justify-center items-center text-white p-10">
        <h1 className="text-5xl font-bold mb-4">Welcome Fellows Employee!</h1>
        <p className="text-lg mb-4">Thank you for your hard work.</p>
        <p className="text-lg mb-4">If you're new here, please create your account.</p>
      </div>

      {/* Right Side */}
      <div className="bg-white w-1/2 flex flex-col justify-center items-center p-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;