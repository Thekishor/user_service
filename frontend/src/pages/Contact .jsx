import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <section className="min-h-screen bg-slate-100 px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center text-3xl font-bold text-slate-800 sm:text-4xl">
          Contact Us
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
          Have a question, feedback, or need help? Feel free to get in touch.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Email */}
          <a
            href="mailto:kishorpandey981@gmail.com"
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-slate-100 p-3">
                <Mail className="h-5 w-5 text-slate-700"></Mail>
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">Email</h2>
                <p className="mt-1 text-sm text-slate-600">
                  kishorpandey981@gmail.com
                </p>
              </div>
            </div>
          </a>

          {/* Phone */}
          <a
            href="tel:+9779840042981"
            className="group rounded-xl border border-slate-200 bg-white p-6
                       shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-slate-100 p-3">
                <Phone className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">Phone</h2>
                <p className="mt-1 text-sm text-slate-600">+977 9840042981</p>
              </div>
            </div>
          </a>

          {/* Location */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-slate-100 p-3">
                <MapPin className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">Location</h2>
                <p className="mt-1 text-sm text-slate-600">Butwal, Nepal</p>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-slate-100 p-3">
                <MessageCircle className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">Available for</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Questions, feedback & collaboration
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 ">
          <h2 className="text-lg font-semibold text-slate-800">
            Connect With Me
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://github.com/Thekishor"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 px-4 py-2.5
                        text-sm font-medium text-slate-700
                        transition hover:-translate-y-0.5
                        hover:border-slate-900 hover:bg-slate-900 hover:text-white
                        hover:shadow-sm"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/kishor-pandey-209a9323b/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 px-4 py-2.5
                        text-sm font-medium text-slate-700
                        transition hover:-translate-y-0.5
                      hover:border-blue-600 hover:bg-blue-600 hover:text-white
                        hover:shadow-sm"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
