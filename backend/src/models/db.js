const seedMenuItems = [
  {
    id: "pizza-margherita",
    name: "Pizza Margherita",
    description: "Classic pizza with tomato, mozzarella, and basil.",
    price: 10.99,
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3"
  },
  {
    id: "smoky-burger",
    name: "Smoky Burger",
    description: "Beef patty burger with smoked cheddar and onions.",
    price: 8.99,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
  },
  {
    id: "veggie-pasta",
    name: "Veggie Pasta",
    description: "Penne pasta tossed with fresh vegetables and herbs.",
    price: 9.49,
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9"
  },
  {
    id: "club-sandwich",
    name: "Club Sandwich",
    description: "Triple-layer sandwich with chicken, lettuce, and tomato.",
    price: 7.99,
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af"
  },
  {
    id: "crispy-fries",
    name: "Crispy Fries",
    description: "Golden fries seasoned with sea salt.",
    price: 5.01,
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877"
  },
  {
    id: "choco-lava-dessert",
    name: "Choco Lava Dessert",
    description: "Warm chocolate cake with a molten center.",
    price: 6.5,
    imageUrl: "https://images.unsplash.com/photo-1617305855058-336d24456869"
  }
];

const cloneMenu = () => seedMenuItems.map((item) => ({ ...item }));

let menuItems = cloneMenu();
let orders = new Map();
let currentOrderId = 1;

export const getMenuItems = () => menuItems;

export const getMenuItemById = (id) => menuItems.find((item) => item.id === id);

export const createOrderRecord = (order) => {
  const orderId = `order-${currentOrderId++}`;
  const persistedOrder = {
    ...order,
    id: orderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  orders.set(orderId, persistedOrder);
  return persistedOrder;
};

export const getOrderById = (orderId) => orders.get(orderId);

export const getAllOrders = () =>
  Array.from(orders.values()).sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  );

export const updateOrderById = (orderId, data) => {
  const existingOrder = orders.get(orderId);
  if (!existingOrder) {
    return null;
  }
  const updatedOrder = {
    ...existingOrder,
    ...data,
    updatedAt: new Date().toISOString()
  };
  orders.set(orderId, updatedOrder);
  return updatedOrder;
};

export const resetDb = () => {
  menuItems = cloneMenu();
  orders = new Map();
  currentOrderId = 1;
};
