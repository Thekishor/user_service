import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import AuthLayout from "../layouts/AuthLayout";

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
      <div className="py-8 text-center">
        {/* verifying email */}
        {status === "verifying" && (
          <>
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <h1 className="text-2xl font-bold text-slate-700">
              Verifying your email...
            </h1>
          </>
        )}

        {/* verifying success */}
        {status === "success" && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-slate-700">
              Email Verified!
            </h1>
            <p className="mt-2 text-sm text-slate-500">{message}</p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Go to Login →
            </button>
          </>
        )}

        {/* verifying error */}
        {status === "error" && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
              ✕
            </div>
            <h1 className="text-2xl font-bold text-slate-700">
              Verification Failed
            </h1>
            <p className="mt-2 text-sm text-slate-500">{message}</p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700"
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
