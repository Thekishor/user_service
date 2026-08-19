import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="px-6 py-16 text-center">
      <h2 className="text-xl font-semibold text-slate-500">
        Ready to get started?
      </h2>
      <p className="mt-2 text-sm font-medium">
        Create your account and start managing your profile securely.
      </p>
      <div className="mt-6">
        <Link
          to="/register"
          className="inline-block rounded-lg bg-slate-700 px-6 py-3 text-white hover:bg-slate-800"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
