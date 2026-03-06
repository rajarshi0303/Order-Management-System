import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import MenuPage from "../pages/MenuPage.jsx";

jest.mock("../api/ordersApi.js", () => ({
  fetchMenu: jest.fn().mockResolvedValue([
    {
      id: "pizza-margherita",
      name: "Pizza",
      description: "Cheesy",
      price: 10,
      imageUrl: "https://example.com/pizza.jpg"
    }
  ])
}));

const mockCartState = {
  items: [],
  addItem: jest.fn((item) => {
    const existing = mockCartState.items.find((entry) => entry.id === item.id);
    if (existing) {
      existing.quantity += 1;
      return;
    }
    mockCartState.items.push({ ...item, quantity: 1 });
  }),
  updateQuantity: jest.fn((id, quantity) => {
    mockCartState.items = mockCartState.items
      .map((item) => (item.id === id ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
  }),
  removeItem: jest.fn((id) => {
    mockCartState.items = mockCartState.items.filter((item) => item.id !== id);
  }),
  totalPrice: jest.fn(() =>
    mockCartState.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )
};

jest.mock("../store/cartStore.js", () => ({
  useCartStore: (selector) => selector(mockCartState)
}));

const renderWithProviders = (component) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("MenuPage", () => {
  beforeEach(() => {
    mockCartState.items = [];
    mockCartState.addItem.mockClear();
    mockCartState.updateQuantity.mockClear();
    mockCartState.removeItem.mockClear();
  });

  it("renders menu and adds item to cart", async () => {
    const user = userEvent.setup();

    renderWithProviders(<MenuPage />);

    expect(await screen.findByText("Pizza")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(mockCartState.items).toHaveLength(1);
    expect(mockCartState.items[0].quantity).toBe(1);
  });

  it("increments quantity when adding same item again", async () => {
    const user = userEvent.setup();

    renderWithProviders(<MenuPage />);
    await screen.findByText("Pizza");

    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(mockCartState.items[0].quantity).toBe(2);
  });
});
