import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "../components/InputField";
import AuthLayout from "../layouts/AuthLayout";
import { forgotPasswordSchema } from "../schema/forgotPasswordSchema";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { forgotPassword } from "../services/authService";
import { handleApiError } from "../utils/handleApiError";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setErrorResponse("");
    setIsLoading(true);

    try {
      const response = await forgotPassword(data);

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
      <h1 className="font-bold text-2xl text-center text-slate-600 mb-4">
        Forgot Password
      </h1>
      <p className="mb-6 text-center text-sm text-slate-600">
        Enter your email to receive a password reset link.
      </p>
      {errorResponse && (
        <div className="mb-5 rounded-md bg-red-50 px-4 py-2.5 text-center text-sm text-red-600">
          {errorResponse}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="Email"
          name="email"
          register={register}
          type="email"
          placeholder="Email address"
          errors={errors}
        />
        <button
          disabled={isLoading}
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 
          py-3 rounded-lg w-full transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin w-6 h-6" />
          ) : (
            "Send Reset Link"
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

export default ForgotPassword;
