import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputField } from "../components/InputField";
import AuthLayout from "../layouts/AuthLayout";
import { toast } from "sonner";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { resetPassword } from "../services/authService";
import { resetPasswordSchema } from "../schema/resetPasswordSchema";
import { handleApiError } from "../utils/handleApiError";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setErrorResponse("");
    if (!token) {
      toast.error("Invalid or expired password reset link.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword(token, data);

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      const errors = handleApiError(error, setError);
      setErrorResponse(errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-bold text-2xl text-center text-slate-600 mb-5">
        Reset Password
      </h1>
      {errorResponse && (
        <div className="mb-5 rounded-md bg-red-50 px-4 py-2.5 text-center text-sm text-red-700">
          {errorResponse}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="New Password"
          name="newPassword"
          register={register}
          type="password"
          placeholder="New Password"
          autoComplete="new-password"
          errors={errors}
        />
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          register={register}
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          errors={errors}
        />
        <button
          disabled={isLoading}
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 
          py-3 rounded-lg w-full transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin w-6 h-6" />
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Remember your password?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPassword;
