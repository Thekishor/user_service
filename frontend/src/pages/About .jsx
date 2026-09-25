import { features } from "../services/about.features";

const About = () => {
  return (
    <section className="min-h-screen bg-slate-100 px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center text-3xl font-bold text-slate-800 sm:text-4xl">
          About This Application
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          A secure user management system built with modern web technologies.
        </p>

        <div className="mt-10 space-y-6">
          {/* About */}
          <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 transition duration-150 hover:-translate-y-0.5 hover:shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 transition duration-150 group-hover:text-slate-900">
              What is this application?
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              This application is a full-stack user management and
              authentication system designed to provide secure account
              management. Users can register, log in, verify their email,
              recover their password, and manage their profile information.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              It also includes administrative features for managing users and
              monitoring account activity.
            </p>
          </div>

          {/* Features */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 shadow-lg sm:p-10">
            <div className="mb-8">
              <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                What it offers
              </span>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Key Features
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                Everything needed to build a secure and reliable user management
                system.
              </p>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <li
                    key={feature.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}
                    >
                      <Icon
                        className={`h-6 w-6 ${feature.color} transition duration-200 group-hover:scale-110`}
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Technology */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-800">
              Technology Stack
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Node.js",
                "Express",
                "TypeScript",
                "MongoDB",
                "Mongoose",
                "React",
                "Vite",
                "Tailwind CSS",
                "Redis",
                "BullMQ",
                "Cloudinary",
                "Resend",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-transparent bg-slate-100 px-3 py-1.5
                            text-sm font-medium text-slate-700
                            transition duration-200
                          hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Purpose */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-800">
              Project Purpose
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              The project was built to demonstrate practical full-stack
              development, including REST API development, authentication,
              authorization, database management, background jobs, caching,
              rate-limiting, security, and deployment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
