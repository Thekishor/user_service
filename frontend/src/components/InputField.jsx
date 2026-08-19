export function InputField({
  label,
  name,
  register,
  type,
  placeholder,
  autoComplete,
  errors,
}) {
  const fieldError = errors[name];

  return (
    <div>
      <label className="block text-slate-700 text-sm font-medium mb-1.5">
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2.5
               text-slate-800 outline-none
               placeholder:text-slate-400
               focus:ring-2 ${
                 fieldError
                   ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                   : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
               }`}
      />
      {fieldError && (
        <p className="text-sm text-red-500 font-normal mt-1">
          {fieldError.message}
        </p>
      )}
    </div>
  );
}
