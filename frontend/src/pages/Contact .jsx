const Contact = () => {
  return (
    <section className="min-h-screen bg-slate-100 px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center text-3xl font-bold text-slate-800">
          Contact Us
        </h1>

        <p className="mt-3 text-center text-slate-600">
          Have a question or need help? Feel free to get in touch with us.
        </p>

        <div className="mt-10 rounded-xl border bg-white p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-500">Email</h2>
              <p className="mt-1 text-slate-800">kishorpandey981@gmail.com</p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-500">Phone</h2>
              <p className="mt-1 text-slate-800">+977-9840042981</p>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-500">Location</h2>
              <p className="mt-1 text-slate-800">Butwal, Nepal</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
