import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { InputField } from "../components/InputField";
import { loginSchema } from "../schema/loginSchema";
import AuthLayout from "../layouts/AuthLayout";
import { toast } from "sonner";
import { useAuth } from "../context/AppContext";
import { loginUser } from "../services/authService";
import { LoaderCircle } from "lucide-react";
import { setToken } from "../services/token.manager";
import { handleApiError } from "../utils/handleApiError";

const Login = () => {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setErrorResponse("");
    setIsLoading(true);
    try {
      const response = await loginUser(data);
      const token = response.data.token;

      setUser(response.data.user);

      //call token manager class
      setToken(token);

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate(
          response.data.user.role === "admin"
            ? "/admin/dashboard"
            : "/dashboard",
        );
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
      <h1 className="mb-2 text-center text-2xl font-bold text-slate-800">
        Welcome Back
      </h1>

      <p className="mb-6 text-center text-sm text-slate-500">
        Sign in to your account to continue.
      </p>

      {errorResponse && (
        <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {errorResponse}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          disabled={isLoading}
          className="space-y-4 disabled:opacity-70"
        >
          <InputField
            label="Username"
            name="identifier"
            register={register}
            type="text"
            placeholder="Email or phone number"
            autoComplete="username"
            errors={errors}
          />
          <InputField
            label="Password"
            name="password"
            register={register}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            errors={errors}
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span>Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white 
                       font-semibold hover:bg-blue-700 py-3 rounded-lg w-full transition duration-200 
                       hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin w-6 h-6" />
            ) : (
              "Login"
            )}
          </button>
        </fieldset>
      </form>

      <div className="mt-2 border-t border-slate-100 pt-5">
        <p className="text-center text-sm text-slate-500">
          Don't have an account?
          <Link
            to="/register"
            className="font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
