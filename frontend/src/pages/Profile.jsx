import { useAuth } from "../context/AppContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Profile</h1>

      <div className="max-w-2xl rounded-lg border bg-white p-6">
        {/* Profile Photo */}
        <div className="mb-6 flex items-center gap-4">
          <img
            src={user.imageUrl}
            alt=""
            className="h-20 w-20 rounded-full object-cover"
          />

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

        <button className="mt-6 rounded-md bg-black px-4 py-2 text-white">
          Edit Profile
        </button>
      </div>
    </main>
  );
};

export default Profile;
