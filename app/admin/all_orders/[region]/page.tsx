"use client";

import { useGetOrder } from "@/api/user/useOrder";
import type { Order } from "@/api/user/useOrder";
import { usePurchase } from "@/api/user/usePurchase";
import LoadingAnimation from "@/components/loading_animation";
import RouteBackButton from "@/components/route_back_button";
import useRouteHandler from "@/lib/routeHandler";

interface RegionProps {
  params: {
    region: string;
  };
}

export default function Order({ params }: RegionProps) {
  const { region } = params;
  const { data: orders, isLoading: orderLoading, error: orderError } = useGetOrder();
  const { data: purchases, isLoading: purchaseLoading, error: purchaseError } = usePurchase();
  const navigateToRoute = useRouteHandler();

  if (orderLoading || purchaseLoading) {
    return <LoadingAnimation/>
  }

  return (
    <div className="">
      <div className="flex flex-row items-center gap-3">
        <RouteBackButton />
        <h1>Orders in Region: {region}</h1>
      </div>
      <div className="grid grid-cols-2 gap-2 my-5">
        {orders
          ?.filter((order: Order) => order.region === region)
          .map((order: Order) => (
            <div
              key={order.id}
              className="p-3 border border-gray-300 rounded-md hover:scale-95 transition-transform cursor-pointer hover:bg-slate-900 duration-300 flex flex-col gap-3"
              onClick={() =>
                navigateToRoute(`/admin/all_orders/${region}`, order.id)
              }
            >
              <div className="font-bold">Order ID: {order.id}</div>
              <hr className="border-t border-gray-300 w-full my-2" />
              <div>
                <div className="flex flex-row justify-between">
                  <div>Purchases:</div>
                  <div>{purchases?.filter((purchase) => purchase?.orderID === order.id).length}</div>
                </div>
                <div className="flex flex-row justify-between">
                  <div>Status:</div>
                  <div
                    className={
                      order.status === "Available"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {order.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
