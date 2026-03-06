import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderTrackingPage from "./pages/OrderTrackingPage.jsx";
import AdminOrdersPage from "./pages/AdminOrdersPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";

const App = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route path="/" element={<MenuPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order/:id" element={<OrderTrackingPage />} />
      <Route path="/my-orders" element={<MyOrdersPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
