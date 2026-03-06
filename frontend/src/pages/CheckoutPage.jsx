import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/ordersApi.js";
import { useCartStore } from "../store/cartStore.js";
import OrderSummary from "../components/OrderSummary.jsx";

const initialForm = { name: "", address: "", phone: "" };
const CUSTOMER_ORDERS_KEY = "customerOrderIds";

const CheckoutPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = useCartStore((state) => state.totalPrice)();

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      const storedOrderIds = JSON.parse(window.localStorage.getItem(CUSTOMER_ORDERS_KEY) || "[]");
      const nextOrderIds = [data.orderId, ...storedOrderIds.filter((orderId) => orderId !== data.orderId)];
      window.localStorage.setItem(CUSTOMER_ORDERS_KEY, JSON.stringify(nextOrderIds));
      clearCart();
      navigate(`/order/${data.orderId}`);
    }
  });

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.address.trim()) nextErrors.address = "Address is required";
    if (!/^\+?[0-9\-\s]{7,15}$/.test(form.phone)) nextErrors.phone = "Phone is invalid";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (items.length === 0) {
      setErrors({ submit: "Cart cannot be empty" });
      return;
    }

    if (!validate()) {
      return;
    }

    mutation.mutate({
      items: items.map((item) => ({ menuItemId: item.id, quantity: item.quantity })),
      deliveryDetails: form
    });
  };

  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 md:grid-cols-2">
      <section className="card p-4">
        <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm font-medium">
            Name
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
            />
            {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
          </label>

          <label className="block text-sm font-medium">
            Address
            <input
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
            />
            {errors.address && <span className="text-xs text-red-600">{errors.address}</span>}
          </label>

          <label className="block text-sm font-medium">
            Phone
            <input
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
            />
            {errors.phone && <span className="text-xs text-red-600">{errors.phone}</span>}
          </label>

          {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
          {mutation.isError && <p className="text-sm text-red-600">Order creation failed.</p>}

          <button
            type="submit"
            className="rounded-md bg-brand-600 px-4 py-2 font-semibold text-white"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Placing..." : "Place Order"}
          </button>
        </form>
      </section>

      <OrderSummary items={items} total={total} />
    </main>
  );
};

export default CheckoutPage;
