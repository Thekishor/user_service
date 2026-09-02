import { useAuth } from "../context/AppContext";
import { useState } from "react";
import { InputField } from "../components/InputField";
import { useForm } from "react-hook-form";
import { CircleUser, LoaderCircle } from "lucide-react";
import { profileUpdate } from "../services/authService";
import { handleApiError } from "../utils/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../schema/changedProfile.schema";
import { toast } from "sonner";

const Profile = () => {
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
      fullName: user.fullName,
      image: undefined,
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
    } catch (error) {
      const errors = handleApiError(error, setError);
      setErrorResponse(errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Profile</h1>

      {isEditing ? (
        <main className="p-6">
          <div className="max-w-2xl rounded-lg border bg-white p-6">
            <h2 className="mb-6 text-xl font-semibold">Edit Profile</h2>
            {/* Error message */}
            {errorResponse && (
              <div className="mb-5 rounded-md bg-red-50 px-4 py-2.5 text-center text-sm text-red-700">
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

              {/* Profile image */}
              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-medium"
                >
                  Profile Photo
                </label>
                <input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/*"
                  {...register("image")}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="flex w-32 items-center justify-center rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <LoaderCircle className="animate-spin w-6 h-6" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-md border px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      ) : (
        <div className="max-w-2xl rounded-lg border bg-white p-6">
          {/* Profile Photo */}
          <div className="mb-6 flex items-center gap-4">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <CircleUser className="h-15 w-15 text-gray-600" />
            )}

            <div>
              <h2 className="text-lg font-medium">{user.fullName}</h2>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-gray-800">{user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-800">{user.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <p className="text-gray-800">
                {user.isAccountActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 rounded-md bg-black px-4 py-2 text-white"
          >
            Edit Profile
          </button>
        </div>
      )}
    </main>
  );
};

export default Profile;
