const MenuItemCard = ({ item, onAdd }) => (
  <article className="card overflow-hidden">
    <img src={item.imageUrl} alt={item.name} className="h-44 w-full object-cover" />
    <div className="space-y-2 p-4">
      <h3 className="text-lg font-semibold text-stone-900">{item.name}</h3>
      <p className="text-sm text-stone-600">{item.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-brand-700">${item.price.toFixed(2)}</span>
        <button
          onClick={() => onAdd(item)}
          className="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </article>
);

export default MenuItemCard;
