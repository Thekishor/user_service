import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../schema/changePasswordSchema";
import { InputField } from "../components/InputField";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { changePassword } from "../services/authService";
import { handleApiError } from "../utils/handleApiError";
import PasswordRequirements from "../layouts/PasswordRequirements";

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = useWatch({
    control,
    name: "newPassword",
    defaultValue: "",
  });

  const onSubmit = async (data) => {
    setErrorResponse("");
    setIsLoading(true);

    try {
      const response = await changePassword(data);

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
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Change Password</h1>

          <p className="mt-1 text-sm text-slate-500">
            Keep your account secure by using a strong password.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {errorResponse && (
            <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
              {errorResponse}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset
              disabled={isLoading}
              className="space-y-4 disabled:opacity-70"
            >
              <InputField
                label="Old Password"
                name="oldPassword"
                register={register}
                type="password"
                placeholder="Old Password"
                autoComplete="current-password"
                errors={errors}
              />
              <InputField
                label="New Password"
                name="newPassword"
                register={register}
                type="password"
                placeholder="New Password"
                autoComplete="new-password"
                errors={""}
              />

              <PasswordRequirements password={newPassword} />

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
                className="mt-2 flex w-full items-center justify-center gap-2 bg-blue-600 
                           shadow-sm hover:shadow-md text-white font-semibold hover:bg-blue-700 
                           py-3 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-70 sm:w-50 sm:px-6"
              >
                {isLoading ? (
                  <LoaderCircle className="animate-spin w-6 h-6" />
                ) : (
                  "Update Password"
                )}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;
