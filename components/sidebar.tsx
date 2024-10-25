"use client";

import { useRouter } from 'next/navigation';

export default function Sidebar() {

  const router = useRouter();

  const goToProductPage = () => {
    router.push('/product_view');
  };

  const goToStockView = () => {
    router.push('/stock_view');
  };

  const goToPurchasedOrder = () => {
    router.push('/purchase_order');
  };

    return (
      <div className="w-32
       bg-black-500 text-white h-screen">
        <ul className="space-y-5 p-">
          <li><button onClick={goToProductPage} className="w-40  btn bg-red-500 text-white">Products</button></li>
          <li><button onClick={goToStockView} className="w-40  btn bg-red-500 text-white">Stock Views</button></li>
          <li><button onClick={goToPurchasedOrder} className="w-40  btn bg-red-500 text-white">Purchase Orders</button></li>
          <li><button  className="w-40  btn bg-red-500 text-white">Transcript</button></li>
        </ul>
      </div>
    );
  }