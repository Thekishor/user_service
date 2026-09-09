import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 px-8 py-12 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Ready to get started?
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Create your account and start managing your profile securely and
          effortlessly.
        </p>

        <Link
          to="/register"
          className="mt-7 inline-flex items-center rounded-lg bg-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
