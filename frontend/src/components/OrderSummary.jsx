const OrderSummary = ({ items, total }) => (
  <section className="card p-4">
    <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
    {items.map((item) => (
      <div key={item.id} className="mb-2 flex justify-between text-sm">
        <span>
          {item.name} x{item.quantity}
        </span>
        <span>${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ))}
    <div className="mt-3 border-t border-stone-200 pt-3 font-semibold">
      Total: ${total.toFixed(2)}
    </div>
  </section>
);

export default OrderSummary;
