const About = () => {
  return (
    <section className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center text-3xl font-bold text-slate-800">
          About This Application
        </h1>

        <p className="mt-6 rounded-xl border px-6 py-5 leading-7 text-slate-600">
          This application is a user management system built to provide secure
          authentication and account management. Users can register, log in,
          verify their email, recover their password, and manage their profile.
          The application is designed to provide a simple, secure, and reliable
          experience for managing user accounts.
        </p>
      </div>
    </section>
  );
};

export default About;
