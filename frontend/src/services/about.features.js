import {
  ShieldCheck,
  MailCheck,
  KeyRound,
  UserRound,
  Users,
  ClipboardList,
  LockKeyhole,
  MonitorSmartphone,
  UserPlus,
  LogOut,
  RefreshCw,
  CloudUpload,
} from "lucide-react";

export const features = [
  {
    title: "User Registration",
    description:
      "Create new user accounts with validated personal information.",
    icon: UserPlus,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Secure Authentication",
    description:
      "Secure login and authentication using access and refresh tokens.",
    icon: ShieldCheck,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  {
    title: "Email Verification",
    description:
      "Verify user email addresses before activating accounts.",
    icon: MailCheck,
    color: "text-violet-600",
    bg: "bg-violet-100",
  },
  {
    title: "Password Recovery",
    description:
      "Secure forgot-password and password reset workflow.",
    icon: KeyRound,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    title: "Profile Management",
    description:
      "Users can update their profile information and profile image.",
    icon: UserRound,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    title: "Profile Image Upload",
    description:
      "Upload and manage profile images using cloud storage.",
    icon: CloudUpload,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },
  {
    title: "Session Management",
    description:
      "Track active user sessions and manage authenticated devices.",
    icon: MonitorSmartphone,
    color: "text-pink-600",
    bg: "bg-pink-100",
  },
  {
    title: "Logout Management",
    description:
      "Securely logout from the current session or all devices.",
    icon: LogOut,
    color: "text-red-600",
    bg: "bg-red-100",
  },
  {
    title: "Token Refresh",
    description:
      "Maintain authenticated sessions using secure token refresh.",
    icon: RefreshCw,
    color: "text-teal-600",
    bg: "bg-teal-100",
  },
  {
    title: "Admin User Management",
    description:
      "Administrators can view and manage registered users.",
    icon: Users,
    color: "text-fuchsia-600",
    bg: "bg-fuchsia-100",
  },
  {
    title: "Audit Log Tracking",
    description:
      "Record important authentication and account activities.",
    icon: ClipboardList,
    color: "text-sky-600",
    bg: "bg-sky-100",
  },
  {
    title: "Security Controls",
    description:
      "Rate limiting and account protection help prevent abuse.",
    icon: LockKeyhole,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
];