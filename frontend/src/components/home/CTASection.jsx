import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";

const CTASection = () => {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-300 px-6 py-14 text-center shadow-sm sm:px-10 sm:py-16">
        <div className="relative">
          {/* Icon */}
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center
                          rounded-xl bg-slate-100"
          >
            <ShieldCheck className="h-6 w-6 text-slate-700" />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-800 sm:text-4xl">
            Take control of your account
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Create your account to securely manage your profile, access your
            account, and keep your information organized.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg
                         bg-slate-800 px-6 py-3 text-sm font-semibold text-white
                         shadow-sm transition hover:-translate-y-0.5
                         hover:bg-slate-900 hover:shadow-md"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg
                         border border-slate-200 bg-white px-6 py-3 text-sm
                         font-semibold text-slate-700 transition
                         hover:-translate-y-0.5 hover:bg-slate-50
                         hover:shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
