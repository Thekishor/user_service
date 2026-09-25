import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center
                           rounded-lg bg-blue-600 text-sm font-bold
                           text-white shadow-xs"
              >
                K
              </div>

              <span className="text-xl font-bold tracking-tight text-slate-800">
                KIKO
              </span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
              A simple and secure user management system built for reliable
              account and profile management.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Navigation
            </h3>

            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                to="/"
                className="w-fit text-sm text-slate-500 transition duration-150 hover:text-blue-600"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="w-fit text-sm text-slate-500 transition duration-150 hover:text-blue-600"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="w-fit text-sm text-slate-500 transition duration-150 hover:text-blue-600"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Account
            </h3>

            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                to="/login"
                className="w-fit text-sm text-slate-500 transition duration-150 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="w-fit text-sm text-slate-500 transition duration-150 hover:text-blue-600"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Connect
            </h3>

            <div className="mt-4 flex flex-col gap-2.5">
              <a
                href="https://github.com/Thekishor"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex w-fit items-center gap-2 text-sm text-slate-500 transition duration-150 hover:text-slate-900"
              >
                <FaGithub className="h-4 w-4" />
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/kishor-pandey-209a9323b/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex w-fit items-center gap-2 text-sm text-slate-500 transition duration-150 hover:text-blue-600"
              >
                <FaLinkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-slate-100 pt-6">
          <div
            className="flex flex-col items-center justify-between gap-3
                          text-center sm:flex-row sm:text-left"
          >
            <p className="text-xs text-slate-400">
              © 2026 KIKO. All rights reserved.
            </p>

            <p className="text-xs text-slate-400">
              Built with modern web technologies.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
