import { Link } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import { Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top row */}
        <div className="flex h-16 items-center justify-between">
          <Link
            to={user ? "/dashboard" : "/"}
            className="text-xl font-bold text-blue-600"
          >
            KIKO
          </Link>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-6">
            {!user ? (
              <>
                <Link to="/" className="text-gray-600 hover:text-blue-600">
                  Home
                </Link>

                <Link to="/about" className="text-gray-600 hover:text-blue-600">
                  About
                </Link>

                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Contact
                </Link>

                <Link to="/login" className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Dashboard
                </Link>

                <span className="text-gray-700">Welcome, {user.fullName}</span>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            className="sm:hidden"
          >
            <Menu />
          </button>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="flex flex-col gap-4 p-4 sm:hidden">
            {!user && (
              <>
                <Link to="/" className="text-gray-600 hover:text-blue-600">
                  Home
                </Link>

                <Link to="/about" className="text-gray-600 hover:text-blue-600">
                  About
                </Link>

                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Contact
                </Link>

                <Link to="/login" className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
