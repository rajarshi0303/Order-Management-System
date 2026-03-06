import request from "supertest";
import app from "../app.js";
import { resetDb } from "../models/db.js";
import { ORDER_STATUSES } from "../services/orderStatus.js";

describe("Order management API", () => {
  beforeEach(() => {
    resetDb();
  });

  it("returns seeded menu items", async () => {
    const response = await request(app).get("/api/menu").expect(200);

    expect(response.body).toHaveLength(6);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        imageUrl: expect.any(String)
      })
    );
  });

  it("creates an order with calculated total and initial status", async () => {
    const payload = {
      items: [
        { menuItemId: "pizza-margherita", quantity: 2 },
        { menuItemId: "crispy-fries", quantity: 1 }
      ],
      deliveryDetails: {
        name: "Alex Doe",
        address: "101 Main St",
        phone: "1234567890"
      }
    };

    const response = await request(app).post("/api/orders").send(payload).expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        orderId: expect.any(String),
        status: ORDER_STATUSES.ORDER_RECEIVED,
        estimatedTime: expect.any(String)
      })
    );

    const orderLookup = await request(app)
      .get(`/api/orders/${response.body.orderId}`)
      .expect(200);

    expect(orderLookup.body.totalPrice).toBe(26.99);
    expect(orderLookup.body.items).toHaveLength(2);
  });

  it("rejects malformed order payload", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        items: [],
        deliveryDetails: {
          name: "",
          address: "",
          phone: "abc"
        }
      })
      .expect(400);

    expect(response.body.error).toBe("Validation failed");
    expect(response.body.details.length).toBeGreaterThan(0);
  });

  it("returns 404 for unknown order", async () => {
    const response = await request(app).get("/api/orders/missing-id").expect(404);

    expect(response.body.error).toBe("Order not found");
  });

  it("updates order status via admin endpoint", async () => {
    const createResponse = await request(app)
      .post("/api/orders")
      .send({
        items: [{ menuItemId: "veggie-pasta", quantity: 1 }],
        deliveryDetails: {
          name: "Pat",
          address: "202 High St",
          phone: "9876543210"
        }
      })
      .expect(201);

    const patchResponse = await request(app)
      .patch(`/api/orders/${createResponse.body.orderId}/status`)
      .send({ status: ORDER_STATUSES.OUT_FOR_DELIVERY })
      .expect(200);

    expect(patchResponse.body.status).toBe(ORDER_STATUSES.OUT_FOR_DELIVERY);
  });

  it("lists all orders for admin dashboard", async () => {
    const firstOrder = await request(app)
      .post("/api/orders")
      .send({
        items: [{ menuItemId: "veggie-pasta", quantity: 1 }],
        deliveryDetails: {
          name: "Lee",
          address: "7 River St",
          phone: "9988776655"
        }
      })
      .expect(201);

    await request(app)
      .post("/api/orders")
      .send({
        items: [{ menuItemId: "smoky-burger", quantity: 1 }],
        deliveryDetails: {
          name: "Kim",
          address: "8 River St",
          phone: "8899776655"
        }
      })
      .expect(201);

    const listResponse = await request(app).get("/api/orders").expect(200);

    expect(listResponse.body).toHaveLength(2);
    expect(listResponse.body[0]).toEqual(expect.objectContaining({ id: expect.any(String) }));
    expect(listResponse.body.some((order) => order.id === firstOrder.body.orderId)).toBe(true);
  });
});
