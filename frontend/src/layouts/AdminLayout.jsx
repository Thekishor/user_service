import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">
        <span className="text-xl font-bold text-blue-600">KIKO</span>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-1 text-gray-600"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
      </div>

      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="ml-0 md:ml-64 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
