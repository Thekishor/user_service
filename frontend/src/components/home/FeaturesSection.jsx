import { features } from "../../services/features.js";

const FeaturesSection = () => {
  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">
            Everything You Need
          </h2>
          <p className="mt-3 text-slate-500">
            Simple tools to manage your account securely.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-slate-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:bg-slate-200"
              >
                <Icon className="mb-4 h-6 w-6 text-slate-700" />

                <h3 className="text-lg font-semibold text-slate-800">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
