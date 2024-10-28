"use client";

import { Status, useGetOrder, useUpdateOrder } from "@/api/user/useOrder";
import { useEffect } from "react";

export default function MidnightLogger() {
  const updateOrder = useUpdateOrder();
  const { data: orders } = useGetOrder();

  useEffect(() => {
    const checkMinuteChange = () => {
      const now = new Date();
      const currentHour = now.getUTCHours() + 7;
      const currentMinute = now.getUTCMinutes();

      const adjustedHour = currentHour >= 24 ? currentHour - 24 : currentHour;

      if (adjustedHour === 0 && currentMinute === 0) {
        console.log(`Midnight in Thailand: ${now.toUTCString()}`);
        try {
          orders &&
            orders.forEach((order) => {
              if (order.status === Status.Available) {
                updateOrder.mutate({
                  orderID: order.id,
                  status: Status.Unavailable,
                });
              }
            });
        } catch (error) {
          console.error("Error updating order:", error);
        }
      }
    };

    const intervalId = setInterval(checkMinuteChange, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return null;
}
