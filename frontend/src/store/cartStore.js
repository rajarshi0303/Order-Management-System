import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const calculateTotal = (items) =>
  items.reduce((acc, item) => acc + item.price * item.quantity, 0);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (menuItem) => {
        const items = [...get().items];
        const existing = items.find((item) => item.id === menuItem.id);

        if (existing) {
          existing.quantity += 1;
        } else {
          items.push({ ...menuItem, quantity: 1 });
        }

        set({ items });
      },
      updateQuantity: (id, quantity) => {
        const items = get().items
          .map((item) => (item.id === id ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0);
        set({ items });
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      clearCart: () => set({ items: [] }),
      totalPrice: () => calculateTotal(get().items)
    }),
    {
      name: "food-cart-session",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
