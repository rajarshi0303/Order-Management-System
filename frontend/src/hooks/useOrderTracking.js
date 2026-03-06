import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { fetchOrderById } from "../api/ordersApi.js";

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export const useOrderTracking = (orderId) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: Boolean(orderId),
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (!orderId) {
      return undefined;
    }

    const socket = io(socketUrl, { transports: ["websocket"] });
    socket.emit("order:subscribe", { orderId });

    socket.on("order:status", ({ status }) => {
      queryClient.setQueryData(["order", orderId], (prev) =>
        prev ? { ...prev, status } : prev
      );
    });

    return () => {
      socket.emit("order:unsubscribe", { orderId });
      socket.disconnect();
    };
  }, [orderId, queryClient]);

  return query;
};
