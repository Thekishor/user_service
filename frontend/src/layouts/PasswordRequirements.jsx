import { Check, Circle } from "lucide-react";

const PasswordRequirements = ({ password }) => {
  const requirements = [
    {
      label: "8-20 characters",
      valid: password.length >= 8 && password.length <= 20,
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One number",
      valid: /\d/.test(password),
    },
    {
      label: "One special character (@$!%*?&#)",
      valid: /[@$!%*?&#]/.test(password),
    },
  ];

  return (
    <div className="rounded-lg bg-slate-50 px-4 py-2 text-sm">
      <p className="mb-2 font-medium text-slate-700">Password must:</p>

      <ul className="space-y-1.5">
        {requirements.map((requirement) => (
          <li
            key={requirement.label}
            className={`flex items-center gap-2 ${
              requirement.valid ? "text-green-600" : "text-slate-500"
            }`}
          >
            {requirement.valid ? (
              <Check className="h-4 w-4" />
            ) : (
              <Circle className="h-3.5 w-3.5" />
            )}

            {requirement.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;
