function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-slate-100 flex justify-center items-center px-4 py-6 sm:py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md sm:p-8">
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;
