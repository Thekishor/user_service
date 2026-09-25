import { features } from "../../services/features.js";

const FeaturesSection = () => {
  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Everything You Need
          </h2>
          <p className="mt-2 text-slate-500">
            Simple tools to manage your account securely.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50/80 text-blue-600 transition duration-200 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-5 w-5 transition duration-200" />
                </div>

                <h3 className="text-lg font-semibold text-slate-800 transition duration-200 group-hover:text-blue-600">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
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
