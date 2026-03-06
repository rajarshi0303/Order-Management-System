export const setupOrderSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("order:subscribe", ({ orderId }) => {
      if (typeof orderId === "string" && orderId.trim()) {
        socket.join(orderId);
      }
    });

    socket.on("order:unsubscribe", ({ orderId }) => {
      if (typeof orderId === "string" && orderId.trim()) {
        socket.leave(orderId);
      }
    });
  });
};
