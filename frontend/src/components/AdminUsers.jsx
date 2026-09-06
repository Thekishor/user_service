import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../components/Loading";
import { getAllUsers } from "../services/authService";

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
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
      <div className="mt-8 w-full overflow-x-auto rounded-lg bg-white shadow-md"></div>
    </main>
  );
};

export default AdminUsers;
