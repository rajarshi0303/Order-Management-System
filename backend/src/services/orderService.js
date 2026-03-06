import {
  createOrderRecord,
  getAllOrders,
  getMenuItemById,
  getOrderById,
  updateOrderById
} from "../models/db.js";
import { AppError } from "../middleware/AppError.js";
import { ORDER_STATUSES, STATUS_FLOW } from "./orderStatus.js";

const roundToTwoDecimals = (value) => Math.round(value * 100) / 100;

export const createOrder = async ({ items, deliveryDetails }) => {
  let totalPrice = 0;

  const normalizedItems = items.map(({ menuItemId, quantity }) => {
    const menuItem = getMenuItemById(menuItemId);
    if (!menuItem) {
      throw new AppError(`Invalid menu item: ${menuItemId}`, 400);
    }

    const lineTotal = menuItem.price * quantity;
    totalPrice += lineTotal;

    return {
      menuItemId,
      quantity,
      unitPrice: menuItem.price,
      lineTotal: roundToTwoDecimals(lineTotal),
      name: menuItem.name
    };
  });

  const order = createOrderRecord({
    items: normalizedItems,
    deliveryDetails,
    totalPrice: roundToTwoDecimals(totalPrice),
    status: ORDER_STATUSES.ORDER_RECEIVED,
    estimatedTime: "30-40 mins"
  });

  return order;
};

export const getOrder = async (orderId) => {
  const order = getOrderById(orderId);
  if (!order) {
    throw new AppError("Order not found", 404);
  }
  return order;
};

export const listOrders = async () => getAllOrders();

export const updateOrderStatus = async (orderId, status) => {
  if (!STATUS_FLOW.includes(status)) {
    throw new AppError("Invalid order status", 400);
  }

  const updatedOrder = updateOrderById(orderId, { status });
  if (!updatedOrder) {
    throw new AppError("Order not found", 404);
  }

  return updatedOrder;
};
