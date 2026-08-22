const About = () => {
  return (
    <section className="px-8 py-16 text-center">
      <h1 className="mt-10 text-2xl font-bold sm:text-3xl">
        About This Application
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-slate-500">
        This application is a user management system built to provide secure
        authentication and account management.
      </p>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500">
        It includes features such as user registration, login, email
        verification, password recovery, profile management, and secure session
        handling.
      </p>
      <p className="font-semibold mt-6 text-slate-700">
        Built with: React • Tailwind CSS • Node.js • Express • MongoDB
      </p>
    </section>
  );
};

export default About;
