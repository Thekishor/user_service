import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu, ShieldCheck } from "lucide-react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">
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
            User
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-1 text-gray-600"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="ml-0 md:ml-64 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
