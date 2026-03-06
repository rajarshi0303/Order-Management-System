import { Link } from "react-router-dom";

const CartSidebar = ({ items, totalPrice, onQuantityChange, onRemove }) => (
  <aside className="card h-fit p-4">
    <h2 className="mb-4 text-lg font-semibold">Cart</h2>
    {items.length === 0 ? (
      <p className="text-sm text-stone-500">Your cart is empty.</p>
    ) : (
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-stone-200 p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-stone-600">${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-sm text-red-600"
              >
                Remove
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                className="rounded border border-stone-300 px-2"
              >
                -
              </button>
              <span className="text-sm">{item.quantity}</span>
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                className="rounded border border-stone-300 px-2"
              >
                +
              </button>
            </div>
          </div>
        ))}

        <div className="mt-4 border-t border-stone-200 pt-3">
          <p className="font-semibold">Total: ${totalPrice.toFixed(2)}</p>
          <Link
            to="/checkout"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Go to Checkout
          </Link>
        </div>
      </div>
    )}
  </aside>
);

export default CartSidebar;
