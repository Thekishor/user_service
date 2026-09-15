import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import AuthLayout from "../layouts/AuthLayout";
import { Check, X } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const response = await verifyEmail(token);

        setStatus("success");
        setMessage(response.data.message);
      } catch (error) {
        setStatus("error");

        if (error.response) {
          setMessage(
            error.response.data?.message || "Email verification failed.",
          );
        } else {
          setMessage("Something went wrong. Please try again.");
        }
      }
    };

    verify();
  }, [token]);

  return (
    <AuthLayout>
      <div className="py-6 text-center">
        {/* verifying email */}
        {status === "verifying" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-100 border-t-blue-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-800">
              Verifying your email...
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we confirm your email address.
            </p>
          </>
        )}

        {/* verifying success */}
        {status === "success" && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
              <Check size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Email Verified!
            </h1>
            <p className="mt-2 text-sm text-slate-500">{message}</p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.99]"
            >
              Go to Login
            </button>
          </>
        )}

        {/* verifying error */}
        {status === "error" && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
              <X size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Verification Failed
            </h1>
            <p className="mt-2 text-sm text-slate-500">{message}</p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.99]"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
