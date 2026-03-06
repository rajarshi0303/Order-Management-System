import { useQuery } from "@tanstack/react-query";
import { fetchMenu } from "../api/ordersApi.js";
import MenuItemCard from "../components/MenuItemCard.jsx";
import CartSidebar from "../components/CartSidebar.jsx";
import { useCartStore } from "../store/cartStore.js";

const MenuPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenu
  });

  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalPrice = useCartStore((state) => state.totalPrice)();

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
      <section>
        <h1 className="mb-4 text-3xl font-bold text-stone-900">Food Menu</h1>

        {isLoading && <p>Loading menu...</p>}
        {error && <p className="text-red-600">Failed to load menu.</p>}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data?.map((item) => (
            <MenuItemCard key={item.id} item={item} onAdd={addItem} />
          ))}
        </div>
      </section>

      <CartSidebar
        items={items}
        totalPrice={totalPrice}
        onQuantityChange={updateQuantity}
        onRemove={removeItem}
      />
    </main>
  );
};

export default MenuPage;
