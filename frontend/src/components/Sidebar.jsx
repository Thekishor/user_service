import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import { X } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, logoutAll } = useAuth();

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r shadow transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">KIKO</h1>
            <p className="mt-1 text-sm text-gray-500">User Dashboard</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="px-3 py-5">
          <NavLink
            to="/dashboard"
            end
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-4 text-base font-medium transition ${
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
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-4 text-base font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/dashboard/change-password"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-4 text-base font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            Change Password
          </NavLink>

          <NavLink
            to="/dashboard/audit-logs"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-4 text-base font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            User Activity
          </NavLink>

          <button
            type="button"
            onClick={() => {
              handleLinkClick();
              logout();
            }}
            className="block w-full rounded-lg px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
          <button
            type="button"
            onClick={() => {
              handleLinkClick();
              logoutAll();
            }}
            className="block w-full rounded-lg px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100"
          >
            Log out all
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
