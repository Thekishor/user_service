import { CheckCircle2 } from "lucide-react";

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
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-800">
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
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-800">
              Key Features
            </h2>

            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "User registration and login",
                "Email verification",
                "Password recovery",
                "Profile management",
                "Secure authentication",
                "Admin user management",
                "Audit log tracking",
                "Rate limiting and security controls",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 rounded-lg border border-slate-200
                 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                  <span>{feature}</span>
                </li>
              ))}
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
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-sm
                         font-medium text-slate-700"
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
