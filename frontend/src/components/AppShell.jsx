import { NavLink, Outlet } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-brand-600 text-white"
      : "text-stone-700 hover:bg-brand-100 hover:text-brand-700"
  }`;

const AppShell = () => (
  <div className="min-h-screen bg-brand-50">
    <header className="border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <p className="text-lg font-bold text-brand-700">Order Management</p>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navLinkClass} end>
            Menu
          </NavLink>
          <NavLink to="/my-orders" className={navLinkClass}>
            My Orders
          </NavLink>
          <NavLink to="/admin/orders" className={navLinkClass}>
            Admin Orders
          </NavLink>
        </nav>
      </div>
    </header>

    <Outlet />
  </div>
);

export default AppShell;
