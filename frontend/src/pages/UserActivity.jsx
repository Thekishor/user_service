import { useEffect, useState } from "react";
import { getUserAuditLogs } from "../services/authService";
import { toast } from "sonner";
import Loading from "../components/Loading";
import { useAuth } from "../context/AppContext";
import { Activity, Clock, Inbox } from "lucide-react";

const UserActivity = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await getUserAuditLogs();
        setLogs(response.data.auditLogs);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Helper for clean, color-coded action badges
  const getActionBadgeStyle = (action = "") => {
    const act = action.toLowerCase();
    if (act.includes("login") || act.includes("verify") || act.includes("register")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (act.includes("password") || act.includes("profile") || act.includes("update")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (act.includes("logout")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (act.includes("delete")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 shadow-xs">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              User Activity
            </h1>
            <p className="text-sm text-gray-500">
              Review your recent account events and security log history
            </p>
          </div>
        </div>

        {/* Activity counter pill */}
        <div className="flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-xs sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-blue-600"></span>
          <span>
            {logs?.length || 0} {logs?.length === 1 ? "Event" : "Events"} recorded
          </span>
        </div>
      </div>

      {/* User Profile Overview Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white shadow-xs">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-900">{user?.fullName}</p>
            <p className="truncate text-sm text-gray-500">{user?.email}</p>
          </div>

          <div className="hidden sm:block">
            <span className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 capitalize">
              Role: {user?.role || "User"}
            </span>
          </div>
        </div>
      </div>

      {/* Activity Logs Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Audit Logs</h2>
          <p className="text-xs text-gray-500">
            A chronological timeline of interactions performed on your account
          </p>
        </div>

        {/* Empty State */}
        {logs?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-800">
              No activity logs found
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Your actions and security events will automatically appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="divide-y divide-gray-100 p-4 space-y-3 md:hidden">
              {logs?.map((log) => (
                <div
                  key={log._id}
                  className="rounded-lg border border-gray-100 bg-gray-50/60 p-4 transition hover:bg-gray-50"
                >
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getActionBadgeStyle(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>

                    <span className="text-xs font-medium text-gray-500">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mb-2 text-xs text-gray-600">
                    <span className="font-medium text-gray-500">Resource: </span>
                    <span className="rounded bg-gray-200/70 px-1.5 py-0.5 font-mono text-gray-800">
                      {log.resource}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Clean Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50/75">
                  <tr>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Resource
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Date & Time
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {logs?.map((log) => (
                    <tr
                      key={log._id}
                      className="transition-colors hover:bg-gray-50/80"
                    >
                      {/* Action Column */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${getActionBadgeStyle(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Resource Column */}
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-700">
                          {log.resource}
                        </span>
                      </td>

                      {/* Date & Time Column */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">
                          {new Date(log.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(log.createdAt).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserActivity;
