import { Link } from "react-router-dom";
import { useAuth } from "../context/AppContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className=" bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="text-xl font-bold text-blue-600"
        >
          KIKO
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>

              <Link to="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>

              <Link to="/contact" className="text-gray-600 hover:text-blue-600">
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
                to="/dashboard"
                className="text-gray-600 hover:text-blue-600"
              >
                Dashboard
              </Link>

              <span className="text-gray-700">Welcome, {user.fullName}</span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
