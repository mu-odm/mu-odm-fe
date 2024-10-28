// app/stock_view/page.tsx

"use client";
import React from 'react';
import { useState } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useOrder, Order } from '@/api/user/useOrder';
import { usePurchaseProducts, PurchaseProduct } from '@/api/user/usePurchaseProduct';

export default function StockView() {
  const { data: orders, isLoading: isLoadingOrders, error: ordersError } = useOrder();
  const { data: purchaseProducts, isLoading: isLoadingPurchaseProducts, error: purchaseProductsError } = usePurchaseProducts();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (isLoadingOrders || isLoadingPurchaseProducts) return <div>Loading...</div>;
  if (ordersError || purchaseProductsError) return (
    <div>
      <p>Error fetching data:</p>
      <p>Orders Error: {ordersError?.message}</p>
      <p>Purchase Products Error: {purchaseProductsError?.message}</p>
    </div>
  );

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
                            <th className="text-left py-2">Product ID</th>
                            <th className="text-left py-2">Client ID</th>
                            <th className="text-left py-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.purchases && order.purchases.length > 0 ? (
                            order.purchases.map((purchase) => {
                              // Filter purchaseProducts by the current purchase ID
                              const relatedProducts = purchaseProducts?.filter(
                                (product) => product.id.purchase_id === purchase.id
                              );

                              return (
                                <React.Fragment key={purchase.id}>
                                  {relatedProducts && relatedProducts.length > 0 ? (
                                    relatedProducts.map((product) => (
                                      <tr key={product.id.product_id}>
                                        <td className="py-2">{purchase.id}</td>
                                        <td className="py-2">{new Date(purchase.created_at).toLocaleDateString()}</td>
                                        <td className="py-2">{product.id.product_id}</td>
                                        <td className="py-2">{product.clientID}</td>
                                        <td className="py-2">{product.amount}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr key={purchase.id}>
                                      <td className="py-2">{purchase.id}</td>
                                      <td className="py-2">{new Date(purchase.created_at).toLocaleDateString()}</td>
                                      <td className="py-2" colSpan={3}>No Products Available</td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })
                          ) : (
                            <tr>
                              <td className="py-2" colSpan={5}>No Purchases Available</td>
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
