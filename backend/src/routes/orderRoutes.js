import { Router } from "express";
import {
  getOrders,
  getOrderById,
  patchOrderStatus,
  postOrder
} from "../controllers/orderController.js";
import {
  validateCreateOrder,
  validateOrderStatusPatch
} from "../middleware/validateOrderRequest.js";

const orderRouter = Router();

orderRouter.post("/", validateCreateOrder, postOrder);
orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrderById);
orderRouter.patch("/:id/status", validateOrderStatusPatch, patchOrderStatus);

export default orderRouter;
