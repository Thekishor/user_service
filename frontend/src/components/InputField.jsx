import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div>
      <label className="block text-slate-700 text-sm font-medium mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
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

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2
          text-slate-400 hover:text-slate-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {fieldError && (
        <p className="text-sm text-red-500 font-normal mt-1">
          {fieldError.message}
        </p>
      )}
    </div>
  );
}
