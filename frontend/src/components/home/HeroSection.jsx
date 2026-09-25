import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-28">
      {/* Background glow */}
      <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />

      {/* Badge */}
      <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50/60 px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-700 shadow-xs">
        <Lock size={15} className="text-blue-600" />
        Secure & Simple
      </div>

      <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
        Manage Your <span className="text-blue-600">Account</span> Easily
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
        A simple and secure platform to manage your account, profile, and
        sessions — all in one place.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/login"
          className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-xs transition duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md sm:w-auto"
        >
          Get Started
        </Link>

        <Link
          to="/about"
          className="w-full rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-xs transition duration-150 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
