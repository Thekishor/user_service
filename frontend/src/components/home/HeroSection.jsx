import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-28">
      {/* Background glow */}
      <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100 blur-3xl" />

      {/* Badge */}
      <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
        <Lock size={16} />
        Secure & Simple
      </div>

      <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
        Manage Your <span className="text-blue-600">Account</span> Easily
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
        A simple and secure platform to manage your account, profile, and
        sessions — all in one place.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          to="/login"
          className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white shadow-sm transition hover:-translate-y-1 hover:bg-gray-800 sm:w-auto"
        >
          Get Started
        </Link>

        <Link
          to="/about"
          className="w-full rounded-lg border bg-white px-6 py-3 font-medium transition hover:-translate-y-1 hover:bg-gray-50 sm:w-auto"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
