import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "../components/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schema/registerSchema";
import AuthLayout from "../layouts/AuthLayout";
import { registerUser } from "../services/authService";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { handleApiError } from "../utils/handleApiError";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setErrorResponse("");
    setIsLoading(true);

    try {
      const response = await registerUser(data);
      toast.success(response.data.message);
      navigate("/login");
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
        Register
      </h1>
      {errorResponse && (
        <div className="mb-5 rounded-md bg-red-50 px-4 py-2.5 text-center text-sm text-red-600">
          {errorResponse}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="Full Name"
          name="fullName"
          register={register}
          type="text"
          placeholder="Full name"
          autoComplete="name"
          errors={errors}
        />
        <InputField
          label="Email"
          name="email"
          register={register}
          type="email"
          placeholder="Email address"
          autoComplete="email"
          errors={errors}
        />
        <InputField
          label="Mobile"
          name="phone"
          register={register}
          type="tel"
          placeholder="Mobile number"
          autoComplete="tel"
          errors={errors}
        />
        <InputField
          label="Password"
          name="password"
          register={register}
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          errors={errors}
        />
        <button
          disabled={isLoading}
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin w-5 h-5" />
              <span>Signing Up...</span>
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600 mt-6">
        Already have an account?{" "}
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

export default Register;
