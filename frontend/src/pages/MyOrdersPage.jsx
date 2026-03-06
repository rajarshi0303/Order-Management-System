import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { fetchOrderById } from "../api/ordersApi.js";

const STORAGE_KEY = "customerOrderIds";

const formatStatus = (status) => status.replaceAll("_", " ");

const MyOrdersPage = () => {
  const orderIds = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");

  const queries = useQueries({
    queries: orderIds.map((orderId) => ({
      queryKey: ["order", orderId],
      queryFn: () => fetchOrderById(orderId),
      refetchInterval: 5000
    }))
  });

  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.isError);
  const orders = queries
    .map((query) => query.data)
    .filter(Boolean)
    .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime());

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-stone-900">My Orders</h1>
      <p className="mb-6 text-sm text-stone-600">Track your placed orders and current statuses.</p>

      {orderIds.length === 0 && (
        <section className="card p-5">
          <p className="text-stone-600">No orders yet. Place one from the menu to see it here.</p>
        </section>
      )}

      {isLoading && <p>Loading orders...</p>}
      {hasError && <p className="text-red-600">Some orders could not be loaded.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-stone-900">Order #{order.id}</h2>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                {formatStatus(order.status)}
              </span>
            </div>
            <p className="mt-2 text-sm text-stone-600">Placed: {new Date(order.createdAt).toLocaleString()}</p>
            <Link to={`/order/${order.id}`} className="mt-3 inline-block text-sm font-semibold text-brand-700">
              Open Live Tracking
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
};

export default MyOrdersPage;
