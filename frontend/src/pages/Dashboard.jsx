import { useAuth } from "../context/AppContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <main className="p-8">
      <header>
        <h1 className="mb-2 text-2xl font-semibold text-gray-800">
          Welcome, {user.fullName}
        </h1>
        <p className="mb-6 text-gray-500">Here is your account Information.</p>
      </header>

      <section className="max-w-xl rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-800">
          Account Information
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email Verified</p>
            <p className="text-gray-800">{String(user.isEmailVerified)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Active</p>
            <p className="text-gray-800">{String(user.isAccountActive)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-gray-800">{user.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">createdAt</p>
            <p className="text-gray-800">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
