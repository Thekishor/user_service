import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="px-6 py-24 text-center">
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">
        Manage Your Account Easily
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
        A simple and secure platform to manage your account, profile, and
        sessions.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/login"
          className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Get Started
        </Link>
        <Link
          to="/about"
          className="rounded-lg border px-6 py-3 hover:bg-gray-50"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
