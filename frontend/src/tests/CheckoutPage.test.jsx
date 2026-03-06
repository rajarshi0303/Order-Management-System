import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import { createOrder } from "../api/ordersApi.js";

jest.mock("../api/ordersApi.js", () => ({
  createOrder: jest.fn().mockResolvedValue({
    orderId: "order-1",
    status: "ORDER_RECEIVED",
    estimatedTime: "30-40 mins"
  })
}));

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => jest.fn()
  };
});

const mockCartState = {
  items: [],
  clearCart: jest.fn(),
  totalPrice: jest.fn(() =>
    mockCartState.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )
};

jest.mock("../store/cartStore.js", () => ({
  useCartStore: (selector) => selector(mockCartState)
}));

const renderPage = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("CheckoutPage", () => {
  beforeEach(() => {
    mockCartState.items = [
      {
        id: "pizza-margherita",
        name: "Pizza",
        price: 10,
        quantity: 2,
        imageUrl: "",
        description: ""
      }
    ];
    mockCartState.clearCart.mockClear();
    createOrder.mockClear();
  });

  it("submits checkout payload", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/name/i), "Alex Doe");
    await user.type(screen.getByLabelText(/address/i), "123 Main St");
    await user.type(screen.getByLabelText(/phone/i), "1234567890");
    await user.click(screen.getByRole("button", { name: /place order/i }));

    expect(createOrder).toHaveBeenCalled();
    expect(createOrder.mock.calls.at(-1)[0]).toEqual({
      items: [{ menuItemId: "pizza-margherita", quantity: 2 }],
      deliveryDetails: {
        name: "Alex Doe",
        address: "123 Main St",
        phone: "1234567890"
      }
    });
  });
});
