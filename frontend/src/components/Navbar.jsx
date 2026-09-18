import { Link } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg
                     bg-blue-600 text-sm font-bold text-white shadow-sm
                     transition hover:bg-blue-700"
            >
              K
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-800">
              KIKO
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-2 sm:flex">
            {!user ? (
              <>
                <Link
                  to="/"
                  className="rounded-lg px-3 py-2 text-sm font-medium
                         text-slate-600 transition hover:bg-slate-100
                         hover:text-slate-900"
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  className="rounded-lg px-3 py-2 text-sm font-medium
                         text-slate-600 transition hover:bg-slate-100
                         hover:text-slate-900"
                >
                  About
                </Link>

                <Link
                  to="/contact"
                  className="rounded-lg px-3 py-2 text-sm font-medium
                         text-slate-600 transition hover:bg-slate-100
                         hover:text-slate-900"
                >
                  Contact
                </Link>

                <Link
                  to="/login"
                  className="ml-2 rounded-lg px-4 py-2 text-sm font-medium
                         text-slate-600 transition hover:bg-slate-100
                         hover:text-slate-900"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm
                         font-semibold text-white shadow-sm transition
                         hover:-translate-y-0.5 hover:bg-blue-700
                         hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  className="rounded-lg px-4 py-2 text-sm font-medium
                         text-slate-600 transition hover:bg-slate-100
                         hover:text-slate-900"
                >
                  Dashboard
                </Link>

                <span className="ml-2 border-l border-slate-200 pl-4 text-sm text-slate-600">
                  Welcome,{" "}
                  <span className="font-semibold text-slate-800">
                    {user.fullName}
                  </span>
                </span>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="rounded-lg p-2 text-slate-600 transition
                   hover:bg-slate-100 hover:text-slate-900 sm:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="border-t border-slate-100 py-4 sm:hidden">
            {!user ? (
              <div className="flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium
                         text-slate-600 transition hover:bg-slate-100
                         hover:text-slate-900"
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium
                         text-slate-600 transition hover:bg-slate-100
                         hover:text-slate-900"
                >
                  About
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium
                         text-slate-600 transition hover:bg-slate-100
                         hover:text-slate-900"
                >
                  Contact
                </Link>

                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded-lg px-3 py-2.5 text-sm font-medium
                         text-slate-600 transition hover:bg-slate-100
                         hover:text-slate-900"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded-lg bg-blue-600 px-3 py-2.5
                         text-center text-sm font-semibold text-white
                         transition hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="px-3 py-2 text-sm text-slate-500">
                  Welcome,{" "}
                  <span className="font-semibold text-slate-800">
                    {user.fullName}
                  </span>
                </div>

                <Link
                  to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium
                         text-slate-600 transition hover:bg-slate-100
                         hover:text-slate-900"
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
