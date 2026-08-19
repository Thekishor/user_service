function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-slate-100 flex justify-center items-center py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;
