const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center gap-3 bg-slate-100">
      <div className="h-5 w-5 animate-spin rounded-full border-3 border-slate-300 border-t-slate-600" />
      <span className="text-slate-600">Loading...</span>
    </div>
  );
};

export default Loading;
