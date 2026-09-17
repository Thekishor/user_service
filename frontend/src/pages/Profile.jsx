import { useAuth } from "../context/AppContext";
import { useState } from "react";
import { InputField } from "../components/InputField";
import { useForm } from "react-hook-form";
import { User, LoaderCircle, Camera } from "lucide-react";
import { profileUpdate } from "../services/authService";
import { handleApiError } from "../utils/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../schema/changedProfile.schema";
import { toast } from "sonner";

const Profile = () => {
  const [fileName, setFileName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const { user, setUser } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: user?.fullName || "",
      image: "",
    },
  });

  const onSubmit = async (data) => {
    setErrorResponse("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      const response = await profileUpdate(formData);
      setUser(response.data.user);
      toast.success(response.data.message);
      setIsEditing(false);
      setFileName("");
    } catch (error) {
      const errors = handleApiError(error, setError);
      setErrorResponse(errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and account details.
        </p>
      </div>

      {isEditing ? (
        /* Edit Profile Card */
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Edit Profile
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your photo and personal information.
            </p>
          </div>

          {/* Error message */}
          {errorResponse && (
            <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
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

            {/* Profile image upload */}
            <div>
              <label
                htmlFor="profile"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Profile Photo
              </label>

              <div className="flex items-center gap-4">
                {/* Photo Preview / Fallback */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 overflow-hidden text-slate-400">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Profile Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-slate-400" />
                  )}
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    <Camera className="h-4 w-4 text-slate-500" />
                    <span>Upload photo</span>
                  </label>
                  <input
                    id="image"
                    type="file"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    {...register("image", {
                      onChange: (e) => {
                        setFileName(e.target.files?.[0]?.name || "");
                      },
                    })}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {fileName ? (
                      <span className="font-medium text-blue-600">
                        {fileName}
                      </span>
                    ) : (
                      "JPG, PNG or WEBP"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Form action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                disabled={isLoading}
                type="submit"
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFileName("");
                }}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* View Profile Card */
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Profile Photo & Name Banner */}
          <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-100 text-blue-600 overflow-hidden font-semibold text-xl">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.fullName?.charAt(0)?.toUpperCase() || (
                  <User className="h-8 w-8 text-blue-500" />
                )
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user?.fullName}
              </h2>
              <span className="mt-1 inline-block rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 uppercase tracking-wide">
                {user?.role}
              </span>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Full Name
              </p>
              <p className="mt-1 font-medium text-gray-800">{user?.fullName}</p>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </p>
              <p className="mt-1 font-medium text-gray-800 break-all">
                {user?.email}
              </p>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Phone
              </p>
              <p className="mt-1 font-medium text-gray-800">
                {user?.phone || "Not provided"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Account Status
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    user?.isAccountActive ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <p className="font-medium text-gray-800">
                  {user?.isAccountActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-6 pt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
