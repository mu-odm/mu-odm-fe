// app/stock_view/page.tsx

"use client";

import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useOrder, Order } from '@/api/user/useOrder';

export default function StockView() {
  const { data: orders, isLoading: isLoadingOrders, error: ordersError } = useOrder();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (isLoadingOrders) return <div>Loading...</div>;
  if (ordersError) return <div>Error fetching data: {ordersError.message}</div>;

  const toggleDropdown = (orderId: string) => {
    setOpenDropdown((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="flex-1 bg-white">
      <div className="p-8">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="border rounded-lg mb-4 shadow-md">
                  <button 
                    className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-300 rounded-t-lg"
                    onClick={() => toggleDropdown(order.id)}
                  >
                    <div className="flex-1">
                      <div className="font-semibold">Order: {order.id}</div>
                    </div>
                    <div className="flex-1 text-right">{order.region}</div>
                  </button>

                  {openDropdown === order.id && (
                    <div className="p-4 bg-gray-50">
                      <table className="w-full text-sm border-t">
                        <thead>
                          <tr className="text-gray-500">
                            <th className="text-left py-2">Purchase ID</th>
                            <th className="text-left py-2">Created At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.purchases && order.purchases.length > 0 ? (
                            order.purchases.map((purchase) => (
                              <tr key={purchase.id}>
                                <td className="py-2">{purchase.id}</td>
                                <td className="py-2">{new Date(purchase.created_at).toLocaleDateString()}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="py-2" colSpan={2}>No Purchases Available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div>No orders found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
