import { CheckCircle, Mail, UserRound, CalendarDays } from "lucide-react";
import { useAuth } from "../context/AppContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="mb-8">
        <p className="mb-1 text-sm font-medium text-blue-600">Dashboard</p>

        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Welcome, {user.fullName}
        </h1>

        <p className="mt-2 text-gray-500">
          Here is an overview of your account.
        </p>
      </header>

      {/* Stats */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Account Status */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-blue-50 p-2">
              <UserRound className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <p className="text-sm text-gray-500">Account Status</p>
          <p className="mt-1 text-xl font-semibold text-gray-800">
            {user.isAccountActive ? "Active" : "Inactive"}
          </p>
        </div>

        {/* Email */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-green-50 p-2">
              <Mail className="h-5 w-5 text-green-600" />
            </div>

            {user.isEmailVerified && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
          <p className="text-sm text-gray-500">Email Verification</p>
          <p className="mt-1 text-xl font-semibold text-gray-800">
            {user.isEmailVerified ? "Verified" : "Not Verified"}
          </p>
        </div>

        {/* Member Since */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="mb-4 rounded-lg bg-purple-50 p-2 w-fit">
            <CalendarDays className="h-5 w-5 text-purple-600" />
          </div>

          <p className="text-sm text-gray-500">Member Since</p>
          <p className="mt-1 text-xl font-semibold text-gray-800">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Account Information */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Account Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your basic account details.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="rounded-lg bg-slate-50 p-4 transition duration-200 hover:-translate-y-1 hover:shadow-sm">
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="mt-1 font-medium text-gray-800">{user.fullName}</p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 transition duration-200 hover:-translate-y-1 hover:shadow-sm">
            <p className="text-sm text-gray-500">Email</p>
            <p className="mt-1 break-all font-medium text-gray-800">
              {user.email}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 transition duration-200 hover:-translate-y-1 hover:shadow-sm">
            <p className="text-sm text-gray-500">Role</p>
            <p className="mt-1 font-medium text-gray-800">{user.role}</p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 transition duration-200 hover:-translate-y-1 hover:shadow-sm">
            <p className="text-sm text-gray-500">Last Update</p>
            <p className="mt-1 font-medium text-gray-800">
              {new Date(user.updatedAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
