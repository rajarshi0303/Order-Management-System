import { Link, useParams } from "react-router-dom";
import StatusTimeline from "../components/StatusTimeline.jsx";
import { useOrderTracking } from "../hooks/useOrderTracking.js";

const OrderTrackingPage = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useOrderTracking(id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="text-sm font-medium text-brand-700">
        Back to menu
      </Link>

      {isLoading && <p className="mt-4">Loading order...</p>}
      {error && <p className="mt-4 text-red-600">Unable to load order.</p>}

      {order && (
        <section className="card mt-4 space-y-4 p-5">
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-sm text-stone-600">Estimated delivery: {order.estimatedTime}</p>
          <StatusTimeline currentStatus={order.status} />
        </section>
      )}
    </main>
  );
};

export default OrderTrackingPage;
