import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AppContext";

const Sidebar = () => {
  const { logout, logoutAll } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow">
      <div className="border-b px-6 py-5">
        <h1 className="text-2xl font-bold text-blue-600">KIKO</h1>
        <p className="mt-1 text-sm text-gray-500">User Dashboard</p>
      </div>
      <nav className="space-y-1 px-3 py-5">
        <NavLink
          to="/dashboard"
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
          to="/dashboard/profile"
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
          to="/dashboard/user-info"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          User Information
        </NavLink>

        <NavLink
          to="/dashboard/change-password"
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

export default Sidebar;
