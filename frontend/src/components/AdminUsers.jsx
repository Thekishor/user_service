import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../components/Loading";
import { getAllUsers, deleteUser } from "../services/authService";

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("-1");

  const [usersData, setUsersData] = useState({
    users: [],
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    unverifiedUsers: 0,
  });

  // Calculate number of pages
  const totalPages = Math.ceil(usersData.totalUsers / limit);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const allUsers = async () => {
      try {
        const response = await getAllUsers({
          page,
          limit,
          search: debouncedSearch,
          sortBy,
          sortOrder,
        });

        setUsersData(response.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    void allUsers();
  }, [page, limit, debouncedSearch, sortBy, sortOrder]);

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
      <h1 className="mb-6 text-2xl font-bold text-slate-900 transition duration-150 group-hover:text-slate-900">
        User Information
      </h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <p className="text-sm font-medium text-slate-500">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {Math.max(usersData.totalUsers ?? 0, 0)}
          </p>
        </div>
        {/* Active Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <p className="text-sm font-medium text-slate-500">Active Users</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {Math.max(usersData.activeUsers ?? 0, 0)}
          </p>
        </div>
        {/* Inactive Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <p className="text-sm font-medium text-slate-500">Inactive Users</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {Math.max(usersData.inactiveUsers ?? 0, 0)}
          </p>
        </div>
        {/* Unverified Users */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <p className="text-sm font-medium text-slate-500">Unverified Users</p>
          <p className="mt-2 text-3xl font-bold text-orange-500">
            {Math.max(usersData.unverifiedUsers ?? 0, 0)}
          </p>
        </div>
      </div>

      {/* Users table */}
      <div className="mt-8 w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="w-full sm:max-w-sm">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Sorting */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            >
              <option value="createdAt">Created Date</option>
              <option value="fullName">Name</option>
              <option value="email">Email</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            >
              <option value="-1">Descending</option>
              <option value="1">Ascending</option>
            </select>
          </div>
        </div>

        {/* Table */}
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

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Showing information */}
          <p className="text-sm text-slate-500">
            Showing {usersData.totalUsers === 0 ? 0 : (page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, usersData.totalUsers)} of{" "}
            {usersData.totalUsers} users
          </p>

          {/* Page controls */}
          <div className="flex items-center gap-1">
            {/* Previous */}
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                    page === pageNumber
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next */}
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

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
    </main>
  );
};

export default AdminUsers;
