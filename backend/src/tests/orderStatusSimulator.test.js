import { jest } from "@jest/globals";
import { ORDER_STATUSES } from "../services/orderStatus.js";
import { runAutoStatusUpdates } from "../services/orderStatusSimulator.js";

describe("runAutoStatusUpdates", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("emits sequential status updates and stops at delivered", () => {
    const updateOrderStatus = jest.fn();
    const emitOrderStatusUpdate = jest.fn();

    runAutoStatusUpdates({
      orderId: "order-1",
      updateOrderStatus,
      emitOrderStatusUpdate,
      intervalMs: 1000
    });

    jest.advanceTimersByTime(3000);

    expect(updateOrderStatus).toHaveBeenNthCalledWith(1, "order-1", ORDER_STATUSES.PREPARING);
    expect(updateOrderStatus).toHaveBeenNthCalledWith(2, "order-1", ORDER_STATUSES.OUT_FOR_DELIVERY);
    expect(updateOrderStatus).toHaveBeenNthCalledWith(3, "order-1", ORDER_STATUSES.DELIVERED);

    expect(emitOrderStatusUpdate).toHaveBeenNthCalledWith(1, "order-1", ORDER_STATUSES.PREPARING);
    expect(emitOrderStatusUpdate).toHaveBeenNthCalledWith(2, "order-1", ORDER_STATUSES.OUT_FOR_DELIVERY);
    expect(emitOrderStatusUpdate).toHaveBeenNthCalledWith(3, "order-1", ORDER_STATUSES.DELIVERED);
  });
});
