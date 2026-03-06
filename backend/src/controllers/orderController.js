import {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus
} from "../services/orderService.js";
import { emitOrderStatusUpdate } from "../sockets/socketRegistry.js";

export const postOrder = async (req, res, next) => {
  try {
    const order = await createOrder(req.body);

    emitOrderStatusUpdate(order.id, order.status);

    res.status(201).json({
      orderId: order.id,
      status: order.status,
      estimatedTime: order.estimatedTime
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await getOrder(req.params.id);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (_req, res, next) => {
  try {
    const orders = await listOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const patchOrderStatus = async (req, res, next) => {
  try {
    const order = await updateOrderStatus(req.params.id, req.body.status);
    emitOrderStatusUpdate(order.id, order.status);
    res.json({
      orderId: order.id,
      status: order.status
    });
  } catch (error) {
    next(error);
  }
};
