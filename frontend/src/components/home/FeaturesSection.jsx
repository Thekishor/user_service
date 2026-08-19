const FeaturesSection = () => {
  return (
    <section className="px-6 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-slate-600">
          Everything You Need
        </h2>
        <p className="mt-5 text-lg text-slate-600">
          Simple tools to manage your account securely.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg border bg-slate-50 p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Secure Authentication</h1>
          <p className="mt-3 text-slate-600">
            Register, login and recover your account.
          </p>
        </div>
        <div className="rounded-lg border bg-slate-50 p-6 shadow-sm">
          <h1 className="text-xl font-semibold"> Profile Management</h1>
          <p className="mt-3 text-slate-600">
            View and update your profile information easily.
          </p>
        </div>
        <div className="rounded-lg border bg-slate-50 p-6 shadow-sm">
          <h1 className="text-xl font-semibold"> Secure Sessions</h1>
          <p className="mt-3 text-slate-600">
            Keep your account protected with secure sessions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
