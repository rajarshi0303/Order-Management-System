# Food Delivery Order Management (Vertical Slice)

Production-style order management feature with:
- React + Vite + Tailwind frontend
- Express REST API backend
- In-memory data model with service/controller separation
- Real-time order status updates via Socket.IO
- Backend and frontend tests using Jest

## Architecture

Backend (`/backend/src`):
- `controllers/` request handlers
- `routes/` API route definitions
- `services/` business logic and status simulator
- `models/` in-memory data store + seed data
- `sockets/` socket setup and event emission
- `middleware/` request validation + centralized error handling
- `tests/` Jest + Supertest test suites

Frontend (`/frontend/src`):
- `pages/` route-level screens (`/`, `/checkout`, `/order/:id`, `/admin/orders`)
- `components/` reusable UI blocks
- `api/` Axios API integration
- `store/` Zustand cart state persisted to sessionStorage
- `hooks/` order tracking with React Query + Socket.IO
- `tests/` Jest + React Testing Library

## Implemented Features

- Menu display (`GET /api/menu`) with responsive card grid
- Cart management (add, increment/decrement quantity, remove, total)
- Checkout form with frontend + backend validation
- Order placement (`POST /api/orders`) with computed total and initial status
- Order retrieval (`GET /api/orders/:id`)
- Admin order listing (`GET /api/orders`)
- Admin/test status update endpoint (`PATCH /api/orders/:id/status`)
- Admin dashboard for restaurant owner (`/admin/orders`) to update order status
- Auto status progression:
  - `ORDER_RECEIVED`
  - `PREPARING`
  - `OUT_FOR_DELIVERY`
  - `DELIVERED`
- Live order tracking page using Socket.IO room subscription by `orderId`

## Seed Menu Items

- Pizza Margherita
- Smoky Burger
- Veggie Pasta
- Club Sandwich
- Crispy Fries
- Choco Lava Dessert

## Setup

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:4000`.

### 2) Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Testing

Backend tests:
```bash
cd backend
npm test
```

Frontend tests:
```bash
cd frontend
npm test
```

## API Contract

### `GET /api/menu`
Returns menu array:

```json
[
  {
    "id": "pizza-margherita",
    "name": "Pizza Margherita",
    "description": "Classic pizza with tomato, mozzarella, and basil.",
    "price": 10.99,
    "imageUrl": "https://..."
  }
]
```

### `POST /api/orders`
Request:

```json
{
  "items": [{ "menuItemId": "pizza-margherita", "quantity": 2 }],
  "deliveryDetails": {
    "name": "Alex Doe",
    "address": "101 Main St",
    "phone": "1234567890"
  }
}
```

Response:

```json
{
  "orderId": "order-1",
  "status": "ORDER_RECEIVED",
  "estimatedTime": "30-40 mins"
}
```

### `GET /api/orders/:id`
Returns full order details including items, status, total, timestamps.

### `GET /api/orders`
Returns all created orders (latest first) for the admin dashboard.

### `PATCH /api/orders/:id/status`
Request:

```json
{ "status": "OUT_FOR_DELIVERY" }
```

Response:

```json
{ "orderId": "order-1", "status": "OUT_FOR_DELIVERY" }
```

## Real-Time Events

Client emits:
- `order:subscribe` `{ orderId }`
- `order:unsubscribe` `{ orderId }`

Server emits:
- `order:status` `{ orderId, status, updatedAt }`
