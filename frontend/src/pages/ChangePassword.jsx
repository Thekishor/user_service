import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../schema/changePasswordSchema";
import { InputField } from "../components/InputField";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { changePassword } from "../services/authService";
import { handleApiError } from "../utils/handleApiError";

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
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

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await changePassword(data);

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-slate-100 flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="font-bold text-2xl text-center text-slate-600 mb-6">
          Change Password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ChangePassword;
