let ioInstance;

export const registerSocketServer = (io) => {
  ioInstance = io;
};

export const getSocketServer = () => ioInstance;

export const emitOrderStatusUpdate = (orderId, status) => {
  if (!ioInstance) {
    return;
  }

  ioInstance.to(orderId).emit("order:status", {
    orderId,
    status,
    updatedAt: new Date().toISOString()
  });
};
