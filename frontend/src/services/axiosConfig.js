import axios from "axios";

const axiosConfig = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Accept": "application/json",
    },
    withCredentials: true
});

export const API_ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH_TOKEN: "/auth/refresh-token",
    VERIFY_EMAIL: "/auth/verify-email",
    LOGOUT: "/auth/logout",
    LOGOUT_ALL: "/auth/logout-all",
    CHANGE_PASSWORD: "/auth/change-password",
    RESET_PASSWORD: "/auth/reset-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    AUDIT_LOGS: "/auth/audit-logs",
    PROFILE: "/auth/profile",
    GET_ALL_USERS: "/admin/users",
    DELETE_USER: "/admin/users"
}

export default axiosConfig;