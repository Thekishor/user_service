const FeaturesSection = () => {
  return (
    <section className="px-6 py-10">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-slate-600">
          Everything You Need
        </h2>
        <p className="mt-5 text-lg text-slate-600">
          Simple tools to manage your account securely.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg border bg-slate-50 p-6 shadow-sm hover:bg-slate-100">
          <h1 className="text-xl font-semibold">Secure Authentication</h1>
          <p className="mt-3 text-slate-600">
            Register, login, verify your email, and securely recover your
            account.
          </p>
        </div>

        <div className="rounded-lg border bg-slate-50 p-6 shadow-sm hover:bg-slate-100">
          <h1 className="text-xl font-semibold">Profile Management</h1>
          <p className="mt-3 text-slate-600">
            View and update your personal profile information easily.
          </p>
        </div>

        <div className="rounded-lg border bg-slate-50 p-6 shadow-sm hover:bg-slate-100">
          <h1 className="text-xl font-semibold">Secure Sessions</h1>
          <p className="mt-3 text-slate-600">
            Stay securely signed in with protected access and refresh sessions.
          </p>
        </div>

        <div className="rounded-lg border bg-slate-50 p-6 shadow-sm hover:bg-slate-100">
          <h1 className="text-xl font-semibold">Email Verification</h1>
          <p className="mt-3 text-slate-600">
            Verify your email address to help keep your account secure.
          </p>
        </div>

        <div className="rounded-lg border bg-slate-50 p-6 shadow-sm hover:bg-slate-100">
          <h1 className="text-xl font-semibold">Password Recovery</h1>
          <p className="mt-3 text-slate-600">
            Reset your password securely when you forget your credentials.
          </p>
        </div>

        <div className="rounded-lg border bg-slate-50 p-6 shadow-sm hover:bg-slate-100">
          <h1 className="text-xl font-semibold">Account Security</h1>
          <p className="mt-3 text-slate-600">
            Protect user accounts with secure authentication and session
            controls.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
