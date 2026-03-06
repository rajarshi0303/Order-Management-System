import client from "./client.js";

export const fetchMenu = async () => {
  const { data } = await client.get("/menu");
  return data;
};

export const createOrder = async (payload) => {
  const { data } = await client.post("/orders", payload);
  return data;
};

export const fetchOrderById = async (orderId) => {
  const { data } = await client.get(`/orders/${orderId}`);
  return data;
};

export const fetchOrders = async () => {
  const { data } = await client.get("/orders");
  return data;
};

export const updateOrderStatus = async ({ orderId, status }) => {
  const { data } = await client.patch(`/orders/${orderId}/status`, { status });
  return data;
};
