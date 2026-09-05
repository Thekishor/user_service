import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AppContext";

const AdminSidebar = () => {
  const { logout, logoutAll } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow">
      <div className="border-b px-6 py-5">
        <h1 className="text-2xl font-bold text-blue-600">KIKO</h1>
        <p className="mt-1 text-sm text-gray-500">Admin Dashboard</p>
      </div>
      <nav className="space-y-1 px-3 py-5">
        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/dashboard/profile"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="/admin/dashboard/users"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/dashboard/change-password"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          Change Password
        </NavLink>

        <NavLink
          to="/admin/dashboard/audit-logs"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          Admin Activity
        </NavLink>

        <button
          type="button"
          onClick={logout}
          className="block w-full rounded-lg px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
        <button
          type="button"
          onClick={logoutAll}
          className="block w-full rounded-lg px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100"
        >
          Log out all
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
