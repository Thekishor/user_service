import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";

const CTASection = () => {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/70 px-6 py-12 text-center shadow-xs sm:px-10 sm:py-16">
        <div className="relative">
          {/* Icon */}
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center
                          rounded-xl border border-slate-200/80 bg-white shadow-xs"
          >
            <ShieldCheck className="h-6 w-6 text-blue-600" />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Take control of your account
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Create your account to securely manage your profile, access your
            account, and keep your information organized.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg
                         bg-blue-600 px-6 py-3 text-sm font-medium text-white
                         shadow-xs transition duration-150 hover:-translate-y-0.5
                         hover:bg-blue-700 hover:shadow-md"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg
                         border border-slate-200 bg-white px-6 py-3 text-sm
                         font-medium text-slate-700 shadow-xs transition duration-150
                         hover:-translate-y-0.5 hover:bg-slate-50
                         hover:text-slate-900"
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
