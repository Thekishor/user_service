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

      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="bg-slate-100 p-6">
      <h1 className="mb-6 text-2xl font-bold">User Information</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* cards */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="mt-1 text-2xl font-bold">{usersData.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-slate-500">Active Users</p>
          <p className="mt-1 text-2xl font-bold">{usersData.activeUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-slate-500">Inactive Users</p>
          <p className="mt-1 text-2xl font-bold">{usersData.inactiveUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-sm text-slate-500">Unverified Users</p>
          <p className="mt-1 text-2xl font-bold">{usersData.unverifiedUsers}</p>
        </div>
      </div>

      {/* Users table */}
      <div className="mt-8 w-full overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                User
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Email Verified
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Joined
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {usersData.users?.map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-100 hover:bg-slate-50"
              >
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.fullName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.phone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.isAccountActive ? "Active" : "Inactive"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.isEmailVerified ? "Verified" : "Unverified"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(user.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="rounded-md bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
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
                  className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDeleteUser(selectedUser?.id)}
                  className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
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
