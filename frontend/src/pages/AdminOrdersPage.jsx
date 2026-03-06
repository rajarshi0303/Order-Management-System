import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrders, updateOrderStatus } from "../api/ordersApi.js";
import { STATUS_FLOW } from "../components/StatusTimeline.jsx";

const formatStatus = (status) => status.replaceAll("_", " ");

const AdminOrdersPage = () => {
  const queryClient = useQueryClient();
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000
  });

  const mutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <section className="mb-6">
        <h1 className="text-3xl font-bold text-stone-900">Admin Order Dashboard</h1>
        <p className="mt-1 text-sm text-stone-600">
          Manage live order statuses for restaurant operations.
        </p>
      </section>

      {isLoading && <p>Loading orders...</p>}
      {error && <p className="text-red-600">Unable to load orders.</p>}

      {!isLoading && !error && orders?.length === 0 && (
        <section className="card p-5">
          <p className="text-stone-600">No orders found yet.</p>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {orders?.map((order) => (
          <article key={order.id} className="card p-5">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold text-stone-900">Order #{order.id}</h2>
                <p className="text-sm text-stone-500">Placed: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                {formatStatus(order.status)}
              </span>
            </div>

            <ul className="mb-4 space-y-2 text-sm text-stone-700">
              {order.items.map((item) => (
                <li key={`${order.id}-${item.menuItemId}`}>
                  {item.quantity}x {item.name}
                </li>
              ))}
            </ul>

            <p className="mb-2 text-sm text-stone-700">
              <span className="font-semibold">Customer:</span> {order.deliveryDetails.name}
            </p>
            <p className="mb-2 text-sm text-stone-700">
              <span className="font-semibold">Phone:</span> {order.deliveryDetails.phone}
            </p>
            <p className="mb-4 text-sm text-stone-700">
              <span className="font-semibold">Address:</span> {order.deliveryDetails.address}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {STATUS_FLOW.map((status) => (
                <button
                  key={`${order.id}-${status}`}
                  type="button"
                  onClick={() => mutation.mutate({ orderId: order.id, status })}
                  disabled={mutation.isPending || order.status === status}
                  className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
                    order.status === status
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:border-brand-600 hover:text-brand-700"
                  }`}
                >
                  {formatStatus(status)}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default AdminOrdersPage;
