import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import {
  LayoutDashboard,
  User,
  Users,
  Lock,
  Activity,
  LogOut,
  X,
  ShieldCheck,
} from "lucide-react";

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout, logoutAll } = useAuth();

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const navLinks = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    { to: "/admin/dashboard/profile", label: "Profile", icon: User },
    { to: "/admin/dashboard/users", label: "Users", icon: Users },
    {
      to: "/admin/dashboard/change-password",
      label: "Change Password",
      icon: Lock,
    },
    {
      to: "/admin/dashboard/audit-logs",
      label: "Admin Activity",
      icon: Activity,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-xs transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg
               bg-blue-600 text-sm font-bold text-white shadow-sm"
            >
              K
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-800">
              KIKO
            </span>
            <span className="flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 border border-purple-100">
              <ShieldCheck size={12} />
              Admin
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto p-3">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Admin Menu
          </p>
          <nav className="space-y-1">
            {navLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 p-3 space-y-1 bg-gray-50/50">
          <button
            type="button"
            onClick={() => {
              handleLinkClick();
              logout();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Logout</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleLinkClick();
              logoutAll();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-200/60 hover:text-gray-800 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Log out all</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
