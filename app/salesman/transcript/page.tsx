// app/stock_view/page.tsx

"use client";
import React, { useState, useEffect } from 'react';
import "@/app/globals.css";
import { useGetOrder } from '@/api/user/useOrder';
import { Order } from '@/types/db-schema';
import { usePurchase } from '@/api/user/usePurchase';
import { Purchase } from '@/types/db-schema';
import { usePurchaseProduct } from '@/api/user/usePurchaseProduct';
import { PurchaseProduct } from '@/types/db-schema';
import { useGetProducts } from '@/api/user/useProduct';
import { Product } from '@/types/db-schema';
import { useGetAllUsers } from '@/api/user/useUser';
import { useSession } from 'next-auth/react';

export default function StockView() {
  const { data: orders, isLoading: isLoadingOrders, error: ordersError } = useGetOrder();
  const { data: purchases, isLoading: isLoadingPurchases, error: purchasesError } = usePurchase();
  const { data: purchaseProducts, isLoading: isLoadingPurchaseProducts, error: purchaseProductsError } = usePurchaseProduct();
  const { data: products, isLoading: isLoadingProducts, error: productsError } = useGetProducts();
  const { data: allUsers, isLoading: isLoadingAllUsers, error: allUsersError } = useGetAllUsers();
  console.log(purchaseProducts);

  const session = useSession();
  const [userRegion, setUserRegion] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isLoadingAllUsers && session.data && allUsers) {
      const foundUser = allUsers.find((user) => user.email === session?.data?.user?.sub);
      setUserRegion(foundUser?.region || null);
    }
  }, [isLoadingAllUsers, session.data, allUsers]);

  useEffect(() => {
    if (userRegion && orders) {
      const regionFilteredOrders = orders.filter((order) => order.region === userRegion);
      setFilteredOrders(regionFilteredOrders);
    }
  }, [userRegion, orders]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (isLoadingOrders || isLoadingPurchases || isLoadingPurchaseProducts || isLoadingProducts || isLoadingAllUsers) {
    return <div>Loading...</div>;
  }
  if (ordersError || purchasesError || purchaseProductsError || productsError || allUsersError) {
    return (
      <div>
        <p>Error fetching data:</p>
        <p>Orders Error: {ordersError?.message}</p>
        <p>Purchases Error: {purchasesError?.message}</p>
        <p>Purchase Products Error: {purchaseProductsError?.message}</p>
        <p>Products Error: {productsError?.message}</p>
        <p>Users Error: {allUsersError?.message}</p>
      </div>
    );
  }

  const productMap = products?.reduce((map, product) => {
    map[product.id] = product.name;
    return map;
  }, {} as Record<string, string>) || {};

  const toggleDropdown = (orderId: string) => {
    setOpenDropdown((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="flex-1 bg-white">
      <div className="p-8">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg mb-4 shadow-md">
                  <button 
                    className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-300 rounded-t-lg"
                    onClick={() => toggleDropdown(order.id)}
                  >
                    <div className="flex-1">
                      <div className="font-semibold">Order: <span className="overflow-scroll-cell">{order.id}</span></div>
                    </div>
                    <div className="flex-1 text-right">{order.region}</div>
                  </button>

                  {openDropdown === order.id && (
                    <div className="p-4 bg-gray-50">
                      <table className="w-full text-sm border-t">
                        <thead>
                          <tr className="text-gray-500">
                            <th className="text-left py-2 px-3">Purchase ID</th>
                            <th className="text-left py-2 px-10">Created At</th>
                            <th className="text-left py-2 px-5">Product</th>
                            <th className="text-left py-2 px-5">Client ID</th>
                            <th className="text-left py-2 px-5">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchases && purchases.length > 0 ? (
                            purchases
                              .filter((purchase) => purchase.orderID === order.id)
                              .map((purchase) => {
                                const relatedProducts = purchaseProducts?.filter(
                                  (product) => product.id.purchase_id === purchase.id
                                );

                                console.log(relatedProducts);

                                return (
                                  <React.Fragment key={purchase.id}>
                                    {relatedProducts && relatedProducts.length > 0 ? (
                                      relatedProducts.map((product) => (
                                        <tr key={product.id.purchase_id}>
                                          <td className="py-2 px-3 overflow-scroll-cell w-auto">{purchase.id}</td>
                                          <td className="py-2 px-10">{new Date(purchase.created_at).toLocaleDateString()}</td>
                                          <td className="py-2 px-5 overflow-scroll-cell w-1/6">
                                            {productMap[product.id.pps_id.product_id] || product.id.purchase_id}
                                          </td>
                                          <td className="py-2 px-5 overflow-scroll-cell w-1/6">{product.clientID}</td>
                                          <td className="py-2 px-5">{product.amount}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr key={purchase.id}>
                                        <td className="py-2 overflow-scroll-cell">{purchase.id}</td>
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
              <div>No orders found for your region.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
