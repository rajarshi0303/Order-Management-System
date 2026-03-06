import { ORDER_STATUSES, STATUS_FLOW } from "./orderStatus.js";

export const runAutoStatusUpdates = ({
  orderId,
  updateOrderStatus,
  emitOrderStatusUpdate,
  intervalMs = 4000
}) => {
  let statusIndex = STATUS_FLOW.indexOf(ORDER_STATUSES.ORDER_RECEIVED);

  const timer = setInterval(() => {
    statusIndex += 1;
    const nextStatus = STATUS_FLOW[statusIndex];

    if (!nextStatus) {
      clearInterval(timer);
      return;
    }

    updateOrderStatus(orderId, nextStatus);
    emitOrderStatusUpdate(orderId, nextStatus);

    if (nextStatus === ORDER_STATUSES.DELIVERED) {
      clearInterval(timer);
    }
  }, intervalMs);

  return timer;
};
