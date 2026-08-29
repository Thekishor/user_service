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
        navigate("/dashboard");
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
        Login
      </h1>
      {errorResponse && (
        <div className="mb-5 rounded-md bg-red-50 px-4 py-2.5 text-center text-sm text-red-700">
          {errorResponse}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("rememberMe")} />
            <span>Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </div>
        <button
          disabled={isLoading}
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold 
          hover:bg-blue-700 py-3 rounded-lg w-full transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin w-5 h-5" />
              <span>Logging in...</span>
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600 mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
