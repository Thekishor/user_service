import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../components/Loading";
import { getAllUsers, deleteUser } from "../services/authService";

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const [usersData, setUsersData] = useState({
    users: [],
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    unverifiedUsers: 0,
  });

  useEffect(() => {
    const allUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsersData(response.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    allUsers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);

      setUsersData((prev) => ({
        ...prev,
        users: prev.users.filter((user) => user.id !== userId),
        totalUsers: prev.totalUsers - 1,
      }));

      setSelectedUser(null);

      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        User Information
      </h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <p className="text-sm font-medium text-slate-500">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {Math.max(usersData.totalUsers, 0)}
          </p>
        </div>
        {/* Active Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <p className="text-sm font-medium text-slate-500">Active Users</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {Math.max(usersData.activeUsers, 0)}
          </p>
        </div>
        {/* Inactive Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <p className="text-sm font-medium text-slate-500">Inactive Users</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {Math.max(usersData.inactiveUsers, 0)}
          </p>
        </div>
        {/* Unverified Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <p className="text-sm font-medium text-slate-500">Unverified Users</p>
          <p className="mt-2 text-3xl font-bold text-orange-500">
            {Math.max(usersData.unverifiedUsers, 0)}
          </p>
        </div>
      </div>

      {/* Users table */}
      <div className="mt-8 w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                User
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Email Verified
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Joined
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {usersData.users?.map((user) => (
              <tr
                key={user.id}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                  {user.fullName}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {user.phone}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${user.isAccountActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {user.isAccountActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${user.isEmailVerified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                  >
                    {user.isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(user.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white font-medium hover:bg-red-600 hover:shadow-md active:scale-95"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* DELETE CONFIRMATION MODAL */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-slate-900">Delete User</h2>
              <p className="mt-3 text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900">
                  {selectedUser?.fullName}
                </span>{" "}
                ?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDeleteUser(selectedUser?.id)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 hover:shadow-md active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminUsers;
