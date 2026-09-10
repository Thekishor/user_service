const About = () => {
  return (
    <section className="min-h-screen bg-slate-100 px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center text-3xl font-bold text-slate-800">
          About This Application
        </h1>

        <p className="mt-3 text-center text-slate-600">
          Learn more about our user management and authentication system.
        </p>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="leading-7 text-slate-600">
            This application is a user management system built to provide secure
            authentication and account management. Users can register, log in,
            verify their email, recover their password, and manage their profile.
          </p>

          <p className="mt-4 leading-7 text-slate-600">
            The application is designed to provide a simple, secure, and reliable
            experience for managing user accounts.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
