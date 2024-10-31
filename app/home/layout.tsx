import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-auto">
      <div className="bg-red-500 flex flex-col justify-center items-center text-white p-10">
        <h1 className="text-5xl font-bold mb-4 text-center">Welcome Fellows Employee!</h1>
        <p className="text-lg mb-4">Thank you for your hard work.</p>
        <p className="text-lg mb-4">If you&apos;re new here, please create your account.</p>
      </div>

      <div className="bg-white w-full flex flex-col justify-center items-center p-10">
        <div className=''>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;